import { flecha } from '../motor/motor';
import type { Estado } from '../motor/tipos';
import { h } from './dom';

/**
 * Ficha de estudio (fase 6, punto 4; maqueta elegida por Edu el 17 nov 2026).
 * Se compone una hoja en papel blanco con lo que muestra el simulador y se usa
 * el cuadro de imprimir del navegador (en Android, «Guardar como PDF»). Sin
 * servidor y sin conexión; el QR del enlace se genera en el propio navegador.
 */
export type TipoFicha = 'resumen' | 'trabajo';

export interface DatosFicha {
  titulo: string;
  /** Fuentes del modelo, para el pie de la hoja. */
  fuente?: string;
  /** Lo que está puesto: causas, fármacos, ejercicio y escala o momento. */
  chips: { texto: string; tipo: string }[];
  valores: Estado;
  nombre: (id: string) => string;
  determinantes: string[];
  analitica: string[];
  grupos: { nombre: string; nodos: string[] }[];
  /** «Qué mirar»: párrafos (el primero puede llevar un rótulo en negrita) y avisos. */
  queMirar: { rotulo?: string; texto: string }[];
  avisos: { titulo: string; texto: string; nivel: string }[];
  fichas: { nombre: string; apartados: { titulo: string; texto: string }[] }[];
  pregunta?: string;
  enlace: string;
}

/** Preguntas de la hoja de trabajo: valen para cualquier caso. Revisadas por Fable 5.2 (docs/revision-fase-6-fable.md). */
export const PREGUNTAS_TRABAJO = [
  '¿Qué mueve la presión en este caso: la volemia, el gasto cardíaco, la resistencia periférica o la rigidez de las arterias? Sigue el camino desde la causa.',
  '¿Qué valores de la analítica o de los mecanismos delatan la causa? Si la analítica es normal, ¿qué descarta?',
  '¿Qué vigilarías en la consulta de fisioterapia y cuándo avisarías al médico?',
];
export const AVISO_FICHA = 'Simulador docente y cualitativo: las flechas comparan con lo normal, no son cifras. No es un simulador clínico.';

const tono = (f: string) => (f.startsWith('↑') ? 'sube' : f.startsWith('↓') ? 'baja' : 'igual');

function valor(f: string, hueco: boolean) {
  return h('b', { class: `fe-flecha ${hueco ? 'fe-hueco' : `fe-${tono(f)}`}`, 'aria-label': hueco ? 'hueco' : f }, hueco ? '' : f);
}
const celda = (nombre: string, f: string, hueco: boolean) => h('div', { class: 'fe-celda' }, h('span', {}, nombre), valor(f, hueco));

async function qr(texto: string): Promise<Node | null> {
  try {
    const { default: qrcode } = await import('qrcode-generator');
    const q = qrcode(0, 'M');
    q.addData(texto);
    q.make();
    const svg = new DOMParser().parseFromString(q.createSvgTag({ cellSize: 3, margin: 0, scalable: true }), 'image/svg+xml').documentElement;
    svg.setAttribute('class', 'fe-qr');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Código QR del enlace al caso');
    return document.importNode(svg, true);
  } catch {
    // Sin QR (p. ej. sin conexión y sin la librería en caché): queda el enlace escrito.
    return null;
  }
}

function pagina(d: DatosFicha, subtitulo: string, etiqueta: string | null, cuerpo: (Node | null)[], pie: Node) {
  const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  return h(
    'section',
    { class: 'fe-pagina' },
    h('header', { class: 'fe-cabecera' },
      h('div', {},
        h('h1', {}, d.titulo, etiqueta ? h('span', { class: 'fe-etiqueta' }, etiqueta) : null),
        h('p', {}, subtitulo),
      ),
      h('div', { class: 'fe-marca' }, h('b', {}, 'RADIOSTASIS'), h('span', {}, `Ficha de estudio · ${fecha}`)),
    ),
    ...cuerpo,
    pie.cloneNode(true),
  );
}

function tablas(d: DatosFicha, hueco: boolean) {
  const f = (id: string) => flecha(d.valores[id] ?? 0);
  return [
    h('div', { class: 'fe-dos' },
      h('div', { class: 'fe-caja' },
        h('h2', {}, 'Presión'),
        h('div', { class: 'fe-presion' },
          h('span', {}, 'Sistólica ', valor(f('pas'), hueco)),
          h('span', {}, 'Diastólica ', valor(f('pad'), hueco)),
        ),
        h('div', { class: 'fe-grupo' }, 'Determinantes'),
        h('div', { class: 'fe-rejilla' }, ...d.determinantes.map((id) => celda(d.nombre(id), f(id), hueco))),
      ),
      h('div', { class: 'fe-caja' },
        h('h2', {}, 'Analítica'),
        h('div', { class: 'fe-rejilla' }, ...d.analitica.map((id) => celda(d.nombre(id), f(id), hueco))),
      ),
    ),
    h('div', { class: 'fe-caja' },
      h('h2', {}, 'Mecanismos'),
      ...d.grupos.flatMap((g) => [
        h('div', { class: 'fe-grupo' }, g.nombre),
        h('div', { class: 'fe-rejilla fe-cuatro' }, ...g.nodos.map((id) => celda(d.nombre(id), f(id), hueco))),
      ]),
    ),
  ];
}

/** Compone la ficha (o la hoja de trabajo) en el documento, sin imprimir. Devuelve el contenedor. */
export async function componerFicha(d: DatosFicha, tipo: TipoFicha, conFichas: boolean): Promise<HTMLElement> {
  const codigo = await qr(d.enlace);
  const paginas: HTMLElement[] = [];
  // Sin número de página: las fichas largas ocupan más de una hoja y el número no cuadraría.
  const pie = (_n: number) =>
    h('footer', { class: 'fe-pie' },
      h('div', {}, h('p', {}, AVISO_FICHA), d.fuente ? h('p', {}, d.fuente) : null, h('p', {}, 'Abrir este caso: ', h('code', {}, d.enlace))),
      h('div', { class: 'fe-pie-derecha' }, codigo ? codigo.cloneNode(true) : null),
    );
  const chips = h('div', { class: 'fe-chips' }, ...d.chips.map((c) => h('span', { class: 'fe-chip', 'data-tipo': c.tipo }, c.texto)));
  const pregunta = d.pregunta ? h('p', { class: 'fe-pregunta' }, h('strong', {}, 'Pregunta del profesor: '), d.pregunta) : null;
  const queMirar = h('div', { class: 'fe-caja' },
    h('h2', {}, 'Qué mirar'),
    ...d.queMirar.map((p) => h('p', {}, p.rotulo ? h('strong', {}, `${p.rotulo} `) : null, p.texto)),
    ...d.avisos.map((a) => h('div', { class: 'fe-aviso', 'data-nivel': a.nivel }, h('strong', {}, a.titulo), h('span', {}, a.texto))),
  );

  if (tipo === 'resumen') {
    paginas.push(pagina(d, 'Estado del simulador y claves del caso', null, [chips, pregunta, ...tablas(d, false), queMirar], pie(1)));
  } else {
    const preguntas = h('div', { class: 'fe-caja' },
      h('h2', {}, 'Preguntas'),
      h('ol', { class: 'fe-preguntas' }, ...PREGUNTAS_TRABAJO.map((p) => h('li', {}, h('span', {}, p), h('span', { class: 'fe-linea' }), h('span', { class: 'fe-linea' })))),
    );
    paginas.push(pagina(d, 'Completa las flechas: ↑↑ sube mucho · ↑ sube · = normal · ↓ baja · ↓↓ baja mucho', 'hoja de trabajo', [chips, pregunta, ...tablas(d, true), preguntas], pie(1)));
    paginas.push(pagina(d, 'Soluciones', 'hoja de trabajo', [chips, ...tablas(d, false), queMirar], pie(2)));
  }
  if (conFichas && d.fichas.length) {
    paginas.push(pagina(d, 'Fichas de las causas, los fármacos y el ejercicio activos', null,
      d.fichas.map((f) => h('article', { class: 'fe-ficha' },
        h('h3', {}, f.nombre),
        ...f.apartados.flatMap((a) => [h('div', { class: 'fe-grupo' }, a.titulo), h('p', {}, a.texto)]),
      )),
      pie(paginas.length + 1)));
  }
  document.getElementById('ficha-estudio')?.remove();
  const raiz = h('div', { id: 'ficha-estudio', class: 'ficha-estudio', 'aria-hidden': 'true' }, ...paginas);
  document.body.append(raiz);
  return raiz;
}

/** Compone la ficha y abre el cuadro de imprimir; al cerrarlo, la quita. */
export async function imprimirFicha(d: DatosFicha, tipo: TipoFicha, conFichas: boolean) {
  const raiz = await componerFicha(d, tipo, conFichas);
  const titulo = document.title;
  // Nombre que propone el navegador para el PDF.
  document.title = `Radiostasis · ${d.titulo}${tipo === 'trabajo' ? ' · hoja de trabajo' : ''}`;
  const limpiar = () => {
    document.title = titulo;
    raiz.remove();
    window.removeEventListener('afterprint', limpiar);
  };
  window.addEventListener('afterprint', limpiar);
  // Las fuentes ya están cargadas por la página; se espera a que se pinte el QR.
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  window.print();
}
