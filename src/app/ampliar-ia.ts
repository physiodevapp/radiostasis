import { h } from './dom';
import { altoVentana, rectCss, scrollCss } from './preferencias';

/**
 * «Ampliar con IA», como en physiq-assessment (`ampliar-ia.js`), adaptado a un
 * simulador docente. Desde el texto de una ficha o de «Qué mirar», el alumno
 * abre una conversación en una IA de búsqueda con una pregunta ya preparada:
 *   · seleccionando un trozo de texto → barra flotante «✨ Ampliar en … ↗ | ▾»
 *     bajo la selección (en táctil, 32 px más abajo, para no tapar los
 *     marcadores de selección del sistema);
 *   · «✨ Preguntar sobre esta ficha ↗» al pie de cada ficha (Qué es, Qué hace
 *     y En este caso).
 * La ▾ abre el menú para elegir destino; la elección se recuerda en el
 * dispositivo (localStorage, como una preferencia de pantalla).
 *
 * Solo se envía texto docente genérico y dónde está (nodo, apartado, caso). Solo
 * se activa dentro de un contenedor con `data-ia-ctx`. Consulta externa:
 * Radiostasis no revisa la respuesta. Dentro de un iframe (hub PhysiQ) no se
 * activa. Los enlaces son <a target="_blank"> con el href calculado al
 * pulsar: así el navegador no los bloquea.
 */

export const DESTINOS_IA = {
  perplexity: {
    nombre: 'Perplexity',
    url: (q: string) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`,
    ventaja: 'Cita cada afirmación con su fuente enlazada: la mejor para llegar al artículo original.',
  },
  // El modo IA de Google funciona con Gemini y acepta la pregunta en el enlace;
  // la app de Gemini no tiene un enlace documentado con la pregunta ya escrita.
  google: {
    nombre: 'Google (Gemini)',
    url: (q: string) => `https://www.google.com/search?udm=50&q=${encodeURIComponent(q)}`,
    ventaja: 'Respuesta rápida y conversación ágil; mezcla más webs divulgativas y las fuentes se ven menos.',
  },
  // Pide sesión iniciada; ?q= no está documentado oficialmente: si deja de
  // funcionar, Claude se abre con la caja vacía.
  claude: {
    nombre: 'Claude',
    url: (q: string) => `https://claude.ai/new?q=${encodeURIComponent(q)}`,
    ventaja: 'Razona y explica mejor el porqué. Pide iniciar sesión (cuenta gratuita) y tener activada la búsqueda web para citar fuentes.',
  },
} as const;
export type DestinoIA = keyof typeof DESTINOS_IA;
export const DESTINO_IA_DEFECTO: DestinoIA = 'perplexity';
const CLAVE_DESTINO = 'radiostasis-ia-destino';

/** La misma frase de fuentes que physiq-assessment. */
export const INSTRUCCION_FUENTES =
  'Busca información solo en fuentes científicas o académicas como PubMed, revistas científicas, libros de medicina o fisiología o fuentes institucionales universitarias.';
/** Orientación a la fisioterapia (decisión de Edu, 14 nov 2026). */
export const ORIENTACION_FISIO =
  'Al final, resume qué importa de esto en fisioterapia: cómo influye en la respuesta de la presión arterial al ejercicio, qué precauciones conviene tener al prescribirlo y qué signos justifican derivar al médico.';
/** Tope del fragmento: la URL entera debe caber de sobra en los límites de los buscadores. */
export const MAX_TEXTO_IA = 800;

export function recortarTextoIA(texto: string): string {
  const t = String(texto ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= MAX_TEXTO_IA) return t;
  const corte = t.slice(0, MAX_TEXTO_IA);
  const esp = corte.lastIndexOf(' ');
  return `${(esp > MAX_TEXTO_IA * 0.6 ? corte.slice(0, esp) : corte).replace(/[\s,;:.]+$/, '')}…`;
}

/** Pregunta que se envía. `contexto` dice dónde está el fragmento («la ficha «Aldosterona»…»). */
export function promptIA({ contexto, texto, apartado }: { contexto: string; texto: string; apartado?: string }): string {
  const donde = apartado ? `${contexto} (apartado «${apartado}»)` : contexto;
  return `Soy estudiante o profesional de fisioterapia. Explícame con más detalle, desde la fisiología y la fisiopatología, este fragmento de ${donde}: «${recortarTextoIA(texto)}». ${ORIENTACION_FISIO} ${INSTRUCCION_FUENTES} Cita las fuentes con enlace.`;
}

export function destinoIA(): DestinoIA {
  try {
    const d = localStorage.getItem(CLAVE_DESTINO);
    if (d && d in DESTINOS_IA) return d as DestinoIA;
  } catch {
    /* sin almacenamiento: el de por defecto */
  }
  return DESTINO_IA_DEFECTO;
}
function guardarDestinoIA(d: DestinoIA) {
  try {
    localStorage.setItem(CLAVE_DESTINO, d);
  } catch {
    /* sin almacenamiento: se elige cada vez */
  }
}

/** Dentro del hub PhysiQ (iframe) no se ofrece. */
export const iaDisponible = () => {
  try {
    return window.self === window.top;
  } catch {
    return false;
  }
};

// ─────────────── Interfaz ───────────────

/** En táctil la barra va más abajo, para no tapar los marcadores de selección. */
const tactil = () => window.matchMedia('(pointer: coarse)').matches;

/** Menú de destinos (uno para toda la página). */
function crearMenu(alElegir: () => void) {
  const opciones = (Object.keys(DESTINOS_IA) as DestinoIA[]).map((d) => {
    const b = h(
      'button',
      { type: 'button', class: 'ia-opcion', role: 'menuitemradio', 'data-destino': d },
      h('strong', {}, DESTINOS_IA[d].nombre),
      h('span', {}, DESTINOS_IA[d].ventaja),
    );
    b.addEventListener('click', () => {
      guardarDestinoIA(d);
      cerrar();
      alElegir();
    });
    return b;
  });
  const raiz = h(
    'div',
    { class: 'ia-menu', role: 'menu', 'aria-label': 'Elegir la IA', hidden: true },
    ...opciones,
    h('p', { class: 'ia-menu-pie' }, 'Consulta externa: Radiostasis no revisa la respuesta.'),
  );
  function cerrar() {
    raiz.hidden = true;
  }
  function abrir(junto: HTMLElement) {
    const d = destinoIA();
    for (const o of opciones) o.setAttribute('aria-checked', String(o.dataset.destino === d));
    // El menú se coloca respecto a la ventana (position: fixed), no al
    // diálogo: en una hoja baja del móvil no cabría dentro de ella.
    (junto.closest('dialog') ?? document.body).append(raiz);
    raiz.hidden = false;
    colocarEnVentana(raiz, rectCss(junto.getBoundingClientRect()), 6);
    opciones.find((o) => o.dataset.destino === d)?.focus({ preventScroll: true });
  }
  document.addEventListener('pointerdown', (e) => {
    if (!raiz.hidden && !raiz.contains(e.target as Node) && !(e.target as Element).closest?.('.ia-mas')) cerrar();
  });
  raiz.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrar();
  });
  // Al ir fijo en la ventana, no sigue al scroll: se cierra.
  document.addEventListener('scroll', (e) => {
    if (!raiz.hidden && !raiz.contains(e.target as Node)) cerrar();
  }, { capture: true, passive: true });
  return { abrir, cerrar, raiz };
}

/**
 * Coloca `el` (position: absolute) bajo el rectángulo `r`, dentro de `host`
 * (el diálogo que contiene la selección, o el body). Si debajo no cabe en la
 * parte visible (p. ej. el menú del pie de una ficha), va encima, para no
 * añadir scroll. Las coordenadas se pasan a las del host, que puede tener
 * scroll propio.
 */
function colocar(el: HTMLElement, r: DOMRect, host: Element, separacion: number, alinear: 'centro' | 'derecha') {
  const esBody = host === document.body;
  const hr = esBody ? new DOMRect(-scrollCss().x, -scrollCss().y, 0, 0) : rectCss(host.getBoundingClientRect());
  const ancho = el.offsetWidth;
  const disponible = esBody ? document.documentElement.clientWidth : (host as HTMLElement).clientWidth;
  const izquierdaDeseada = alinear === 'centro' ? r.left + r.width / 2 - ancho / 2 : r.right - ancho;
  const x = Math.max(8, Math.min(disponible - ancho - 8, izquierdaDeseada - hr.left - (esBody ? 0 : host.clientLeft)));
  // Parte visible: la ventana o el diálogo, sin su cabecera fija.
  const cabecera = esBody ? null : host.querySelector('.ficha-cabecera');
  const visibleArriba = esBody ? 0 : Math.max(0, cabecera ? rectCss(cabecera.getBoundingClientRect()).bottom : hr.top);
  const visibleAbajo = esBody ? altoVentana() : Math.min(altoVentana(), hr.top + host.clientHeight + host.clientTop);
  const alto = el.offsetHeight;
  let arriba = r.bottom + separacion;
  if (arriba + alto > visibleAbajo - 8 && r.top - separacion - alto >= visibleArriba + 8) arriba = r.top - separacion - alto;
  const y = arriba - hr.top + (esBody ? 0 : host.scrollTop - host.clientTop);
  el.style.left = `${Math.round(x)}px`;
  el.style.top = `${Math.round(y)}px`;
}

/** Coloca `el` (position: fixed) bajo `r` o, si no cabe en la ventana, encima; alineado a su derecha. */
function colocarEnVentana(el: HTMLElement, r: DOMRect, separacion: number) {
  const ancho = el.offsetWidth;
  const alto = el.offsetHeight;
  const x = Math.max(8, Math.min(document.documentElement.clientWidth - ancho - 8, r.right - ancho));
  let y = r.bottom + separacion;
  if (y + alto > altoVentana() - 8) {
    const encima = r.top - separacion - alto;
    // Si tampoco cabe encima, lo más arriba posible sin salirse por abajo.
    y = encima >= 8 ? encima : Math.max(8, altoVentana() - alto - 8);
  }
  el.style.left = `${Math.round(x)}px`;
  el.style.top = `${Math.round(y)}px`;
}

/** Contexto y apartado del fragmento, leídos de los atributos `data-ia-*` más cercanos. */
function contextoDe(nodo: Node | null): { contexto: string; apartado?: string } | null {
  const el = nodo instanceof Element ? nodo : nodo?.parentElement;
  const cont = el?.closest<HTMLElement>('[data-ia-ctx]');
  if (!el || !cont || el.closest('.ia-excluir')) return null;
  const apartado = el.closest<HTMLElement>('[data-ia-apartado]')?.dataset.iaApartado;
  return { contexto: cont.dataset.iaCtx ?? '', apartado };
}

/**
 * Activa la barra flotante al seleccionar texto en la página. Devuelve una
 * función para crear el pie «Preguntar sobre esta ficha».
 */
export function iniciarAmpliarIA() {
  if (!iaDisponible()) return { pie: () => null as HTMLElement | null };

  const enlace = h('a', { class: 'ia-ir', target: '_blank', rel: 'noopener noreferrer', href: '#' });
  const mas = h('button', { type: 'button', class: 'ia-mas', 'aria-label': 'Elegir la IA', 'aria-haspopup': 'menu' }, '▾');
  const barra = h('div', { class: 'ia-barra', hidden: true }, enlace, mas);
  let fragmento: { texto: string; contexto: string; apartado?: string } | null = null;
  let rect: DOMRect | null = null;
  /** Pies de ficha pintados: se repintan al cambiar de IA (los que ya no están en la página se olvidan). */
  const pies = new Map<HTMLElement, () => void>();

  const pintarBarra = () => {
    enlace.textContent = `✨ Ampliar en ${DESTINOS_IA[destinoIA()].nombre} ↗`;
  };
  const menu = crearMenu(() => {
    pintarBarra();
    for (const [el, p] of pies) {
      if (el.isConnected) p();
      else pies.delete(el);
    }
  });

  enlace.addEventListener('click', () => {
    if (!fragmento) return;
    enlace.href = DESTINOS_IA[destinoIA()].url(promptIA(fragmento));
    setTimeout(ocultar, 0);
  });
  mas.addEventListener('click', () => {
    if (menu.raiz.hidden) menu.abrir(barra);
    else menu.cerrar();
  });

  function ocultar() {
    barra.hidden = true;
    menu.cerrar();
  }
  let temporizador = 0;
  document.addEventListener('selectionchange', () => {
    clearTimeout(temporizador);
    const sel = document.getSelection();
    const texto = sel?.toString().trim() ?? '';
    const ctxA = sel && !sel.isCollapsed ? contextoDe(sel.anchorNode) : null;
    const ctxF = sel && !sel.isCollapsed ? contextoDe(sel.focusNode) : null;
    if (!sel || sel.isCollapsed || texto.length < 3 || !ctxA || !ctxF || ctxA.contexto !== ctxF.contexto) {
      // Un poco de espera: en el móvil, tocar la barra deshace antes la selección.
      temporizador = window.setTimeout(() => {
        if (!barra.matches(':hover') && document.activeElement !== enlace && document.activeElement !== mas) ocultar();
      }, 400);
      return;
    }
    fragmento = { texto, ...ctxA };
    rect = rectCss(sel.getRangeAt(0).getBoundingClientRect());
    const host = sel.anchorNode?.parentElement?.closest('dialog') ?? document.body;
    pintarBarra();
    host.append(barra);
    barra.hidden = false;
    menu.cerrar();
    colocar(barra, rect, host, tactil() ? 32 : 8, 'centro');
  });

  /** Pie de una ficha: pregunta por el texto dado con el contexto dado. */
  function pie(contexto: string, texto: string): HTMLElement {
    const ir = h('a', { class: 'ia-pie-ir', target: '_blank', rel: 'noopener noreferrer', href: '#' });
    const cambiar = h('button', { type: 'button', class: 'ia-mas ia-pie-mas', 'aria-label': 'Elegir la IA', 'aria-haspopup': 'menu' }, '▾');
    const nota = h('p', { class: 'ia-pie-nota' });
    const pintar = () => {
      const d = DESTINOS_IA[destinoIA()];
      ir.textContent = '✨ Preguntar sobre esta ficha ↗';
      nota.textContent = `Abre ${d.nombre} con la pregunta preparada. Para preguntar por un trozo concreto, selecciónalo.`;
    };
    pintar();
    ir.addEventListener('click', () => {
      ir.href = DESTINOS_IA[destinoIA()].url(promptIA({ contexto, texto }));
    });
    cambiar.addEventListener('click', () => {
      if (menu.raiz.hidden) menu.abrir(cambiar);
      else menu.cerrar();
    });
    const raiz = h('section', { class: 'ia-pie ia-excluir' }, h('div', { class: 'ia-pie-botones' }, ir, cambiar), nota);
    pies.set(raiz, pintar);
    return raiz;
  }

  return { pie };
}
