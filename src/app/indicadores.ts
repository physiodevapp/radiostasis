import { flecha } from '../motor/motor';
import { h, s } from './dom';
import { enPalabras, tono } from './formato';

export interface Indicador {
  raiz: HTMLElement | SVGElement;
  poner(v: number): void;
}

/**
 * Ventana de sintonía: escala de −1 a +1 con marca central más larga, nombre
 * dentro, flecha a la derecha y aguja vertical. Es un botón (abre la ficha).
 * `ancho` 160 para los mecanismos y 300 para las salidas.
 */
export function crearVentana(nombre: string, ancho: number, alPulsar: () => void): Indicador {
  const margen = 12;
  const util = ancho - 2 * margen;
  const marcas = ancho > 200 ? 11 : 9;
  const lineas = Array.from({ length: marcas }, (_, i) => {
    const x = margen + (i * util) / (marcas - 1);
    const central = i === (marcas - 1) / 2;
    return s('line', { x1: x, y1: 6, x2: x, y2: central ? 14 : 11, class: 'ventana-marca', 'stroke-width': central ? 2 : 1.2 });
  });
  const textoFlecha = s('text', { x: ancho - 10, y: 35, 'text-anchor': 'end', class: 'ventana-flecha' });
  // La aguja solo recorre la franja de la escala (arriba) y acaba en punta, para no
  // tapar el nombre ni la flecha, que van en la franja de abajo.
  const aguja = s('path', { d: 'M0 4h2.5v13l-1.25 3l-1.25-3z', class: 'ventana-aguja' });
  // Tema Clásico: vúmetro semicircular a la izquierda (medio anillo azul y ámbar,
  // aguja girada valor × 80°). En Retro está oculto.
  const VU = { cx: 22, cy: 37, r: 15 };
  const puntoVu = (grados: number) => {
    const a = (grados * Math.PI) / 180;
    return `${(VU.cx + VU.r * Math.sin(a)).toFixed(2)} ${(VU.cy - VU.r * Math.cos(a)).toFixed(2)}`;
  };
  const agujaVu = s('line', { x1: VU.cx, y1: VU.cy, x2: VU.cx, y2: VU.cy - VU.r - 1, class: 'vu-aguja', 'stroke-width': 1.8, 'stroke-linecap': 'round' });
  const vu = s(
    'g',
    { class: 'vu' },
    s('path', { d: `M${puntoVu(-90)} A${VU.r} ${VU.r} 0 0 1 ${puntoVu(0)}`, class: 'vu-baja', fill: 'none', 'stroke-width': 5 }),
    s('path', { d: `M${puntoVu(0)} A${VU.r} ${VU.r} 0 0 1 ${puntoVu(90)}`, class: 'vu-sube', fill: 'none', 'stroke-width': 5 }),
    agujaVu,
    s('circle', { cx: VU.cx, cy: VU.cy, r: 2.2, class: 'vu-eje' }),
  );
  const dibujo = s(
    'svg',
    { viewBox: `0 0 ${ancho} 44`, 'aria-hidden': 'true', class: 'ventana-svg' },
    s('rect', { width: ancho, height: 44, rx: 6, class: 'ventana-marco' }),
    s('rect', { x: 3, y: 3, width: ancho - 6, height: 38, rx: 4, class: 'ventana-cristal' }),
    ...lineas,
    s('text', { x: 10, y: 35, class: ancho > 200 ? 'ventana-nombre ancha' : 'ventana-nombre' }, nombre),
    textoFlecha,
    aguja,
    vu,
  );
  const boton = h('button', { type: 'button', class: ancho > 200 ? 'ventana ancha' : 'ventana' }, dibujo);
  boton.addEventListener('click', alPulsar);
  return {
    raiz: boton,
    poner(v) {
      const x = margen + ((Math.max(-1, Math.min(1, v)) + 1) / 2) * util - 1.25;
      aguja.style.transform = `translateX(${x.toFixed(1)}px)`;
      agujaVu.style.transform = `rotate(${(Math.max(-1, Math.min(1, v)) * 80).toFixed(1)}deg)`;
      textoFlecha.textContent = flecha(v);
      boton.dataset.tono = tono(v);
      boton.setAttribute('aria-label', `${nombre}: ${enPalabras(v)}. Abrir ficha`);
    },
  };
}

/** Dial de presión: esfera de 270°, zonas Baja · Normal · Alta, agujas PAS y PAD, PAM en el centro. */
/** `alAbrir` abre la ficha de la presión: el dial, la media; la leyenda, la sistólica o la diastólica. */
export function crearDial(alAbrir?: (id: 'pas' | 'pad' | 'pam') => void): {
  raiz: HTMLElement;
  /** `antes`: en una sesión de ejercicio, la presión de antes (agujas tenues). */
  poner(pas: number, pad: number, pam: number, antes?: { pas: number; pad: number }): void;
  /** Avisos «fuera de rango»: la leyenda de la sistólica o la diastólica, y el dial para la media. */
  marcarFuera(saturado: (id: string) => boolean, marcar: (el: Element, si: boolean) => void): void;
} {
  const C = 130;
  const marcas = Array.from({ length: 13 }, (_, i) =>
    s('line', {
      x1: C, y1: 22, x2: C, y2: i % 3 === 0 ? 36 : 30, class: 'dial-marca',
      'stroke-width': i % 3 === 0 ? 2.5 : 1.5, transform: `rotate(${-135 + i * 22.5} ${C} ${C})`,
    }),
  );
  const agujaPad = s('line', { x1: C, y1: C, x2: C, y2: 52, class: 'dial-aguja-pad', 'stroke-width': 5, 'stroke-linecap': 'round' });
  const agujaPas = s('line', { x1: C, y1: C, x2: C, y2: 40, class: 'dial-aguja-pas', 'stroke-width': 5, 'stroke-linecap': 'round' });
  // Fase 5: la presión de antes de la sesión, en trazo tenue.
  const antesPad = s('line', { x1: C, y1: C, x2: C, y2: 52, class: 'dial-aguja-antes dial-aguja-antes-pad', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '6 5' });
  const antesPas = s('line', { x1: C, y1: C, x2: C, y2: 40, class: 'dial-aguja-antes dial-aguja-antes-pas', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '6 5' });
  const agujasAntes = s('g', { class: 'dial-antes', visibility: 'hidden' }, antesPad, antesPas);
  const pamTexto = s('text', { x: C, y: 166, 'text-anchor': 'middle', class: 'dial-pam' });
  const dibujo = s(
    'svg',
    { viewBox: '0 0 260 260', 'aria-hidden': 'true', class: 'dial-svg' },
    s('circle', { cx: C, cy: C, r: 126, class: 'dial-aro' }),
    s('circle', { cx: C, cy: C, r: 116, class: 'dial-esfera' }),
    // Tema Clásico: tres zonas de color (baja, normal, alta). En Retro, ocultas.
    ...([['baja', -135, -45], ['normal', -45, 45], ['alta', 45, 135]] as const).map(([zona, a0, a1]) => {
      const R = 104;
      const p = (g: number) => `${(C + R * Math.sin((g * Math.PI) / 180)).toFixed(2)} ${(C - R * Math.cos((g * Math.PI) / 180)).toFixed(2)}`;
      return s('path', { d: `M${p(a0)} A${R} ${R} 0 0 1 ${p(a1)}`, class: `dial-franja dial-franja-${zona}`, fill: 'none', 'stroke-width': 10 });
    }),
    ...marcas,
    s('text', { x: 76, y: 190, class: 'dial-zona' }, 'BAJA'),
    s('text', { x: C, y: 62, 'text-anchor': 'middle', class: 'dial-zona' }, 'NORMAL'),
    s('text', { x: 184, y: 190, 'text-anchor': 'end', class: 'dial-zona' }, 'ALTA'),
    agujasAntes,
    agujaPad,
    agujaPas,
    s('circle', { cx: C, cy: C, r: 12, class: 'dial-eje' }),
    pamTexto,
  );
  const leyendaPas = h('span');
  const leyendaPad = h('span');
  const botonDial = h('button', { type: 'button', class: 'dial-boton', 'data-ficha': 'pam' }, dibujo);
  const botonPas = h('button', { type: 'button', class: 'leyenda', 'data-ficha': 'pas' }, h('span', { class: 'muestra pas' }), 'Sistólica ', leyendaPas);
  const botonPad = h('button', { type: 'button', class: 'leyenda', 'data-ficha': 'pad' }, h('span', { class: 'muestra pad' }), 'Diastólica ', leyendaPad);
  botonDial.addEventListener('click', () => alAbrir?.('pam'));
  botonPas.addEventListener('click', () => alAbrir?.('pas'));
  botonPad.addEventListener('click', () => alAbrir?.('pad'));
  const leyendaAntes = h('span', { class: 'leyenda-antes', hidden: true }, h('span', { class: 'muestra antes' }), 'Antes de la sesión');
  const raiz = h('div', { class: 'dial' }, botonDial, h('div', { class: 'dial-leyenda' }, botonPas, botonPad, leyendaAntes));
  const giro = (v: number) => `rotate(${(Math.max(-1, Math.min(1, v)) * 135).toFixed(1)}deg)`;
  return {
    raiz,
    poner(pas, pad, pam, antes) {
      agujaPas.style.transform = giro(pas);
      agujaPad.style.transform = giro(pad);
      agujasAntes.setAttribute('visibility', antes ? 'visible' : 'hidden');
      leyendaAntes.hidden = !antes;
      if (antes) {
        antesPas.style.transform = giro(antes.pas);
        antesPad.style.transform = giro(antes.pad);
      }
      pamTexto.textContent = `PAM ${flecha(pam)}`;
      leyendaPas.textContent = flecha(pas);
      leyendaPad.textContent = flecha(pad);
      botonDial.setAttribute(
        'aria-label',
        `Presión arterial. Sistólica: ${enPalabras(pas)}. Diastólica: ${enPalabras(pad)}. Media: ${enPalabras(pam)}.${antes ? ` Antes de la sesión: sistólica ${enPalabras(antes.pas)}, diastólica ${enPalabras(antes.pad)}.` : ''} Abrir la ficha de la presión media`,
      );
      botonPas.setAttribute('aria-label', `Sistólica: ${enPalabras(pas)}. Abrir su ficha`);
      botonPad.setAttribute('aria-label', `Diastólica: ${enPalabras(pad)}. Abrir su ficha`);
    },
    marcarFuera(saturado, marcar) {
      marcar(botonPas, saturado('pas'));
      marcar(botonPad, saturado('pad'));
      marcar(botonDial, saturado('pam'));
    },
  };
}
