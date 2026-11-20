import type { Caso } from '../motor/tipos';
import { h, idUnico, s } from './dom';
import { crearHistorial } from './historial';
import { asa, deslizarParaCerrar, MOVIL } from './hoja';
import { rectCss } from './preferencias';

/** Chip de un caso: lo que lleva (causa, fármaco o ejercicio). */
export interface ChipCaso {
  texto: string;
  /** `rara`, `poco_frecuente`, `comun`, `farmaco` o `ejercicio`: da el color. */
  tipo: string;
}

interface Opciones {
  casos: Caso[];
  /** Grupos de la lista, en orden: título y qué casos entran. */
  grupos: { titulo: string; incluye: (c: Caso) => boolean }[];
  chips: (c: Caso) => ChipCaso[];
  /** Al elegir: el caso, o `null` para «Sin causas (todo normal)». */
  alElegir: (caso: Caso | null) => void;
}

/** Sin tildes ni mayúsculas, para buscar «hipotiroidismo» o «farmaco» como se escriba. */
const normalizar = (t: string) => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/**
 * Selector de casos (fase 5, opción C de la maqueta): un botón con el caso
 * activo que abre una lista con buscador. En la pantalla ancha, panel bajo el
 * botón con el cursor en el buscador; en el móvil, hoja desde abajo (asa,
 * deslizar, «atrás» del sistema) sin abrir el teclado: al teclear con un
 * teclado físico, el texto va al buscador. Cada caso es un botón real con su
 * número, su nombre y sus chips.
 */
export function crearSelectorCaso(op: Opciones) {
  const textoBoton = h('span', { class: 'selector-texto' });
  const boton = h(
    'button',
    { type: 'button', id: 'selector-caso', class: 'selector selector-boton', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' },
    textoBoton,
    s('svg', { width: 12, height: 12, viewBox: '0 0 12 12', 'aria-hidden': 'true', class: 'selector-flecha' },
      s('path', { d: 'M2.5 4.5 6 8l3.5-3.5', fill: 'none', class: 'icono-trazo', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ),
  );

  const idTitulo = idUnico('selector-titulo');
  const cerrar = h('button', { type: 'button', class: 'boton' }, 'Cerrar');
  const cabecera = h('div', { class: 'ficha-cabecera' }, asa(), h('h2', { id: idTitulo }, 'Elegir caso'), cerrar);
  const buscador = h('input', {
    type: 'search', class: 'selector-buscar-campo', placeholder: 'Buscar: número, causa, fármaco o ejercicio',
    'aria-label': 'Buscar un caso', autocomplete: 'off', spellcheck: 'false', enterkeyhint: 'go',
  });
  const campo = h(
    'label',
    { class: 'selector-buscar' },
    s('svg', { width: 18, height: 18, viewBox: '0 0 18 18', 'aria-hidden': 'true' },
      s('circle', { cx: 7.5, cy: 7.5, r: 5.5, fill: 'none', class: 'icono-trazo', 'stroke-width': 1.7 }),
      s('path', { d: 'M11.6 11.6 16 16', class: 'icono-trazo', 'stroke-width': 1.7, 'stroke-linecap': 'round' }),
    ),
    buscador,
  );
  const vacio = h('p', { class: 'selector-vacio tenue', hidden: true }, 'Ningún caso coincide.');
  const estado = h('p', { class: 'oculto', 'aria-live': 'polite' });

  /** Un botón por caso (y uno para «Sin causas»), con el texto en que se busca. */
  const opciones: { boton: HTMLButtonElement; caso: Caso | null; busqueda: string; nombre: HTMLElement; chips: HTMLElement[] }[] = [];
  const opcion = (caso: Caso | null, grupo = '') => {
    const nombre = h('span', { class: 'selector-nombre' }, caso ? caso.nombre : 'Sin causas (todo normal)');
    const chips = caso ? op.chips(caso).map((c) => h('span', { class: 'selector-chip', 'data-tipo': c.tipo }, c.texto)) : [];
    const b = h(
      'button',
      { type: 'button', class: 'selector-opcion' },
      h('span', { class: 'selector-num', 'aria-hidden': 'true' }, caso ? String(caso.id) : '0'),
      h('span', { class: 'selector-cuerpo' }, nombre, chips.length ? h('span', { class: 'selector-chips' }, ...chips) : null),
    );
    b.setAttribute('aria-label', caso ? `${caso.id} · ${caso.nombre}${chips.length ? `: ${chips.map((c) => c.textContent).join(', ')}` : ''}` : 'Sin causas, todo normal');
    b.addEventListener('click', () => elegir(caso));
    opciones.push({ boton: b, caso, nombre, chips, busqueda: normalizar(caso ? `${caso.id} ${caso.nombre} ${chips.map((c) => c.textContent).join(' ')} ${grupo}` : 'sin causas todo normal 0') });
    return b;
  };
  const grupos = op.grupos.map((g) => {
    const idG = idUnico('selector-grupo');
    const lista = h('ul', { class: 'selector-lista', 'aria-labelledby': idG }, ...op.casos.filter(g.incluye).map((c) => h('li', {}, opcion(c, g.titulo))));
    return h('section', { class: 'selector-grupo' }, h('h3', { id: idG }, g.titulo), lista);
  });
  const lista = h('div', { class: 'selector-resultados' }, h('ul', { class: 'selector-lista' }, h('li', {}, opcion(null))), ...grupos, vacio);

  const dialogo = h('dialog', { class: 'ficha selector-dialogo', 'aria-labelledby': idTitulo }, cabecera, campo, lista, estado);
  cerrar.addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) dialogo.close();
  });
  deslizarParaCerrar(dialogo, cabecera);
  const historial = crearHistorial(dialogo, () => false);
  dialogo.addEventListener('close', () => {
    boton.setAttribute('aria-expanded', 'false');
    boton.focus({ preventScroll: true });
  });

  let actual: number | null | 'libre' = null;

  function elegir(caso: Caso | null) {
    dialogo.close();
    op.alElegir(caso);
  }

  /** Marca el texto buscado en el nombre y los chips. */
  function resaltar(el: HTMLElement, texto: string, q: string) {
    el.replaceChildren(texto);
    if (!q) return;
    const i = normalizar(texto).indexOf(q);
    if (i < 0) return;
    el.replaceChildren(texto.slice(0, i), h('mark', {}, texto.slice(i, i + q.length)), texto.slice(i + q.length));
  }

  function filtrar() {
    const q = normalizar(buscador.value.trim());
    let n = 0;
    for (const o of opciones) {
      const ve = !q || q.split(/\s+/).every((p) => o.busqueda.includes(p));
      o.boton.parentElement!.hidden = !ve;
      if (ve) n++;
      const palabra = q.split(/\s+/)[0] ?? '';
      resaltar(o.nombre, o.caso ? o.caso.nombre : 'Sin causas (todo normal)', palabra);
      for (const c of o.chips) resaltar(c, c.dataset.texto ?? (c.dataset.texto = c.textContent ?? ''), palabra);
    }
    for (const g of grupos) g.hidden = !g.querySelector('li:not([hidden])');
    vacio.hidden = n > 0;
    estado.textContent = q ? (n === 0 ? 'Ningún caso coincide' : `${n} caso${n === 1 ? '' : 's'}`) : '';
  }
  buscador.addEventListener('input', filtrar);

  /** Opciones visibles en el orden de la lista. */
  const visibles = () =>
    [...lista.querySelectorAll<HTMLButtonElement>('li:not([hidden]) > .selector-opcion')].filter((b) => !b.closest('.selector-grupo[hidden]'));
  buscador.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      visibles()[0]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      visibles()[0]?.click();
    }
  });
  lista.addEventListener('keydown', (e) => {
    const lista_ = visibles();
    const i = lista_.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const destino =
      e.key === 'ArrowDown' ? lista_[i + 1]
      : e.key === 'ArrowUp' ? (i === 0 ? buscador : lista_[i - 1])
      : e.key === 'Home' ? lista_[0]
      : e.key === 'End' ? lista_[lista_.length - 1]
      : undefined;
    if (destino) {
      e.preventDefault();
      destino.focus();
      return;
    }
    // Teclear sobre la lista (teclado físico) escribe en el buscador.
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ') {
      buscador.focus();
    }
  });

  function colocar() {
    if (MOVIL.matches) {
      dialogo.style.removeProperty('top');
      dialogo.style.removeProperty('left');
      return;
    }
    const r = rectCss(boton.closest('.campo-caso')!.getBoundingClientRect());
    dialogo.style.top = `${Math.round(r.bottom + 8)}px`;
    dialogo.style.left = `${Math.round(r.left)}px`;
  }

  function abrir() {
    buscador.value = '';
    filtrar();
    for (const o of opciones) {
      const es = o.caso ? o.caso.id === actual : actual === null;
      if (es) o.boton.setAttribute('aria-current', 'true');
      else o.boton.removeAttribute('aria-current');
    }
    colocar();
    dialogo.showModal();
    historial.empujar();
    boton.setAttribute('aria-expanded', 'true');
    const activo = opciones.find((o) => o.boton.hasAttribute('aria-current'))?.boton;
    activo?.scrollIntoView({ block: 'center' });
    // En el móvil no se abre el teclado: el foco va al caso activo.
    if (MOVIL.matches) (activo ?? cerrar).focus({ preventScroll: true });
    else buscador.focus();
  }
  boton.addEventListener('click', abrir);
  window.addEventListener('resize', () => dialogo.open && colocar());

  return {
    boton,
    dialogo,
    /** Caso activo («libre» si los mandos no coinciden con ninguno). */
    poner(caso: Caso | undefined, libre: boolean) {
      actual = caso ? caso.id : libre ? 'libre' : null;
      textoBoton.textContent = caso ? `${caso.id} · ${caso.nombre}` : libre ? 'Combinación libre' : 'Sin causas (todo normal)';
      boton.setAttribute('aria-label', `Caso: ${textoBoton.textContent}. Elegir otro caso`);
      boton.dataset.valor = caso ? String(caso.id) : libre ? 'libre' : '';
    },
  };
}
