import type { Estado } from '../motor/tipos';
import { h, idUnico, s } from './dom';
import { anchoVentana, rectCss } from './preferencias';

/**
 * Los dos vasos (docs/diseno.md, «Vasos y animación»):
 * - Longitudinal: arteria grande de conducción (flujo, onda de pulso, rigidez, placas, llenado).
 * - Transversal: arteriola de resistencia (luz = RVP); no late.
 *
 * La animación la lleva un único bucle con requestAnimationFrame que acumula
 * fases, así un cambio de velocidad no produce saltos. El botón de pausa la
 * detiene y `prefers-reduced-motion` la arranca detenida.
 */

const ANCHO = 640;
/** Posiciones de los hematíes de una tanda (la otra va desplazada −640). */
const HEMATIES: [number, number][] = [
  [5, 98], [38, 88], [55, 128], [96, 92], [108, 117], [137, 134], [161, 129], [203, 140],
  [223, 116], [257, 88], [282, 110], [295, 84], [330, 142], [348, 131], [380, 129], [410, 131],
  [435, 134], [467, 123], [486, 94], [519, 93], [543, 135], [575, 147], [591, 81], [622, 97],
  [20, 140], [70, 108], [120, 82], [180, 104], [240, 146], [312, 100], [362, 92], [450, 104],
  [500, 146], [560, 110], [610, 128], [395, 112],
];
/** Orden en que desaparecen los hematíes al bajar la volemia (fijo, no aleatorio). */
const ORDEN_LLENADO = HEMATIES.map((_, i) => i).sort((a, b) => ((a * 37) % 23) - ((b * 37) % 23));

/** Centros de las placas: arriba en estas x (pared en y = 78) y abajo desplazadas 60 (pared en y = 162). */
const POS_PLACAS = [90, 300, 500];
const DESFASE_PLACAS = 60;
const CENTROS_ABAJO = POS_PLACAS.map((c) => c + DESFASE_PLACAS);
const LUZ_ARRIBA = 78;
const LUZ_ABAJO = 162;

const PASOS_TRANSVERSAL: [number, number][] = [
  [120, 120], [102, 110], [136, 106], [108, 136], [140, 130], [96, 124], [126, 96], [124, 142],
];

/** Forma del latido: subida rápida (14 %), bajada hasta el 45 % y reposo. */
function latido(fase: number): number {
  if (fase < 0.14) return Math.sin(((fase / 0.14) * Math.PI) / 2);
  if (fase < 0.45) return 1 - (fase - 0.14) / 0.31;
  return 0;
}

export interface Vasos {
  raiz: HTMLElement;
  /** Contenedor de los dibujos: la vista añade aquí la lista de propiedades. */
  cuerpo: HTMLElement;
  /** «Cómo leerlos»: botón, explicación plegable y nota final (en el móvil van a una hoja). */
  botonLeer: HTMLButtonElement;
  textoLeer: HTMLElement;
  notaVasos: HTMLElement;
  /** «Rotular capas»: botón y activación desde fuera (fichas de rigidez y placa). */
  botonCapas: HTMLButtonElement;
  ponerCapas(activo: boolean): void;
  /** Resumen corto («luz 92 % · pared elástica») para la barra de los vasos plegados en el móvil. */
  resumen: string;
  poner(valores: Estado): void;
}

/** Una capa de la pared que se numera en el dibujo. */
export interface Capa {
  id: string;
  vaso: 'arteria' | 'arteriola';
  nombre: string;
  texto: string;
}

/** Posición de cada marca (en el arteria, sobre la pared de arriba, que late con ella). */
const MARCAS_ARTERIA: Record<string, [number, number]> = {
  intima: [36, 75],
  media: [110, 52],
  adventicia: [186, 27],
  placa: [POS_PLACAS[1], 90],
};
/** En la arteriola: ángulo (grados desde arriba, sentido horario) y radio. */
const MARCAS_ARTERIOLA: Record<string, [number, number]> = {
  endotelio: [45, 0],
  musculo: [-45, 71],
  adventiciaArteriola: [-135, 95],
};

/** `alLatir` se llama al empezar cada latido de la animación (para el sonido del pulso). */
/** `alLeer` permite abrir «Cómo leerlos» en otro sitio (la hoja del móvil): si devuelve true, no se despliega aquí. */
/** `alCapas` se llama al pulsar «Rotular capas» (en el móvil, para cerrar la hoja donde está el botón). */
export function crearVasos(alLatir?: () => void, alLeer?: () => boolean, capas: Capa[] = [], alCapas?: () => void): Vasos {
  const idLuz = idUnico('luz');
  const idRecorte = idUnico('recorte-luz');
  const idRecorteArt = idUnico('recorte-arteriola');

  // --- Longitudinal ---
  const tandas = [0, -ANCHO].map((dx) =>
    HEMATIES.map(([x, y]) => s('ellipse', { cx: x + dx, cy: y, rx: 9, ry: 5, class: 'hematie' })),
  );
  const grupoFlujo = s('g', {}, ...tandas.flat());
  // Posición de partida de cada hematíe (x de la tanda, y), para desviarlos al pasar por las placas.
  const origenes = tandas.flatMap((tanda, k) => tanda.map((el, i) => ({ el, x: HEMATIES[i][0] - k * ANCHO, y: HEMATIES[i][1] })));
  const onda = s('ellipse', { cx: 0, cy: 120, rx: 70, ry: 40, class: 'onda' });
  const placas = (y: number, desfase: number) =>
    POS_PLACAS.map((x) => s('ellipse', { cx: x + desfase, cy: y, rx: 46, ry: 0, class: 'placa-ateroma' }));
  const placasArriba = placas(LUZ_ARRIBA, 0);
  const placasAbajo = placas(LUZ_ABAJO, DESFASE_PLACAS);
  // Arteria elástica: láminas de elastina onduladas en la media.
  const laminas = (ys: number[]) =>
    ys.map((y) =>
      s('path', { d: `M0 ${y}` + ' q8 -2.5 16 0 t16 0'.repeat(ANCHO / 32), class: 'arteria-elastina', fill: 'none' }),
    );
  const paredArriba = s(
    'g',
    {},
    s('rect', { x: 0, y: 22, width: ANCHO, height: 56, class: 'arteria-media' }),
    ...laminas([40, 48, 56, 64]),
    s('rect', { x: 0, y: 22, width: ANCHO, height: 10, class: 'arteria-adventicia' }),
    s('rect', { x: 0, y: 72, width: ANCHO, height: 6, class: 'arteria-intima' }),
    ...placasArriba,
  );
  const paredAbajo = s(
    'g',
    {},
    s('rect', { x: 0, y: 162, width: ANCHO, height: 56, class: 'arteria-media' }),
    ...laminas([176, 184, 192, 200]),
    s('rect', { x: 0, y: 208, width: ANCHO, height: 10, class: 'arteria-adventicia' }),
    s('rect', { x: 0, y: 162, width: ANCHO, height: 6, class: 'arteria-intima' }),
    ...placasAbajo,
  );
  // Marcas numeradas de «Rotular capas» (ocultas por defecto). Al tocarlas o
  // pasar el cursor, un globo dice qué capa es (sin leyenda que ocupe alto).
  const numero = new Map(capas.map((c, i) => [c.id, i + 1]));
  const porCapa = new Map(capas.map((c) => [c.id, c]));
  const globo = h('div', { class: 'globo-capa', role: 'tooltip', id: idUnico('globo-capa'), hidden: true });
  let marcaFija: SVGGElement | null = null;
  function mostrarGlobo(g: SVGGElement) {
    const c = porCapa.get(g.dataset.capa ?? '');
    if (!c) return;
    globo.replaceChildren(
      h('strong', {}, `${numero.get(c.id)} · ${c.nombre}`),
      h('span', { class: 'globo-capa-vaso' }, c.vaso === 'arteria' ? ' · arteria grande' : ' · arteriola'),
      h('span', { class: 'globo-capa-texto' }, c.texto.charAt(0).toUpperCase() + c.texto.slice(1)),
    );
    if (!globo.isConnected) document.body.append(globo);
    globo.hidden = false;
    g.setAttribute('aria-describedby', globo.id);
    const r = rectCss(g.querySelector('circle:not(.marca-zona)')!.getBoundingClientRect());
    const ancho = globo.offsetWidth;
    const alto = globo.offsetHeight;
    const x = Math.min(anchoVentana() - ancho - 8, Math.max(8, r.left + r.width / 2 - ancho / 2));
    const arriba = r.top - alto - 8;
    const y = arriba >= 8 ? arriba : r.bottom + 8;
    globo.style.left = `${x}px`;
    globo.style.top = `${y}px`;
  }
  function ocultarGlobo() {
    globo.hidden = true;
    marcaFija = null;
  }
  const marca = (id: string) => {
    const c = porCapa.get(id)!;
    const g = s(
      'g',
      { class: 'marca-capa', 'data-capa': id, role: 'button', tabindex: 0, 'aria-label': `${numero.get(id)}: ${c.nombre}` },
      s('circle', { r: 28, class: 'marca-zona' }),
      s('circle', { r: 13 }),
      s('text', { y: 5.5, 'text-anchor': 'middle' }, String(numero.get(id) ?? '')),
    );
    g.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') mostrarGlobo(g);
    });
    g.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse' && marcaFija !== g) globo.hidden = true;
    });
    g.addEventListener('click', () => {
      if (marcaFija === g && !globo.hidden) return ocultarGlobo();
      marcaFija = g;
      mostrarGlobo(g);
    });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        g.dispatchEvent(new MouseEvent('click'));
      } else if (e.key === 'Escape') ocultarGlobo();
    });
    g.addEventListener('focus', () => mostrarGlobo(g));
    g.addEventListener('blur', () => ocultarGlobo());
    return g;
  };
  // Tocar fuera, hacer scroll o cambiar el tamaño cierra el globo.
  document.addEventListener('pointerdown', (e) => {
    if (!globo.hidden && !(e.target as Element).closest?.('.marca-capa')) ocultarGlobo();
  });
  window.addEventListener('scroll', ocultarGlobo, { passive: true });
  window.addEventListener('resize', ocultarGlobo);
  const marcasArteria = capas.filter((c) => c.vaso === 'arteria' && MARCAS_ARTERIA[c.id]).map((c) => {
    const g = marca(c.id);
    const [x, y] = MARCAS_ARTERIA[c.id];
    g.setAttribute('transform', `translate(${x} ${y})`);
    return g;
  });
  const grupoMarcasArteria = s('g', { class: 'marcas-capas' }, ...marcasArteria);
  paredArriba.append(grupoMarcasArteria);
  const marcaPlaca = marcasArteria.find((g) => g.dataset.capa === 'placa');

  const longitudinal = s(
    'svg',
    { viewBox: `0 0 ${ANCHO} 240`, role: 'img', class: 'vaso-longitudinal' },
    s(
      'defs',
      {},
      s(
        'linearGradient',
        { id: idLuz, x1: 0, y1: 0, x2: 0, y2: 1 },
        s('stop', { offset: 0, 'stop-color': '#4A1013' }),
        s('stop', { offset: 0.5, 'stop-color': '#6E1A1C' }),
        s('stop', { offset: 1, 'stop-color': '#4A1013' }),
      ),
      s('clipPath', { id: idRecorte }, s('rect', { x: 0, y: 70, width: ANCHO, height: 100 })),
    ),
    s('rect', { width: ANCHO, height: 240, class: 'vaso-fondo-arteria' }),
    s('rect', { x: 0, y: 70, width: ANCHO, height: 100, fill: `url(#${idLuz})` }),
    s('g', { 'clip-path': `url(#${idRecorte})` }, grupoFlujo, onda),
    paredArriba,
    paredAbajo,
    s('text', { x: 560, y: 126, class: 'vaso-rotulo' }, 'flujo →'),
    s('text', { x: 12, y: 16, class: 'vaso-escala' }, 'Ø ≈ 2 cm · pared elástica'),
    s('rect', { x: 1, y: 1, width: ANCHO - 2, height: 238, rx: 9, class: 'marco-arteria' }),
  );

  // --- Transversal ---
  const recorteLuz = s('circle', { cx: 120, cy: 120, r: 44 });
  const intima = s('circle', { cx: 120, cy: 120, r: 49, class: 'arteriola-intima' });
  const luz = s('circle', { cx: 120, cy: 120, r: 44, class: 'luz-arteriola' });
  const pasos = PASOS_TRANSVERSAL.map(([x, y]) => s('circle', { cx: x, cy: y, r: 7, class: 'hematie' }));
  const rotuloLuz = s('text', { x: 120, y: 232, 'text-anchor': 'middle', class: 'vaso-rotulo-luz' });
  // Arteriola muscular: células de músculo liso en anillos, sin láminas elásticas.
  const musculo = [60, 71, 81].flatMap((r, anillo) => {
    const n = 16 + anillo * 5;
    return Array.from({ length: n }, (_, i) => {
      const a = ((i + (anillo % 2) * 0.5) / n) * 360;
      const x = 120 + r * Math.sin((a * Math.PI) / 180);
      const y = 120 - r * Math.cos((a * Math.PI) / 180);
      return s('ellipse', { cx: x.toFixed(1), cy: y.toFixed(1), rx: 7, ry: 1.8, class: 'arteriola-musculo', transform: `rotate(${a.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})` });
    });
  });
  const polar = (grados: number, r: number): [number, number] => [
    120 + r * Math.sin((grados * Math.PI) / 180),
    120 - r * Math.cos((grados * Math.PI) / 180),
  ];
  const marcasArteriola = capas.filter((c) => c.vaso === 'arteriola' && MARCAS_ARTERIOLA[c.id]).map((c) => {
    const g = marca(c.id);
    g.setAttribute('class', 'marca-capa marca-arteriola');
    const [a, r] = MARCAS_ARTERIOLA[c.id];
    if (r > 0) g.setAttribute('transform', `translate(${polar(a, r).map((n) => n.toFixed(1)).join(' ')})`);
    return g;
  });
  const marcaEndotelio = marcasArteriola.find((g) => g.dataset.capa === 'endotelio');
  const grupoMarcasArteriola = s('g', { class: 'marcas-capas' }, ...marcasArteriola);

  const transversal = s(
    'svg',
    { viewBox: '0 0 240 240', role: 'img', class: 'vaso-transversal' },
    s('defs', {}, s('clipPath', { id: idRecorteArt }, recorteLuz)),
    s('rect', { width: 240, height: 240, rx: 10, class: 'vaso-fondo-arteriola' }),
    s('circle', { cx: 120, cy: 120, r: 100, class: 'arteriola-adventicia' }),
    s('circle', { cx: 120, cy: 120, r: 90, class: 'arteriola-media' }),
    ...musculo,
    intima,
    luz,
    s('g', { 'clip-path': `url(#${idRecorteArt})` }, ...pasos),
    s('text', { x: 10, y: 16, class: 'vaso-escala' }, 'Ø ≈ 30 µm'),
    grupoMarcasArteriola,
    rotuloLuz,
    s('rect', { x: 1.5, y: 1.5, width: 237, height: 237, rx: 9, class: 'marco-arteriola' }),
    s('rect', { x: 5, y: 5, width: 230, height: 230, rx: 6, class: 'marco-arteriola fino' }),
  );

  // --- Botón de pausa ---
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pausado = reducir.matches;
  const iconoPausa = s('path', { d: 'M4 2.5v9M10 2.5v9', class: 'icono-trazo', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
  const iconoPlay = s('path', { d: 'M4 2.5v9l7-4.5z', class: 'icono-relleno' });
  const textoPausa = h('span');
  const botonPausa = h(
    'button',
    { type: 'button', class: 'boton boton-pausa' },
    s('svg', { width: 14, height: 14, viewBox: '0 0 14 14', 'aria-hidden': 'true' }, iconoPausa, iconoPlay),
    textoPausa,
  );
  textoPausa.classList.add('texto-boton');

  // «Cómo leer los vasos»: explicación plegable para no ocupar alto en el tablero.
  const textoLeer = h(
    'p',
    { id: 'como-leer-vasos', class: 'tenue pequeno', hidden: true },
    'Movimiento: velocidad de la sangre = gasto cardíaco · ritmo = frecuencia · amplitud del latido = elasticidad. En la arteriola el pulso ya llega amortiguado.',
  );
  const botonLeer = h(
    'button',
    { type: 'button', class: 'boton boton-leer', 'aria-expanded': 'false', 'aria-controls': 'como-leer-vasos' },
    // Icono solo en el móvil, donde el botón no lleva texto.
    s('svg', { width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': 'true', class: 'icono-movil' },
      s('circle', { cx: 8, cy: 8, r: 6.5, class: 'icono-trazo', fill: 'none', 'stroke-width': 1.4 }),
      s('path', { d: 'M8 7v4.2', class: 'icono-trazo', 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
      s('circle', { cx: 8, cy: 4.8, r: 0.95, class: 'icono-relleno' }),
    ),
    h('span', { class: 'texto-boton' }, 'Cómo leerlos'),
  );
  botonLeer.addEventListener('click', () => {
    if (alLeer?.()) return;
    const abrir = textoLeer.hidden;
    textoLeer.hidden = !abrir;
    botonLeer.setAttribute('aria-expanded', String(abrir));
  });
  // «Rotular capas»: interruptor (en el móvil, dentro de la hoja «Cómo leer los vasos»).
  const botonCapas = h(
    'button',
    { type: 'button', class: 'boton boton-capas', 'aria-pressed': 'false', title: 'Numera las capas de la pared: toca un número o pasa el cursor por encima para ver qué es' },
    s('svg', { width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': 'true', class: 'icono-movil' },
      s('path', { d: 'M8 2 14 5 8 8 2 5z', class: 'icono-trazo', fill: 'none', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }),
      s('path', { d: 'M2 8l6 3 6-3M2 11l6 3 6-3', class: 'icono-trazo', fill: 'none', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }),
    ),
    h('span', { class: 'texto-boton' }, 'Rotular capas'),
  );
  let capasActivas = false;
  function ponerCapas(activo: boolean) {
    capasActivas = activo;
    botonCapas.setAttribute('aria-pressed', String(activo));
    grupoMarcasArteria.style.display = activo ? '' : 'none';
    grupoMarcasArteriola.style.display = activo ? '' : 'none';
    if (!activo) ocultarGlobo();
  }
  botonCapas.addEventListener('click', () => {
    ponerCapas(!capasActivas);
    alCapas?.();
  });

  const cuerpo = h(
    'div',
    { class: 'vasos-cuerpo' },
    h(
      'div',
      { class: 'vasos-figuras' },
      h(
        'figure',
        { class: 'figura-longitudinal' },
        longitudinal,
        h('figcaption', {}, h('span', { class: 'fuerte' }, 'Arteria grande', h('span', { class: 'rol-vaso' }, ' · conducción')), h('span', { class: 'tenue' }, 'corte longitudinal · pulso, rigidez y placas')),
      ),
      h(
        'figure',
        { class: 'figura-transversal' },
        transversal,
        h('figcaption', {}, h('span', { class: 'fuerte' }, 'Arteriola', h('span', { class: 'rol-vaso' }, ' · resistencia')), h('span', { class: 'tenue' }, 'corte transversal · luz')),
      ),
    ),
  );
  const notaVasos = h(
    'p',
    { class: 'nota-vasos' },
    h('strong', {}, 'Dos vasos distintos. '),
    'La placa se forma en la arteria grande y la vuelve rígida; no estrecha la arteriola, que es donde está la resistencia.',
  );
  const raiz = h(
    'div',
    { class: 'tarjeta vasos' },
    h('div', { class: 'tarjeta-cabecera' }, h('h2', { id: 't-vasos' }, 'Vasos'), h('div', { class: 'botones-vasos' }, botonLeer, botonCapas, botonPausa)),
    textoLeer,
    cuerpo,
    notaVasos,
  );

  // --- Estado de la animación ---
  let duracionFlujo = 4;
  let duracionLatido = 1;
  let duracionPaso = 1.8;
  let amplitud = 6;
  // Tamaño actual de las placas (semiejes), para que los hematíes las sorteen.
  let placaRx = 46;
  let placaRy = 0;
  /** Cuánto invade la placa (con margen) a la altura x: suave y algo más ancho que la placa. */
  function invasion(x: number, centros: number[]) {
    if (placaRy === 0) return 0;
    const alcance = placaRx + 35;
    let max = 0;
    for (const c of centros) {
      const d = Math.abs(x - c) / alcance;
      if (d < 1) max = Math.max(max, (placaRy + 8) * Math.cos((d * Math.PI) / 2));
    }
    return max;
  }
  // Velocidad según el ancho libre (continuidad: canal la mitad de ancho, el
  // doble de rápido; como mucho 2,5 veces). Tabla: recorrido uniforme → x real,
  // con el mismo total para que el bucle no salte.
  let tablaX = Float32Array.from({ length: ANCHO + 1 }, (_, i) => i);
  function calcularVelocidades() {
    const tiempo = new Float32Array(ANCHO + 1);
    for (let x = 1; x <= ANCHO; x++) {
      const libre = LUZ_ABAJO - LUZ_ARRIBA - invasion(x - 0.5, POS_PLACAS) - invasion(x - 0.5, CENTROS_ABAJO);
      const rapidez = Math.min(2.5, (LUZ_ABAJO - LUZ_ARRIBA) / Math.max(1, libre));
      tiempo[x] = tiempo[x - 1] + 1 / rapidez;
    }
    const escala = ANCHO / tiempo[ANCHO];
    const tabla = new Float32Array(ANCHO + 1);
    let x = 0;
    for (let i = 0; i <= ANCHO; i++) {
      while (x < ANCHO && tiempo[x + 1] * escala < i) x++;
      const a = tiempo[x] * escala;
      const b = x < ANCHO ? tiempo[x + 1] * escala : a + 1;
      tabla[i] = x + (b > a ? (i - a) / (b - a) : 0);
    }
    tablaX = tabla;
  }
  function posicion(recorrido: number) {
    const i = Math.floor(recorrido);
    if (i >= ANCHO) return ANCHO;
    return tablaX[i] + (tablaX[i + 1] - tablaX[i]) * (recorrido - i);
  }
  let faseFlujo = 0;
  let faseLatido = 0;
  let fasePaso = 0;
  let ultimo: number | null = null;
  let peticion = 0;

  function dibujar() {
    const l = latido(faseLatido);
    // Hematíes: avanzan con el flujo y, donde hay placa, la sortean. El canal
    // libre se estrecha y las líneas de corriente se juntan (sin atravesarla).
    // En el estrechamiento van más deprisa (lo que pasa en una estenosis).
    const avance = faseFlujo * ANCHO;
    const pulso = amplitud * l;
    for (const h of origenes) {
      const recorrido = h.x + avance;
      if (recorrido < 0 || recorrido > ANCHO) {
        h.el.setAttribute('transform', `translate(${avance.toFixed(1)} 0)`);
        continue;
      }
      const x = posicion(recorrido);
      const arriba = LUZ_ARRIBA - pulso + invasion(x, POS_PLACAS);
      const abajo = LUZ_ABAJO + pulso - invasion(x, CENTROS_ABAJO);
      const y = arriba + ((h.y - LUZ_ARRIBA) / (LUZ_ABAJO - LUZ_ARRIBA)) * (abajo - arriba);
      h.el.setAttribute('transform', `translate(${(x - h.x).toFixed(1)} ${(y - h.y).toFixed(1)})`);
    }
    paredArriba.setAttribute('transform', `translate(0 ${(-amplitud * l).toFixed(2)})`);
    paredAbajo.setAttribute('transform', `translate(0 ${(amplitud * l).toFixed(2)})`);
    // Onda de pulso: recorre la luz con el periodo del latido (aceleración inicial).
    const x = -160 + 960 * faseLatido * faseLatido;
    onda.setAttribute('transform', `translate(${x.toFixed(1)} 0)`);
    pasos.forEach((c, i) => {
      const f = (fasePaso + i / pasos.length) % 1;
      const escala = f < 0.35 ? 0.4 + (0.6 * f) / 0.35 : 1 + (0.35 * (f - 0.35)) / 0.65;
      const opacidad = f < 0.35 ? f / 0.35 : 1 - (f - 0.35) / 0.65;
      const [cx, cy] = PASOS_TRANSVERSAL[i];
      c.setAttribute('transform', `translate(${cx} ${cy}) scale(${escala.toFixed(3)}) translate(${-cx} ${-cy})`);
      c.setAttribute('opacity', opacidad.toFixed(3));
    });
  }

  function cuadro(t: number) {
    if (ultimo !== null) {
      const dt = Math.min(0.1, (t - ultimo) / 1000);
      faseFlujo = (faseFlujo + dt / duracionFlujo) % 1;
      const siguiente = faseLatido + dt / duracionLatido;
      if (siguiente >= 1) alLatir?.();
      faseLatido = siguiente % 1;
      fasePaso = (fasePaso + dt / duracionPaso) % 1;
    }
    ultimo = t;
    dibujar();
    peticion = requestAnimationFrame(cuadro);
  }

  function aplicarPausa() {
    textoPausa.textContent = pausado ? 'Reanudar' : 'Pausar';
    botonPausa.setAttribute('aria-label', pausado ? 'Reanudar la animación de los vasos' : 'Pausar la animación de los vasos');
    iconoPausa.style.display = pausado ? 'none' : '';
    iconoPlay.style.display = pausado ? '' : 'none';
    cancelAnimationFrame(peticion);
    ultimo = null;
    if (!pausado) peticion = requestAnimationFrame(cuadro);
    else dibujar();
  }
  botonPausa.addEventListener('click', () => {
    pausado = !pausado;
    aplicarPausa();
  });
  reducir.addEventListener('change', () => {
    pausado = reducir.matches;
    aplicarPausa();
  });
  aplicarPausa();
  ponerCapas(false);

  return {
    raiz,
    cuerpo,
    botonLeer,
    textoLeer,
    notaVasos,
    botonCapas,
    ponerCapas,
    resumen: '',
    poner(v) {
      const gc = v.gc ?? 0;
      const fc = v.fc ?? 0;
      const rigidez = v.rigidez ?? 0;
      const placa = Math.max(0, v.placa ?? 0);
      const volemia = v.volemia ?? 0;
      const rvp = v.rvp ?? 0;
      duracionFlujo = 4 / (1 + 0.8 * gc);
      duracionLatido = 1 / (1 + 0.6 * fc);
      duracionPaso = 1.8 / (1 + 0.8 * gc);
      amplitud = rigidez < 0.15 ? 6 : rigidez < 0.5 ? 3 : 1;

      // Placas: crecen con el nodo; por debajo de 0,15 no se ven. Como mucho
      // invaden 26 de los 84 de la luz (caso 1, placa ≈ 0,86: unos 23).
      const alto = placa < 0.15 ? 0 : 5 + 21 * Math.min(1, placa);
      placaRy = alto;
      placaRx = 46 + 12 * Math.min(1, placa);
      for (const p of [...placasArriba, ...placasAbajo]) {
        p.setAttribute('ry', alto.toFixed(1));
        p.setAttribute('rx', placaRx.toFixed(1));
      }
      calcularVelocidades();

      // Llenado: de 12 a 36 hematíes por tanda según la volemia (24 en lo normal).
      const visibles = Math.round(24 + 12 * Math.max(-1, Math.min(1, volemia)));
      ORDEN_LLENADO.forEach((idx, orden) => {
        const ver = orden < visibles;
        for (const tanda of tandas) tanda[idx].style.display = ver ? '' : 'none';
      });

      const radio = 44 * (1 - 0.35 * Math.max(-1, Math.min(1, rvp)));
      recorteLuz.setAttribute('r', radio.toFixed(1));
      luz.setAttribute('r', radio.toFixed(1));
      intima.setAttribute('r', (radio + 5).toFixed(1));
      if (marcaEndotelio) marcaEndotelio.setAttribute('transform', `translate(${polar(MARCAS_ARTERIOLA.endotelio[0], radio + 2.5).map((n) => n.toFixed(1)).join(' ')})`);
      if (marcaPlaca) marcaPlaca.style.display = alto === 0 ? 'none' : '';
      const pct = Math.round((radio / 44) * 100);
      rotuloLuz.textContent = `luz ${pct} % de lo normal`;

      const latidoTexto = amplitud === 6 ? 'pared elástica que se distiende en cada latido' : amplitud === 3 ? 'pared algo rígida, se distiende poco' : 'pared rígida, casi no se distiende';
      const placasTexto = alto === 0 ? 'sin placas' : placa < 0.5 ? 'con algunas placas' : 'con placas grandes';
      const flujoTexto = gc >= 0.15 ? 'flujo rápido' : gc <= -0.15 ? 'flujo lento' : 'flujo normal';
      longitudinal.setAttribute('aria-label', `Arteria grande en corte longitudinal: ${latidoTexto}, ${placasTexto}, ${flujoTexto}.`);
      this.resumen = `luz ${pct} % · ${amplitud === 6 ? 'pared elástica' : amplitud === 3 ? 'algo rígida' : 'rígida'}${alto === 0 ? '' : ' · placas'}`;
      transversal.setAttribute('aria-label', `Arteriola en corte transversal: luz al ${pct} % de lo normal.`);
      if (pausado) dibujar();
    },
  };
}
