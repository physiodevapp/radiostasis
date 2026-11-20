/**
 * Historial de una hoja (hito 3e): mientras está abierta, cada paso ocupa una
 * entrada del historial del navegador. Así el «atrás» del sistema (el gesto
 * desde el borde en Android, el botón atrás, Alt+← en escritorio) vuelve a la
 * ficha anterior y, en la primera, cierra la hoja, en vez de salir de la página.
 * Al cerrar la hoja por otro medio (Cerrar, Escape, fondo, deslizar hacia abajo)
 * se retiran las entradas que quedaban.
 */
export interface Historial {
  /** Apunta un paso (al abrir la hoja o al ir a otra ficha). */
  empujar(): void;
  /** Vuelve un paso, como el «atrás» del sistema. */
  atras(): void;
}

/**
 * `alVolver` deshace un paso dentro de la hoja; si devuelve false, la hoja se cierra.
 * `puedeVolver` dice si hay un paso anterior dentro de la hoja.
 */
export function crearHistorial(dialogo: HTMLDialogElement, alVolver: () => boolean, puedeVolver: () => boolean = () => false): Historial {
  let pasos = 0;
  let retirando = false;
  let cerrandoPorHistorial = false;

  // En Android, Chrome trata el «atrás» del sistema (gesto o botón) como una
  // petición de cerrar el diálogo modal abierto: lanza «cancel» y lo cierra sin
  // pasar por el historial. Si hay una ficha anterior, se cancela el cierre y se
  // vuelve a ella. Escape (teclado) sigue cerrando la hoja.
  let ultimoEscape = 0;
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') ultimoEscape = performance.now();
    },
    true,
  );
  // Chrome solo deja cancelar ese cierre si ha habido una pulsación en la página
  // desde la vez anterior: con dos «atrás» seguidos, el segundo no se puede
  // cancelar y el diálogo se cierra a la fuerza. En ese caso se reabre al
  // instante en la ficha anterior (sin animación): para quien lo usa, es volver.
  let reabrir = false;
  dialogo.addEventListener('cancel', (e) => {
    if (performance.now() - ultimoEscape < 500) return;
    if (!puedeVolver()) return;
    if (e.cancelable) {
      e.preventDefault();
      atras();
    } else {
      reabrir = true;
    }
  });
  function atras() {
    if (pasos > 0) history.back();
    else if (!alVolver()) dialogo.close();
  }

  window.addEventListener('popstate', () => {
    if (retirando) {
      retirando = false;
      return;
    }
    if (!dialogo.open || pasos === 0) return;
    pasos--;
    if (!alVolver()) {
      cerrandoPorHistorial = true;
      dialogo.close();
    }
  });

  // En captura: se ejecuta antes que los demás oyentes de «close» (que limpian
  // el historial de fichas) y, si se reabre, los detiene.
  dialogo.addEventListener(
    'close',
    (e) => {
      if (!reabrir) return;
      reabrir = false;
      e.stopImmediatePropagation();
      // El «atrás» no pasó por el historial: se retira aquí su entrada.
      if (pasos > 0) {
        pasos--;
        retirando = true;
        history.back();
      }
      alVolver();
      dialogo.classList.add('abierta'); // sin la animación de apertura
      dialogo.showModal();
    },
    true,
  );

  dialogo.addEventListener('close', () => {
    if (cerrandoPorHistorial) {
      cerrandoPorHistorial = false;
      // Si quedaban pasos (no debería), se retiran igual.
    }
    if (pasos > 0) {
      const n = pasos;
      pasos = 0;
      retirando = true;
      history.go(-n);
    }
  });

  return {
    empujar() {
      try {
        history.pushState({ radiostasis: 'hoja' }, '');
        pasos++;
      } catch {
        // Sin historial (algún iframe restringido): la hoja sigue funcionando con sus botones.
      }
    },
    atras,
  };
}
