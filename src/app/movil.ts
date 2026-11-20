import type { Estado } from '../motor/tipos';
import { flecha } from '../motor/motor';
import { h, s } from './dom';
import { enPalabras } from './formato';
import { crearHoja, MOVIL } from './hoja';
import type { Vasos } from './vasos';

/** Piezas de la página que la distribución de móvil recoloca (siempre las mismas, nunca copias). */
export interface Piezas {
  app: HTMLElement;
  columnas: HTMLElement;
  columnaIzquierda: HTMLElement;
  centro: HTMLElement;
  columnaDerecha: HTMLElement;
  panelCausas: HTMLElement;
  panelMecanismos: HTMLElement;
  panelAnalitica: HTMLElement;
  tarjetaPresion: HTMLElement;
  tarjetaNota: HTMLElement;
  notaTitulo: HTMLElement;
  notaCuerpo: HTMLElement;
  vasos: Vasos;
  listaVaso: HTMLElement;
  dial: HTMLElement;
}

/**
 * Distribución de móvil (hito 3c):
 * - Arriba, fijos al bajar si la pantalla tiene alto: vasos, presión y pestañas.
 * - Pestañas Causas · Mecanismos · Analítica, para girar una causa y ver el efecto sin bajar.
 * - «Qué mirar» como barra al pie; al tocarla, la nota completa en una hoja.
 * - Si el dial sale de la vista (pantallas bajas o texto ampliado), una pastilla
 *   con PAS y PAD que devuelve al dial.
 */
/** Vistas del panel de madera, que comparten las pestañas de mandos. */
export type VistaPanel = 'causas' | 'farmacos' | 'ejercicio';
const VISTAS_PANEL: string[] = ['causas', 'farmacos', 'ejercicio'];

export function crearMovil(p: Piezas, alCambiar: () => void, alElegirVista: (v: VistaPanel) => void) {
  const hoja = crearHoja();
  // Cabeza fija: vasos, presión y pestañas.
  const cabeza = h('div', { class: 'cabeza-movil' });

  // --- Pestañas ---
  const cuenta = h('span', { class: 'cuenta-farmacos', hidden: true });
  const cuentaEjercicio = h('span', { class: 'cuenta-farmacos cuenta-ejercicio', hidden: true });
  // Causas, Fármacos y Ejercicio comparten el panel de madera (fases 4 y 5): al
  // elegir una, el panel se mueve a su pestaña y muestra sus mandos.
  const definicion = [
    { id: 'causas', nombre: 'Causas', panel: p.panelCausas },
    { id: 'farmacos', nombre: 'Fármacos', panel: p.panelCausas },
    { id: 'ejercicio', nombre: 'Ejercicio', panel: p.panelCausas },
    { id: 'mecanismos', nombre: 'Mecanismos', panel: p.panelMecanismos },
    { id: 'analitica', nombre: 'Analítica', panel: p.panelAnalitica },
  ];
  const pestanas = definicion.map((d) => {
    const boton = h(
      'button',
      { type: 'button', role: 'tab', id: `pestana-${d.id}`, 'aria-controls': `panel-${d.id}` },
      d.nombre,
      d.id === 'farmacos' ? cuenta : d.id === 'ejercicio' ? cuentaEjercicio : null,
    );
    const contenedor = h('div', { role: 'tabpanel', id: `panel-${d.id}`, 'aria-labelledby': `pestana-${d.id}`, class: 'panel-pestana' });
    return { ...d, boton, contenedor };
  });
  const lista = h('div', { role: 'tablist', 'aria-label': 'Paneles', class: 'pestanas' }, ...pestanas.map((x) => x.boton));
  const paneles = h('div', { class: 'paneles' }, ...pestanas.map((x) => x.contenedor));
  let activa = 0;

  const conMandos = (i: number) => VISTAS_PANEL.includes(definicion[i].id);
  function elegir(i: number, foco = false) {
    activa = i;
    // En las pestañas con mandos se quieren ver los vasos al girar una rueda: nunca plegados.
    if (conMandos(i)) plegar(false);
    if (contenedor.isConnected) pestanas[i].contenedor.replaceChildren(pestanas[i].panel);
    if (conMandos(i)) alElegirVista(definicion[i].id as VistaPanel);
    pestanas.forEach((x, j) => {
      const sel = j === i;
      x.boton.setAttribute('aria-selected', String(sel));
      x.boton.tabIndex = sel ? 0 : -1;
      x.contenedor.hidden = !sel;
    });
    if (foco) pestanas[i].boton.focus();
    // Si la página ya había bajado, el panel nuevo empieza justo bajo la cabeza fija.
    const tope = cabeza.getBoundingClientRect().bottom;
    const inicio = paneles.getBoundingClientRect().top;
    if (getComputedStyle(cabeza).position === 'sticky' && inicio < tope) window.scrollBy(0, inicio - tope);
  }
  pestanas.forEach((x, i) => x.boton.addEventListener('click', () => elegir(i)));
  lista.addEventListener('keydown', (e) => {
    const n = pestanas.length;
    const destino =
      e.key === 'ArrowRight' ? (activa + 1) % n
      : e.key === 'ArrowLeft' ? (activa + n - 1) % n
      : e.key === 'Home' ? 0
      : e.key === 'End' ? n - 1
      : -1;
    if (destino < 0) return;
    e.preventDefault();
    elegir(destino, true);
  });

  // --- «Qué mirar» al pie ---
  const barraTitulo = h('span', { class: 'barra-nota-titulo' });
  const barraTexto = h('span', { class: 'barra-nota-texto' });
  const barra = h(
    'button',
    { type: 'button', class: 'barra-nota', 'aria-haspopup': 'dialog' },
    h('span', { class: 'barra-nota-contenido' }, barraTitulo, ' ', barraTexto),
    s('svg', { width: 14, height: 14, viewBox: '0 0 14 14', 'aria-hidden': 'true' },
      s('path', { d: 'M3 9l4-4 4 4', fill: 'none', class: 'icono-trazo', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ),
  );
  barra.addEventListener('click', () => hoja.abrir(p.notaTitulo.textContent ?? '', p.notaCuerpo));

  // «Cómo leer los vasos», también en la hoja.
  function abrirLectura(): boolean {
    if (!MOVIL.matches) return false;
    p.vasos.textoLeer.hidden = false;
    hoja.abrir('Cómo leer los vasos', p.vasos.textoLeer, p.listaVaso, p.vasos.notaVasos, p.vasos.botonCapas);
    return true;
  }

  // --- Vasos plegables ---
  // Al bajar por Mecanismos o Analítica, los dibujos de los vasos se recogen en
  // una barra fina para dejar sitio a los paneles; al tocarla o al volver
  // arriba, se despliegan. Solo con la cabeza fija (pantallas con alto).
  const resumenVasos = h('span', { class: 'barra-vasos-resumen' });
  const barraVasos = h(
    'button',
    { type: 'button', class: 'barra-vasos', 'aria-expanded': 'false', hidden: true },
    h('span', {}, h('strong', {}, 'Vasos'), ' · ', resumenVasos),
    h('span', { class: 'barra-vasos-ver', 'aria-hidden': 'true' }, '▾ ver'),
  );
  barraVasos.setAttribute('aria-label', 'Vasos plegados. Mostrar los vasos');
  let plegado = false;
  /** Scroll a partir del cual se vuelve a plegar tras desplegar a mano. */
  let umbralPlegar = 200;
  function plegar(si: boolean) {
    if (si === plegado) return;
    plegado = si;
    cabeza.classList.toggle('plegada', si);
    barraVasos.hidden = !si;
  }
  barraVasos.addEventListener('click', () => {
    plegar(false);
    umbralPlegar = window.scrollY + 200;
  });
  window.addEventListener(
    'scroll',
    () => {
      if (!MOVIL.matches || getComputedStyle(cabeza).position !== 'sticky') return plegar(false);
      const y = window.scrollY;
      if (y < 10) {
        umbralPlegar = 200;
        plegar(false);
      } else if (y > umbralPlegar && !conMandos(activa)) plegar(true);
    },
    { passive: true },
  );

  const contenedor = h('div', { class: 'movil' }, cabeza, paneles, barra);

  // Fija solo si deja sitio para el panel: con «Grande» la cabeza puede ocupar
  // tres cuartos de la pantalla y las placas quedaban en una franja de 60 px.
  // Si pasa del 55 % del alto, no se fija y aparece la pastilla de presión.
  // Con los vasos plegados no se mide (la cabeza es más baja de lo normal).
  function ajustarFijo() {
    if (!MOVIL.matches || plegado) return;
    const alta = cabeza.getBoundingClientRect().height > window.innerHeight * 0.55;
    cabeza.classList.toggle('libre', alta);
  }
  window.addEventListener('resize', ajustarFijo);
  new ResizeObserver(ajustarFijo).observe(cabeza);

  // --- Pastilla de presión ---
  const pastillaPas = h('span', { class: 'pastilla-flecha' });
  const pastillaPad = h('span', { class: 'pastilla-flecha' });
  const pastilla = h(
    'button',
    { type: 'button', class: 'pastilla-presion', hidden: true },
    h('span', { class: 'muestra pas' }),
    'PAS ',
    pastillaPas,
    h('span', { class: 'muestra pad' }),
    'PAD ',
    pastillaPad,
  );
  pastilla.addEventListener('click', () => {
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    p.dial.scrollIntoView({ block: 'center', behavior: suave ? 'smooth' : 'auto' });
  });
  // Visible solo en el móvil y cuando el dial ha salido de la vista por arriba.
  let dialFuera = false;
  const observador = new IntersectionObserver(([e]) => {
    dialFuera = !e.isIntersecting && e.boundingClientRect.top < 0;
    pastilla.hidden = !(dialFuera && MOVIL.matches);
  });
  observador.observe(p.dial);

  p.app.append(pastilla, hoja.raiz);

  function aMovil() {
    // La lista de propiedades y las notas de los vasos solo se ven en la hoja «Cómo leerlos».
    p.vasos.textoLeer.remove();
    p.listaVaso.remove();
    p.vasos.notaVasos.remove();
    // En el móvil «Rotular capas» va dentro de «Cómo leer los vasos»: arriba no cabe otro botón.
    p.vasos.botonCapas.remove();
    cabeza.replaceChildren(barraVasos, p.vasos.raiz, p.tarjetaPresion, lista);
    pestanas.forEach((x, i) => x.contenedor.replaceChildren(i === 1 ? '' : x.panel));
    p.columnas.replaceWith(contenedor);
    elegir(activa);
  }

  function aEscritorio() {
    hoja.cerrar();
    plegar(false);
    // Lo que se llevó a las hojas vuelve a su sitio.
    const { cuerpo, textoLeer, notaVasos, botonLeer } = p.vasos;
    textoLeer.hidden = true;
    botonLeer.setAttribute('aria-expanded', 'false');
    cuerpo.before(textoLeer);
    cuerpo.append(p.listaVaso);
    cuerpo.after(notaVasos);
    p.vasos.botonLeer.after(p.vasos.botonCapas);
    p.tarjetaNota.replaceChildren(p.notaTitulo, p.notaCuerpo);
    p.columnaIzquierda.replaceChildren(p.panelCausas, p.tarjetaNota);
    p.centro.replaceChildren(p.vasos.raiz, p.tarjetaPresion, p.panelAnalitica);
    p.columnaDerecha.replaceChildren(p.panelMecanismos);
    contenedor.replaceWith(p.columnas);
  }

  function aplicar() {
    p.app.classList.toggle('en-movil', MOVIL.matches);
    if (MOVIL.matches) aMovil();
    else if (contenedor.isConnected) aEscritorio();
    pastilla.hidden = !(dialFuera && MOVIL.matches);
    alCambiar();
    ajustarFijo();
  }
  MOVIL.addEventListener('change', aplicar);

  return {
    aplicar,
    abrirLectura,
    cerrarHoja: () => hoja.cerrar(),
    /** Muestra la pestaña de causas, fármacos o ejercicio (desde un chip o las pestañas del panel). */
    elegirVista(v: VistaPanel) {
      const i = definicion.findIndex((d) => d.id === v);
      if (MOVIL.matches && contenedor.isConnected && activa !== i) elegir(i);
      else if (!contenedor.isConnected && conMandos(activa)) activa = i;
    },
    contarFarmacos(n: number) {
      cuenta.hidden = n === 0;
      cuenta.textContent = String(n);
      cuenta.setAttribute('aria-label', `${n} activo${n === 1 ? '' : 's'}`);
    },
    contarEjercicio(n: number) {
      cuentaEjercicio.hidden = n === 0;
      cuentaEjercicio.textContent = String(n);
      cuentaEjercicio.setAttribute('aria-label', `${n} activo${n === 1 ? '' : 's'}`);
    },
    /**
     * `aviso`: «Combinación hipotética» o una interacción de fármacos, que ocupa
     * la barra del pie en lugar de la nota.
     */
    pintar(v: Estado, aviso?: { titulo: string; texto: string; nivel?: string }) {
      resumenVasos.textContent = p.vasos.resumen;
      barra.classList.toggle('con-aviso', !!aviso);
      if (aviso?.nivel) barra.dataset.nivel = aviso.nivel;
      else delete barra.dataset.nivel;
      barraTitulo.textContent = `${aviso?.titulo ?? p.notaTitulo.textContent}:`;
      barraTexto.textContent = aviso?.texto ?? p.notaCuerpo.firstElementChild?.textContent ?? '';
      barra.setAttribute('aria-label', `${aviso ? `${aviso.titulo}: ${aviso.texto}. ` : ''}${p.notaTitulo.textContent}. Abrir la nota completa`);
      pastillaPas.textContent = flecha(v.pas);
      pastillaPad.textContent = flecha(v.pad);
      pastilla.setAttribute('aria-label', `Presión: sistólica ${enPalabras(v.pas)}, diastólica ${enPalabras(v.pad)}. Volver al dial`);
    },
  };
}
