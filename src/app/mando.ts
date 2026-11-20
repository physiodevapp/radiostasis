import type { Nodo } from '../motor/tipos';
import { h, idUnico, s } from './dom';
import { textoAccesibleMando, textoMando, tipoMando } from './formato';

const PISTA = 216.8; // 270° de una circunferencia de radio 46
const MEDIA = PISTA / 2;
const PASO_ARRASTRE = 0.05;
/** Con el dedo, lo que hay que mantener pulsada la rueda para agarrarla (ms) y cuánto se puede mover antes (px). */
const ESPERA_DEDO = 300;
/** Modo diagnóstico de las ruedas: `?depurar` en la dirección. */
const DEPURAR = typeof location !== 'undefined' && new URLSearchParams(location.search).has('depurar');
const MOVIMIENTO_DEDO = 8;
const PASO_TECLA = 0.1;
const PASO_PAGINA = 0.25;

export interface Mando {
  raiz: HTMLElement;
  poner(v: number): void;
  /** Fase 7: variante de la causa bajo el valor de la placa («unilateral»); null la quita. */
  ponerVariante(texto: string | null): void;
}

const redondear = (v: number, paso: number) => Math.round(v / paso) * paso;

/**
 * Mando de causa: recorrido de 270°, arrastre circular (o vertical cerca del
 * centro) y teclado, con semántica de slider.
 */
export function crearMando(
  nodo: Nodo,
  nombre: string,
  alCambiar: (v: number) => void,
  alAbrir?: () => void,
  /**
   * Pastilla de frecuencia («poco frecuente», «causa rara») según el valor de la
   * rueda; las causas comunes no llevan. `titulo`: qué mide la frecuencia.
   */
  frecuencia?: { de: (v: number) => { texto: string; tipo: string } | undefined; titulo: string },
): Mando {
  const [min, max] = nodo.rango;
  const span = max - min;
  const tipo = tipoMando(nodo);
  const idNombre = idUnico('mando');
  let valor = 0;

  // Escala exterior de 11 marcas; las de los extremos y el centro, más gruesas.
  const marcas = Array.from({ length: 11 }, (_, i) =>
    s('line', {
      x1: 60, y1: 4, x2: 60, y2: 10, class: 'mando-marca',
      'stroke-width': i === 0 || i === 5 || i === 10 ? 2.5 : 1.5,
      transform: `rotate(${-135 + i * 27} 60 60)`,
    }),
  );
  const arco = s('circle', {
    cx: 60, cy: 60, r: 46, fill: 'none', class: 'mando-arco', 'stroke-width': 5,
    'stroke-dasharray': '0 1000', transform: 'rotate(135 60 60)',
  });
  const puntero = s('line', {
    x1: 60, y1: 30, x2: 60, y2: 44, class: 'mando-puntero', 'stroke-width': 3, 'stroke-linecap': 'round',
  });
  const [lo, hi] = tipo === 'bipolar' ? ['−', '+'] : tipo === 'inverso' ? ['nulo', 'libre'] : ['0', '1'];

  const dibujo = s(
    'svg',
    { viewBox: '0 0 120 120', 'aria-hidden': 'true', class: 'mando-svg' },
    ...marcas,
    s('circle', {
      cx: 60, cy: 60, r: 46, fill: 'none', class: 'mando-pista', 'stroke-width': 5,
      'stroke-dasharray': `${PISTA} 1000`, transform: 'rotate(135 60 60)',
    }),
    arco,
    s('circle', { cx: 60, cy: 60, r: 39.5, class: 'mando-contorno' }),
    s('circle', { cx: 60, cy: 60, r: 38, class: 'mando-moleteado-base' }),
    s('circle', { cx: 60, cy: 60, r: 36.5, fill: 'none', class: 'mando-moleteado', 'stroke-width': 4, 'stroke-dasharray': '2.2 1.8' }),
    s('circle', { cx: 60, cy: 60, r: 33, class: 'mando-laton' }),
    ...[9, 16, 23, 29].map((r) => s('circle', { cx: 60, cy: 60, r, fill: 'none', class: 'mando-estria', 'stroke-width': 1 })),
    puntero,
    s('text', { x: 10, y: 116, class: 'mando-extremo' }, lo),
    s('text', { x: 110, y: 116, 'text-anchor': 'end', class: 'mando-extremo' }, hi),
  );

  const control = h(
    'div',
    {
      role: 'slider', tabindex: 0, class: 'mando-control',
      'aria-labelledby': idNombre,
      'aria-valuemin': min, 'aria-valuemax': max, 'aria-valuenow': 0,
      'aria-orientation': 'vertical',
    },
    dibujo,
  );
  if (nodo.explicacion) control.setAttribute('aria-description', nodo.explicacion);
  const textoValor = h('span', { class: 'placa-valor' });
  const textoVariante = h('span', { class: 'placa-variante', hidden: true });
  let variante: string | null = null;
  const separadorFrecuencia = h('span', { class: 'oculto' }, ', ');
  const pastilla = h('span', { class: 'pastilla-frecuencia', title: frecuencia?.titulo ?? '' });
  let ultimaFrecuencia: string | null = null;
  function pintarFrecuencia() {
    const f = frecuencia?.de(valor);
    const clave = f ? `${f.tipo}|${f.texto}` : '';
    if (clave === ultimaFrecuencia) return;
    ultimaFrecuencia = clave;
    pastilla.hidden = separadorFrecuencia.hidden = !f;
    pastilla.textContent = f?.texto ?? '';
    if (f) pastilla.dataset.frecuencia = f.tipo;
    placa.classList.toggle('con-frecuencia', !!f);
    recortar();
  }

  // Hueco en la placa alrededor de la pastilla (3 px), por el que se ve el fondo
  // del panel (la madera en Retro). La placa pinta su fondo en ::before con una
  // máscara: el rectángulo de la placa menos una cápsula. Medidas en px CSS
  // (offset*), que no dependen del zoom del tablero ni de «Grande».
  const HOLGURA = 3;
  function recortar() {
    if (pastilla.hidden || !placa.isConnected) {
      placa.style.removeProperty('--recorte');
      return;
    }
    const W = placa.offsetWidth;
    const H = placa.offsetHeight;
    const w = pastilla.offsetWidth + 2 * HOLGURA;
    const h = pastilla.offsetHeight + 2 * HOLGURA;
    if (!W || !H || !w) return;
    // La pastilla está centrada con left: 50% y translateX(-50%).
    const x = pastilla.offsetLeft - pastilla.offsetWidth / 2 - HOLGURA;
    const y = pastilla.offsetTop - HOLGURA;
    const r = h / 2;
    const n = (v: number) => Math.round(v * 100) / 100;
    const capsula = `M${n(x + r)} ${n(y)}H${n(x + w - r)}A${n(r)} ${n(r)} 0 0 1 ${n(x + w - r)} ${n(y + h)}H${n(x + r)}A${n(r)} ${n(r)} 0 0 1 ${n(x + r)} ${n(y)}Z`;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'><path fill='white' fill-rule='evenodd' d='M0 0H${W}V${H}H0Z ${capsula}'/></svg>`;
    placa.style.setProperty('--recorte', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  }

  const placa = h(
    'button',
    { type: 'button', class: 'placa', title: `${nodo.nombre}: ver ficha`, 'data-ficha': nodo.id },
    h('span', { class: 'placa-nombre', id: idNombre }, nombre),
    textoValor,
    textoVariante,
    separadorFrecuencia,
    pastilla,
    h('span', { class: 'oculto' }, ', ver ficha'),
  );
  if (alAbrir) placa.addEventListener('click', alAbrir);
  else placa.disabled = true;
  // Con el dedo, un toque corto recuerda que hay que mantener pulsado.
  const pistaMantener = h('span', { class: 'pista-mantener', hidden: true, 'aria-hidden': 'true' }, 'Mantén pulsado para girar');
  const raiz = h(
    'div',
    { class: 'mando', 'data-causa': nodo.id },
    control,
    pistaMantener,
    // La placa es un botón real: abre la ficha de la causa. El mando solo gira.
    placa,
  );

  function pintar() {
    const t = (valor - min) / span;
    puntero.setAttribute('transform', `rotate(${(-135 + t * 270).toFixed(1)} 60 60)`);
    let dash = '0 1000';
    let sentido: 'sube' | 'baja' = 'sube';
    if (tipo === 'bipolar') {
      if (valor > 0) dash = `0 ${MEDIA} ${(MEDIA * valor).toFixed(1)} 1000`;
      else if (valor < 0) {
        dash = `0 ${(MEDIA * (1 + valor)).toFixed(1)} ${(MEDIA * -valor).toFixed(1)} 1000`;
        sentido = 'baja';
      }
    } else if (tipo === 'inverso') {
      if (valor < 0) dash = `0 ${(PISTA * t).toFixed(1)} ${(PISTA * (1 - t)).toFixed(1)} 1000`;
      sentido = 'baja';
    } else if (valor > 0) dash = `${(PISTA * t).toFixed(1)} 1000`;
    arco.setAttribute('stroke-dasharray', dash);
    arco.dataset.sentido = sentido;
    const activo = Math.abs(valor) > 1e-9;
    raiz.classList.toggle('activo', activo);
    textoValor.textContent = textoMando(nodo, valor);
    pintarFrecuencia();
    control.setAttribute('aria-valuenow', String(valor));
    control.setAttribute('aria-valuetext', textoAccesibleMando(nodo, valor) + (variante ? `, ${variante}` : ''));
  }

  function fijar(v: number, avisar = true) {
    const nuevo = Math.min(max, Math.max(min, Math.round(v * 100) / 100));
    if (nuevo === valor) return;
    valor = nuevo === 0 ? 0 : nuevo; // evita −0
    pintar();
    if (avisar) alCambiar(valor);
  }

  // Teclado: flechas, Re Pág / Av Pág, Inicio y Fin.
  control.addEventListener('keydown', (e) => {
    delete control.dataset.puntero;
    let v: number | undefined;
    switch (e.key) {
      case 'ArrowUp': case 'ArrowRight': v = redondear(valor + PASO_TECLA, PASO_TECLA); break;
      case 'ArrowDown': case 'ArrowLeft': v = redondear(valor - PASO_TECLA, PASO_TECLA); break;
      case 'PageUp': v = valor + PASO_PAGINA; break;
      case 'PageDown': v = valor - PASO_PAGINA; break;
      case 'Home': v = min; break;
      case 'End': v = max; break;
      default: return;
    }
    e.preventDefault();
    fijar(v);
  });

  // Rueda del ratón (escritorio): con el cursor encima, cada muesca mueve lo
  // mismo que una flecha del teclado. Hacia arriba sube. Con touchpad llegan
  // muchos desplazamientos pequeños: se acumulan hasta una muesca (≈ 100 px).
  // En el límite no se bloquea el scroll de la página.
  let acumulado = 0;
  let ultimaRueda = 0;
  control.addEventListener(
    'wheel',
    (e) => {
      const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
      const sube = px < 0;
      if ((sube && valor >= max) || (!sube && valor <= min)) return;
      e.preventDefault();
      if (e.timeStamp - ultimaRueda > 250) acumulado = 0;
      ultimaRueda = e.timeStamp;
      acumulado += px;
      const muescas = Math.trunc(acumulado / 100);
      if (muescas === 0) return;
      acumulado -= muescas * 100;
      fijar(redondear(valor - muescas * PASO_TECLA, PASO_TECLA));
    },
    { passive: false },
  );

  // Arrastre: si se empieza cerca del centro, vertical (ahí el ángulo es inestable);
  // si se empieza en el borde, circular. El modo se decide al pulsar y no cambia.
  let arrastre: { bruto: number; y: number; angulo: number; vertical: boolean; dedo: boolean } | null = null;
  const centro = () => {
    const r = dibujo.getBoundingClientRect();
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, radio: r.width / 2 };
  };
  const anguloDe = (x: number, y: number) => {
    const { cx, cy } = centro();
    return (Math.atan2(x - cx, cy - y) * 180) / Math.PI;
  };

  /** Agarra el mando en el punto (x, y): con ratón o lápiz, al pulsar; con el dedo, tras mantenerlo pulsado. */
  function agarrar(x: number, y: number, dedo: boolean, pointerId?: number) {
    // Foco para poder seguir con el teclado, pero sin el reborde: ese es para quien navega con teclado.
    control.dataset.puntero = '1';
    control.focus({ preventScroll: true });
    if (pointerId !== undefined) control.setPointerCapture(pointerId);
    const { cx, cy, radio } = centro();
    const vertical = Math.hypot(x - cx, y - cy) < radio * 0.4;
    arrastre = { bruto: valor, y, angulo: anguloDe(x, y), vertical, dedo };
    raiz.classList.add('arrastrando');
    // Con el dedo, un aro dice que el mando está agarrado.
    raiz.classList.toggle('agarrada', dedo);
  }
  /** Gira el mando según el punto (x, y): vertical desde el centro, circular desde el borde. */
  function mover(x: number, y: number) {
    if (!arrastre) return;
    let delta = 0;
    if (arrastre.vertical) {
      delta = (-(y - arrastre.y) / 150) * span;
    } else {
      const { cx, cy, radio } = centro();
      const angulo = anguloDe(x, y);
      // Muy cerca del centro el ángulo salta: se actualiza sin mover el mando.
      if (Math.hypot(x - cx, y - cy) > radio * 0.2) {
        let d = angulo - arrastre.angulo;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        delta = (d / 270) * span;
      }
      arrastre.angulo = angulo;
    }
    arrastre.y = y;
    arrastre.bruto = Math.min(max, Math.max(min, arrastre.bruto + delta));
    fijar(redondear(arrastre.bruto, PASO_ARRASTRE));
  }
  const soltar = () => {
    arrastre = null;
    raiz.classList.remove('arrastrando', 'agarrada');
  };

  // Ratón y lápiz: se agarra al pulsar, como siempre. El dedo va aparte, con
  // eventos táctiles (abajo).
  control.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.pointerType === 'touch') return;
    e.preventDefault();
    agarrar(e.clientX, e.clientY, false, e.pointerId);
  });
  control.addEventListener('pointermove', (e) => {
    if (arrastre && !arrastre.dedo) mover(e.clientX, e.clientY);
  });
  const soltarPuntero = () => {
    if (arrastre && !arrastre.dedo) soltar();
  };
  control.addEventListener('pointerup', soltarPuntero);
  control.addEventListener('pointercancel', soltarPuntero);
  control.addEventListener('lostpointercapture', soltarPuntero);
  control.addEventListener('blur', () => delete control.dataset.puntero);

  // Con el dedo (18-19 nov 2026): para girar hay que mantener pulsado el mando;
  // si el dedo se mueve antes, es un desplazamiento de la página y el mando no
  // cambia. Así bajar por el panel no mueve los mandos sin querer. Se usan los
  // eventos táctiles y no los de puntero: Chrome para Android, a los 500 ms,
  // detecta su propia pulsación larga y corta los de puntero (en un Pixel 8 el
  // mando se agarraba y se soltaba a los 0,2 s); los táctiles siguen llegando.
  let espera: { id: number; x: number; y: number; temporizador: number } | null = null;
  let toqueAgarrado: number | null = null;
  let ocultarPista = 0;
  /** Modo diagnóstico (?depurar): cuenta en pantalla qué pasa con el dedo. */
  const depurar = (texto: string) => {
    if (DEPURAR) document.dispatchEvent(new CustomEvent('mando-depurar', { detail: `${nodo.id}: ${texto}` }));
  };
  const cancelarEspera = (motivo = '') => {
    if (espera) {
      clearTimeout(espera.temporizador);
      if (motivo) depurar(`espera cancelada (${motivo})`);
    }
    espera = null;
  };
  function mostrarPista() {
    pistaMantener.hidden = false;
    clearTimeout(ocultarPista);
    ocultarPista = window.setTimeout(() => (pistaMantener.hidden = true), 1600);
  }
  const toqueDe = (e: TouchEvent, id: number) => [...e.changedTouches].find((t) => t.identifier === id);
  control.addEventListener(
    'touchstart',
    (e) => {
      // Con dos dedos (pellizco), nada.
      if (e.touches.length !== 1) {
        cancelarEspera('dos dedos');
        return;
      }
      const t = e.changedTouches[0];
      cancelarEspera();
      depurar('touchstart');
      espera = {
        id: t.identifier, x: t.clientX, y: t.clientY,
        temporizador: window.setTimeout(() => {
          if (!espera) return;
          const { id, x, y } = espera;
          espera = null;
          pistaMantener.hidden = true;
          let vibra: boolean | string = 'sin vibrate';
          try {
            // 40 ms: con 15 ms Chrome lo aceptaba, pero en un Pixel 8 no se notaba.
            vibra = navigator.vibrate?.(40) ?? 'sin vibrate';
          } catch (err) {
            vibra = String(err);
          }
          agarrar(x, y, true);
          toqueAgarrado = id;
          anclar();
          depurar(`agarrada (vibrate: ${vibra})`);
        }, ESPERA_DEDO),
      };
    },
    { passive: true },
  );
  let movimientos = 0;
  control.addEventListener(
    'touchmove',
    (e) => {
      if (espera) {
        const t = toqueDe(e, espera.id);
        if (!t) return;
        if (Math.hypot(t.clientX - espera.x, t.clientY - espera.y) > MOVIMIENTO_DEDO) cancelarEspera('se movió');
        else {
          espera.x = t.clientX;
          espera.y = t.clientY;
        }
        return;
      }
      if (toqueAgarrado === null || !arrastre) return;
      const t = toqueDe(e, toqueAgarrado);
      if (!t) return;
      // Mientras está agarrado, la página no se desplaza.
      if (e.cancelable) e.preventDefault();
      else if (movimientos === 0) depurar('touchmove no cancelable');
      if (movimientos++ === 0) depurar('gira');
      mover(t.clientX, t.clientY);
    },
    { passive: false },
  );
  // Mientras el dedo tiene el mando agarrado, el mando se queda bajo el dedo:
  // si algo de encima cambia de alto (p. ej. la franja de la estenosis al
  // pasar de 0,15, o la cabecera que deja de quedarse fija), la página se
  // desplaza lo mismo para compensarlo.
  let anclaY = 0;
  let anclaFrame = 0;
  function anclar() {
    anclaY = control.getBoundingClientRect().top;
    cancelAnimationFrame(anclaFrame);
    const seguir = () => {
      if (toqueAgarrado === null) return;
      const dy = control.getBoundingClientRect().top - anclaY;
      if (Math.abs(dy) > 0.5) {
        window.scrollBy(0, dy);
        // Lo que no se haya podido compensar (al principio o al final de la página) queda como nueva referencia.
        anclaY = control.getBoundingClientRect().top;
        depurar(`compensa ${Math.round(dy)} px`);
      }
      anclaFrame = requestAnimationFrame(seguir);
    };
    anclaFrame = requestAnimationFrame(seguir);
  }
  const finToque = (e: TouchEvent) => {
    if (espera && toqueDe(e, espera.id)) {
      cancelarEspera(e.type === 'touchend' ? 'toque corto' : 'touchcancel');
      // Un toque corto: se recuerda cómo se gira.
      if (e.type === 'touchend') mostrarPista();
    }
    if (toqueAgarrado !== null && toqueDe(e, toqueAgarrado)) {
      depurar(`${e.type === 'touchend' ? 'soltada' : 'touchcancel'} en ${valor}`);
      toqueAgarrado = null;
      cancelAnimationFrame(anclaFrame);
      movimientos = 0;
      soltar();
    }
  };
  control.addEventListener('touchend', finToque);
  control.addEventListener('touchcancel', finToque);
  // La pulsación larga no abre el menú del navegador.
  control.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    depurar('contextmenu');
  });

  if (frecuencia) {
    new ResizeObserver(() => recortar()).observe(placa);
    document.fonts?.ready.then(recortar);
  }
  pintar();
  function ponerVariante(texto: string | null) {
    if (texto === variante) return;
    variante = texto;
    textoVariante.hidden = !texto;
    // El separador es para el lector de pantalla: «+1, unilateral».
    textoVariante.replaceChildren(...(texto ? [h('span', { class: 'oculto' }, ', '), texto] : []));
    control.setAttribute('aria-valuetext', textoAccesibleMando(nodo, valor) + (texto ? `, ${texto}` : ''));
    recortar();
  }
  return { raiz, poner: (v) => fijar(v, false), ponerVariante };
}
