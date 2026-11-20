import { frecuenciaDe } from '../motor/avisos';
import { aporteRelacion, bloqueosActivos, flecha, relacionActiva } from '../motor/motor';
import type { Caso, Escala, Estado, Modelo, Momento, Nodo, Relacion } from '../motor/tipos';
import type { Fichas } from '../temas/fichas';
import { crearAnimacion } from './animaciones';
import { crearEnlazador } from './enlaces';
import { h } from './dom';
import { enPalabras, NOMBRE_ESCALA, textoAccesibleMando, textoMando, tono } from './formato';
import { asa, deslizarParaCerrar } from './hoja';
import { crearHistorial } from './historial';

/** Lo que la ficha necesita saber del momento en que se abre. */
export interface Contexto {
  valores: Estado;
  escala: Escala;
  /** Caso cuyas causas coinciden con los mandos, si lo hay. */
  caso?: Caso;
  /** Si hay alguna causa, fármaco o ejercicio distinto de 0. */
  hayCausas: boolean;
  /** Fase 5: momento de la sesión de ejercicio («antes» si no hay sesión). */
  momento?: Momento;
  /** Fase 5: en la sesión, el paciente en reposo del que parte. */
  base?: Estado;
  /** Fase 6, modo reto: el valor de las causas no se muestra (ni su peso), para no delatarlas. */
  ocultarCausas?: boolean;
}

const NOMBRE_MOMENTO: Record<Exclude<Momento, 'antes'>, string> = { durante: 'durante la sesión', despues: 'al terminar la sesión' };
const enSesion = (ctx: Contexto) => !!ctx.momento && ctx.momento !== 'antes';
/** ¿Actúa la relación con este contexto? En la sesión actúan todas las de su momento (las lentas, con el valor de reposo). */
function actua(r: Relacion, ctx: Contexto): boolean {
  if (enSesion(ctx)) return !r.momento || r.momento === ctx.momento;
  return !r.momento && relacionActiva(r, ctx.escala);
}
/** Cuándo se mide el valor: «estado estable», «durante la sesión»… */
const cuando = (ctx: Contexto) => (enSesion(ctx) ? NOMBRE_MOMENTO[ctx.momento as 'durante'] : NOMBRE_ESCALA[ctx.escala].toLowerCase());

interface Opciones {
  fichas: Fichas;
  nombreCorto: Record<string, string>;
  /** «Ver las capas en el vaso»: activa los rótulos de las capas. */
  alVerCapas: () => void;
  /** Términos de los enlaces internos (datos del tema). */
  terminos: Record<string, string[]>;
  /** Pie «Preguntar sobre esta ficha» de «Ampliar con IA» (null si no está disponible). */
  pieIA: (contexto: string, texto: string) => HTMLElement | null;
  /** Fase 6, punto 5: valor orientativo de un nodo («≈ 145 mmol/L · normal 135–145»), si están activados. */
  valorOrientativo?: (id: string, ctx: Contexto) => string | null;
}

/** Dónde está el fragmento, para la pregunta a la IA. */
export const contextoIA = (nombre: string, caso?: Caso) =>
  `la ficha «${nombre}» de un simulador docente y cualitativo de las causas de la hipertensión arterial${caso ? `, en el caso «${caso.nombre}»` : ''}`;

const TIPO: Record<Nodo['tipo'], string> = {
  farmaco: 'Fármaco · la dosis la pones tú',
  ejercicio: 'Ejercicio · lo pones tú',
  causa: 'Causa · la mueves tú',
  mecanismo: 'Mecanismo · se mueve solo',
  salida: 'Salida · resultado',
  analitica: 'Analítica',
};

const FRECUENCIA: Record<string, string> = { comun: 'común', poco_frecuente: 'poco frecuente', rara: 'rara' };

/** Una relación vista desde la ficha: el otro nodo y cuánto pesa ahora. */
interface Enlace {
  id: string;
  /** Aporte con signo al destino (en unidades del motor); null si no es una suma. */
  aporte: number | null;
  /** Si es el aporte más grande que recibe el destino. */
  manda: boolean;
  explicacion: string;
  /** Texto fijo para relaciones que no son de suma o que no actúan en esta escala. */
  nota?: string;
  /** No actúa en la escala de tiempo elegida. */
  inactiva?: boolean;
  /** Bloqueo por fármacos («bloqueada un 35 % por IECA»). */
  bloqueo?: string;
}

const UMBRAL_PESO = 0.03;

function etiquetaAporte(e: Enlace, hayCausas: boolean): string {
  const base = etiquetaBase(e, hayCausas);
  return e.bloqueo ? (base ? `${base} · ${e.bloqueo}` : e.bloqueo) : base;
}
function etiquetaBase(e: Enlace, hayCausas: boolean): string {
  if (e.nota) return e.nota;
  // Sin causas activas todo está en su valor normal: el peso no dice nada.
  if (!hayCausas) return '';
  if (e.aporte === null) return '';
  if (Math.abs(e.aporte) < UMBRAL_PESO) return 'casi no influye ahora';
  const dir = e.aporte > 0 ? 'tira hacia arriba' : 'tira hacia abajo';
  return e.manda ? `${dir} · la que más pesa` : dir;
}

/**
 * Ficha de cada nodo (hito 3d): indicador, «Qué es», «Qué hace», animación,
 * «En este caso», «La mueven» y «Mueve a» (cada relación abre su ficha),
 * y aviso (un matiz clínico, un error frecuente o un límite del modelo).
 * En la pantalla ancha es un panel lateral; en el móvil, una hoja que sube
 * desde abajo y se cierra deslizándola.
 */
/**
 * `modeloActual`: el modelo con las variantes elegidas (fase 7). Las relaciones
 * que se enseñan y sus aportes son las que actúan de verdad en ese momento.
 */
export function crearFicha(modeloActual: () => Modelo, op: Opciones) {
  const modelo = modeloActual();
  const porId = new Map(modelo.nodos.map((n) => [n.id, n]));
  /** En el reto, ¿se oculta este nodo? Todas las causas, activas o no: si no, se adivinarían por eliminación. */
  const oculta = (id: string, ctx: Contexto) => !!ctx.ocultarCausas && porId.get(id)?.tipo === 'causa';
  const nombreDe = (id: string) => porId.get(id)?.nombre ?? id;
  const cortoDe = (id: string) => op.nombreCorto[id] ?? nombreDe(id);

  const tipo = h('p', { class: 'ficha-tipo' });
  const titulo = h('h2', { id: 'ficha-titulo', tabindex: '-1' });
  // «Volver»: icono a la izquierda del título (el asa queda siempre arriba del todo).
  const volver = h('button', { type: 'button', class: 'boton ficha-volver', hidden: true }, h('span', { 'aria-hidden': 'true' }, '←'));
  const cerrar = h('button', { type: 'button', class: 'boton', 'aria-label': 'Cerrar la ficha' }, 'Cerrar');
  const cuerpo = h('div', { class: 'ficha-cuerpo' });
  const cabecera = h(
    'div',
    { class: 'ficha-cabecera' },
    asa(),
    volver,
    h('div', { class: 'ficha-titulos' }, tipo, titulo),
    cerrar,
  );
  const dialogo = h('dialog', { class: 'ficha', 'aria-labelledby': 'ficha-titulo' }, cabecera, cuerpo);
  deslizarParaCerrar(dialogo, cabecera);
  cerrar.addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) dialogo.close();
  });

  let contexto: Contexto | null = null;
  let actual = '';
  const historia: string[] = [];
  let animacion: ReturnType<typeof crearAnimacion> = null;

  dialogo.addEventListener('close', () => {
    animacion?.detener();
    animacion = null;
    historia.length = 0;
  });
  // Historial mientras la ficha está abierta: el «atrás» del sistema vuelve a la
  // ficha anterior y, en la primera, cierra la hoja.
  const historial = crearHistorial(
    dialogo,
    () => {
      const anterior = historia.pop();
      if (!anterior) return false;
      pintar(anterior);
      entrar('atras');
      return true;
    },
    () => historia.length > 0,
  );
  volver.addEventListener('click', () => historial.atras());
  /** Ir a otra ficha desde esta (relaciones y enlaces internos). */
  function irA(destino: string) {
    historia.push(actual);
    historial.empujar();
    pintar(destino);
    entrar('adelante');
  }

  // Animación corta al cambiar de ficha (nada con movimiento reducido).
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
  function entrar(sentido: 'adelante' | 'atras') {
    if (reducir.matches) return;
    cuerpo.animate(
      [{ transform: `translateX(${sentido === 'adelante' ? 40 : -40}px)`, opacity: 0.4 }, { transform: 'none', opacity: 1 }],
      { duration: 180, easing: 'ease-out' },
    );
  }

  // Deslizar hacia la derecha sobre la ficha vuelve a la anterior (pantallas
  // táctiles). Solo cuenta un gesto horizontal claro: no interfiere con el
  // scroll vertical ni con mantener pulsado para seleccionar texto.
  let gesto: { x: number; y: number; t: number; id: number; horizontal: boolean | null } | null = null;
  cuerpo.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch' || historia.length === 0) return;
    gesto = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, horizontal: null };
  });
  cuerpo.addEventListener('pointermove', (e) => {
    if (!gesto || e.pointerId !== gesto.id) return;
    const dx = e.clientX - gesto.x;
    const dy = e.clientY - gesto.y;
    if (gesto.horizontal === null) {
      if (Math.hypot(dx, dy) < 12) return;
      // Pulsación larga (selección de texto) o gesto vertical: no es para volver.
      const seleccion = getSelection();
      gesto.horizontal = dx > 0 && Math.abs(dx) > Math.abs(dy) * 1.5 && performance.now() - gesto.t < 400 && !(seleccion && !seleccion.isCollapsed);
      if (!gesto.horizontal) {
        gesto = null;
        return;
      }
    }
    cuerpo.style.transform = `translateX(${Math.max(0, dx)}px)`;
    cuerpo.style.opacity = String(Math.max(0.4, 1 - dx / 400));
  });
  const soltarGesto = (e: PointerEvent) => {
    if (!gesto || e.pointerId !== gesto.id) return;
    const dx = e.clientX - gesto.x;
    const rapido = dx / Math.max(1, performance.now() - gesto.t) > 0.5;
    const horizontal = gesto.horizontal;
    gesto = null;
    cuerpo.style.transform = '';
    cuerpo.style.opacity = '';
    if (horizontal && e.type === 'pointerup' && (dx > 80 || (dx > 30 && rapido))) historial.atras();
  };
  cuerpo.addEventListener('pointerup', soltarGesto);
  cuerpo.addEventListener('pointercancel', soltarGesto);

  // ── Relaciones y su peso en el caso ──

  function aportesA(destino: string, ctx: Contexto): Map<Relacion, number> {
    const m = new Map<Relacion, number>();
    for (const r of modeloActual().relaciones) {
      if (r.destino !== destino || r.tipo !== 'suma' || !actua(r, ctx)) continue;
      m.set(r, aporteRelacion(modeloActual(), r, ctx.valores, ctx.momento, ctx.base));
    }
    return m;
  }

  /** «Renina → Angiotensina II» de una relación por número. */
  const nombreRelacion = (n: number) => {
    const r = modeloActual().relaciones.find((x) => x.n === n);
    return r ? `${cortoDe(r.origen).replace(/\u00AD/g, '')} → ${cortoDe(r.destino).replace(/\u00AD/g, '')}` : String(n);
  };
  function textoBloqueo(r: Relacion, ctx: Contexto): string | undefined {
    const b = bloqueosActivos(modeloActual(), ctx.valores, ctx.momento).get(r.n);
    if (!b) return undefined;
    return `bloqueada un ${Math.round(b.fraccion * 100)} % por ${b.farmacos.map((f) => cortoDe(f).replace(/\u00AD/g, '')).join(' y ')}`;
  }

  function enlace(r: Relacion, otro: string, ctx: Contexto): Enlace {
    if (r.momento && !actua(r, ctx)) {
      return { id: otro, aporte: null, manda: false, explicacion: r.explicacion, nota: `solo ${NOMBRE_MOMENTO[r.momento]}`, inactiva: true };
    }
    if (!actua(r, ctx)) {
      // Solo las de suma tienen escala: o empiezan más tarde o dejan de actuar (`hasta`).
      const porHasta = r.tipo === 'suma' && relacionActiva({ ...r, hasta: undefined }, ctx.escala);
      const nota = r.tipo !== 'suma' ? '' : porHasta ? `no actúa en «${NOMBRE_ESCALA[ctx.escala]}»` : `actúa desde «${NOMBRE_ESCALA[r.tiempo]}»`;
      return { id: otro, aporte: null, manda: false, explicacion: r.explicacion, nota, inactiva: true };
    }
    if (r.tipo === 'modula') return { id: otro, aporte: null, manda: false, explicacion: r.explicacion, nota: 'modula el efecto' };
    if (r.tipo === 'bloquea') {
      const dosis = ctx.valores[r.origen] ?? 0;
      const cuales = r.relaciones.map(nombreRelacion).join(', ');
      return {
        id: otro, aporte: null, manda: false, explicacion: r.explicacion,
        nota: dosis > 0 ? `bloquea un ${Math.round(dosis * r.maximo * 100)} %: ${cuales}` : `bloquea ${cuales} (sin dosis ahora)`,
      };
    }
    if (r.tipo === 'fija') {
      const activa = Math.abs(ctx.valores[r.origen] ?? 0) > 1e-9;
      return { id: otro, aporte: null, manda: activa, explicacion: r.explicacion, nota: activa ? 'la fija: manda del todo' : 'sin efecto en la posición normal' };
    }
    const aportes = aportesA(r.destino, ctx);
    const propio = aportes.get(r) ?? 0;
    const max = Math.max(0, ...[...aportes.values()].map(Math.abs));
    return { id: otro, aporte: propio, manda: Math.abs(propio) >= 0.15 && Math.abs(propio) === max, explicacion: r.explicacion, bloqueo: textoBloqueo(r, ctx) };
  }

  function lista(enlaces: Enlace[], vacio: string, ctx: Contexto) {
    if (enlaces.length === 0) return h('p', { class: 'tenue' }, vacio);
    return h(
      'ul',
      { class: 'ficha-relaciones' },
      ...enlaces.map((e) => {
        const v = ctx.valores[e.id] ?? 0;
        // Un fármaco no tiene flecha: se muestra su dosis.
        const n = porId.get(e.id);
        const esFarmaco = n?.tipo === 'farmaco' || n?.tipo === 'ejercicio';
        if (oculta(e.id, ctx)) {
          const boton = h(
            'button',
            { type: 'button', class: 'ficha-enlace', 'aria-label': `${nombreDe(e.id)}, oculta en el reto. Abrir su ficha` },
            h('span', { class: 'ficha-enlace-nombre' }, nombreDe(e.id)),
            h('span', { class: 'flecha flecha-oculta' }, '?'),
            h('span', { class: 'ficha-enlace-por tenue' }, e.explicacion),
          );
          boton.addEventListener('click', () => irA(e.id));
          return h('li', {}, boton);
        }
        const estado = esFarmaco && n ? textoMando(n, v) : enPalabras(v);
        const boton = h(
          'button',
          { type: 'button', class: 'ficha-enlace', 'aria-label': `${nombreDe(e.id)}, ${estado}${etiquetaAporte(e, ctx.hayCausas) ? `: ${etiquetaAporte(e, ctx.hayCausas)}` : ''}. Abrir su ficha` },
          h('span', { class: 'ficha-enlace-nombre' }, nombreDe(e.id)),
          esFarmaco && n ? h('span', { class: 'dosis' }, textoMando(n, v)) : h('span', { class: 'flecha', 'data-tono': tono(v) }, flecha(v)),
          etiquetaAporte(e, ctx.hayCausas) ? h('span', { class: 'ficha-enlace-peso' }, etiquetaAporte(e, ctx.hayCausas)) : null,
          h('span', { class: 'ficha-enlace-por tenue' }, e.explicacion),
        );
        boton.addEventListener('click', () => irA(e.id));
        return h('li', { class: e.inactiva ? 'inactiva' : undefined }, boton);
      }),
    );
  }

  // ── «En este caso» generado a partir del modelo ──

  function textoGenerado(nodo: Nodo, ctx: Contexto): string {
    const v = ctx.valores[nodo.id] ?? 0;
    if (!ctx.hayCausas) return 'Sin causas activas, todo está en su valor normal. Elige un caso o gira una rueda.';
    if (nodo.tipo === 'causa' && ctx.ocultarCausas) return 'En el reto, la posición de esta rueda está oculta: dedúcela con la presión, los mecanismos y la analítica.';
    if (nodo.tipo === 'causa') {
      return Math.abs(v) < 1e-9
        ? 'Esta rueda está en su posición normal: no interviene en este caso.'
        : `La rueda está en ${textoAccesibleMando(nodo, v)}.`;
    }
    if (nodo.tipo === 'farmaco') {
      return Math.abs(v) < 1e-9
        ? 'Sin este fármaco. Gira su rueda de dosis en la pestaña «Fármacos» para ver qué cambia.'
        : `Dosis: ${textoAccesibleMando(nodo, v)}.`;
    }
    if (nodo.tipo === 'ejercicio') {
      const sesion = modeloActual().relaciones.some((r) => r.origen === nodo.id && r.momento);
      if (Math.abs(v) < 1e-9) return 'Sin este ejercicio. Gira su rueda en la pestaña «Ejercicio» para ver qué cambia.';
      if (sesion && !enSesion(ctx)) return `Intensidad: ${textoMando(nodo, v)}. El momento está en «Antes»: elige «Durante» o «Al terminar» para ver la sesión.`;
      return sesion ? `Intensidad: ${textoMando(nodo, v)}, ${cuando(ctx)}.` : `Entrenamiento: ${textoMando(nodo, v)}. Actúa en el estado estable, como la edad.`;
    }
    let aportes: { id: string; c: number }[];
    if (nodo.formula) {
      aportes = Object.entries(nodo.formula).map(([id, k]) => ({ id, c: k * (ctx.valores[id] ?? 0) }));
    } else {
      const fija = modeloActual().relaciones.find((r) => r.tipo === 'fija' && r.destino === nodo.id && Math.abs(ctx.valores[r.origen] ?? 0) > 1e-9);
      if (fija) return `${cap(enPalabras(v))}: la fija ${nombreDe(fija.origen)}, que no hace caso a sus estímulos.`;
      aportes = [...aportesA(nodo.id, ctx)].map(([r, c]) => ({ id: r.origen, c }));
    }
    const arriba = aportes.filter((a) => a.c >= 0.05).sort((a, b) => b.c - a.c)[0];
    const abajo = aportes.filter((a) => a.c <= -0.05).sort((a, b) => a.c - b.c)[0];
    const quien = (a: { id: string }) => (oculta(a.id, ctx) ? 'una causa oculta' : `${nombreDe(a.id)} (${flecha(ctx.valores[a.id] ?? 0)})`);
    if (!arriba && !abajo) return 'Normal: en este caso nada lo mueve de forma apreciable.';
    if (flecha(v) === '=' && arriba && abajo) return `Normal: ${quien(arriba)} tira hacia arriba y ${quien(abajo)} hacia abajo, y se compensan.`;
    const partes = [cap(enPalabras(v)) + '.'];
    const sube = v >= 0;
    const principal = sube ? arriba : abajo;
    const freno = sube ? abajo : arriba;
    if (principal) partes.push(`Tira hacia ${sube ? 'arriba' : 'abajo'} sobre todo ${quien(principal)}.`);
    if (freno) partes.push(`Frena ${quien(freno)}.`);
    return partes.join(' ');
  }

  // ── Pintado ──

  function seccion(tituloSeccion: string, ...hijos: (Node | null)[]) {
    return h('section', { class: 'ficha-seccion', 'data-ia-apartado': tituloSeccion.split(' · ')[0] }, h('h3', {}, tituloSeccion), ...hijos);
  }

  // Enlaces internos: dentro de la ficha, abren otra con «← Volver».
  const enlazar = crearEnlazador(op.terminos, (destino) => irA(destino));
  /** Párrafo con enlaces: cada nodo se enlaza una vez por apartado y nunca hacia la propia ficha. */
  const parrafo = (texto: string, propio: string, attrs: Record<string, string> = {}) =>
    h('p', attrs, ...enlazar(texto, propio, new Set()));

  function pintar(id: string) {
    const ctx = contexto;
    const nodo = porId.get(id);
    if (!ctx || !nodo) return;
    actual = id;
    animacion?.detener();
    animacion = null;
    const f = op.fichas[id];
    const v = ctx.valores[id] ?? 0;

    tipo.textContent = `${nodo.codigo} · ${TIPO[nodo.tipo]}`;
    titulo.textContent = nodo.nombre;
    const anterior = historia[historia.length - 1];
    volver.hidden = !anterior;
    if (anterior) {
      volver.setAttribute('aria-label', `Volver a la ficha de ${nombreDe(anterior)}`);
      volver.title = `Volver a ${cortoDe(anterior).replace(/\u00AD/g, '')}`;
    }

    // Indicador.
    const indicador =
      nodo.tipo === 'farmaco'
        ? h('p', { class: 'ficha-valor' }, 'Dosis: ', h('strong', {}, textoAccesibleMando(nodo, v)))
        : nodo.tipo === 'ejercicio'
        ? h('p', { class: 'ficha-valor' }, nodo.id.startsWith('entreno') ? 'Entrenamiento: ' : 'Intensidad: ', h('strong', {}, textoMando(nodo, v)))
        : nodo.tipo === 'causa' && ctx.ocultarCausas
        ? h('p', { class: 'ficha-valor' }, 'Rueda: ', h('strong', {}, 'oculta en el reto'))
        : nodo.tipo === 'causa'
        ? h(
            'p',
            { class: 'ficha-valor' },
            'Rueda: ',
            h('strong', {}, textoAccesibleMando(nodo, v)),
            ((fr) =>
              fr && fr !== 'comun'
                ? h('span', { class: 'ficha-frecuencia', title: modelo.avisos?.queMideFrecuencia ?? '' }, modelo.avisos?.frecuencia[fr].pastilla ?? FRECUENCIA[fr])
                : null)(frecuenciaDe(nodo, v)),
          )
        : h(
            'p',
            { class: 'ficha-valor', 'data-tono': tono(v) },
            h('span', { class: 'flecha' }, flecha(v)),
            ` ${enPalabras(v)} `,
            h('span', { class: 'tenue' }, `· ${cuando(ctx)}`),
          );

    // En este caso.
    const escrito = ctx.caso ? f?.enCaso?.[ctx.caso.id] : undefined;
    const enCaso = seccion(
      ctx.caso ? `En este caso · ${ctx.caso.nombre}` : 'En este caso',
      parrafo(escrito ?? textoGenerado(nodo, ctx), id),
      escrito && ctx.escala !== 'estable' && !enSesion(ctx) && !ctx.caso?.momento
        ? h('p', { class: 'tenue pequeno' }, `Texto pensado sobre todo para el estado estable; las flechas son las de «${NOMBRE_ESCALA[ctx.escala]}».`)
        : escrito && ctx.caso?.momento && (ctx.momento ?? 'antes') !== ctx.caso.momento
        ? h('p', { class: 'tenue pequeno' }, `Texto pensado para «${ctx.caso.momento === 'durante' ? 'Durante' : 'Al terminar'}»; ahora el momento es otro.`)
        : !escrito && ctx.hayCausas && nodo.tipo !== 'causa' && nodo.tipo !== 'farmaco' && nodo.tipo !== 'ejercicio'
          ? h('p', { class: 'tenue pequeno' }, 'Calculado con el modelo.')
          : null,
    );

    // Relaciones.
    const entran = modeloActual().relaciones.filter((r) => r.destino === id).map((r) => enlace(r, r.origen, ctx));
    if (nodo.formula) {
      for (const [origen, k] of Object.entries(nodo.formula)) {
        const c = k * (ctx.valores[origen] ?? 0);
        entran.push({ id: origen, aporte: c, manda: false, explicacion: k > 0.5 ? 'Pesa dos tercios' : 'Pesa un tercio' });
      }
      const max = Math.max(...entran.map((e) => Math.abs(e.aporte ?? 0)));
      for (const e of entran) e.manda = max >= 0.15 && Math.abs(e.aporte ?? 0) === max;
    }
    const salen = modeloActual().relaciones.filter((r) => r.origen === id).map((r) => enlace(r, r.destino, ctx));
    for (const n of modelo.nodos) {
      if (n.formula && id in n.formula) {
        const c = n.formula[id] * v;
        salen.push({ id: n.id, aporte: c, manda: false, explicacion: n.formula[id] > 0.5 ? 'Pesa dos tercios' : 'Pesa un tercio' });
      }
    }
    // Primero lo que manda; después por peso; al final lo que no actúa en esta escala.
    // En el reto, las causas van detrás y sin «la que más pesa»: el orden no debe delatarlas.
    for (const e of [...entran, ...salen]) if (oculta(e.id, ctx)) e.manda = false;
    const peso = (e: Enlace) => (oculta(e.id, ctx) ? -1.5 : e.inactiva ? -2 : e.manda ? 9 : e.aporte === null ? -1 : Math.abs(e.aporte));
    const orden = (a: Enlace, b: Enlace) => peso(b) - peso(a);
    entran.sort(orden);
    salen.sort(orden);

    // Animación.
    if (f?.animacion) animacion = crearAnimacion(f.animacion);

    const botonCapas = f?.capas
      ? h('button', { type: 'button', class: 'boton ficha-capas' }, 'Ver las capas en el vaso')
      : null;
    botonCapas?.addEventListener('click', () => {
      dialogo.close();
      op.alVerCapas();
    });

    const orientativo = op.valorOrientativo?.(id, ctx);
    cuerpo.replaceChildren(
      ...[
        indicador,
        orientativo ? h('p', { class: 'ficha-orientativo' }, h('span', { class: 'etiqueta-orientativo' }, 'orientativo'), ` ${orientativo}`) : null,
        // Qué mide la pastilla de frecuencia (revisión de Fable 5.2, hito 3e).
        nodo.tipo === 'causa' && !ctx.ocultarCausas && ((fr) => fr && fr !== 'comun')(frecuenciaDe(nodo, v)) && modelo.avisos
          ? h('p', { class: 'tenue pequeno ficha-nota-frecuencia' }, modelo.avisos.queMideFrecuencia)
          : null,
        f ? seccion('Qué es', parrafo(f.queEs, id)) : null,
        f ? seccion('Qué hace', parrafo(f.queHace, id)) : null,
        botonCapas,
        animacion?.raiz ?? null,
        enCaso,
        f?.consulta ? seccion('En la consulta de fisioterapia', parrafo(f.consulta, id, { class: 'ficha-consulta' })) : null,
        seccion(
          'La mueven',
          lista(entran, nodo.tipo === 'causa' || nodo.tipo === 'ejercicio' ? 'Nada: la mueves tú con la rueda.' : nodo.tipo === 'farmaco' ? 'Nada: la dosis la pones tú con la rueda.' : 'Ninguna relación.', ctx),
        ),
        seccion(nodo.tipo === 'farmaco' || nodo.tipo === 'ejercicio' ? 'Actúa sobre' : 'Mueve a', lista(salen, 'Nada: es un valor de la analítica.', ctx)),
        f?.aviso
          ? h('p', { class: 'ficha-aviso', 'data-ia-apartado': 'Aviso' }, h('span', { class: 'ficha-aviso-icono', 'aria-hidden': 'true' }, '⚠'), h('span', {}, ...enlazar(f.aviso, id, new Set())))
          : null,
        f ? op.pieIA(contextoIA(nodo.nombre, ctx.caso), [f.queEs, f.queHace, escrito ?? '', f.consulta ?? ''].filter(Boolean).join(' ')) : null,
      ].filter((x) => x !== null),
    );
    cuerpo.dataset.iaCtx = contextoIA(nodo.nombre, ctx.caso);
    dialogo.scrollTop = 0;
    if (dialogo.open) titulo.focus({ preventScroll: true });
  }

  function abrir(id: string, ctx: Contexto) {
    contexto = ctx;
    historia.length = 0;
    pintar(id);
    if (!dialogo.open) {
      dialogo.showModal();
      historial.empujar();
    }
    dialogo.scrollTop = 0;
  }

  return { raiz: dialogo, abrir };
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
