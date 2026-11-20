import { h, s } from './dom';

/**
 * Animaciones del mecanismo celular de las fichas (hito 3d; antes «fuera de
 * la v1», punto 1 de docs/plan.md). Cada una es un SVG de 400 × 240 animado con
 * la Web Animations API: todas las pistas comparten duración, así la pausa y
 * los pasos resaltados van sincronizados.
 *
 * El detalle celular sale de la fisiología estándar y está pendiente de
 * revisión (se avisa debajo de cada animación).
 */

type Punto = [t: number, x: number, y: number, opacidad?: number];

interface Paso {
  texto: string;
  desde: number;
  hasta: number;
}

interface Definicion {
  titulo: string;
  descripcion: string;
  duracion: number;
  pasos: Paso[];
  nota: string;
  dibujar(svg: SVGSVGElement, pista: Pista): void;
}

interface Pista {
  /** Mueve un elemento dibujado en el origen por los puntos dados (posición absoluta). */
  ruta(el: SVGElement, puntos: Punto[], duracion?: number): void;
  /** Opacidad en el tiempo: pares [t, opacidad]. */
  opacidad(el: Element, puntos: [number, number][]): void;
  /** Cualquier propiedad animable (p. ej. fill). */
  propiedad(el: Element, frames: Keyframe[], duracion?: number): void;
}

const NOTA_GENERAL = 'Esquema simplificado: muestra los pasos principales del mecanismo celular, no todos.';

/** Completa los extremos 0 y 1 repitiendo el primer y el último punto. */
function extremos<T extends { offset: number }>(frames: T[]): T[] {
  const r = [...frames].sort((a, b) => a.offset - b.offset);
  if (r[0].offset > 0) r.unshift({ ...r[0], offset: 0 });
  if (r[r.length - 1].offset < 1) r.push({ ...r[r.length - 1], offset: 1 });
  return r;
}

function trasladar(puntos: Punto[]): Keyframe[] {
  let ultima = 1;
  return extremos(
    puntos.map(([t, x, y, o]) => {
      if (o !== undefined) ultima = o;
      return { offset: t, transform: `translate(${x}px, ${y}px)`, opacity: ultima };
    }),
  );
}

const texto = (x: number, y: number, t: string, clase = 'an-texto', ancla: 'start' | 'middle' | 'end' = 'start') =>
  s('text', { x, y, class: clase, 'text-anchor': ancla }, t);

// ─────────────── ADH y acuaporinas ───────────────

const adh: Definicion = {
  titulo: 'En la célula del túbulo colector',
  descripcion:
    'Animación: la ADH llega por la sangre y se une a su receptor; las vesículas con acuaporinas se funden con la membrana del lado de la orina y el agua pasa de la orina a la sangre.',
  duracion: 9000,
  pasos: [
    { texto: 'La ADH llega por la sangre y se une a su receptor V2.', desde: 0, hasta: 0.2 },
    { texto: 'Las vesículas con acuaporina 2 se funden con la membrana del lado de la orina.', desde: 0.2, hasta: 0.42 },
    { texto: 'El agua pasa de la orina a la célula por las acuaporinas y sale a la sangre: la orina se concentra.', desde: 0.42, hasta: 1 },
  ],
  nota: NOTA_GENERAL,
  dibujar(svg, p) {
    svg.append(
      s('rect', { x: 0, y: 0, width: 110, height: 240, class: 'an-orina' }),
      s('rect', { x: 110, y: 0, width: 180, height: 240, class: 'an-celula' }),
      s('rect', { x: 290, y: 0, width: 110, height: 240, class: 'an-sangre' }),
      s('line', { x1: 110, y1: 0, x2: 110, y2: 240, class: 'an-membrana' }),
      s('line', { x1: 290, y1: 0, x2: 290, y2: 240, class: 'an-membrana' }),
      texto(55, 20, 'Orina', 'an-zona', 'middle'),
      texto(200, 20, 'Célula', 'an-zona', 'middle'),
      texto(345, 20, 'Sangre', 'an-zona', 'middle'),
      // Acuaporinas de la membrana de la sangre (siempre presentes).
      ...[140, 175].map((y) => s('rect', { x: 284, y: y - 5, width: 12, height: 10, rx: 2, class: 'an-canal' })),
      texto(200, 226, 'acuaporinas', 'an-texto-tenue', 'middle'),
    );
    // Receptor V2 en la membrana de la sangre.
    const brillo = s('circle', { cx: 290, cy: 70, r: 14, class: 'an-brillo' });
    svg.append(brillo, s('path', { d: 'M283 62 v16 h14 v-16', class: 'an-receptor' }), texto(298, 98, 'receptor V2', 'an-texto'));
    p.opacidad(brillo, [[0, 0], [0.17, 0], [0.2, 1], [0.92, 1], [1, 0]]);
    // ADH.
    const hormona = s('g', {}, s('polygon', { points: '-9,-5 0,-10 9,-5 9,5 0,10 -9,5', class: 'an-hormona' }), texto(0, -14, 'ADH', 'an-texto', 'middle'));
    svg.append(hormona);
    p.ruta(hormona, [[0, 370, 70, 0], [0.04, 370, 70, 1], [0.18, 306, 70], [0.92, 306, 70, 1], [1, 306, 70, 0]]);
    // Vesículas que se funden con la membrana de la orina y se convierten en canales.
    const carriles = [80, 125, 170];
    carriles.forEach((y, i) => {
      const vesicula = s('g', {}, s('circle', { r: 11, class: 'an-vesicula' }), s('rect', { x: -5, y: -4, width: 10, height: 8, rx: 2, class: 'an-canal' }));
      svg.append(vesicula);
      const x0 = 200 + (i % 2) * 18;
      p.ruta(vesicula, [[0, x0, y + 10, 0], [0.18, x0, y + 10, 1], [0.38 + i * 0.01, 122, y], [0.42, 116, y, 0], [1, 116, y, 0]]);
      const canal = s('rect', { x: 104, y: y - 5, width: 12, height: 10, rx: 2, class: 'an-canal' });
      svg.append(canal);
      p.opacidad(canal, [[0, 0], [0.38, 0], [0.42, 1], [0.94, 1], [1, 0]]);
    });
    // Agua: de la orina a la sangre.
    for (let i = 0; i < 6; i++) {
      const y = carriles[i % 3];
      const yb = i % 2 ? 175 : 140;
      const t = 0.42 + i * 0.06;
      const gota = s('circle', { r: 4.5, class: 'an-agua' });
      svg.append(gota);
      p.ruta(gota, [[0, 30, y, 0], [t, 30, y, 0], [t + 0.02, 40, y, 1], [t + 0.08, 110, y], [t + 0.15, 200, (y + yb) / 2], [t + 0.21, 290, yb], [t + 0.25, 350, yb, 0]]);
    }
    svg.append(texto(55, 226, 'agua', 'an-texto-tenue', 'middle'));
  },
};

// ─────────────── Aldosterona: canales y bomba Na/K ───────────────

const aldosterona: Definicion = {
  titulo: 'En la célula principal del túbulo colector',
  descripcion:
    'Animación: la aldosterona entra en la célula y en el núcleo; aparecen canales de sodio y bombas sodio-potasio nuevos; el sodio pasa de la orina a la sangre y el potasio de la sangre a la orina.',
  duracion: 11000,
  pasos: [
    { texto: 'La aldosterona llega por la sangre y atraviesa la membrana.', desde: 0, hasta: 0.12 },
    { texto: 'Se une a su receptor, dentro de la célula, y los dos entran juntos en el núcleo.', desde: 0.12, hasta: 0.3 },
    { texto: 'La célula fabrica canales de Na⁺ y bombas Na⁺/K⁺ nuevos, que van a las membranas.', desde: 0.3, hasta: 0.48 },
    { texto: 'El Na⁺ entra desde la orina y la bomba lo saca a la sangre; el K⁺ que mete la bomba sale a la orina.', desde: 0.48, hasta: 1 },
  ],
  nota: NOTA_GENERAL,
  dibujar(svg, p) {
    svg.append(
      s('rect', { x: 0, y: 0, width: 120, height: 240, class: 'an-orina' }),
      s('rect', { x: 120, y: 0, width: 160, height: 240, class: 'an-celula' }),
      s('rect', { x: 280, y: 0, width: 120, height: 240, class: 'an-sangre' }),
      s('line', { x1: 120, y1: 0, x2: 120, y2: 240, class: 'an-membrana' }),
      s('line', { x1: 280, y1: 0, x2: 280, y2: 240, class: 'an-membrana' }),
      texto(60, 20, 'Orina', 'an-zona', 'middle'),
      texto(200, 20, 'Célula', 'an-zona', 'middle'),
      texto(340, 20, 'Sangre', 'an-zona', 'middle'),
      s('rect', { x: 113, y: 55, width: 14, height: 10, rx: 2, class: 'an-canal' }),
      texto(128, 44, 'canal de Na⁺', 'an-texto'),
      s('rect', { x: 113, y: 165, width: 14, height: 10, rx: 2, class: 'an-canal' }),
      texto(128, 160, 'canal de K⁺', 'an-texto'),
      s('circle', { cx: 280, cy: 115, r: 13, class: 'an-bomba' }),
      texto(280, 119, 'ATP', 'an-texto-oscuro', 'middle'),
      texto(270, 92, 'bomba Na⁺/K⁺', 'an-texto', 'end'),
    );
    const nucleo = s('ellipse', { cx: 200, cy: 208, rx: 42, ry: 16, class: 'an-nucleo' });
    const brillo = s('ellipse', { cx: 200, cy: 208, rx: 48, ry: 21, class: 'an-brillo' });
    svg.append(brillo, nucleo, texto(200, 212, 'núcleo', 'an-texto', 'middle'));
    p.opacidad(brillo, [[0, 0], [0.24, 0], [0.28, 1], [0.44, 1], [0.5, 0]]);
    const hormona = s('g', {}, s('polygon', { points: '-9,-5 0,-10 9,-5 9,5 0,10 -9,5', class: 'an-hormona' }));
    svg.append(hormona, texto(362, 232, 'aldosterona', 'an-texto', 'middle'));
    p.ruta(hormona, [[0, 362, 205, 0], [0.03, 362, 205, 1], [0.12, 280, 190], [0.2, 236, 186], [0.28, 206, 204], [0.32, 200, 208, 0], [1, 200, 208, 0]]);
    // Canal y bomba nuevos.
    const canalNuevo = s('rect', { x: -7, y: -5, width: 14, height: 10, rx: 2, class: 'an-canal an-nuevo' });
    const bombaNueva = s('g', {}, s('circle', { r: 13, class: 'an-bomba an-nuevo' }), texto(0, 4, 'ATP', 'an-texto-oscuro', 'middle'));
    svg.append(canalNuevo, bombaNueva);
    p.ruta(canalNuevo, [[0, 196, 196, 0], [0.3, 196, 196, 0], [0.32, 190, 190, 1], [0.45, 120, 88], [0.95, 120, 88, 1], [1, 120, 88, 0]]);
    p.ruta(bombaNueva, [[0, 204, 196, 0], [0.32, 204, 196, 0], [0.34, 210, 190, 1], [0.47, 280, 148], [0.95, 280, 148, 1], [1, 280, 148, 0]]);
    // Sodio: de la orina a la sangre.
    for (let i = 0; i < 4; i++) {
      const t = 0.48 + i * 0.11;
      const yc = i % 2 ? 88 : 60;
      const yb = i % 2 ? 148 : 115;
      const na = s('g', {}, s('circle', { r: 7, class: 'an-na' }), texto(0, 3.5, 'Na', 'an-ion', 'middle'));
      svg.append(na);
      p.ruta(na, [[0, 40, yc, 0], [t, 40, yc, 0], [t + 0.02, 48, yc, 1], [t + 0.05, 120, yc], [t + 0.1, 200, (yc + yb) / 2 + 10], [t + 0.14, 280, yb], [t + 0.18, 360, yb, 0]]);
    }
    // Potasio: de la sangre a la orina.
    for (let i = 0; i < 3; i++) {
      const t = 0.52 + i * 0.14;
      const yb = i % 2 ? 148 : 115;
      const k = s('g', {}, s('circle', { r: 6.5, class: 'an-k' }), texto(0, 3.5, 'K', 'an-ion', 'middle'));
      svg.append(k);
      p.ruta(k, [[0, 360, yb + 18, 0], [t, 360, yb + 18, 0], [t + 0.02, 352, yb + 16, 1], [t + 0.05, 280, yb + 6], [t + 0.1, 200, 160], [t + 0.14, 120, 170], [t + 0.18, 40, 172, 0]]);
    }
  },
};

// ─────────────── Regaliz y 11β-HSD2 ───────────────

const regaliz: Definicion = {
  titulo: 'En la célula principal del túbulo colector',
  descripcion:
    'Animación en dos partes. Sin regaliz, la enzima 11β-HSD2 convierte el cortisol en cortisona, que no activa el receptor. Con regaliz, el ácido glicirrícico bloquea la enzima y el cortisol ocupa el receptor de la aldosterona.',
  duracion: 12000,
  pasos: [
    { texto: 'Sin regaliz: la enzima 11β-HSD2 convierte el cortisol en cortisona, que no activa el receptor.', desde: 0, hasta: 0.47 },
    { texto: 'Con regaliz: el ácido glicirrícico bloquea la enzima.', desde: 0.47, hasta: 0.62 },
    { texto: 'El cortisol llega intacto, ocupa el receptor de la aldosterona y actúa como ella: más Na⁺ reabsorbido y más K⁺ perdido.', desde: 0.62, hasta: 1 },
  ],
  nota: NOTA_GENERAL,
  dibujar(svg, p) {
    svg.append(
      s('rect', { x: 0, y: 0, width: 300, height: 240, class: 'an-celula' }),
      s('rect', { x: 300, y: 0, width: 100, height: 240, class: 'an-sangre' }),
      s('line', { x1: 300, y1: 0, x2: 300, y2: 240, class: 'an-membrana' }),
      texto(350, 20, 'Sangre', 'an-zona', 'middle'),
    );
    const sin = texto(12, 22, 'Sin regaliz', 'an-zona');
    const con = texto(12, 22, 'Con regaliz', 'an-zona an-zona-acento');
    svg.append(sin, con);
    p.opacidad(sin, [[0, 1], [0.46, 1], [0.48, 0], [0.98, 0], [1, 1]]);
    p.opacidad(con, [[0, 0], [0.46, 0], [0.48, 1], [0.98, 1], [1, 0]]);
    // Enzima.
    svg.append(
      s('rect', { x: 208, y: 58, width: 64, height: 26, rx: 13, class: 'an-enzima' }),
      texto(240, 75, '11β-HSD2', 'an-texto-oscuro', 'middle'),
    );
    const bloqueo = s('path', { d: 'M212 54 l56 34 M268 54 l-56 34', class: 'an-bloqueo' });
    svg.append(bloqueo);
    p.opacidad(bloqueo, [[0, 0], [0.57, 0], [0.6, 1], [0.97, 1], [1, 0]]);
    // Receptor de aldosterona.
    const brillo = s('circle', { cx: 110, cy: 140, r: 22, class: 'an-brillo' });
    svg.append(
      brillo,
      s('path', { d: 'M94 128 v22 h32 v-22', class: 'an-receptor' }),
      texto(110, 176, 'receptor de aldosterona', 'an-texto', 'middle'),
    );
    p.opacidad(brillo, [[0, 0], [0.78, 0], [0.82, 1], [0.97, 1], [1, 0]]);
    const efecto = texto(110, 205, 'más Na⁺ dentro · más K⁺ fuera', 'an-texto-acento', 'middle');
    svg.append(efecto);
    p.opacidad(efecto, [[0, 0], [0.84, 0], [0.88, 1], [0.97, 1], [1, 0]]);
    // Sin regaliz: el cortisol pasa por la enzima y sale como cortisona.
    const molecula = (clase: string, rotulo: string) =>
      s('g', {}, s('circle', { r: 9, class: clase }), texto(0, -14, rotulo, 'an-texto', 'middle'));
    const cortisol1 = molecula('an-cortisol', 'cortisol');
    const cortisona = molecula('an-cortisona', 'cortisona');
    svg.append(cortisol1, cortisona);
    p.ruta(cortisol1, [[0, 370, 72, 0], [0.03, 370, 72, 1], [0.14, 276, 72], [0.17, 262, 72, 0], [1, 262, 72, 0]]);
    p.ruta(cortisona, [[0, 212, 72, 0], [0.16, 212, 72, 0], [0.18, 200, 76, 1], [0.32, 126, 110], [0.36, 140, 104], [0.44, 60, 60, 0], [1, 60, 60, 0]]);
    // Con regaliz: el ácido bloquea la enzima y el cortisol ocupa el receptor.
    const acido = s('g', {}, s('polygon', { points: '0,-9 9,7 -9,7', class: 'an-regaliz' }), texto(0, -14, 'ácido glicirrícico', 'an-texto', 'middle'));
    svg.append(acido);
    p.ruta(acido, [[0, 360, 46, 0], [0.48, 360, 46, 0], [0.5, 352, 46, 1], [0.58, 240, 44], [0.97, 240, 44, 1], [1, 240, 44, 0]]);
    const cortisol2 = molecula('an-cortisol', 'cortisol');
    svg.append(cortisol2);
    p.ruta(cortisol2, [[0, 370, 112, 0], [0.6, 370, 112, 0], [0.62, 360, 112, 1], [0.7, 250, 116], [0.8, 110, 140], [0.97, 110, 140, 1], [1, 110, 140, 0]]);
  },
};

// ─────────────── Mácula densa y renina ───────────────

const renina: Definicion = {
  titulo: 'En el aparato yuxtaglomerular',
  descripcion:
    'Animación: la sangre llega al glomérulo por la arteriola aferente y el túbulo de la misma nefrona pasa junto a ella. Cuando baja la presión en la aferente o llega poco NaCl a la mácula densa, las células granulares liberan renina a la sangre.',
  duracion: 10000,
  pasos: [
    { texto: 'La sangre llega al glomérulo por la arteriola aferente. El túbulo de la misma nefrona vuelve a pasar junto a ella: ahí está la mácula densa, que mide el NaCl que pasa.', desde: 0, hasta: 0.35 },
    { texto: 'Baja la presión en la aferente (estenosis, poco volumen) o llega poco NaCl a la mácula densa.', desde: 0.35, hasta: 0.5 },
    { texto: 'Las células granulares de la pared de la aferente liberan renina a la sangre. El simpático (receptores β1) también las estimula.', desde: 0.5, hasta: 1 },
  ],
  nota: NOTA_GENERAL,
  dibujar(svg, p) {
    svg.append(
      s('rect', { x: 0, y: 0, width: 400, height: 240, class: 'an-fondo' }),
      // Arteriola aferente.
      s('rect', { x: 0, y: 38, width: 285, height: 44, class: 'an-pared-vaso' }),
      s('rect', { x: 0, y: 46, width: 290, height: 28, class: 'an-luz' }),
      texto(8, 30, 'arteriola aferente', 'an-texto'),
      // Glomérulo.
      s('circle', { cx: 325, cy: 95, r: 55, class: 'an-capsula' }),
      s('path', { d: 'M290 70 q20 -25 40 0 t30 20 q10 25 -15 35 t-40 -5 q-20 -20 -5 -35', class: 'an-ovillo' }),
      texto(325, 168, 'glomérulo', 'an-texto', 'middle'),
      // Túbulo distal.
      s('rect', { x: 0, y: 92, width: 250, height: 34, class: 'an-tubulo' }),
      s('rect', { x: 0, y: 100, width: 250, height: 18, class: 'an-luz-tubulo' }),
      texto(8, 140, 'túbulo distal', 'an-texto'),
    );
    // Mácula densa: células altas y apretadas en la pared del túbulo que toca la aferente.
    for (let x = 150; x <= 232; x += 9) svg.append(s('rect', { x, y: 88, width: 7, height: 12, rx: 2, class: 'an-macula' }));
    // Células granulares en la pared inferior de la aferente.
    for (let x = 150; x <= 232; x += 21) svg.append(s('rect', { x, y: 74, width: 18, height: 10, rx: 3, class: 'an-granular' }));
    svg.append(
      s('line', { x1: 190, y1: 100, x2: 150, y2: 170, class: 'an-guia' }),
      texto(150, 182, 'mácula densa', 'an-texto', 'middle'),
      s('line', { x1: 230, y1: 84, x2: 230, y2: 196, class: 'an-guia' }),
      texto(230, 208, 'células granulares', 'an-texto', 'middle'),
    );
    // Flujo continuo de hematíes (en la aferente) y de NaCl (en el túbulo).
    const flujo = (clase: string, y: number, n: number, sentido: 1 | -1, dur: number, rx: number) => {
      const grupoMenos = s('g', {});
      const grupo = s('g', {}, grupoMenos);
      for (let i = 0; i < n; i++) {
        const el = s('ellipse', { rx, ry: rx * 0.6, class: clase });
        (i % 2 ? grupoMenos : grupo).append(el);
        const desfase = i / n;
        const x0 = sentido > 0 ? -10 : 260;
        const x1 = sentido > 0 ? 290 : -10;
        const yy = y + ((i * 7) % 3) * 4 - 4;
        p.propiedad(el, [
          { offset: 0, transform: `translate(${x0 + (x1 - x0) * desfase}px, ${yy}px)` },
          { offset: 1 - desfase, transform: `translate(${x1}px, ${yy}px)` },
          { offset: 1 - desfase + 0.0001, transform: `translate(${x0}px, ${yy}px)` },
          { offset: 1, transform: `translate(${x0 + (x1 - x0) * desfase}px, ${yy}px)` },
        ].filter((f) => f.offset <= 1), dur);
      }
      svg.append(grupo);
      return grupoMenos;
    };
    const menosSangre = flujo('an-hematie', 60, 10, 1, 2500, 7);
    const menosSal = flujo('an-nacl', 109, 10, -1, 3000, 3.5);
    p.opacidad(menosSangre, [[0, 1], [0.35, 1], [0.42, 0], [0.95, 0], [1, 1]]);
    p.opacidad(menosSal, [[0, 1], [0.35, 1], [0.42, 0], [0.95, 0], [1, 1]]);
    const aviso = texto(140, 232, 'presión ↓ · NaCl ↓', 'an-texto-acento', 'middle');
    svg.append(aviso);
    p.opacidad(aviso, [[0, 0], [0.36, 0], [0.42, 1], [0.95, 1], [1, 0]]);
    // Renina: sale de las células granulares a la luz y viaja con la sangre.
    for (let i = 0; i < 6; i++) {
      const t = 0.5 + i * 0.07;
      const x = 158 + (i % 4) * 21;
      const granulo = s('circle', { r: 4, class: 'an-renina' });
      svg.append(granulo);
      p.ruta(granulo, [[0, x, 79, 0], [t, x, 79, 0], [t + 0.02, x, 76, 1], [t + 0.06, x + 10, 62], [t + 0.12, x + 90, 58], [t + 0.14, x + 110, 58, 0]]);
    }
    svg.append(s('circle', { cx: 330, cy: 214, r: 4, class: 'an-renina' }), texto(340, 218, 'renina', 'an-texto'));
  },
};

// ─────────────── Del LDL a la célula espumosa ───────────────

const placa: Definicion = {
  titulo: 'En la pared de la arteria grande',
  descripcion:
    'Animación: el endotelio se daña, el LDL entra en la íntima y se oxida, un monocito entra y se convierte en macrófago, el macrófago se llena de LDL y se convierte en célula espumosa, y el músculo liso y el colágeno forman una capa fibrosa sobre la placa.',
  duracion: 14000,
  pasos: [
    { texto: 'El tabaco, la diabetes, la hipertensión o el LDL alto dañan el endotelio.', desde: 0, hasta: 0.12 },
    { texto: 'El LDL entra en la íntima y se oxida.', desde: 0.12, hasta: 0.3 },
    { texto: 'Un monocito se pega al endotelio, entra y se convierte en macrófago.', desde: 0.3, hasta: 0.55 },
    { texto: 'El macrófago se llena de LDL oxidado: es una célula espumosa.', desde: 0.55, hasta: 0.72 },
    { texto: 'Llegan células de músculo liso de la media y forman colágeno: una capa fibrosa cubre la placa.', desde: 0.72, hasta: 1 },
  ],
  nota: 'Esquema simplificado: en la realidad la placa tarda años en formarse.',
  dibujar(svg, p) {
    svg.append(
      s('rect', { x: 0, y: 0, width: 400, height: 80, class: 'an-luz' }),
      s('rect', { x: 0, y: 88, width: 400, height: 64, class: 'an-intima' }),
      s('rect', { x: 0, y: 152, width: 400, height: 88, class: 'an-media' }),
      s('path', { d: 'M0 152' + ' q10 -3 20 0 t20 0'.repeat(10), class: 'an-lamina' }),
    );
    for (let x = 0; x < 400; x += 40) svg.append(s('rect', { x: x + 1, y: 80, width: 38, height: 8, rx: 3, class: 'an-endotelio' }));
    for (let i = 0; i < 9; i++) {
      const x = 20 + i * 44;
      const y = 175 + (i % 3) * 20;
      svg.append(s('ellipse', { cx: x, cy: y, rx: 18, ry: 5, class: 'an-musculo' }));
    }
    svg.append(
      texto(392, 20, 'luz', 'an-texto', 'end'),
      texto(392, 76, 'endotelio', 'an-texto', 'end'),
      texto(392, 132, 'íntima', 'an-texto', 'end'),
      texto(392, 230, 'media', 'an-texto', 'end'),
    );
    // 1. Daño del endotelio.
    const lesion = s('rect', { x: 161, y: 78, width: 38, height: 12, rx: 3, class: 'an-lesion' });
    svg.append(lesion);
    p.opacidad(lesion, [[0, 0], [0.03, 0], [0.1, 1], [0.97, 1], [1, 0]]);
    // 2. LDL que entra y se oxida.
    const destinos: [number, number][] = [[160, 110], [185, 128], [205, 105], [222, 125], [175, 140]];
    destinos.forEach(([x, y], i) => {
      // LDL: el círculo oxidado aparece encima del fresco.
      const oxidado = s('circle', { r: 5, class: 'an-ldl-ox' });
      const ldl = s('g', {}, s('circle', { r: 5, class: 'an-ldl' }), oxidado);
      svg.append(ldl);
      p.opacidad(oxidado, [[0, 0], [0.27, 0], [0.32, 1], [1, 1]]);
      const t = 0.1 + i * 0.03;
      p.ruta(ldl, [[0, 20 + i * 15, 40 + (i % 3) * 12, 0], [t, 20 + i * 15, 40 + (i % 3) * 12, 0], [t + 0.02, 40 + i * 15, 42, 1], [t + 0.07, 180, 74], [t + 0.1, x, y], [0.55, x, y], [0.64, 196, 122], [0.67, 196, 122, 0], [1, 196, 122, 0]]);
    });
    // 3. Monocito → macrófago.
    const monocito = s('g', {}, s('circle', { r: 11, class: 'an-monocito' }), s('path', { d: 'M-5 -2 q5 -6 10 0 q-5 5 -10 0', class: 'an-nucleo-celula' }));
    svg.append(monocito);
    p.ruta(monocito, [[0, -20, 45, 0], [0.3, -20, 45, 0], [0.31, -10, 45, 1], [0.4, 180, 68], [0.48, 192, 112], [0.55, 196, 122], [0.66, 196, 122, 1], [0.69, 196, 122, 0], [1, 196, 122, 0]]);
    // 4. Célula espumosa.
    const espumosa = s(
      'g',
      {},
      s('circle', { r: 19, class: 'an-espumosa' }),
      ...[[-8, -6], [6, -9], [9, 5], [-4, 8], [-10, 4], [2, 0]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 3.5, class: 'an-vacuola' })),
    );
    svg.append(espumosa);
    p.ruta(espumosa, [[0, 196, 122, 0], [0.66, 196, 122, 0], [0.7, 196, 122, 1], [0.97, 196, 122, 1], [1, 196, 122, 0]]);
    const rotuloEspumosa = texto(250, 118, 'célula espumosa', 'an-texto');
    svg.append(rotuloEspumosa);
    p.opacidad(rotuloEspumosa, [[0, 0], [0.68, 0], [0.72, 1], [0.97, 1], [1, 0]]);
    // 5. Músculo liso que migra y capa fibrosa.
    [[150, 195, 165, 98], [240, 175, 228, 100]].forEach(([x0, y0, x1, y1]) => {
      const celula = s('ellipse', { rx: 18, ry: 5, class: 'an-musculo an-migra' });
      svg.append(celula);
      p.ruta(celula, [[0, x0, y0, 0], [0.72, x0, y0, 0], [0.73, x0, y0, 1], [0.85, x1, y1], [0.97, x1, y1, 1], [1, x1, y1, 0]]);
    });
    const capa = s('path', { d: 'M130 80 q66 -46 132 0', class: 'an-capa' });
    const bulto = s('path', { d: 'M120 80 q76 -60 152 0 z', class: 'an-bulto' });
    svg.insertBefore(bulto, svg.children[1]);
    svg.append(capa);
    p.opacidad(bulto, [[0, 0], [0.84, 0], [0.92, 1], [0.97, 1], [1, 0]]);
    p.opacidad(capa, [[0, 0], [0.84, 0], [0.92, 1], [0.97, 1], [1, 0]]);
    const rotuloCapa = texto(196, 30, 'capa fibrosa', 'an-texto', 'middle');
    svg.append(rotuloCapa);
    p.opacidad(rotuloCapa, [[0, 0], [0.86, 0], [0.92, 1], [0.97, 1], [1, 0]]);
  },
};

export const animaciones: Record<string, Definicion> = { adh, aldosterona, regaliz, renina, placa };

/** Bloque de la ficha: título, botón de pausa, dibujo, pasos que se resaltan y aviso. */
export function crearAnimacion(id: string): { raiz: HTMLElement; detener(): void } | null {
  const def = animaciones[id];
  if (!def) return null;
  const lista: Animation[] = [];
  const pista: Pista = {
    ruta(el, puntos, duracion = def.duracion) {
      lista.push(el.animate(trasladar(puntos), { duration: duracion, iterations: Infinity }));
    },
    opacidad(el, puntos) {
      lista.push(el.animate(extremos(puntos.map(([offset, opacity]) => ({ offset, opacity }))), { duration: def.duracion, iterations: Infinity }));
    },
    propiedad(el, frames, duracion = def.duracion) {
      lista.push(el.animate(frames, { duration: duracion, iterations: Infinity }));
    },
  };
  const svg = s('svg', { viewBox: '0 0 400 240', role: 'img', 'aria-label': def.descripcion, class: 'animacion-svg' });
  def.dibujar(svg, pista);

  const pasos = def.pasos.map((paso) => {
    const li = h('li', {}, paso.texto);
    const apagado = 0.5;
    const frames: [number, number][] =
      paso.desde === 0
        ? [[0, 1], [paso.hasta - 0.01, 1], [paso.hasta, apagado], [1, apagado]]
        : [[0, apagado], [paso.desde - 0.01, apagado], [paso.desde, 1], [Math.min(1, paso.hasta) - 0.001, 1], [Math.min(1, paso.hasta), paso.hasta >= 1 ? 1 : apagado]];
    pista.opacidad(li, frames);
    return li;
  });

  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pausado = false;
  const iconoPausa = s('path', { d: 'M4 2.5v9M10 2.5v9', class: 'icono-trazo', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
  const iconoPlay = s('path', { d: 'M4 2.5v9l7-4.5z', class: 'icono-relleno' });
  const boton = h(
    'button',
    { type: 'button', class: 'boton boton-icono' },
    s('svg', { width: 14, height: 14, viewBox: '0 0 14 14', 'aria-hidden': 'true' }, iconoPausa, iconoPlay),
  );
  function poner(p: boolean) {
    pausado = p;
    for (const a of lista) {
      if (p) a.pause();
      else a.play();
    }
    boton.setAttribute('aria-label', p ? 'Reanudar la animación' : 'Pausar la animación');
    boton.setAttribute('aria-pressed', String(p));
    iconoPausa.style.display = p ? 'none' : '';
    iconoPlay.style.display = p ? '' : 'none';
  }
  boton.addEventListener('click', () => poner(!pausado));
  if (reducir) {
    // Sin movimiento: se queda quieta en el último paso.
    for (const a of lista) a.currentTime = def.duracion * 0.9;
    poner(true);
  } else poner(false);

  const raiz = h(
    'section',
    { class: 'ficha-animacion', 'data-ia-apartado': `Animación «${def.titulo}»` },
    h('div', { class: 'ficha-animacion-cabecera' }, h('h3', {}, def.titulo), boton),
    svg,
    h('ol', { class: 'ficha-animacion-pasos' }, ...pasos),
    h('p', { class: 'ficha-aviso pequeno' }, def.nota),
  );
  return {
    raiz,
    detener() {
      for (const a of lista) a.cancel();
    },
  };
}
