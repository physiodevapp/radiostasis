import { h, idUnico } from './dom';
import { crearHistorial } from './historial';
import { consulta, zoomPagina } from './preferencias';

/**
 * Distribución de móvil (docs/diseno.md, «Móvil»): hasta 720 px de ancho, que
 * incluye el móvil con el texto ampliado. Más ancho, la página de siempre.
 */
export const MOVIL = consulta('(max-width: 720px)');

/**
 * En el móvil, los diálogos son hojas que suben desde abajo. Se cierran
 * deslizándolas hacia abajo desde su cabecera (además de con «Cerrar», tocando
 * el fondo o con Escape).
 */
export function deslizarParaCerrar(dialogo: HTMLDialogElement, zona: HTMLElement) {
  // Como las hojas de physiq-assessment: la hoja sigue al dedo; al soltar se
  // cierra si se ha bajado más de 80 px o con un gesto rápido (sale hacia
  // abajo y después se cierra); si no, vuelve a su sitio con un rebote suave.
  const CURVA = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
  let inicio: { y: number; t: number; id: number } | null = null;
  let dy = 0;
  let temporizador = 0;

  // La animación de apertura solo al abrir: al terminar, la hoja queda
  // «abierta» y soltar un arrastre ya no la repite.
  dialogo.addEventListener('animationend', () => dialogo.classList.add('abierta'));
  dialogo.addEventListener('close', () => {
    clearTimeout(temporizador);
    dialogo.classList.remove('abierta', 'deslizando');
    dialogo.style.transform = '';
    dialogo.style.transition = '';
  });

  const soltar = () => {
    if (!inicio) return;
    const velocidad = dy / Math.max(1, performance.now() - inicio.t);
    inicio = null;
    dialogo.classList.remove('deslizando');
    dialogo.style.transition = CURVA;
    if (dy > 80 || (dy > 10 && velocidad > 0.3)) {
      dialogo.style.transform = 'translateY(110%)';
      temporizador = window.setTimeout(() => dialogo.close(), 300);
    } else {
      dialogo.style.transform = 'translateY(0)';
      temporizador = window.setTimeout(() => {
        dialogo.style.transform = '';
        dialogo.style.transition = '';
      }, 310);
    }
    dy = 0;
  };
  zona.addEventListener('pointerdown', (e) => {
    if (!MOVIL.matches || e.button !== 0 || (e.target as Element).closest('button')) return;
    clearTimeout(temporizador);
    inicio = { y: e.clientY, t: performance.now(), id: e.pointerId };
    dy = 0;
    zona.setPointerCapture(e.pointerId);
    dialogo.classList.add('deslizando', 'abierta');
    dialogo.style.transition = 'none';
  });
  zona.addEventListener('pointermove', (e) => {
    if (!inicio || e.pointerId !== inicio.id) return;
    // Con «Grande», clientY va en píxeles de pantalla y el desplazamiento en CSS.
    dy = Math.max(0, (e.clientY - inicio.y) / zoomPagina());
    dialogo.style.transform = `translateY(${dy}px)`;
  });
  zona.addEventListener('pointerup', soltar);
  zona.addEventListener('pointercancel', () => {
    dy = 0;
    soltar();
  });
}

/** Asa de la hoja: solo se ve en el móvil. */
export const asa = () => h('span', { class: 'asa', 'aria-hidden': 'true' });

/**
 * Hoja genérica del móvil para contenido que en la pantalla ancha está a la
 * vista («Qué mirar», «Cómo leer los vasos»). Los nodos se mueven a la hoja al
 * abrirla; la distribución de escritorio los devuelve a su sitio.
 */
export function crearHoja() {
  const idTitulo = idUnico('hoja-titulo');
  const titulo = h('h2', { id: idTitulo });
  const cuerpo = h('div', { class: 'ficha-cuerpo' });
  const cerrar = h('button', { type: 'button', class: 'boton' }, 'Cerrar');
  const cabecera = h('div', { class: 'ficha-cabecera' }, asa(), titulo, cerrar);
  const dialogo = h('dialog', { class: 'ficha hoja', 'aria-labelledby': idTitulo }, cabecera, cuerpo);
  cerrar.addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) dialogo.close();
  });
  deslizarParaCerrar(dialogo, cabecera);
  // El «atrás» del sistema cierra la hoja en vez de salir de la página.
  const historial = crearHistorial(dialogo, () => false);
  return {
    raiz: dialogo,
    abrir(texto: string, ...nodos: Node[]) {
      titulo.textContent = texto;
      cuerpo.replaceChildren(...nodos);
      if (!dialogo.open) {
        dialogo.showModal();
        historial.empujar();
      }
    },
    cerrar: () => dialogo.close(),
  };
}
