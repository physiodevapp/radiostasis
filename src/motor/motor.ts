import type {
  Escala,
  Estado,
  Flecha,
  Modelo,
  Momento,
  Nodo,
  ParametrosMotor,
  Relacion,
  RelacionSuma,
  Variantes,
} from './tipos';

const ORDEN_ESCALA: Record<Escala, number> = { minutos: 0, dias: 1, estable: 2 };

/** Umbrales de las flechas (modelo v2.1). */
export const UMBRAL_IGUAL = 0.15;
export const UMBRAL_DOBLE = 0.5;

export function flecha(v: number): Flecha {
  const a = Math.abs(v);
  if (a < UMBRAL_IGUAL) return '=';
  if (a < UMBRAL_DOBLE) return v > 0 ? '↑' : '↓';
  return v > 0 ? '↑↑' : '↓↓';
}

/** ¿Actúa la relación en esta escala de tiempo? */
export function relacionActiva(r: Relacion, escala: Escala): boolean {
  if (r.tipo !== 'suma') return true;
  const e = ORDEN_ESCALA[escala];
  if (ORDEN_ESCALA[r.tiempo] > e) return false;
  if (r.hasta && e > ORDEN_ESCALA[r.hasta]) return false;
  return true;
}

/**
 * Origen tal como lo ve una relación bloqueada `b` (0–1) por un fármaco.
 * `basal`: si el origen tiene tono normal (mecanismos) se corta también ese
 * tono, (1 + x)(1 − b) − 1; si es una causa, solo la desviación, x (1 − b).
 */
export function origenBloqueado(x: number, b: number, basal: boolean): number {
  if (b <= 0) return x;
  return basal ? (1 + x) * (1 - b) - 1 : x * (1 - b);
}

/** Entrada efectiva de una relación de suma a partir del valor del origen. */
export function entradaEfectiva(r: RelacionSuma, x: number): number {
  let u = x;
  if (r.umbral !== undefined) {
    if (r.umbral < 0) u = x < r.umbral ? x - r.umbral : 0;
    else u = x > r.umbral ? x - r.umbral : 0;
  }
  if (u === 0) return 0;
  const peso = u < 0 && r.intensidadNegativa !== undefined ? r.intensidadNegativa : r.intensidad;
  return (r.signo === '+' ? 1 : -1) * peso * u;
}

/** Variante elegida de un nodo: la de `variantes` si existe; si no, la primera. */
export function varianteDe(modelo: Modelo, nodo: string, variantes: Variantes = {}): string | undefined {
  const lista = modelo.nodos.find((n) => n.id === nodo)?.variantes;
  if (!lista?.length) return undefined;
  const v = variantes[nodo];
  return lista.some((x) => x.id === v) ? v : lista[0].id;
}

/**
 * Fase 7: el modelo con las variantes elegidas. Quita las relaciones que no
 * actúan en esa variante y pone el peso propio de las que lo cambian. Las
 * relaciones que quedan ya no llevan `variante`, así que aplicarla dos veces da
 * lo mismo. La vista (fichas, aportes) usa este modelo para enseñar las
 * relaciones que actúan de verdad.
 */
export function aplicarVariantes(modelo: Modelo, variantes: Variantes = {}): Modelo {
  if (!modelo.relaciones.some((r) => r.variante)) return modelo;
  const relaciones: Relacion[] = [];
  for (const r of modelo.relaciones) {
    if (!r.variante) {
      relaciones.push(r);
      continue;
    }
    const v = varianteDe(modelo, r.variante.nodo, variantes);
    if (v === undefined) throw new Error(`Relación ${r.n}: el nodo «${r.variante.nodo}» no tiene variantes`);
    if (r.variante.solo && !r.variante.solo.includes(v)) continue;
    const { variante, ...resto } = r;
    const peso = variante.intensidad?.[v];
    if (peso !== undefined) {
      if (resto.tipo !== 'suma') throw new Error(`Relación ${r.n}: solo una relación de suma cambia de peso`);
      relaciones.push({ ...resto, intensidad: peso });
    } else relaciones.push(resto as Relacion);
  }
  return { ...modelo, relaciones };
}

const clamp = (v: number, [min, max]: [number, number]) => Math.min(max, Math.max(min, v));

export interface Resultado {
  valores: Estado;
  iteraciones: number;
  convergido: boolean;
  /**
   * Fase 5, solo con una sesión de ejercicio («durante» o «despues»): el mismo
   * paciente en reposo, en estado estable («antes»), del que parte la sesión.
   */
  base?: Estado;
}

export interface OpcionesSimulacion {
  /** Sustituye parámetros del motor (para pruebas y calibración). */
  parametros?: Partial<ParametrosMotor>;
  /**
   * Fase 5: momento de una sesión de ejercicio. Con «durante» o «despues» la
   * escala no cuenta: se calcula el estado estable del paciente sin la sesión y,
   * encima, la respuesta de minutos (ver `simular`).
   */
  momento?: Momento;
  /** Fase 7: variantes de las causas (las que faltan, la primera). */
  variantes?: Variantes;
}

/** Ids de los nodos de la sesión: origen de alguna relación con `momento`. */
export function nodosSesion(modelo: Modelo): Set<string> {
  return new Set(modelo.relaciones.filter((r) => r.momento).map((r) => r.origen));
}

/**
 * Cómo actúa una relación de suma sobre la sesión de ejercicio:
 * - `normal`: con el valor actual de su origen (relaciones de minutos);
 * - `congelada`: con el valor de reposo de su origen (relaciones de días o de
 *   estado estable: no les da tiempo a cambiar en una sesión);
 * - `desviacion`: sobre el cambio respecto al reposo (relaciones que se
 *   reajustan, como el barorreflejo: en la hipertensión mantenida su punto de
 *   ajuste es la presión del paciente, no la normal).
 */
type ModoSesion = 'normal' | 'congelada' | 'desviacion';

/** Estructura precompilada de un modelo para una escala: evita recalcular en cada iteración. */
interface Compilado {
  nodos: Nodo[];
  entradas: Map<string, RelacionSuma[]>;
  fijas: Map<string, string[]>;
  /** Factor de modulación por número de relación: id del nodo que la modula. */
  moduladores: Map<number, { origen: string; k: number }[]>;
  /** Bloqueos por número de relación: fármaco y fracción con la dosis plena. */
  bloqueos: Map<number, Bloqueo[]>;
  /** Relaciones cuyo origen tiene tono normal (no es una causa). */
  basal: Set<number>;
  /** Solo en una sesión de ejercicio: cómo actúa cada relación (las que faltan, `normal`). */
  modo: Map<number, ModoSesion>;
}

interface Bloqueo {
  farmaco: string;
  maximo: number;
  soloExceso?: boolean;
}

/** Fracción bloqueada de la relación `n` con las dosis de `x` (0 si ninguna). */
function fraccionBloqueada(lista: Bloqueo[] | undefined, x: Estado, soloExceso = false): number {
  if (!lista) return 0;
  let b = 0;
  for (const { farmaco, maximo, soloExceso: s } of lista) if (!!s === soloExceso) b += Math.max(0, x[farmaco] ?? 0) * maximo;
  return Math.min(1, b);
}

/** Origen visto por la relación `n` con sus bloqueos: primero los normales y después los de «solo exceso». */
function origenVisto(lista: Bloqueo[] | undefined, origen: number, dosis: Estado, basal: boolean): number {
  const v = origenBloqueado(origen, fraccionBloqueada(lista, dosis), basal);
  const e = fraccionBloqueada(lista, dosis, true);
  return v > 0 && e > 0 ? v * (1 - e) : v;
}

function compilar(modeloTema: Modelo, escala: Escala, momento: Momento = 'antes'): Compilado {
  // Sin variantes elegidas, las de siempre (las relaciones con `variante` nunca entran sin resolver).
  const modelo = aplicarVariantes(modeloTema);
  const sesion = momento !== 'antes';
  const modo = new Map<number, ModoSesion>();
  const ids = new Set(modelo.nodos.map((n) => n.id));
  const entradas = new Map<string, RelacionSuma[]>();
  const fijas = new Map<string, string[]>();
  const moduladores = new Map<number, { origen: string; k: number }[]>();
  const bloqueos = new Map<number, Bloqueo[]>();
  const tipoDe = new Map(modelo.nodos.map((n) => [n.id, n.tipo]));
  const basal = new Set<number>();
  const numeros = new Set(modelo.relaciones.map((r) => r.n));
  for (const r of modelo.relaciones) {
    if (!ids.has(r.origen)) throw new Error(`Relación ${r.n}: origen desconocido «${r.origen}»`);
    if (r.tipo !== 'modula' && !ids.has(r.destino))
      throw new Error(`Relación ${r.n}: destino desconocido «${r.destino}»`);
    // Las relaciones de un momento de la sesión solo actúan en ese momento.
    if (r.momento && r.momento !== momento) continue;
    if (r.tipo === 'bloquea') {
      for (const n of r.relaciones) {
        if (!numeros.has(n)) throw new Error(`Relación ${r.n}: bloquea la ${n}, que no existe`);
        bloqueos.set(n, [...(bloqueos.get(n) ?? []), { farmaco: r.origen, maximo: r.maximo, soloExceso: r.soloExceso }]);
      }
      continue;
    }
    if (r.tipo === 'suma' && tipoDe.get(r.origen) !== 'causa') basal.add(r.n);
    if (sesion) {
      // En la sesión actúan todas, pero las lentas con el valor de reposo.
      if (r.tipo === 'suma') {
        if (r.hasta) modo.set(r.n, 'desviacion');
        else if (!r.momento && ORDEN_ESCALA[r.tiempo] > ORDEN_ESCALA.minutos) modo.set(r.n, 'congelada');
      }
    } else if (!relacionActiva(r, escala)) continue;
    if (r.tipo === 'suma') {
      const lista = entradas.get(r.destino) ?? [];
      lista.push(r);
      entradas.set(r.destino, lista);
    } else if (r.tipo === 'fija') {
      fijas.set(r.destino, [...(fijas.get(r.destino) ?? []), r.origen]);
    } else {
      const k = (r.signo === '-' ? -1 : 1) * (r.intensidad ?? 1);
      for (const n of r.relaciones) moduladores.set(n, [...(moduladores.get(n) ?? []), { origen: r.origen, k }]);
    }
  }
  return { nodos: modelo.nodos, entradas, fijas, moduladores, bloqueos, basal, modo };
}

/** `base`: el reposo del que parte una sesión de ejercicio (solo en la sesión). */
function sumaEntradas(c: Compilado, id: string, x: Estado, base?: Estado): number {
  let s = 0;
  for (const r of c.entradas.get(id) ?? []) {
    const lista = c.bloqueos.get(r.n);
    const basal = c.basal.has(r.n);
    const modo = base ? c.modo.get(r.n) ?? 'normal' : 'normal';
    const origen = modo === 'congelada' ? base![r.origen] : x[r.origen];
    let e = entradaEfectiva(r, origenVisto(lista, origen, x, basal));
    if (modo === 'desviacion') e -= entradaEfectiva(r, origenVisto(lista, base![r.origen], x, basal));
    for (const m of c.moduladores.get(r.n) ?? []) e *= Math.max(0, 1 + m.k * x[m.origen]);
    s += e;
  }
  return s;
}

/**
 * Simula el modelo con unas causas y una escala de tiempo.
 *
 * Los nodos rápidos (`suma`) se relajan con amortiguación hacia tanh(Σ entradas).
 * Los acumuladores integran sus entradas con un paso mucho menor, de modo que los
 * nodos rápidos están casi en equilibrio en cada instante. En «estado estable» se
 * itera hasta que todo deja de cambiar; en «días» se integra un horizonte finito
 * (la fase de retención todavía no ha terminado); en «minutos» los acumuladores no
 * tienen entradas activas y se quedan en 0.
 */
export function simular(
  modeloTema: Modelo,
  causas: Record<string, number>,
  escala: Escala,
  opciones: OpcionesSimulacion = {},
): Resultado {
  const modelo = aplicarVariantes(modeloTema, opciones.variantes);
  const momento = opciones.momento ?? 'antes';
  if (momento !== 'antes') return simularSesion(modelo, causas, momento, opciones);
  const p = { ...modelo.parametros, ...opciones.parametros };
  const c = compilar(modelo, escala);
  const x: Estado = {};
  for (const n of c.nodos) {
    x[n.id] = n.calculo === 'entrada' ? clamp(causas[n.id] ?? 0, n.rango) : 0;
  }
  for (const id of Object.keys(causas)) {
    if (!(id in x)) throw new Error(`Causa desconocida «${id}»`);
  }

  const rapidos = c.nodos.filter((n) => n.calculo === 'suma');
  const acumuladores = c.nodos.filter((n) => n.calculo === 'acumulador');
  const derivados = c.nodos.filter((n) => n.calculo === 'derivado');

  const estaFijado = (id: string) => (c.fijas.get(id) ?? []).some((o) => Math.abs(x[o]) > 1e-9);

  const aplicarDerivadosYFijas = () => {
    for (const n of derivados) {
      let v = 0;
      for (const [id, w] of Object.entries(n.formula ?? {})) v += w * x[id];
      x[n.id] = clamp(v, n.rango);
    }
    for (const [destino, origenes] of c.fijas) {
      for (const o of origenes) if (Math.abs(x[o]) > 1e-9) x[destino] = x[o];
    }
  };

  /** Una iteración de los nodos rápidos; devuelve el mayor cambio. */
  const pasoRapido = (): number => {
    const objetivo: Estado = {};
    const libres = rapidos.filter((n) => !estaFijado(n.id));
    for (const n of libres) objetivo[n.id] = clamp(Math.tanh(sumaEntradas(c, n.id, x)), n.rango);
    let maxCambio = 0;
    for (const n of libres) {
      const nuevo = x[n.id] + p.amortiguacion * (objetivo[n.id] - x[n.id]);
      maxCambio = Math.max(maxCambio, Math.abs(nuevo - x[n.id]));
      x[n.id] = nuevo;
    }
    const antes = derivados.map((n) => x[n.id]);
    aplicarDerivadosYFijas();
    derivados.forEach((n, i) => (maxCambio = Math.max(maxCambio, Math.abs(x[n.id] - antes[i]))));
    return maxCambio;
  };

  /** Una iteración de los acumuladores; devuelve el mayor flujo neto. */
  const pasoAcumuladores = (): number => {
    let maxFlujo = 0;
    for (const n of acumuladores) {
      const neto = sumaEntradas(c, n.id, x);
      const nuevo = clamp(x[n.id] + p.paso * neto, n.rango);
      // Un acumulador saturado contra su límite cuenta como detenido.
      maxFlujo = Math.max(maxFlujo, Math.abs(nuevo - x[n.id]) / p.paso);
      x[n.id] = nuevo;
    }
    return maxFlujo;
  };

  aplicarDerivadosYFijas();
  let it = 0;
  let convergido = false;
  const pasosDias = Math.round(p.horizonteDias / p.paso);

  // Las fijas se aplican antes de la primera iteración: el resto parte de ellas.
  while (it < p.maxIteraciones) {
    it++;
    const cambio = pasoRapido();
    if (escala === 'dias' && it > pasosDias) {
      // Fin del horizonte: se congelan los acumuladores y se relaja el resto.
      if (cambio < p.tolerancia) {
        convergido = true;
        break;
      }
      continue;
    }
    const flujo = pasoAcumuladores();
    if (escala !== 'dias' && cambio < p.tolerancia && flujo < p.tolerancia) {
      convergido = true;
      break;
    }
  }
  return { valores: { ...x }, iteraciones: it, convergido };
}

/**
 * Sesión de ejercicio (fase 5). Una sesión dura minutos, pero el paciente que
 * la hace ya tiene su hipertensión establecida. Se calcula primero el estado
 * estable del paciente sin la sesión (causas, fármacos y entrenamiento) y,
 * encima, la respuesta de la sesión: actúan las relaciones de minutos y las del
 * momento elegido; las lentas se quedan con el valor de reposo de su origen, los
 * acumuladores (volemia) no cambian y las que se reajustan (barorreflejo)
 * actúan sobre el cambio respecto al reposo.
 */
function simularSesion(
  modelo: Modelo,
  entradas: Record<string, number>,
  momento: Exclude<Momento, 'antes'>,
  opciones: OpcionesSimulacion,
): Resultado {
  const p = { ...modelo.parametros, ...opciones.parametros };
  const sesion = nodosSesion(modelo);
  const reposo = Object.fromEntries(Object.entries(entradas).filter(([id]) => !sesion.has(id)));
  const base = simular(modelo, reposo, 'estable', { parametros: opciones.parametros }).valores;
  const c = compilar(modelo, 'estable', momento);
  const x: Estado = { ...base };
  for (const n of c.nodos) if (n.calculo === 'entrada') x[n.id] = clamp(entradas[n.id] ?? 0, n.rango);

  const rapidos = c.nodos.filter((n) => n.calculo === 'suma');
  const derivados = c.nodos.filter((n) => n.calculo === 'derivado');
  const estaFijado = (id: string) => (c.fijas.get(id) ?? []).some((o) => Math.abs(x[o]) > 1e-9);
  let it = 0;
  let convergido = false;
  while (it < p.maxIteraciones) {
    it++;
    const objetivo: Estado = {};
    const libres = rapidos.filter((n) => !estaFijado(n.id));
    for (const n of libres) objetivo[n.id] = clamp(Math.tanh(sumaEntradas(c, n.id, x, base)), n.rango);
    let maxCambio = 0;
    for (const n of libres) {
      const nuevo = x[n.id] + p.amortiguacion * (objetivo[n.id] - x[n.id]);
      maxCambio = Math.max(maxCambio, Math.abs(nuevo - x[n.id]));
      x[n.id] = nuevo;
    }
    for (const n of derivados) {
      let v = 0;
      for (const [id, w] of Object.entries(n.formula ?? {})) v += w * x[id];
      const nuevo = clamp(v, n.rango);
      maxCambio = Math.max(maxCambio, Math.abs(nuevo - x[n.id]));
      x[n.id] = nuevo;
    }
    if (maxCambio < p.tolerancia) {
      convergido = true;
      break;
    }
  }
  return { valores: { ...x }, iteraciones: it, convergido, base };
}

/**
 * Fracción bloqueada de cada relación con unas dosis (para la ficha y la vista):
 * número de relación → fracción y fármacos que la bloquean.
 */
export function bloqueosActivos(modelo: Modelo, valores: Estado, momento: Momento = 'antes'): Map<number, { fraccion: number; farmacos: string[] }> {
  const m = new Map<number, { fraccion: number; farmacos: string[] }>();
  for (const r of modelo.relaciones) {
    if (r.tipo !== 'bloquea' || (valores[r.origen] ?? 0) <= 0) continue;
    if (r.momento && r.momento !== momento) continue;
    for (const n of r.relaciones) {
      const a = m.get(n) ?? { fraccion: 0, farmacos: [] };
      a.fraccion = Math.min(1, a.fraccion + (valores[r.origen] ?? 0) * r.maximo);
      a.farmacos.push(r.origen);
      m.set(n, a);
    }
  }
  return m;
}

/**
 * Aporte de una relación de suma a su destino con unos valores, teniendo en
 * cuenta los bloqueos (sin moduladores). Para la ficha.
 */
export function aporteRelacion(modelo: Modelo, r: RelacionSuma, valores: Estado, momento: Momento = 'antes', base?: Estado): number {
  const lista: Bloqueo[] = [];
  for (const b of modelo.relaciones)
    if (b.tipo === 'bloquea' && b.relaciones.includes(r.n) && (!b.momento || b.momento === momento))
      lista.push({ farmaco: b.origen, maximo: b.maximo, soloExceso: b.soloExceso });
  const basal = modelo.nodos.find((n) => n.id === r.origen)?.tipo !== 'causa';
  // En la sesión, como en `simularSesion`: las lentas con el origen de reposo y
  // las que se reajustan, sobre el cambio respecto al reposo.
  const sesion = momento !== 'antes' && base;
  const lenta = sesion && !r.hasta && !r.momento && ORDEN_ESCALA[r.tiempo] > ORDEN_ESCALA.minutos;
  const x = lenta ? base[r.origen] ?? 0 : valores[r.origen] ?? 0;
  const e = entradaEfectiva(r, origenVisto(lista, x, valores, basal));
  return sesion && r.hasta ? e - entradaEfectiva(r, origenVisto(lista, base[r.origen] ?? 0, valores, basal)) : e;
}

/** Flechas de un estado para los nodos indicados. */
export function flechas(valores: Estado, ids: string[]): Record<string, Flecha> {
  return Object.fromEntries(ids.map((id) => [id, flecha(valores[id])]));
}
