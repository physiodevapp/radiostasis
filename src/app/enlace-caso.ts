import type { Escala, Momento } from '../motor/tipos';

/**
 * Casos por enlace (fase 6, modo profesor). El estado del simulador viaja en el
 * fragmento de la dirección (lo que va tras «#»):
 *
 *   #c=hiperaldo:1,sal:0.5&f=espironolactona:1&e=sesionAerobica:0.5&m=durante&t=dias&p=¿Por%20qué…
 *
 * c = causas, f = fármacos, e = ejercicio (id:valor, solo los distintos de 0),
 * m = momento de la sesión, t = escala de tiempo, p = pregunta del profesor,
 * v = variantes de las causas (fase 7: v=estenosis:unilateral; la de siempre no se escribe).
 * Lo que vale lo de siempre (momento «antes», estado estable) no se escribe.
 *
 * Fase N2: el tema también va en `t=` (`#t=natremia&c=…`, P8 aprobada por
 * Edu). `t=` es además la escala desde la fase 6 (`t=dias`): los dos se
 * distinguen por el valor, porque ningún tema se llama como una escala (un test
 * lo vigila). El tema por defecto (la hipertensión) no se escribe, así que sus
 * enlaces son los de siempre, y los antiguos, sin tema, la abren.
 *
 * El fragmento no llega al servidor ni pasa por el service worker, y funciona
 * igual en la raíz, en un subdirectorio (base './') o dentro del hub PhysiQ.
 * Al leer, se ignora todo lo que no se reconoce (mandos que no existen, valores
 * fuera de su rango, momentos o escalas desconocidos) sin dar error.
 */

export interface EstadoCompartido {
  causas: Record<string, number>;
  farmacos: Record<string, number>;
  ejercicio: Record<string, number>;
  momento: Momento;
  escala: Escala;
  /** Fase 7: variante elegida de cada causa que las tiene (las que faltan, la de siempre). */
  variantes: Record<string, string>;
  /** Pregunta del profesor; cadena vacía si no hay. */
  pregunta: string;
}

/** Mandos que admite el enlace y su rango (lo da el tema). */
export interface MandosEnlace {
  causas: readonly string[];
  farmacos: readonly string[];
  ejercicio: readonly string[];
  /** Mandos de la sesión: sin ninguno activo, el momento vuelve a «antes». */
  sesion: readonly string[];
  rango: (id: string) => readonly [number, number];
  /** Fase 7: variantes válidas de cada causa que las tiene; la primera es la de siempre. */
  variantes: Record<string, readonly string[]>;
}

/** Longitud máxima de la pregunta del profesor. */
export const MAX_PREGUNTA = 200;

const MOMENTOS: Momento[] = ['antes', 'durante', 'despues'];
export const ESCALAS: readonly Escala[] = ['minutos', 'dias', 'estable'];

/** Un id de tema en la dirección: minúsculas, cifras y guiones. */
const ID_TEMA = /^[a-z][a-z0-9-]{0,39}$/;

/**
 * Fase N2: separa el tema del resto del fragmento. Devuelve el id del tema que
 * pide la dirección (null si no pide ninguno; puede no existir: lo decide el
 * registro de temas) y el fragmento sin él, sin «#», para leer el caso o el reto.
 * `t=dias` y `t=minutos` son la escala y se quedan en el resto.
 */
export function leerTema(fragmento: string): { tema: string | null; resto: string } {
  const texto = fragmento.replace(/^#/, '');
  let tema: string | null = null;
  const resto = texto.split('&').filter((parte) => {
    if (!parte.startsWith('t=')) return true;
    const v = parte.slice(2);
    if ((ESCALAS as readonly string[]).includes(v) || !ID_TEMA.test(v)) return true;
    tema ??= v;
    return false;
  });
  return { tema, resto: resto.join('&') };
}

/** Fragmento (sin «#») con el tema delante; el tema por defecto no se escribe. */
export function conTema(fragmento: string, tema: string, porDefecto: string): string {
  if (tema === porDefecto) return fragmento;
  return fragmento ? `t=${tema}&${fragmento}` : `t=${tema}`;
}

/** Retos por enlace: largo máximo del enunciado y de la explicación del profesor. */
export const MAX_ENUNCIADO = 300;
export const MAX_EXPLICACION = 300;
/** Un reto del profesor admite de una a tres causas. */
export const MAX_CAUSAS_RETO = 3;

/** Texto plano de una línea, sin caracteres de control y con el máximo de largo. */
export function limpiarPregunta(t: string, max = MAX_PREGUNTA): string {
  return t
    .replace(/[\p{Cc}\p{Cf}\u2028\u2029]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim();
}

const numero = (v: number) => String(Math.round(v * 100) / 100);

function lista(valores: Record<string, number>, orden: readonly string[]): string {
  return orden
    .filter((id) => Math.round((valores[id] ?? 0) * 100) !== 0)
    .map((id) => `${id}:${numero(valores[id])}`)
    .join(',');
}

/** Fragmento del enlace (sin «#») para un estado. */
export function codificar(e: EstadoCompartido, m: MandosEnlace): string {
  const partes: string[] = [];
  const c = lista(e.causas, m.causas);
  const f = lista(e.farmacos, m.farmacos);
  const ej = lista(e.ejercicio, m.ejercicio);
  if (c) partes.push(`c=${c}`);
  if (f) partes.push(`f=${f}`);
  if (ej) partes.push(`e=${ej}`);
  if (e.momento !== 'antes' && m.sesion.some((id) => Math.round((e.ejercicio[id] ?? 0) * 100) !== 0)) partes.push(`m=${e.momento}`);
  const v = Object.entries(m.variantes)
    .filter(([id, lista]) => e.variantes[id] && e.variantes[id] !== lista[0] && lista.includes(e.variantes[id]))
    .map(([id]) => `${id}:${e.variantes[id]}`)
    .join(',');
  if (v) partes.push(`v=${v}`);
  if (e.escala !== 'estable') partes.push(`t=${e.escala}`);
  const p = limpiarPregunta(e.pregunta);
  if (p) partes.push(`p=${encodeURIComponent(p)}`);
  // Sin nada, el enlace lo dice igualmente (abre la persona sana como caso compartido).
  return partes.length ? partes.join('&') : 'c=';
}

function leerLista(texto: string, validos: readonly string[], m: MandosEnlace): Record<string, number> {
  const r: Record<string, number> = {};
  for (const par of texto.split(',')) {
    const [id, valor, ...resto] = par.split(':');
    if (resto.length || !validos.includes(id) || valor === undefined || !/^-?\d+(\.\d+)?$/.test(valor)) continue;
    const v = Math.round(Number(valor) * 100) / 100;
    const [min, max] = m.rango(id);
    if (v < min || v > max || v === 0) continue;
    r[id] = v;
  }
  return r;
}

/**
 * Estado de un fragmento («#…» o sin la almohadilla). Devuelve null si el
 * fragmento no es un caso compartido (no lleva ninguna clave reconocida).
 */
export function decodificar(fragmento: string, m: MandosEnlace, maxPregunta = MAX_PREGUNTA): EstadoCompartido | null {
  const texto = fragmento.replace(/^#/, '');
  if (!texto) return null;
  const e: EstadoCompartido = { causas: {}, farmacos: {}, ejercicio: {}, momento: 'antes', escala: 'estable', variantes: {}, pregunta: '' };
  let reconocido = false;
  for (const parte of texto.split('&')) {
    const i = parte.indexOf('=');
    if (i < 0) continue;
    const clave = parte.slice(0, i);
    const valor = parte.slice(i + 1);
    switch (clave) {
      case 'c': e.causas = leerLista(valor, m.causas, m); break;
      case 'f': e.farmacos = leerLista(valor, m.farmacos, m); break;
      case 'e': e.ejercicio = leerLista(valor, m.ejercicio, m); break;
      case 'm': if ((MOMENTOS as string[]).includes(valor)) e.momento = valor as Momento; break;
      case 'v':
        for (const par of valor.split(',')) {
          const [id, variante, ...resto] = par.split(':');
          if (!resto.length && m.variantes[id]?.includes(variante)) e.variantes[id] = variante;
        }
        break;
      case 't': if ((ESCALAS as string[]).includes(valor)) e.escala = valor as Escala; break;
      case 'p':
        try {
          e.pregunta = limpiarPregunta(decodeURIComponent(valor.replace(/\+/g, ' ')), maxPregunta);
        } catch {
          e.pregunta = '';
        }
        break;
      default: continue;
    }
    reconocido = true;
  }
  if (!reconocido) return null;
  if (!m.sesion.some((id) => e.ejercicio[id])) e.momento = 'antes';
  return e;
}

// --- Retos por enlace ---
//
//   #reto=3          abre el reto 3 de la lista.
//   #reto=Yz1oaX…    reto del profesor: el estado del caso (con p = enunciado y
//                    x = explicación al corregir) en base64url, para que las
//                    causas no se lean en el enlace. No es un cifrado.

/** Lo que abre un enlace de reto. */
export type EnlaceReto =
  | { tipo: 'lista'; numero: number }
  | { tipo: 'profesor'; estado: EstadoCompartido; explicacion: string };

const aBase64url = (t: string) => {
  let binario = '';
  for (const b of new TextEncoder().encode(t)) binario += String.fromCharCode(b);
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const deBase64url = (t: string) => {
  const binario = atob(t.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binario, (c) => c.charCodeAt(0)));
};

/** Causas activas de un estado (las distintas de 0). */
export const causasActivas = (e: Pick<EstadoCompartido, 'causas'>) => Object.keys(e.causas).filter((id) => e.causas[id] !== 0);

/**
 * Fragmento (sin «#») del reto del profesor: el estado del caso, el enunciado
 * (en la «p» de la pregunta) y la explicación al corregir.
 */
export function codificarReto(e: EstadoCompartido, explicacion: string, m: MandosEnlace): string {
  const partes = [codificar({ ...e, pregunta: '' }, m)];
  const p = limpiarPregunta(e.pregunta, MAX_ENUNCIADO);
  const x = limpiarPregunta(explicacion, MAX_EXPLICACION);
  // Dentro del base64 basta con escapar lo que separa o se lee distinto («%», «&», «+»):
  // espacios y acentos van tal cual y el enlace sale bastante más corto.
  const escapar = (t: string) => t.replace(/[%&+]/g, encodeURIComponent);
  if (p) partes.push(`p=${escapar(p)}`);
  if (x) partes.push(`x=${escapar(x)}`);
  return `reto=${aBase64url(partes.join('&'))}`;
}

/**
 * Lee un enlace de reto. Devuelve null si el fragmento no es un reto o no vale
 * (número fuera de la lista, texto que no se descodifica, sin causas o con más
 * de tres).
 */
export function decodificarReto(fragmento: string, m: MandosEnlace, retosEnLista: number): EnlaceReto | null {
  const r = /^#?reto=([A-Za-z0-9_-]+)$/.exec(fragmento);
  if (!r) return null;
  if (/^\d+$/.test(r[1])) {
    const numero = Number(r[1]);
    return numero >= 1 && numero <= retosEnLista ? { tipo: 'lista', numero } : null;
  }
  let texto: string;
  try {
    texto = deBase64url(r[1]);
  } catch {
    return null;
  }
  const estado = decodificar(texto, m, MAX_ENUNCIADO);
  const n = estado ? causasActivas(estado).length : 0;
  if (!estado || n < 1 || n > MAX_CAUSAS_RETO) return null;
  let explicacion = '';
  const x = texto.split('&').find((parte) => parte.startsWith('x='));
  if (x) {
    try {
      explicacion = limpiarPregunta(decodeURIComponent(x.slice(2).replace(/\+/g, ' ')), MAX_EXPLICACION);
    } catch {
      explicacion = '';
    }
  }
  return { tipo: 'profesor', estado, explicacion };
}
