import { combinacionHipotetica, frecuenciaDe, fueraDeRango, interaccionesActivas, notasActivas, type CausaNoComun } from '../motor/avisos';
import { aplicarVariantes, flecha, simular, varianteDe, type Resultado } from '../motor/motor';
import { causasDeReto, clavesAutomaticas, corregirReto, valoresPista } from '../motor/reto';
import type { Caso, CorreccionReto, Escala, Interaccion, Momento, Reto } from '../motor/tipos';
import { traducir } from '../motor/valores';
import { temaPorId, TEMA_POR_DEFECTO } from '../temas/registro';
import { h, s } from './dom';
import { iniciarAmpliarIA } from './ampliar-ia';
import { crearCompartir, ICONO_ENLACE, type ChipEnlace } from './compartir';
import { causasActivas, codificar, codificarReto, conTema, decodificar, decodificarReto, leerTema, MAX_CAUSAS_RETO, type EstadoCompartido, type MandosEnlace } from './enlace-caso';
import { imprimirFicha, type DatosFicha } from './exportar';
import { crearEnlazador } from './enlaces';
import { direccionEnlace, escucharHub, type AvisoHub } from './hub';
import { crearFicha } from './ficha';
import { enPalabras, NOMBRE_ESCALA, textoDosis, textoMando, tono } from './formato';
import { crearDial, crearVentana, type Indicador } from './indicadores';
import { crearMando, type Mando } from './mando';
import { crearHoja, MOVIL } from './hoja';
import { crearMovil, type VistaPanel } from './movil';
import { crearSelectorCaso, type ChipCaso } from './selector-caso';
import { consulta, guardarSonido, guardarValores, ponerTamano, ponerTema, sonidoGuardado, tamanoActual, temaActual, valoresGuardados, zoomPagina, type Tamano, type Tema } from './preferencias';
import { crearSonido } from './sonido';
import { crearVasos } from './vasos';
import './estilos.css';

// --- Tema del simulador (fase N2) ---
// La dirección elige el tema (#t=…); sin él, o con uno que no existe, la hipertensión.
// Todo lo del tema sale del registro: la interfaz no conoce ningún tema por su nombre.
const tema = temaPorId(leerTema(location.hash).tema);
const { modelo, fichas, retos, terminos, panelAnalitica } = tema;
const { orientativos: valoresOrientativos, nota: notaValores } = tema.valores;
const ordenCausas = tema.mandos.causas;
const ordenFarmacos = tema.mandos.farmacos;
const ordenSesion = tema.mandos.sesion;
const ordenEntrenamiento = tema.mandos.entrenamiento;
const ordenEjercicio = [...ordenSesion, ...ordenEntrenamiento];
const {
  capasVaso,
  casosConRetencion,
  determinantes,
  farmacosVista,
  fuentes: FUENTES,
  evitaEnPista,
  gruposClavesReto,
  gruposMecanismos,
  nombreAnalitica,
  nombreCorto,
  notaRetencion,
  propiedadesVaso,
  queMirar,
} = tema.vista;
/** Fragmento de la dirección sin el tema (sin «#»): el caso o el reto compartido. */
const fragmento = () => leerTema(location.hash).resto;
/** Quita el caso o el reto de la dirección; en un tema que no es el de por defecto, deja el tema. */
const quitarFragmento = () => {
  const base = location.href.split('#')[0];
  history.replaceState(history.state, '', tema.id === TEMA_POR_DEFECTO.id ? base : `${base}#${conTema('', tema.id, TEMA_POR_DEFECTO.id)}`);
};
/** Fragmento de un enlace (sin «#») con el tema del simulador. */
const enTema = (f: string) => conTema(f, tema.id, TEMA_POR_DEFECTO.id);

const porId = new Map(modelo.nodos.map((n) => [n.id, n]));
const nodo = (id: string) => {
  const n = porId.get(id);
  if (!n) throw new Error(`Nodo desconocido «${id}»`);
  return n;
};
const corto = (id: string) => nombreCorto[id] ?? nodo(id).nombre;
const reglasAvisos = modelo.avisos!;
/** Nombre corto sin los guiones blandos (que solo sirven para partir en las placas). */
const cortoLimpio = (id: string) => corto(id).replace(/\u00AD/g, '');

// --- Estado ---
const causas: Record<string, number> = Object.fromEntries(ordenCausas.map((id) => [id, 0]));
/** Dosis de los fármacos (fase 4), de 0 a 1. */
const farmacos: Record<string, number> = Object.fromEntries(ordenFarmacos.map((id) => [id, 0]));
/** Ejercicio (fase 5): intensidad de la sesión y entrenamiento, de 0 a 1. */
const ejercicio: Record<string, number> = Object.fromEntries(ordenEjercicio.map((id) => [id, 0]));
/** Momento de la sesión: «antes» es el paciente en reposo, con la escala de tiempo de siempre. */
let momento: Momento = 'antes';
/**
 * Fase 7: variante de las causas que las tienen (estenosis bilateral, unilateral
 * o de riñón único). Siempre con todas: la de siempre es la primera del nodo.
 */
const causasConVariantes = modelo.nodos.filter((n) => n.tipo === 'causa' && n.variantes?.length);
const variantesIniciales = () => Object.fromEntries(causasConVariantes.map((n) => [n.id, n.variantes![0].id]));
const variantes: Record<string, string> = variantesIniciales();
const ponerVariantes = (v: Record<string, string> = {}) => {
  for (const n of causasConVariantes) variantes[n.id] = varianteDe(modelo, n.id, v)!;
};
const variante = (id: string) => nodo(id).variantes?.find((x) => x.id === variantes[id]);
/** El modelo con las variantes elegidas, para las fichas (las relaciones que actúan de verdad). */
const modelosVariante = new Map<string, typeof modelo>();
function modeloActual() {
  const clave = JSON.stringify(variantes);
  let m = modelosVariante.get(clave);
  if (!m) modelosVariante.set(clave, (m = aplicarVariantes(modelo, variantes)));
  return m;
}
/** Causas, dosis y ejercicio juntos: las entradas del motor. */
const entradas = () => ({ ...causas, ...farmacos, ...ejercicio });
const hayFarmacos = () => Object.values(farmacos).some((v) => v !== 0);
const hayEjercicio = () => Object.values(ejercicio).some((v) => v !== 0);
const hayEntradas = () => Object.values(causas).some((v) => v !== 0) || hayFarmacos() || hayEjercicio();
/** En la sesión (durante o al terminar) la escala de tiempo no cuenta: se parte del estado estable. */
const enSesion = () => momento !== 'antes';
const NOMBRE_MOMENTO: Record<Momento, string> = { antes: 'Antes', durante: 'Durante', despues: 'Al terminar' };
/** «Durante la sesión», «Al terminar la sesión» o el nombre de la escala. */
const nombreTiempo = () => (enSesion() ? `${momento === 'durante' ? 'Durante' : 'Al terminar'} la sesión` : NOMBRE_ESCALA[escala]);
let escala: Escala = 'estable';
let resultado: Resultado = simular(modelo, {}, escala);

const cache = new Map<string, Resultado>();
function calcular(): Resultado {
  const activas = Object.fromEntries(Object.entries(entradas()).filter(([, v]) => v !== 0));
  const clave = `${escala}|${momento}|${JSON.stringify(activas)}|${JSON.stringify(variantes)}`;
  let r = cache.get(clave);
  if (!r) {
    r = simular(modelo, activas, escala, { momento, variantes });
    if (cache.size > 300) cache.clear();
    cache.set(clave, r);
  }
  return r;
}

/** Caso cuyas causas y fármacos coinciden exactamente con los mandos, si lo hay. */
function casoActual(): Caso | undefined {
  return modelo.casos.find((c) =>
    ordenCausas.every((id) => Math.abs((c.causas[id] ?? 0) - causas[id]) < 1e-9) &&
    ordenFarmacos.every((id) => Math.abs((c.farmacos?.[id] ?? 0) - farmacos[id]) < 1e-9) &&
    ordenEjercicio.every((id) => Math.abs((c.ejercicio?.[id] ?? 0) - ejercicio[id]) < 1e-9) &&
    // La variante solo cuenta si la causa está girada (con la estenosis a 0 da igual).
    causasConVariantes.every((n) => causas[n.id] === 0 || varianteDe(modelo, n.id, c.variantes) === variantes[n.id]),
  );
}

// --- Cabecera ---
// Selector de casos (fase 5, opción C): lista con buscador y chips de lo que lleva cada caso.
const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
/** Pantalla táctil como puntero principal: los mandos se giran manteniéndolos pulsados. */
const dedo = () => window.matchMedia('(pointer: coarse)').matches;
/** Chip de una causa: el extremo de la rueda si es bipolar («Hipotiroidismo», «SIADH», «Sal alta»). */
function chipCausa(id: string, v: number): ChipCaso {
  const n = nodo(id);
  const [min, max] = n.rango;
  let texto = cortoLimpio(id);
  if (min < 0 && max > 0 && n.etiquetas) texto = id === 'sal' ? `Sal ${n.etiquetas[v < 0 ? 0 : 1]}` : capital(n.etiquetas[v < 0 ? 0 : 1]);
  else if (max <= 0 && n.etiquetas) texto = `${texto} ${n.etiquetas[0]}`;
  return { texto, tipo: frecuenciaDe(n, v) ?? 'comun' };
}
const NOMBRE_MOMENTO_CHIP: Record<Momento, string> = { antes: '', durante: ' · durante', despues: ' · al terminar' };
const selector = crearSelectorCaso({
  casos: modelo.casos,
  grupos: [
    { titulo: 'Casos básicos', incluye: (c) => !c.farmacos && !c.ejercicio && !c.variantes },
    { titulo: 'Con fármacos', incluye: (c) => !!c.farmacos && !c.ejercicio && !c.variantes },
    { titulo: 'Con ejercicio', incluye: (c) => !!c.ejercicio },
    { titulo: 'Estenosis unilateral', incluye: (c) => !!c.variantes },
  ],
  chips: (c) => [
    ...Object.entries(c.causas).map(([id, v]) => {
      const chip = chipCausa(id, v);
      const va = nodo(id).variantes?.find((x) => x.id === c.variantes?.[id]);
      return va ? { ...chip, texto: `${chip.texto} ${va.corto}` } : chip;
    }),
    ...Object.keys(c.farmacos ?? {}).map((id) => ({ texto: cortoLimpio(id), tipo: 'farmaco' })),
    ...Object.keys(c.ejercicio ?? {}).map((id) => ({
      texto: `${ordenSesion.includes(id) ? 'Sesión' : 'Entreno'} ${cortoLimpio(id).toLowerCase()}${ordenSesion.includes(id) ? NOMBRE_MOMENTO_CHIP[c.momento ?? 'antes'] : ''}`,
      tipo: 'ejercicio',
    })),
  ],
  alElegir: (c) => cargarCaso(c ?? undefined),
});
const selectorCaso = selector.boton;
// En el móvil la cabecera no tiene sitio para «Modo reto»: se entra desde la lista de casos (y en la pantalla ancha, también).
const entradaReto = h(
  'button',
  { type: 'button', class: 'selector-reto' },
  h('span', { class: 'selector-reto-titulo' }, 'Modo reto'),
  h('span', { class: 'selector-reto-texto' }, `${retos.length} pacientes con las causas ocultas: dedúcelas con la presión, los mecanismos y la analítica`),
);
entradaReto.addEventListener('click', () => {
  selector.dialogo.close();
  entrarReto();
});
selector.dialogo.querySelector('.selector-resultados')?.before(entradaReto);
const botonesEscala = (['minutos', 'dias', 'estable'] as Escala[]).map((e) => {
  // En el móvil, «Estado estable» se abrevia a «Estable».
  const b = h(
    'button',
    { type: 'button', 'data-escala': e, 'aria-pressed': 'false' },
    e === 'estable' ? h('span', { class: 'escala-larga' }, NOMBRE_ESCALA[e]) : NOMBRE_ESCALA[e],
    e === 'estable' ? h('span', { class: 'escala-corta' }, 'Estable') : null,
  );
  b.addEventListener('click', () => {
    escala = e;
    // Elegir una escala de tiempo vuelve al paciente en reposo.
    momento = 'antes';
    actualizar();
  });
  return b;
});
const interruptorEscala = h('div', { role: 'group', 'aria-label': 'Escala de tiempo', class: 'interruptor interruptor-escala' }, ...botonesEscala);
const notaEscalaSesion = h('span', { class: 'nota-escala-sesion', hidden: true }, 'La sesión parte del estado estable');
// En el móvil, Sonido y Restablecer van solo con icono (el nombre sigue para el lector de pantalla).
const botonRestablecer = h(
  'button',
  { type: 'button', class: 'boton boton-restablecer', title: 'Restablecer: todas las causas a normal, sin fármacos ni ejercicio y estado estable' },
  s('svg', { width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': 'true', class: 'icono-movil' },
    s('path', { d: 'M13 8.5a5 5 0 1 1-1.6-4.2', class: 'icono-trazo', fill: 'none', 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
    s('path', { d: 'M12 1.5v3.3H8.7', class: 'icono-trazo', fill: 'none', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ),
  h('span', { class: 'texto-boton' }, 'Restablecer'),
);

// --- Sonido (apagado al cargar) ---
const sonido = crearSonido();
const botonSonido = h(
  'button',
  { type: 'button', class: 'boton boton-sonido', 'aria-pressed': 'false', title: 'Sonido: sintonía al girar los mandos y pulso al ritmo del corazón' },
  s('svg', { width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': 'true' },
    s('path', { d: 'M2 6h3l4-3v10l-4-3H2z', class: 'icono-relleno' }),
    s('path', { d: 'M11 5.5c1.2 1.4 1.2 3.6 0 5M12.8 3.8c2.1 2.4 2.1 6 0 8.4', class: 'icono-trazo icono-ondas', fill: 'none', 'stroke-width': 1.4, 'stroke-linecap': 'round' }),
  ),
  h('span', { class: 'texto-boton' }, 'Sonido'),
);
const TITULO_SONIDO = botonSonido.title;
/** Botón «en espera»: encendido, pero el navegador aún no deja sonar. */
function sonidoEnEspera(si: boolean) {
  botonSonido.toggleAttribute('data-espera', si);
  botonSonido.title = si ? 'Sonido activo: toca la pantalla para que empiece' : TITULO_SONIDO;
  if (si) botonSonido.setAttribute('aria-label', 'Sonido activo: toca la pantalla para que empiece');
  else botonSonido.removeAttribute('aria-label');
}
botonSonido.addEventListener('click', () => {
  const activo = sonido.alternar();
  botonSonido.setAttribute('aria-pressed', String(activo));
  sonidoEnEspera(false);
  guardarSonido(activo);
});
// Si se dejó encendido en la visita anterior, el botón aparece encendido pero
// «en espera»: el navegador solo deja sonar tras la primera pulsación en la página.
if (sonidoGuardado()) {
  botonSonido.setAttribute('aria-pressed', 'true');
  sonidoEnEspera(true);
  sonido.restaurar(() => sonidoEnEspera(false));
}

// --- Chip «Tratamiento» (fase 4): fármacos activos; abre la pestaña Fármacos ---
const ICONO_PASTILLA = () =>
  s('svg', { width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': 'true', class: 'icono-pastilla' },
    s('rect', { x: 1.5, y: 5, width: 13, height: 6, rx: 3, transform: 'rotate(-35 8 8)', fill: 'none', class: 'icono-trazo', 'stroke-width': 1.4 }),
    s('path', { d: 'M5.8 4.9l4.4 6.2', class: 'icono-trazo', 'stroke-width': 1.4 }),
  );
const textoChip = h('span', { class: 'chip-tratamiento-texto' });
const chipTratamiento = h('button', { type: 'button', class: 'chip-tratamiento', hidden: true }, ICONO_PASTILLA(), textoChip);
chipTratamiento.addEventListener('click', () => ponerVistaPanel('farmacos', true));

// --- Chip «Ejercicio» (fase 5): sesión y entrenamiento; abre la pestaña Ejercicio ---
const ICONO_EJERCICIO = () =>
  s('svg', { width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': 'true', class: 'icono-pastilla' },
    s('circle', { cx: 10, cy: 2.6, r: 1.6, class: 'icono-relleno' }),
    s('path', { d: 'M4 7.2l2.6-2 3 .6 1.6 2.4 2 .6M6.6 5.2 5.4 9.6l3 1.6-.8 3.6M5.4 9.6 3 13.4', fill: 'none', class: 'icono-trazo', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  );
const textoChipEjercicio = h('span', { class: 'chip-tratamiento-texto' });
const chipEjercicio = h('button', { type: 'button', class: 'chip-tratamiento chip-ejercicio', hidden: true }, ICONO_EJERCICIO(), textoChipEjercicio);
chipEjercicio.addEventListener('click', () => ponerVistaPanel('ejercicio', true));

// --- Ajustes: tema y tamaño (se recuerdan en este dispositivo) ---
/** Fase 6, punto 5: mostrar cifras orientativas junto a las flechas. */
let verValores = valoresGuardados(tema.id);
const ICONO_AJUSTES = () =>
  s('svg', { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    s('circle', { cx: 12, cy: 12, r: 3.2, class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7 }),
    s('path', {
      d: 'M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4.9a7.5 7.5 0 0 0-2.6-1.5L14 2.4h-4l-.4 2.5A7.5 7.5 0 0 0 7 6.4l-2.4-.9-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-.9a7.5 7.5 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.5 7.5 0 0 0 2.6-1.5l2.4.9 2-3.4Z',
      class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7, 'stroke-linejoin': 'round',
    }),
  );
function grupoAjuste<T extends string>(titulo: string, opciones: [T, string][], actual: () => T, poner: (v: T) => void) {
  const idTitulo = `ajuste-${titulo.toLowerCase()}`;
  const botones = opciones.map(([valor, texto]) => {
    const b = h('button', { type: 'button', 'data-valor': valor, 'aria-pressed': 'false' }, texto);
    b.addEventListener('click', () => {
      poner(valor);
      pintar();
    });
    return b;
  });
  const pintar = () => botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valor === actual())));
  pintar();
  return h('div', { class: 'grupo-ajuste' }, h('span', { id: idTitulo }, titulo), h('div', { class: 'interruptor', role: 'group', 'aria-labelledby': idTitulo }, ...botones));
}
const botonAjustes = h(
  'button',
  { type: 'button', class: 'boton boton-ajustes', 'aria-expanded': 'false', 'aria-controls': 'panel-ajustes', title: 'Ajustes: tema y tamaño' },
  ICONO_AJUSTES(),
  h('span', { class: 'texto-boton' }, 'Ajustes'),
);
const cerrarAjustes = h('button', { type: 'button', class: 'boton cerrar-ajustes' }, 'Cerrar');
const panelAjustes = h(
  'div',
  { id: 'panel-ajustes', class: 'panel-ajustes', role: 'dialog', 'aria-labelledby': 't-ajustes', hidden: true },
  h('div', { class: 'cabecera-ajustes' }, h('h2', { id: 't-ajustes' }, 'Ajustes'), cerrarAjustes),
);
const contenidoAjustes = [
  grupoAjuste<Tema>('Tema', [['retro', 'Retro'], ['clasico', 'Clásico']], temaActual, ponerTema),
  grupoAjuste<Tamano>('Tamaño', [['normal', 'Normal'], ['grande', 'Grande']], tamanoActual, ponerTamano),
  // Fase 6, punto 5: cifras orientativas, desactivadas por defecto.
  grupoAjuste<'no' | 'si'>('Valores orientativos', [['no', 'No'], ['si', 'Sí']], () => (verValores ? 'si' : 'no'), (x) => {
    verValores = x === 'si';
    guardarValores(tema.id, verValores);
    actualizar();
  }),
  h('p', { class: 'nota-ajustes nota-valores' }, notaValores),
  h('p', { class: 'nota-ajustes' }, 'Estos ajustes y el del sonido se guardan en este dispositivo.'),
];
panelAjustes.append(...contenidoAjustes);
// En el móvil, Ajustes es una hoja como las demás: asa, deslizar hacia abajo
// para cerrar y «atrás» del sistema. El contenido se mueve a la hoja y vuelve
// al panel al cerrarla.
const hojaAjustes = crearHoja();
hojaAjustes.raiz.addEventListener('close', () => {
  panelAjustes.append(...contenidoAjustes);
  botonAjustes.setAttribute('aria-expanded', 'false');
});
const veloAjustes = h('div', { class: 'velo-ajustes', hidden: true });
function abrirAjustes(si: boolean) {
  if (si && MOVIL.matches) {
    botonAjustes.setAttribute('aria-expanded', 'true');
    hojaAjustes.abrir('Ajustes', ...contenidoAjustes);
    (hojaAjustes.raiz.querySelector('[aria-pressed="true"]') as HTMLElement | null)?.focus();
    return;
  }
  panelAjustes.hidden = !si;
  veloAjustes.hidden = !si;
  botonAjustes.setAttribute('aria-expanded', String(si));
  if (si) (panelAjustes.querySelector('[aria-pressed="true"]') as HTMLElement | null)?.focus();
}
botonAjustes.addEventListener('click', () => abrirAjustes(panelAjustes.hidden));
cerrarAjustes.addEventListener('click', () => {
  abrirAjustes(false);
  botonAjustes.focus();
});
veloAjustes.addEventListener('click', () => abrirAjustes(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panelAjustes.hidden) {
    abrirAjustes(false);
    botonAjustes.focus();
  }
});
document.addEventListener('pointerdown', (e) => {
  const t = e.target as Node;
  if (!panelAjustes.hidden && !panelAjustes.contains(t) && !botonAjustes.contains(t)) abrirAjustes(false);
});
const ajustes = h('div', { class: 'ajustes' }, botonAjustes, panelAjustes, veloAjustes, hojaAjustes.raiz);

// --- Modo reto (fase 6; opción A de la maqueta) ---
// El panel de causas pasa a ser «Tu respuesta»: los mandos se ocultan y las
// placas se eligen (una o dos). Al comprobar, los mandos vuelven a la vista con
// el paciente real y «Qué mirar» cuenta lo que lo delataba.
interface EstadoReto {
  indice: number;
  elegidas: string[];
  pistas: number;
  correccion: CorreccionReto | null;
  resultados: (CorreccionReto['resultado'] | null)[];
  fin: boolean;
  /** Retos por enlace: el reto que ha hecho un profesor (sin él, el de la lista). */
  profesor?: Reto;
}
let reto: EstadoReto | null = null;
const retoActual = () => (reto ? reto.profesor ?? retos[reto.indice] : undefined);
/** Con las causas ocultas: el reto está planteado y sin corregir. */
const enReto = () => !!reto && !reto.correccion && !reto.fin;
const ICONO_RETO = () =>
  s('svg', { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    s('circle', { cx: 12, cy: 12, r: 9, class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7 }),
    s('circle', { cx: 12, cy: 12, r: 5, class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7 }),
    s('circle', { cx: 12, cy: 12, r: 1.6, class: 'icono-relleno' }),
  );
const ICONO_SALIR = () =>
  s('svg', { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    s('path', { d: 'M6 6l12 12M18 6 6 18', class: 'icono-trazo', fill: 'none', 'stroke-width': 1.8, 'stroke-linecap': 'round' }),
  );
const textoBotonReto = h('span', { class: 'texto-boton' }, 'Modo reto');
const iconoBotonReto = h('span', { class: 'icono-reto' }, ICONO_RETO());
const botonReto = h('button', { type: 'button', class: 'boton boton-reto', 'aria-pressed': 'false', title: 'Modo reto: deduce las causas de un paciente' }, iconoBotonReto, textoBotonReto);
botonReto.addEventListener('click', () => (reto ? salirReto() : entrarReto()));
/** «Reto 3 de 10» con un punto por reto (verde acierto, ámbar a medias, naranja fallo). */
const chipReto = h('div', { class: 'chip-reto', role: 'status', hidden: true });


const mandosEnlace: MandosEnlace = {
  causas: ordenCausas,
  farmacos: ordenFarmacos,
  ejercicio: ordenEjercicio,
  sesion: ordenSesion,
  rango: (id) => nodo(id).rango,
  variantes: Object.fromEntries(causasConVariantes.map((n) => [n.id, n.variantes!.map((v) => v.id)])),
};
const estadoActual = (pregunta = ''): EstadoCompartido => ({ causas: { ...causas }, farmacos: { ...farmacos }, ejercicio: { ...ejercicio }, momento, escala, variantes: { ...variantes }, pregunta });
/** «Aeróbica intensa», «Entreno isométrico regular»: lo que dice el chip del ejercicio. */
const textosEjercicio = () => [
  ...ordenSesion.filter((id) => ejercicio[id] !== 0).map((id) => `${cortoLimpio(id)} ${textoMando(nodo(id), ejercicio[id])}`),
  ...ordenEntrenamiento.filter((id) => ejercicio[id] !== 0).map((id) => `Entreno ${cortoLimpio(id).toLowerCase()} ${textoMando(nodo(id), ejercicio[id])}`),
];
/** Fase 7: el chip de una causa con variantes la nombra («Estenosis renal unilateral»). */
function conVariante<T extends { texto: string }>(id: string, chip: T): T {
  const va = variante(id);
  return va ? { ...chip, texto: `${chip.texto} ${va.corto}` } : chip;
}
function chipsEnlace(): ChipEnlace[] {
  const lista: ChipEnlace[] = [
    ...ordenCausas.filter((id) => causas[id] !== 0).map((id) => ({ ...conVariante(id, chipCausa(id, causas[id])), causa: true })),
    ...ordenFarmacos.filter((id) => farmacos[id] !== 0).map((id) => ({ texto: `${cortoLimpio(id)} · ${textoDosis(farmacos[id]).replace('dosis plena', 'plena')}`, tipo: 'farmaco' })),
    ...textosEjercicio().map((texto) => ({ texto, tipo: 'ejercicio' })),
  ];
  if (!lista.length) lista.push({ texto: 'Sin causas (todo normal)', tipo: 'tiempo' });
  lista.push({ texto: nombreTiempo(), tipo: 'tiempo' });
  return lista;
}
// Enlace desde el hub PhysiQ: si el hub se anuncia, el enlace abre el hub con Radiostasis dentro.
let avisoHub: AvisoHub | null = null;
escucharHub((aviso) => {
  avisoHub = aviso;
  compartir.refrescar();
});
const sinFragmento = () => location.href.split('#')[0];
const enlaceCaso = (pregunta: string) => direccionEnlace(enTema(codificar(estadoActual(pregunta), mandosEnlace)), avisoHub, sinFragmento());
// Retos por enlace: las claves salen del modelo (gruposClavesReto, en la vista del tema).
const gruposClaves = gruposClavesReto;
const nombreClave = (id: string) => nombreAnalitica[id] ?? cortoLimpio(id);
const compartir = crearCompartir({
  enlace: enlaceCaso,
  // El reto también abre el hub si se ha anunciado.
  enlaceReto: (enunciado, explicacion) => direccionEnlace(enTema(codificarReto(estadoActual(enunciado), explicacion, mandosEnlace)), avisoHub, sinFragmento()),
  clavesReto: () => Object.entries(clavesAutomaticas(resultado.valores, gruposClaves)).map(([id, f]) => `${nombreClave(id)} ${f}`),
  causasReto: () => causasActivas({ causas }).length,
  enHub: () => !!avisoHub,
  chips: chipsEnlace,
  alExportar: (tipo, conFichas, pregunta) => void imprimirFicha(datosFicha(pregunta || compartido?.pregunta || ''), tipo, conFichas),
});
/** Lo que lleva la ficha de estudio: lo mismo que se ve en pantalla (punto 4). */
function datosFicha(pregunta: string): DatosFicha {
  const caso = casoActual();
  const v = resultado.valores;
  const hipotetica = combinacionHipotetica(modelo, causas, reglasAvisos);
  const avisos = [
    ...(hipotetica.length ? [{ titulo: reglasAvisos.hipotetica.titulo, texto: reglasAvisos.hipotetica.texto, nivel: 'hipotetica' }] : []),
    ...interaccionesActivas(entradas(), reglasAvisos, momento, reglasAvisos.interacciones, variantes),
    ...notasActivas(causas, reglasAvisos, variantes),
  ].map((a) => ({ titulo: a.titulo, texto: a.texto, nivel: a.nivel }));
  const queMirarFicha: DatosFicha['queMirar'] = caso
    ? [
        ...(queMirar[caso.id] ? [{ texto: queMirar[caso.id] }] : []),
        ...(casosConRetencion.includes(caso.id) && escala === 'estable' && !enSesion() ? [{ texto: notaRetencion }] : []),
        ...(caso.nota ? [{ rotulo: caso.ejercicio ? 'El ejercicio.' : caso.farmacos ? 'El fármaco.' : 'La fisiología.', texto: caso.nota }] : []),
      ]
    : [{ texto: hayEntradas() ? 'Esta combinación no es uno de los casos del simulador. Mira qué mecanismos se mueven y compara las escalas de tiempo.' : 'Sin causas: todo está en su valor normal.' }];
  const activos = [...ordenCausas, ...ordenFarmacos, ...ordenEjercicio].filter((id) => (entradas()[id] ?? 0) !== 0);
  return {
    titulo: caso ? `${caso.id} · ${caso.nombre}` : hayEntradas() ? 'Combinación libre' : 'Sin causas (todo normal)',
    chips: chipsEnlace(),
    valores: v,
    nombre: (id) => nombreAnalitica[id] ?? cortoLimpio(id),
    determinantes,
    analitica: panelAnalitica,
    grupos: gruposMecanismos.map((g) => ({ nombre: g.nombre, nodos: g.nodos })),
    queMirar: queMirarFicha,
    avisos,
    fichas: activos.map((id) => {
      const f = fichas[id];
      const n = nodo(id);
      return {
        nombre: `${n.nombre} · ${textoMando(n, entradas()[id])}${n.tipo === 'causa' && variante(id) ? ` · ${variante(id)!.corto}` : ''}`,
        apartados: [
          f?.queEs ? { titulo: 'Qué es', texto: f.queEs } : null,
          f?.queHace ? { titulo: 'Qué hace', texto: f.queHace } : null,
          caso && f?.enCaso?.[caso.id] ? { titulo: 'En este caso', texto: f.enCaso[caso.id] } : null,
          f?.consulta ? { titulo: 'En la consulta de fisioterapia', texto: f.consulta } : null,
        ].filter((x): x is { titulo: string; texto: string } => x !== null),
      };
    }),
    pregunta: pregunta.trim() || undefined,
    enlace: enlaceCaso(pregunta),
    fuente: FUENTES,
  };
}
const cabecera = h(
  'header',
  { class: 'cabecera' },
  h(
    'div',
    { class: 'titulo' },
    h('h1', {}, modelo.nombre),
    h('p', { class: 'tenue' }, 'Simulador de causas de hipertensión · modelo cualitativo'),
  ),
  h(
    'div',
    { class: 'controles' },
    h('label', { class: 'campo-caso' }, h('span', { class: 'tenue' }, 'Caso'), selectorCaso),
    chipReto,
    chipTratamiento,
    chipEjercicio,
    h('div', { class: 'grupo-escala' }, interruptorEscala, notaEscalaSesion),
    botonReto,
    compartir.raiz,
    ajustes,
    botonSonido,
    botonRestablecer,
  ),
);

// --- Ficha ---
// «Ampliar con IA»: barra al seleccionar texto y pie de cada ficha.
const ia = iniciarAmpliarIA();
const ficha = crearFicha(modeloActual, {
  fichas,
  nombreCorto,
  terminos,
  pieIA: (contexto, texto) => ia.pie(contexto, texto),
  valorOrientativo: (id, ctx) => (verValores ? textoOrientativo(id, ctx.valores) : null),
  alVerCapas: () => {
    vasos.ponerCapas(true);
    vasos.raiz.scrollIntoView({ block: 'nearest' });
  },
});
const abrirFicha = (id: string) =>
  ficha.abrir(id, {
    valores: resultado.valores,
    escala,
    momento,
    base: resultado.base,
    // En el reto, ni el caso (sus textos nombran la causa) ni el valor de las causas.
    caso: enReto() ? undefined : casoActual(),
    hayCausas: hayEntradas(),
    ocultarCausas: enReto(),
  });

// --- Causas ---
const mandos = new Map<string, Mando>();
for (const id of ordenCausas) {
  mandos.set(
    id,
    crearMando(
      nodo(id),
      corto(id),
      (v) => {
        sonido.sintonia(Math.abs(v - causas[id]) * 6);
        causas[id] = v;
        programar();
      },
      () => (enReto() ? alternarRespuesta(id) : abrirFicha(id)),
      {
        de: (v) => {
          const f = frecuenciaDe(nodo(id), v);
          return f && f !== 'comun' ? { texto: reglasAvisos.frecuencia[f].pastilla, tipo: f } : undefined;
        },
        titulo: reglasAvisos.queMideFrecuencia,
      },
    ),
  );
}
// --- Fármacos (fase 4): mandos de acero con su rueda de dosis ---
const mandosFarmaco = new Map<string, Mando>();
for (const id of ordenFarmacos) {
  const m = crearMando(
    nodo(id),
    corto(id),
    (v) => {
      sonido.sintonia(Math.abs(v - farmacos[id]) * 6);
      farmacos[id] = v;
      programar();
    },
    () => abrirFicha(id),
    { de: () => ({ texto: farmacosVista[id].pastilla, tipo: 'farmaco' }), titulo: 'Dónde actúa' },
  );
  m.raiz.classList.add('farmaco');
  mandosFarmaco.set(id, m);
}
const quitarTratamiento = h('button', { type: 'button', class: 'boton quitar-tratamiento' }, 'Quitar tratamiento');
quitarTratamiento.addEventListener('click', () => {
  for (const id of ordenFarmacos) farmacos[id] = 0;
  for (const m of mandosFarmaco.values()) m.poner(0);
  actualizar();
});

// --- Ejercicio (fase 5): mandos de cobre de la sesión y del entrenamiento ---
const mandosEjercicio = new Map<string, Mando>();
for (const id of ordenEjercicio) {
  const sesion = ordenSesion.includes(id);
  const m = crearMando(
    nodo(id),
    corto(id),
    (v) => {
      sonido.sintonia(Math.abs(v - ejercicio[id]) * 6);
      ejercicio[id] = v;
      // Girar una rueda de la sesión con el momento en «Antes» pasa a «Durante»:
      // si no, la rueda no haría nada a la vista.
      if (sesion && v > 0 && momento === 'antes') momento = 'durante';
      programar();
    },
    () => abrirFicha(id),
    { de: () => ({ texto: sesion ? 'minutos' : 'meses', tipo: 'ejercicio' }), titulo: sesion ? 'Una sesión: dura minutos' : 'Entrenamiento: meses' },
  );
  m.raiz.classList.add('ejercicio');
  mandosEjercicio.set(id, m);
}
const botonesMomento = (['antes', 'durante', 'despues'] as Momento[]).map((mo) => {
  const b = h('button', { type: 'button', 'data-momento': mo, 'aria-pressed': 'false' }, NOMBRE_MOMENTO[mo]);
  b.addEventListener('click', () => {
    momento = mo;
    // Sin ninguna sesión puesta, «Durante» y «Al terminar» empiezan con una sesión aeróbica moderada.
    if (mo !== 'antes' && ordenSesion.every((id) => ejercicio[id] === 0)) {
      ejercicio.sesionAerobica = 0.5;
      mandosEjercicio.get('sesionAerobica')!.poner(0.5);
    }
    actualizar();
  });
  return b;
});
const idMomento = 'titulo-momento';
const selectorMomento = h('div', { class: 'interruptor selector-momento', role: 'group', 'aria-labelledby': idMomento }, ...botonesMomento);
const sinEjercicio = h('button', { type: 'button', class: 'boton quitar-tratamiento quitar-ejercicio' }, 'Sin ejercicio');
sinEjercicio.addEventListener('click', () => {
  for (const id of ordenEjercicio) ejercicio[id] = 0;
  for (const m of mandosEjercicio.values()) m.poner(0);
  momento = 'antes';
  actualizar();
});
const rotulo = (titulo: string, detalle: string, id?: string) =>
  h('p', { class: 'rotulo-ejercicio', id }, h('span', {}, titulo), h('span', { class: 'rotulo-detalle' }, detalle));
const rejillaEjercicio = h(
  'div',
  { class: 'rejilla-mandos rejilla-ejercicio', id: 'rejilla-ejercicio', role: 'tabpanel', 'aria-labelledby': 'pestana-panel-ejercicio' },
  rotulo('Sesión', 'minutos · momento', idMomento),
  selectorMomento,
  ...ordenSesion.map((id) => mandosEjercicio.get(id)!.raiz),
  h('div', { class: 'celda-quitar' }, sinEjercicio),
  rotulo('Entrenamiento', 'meses · en reposo'),
  ...ordenEntrenamiento.map((id) => mandosEjercicio.get(id)!.raiz),
);

// Pestañas «Causas | Fármacos | Ejercicio» dentro del panel de madera. En el
// móvil son pestañas de la barra (src/app/movil.ts) y estas no se ven.
const VISTAS: VistaPanel[] = ['causas', 'farmacos', 'ejercicio'];
const NOMBRE_VISTA: Record<VistaPanel, string> = { causas: 'Causas', farmacos: 'Fármacos', ejercicio: 'Ejercicio' };
let vistaPanel: VistaPanel = 'causas';
const cuentaFarmacos = h('span', { class: 'cuenta-farmacos', hidden: true });
const cuentaEjercicio = h('span', { class: 'cuenta-farmacos cuenta-ejercicio', hidden: true });
const pestanasPanel = VISTAS.map((v) => {
  const b = h(
    'button',
    { type: 'button', role: 'tab', id: `pestana-panel-${v}`, 'aria-controls': `rejilla-${v}`, 'data-vista': v },
    NOMBRE_VISTA[v],
    v === 'farmacos' ? cuentaFarmacos : v === 'ejercicio' ? cuentaEjercicio : null,
  );
  b.addEventListener('click', () => ponerVistaPanel(v));
  return b;
});
const listaPanel = h('div', { role: 'tablist', 'aria-label': 'Causas, fármacos o ejercicio', class: 'pestanas-panel' }, ...pestanasPanel);
listaPanel.addEventListener('keydown', (e) => {
  const i = VISTAS.indexOf(vistaPanel);
  const n = VISTAS.length;
  const destino = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i + n - 1) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
  if (destino < 0) return;
  e.preventDefault();
  ponerVistaPanel(VISTAS[destino], true);
});
const ayudaPanel = h('p', { class: 'ayuda-panel' });
/**
 * Fase 7 (opción A de la maqueta): franja con la variante de la causa
 * («Bilateral · Unilateral · Riñón único»). Ocupa el sitio de la ayuda mientras
 * la causa está activa, en la vista de causas y fuera del reto sin corregir.
 */
const franjasVariante = causasConVariantes.map((n) => {
  const etiqueta = h('span', { class: 'franja-variante-etiqueta', id: `variante-${n.id}` }, cortoLimpio(n.id));
  const botones = n.variantes!.map((va) => {
    const b = h('button', { type: 'button', class: 'franja-variante-boton', 'aria-pressed': 'false', 'data-variante': va.id }, va.nombre);
    b.addEventListener('click', () => {
      if (variantes[n.id] === va.id) return;
      variantes[n.id] = va.id;
      programar();
    });
    return b;
  });
  const raiz = h(
    'div',
    { class: 'franja-variante', hidden: true },
    etiqueta,
    h('div', { class: 'franja-variante-grupo', role: 'group', 'aria-labelledby': `variante-${n.id}` }, ...botones),
  );
  return { id: n.id, raiz, botones };
});
function pintarVariantes() {
  const oculta = enReto();
  let alguna = false;
  for (const f of franjasVariante) {
    const activa = Math.abs(causas[f.id]) >= reglasAvisos.causaActiva && !oculta;
    const visible: boolean = activa && !alguna && vistaPanel === 'causas';
    alguna ||= visible;
    f.raiz.hidden = !visible;
    for (const b of f.botones) b.setAttribute('aria-pressed', String(b.dataset.variante === variantes[f.id]));
    // El mismo umbral que la franja: sin franja para cambiarla, la placa no la nombra.
    mandos.get(f.id)?.ponerVariante(Math.abs(causas[f.id]) >= reglasAvisos.causaActiva && !oculta ? variante(f.id)?.corto ?? null : null);
  }
  ayudaPanel.hidden = alguna;
}
const rejillaCausas = h('div', { class: 'rejilla-mandos', id: 'rejilla-causas', role: 'tabpanel', 'aria-labelledby': 'pestana-panel-causas' }, ...[...mandos.values()].map((m) => m.raiz));
const rejillaFarmacos = h(
  'div',
  { class: 'rejilla-mandos rejilla-farmacos', id: 'rejilla-farmacos', role: 'tabpanel', 'aria-labelledby': 'pestana-panel-farmacos' },
  ...[...mandosFarmaco.values()].map((m) => m.raiz),
  h('div', { class: 'celda-quitar' }, quitarTratamiento),
);
const panelCausas = h(
  'section',
  { class: 'panel-causas', 'aria-labelledby': 't-causas', 'data-vista': 'causas' },
  h(
    'div',
    { class: 'panel-causas-cabecera' },
    h('h2', { id: 't-causas', class: 'oculto' }, 'Causas, fármacos y ejercicio'),
    listaPanel,
    ayudaPanel,
    ...franjasVariante.map((f) => f.raiz),
  ),
  h('div', { class: 'pila-rejillas' }, rejillaCausas, rejillaFarmacos, rejillaEjercicio),
  h('p', { class: 'ayuda-mandos' }, 'Arrastra en círculo, usa la rueda del ratón o las flechas del teclado.'),
);
/** Muestra los mandos de causas, fármacos o ejercicio (en el móvil, la pestaña correspondiente). */
function ponerVistaPanel(v: VistaPanel, foco = false) {
  vistaPanel = v;
  panelCausas.dataset.vista = v;
  for (const b of pestanasPanel) {
    const sel = b.dataset.vista === v;
    b.setAttribute('aria-selected', String(sel));
    b.tabIndex = sel ? 0 : -1;
  }
  rejillaCausas.toggleAttribute('inert', v !== 'causas');
  rejillaFarmacos.toggleAttribute('inert', v !== 'farmacos');
  rejillaEjercicio.toggleAttribute('inert', v !== 'ejercicio');
  ayudaPanel.textContent =
    v === 'causas' && enReto() ? `Toca las causas que creas que explican el caso (${retoActual()?.profesor ? 'hasta tres' : 'una o dos'})`
    : v === 'causas' && reto ? 'Solución: los mandos muestran el paciente · toca una placa para ver su ficha'
    // Con el dedo, los mandos se giran manteniéndolos pulsados (mando.ts).
    : v === 'causas' ? (dedo() ? 'Mantén pulsado un mando y gíralo · toca su placa para ver la ficha' : 'Gira un mando · toca su placa para ver la ficha')
    : v === 'farmacos' ? (dedo() ? 'Mantén pulsada la dosis y gírala · toca la placa para ver la ficha del fármaco' : 'Gira la dosis · toca la placa para ver la ficha del fármaco')
    : 'Elige el momento y la intensidad · toca la placa para ver la ficha';
  pintarVariantes();
  movil?.elegirVista(v);
  if (foco) (MOVIL.matches ? null : pestanasPanel.find((b) => b.dataset.vista === v))?.focus();
}

// --- Centro: vasos, dial y determinantes ---
const vasos = crearVasos(
  () => sonido.latido(),
  () => movil.abrirLectura(),
  capasVaso,
  () => movil.cerrarHoja(),
);
const listaVaso = propiedadesVaso.map((p) => {
  const flechaVaso = h('span', { class: 'flecha' });
  const li = h('li', {}, h('span', {}, h('span', {}, p.propiedad), h('span', { class: 'tenue' }, ` · ${p.texto}`)), flechaVaso);
  return { ...p, li, flechaVaso };
});
const listaVasoUl = h('ul', { class: 'lista-vaso', 'aria-label': 'Qué muestran los vasos' }, ...listaVaso.map((p) => p.li));
vasos.cuerpo.append(listaVasoUl);

const dial = crearDial((id) => abrirFicha(id));
const ventanasSalida = new Map<string, Indicador>(
  determinantes.map((id) => [id, crearVentana(corto(id), 300, () => abrirFicha(id))]),
);
for (const [id, v] of ventanasSalida) v.raiz.setAttribute('data-ficha', id);
/** Fase 6, punto 5: presión orientativa bajo el dial. */
const presionOrientativa = h('p', { class: 'presion-orientativa', hidden: true });
dial.raiz.append(presionOrientativa);
const tarjetaPresion = h(
  'div',
  { class: 'tarjeta presion' },
  h('h2', { class: 'oculto' }, 'Presión arterial'),
  dial.raiz,
  h(
    'div',
    { class: 'determinantes' },
    h('h3', {}, 'Determinantes de la presión'),
    ...[...ventanasSalida.values()].map((v) => v.raiz),
  ),
);
const centro = h('section', { class: 'columna-centro', 'aria-labelledby': 't-vasos' }, vasos.raiz, tarjetaPresion);
// La analítica se añade al centro más abajo, cuando está creada.

// --- Mecanismos ---
const ventanasMecanismo = new Map<string, Indicador>();
const panelMecanismos = h(
  'section',
  { class: 'tarjeta panel-mecanismos', 'aria-labelledby': 't-mec' },
  h('div', {}, h('h2', { id: 't-mec' }, 'Mecanismos'), h('p', { class: 'tenue pequeno' }, 'Se mueven solos · toca uno para ver por qué')),
  ...gruposMecanismos.map((g) => {
    const idGrupo = `g-${g.nodos[0]}`;
    return h(
      'div',
      { class: 'grupo', role: 'group', 'aria-labelledby': idGrupo },
      h('h3', { id: idGrupo }, g.nombre),
      h(
        'div',
        { class: 'rejilla-ventanas' },
        ...g.nodos.map((id) => {
          const v = crearVentana(corto(id), 160, () => abrirFicha(id));
          v.raiz.setAttribute('data-ficha', id);
          ventanasMecanismo.set(id, v);
          return v.raiz;
        }),
      ),
    );
  }),
);

// --- Analítica ---
const celdasAnalitica = panelAnalitica.map((id) => {
  const valor = h('span', { class: 'analito-flecha' });
  // Cada valor abre su ficha (los cuatro que son mecanismos, la del mecanismo).
  // Fase 6, punto 5: cifra orientativa y rango normal, solo si están activados.
  const cifra = h('span', { class: 'analito-cifra', hidden: true });
  const rango = h('span', { class: 'analito-rango', hidden: true });
  const boton = h('button', { type: 'button', class: 'analito', 'data-ficha': id }, h('span', {}, nombreAnalitica[id] ?? corto(id)), valor, cifra, rango);
  boton.addEventListener('click', () => abrirFicha(id));
  const celda = h('div', { class: 'analito-celda', role: 'listitem' }, boton);
  return { id, celda, boton, valor, cifra, rango };
});
const subtituloAnalitica = h('span', { class: 'analitica-escala' });
const panelAnalitica_ = h(
  'section',
  { class: 'panel-analitica', 'aria-labelledby': 't-lab' },
  h('div', { class: 'analitica-cabecera' }, h('h2', { id: 't-lab' }, 'Analítica'), subtituloAnalitica),
  h('div', { class: 'rejilla-analitica', role: 'list' }, ...celdasAnalitica.map((c) => c.celda)),
);

// --- Qué mirar ---
const notaTitulo = h('h2', { id: 't-nota' });
const notaCuerpo = h('div', { class: 'nota-cuerpo' });
centro.append(panelAnalitica_);
const tarjetaNota = h('aside', { class: 'tarjeta nota', 'aria-labelledby': 't-nota' }, notaTitulo, notaCuerpo);

// --- Avisos de realismo (docs/diseno.md) ---
// «Combinación hipotética»: en la pantalla ancha, tira bajo la cabecera; en el
// móvil, la barra «Qué mirar» la anuncia y la hoja muestra la banda.
const ICONO_AVISO = () =>
  s('svg', { width: 20, height: 20, viewBox: '0 0 22 22', 'aria-hidden': 'true', class: 'icono-aviso' },
    s('circle', { cx: 11, cy: 11, r: 9.5, fill: 'none', 'stroke-width': 1.6 }),
    s('path', { d: 'M11 6.5v6', 'stroke-width': 1.8, 'stroke-linecap': 'round' }),
    s('circle', { cx: 11, cy: 15.6, r: 1.1, class: 'icono-aviso-punto' }),
  );
/** Icono «i» de las notas de interacción entre causas (fase 6): informan, no avisan. */
const ICONO_NOTA = () =>
  s('svg', { width: 20, height: 20, viewBox: '0 0 22 22', 'aria-hidden': 'true', class: 'icono-aviso icono-nota' },
    s('circle', { cx: 11, cy: 11, r: 9.5, fill: 'none', 'stroke-width': 1.6 }),
    s('circle', { cx: 11, cy: 6.6, r: 1.1, class: 'icono-aviso-punto' }),
    s('path', { d: 'M11 9.6v6', 'stroke-width': 1.8, 'stroke-linecap': 'round' }),
  );
/**
 * Nombre de una causa en los avisos. Si la frecuencia depende del extremo (ADH
 * autónoma), el del extremo: «Diabetes insípida central», «SIADH».
 */
function nombreAviso(id: string): string {
  const n = nodo(id);
  if (n.frecuenciaExtremos && n.etiquetas && causas[id] !== 0) {
    const t = n.etiquetas[causas[id] < 0 ? 0 : 1];
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return cortoLimpio(id);
}
const chipsCausas = (lista: CausaNoComun[]) =>
  h('div', { class: 'chips-aviso' }, ...lista.map((c) => h('span', { class: 'chip-aviso' }, `${nombreAviso(c.id)} · ${reglasAvisos.frecuencia[c.frecuencia].chip}`)));
// Caso abierto desde un enlace: tira bajo la cabecera (pantalla ancha) o banda
// en «Qué mirar» y barra del pie (móvil), con la pregunta del profesor.
let compartido: { pregunta: string } | null = null;
const textoCompartido = h('p', { class: 'pregunta-compartida' });
const ocultarCompartido = h('button', { type: 'button', class: 'boton boton-ocultar' }, 'Quitar');
const tiraCompartido = h('section', { class: 'tira-compartido', role: 'status', 'aria-label': 'Caso compartido', hidden: true },
  h('h2', {}, ICONO_ENLACE(), 'Caso compartido'), textoCompartido, ocultarCompartido);
const parrafoPregunta = (pregunta: string) => h('p', { class: 'pregunta-compartida' }, h('strong', {}, 'Pregunta: '), pregunta);
function pintarCompartido() {
  tiraCompartido.hidden = !compartido;
  if (compartido?.pregunta) textoCompartido.replaceChildren(h('strong', {}, 'Pregunta: '), compartido.pregunta);
  else textoCompartido.replaceChildren('Abierto desde un enlace');
  textoCompartido.classList.toggle('sin-pregunta', !compartido?.pregunta);
}
function bandaCompartido() {
  const ocultar = h('button', { type: 'button', class: 'boton boton-ocultar' }, 'Quitar');
  ocultar.addEventListener('click', quitarCompartido);
  return h('section', { class: 'tira-compartido banda-compartido banda-nota', role: 'note' },
    h('h3', {}, ICONO_ENLACE(), 'Caso compartido'),
    compartido?.pregunta ? parrafoPregunta(compartido.pregunta) : h('p', { class: 'pregunta-compartida sin-pregunta' }, 'Abierto desde un enlace'),
    ocultar,
  );
}
function quitarCompartido() {
  compartido = null;
  actualizar();
}
ocultarCompartido.addEventListener('click', quitarCompartido);
const tiraHipotetica = h('section', { class: 'banda-hipotetica tira-hipotetica', role: 'status', 'aria-label': reglasAvisos.hipotetica.titulo, hidden: true });
let claveHipotetica = '';
function pintarHipotetica(lista: CausaNoComun[]) {
  const clave = lista.map((c) => `${c.id}:${c.frecuencia}:${nombreAviso(c.id)}`).join(',');
  if (clave === claveHipotetica) return;
  claveHipotetica = clave;
  tiraHipotetica.hidden = lista.length === 0;
  tiraHipotetica.replaceChildren(
    ...(lista.length
      ? [ICONO_AVISO(), h('h2', {}, reglasAvisos.hipotetica.titulo), chipsCausas(lista), h('p', {}, reglasAvisos.hipotetica.texto)]
      : []),
  );
  // Cambia el alto disponible del tablero.
  requestAnimationFrame(() => ajustarTablero());
}
/** Lista en español: «a, b y c». */
const enumerar = (x: string[]) => (x.length < 2 ? x.join('') : `${x.slice(0, -1).join(', ')} y ${x[x.length - 1]}`);
/** «Tumor de renina» → «tumor de renina»; las siglas («ADH autónoma») se quedan. */
const enMinuscula = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);
/** Barra del móvil: «tumor de renina y feocromocitoma (causas raras)». */
function textoBarraHipotetica(lista: CausaNoComun[]): string {
  const nombres = lista.map((c) => enMinuscula(nombreAviso(c.id)));
  if (lista.every((c) => c.frecuencia === lista[0].frecuencia)) {
    return `${enumerar(nombres)} (${reglasAvisos.frecuencia[lista[0].frecuencia].plural})`;
  }
  return lista.map((c, i) => `${nombres[i]} (${reglasAvisos.frecuencia[c.frecuencia].pastilla})`).join(', ');
}
/** Banda completa (hoja del móvil). */
const bandaHipotetica = (lista: CausaNoComun[]) =>
  h('section', { class: 'banda-hipotetica banda-nota' },
    ICONO_AVISO(),
    h('div', { class: 'banda-cuerpo' }, h('h3', {}, reglasAvisos.hipotetica.titulo), h('p', {}, reglasAvisos.hipotetica.texto), chipsCausas(lista)),
  );

/** Chip «fuera de rango» junto a un indicador saturado. */
function marcarFuera(el: Element, si: boolean) {
  el.classList.toggle('fuera-de-rango', si);
  let chip = el.querySelector(':scope > .chip-fuera');
  if (si && !chip) {
    chip = h('span', { class: 'chip-fuera', title: reglasAvisos.fueraDeRango.texto, 'aria-hidden': 'true' }, reglasAvisos.fueraDeRango.etiqueta);
    el.append(chip);
  } else if (!si) chip?.remove();
  if (si) {
    const etiqueta = el.getAttribute('aria-label');
    if (etiqueta && !etiqueta.includes(reglasAvisos.fueraDeRango.texto)) {
      el.setAttribute('aria-label', etiqueta.replace(/\. Abrir/, `. ${reglasAvisos.fueraDeRango.texto} Abrir`));
    }
  }
}

// --- Región viva: resume la presión tras cada cambio (con retardo) ---
const anuncio = h('p', { class: 'oculto', 'aria-live': 'polite' });
let temporizadorAnuncio = 0;
let ultimoAnuncio = '';
function anunciar() {
  clearTimeout(temporizadorAnuncio);
  temporizadorAnuncio = window.setTimeout(() => {
    const v = resultado.valores;
    const texto = `${nombreTiempo()}. Sistólica ${enPalabras(v.pas)}, diastólica ${enPalabras(v.pad)}.`;
    if (texto !== ultimoAnuncio) anuncio.textContent = ultimoAnuncio = texto;
  }, 900);
}

// --- Página ---
const app = document.getElementById('app')!;
const columnaIzquierda = h('div', { class: 'columna-izquierda' }, panelCausas, tarjetaNota);
const columnaDerecha = h('div', { class: 'columna-derecha' }, panelMecanismos);
const columnas = h('div', { class: 'columnas' }, columnaIzquierda, centro, columnaDerecha);
app.replaceChildren(
  // Degradados compartidos por todos los SVG.
  s(
    'svg',
    { width: 0, height: 0, 'aria-hidden': 'true', class: 'defs-globales' },
    s(
      'defs',
      {},
      s(
        'radialGradient',
        { id: 'laton', cx: '40%', cy: '35%', r: '70%' },
        s('stop', { offset: 0, 'stop-color': '#F6E3A6' }),
        s('stop', { offset: 0.55, 'stop-color': '#C9A24A' }),
        s('stop', { offset: 1, 'stop-color': '#7E5E22' }),
      ),
      s(
        'radialGradient',
        { id: 'cristal', cx: '50%', cy: '50%', r: '65%' },
        s('stop', { offset: 0, 'stop-color': '#FFE7B0' }),
        s('stop', { offset: 1, 'stop-color': '#E0A63E' }),
      ),
      // Fase 5: mando de cobre del ejercicio.
      s(
        'radialGradient',
        { id: 'cobre', cx: '40%', cy: '35%', r: '70%' },
        s('stop', { offset: 0, 'stop-color': '#FBD9BC' }),
        s('stop', { offset: 0.55, 'stop-color': '#C27445' }),
        s('stop', { offset: 1, 'stop-color': '#6B3518' }),
      ),
      // Fase 4: mando de acero de los fármacos.
      s(
        'radialGradient',
        { id: 'acero', cx: '40%', cy: '35%', r: '70%' },
        s('stop', { offset: 0, 'stop-color': '#FFFFFF' }),
        s('stop', { offset: 0.45, 'stop-color': '#B9C3CA' }),
        s('stop', { offset: 1, 'stop-color': '#5E6870' }),
      ),
      // Tema Clásico: mando de baquelita.
      s(
        'radialGradient',
        { id: 'baquelita', cx: '40%', cy: '35%', r: '70%' },
        s('stop', { offset: 0, 'stop-color': '#F7F1E3' }),
        s('stop', { offset: 0.6, 'stop-color': '#D9CFBB' }),
        s('stop', { offset: 1, 'stop-color': '#A99D85' }),
      ),
    ),
  ),
  cabecera,
  tiraCompartido,
  tiraHipotetica,
  // Tablero: causas y «Qué mirar» | vasos, presión y analítica | mecanismos.
  columnas,
  h(
    'footer',
    { class: 'pie-pagina tenue' },
    h('p', {}, `Modelo cualitativo con fines docentes. ${FUENTES} No es un simulador clínico.`),
    h('p', { class: 'version' }, `v${__VERSION__} · ${__RAMA__} · ${__COMMIT__}`),
  ),
  anuncio,
  ficha.raiz,
  selector.dialogo,
);

// --- Móvil: vasos y presión arriba, pestañas y «Qué mirar» al pie ---
const movil = crearMovil(
  {
    app, columnas, columnaIzquierda, centro, columnaDerecha,
    panelCausas, panelMecanismos, panelAnalitica: panelAnalitica_, tarjetaPresion,
    tarjetaNota, notaTitulo, notaCuerpo, vasos, listaVaso: listaVasoUl, dial: dial.raiz,
  },
  () => ajustarTablero(),
  (v) => ponerVistaPanel(v),
);
ponerVistaPanel(vistaPanel);

// --- Eventos de cabecera ---
// Sin reborde de foco al usar el selector con ratón o dedo; con teclado, sí.
selectorCaso.addEventListener('pointerdown', () => (selectorCaso.dataset.puntero = '1'));
selectorCaso.addEventListener('keydown', () => delete selectorCaso.dataset.puntero);
selectorCaso.addEventListener('blur', () => delete selectorCaso.dataset.puntero);
function cargarCaso(caso: Caso | undefined) {
  for (const id of ordenCausas) causas[id] = caso?.causas[id] ?? 0;
  for (const id of ordenFarmacos) farmacos[id] = caso?.farmacos?.[id] ?? 0;
  for (const id of ordenEjercicio) ejercicio[id] = caso?.ejercicio?.[id] ?? 0;
  momento = caso?.momento ?? 'antes';
  ponerVariantes(caso?.variantes);
  for (const [id, m] of mandos) m.poner(causas[id]);
  for (const [id, m] of mandosFarmaco) m.poner(farmacos[id]);
  for (const [id, m] of mandosEjercicio) m.poner(ejercicio[id]);
  actualizar();
}
botonRestablecer.addEventListener('click', () => {
  // En el reto, vuelve al paciente como empezó (sin tocar la respuesta).
  if (reto) {
    cargarReto();
    return;
  }
  for (const id of ordenCausas) causas[id] = 0;
  for (const id of ordenFarmacos) farmacos[id] = 0;
  ponerVariantes();
  for (const m of mandos.values()) m.poner(0);
  for (const m of mandosFarmaco.values()) m.poner(0);
  for (const id of ordenEjercicio) ejercicio[id] = 0;
  for (const m of mandosEjercicio.values()) m.poner(0);
  momento = 'antes';
  escala = 'estable';
  // Restablecer también quita el caso compartido y su enlace.
  compartido = null;
  if (fragmento()) quitarFragmento();
  actualizar();
});
/** Abre el estado de un enlace compartido (al cargar o al pegar otro enlace en la misma pestaña). */
function leerEnlace(): boolean {
  const e = decodificar(fragmento(), mandosEnlace);
  if (!e) return false;
  for (const id of ordenCausas) causas[id] = e.causas[id] ?? 0;
  for (const id of ordenFarmacos) farmacos[id] = e.farmacos[id] ?? 0;
  for (const id of ordenEjercicio) ejercicio[id] = e.ejercicio[id] ?? 0;
  momento = e.momento;
  escala = e.escala;
  ponerVariantes(e.variantes);
  for (const [id, m] of mandos) m.poner(causas[id]);
  for (const [id, m] of mandosFarmaco) m.poner(farmacos[id]);
  for (const [id, m] of mandosEjercicio) m.poner(ejercicio[id]);
  compartido = { pregunta: e.pregunta };
  return true;
}
/** Retos por enlace: el profesor convierte un estado en reto. */
function retoDelProfesor(e: EstadoCompartido, explicacion: string): Reto {
  const activas = Object.fromEntries(Object.entries({ ...e.causas, ...e.farmacos, ...e.ejercicio }).filter(([, v]) => v !== 0));
  const { valores } = simular(modelo, activas, e.escala, { momento: e.momento, variantes: e.variantes });
  const claves = clavesAutomaticas(valores, gruposClaves);
  // La pista no nombra los valores que se llaman como una causa (evitaEnPista), y
  // usa el nombre completo («Actividad mineralocorticoide», no «Act. mineralocort.»).
  const dos = valoresPista(valores, gruposClaves, evitaEnPista).map((id) => `«${nodo(id).nombre}»`);
  return {
    id: 0,
    nivel: Object.keys(e.farmacos).length ? 'farmaco' : causasActivas(e).length > 1 ? 'dos' : 'una',
    causas: e.causas,
    farmacos: e.farmacos,
    variantes: e.variantes,
    enunciado: e.pregunta,
    pistas: dos.length ? [`Fíjate en ${enumerar(dos)}: ${dos.length > 1 ? 'son los valores que más se mueven' : 'es el valor que más se mueve'}.`] : [],
    delata: [],
    claves,
    profesor: { explicacion, ejercicio: e.ejercicio, momento: e.momento, escala: e.escala },
  };
}
/** Abre el reto de un enlace (#reto=3 o el reto de un profesor), si lo es. */
function leerEnlaceReto(): boolean {
  const r = decodificarReto(fragmento(), mandosEnlace, retos.length);
  if (!r) return false;
  if (reto) terminarReto();
  if (r.tipo === 'lista') entrarReto(r.numero - 1, undefined, true);
  else entrarReto(0, retoDelProfesor(r.estado, r.explicacion), true);
  return true;
}
window.addEventListener('hashchange', () => {
  // Un enlace de otro tema (pegado en la misma pestaña): se abre de nuevo con ese tema.
  if (temaPorId(leerTema(location.hash).tema).id !== tema.id) {
    location.reload();
    return;
  }
  if (leerEnlaceReto()) return;
  if (!decodificar(fragmento(), mandosEnlace)) return;
  if (reto) terminarReto();
  if (leerEnlace()) actualizar();
});

// --- Modo reto: estado ---
/**
 * Entra en el modo reto, en el reto dado de la lista o en el de un profesor.
 * Desde un enlace, la dirección se conserva (al recargar sigue el reto) hasta salir.
 */
function entrarReto(indice = 0, profesor?: Reto, desdeEnlace = false) {
  compartido = null;
  if (fragmento() && !desdeEnlace) quitarFragmento();
  reto = { indice, elegidas: [], pistas: 0, correccion: null, resultados: retos.map(() => null), fin: false, profesor };
  ponerVistaPanel('causas');
  cargarReto();
}
/** Pone los mandos como el paciente del reto: sus causas y fármacos, en estado estable. */
function cargarReto() {
  const r = retoActual();
  if (!r) return;
  for (const id of ordenCausas) causas[id] = r.causas[id] ?? 0;
  for (const id of ordenFarmacos) farmacos[id] = r.farmacos?.[id] ?? 0;
  for (const id of ordenEjercicio) ejercicio[id] = r.profesor?.ejercicio[id] ?? 0;
  ponerVariantes(r.variantes);
  momento = r.profesor?.momento ?? 'antes';
  escala = r.profesor?.escala ?? 'estable';
  for (const [id, m] of mandos) m.poner(causas[id]);
  for (const [id, m] of mandosFarmaco) m.poner(farmacos[id]);
  for (const [id, m] of mandosEjercicio) m.poner(ejercicio[id]);
  actualizar();
}
/** Deja el reto sin repintar: la persona sana. */
function terminarReto() {
  reto = null;
  for (const id of ordenCausas) causas[id] = 0;
  for (const id of ordenFarmacos) farmacos[id] = 0;
  for (const id of ordenEjercicio) ejercicio[id] = 0;
  ponerVariantes();
  for (const m of [...mandos.values(), ...mandosFarmaco.values(), ...mandosEjercicio.values()]) m.poner(0);
  for (const m of mandos.values()) {
    const placa = m.raiz.querySelector('.placa')!;
    placa.removeAttribute('aria-label');
    placa.removeAttribute('aria-pressed');
  }
  momento = 'antes';
  escala = 'estable';
}
function salirReto() {
  terminarReto();
  // El enlace del reto deja de valer al salir: al recargar no vuelve a empezar.
  if (fragmento()) quitarFragmento();
  ponerVistaPanel(vistaPanel);
  actualizar();
  botonReto.focus();
}
function alternarRespuesta(id: string) {
  if (!reto) return;
  const e = reto.elegidas;
  const i = e.indexOf(id);
  if (i >= 0) e.splice(i, 1);
  else {
    e.push(id);
    // Como mucho dos (tres en el reto de un profesor): la siguiente sustituye a la primera.
    if (e.length > (reto.profesor ? MAX_CAUSAS_RETO : 2)) e.shift();
  }
  actualizar();
}
function comprobarReto() {
  const r = retoActual();
  if (!reto || !r || !reto.elegidas.length) return;
  reto.correccion = corregirReto(reto.elegidas, r);
  reto.resultados[reto.indice] = reto.correccion.resultado;
  ponerVistaPanel(vistaPanel);
  actualizar();
  enfocarAccion(reto.profesor ? 'salir' : 'siguiente');
}
/** Salta a un reto cualquiera (puntos del chip). Se conservan los resultados de los demás. */
function irAReto(i: number) {
  if (!reto || i < 0 || i >= retos.length || (i === reto.indice && !reto.fin)) return;
  reto = { ...reto, indice: i, elegidas: [], pistas: 0, correccion: null, fin: false };
  ponerVistaPanel(vistaPanel);
  cargarReto();
}
const NOMBRE_RESULTADO: Record<string, string> = { acierto: 'acertado', parcial: 'a medias', fallo: 'fallado' };
/**
 * Puntos del chip del reto: se pulsan para saltar a un reto. En pantalla táctil
 * se arrastra el dedo por encima: el punto de debajo se agranda con su número
 * y al levantar el dedo se salta a él. Con teclado, las flechas.
 */
function puntosReto(): HTMLElement {
  const st = reto!;
  const actual = st.fin ? -1 : st.indice;
  const puntos = retos.map((_, i) => h('i', { 'data-resultado': st.resultados[i] ?? (i === actual ? 'actual' : '') }));
  // El globo va fuera del chip (que en el móvil recorta lo que sobresale), fijo sobre el punto.
  document.querySelector('.chip-reto-globo')?.remove();
  const globo = h('span', { class: 'chip-reto-globo', hidden: true, 'aria-hidden': 'true' });
  document.body.append(globo);
  const tira = h('span', {
    class: 'chip-reto-puntos', role: 'slider', tabindex: 0,
    'aria-label': 'Ir a otro reto', 'aria-valuemin': 1, 'aria-valuemax': retos.length, 'aria-valuenow': st.indice + 1,
    'aria-valuetext': `Reto ${retos[st.indice].id}${st.resultados[st.indice] ? `, ${NOMBRE_RESULTADO[st.resultados[st.indice]!]}` : ''}`,
  }, ...puntos);
  let sobre = -1;
  const indiceEn = (x: number) => {
    let mejor = 0;
    let dist = Infinity;
    puntos.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - x);
      if (d < dist) [mejor, dist] = [i, d];
    });
    return mejor;
  };
  const marcar = (i: number) => {
    sobre = i;
    puntos.forEach((p, j) => p.classList.toggle('sobre', j === i));
    globo.hidden = i < 0;
    if (i < 0) return;
    globo.textContent = `Reto ${retos[i].id}`;
    const r = puntos[i].getBoundingClientRect();
    const t = tira.getBoundingClientRect();
    const z = zoomPagina();
    globo.style.left = `${(r.left + r.width / 2) / z}px`;
    // Encima del punto: debajo lo taparía el dedo. Si el chip está pegado al borde de arriba, debajo.
    const arriba = t.top > 40;
    globo.classList.toggle('debajo', !arriba);
    globo.style.top = `${(arriba ? t.top - 6 : t.bottom + 6) / z}px`;
  };
  tira.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    tira.setPointerCapture(e.pointerId);
    marcar(indiceEn(e.clientX));
  });
  tira.addEventListener('pointermove', (e) => {
    if (sobre >= 0) marcar(indiceEn(e.clientX));
  });
  tira.addEventListener('pointerup', () => {
    const i = sobre;
    marcar(-1);
    if (i >= 0) irAReto(i);
  });
  tira.addEventListener('pointercancel', () => marcar(-1));
  tira.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    irAReto(st.indice + d);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.chip-reto-puntos')?.focus());
  });
  return tira;
}
function siguienteReto() {
  if (!reto) return;
  if (reto.indice >= retos.length - 1) {
    reto.fin = true;
    actualizar();
    enfocarAccion('de-nuevo');
    return;
  }
  reto = { ...reto, indice: reto.indice + 1, elegidas: [], pistas: 0, correccion: null };
  ponerVistaPanel(vistaPanel);
  cargarReto();
  enfocarAccion('comprobar');
}
/** Tras repintar «Qué mirar», el foco vuelve al botón equivalente. */
function enfocarAccion(accion: string) {
  requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-accion="${accion}"]:not([disabled])`)?.focus({ preventScroll: true }));
}

// --- Pintado ---
let pendiente = 0;
function programar() {
  if (pendiente) return;
  pendiente = requestAnimationFrame(() => {
    pendiente = 0;
    actualizar();
  });
}

function pintarNota(caso: Caso | undefined, hipotetica: CausaNoComun[], interacciones: Interaccion[]) {
  reducirNota();
  if (reto) {
    pintarNotaReto(interacciones);
    tituloHojaNota();
    return;
  }
  pintarNotaTexto(caso);
  for (const i of [...interacciones].reverse()) notaCuerpo.prepend(bandaInteraccion(i));
  if (hipotetica.length) notaCuerpo.prepend(bandaHipotetica(hipotetica));
  if (compartido) notaCuerpo.prepend(bandaCompartido());
  tituloHojaNota();
}
/** En el móvil, si «Qué mirar» está abierta en su hoja, su título sigue al de la nota (p. ej. al corregir un reto). */
function tituloHojaNota() {
  const titulo = notaCuerpo.closest('dialog')?.querySelector('.ficha-cabecera h2');
  if (titulo) titulo.textContent = notaTitulo.textContent;
}
/** Aviso de interacción de fármacos (fase 4), en la nota y en la hoja del móvil. */
const bandaInteraccion = (i: Interaccion) =>
  h('section', { class: 'banda-interaccion', 'data-nivel': i.nivel, role: 'note' },
    i.nivel === 'nota' ? ICONO_NOTA() : ICONO_AVISO(),
    h('div', { class: 'banda-cuerpo' }, h('h3', {}, i.titulo), h('p', {}, ...enlazarNota(i.texto, undefined, new Set()))),
  );
/** Nombre de una causa del reto: el extremo si es bipolar («Hipertiroidismo»). */
const nombreCausaReto = (id: string) => {
  const v = retoActual()?.causas[id] ?? 0;
  return v ? chipCausa(id, v).texto : cortoLimpio(id);
};
const botonAccion = (accion: string, texto: string, alPulsar: () => void, primario = false, deshabilitado = false) => {
  const b = h('button', { type: 'button', class: `boton boton-accion-reto${primario ? ' primario' : ''}`, 'data-accion': accion, disabled: deshabilitado }, texto);
  b.addEventListener('click', alPulsar);
  return b;
};
function pintarNotaReto(interacciones: Interaccion[]) {
  const r = retoActual()!;
  const st = reto!;
  delete notaCuerpo.dataset.iaCtx;
  if (st.fin) {
    const aciertos = st.resultados.filter((x) => x === 'acierto').length;
    const medias = st.resultados.filter((x) => x === 'parcial').length;
    notaTitulo.textContent = 'Modo reto · resultado';
    notaCuerpo.replaceChildren(
      h('p', { class: 'reto-resultado' }, `Has acertado ${aciertos} de ${retos.length}${medias ? `; ${medias} más, a medias` : ''}.`),
      h('ol', { class: 'reto-resumen' }, ...retos.map((x, i) => h('li', { 'data-resultado': st.resultados[i] ?? '' }, `${causasDeReto(x).map((id) => (x.causas[id] ? chipCausa(id, x.causas[id]).texto + (x.variantes?.[id] ? ` ${nodo(id).variantes?.find((va) => va.id === x.variantes![id])?.corto ?? ''}` : '') : id)).join(' y ')}`))),
      h('div', { class: 'reto-acciones' },
        botonAccion('de-nuevo', 'Empezar de nuevo', () => entrarReto(), true),
        botonAccion('salir', 'Salir del reto', salirReto),
      ),
    );
    return;
  }
  const n = r.profesor ? 'Reto del profesor' : `Reto ${r.id}`;
  if (st.correccion) {
    const c = st.correccion;
    const lista = (ids: string[]) => enumerar(ids.map(nombreCausaReto));
    const titular =
      c.resultado === 'acierto' ? `Correcto: ${lista(c.aciertos)}`
      : c.resultado === 'parcial' ? `A medias: aciertas ${lista(c.aciertos)}`
      : `No: ${causasDeReto(r).length > 1 ? 'eran' : 'era'} ${lista(causasDeReto(r))}`;
    const detalle = [
      c.resultado !== 'fallo' && c.faltan.length ? `Te falta ${lista(c.faltan)}.` : '',
      c.sobran.length ? `${c.sobran.length === 1 ? 'Sobra' : 'Sobran'} ${enumerar(c.sobran.map(cortoLimpio))}.` : '',
    ].filter(Boolean).join(' ');
    notaTitulo.textContent = `${n} · solución`;
    notaCuerpo.replaceChildren(
      ...[
        h('p', { class: 'reto-titular', 'data-resultado': c.resultado }, h('span', { 'aria-hidden': 'true' }, c.resultado === 'acierto' ? '✓ ' : c.resultado === 'parcial' ? '◐ ' : '✗ '), titular),
        detalle ? h('p', { class: 'reto-detalle' }, detalle) : null,
        h('div', { class: 'reto-acciones' },
          r.profesor
            ? botonAccion('salir', 'Salir del reto', salirReto, true)
            : botonAccion('siguiente', st.indice >= retos.length - 1 ? 'Ver el resultado' : 'Siguiente reto', siguienteReto, true),
        ),
        ...(r.profesor ? notaSolucionProfesor(r) : [
          h('p', { class: 'reto-subtitulo' }, 'Lo que lo delataba'),
          h('ul', { class: 'reto-delata' }, ...r.delata.map((d) => h('li', {}, ...enlazarNota(d, undefined, new Set())))),
        ]),
        ...interacciones.map(bandaInteraccion),
        h('p', { class: 'reto-pie tenue' }, r.profesor && !Object.keys(r.claves).length
          ? 'Los mandos muestran ya las causas del paciente: puedes girarlos y comparar.'
          : `Los valores marcados en violeta ${r.profesor ? 'son los que más se mueven' : 'en la presión, los mecanismos y la analítica son las claves'}. Los mandos muestran ya las causas del paciente: puedes girarlos y comparar.`),
      ].filter((x) => x !== null),
    );
    return;
  }
  notaTitulo.textContent = `${n} · el paciente`;
  const quedan = r.pistas.length - st.pistas;
  notaCuerpo.replaceChildren(
    ...[
      h('p', { class: 'reto-enunciado' }, r.enunciado || SIN_ENUNCIADO),
      h('p', { class: 'reto-pregunta' }, `¿Qué causa o causas explican lo que ves? Mira la presión, los mecanismos y la analítica, y elige ${r.profesor ? 'hasta tres' : 'una o dos'} en «Respuesta».`),
      st.pistas ? h('ol', { class: 'reto-pistas', 'aria-label': 'Pistas' }, ...r.pistas.slice(0, st.pistas).map((p) => h('li', {}, ...enlazarNota(p, undefined, new Set())))) : null,
      h('p', { class: 'reto-eleccion' }, st.elegidas.length ? `Tu respuesta: ${enumerar(st.elegidas.map(cortoLimpio))}.` : 'Todavía no has elegido ninguna causa.'),
      h('div', { class: 'reto-acciones' },
        botonAccion('pista', !r.pistas.length ? 'No hay pistas' : !quedan ? 'Sin más pistas' : r.pistas.length > 1 ? `Pista ${st.pistas + 1} de ${r.pistas.length}` : 'Pista', () => {
          st.pistas = Math.min(r.pistas.length, st.pistas + 1);
          actualizar();
          enfocarAccion('pista');
        }, false, quedan === 0),
        botonAccion('comprobar', 'Comprobar', comprobarReto, true, st.elegidas.length === 0),
      ),
    ].filter((x) => x !== null),
  );
}
/** Sin enunciado del profesor, el alumno solo sabe lo que muestra el simulador. */
const SIN_ENUNCIADO = 'Este reto no tiene enunciado: todo lo que sabes del paciente está en el simulador.';
/** Solución del reto de un profesor: su explicación y los valores que más se mueven. */
function notaSolucionProfesor(r: Reto): HTMLElement[] {
  const claves = Object.entries(r.claves);
  return [
    ...(r.profesor?.explicacion ? [h('p', { class: 'reto-subtitulo' }, 'Explicación del profesor'), h('p', { class: 'reto-explicacion' }, r.profesor.explicacion)] : []),
    ...(claves.length ? [
      h('p', { class: 'reto-subtitulo' }, 'Lo que más se mueve'),
      h('ul', { class: 'reto-claves' }, ...claves.map(([id, f]) => h('li', {}, `${nombreClave(id)} ${f}`))),
    ] : []),
  ];
}
/** Cabecera, placas y claves del reto. */
function pintarReto() {
  app.classList.toggle('en-reto', !!reto);
  app.classList.toggle('reto-oculto', enReto());
  botonReto.setAttribute('aria-pressed', String(!!reto));
  textoBotonReto.textContent = reto ? 'Salir del reto' : 'Modo reto';
  iconoBotonReto.replaceChildren(reto ? ICONO_SALIR() : ICONO_RETO());
  botonReto.title = reto ? 'Salir del modo reto' : 'Modo reto: deduce las causas de un paciente';
  chipReto.hidden = !reto;
  // Pestaña del panel de causas: «Tu respuesta» en el reto.
  const etiqueta = reto ? 'Respuesta' : 'Causas';
  pestanasPanel[0].firstChild!.textContent = etiqueta;
  const pestanaMovil = document.getElementById('pestana-causas');
  if (pestanaMovil?.firstChild) pestanaMovil.firstChild.textContent = reto ? 'Respuesta' : 'Causas';
  const r = retoActual();
  const c = reto?.correccion;
  for (const [id, m] of mandos) {
    const elegida = !!reto?.elegidas.includes(id);
    const marca = !reto || reto.fin ? '' : c ? (c.aciertos.includes(id) ? 'acierto' : c.sobran.includes(id) ? 'sobra' : c.faltan.includes(id) ? 'falta' : '') : elegida ? 'elegida' : '';
    if (marca) m.raiz.dataset.reto = marca;
    else delete m.raiz.dataset.reto;
    const placa = m.raiz.querySelector('.placa')!;
    if (enReto()) {
      placa.setAttribute('aria-pressed', String(elegida));
      placa.setAttribute('aria-label', `${cortoLimpio(id)}: ${elegida ? 'en tu respuesta' : 'sin elegir'}`);
    } else {
      placa.removeAttribute('aria-pressed');
      placa.removeAttribute('aria-label');
    }
  }
  // Claves marcadas al corregir.
  const claves = reto && c && r ? Object.keys(r.claves) : [];
  for (const cel of celdasAnalitica) cel.boton.classList.toggle('clave-reto', claves.includes(cel.id));
  for (const [id, v] of [...ventanasMecanismo, ...ventanasSalida]) v.raiz.classList.toggle('clave-reto', claves.includes(id));
  // Revisión de Fable 5.2: también la sistólica y la diastólica, en la leyenda del dial.
  for (const l of dial.raiz.querySelectorAll<HTMLElement>('.leyenda[data-ficha]')) l.classList.toggle('clave-reto', claves.includes(l.dataset.ficha!));
  if (!reto || !r) {
    chipReto.replaceChildren();
    document.querySelector('.chip-reto-globo')?.remove();
    return;
  }
  if (r.profesor) {
    // Reto de un profesor: sin puntos ni «Siguiente» (es uno solo).
    document.querySelector('.chip-reto-globo')?.remove();
    chipReto.replaceChildren(h('span', { class: 'chip-reto-texto chip-reto-profesor' }, ICONO_ENLACE(), h('strong', {}, 'Reto del profesor')));
    chipReto.setAttribute('aria-label', 'Reto del profesor');
    return;
  }
  chipReto.replaceChildren(
    h('span', { class: 'chip-reto-texto' }, h('strong', {}, `Reto ${r.id}`), h('span', { class: 'chip-reto-total' }, ` de ${retos.length}`)),
    puntosReto(),
    // Corregido: «Siguiente» también en la cabecera, siempre a la vista (al volver los
    // mandos, «Qué mirar» se queda baja en la pantalla ancha).
  );
  if (c && !reto.fin) chipReto.append(botonAccion('siguiente', reto.indice >= retos.length - 1 ? 'Resultado' : 'Siguiente', siguienteReto, true));
  const hechos = reto.resultados.filter((x) => x === 'acierto').length;
  chipReto.setAttribute('aria-label', `Reto ${r.id} de ${retos.length}. Aciertos: ${hechos}`);
}
function pintarNotaTexto(caso: Caso | undefined) {
  if (!caso) {
    const algunaActiva = hayEntradas();
    notaTitulo.textContent = algunaActiva ? 'Combinación libre' : 'Cómo empezar';
    delete notaCuerpo.dataset.iaCtx;
    notaCuerpo.replaceChildren(
      h(
        'p',
        {},
        algunaActiva
          ? 'Esta combinación no es uno de los casos del simulador. Mira qué mecanismos se mueven y compara las escalas de tiempo.'
          : 'Elige un caso en la cabecera o gira un mando de causa. Después cambia la escala de tiempo para ver cómo evoluciona, o prueba un fármaco o una sesión de ejercicio.',
      ),
    );
    return;
  }
  notaTitulo.textContent = 'Qué mirar en este caso';
  // Enlaces internos: cada nodo una vez en toda la nota.
  const usados = new Set<string>();
  notaCuerpo.replaceChildren(
    ...[
    queMirar[caso.id] ? h('p', { class: 'nota-principal' }, ...enlazarNota(queMirar[caso.id], undefined, usados)) : null,
    casosConRetencion.includes(caso.id) && escala === 'estable' && !enSesion() ? h('p', { class: 'nota-secundaria' }, ...enlazarNota(notaRetencion, undefined, usados)) : null,
    caso.nota
      ? h('p', { class: 'nota-caso' }, h('strong', {}, caso.ejercicio ? 'El ejercicio. ' : caso.farmacos ? 'El fármaco. ' : 'La fisiología. '), ...enlazarNota(caso.nota, undefined, usados))
      : null,
    ].filter((x) => x !== null),
  );
  notaCuerpo.dataset.iaCtx = `las claves del caso «${caso.nombre}» en un simulador docente y cualitativo de las causas de la hipertensión arterial`;
  notaCuerpo.dataset.iaApartado = 'Qué mirar en este caso';
}
// Fuera de la ficha, los enlaces de «Qué mirar» abren la ficha desde cero.
const enlazarNota = crearEnlazador(terminos, (id) => abrirFicha(id));


// --- Tratamiento: chip, cuenta de la pestaña e insignias en las ventanas ---
/** Ventanas (mecanismos y salidas) por id, para las insignias de los fármacos. */
const ventanasPorId = () => new Map([...ventanasMecanismo, ...ventanasSalida]);
/** Nodo → fármacos que actúan sobre él (destino de sus relaciones), con «⊘» si bloquean. */
const dianas = new Map<string, { farmaco: string; bloquea: boolean }[]>();
for (const r of modelo.relaciones) {
  if (!ordenFarmacos.includes(r.origen)) continue;
  dianas.set(r.destino, [...(dianas.get(r.destino) ?? []), { farmaco: r.origen, bloquea: r.tipo === 'bloquea' }]);
}
let claveTratamiento: string | null = null;
function pintarTratamiento() {
  const activos = ordenFarmacos.filter((id) => farmacos[id] !== 0);
  const clave = activos.map((id) => `${id}:${farmacos[id]}`).join(',');
  if (clave === claveTratamiento) return;
  claveTratamiento = clave;
  const nombres = activos.map((id) => `${cortoLimpio(id)} · ${textoDosis(farmacos[id]).replace('dosis plena', 'plena')}`);
  chipTratamiento.hidden = activos.length === 0;
  // «Quitar tratamiento» siempre en su sitio (la rejilla no se mueve), pero
  // apagado si no hay nada que quitar y destacado si hay fármacos.
  quitarTratamiento.disabled = activos.length === 0;
  textoChip.textContent = nombres.join(' + ');
  chipTratamiento.setAttribute('aria-label', `Tratamiento: ${nombres.join(', ')}. Ver los fármacos`);
  chipTratamiento.title = 'Tratamiento activo: ver los fármacos';
  cuentaFarmacos.hidden = activos.length === 0;
  cuentaFarmacos.textContent = String(activos.length);
  cuentaFarmacos.setAttribute('aria-label', `${activos.length} activo${activos.length === 1 ? '' : 's'}`);
  movil?.contarFarmacos(activos.length);
  for (const [id, v] of ventanasPorId()) {
    v.raiz.querySelector(':scope > .insignia-farmaco')?.remove();
    const lista = (dianas.get(id) ?? []).filter((d) => farmacos[d.farmaco] !== 0);
    if (!lista.length) {
      v.raiz.removeAttribute('aria-description');
      continue;
    }
    const texto = lista.map((d) => `${d.bloquea ? '⊘' : '↓'} ${farmacosVista[d.farmaco].insignia}`).join(' · ');
    v.raiz.append(h('span', { class: 'insignia-farmaco', 'aria-hidden': 'true' }, texto));
    v.raiz.setAttribute('aria-description', `Actúa: ${lista.map((d) => cortoLimpio(d.farmaco)).join(', ')}`);
  }
}

// --- Ejercicio: chip, cuenta de la pestaña, momento y escala de tiempo ---
function pintarEjercicio() {
  const sesion = ordenSesion.filter((id) => ejercicio[id] !== 0);
  const entreno = ordenEntrenamiento.filter((id) => ejercicio[id] !== 0);
  // «Aeróbica intensa · al terminar», «Entreno isométrico regular».
  const partes = textosEjercicio();
  if (sesion.length) partes[sesion.length - 1] += ` · ${NOMBRE_MOMENTO[momento].toLowerCase()}`;
  chipEjercicio.hidden = partes.length === 0;
  textoChipEjercicio.textContent = partes.join(' + ');
  chipEjercicio.setAttribute('aria-label', `Ejercicio: ${partes.join(', ')}. Ver el ejercicio`);
  chipEjercicio.title = 'Ejercicio: ver la sesión y el entrenamiento';
  const n = sesion.length + entreno.length;
  cuentaEjercicio.hidden = n === 0;
  cuentaEjercicio.textContent = String(n);
  cuentaEjercicio.setAttribute('aria-label', `${n} activo${n === 1 ? '' : 's'}`);
  movil?.contarEjercicio(n);
  sinEjercicio.disabled = n === 0 && momento === 'antes';
  for (const b of botonesMomento) b.setAttribute('aria-pressed', String(b.dataset.momento === momento));
  // En la sesión la escala de tiempo no cuenta: el interruptor se apaga (sigue
  // siendo pulsable: elegir una escala vuelve al reposo).
  const sesionActiva = enSesion();
  interruptorEscala.toggleAttribute('data-sesion', sesionActiva);
  notaEscalaSesion.hidden = !sesionActiva;
  for (const b of botonesEscala) {
    b.setAttribute('aria-pressed', String(!sesionActiva && b.dataset.escala === escala));
    b.title = sesionActiva ? 'La sesión parte del estado estable. Elige una escala para volver al reposo' : '';
  }
}

// --- Valores orientativos (fase 6, punto 5) ---
/** En una sesión de fuerza la presión real se sale de la escala del simulador: no se da cifra. */
const enFuerza = () => momento === 'durante' && (ejercicio.sesionFuerza ?? 0) > 0;
/** «≈ 145 mmol/L · normal 135–145» para la ficha. */
function textoOrientativo(id: string, valores: Record<string, number>): string | null {
  const d = valoresOrientativos[id];
  if (!d) return null;
  const texto = d.enSesionFuerza && enFuerza() ? d.enSesionFuerza : traducir(valores[id] ?? 0, d, reglasAvisos.fueraDeRango.umbral).texto;
  return `${texto} · normal ${d.normal} ${d.unidad}${d.aclaracion ? ` (${d.aclaracion})` : ''}`;
}
function pintarValores(v: Record<string, number>) {
  app.classList.toggle('con-valores', verValores);
  for (const c of celdasAnalitica) {
    const d = valoresOrientativos[c.id];
    c.cifra.hidden = c.rango.hidden = !verValores || !d;
    if (!verValores || !d) {
      c.boton.removeAttribute('aria-description');
      c.boton.removeAttribute('title');
      continue;
    }
    const t = traducir(v[c.id] ?? 0, d, reglasAvisos.fueraDeRango.umbral);
    c.cifra.textContent = t.texto;
    // Si la banda ya es la normal, la línea gris repetiría lo mismo.
    c.rango.textContent = t.banda === 'normal' || t.texto === 'normal' ? '' : `normal ${d.normal}`;
    c.boton.setAttribute('aria-description', `Orientativo: ${t.texto}. Normal: ${d.normal} ${d.unidad}`);
    c.boton.title = `Orientativo. Normal: ${d.normal} ${d.unidad}${d.aclaracion ? ` (${d.aclaracion})` : ''}`;
  }
  presionOrientativa.hidden = !verValores;
  if (verValores) {
    const pas = valoresOrientativos.pas;
    const cifra = (id: 'pas' | 'pad') => traducir(v[id] ?? 0, valoresOrientativos[id], reglasAvisos.fueraDeRango.umbral).texto.replace(' mmHg', '');
    // Un solo «≈» si las dos lo llevan; si una está en el tope, cada una con su signo.
    const pasT = cifra('pas');
    const padT = cifra('pad');
    const presion = pasT.startsWith('≈') && padT.startsWith('≈') ? `${pasT}/${padT.replace(/^≈ /, '')}` : `${pasT} / ${padT}`;
    presionOrientativa.replaceChildren(
      h('span', { class: 'etiqueta-orientativo' }, 'orientativo'),
      ' ',
      // La cifra no se parte («≈ 140/90 mmHg» con espacios que no se cortan).
      enFuerza() ? h('strong', {}, pas.enSesionFuerza ?? '') : h('strong', {}, `${presion} mmHg`.replace(/ /g, '\u00a0')),
      h('span', { class: 'presion-normal' }, ' · normal en reposo < 130/85'),
    );
  }
}

function actualizar() {
  resultado = calcular();
  const v = resultado.valores;

  pintarEjercicio();
  pintarVariantes();

  const caso = casoActual();
  const algunaActiva = hayEntradas();
  selector.poner(caso, algunaActiva);
  pintarTratamiento();

  for (const [id, ind] of ventanasMecanismo) ind.poner(v[id]);
  for (const [id, ind] of ventanasSalida) ind.poner(v[id]);
  dial.poner(v.pas, v.pad, v.pam, resultado.base && { pas: resultado.base.pas, pad: resultado.base.pad });
  vasos.poner(v);
  for (const p of listaVaso) {
    p.flechaVaso.textContent = flecha(v[p.nodo]);
    p.flechaVaso.dataset.tono = tono(v[p.nodo]);
    p.flechaVaso.setAttribute('aria-label', enPalabras(v[p.nodo]));
  }
  for (const c of celdasAnalitica) {
    c.valor.textContent = flecha(v[c.id]);
    c.valor.dataset.tono = tono(v[c.id]);
    c.boton.setAttribute('aria-label', `${nodo(c.id).nombre}: ${enPalabras(v[c.id])}. Abrir su ficha`);
  }
  subtituloAnalitica.textContent = `${nombreTiempo()} · respecto a lo normal${verValores ? ' · valores orientativos' : ''}`;
  pintarValores(v);
  // Avisos de realismo.
  // En el reto (sin corregir) no hay avisos: nombrarían la causa.
  const hipotetica = enReto() ? [] : combinacionHipotetica(modelo, causas, reglasAvisos);
  // Primero los avisos de fármacos y ejercicio; después, las notas entre causas (fase 6).
  const interacciones = enReto() ? [] : [...interaccionesActivas(entradas(), reglasAvisos, momento, reglasAvisos.interacciones, variantes), ...notasActivas(causas, reglasAvisos, variantes)];
  pintarReto();
  pintarHipotetica(hipotetica);
  pintarNota(caso, hipotetica, interacciones);
  // Fase N2: con topes declarados por caso, el aviso depende del caso abierto (en la hipertensión, no).
  const fuera = new Set(fueraDeRango(v, reglasAvisos, caso));
  for (const c of celdasAnalitica) marcarFuera(c.boton, fuera.has(c.id));
  for (const [id, ind] of ventanasSalida) marcarFuera(ind.raiz, fuera.has(id));
  dial.marcarFuera((id) => fuera.has(id), marcarFuera);
  pintarCompartido();
  compartir.refrescar();
  compactarCabecera();
  const rv = retoActual();
  movil.pintar(
    v,
    reto && rv
      ? reto.fin
        ? { titulo: 'Modo reto', texto: `${reto.resultados.filter((x) => x === 'acierto').length} de ${retos.length} aciertos. Toca para ver el resultado`, nivel: 'reto' }
        : reto.correccion
          ? { titulo: reto.correccion.resultado === 'acierto' ? '✓ Correcto' : reto.correccion.resultado === 'parcial' ? '◐ A medias' : '✗ No', texto: rv.profesor ? 'Toca para ver la solución' : 'Toca para ver lo que lo delataba', nivel: 'reto' }
          : { titulo: rv.profesor ? 'Reto del profesor' : `Reto ${rv.id}`, texto: rv.enunciado || SIN_ENUNCIADO, nivel: 'reto' }
      : compartido?.pregunta
      ? { titulo: 'Pregunta', texto: compartido.pregunta, nivel: 'enlace' }
      : hipotetica.length
      ? { titulo: reglasAvisos.hipotetica.titulo, texto: textoBarraHipotetica(hipotetica) }
      : interacciones.length
        ? { titulo: interacciones[0].titulo, texto: interacciones[0].texto, nivel: interacciones[0].nivel }
        : compartido
          ? { titulo: 'Caso compartido', texto: 'Abierto desde un enlace', nivel: 'enlace' }
          : undefined,
  );
  anunciar();
}

// --- Cabecera de la pantalla ancha en una fila (fase 6) ---
// Con «Compartir», los chips de tratamiento y ejercicio o «Grande», los
// controles pueden no caber junto al título. Se compactan por pasos hasta que
// caben: 1, «Modo reto» solo con icono; 2, también Compartir, Ajustes y Sonido.
// Si ni así caben, se quedan como estaban (en dos filas).
const controlesCabecera = cabecera.querySelector<HTMLElement>('.controles')!;
const tituloCabecera = cabecera.querySelector<HTMLElement>('.titulo')!;
function cabeceraEnUnaFila(): boolean {
  const piezas = [...controlesCabecera.children].filter((e) => (e as HTMLElement).offsetParent).map((e) => e.getBoundingClientRect());
  if (!piezas.length) return true;
  const finPrimera = Math.min(...piezas.map((r) => r.bottom));
  return piezas.every((r) => r.top < finPrimera) && controlesCabecera.getBoundingClientRect().top < tituloCabecera.getBoundingClientRect().bottom;
}
function compactarCabecera() {
  delete cabecera.dataset.apretada;
  if (MOVIL.matches || cabeceraEnUnaFila()) return;
  for (const nivel of ['1', '2']) {
    cabecera.dataset.apretada = nivel;
    if (cabeceraEnUnaFila()) return;
  }
  delete cabecera.dataset.apretada;
}

// --- «Qué mirar» en el tablero: al posar el cursor crece hacia arriba ---
// Solo si el texto no cabe. Se superpone a las últimas ruedas (no empuja nada)
// y espera un poco para no abrirse al pasar el ratón camino de una rueda.
let temporizadorNota = 0;
function ampliarNota() {
  if (!modoTablero.matches || tarjetaNota.classList.contains('ampliada')) return;
  if (tarjetaNota.scrollHeight <= tarjetaNota.clientHeight + 1) return;
  tarjetaNota.style.minHeight = `${tarjetaNota.offsetHeight}px`;
  tarjetaNota.classList.add('ampliada');
}
function reducirNota() {
  clearTimeout(temporizadorNota);
  tarjetaNota.classList.remove('ampliada');
  tarjetaNota.style.minHeight = '';
  tarjetaNota.scrollTop = 0;
}
tarjetaNota.addEventListener('pointerenter', (e) => {
  if (e.pointerType !== 'mouse') return;
  clearTimeout(temporizadorNota);
  temporizadorNota = window.setTimeout(ampliarNota, 200);
});
tarjetaNota.addEventListener('pointerleave', reducirNota);
// Solo con el foco del teclado: si el foco llega por programa (p. ej. a «Siguiente reto»), no tapa los mandos.
tarjetaNota.addEventListener('focusin', (e) => {
  if ((e.target as Element).matches(':focus-visible')) ampliarNota();
});
tarjetaNota.addEventListener('focusout', (e) => {
  if (!tarjetaNota.contains(e.relatedTarget as Node)) reducirNota();
});
// La nota necesita poder recibir el foco con el teclado.
tarjetaNota.tabIndex = 0;

// --- Tablero de escritorio: ajuste al alto de la ventana ---
// Si con el diseño compacto algo no cabe, el tablero se reduce un poco (zoom
// hasta el 80 %) para entrar entero; por debajo de eso, scroll en la columna.
const modoTablero = consulta('(min-width: 1200px) and (min-height: 700px)');
function ajustarTablero() {
  columnas.style.zoom = '';
  tarjetaPresion.classList.remove('crece');
  tarjetaPresion.style.removeProperty('--dial');
  panelCausas.classList.remove('compacto');
  if (!modoTablero.matches) return;
  const calcularFactor = () => {
    let f = 1;
    for (const col of columnas.children as HTMLCollectionOf<HTMLElement>) {
      // En la columna izquierda la nota puede encogerse hasta su mínimo: cuenta solo el panel de causas y ese mínimo.
      const necesario = col.classList.contains('columna-izquierda')
        ? panelCausas.offsetHeight + 12 + 100
        : col.scrollHeight;
      if (necesario > col.clientHeight) f = Math.min(f, col.clientHeight / necesario);
    }
    return f;
  };
  let factor = calcularFactor();
  // Pantallas muy bajas: ni al 80 % caben las causas y «Qué mirar». El panel de
  // causas se compacta (sin la línea de ayuda, mandos algo menores).
  const izquierda = columnaIzquierda.clientHeight / (panelCausas.offsetHeight + 12 + 100);
  if (izquierda < 0.8) {
    panelCausas.classList.add('compacto');
    factor = calcularFactor();
  }
  const zoom = factor < 1 ? Math.max(0.8, Math.floor(factor * 100) / 100) : 1;
  if (zoom < 1) columnas.style.zoom = String(zoom);
  // Si en la columna central sobra alto (también cuando otra columna ha obligado
  // a reducir el tablero), la tarjeta de presión lo ocupa y el dial crece hasta
  // 240 px. Las medidas en pantalla van escaladas por el zoom; el ancho del dial, no.
  // Con «Grande», las medidas en pantalla llevan además el zoom de la página.
  const escalaPantalla = zoomPagina();
  const sobra = (centro.getBoundingClientRect().bottom - panelAnalitica_.getBoundingClientRect().bottom) / escalaPantalla;
  if (sobra > 16) {
    const actual = dial.raiz.querySelector('svg')!.getBoundingClientRect().width / escalaPantalla;
    tarjetaPresion.style.setProperty('--dial', `${Math.round(Math.min(240, (actual + sobra - 8) / zoom))}px`);
    tarjetaPresion.classList.add('crece');
  }
}
// Si cambia el alto de los vasos («Cómo leerlos», «Rotular capas»), se recalcula.
let ajustePendiente = 0;
new ResizeObserver(() => {
  cancelAnimationFrame(ajustePendiente);
  ajustePendiente = requestAnimationFrame(ajustarTablero);
}).observe(vasos.raiz);
window.addEventListener('resize', () => {
  reducirNota();
  compactarCabecera();
  ajustarTablero();
});
modoTablero.addEventListener('change', ajustarTablero);
document.fonts?.ready.then(() => {
  compactarCabecera();
  ajustarTablero();
});

// Modo diagnóstico de las ruedas (?depurar): los eventos del dedo, en pantalla.
if (new URLSearchParams(location.search).has('depurar')) {
  const registro = h('pre', { class: 'registro-depurar', 'aria-hidden': 'true' });
  const lineas: string[] = [];
  const anotar = (t: string) => {
    lineas.unshift(`${(performance.now() / 1000).toFixed(2)} ${t}`);
    lineas.length = Math.min(lineas.length, 14);
    registro.textContent = `${navigator.userAgent.match(/Chrome\/[\d.]+/)?.[0] ?? ''} · coarse ${window.matchMedia('(pointer: coarse)').matches}\n${lineas.join('\n')}`;
  };
  document.addEventListener('mando-depurar', (e) => anotar((e as CustomEvent<string>).detail));
  for (const tipo of ['touchstart', 'touchend', 'touchcancel', 'contextmenu']) {
    document.addEventListener(tipo, (e) => {
      if ((e.target as Element)?.closest?.('.mando-control')) anotar(`${tipo}${'cancelable' in e ? (e.cancelable ? '' : ' (no cancelable)') : ''}`);
    }, { passive: true, capture: true });
  }
  document.body.append(registro);
}
movil.aplicar();
if (!leerEnlaceReto()) leerEnlace();
actualizar();
ajustarTablero();
ultimoAnuncio = anuncio.textContent = '';
clearTimeout(temporizadorAnuncio);

// --- PWA: instalable y sin conexión (hito 3e) ---
// Dentro del hub PhysiQ (iframe) no se registra: el hub tiene su propia PWA.
// Solo en la build publicada (en desarrollo, el service worker estorbaría).
const enHub = window.self !== window.top;
document.documentElement.classList.toggle('en-hub', enHub);
if (import.meta.env.PROD && !enHub && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch((e) => console.warn('Radiostasis · sin service worker:', e));
  });
}

// Para las pruebas automáticas y la consola.
Object.assign(window, { radiostasis: { modelo, causas, farmacos, ejercicio, get momento() { return momento; }, get escala() { return escala; }, get resultado() { return resultado; } } });
