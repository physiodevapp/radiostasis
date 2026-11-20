import { h, s } from './dom';
import { MAX_CAUSAS_RETO, MAX_ENUNCIADO, MAX_EXPLICACION, MAX_PREGUNTA } from './enlace-caso';
import type { TipoFicha } from './exportar';
import { crearHoja, MOVIL } from './hoja';

/**
 * «Compartir» (fase 6, modo profesor; opción A de la maqueta): en la pantalla
 * ancha, un panel bajo el botón, como Ajustes; en el móvil, una hoja desde
 * abajo. Muestra en chips lo que lleva el enlace, admite una pregunta para el
 * alumno y copia el enlace o abre el menú de compartir del sistema.
 *
 * Retos por enlace (opción A de la maqueta): el interruptor «El enlace abre:
 * El caso | Un reto» convierte el estado en un reto con las causas ocultas, con
 * enunciado y explicación al corregir opcionales.
 */
export interface ChipEnlace {
  texto: string;
  /** Mismos tipos que los chips del selector de casos, más «tiempo». */
  tipo: string;
  /** Es una causa: en el reto va oculta. */
  causa?: boolean;
}

type ModoEnlace = 'caso' | 'reto';
const EN_LETRA: Record<number, string> = { 4: 'cuatro', 5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez', 11: 'once', 12: 'doce' };

export interface OpcionesCompartir {
  /** Dirección completa del enlace con la pregunta dada. */
  enlace: (pregunta: string) => string;
  /** Lo que lleva el enlace, en chips. */
  chips: () => ChipEnlace[];
  /** Fase 6, punto 4: imprimir o guardar en PDF la ficha de estudio. */
  alExportar: (tipo: TipoFicha, conFichas: boolean, pregunta: string) => void;
  /** Retos por enlace: dirección del reto con el enunciado y la explicación dados. */
  enlaceReto: (enunciado: string, explicacion: string) => string;
  /** Claves que se marcarán al corregir el reto («Aldosterona ↑↑»). */
  clavesReto: () => string[];
  /** Causas activas: un reto admite de una a tres. */
  causasReto: () => number;
  /** Enlace desde el hub PhysiQ: el hub se ha anunciado y el enlace lo abre a él. */
  enHub: () => boolean;
}

export const ICONO_COMPARTIR = () =>
  s('svg', { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    s('circle', { cx: 18, cy: 5, r: 2.6, class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7 }),
    s('circle', { cx: 6, cy: 12, r: 2.6, class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7 }),
    s('circle', { cx: 18, cy: 19, r: 2.6, class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7 }),
    s('path', { d: 'M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4', class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7, 'stroke-linecap': 'round' }),
  );

export const ICONO_ENLACE = () =>
  s('svg', { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': 'true', class: 'icono-enlace' },
    s('path', { d: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1', class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7, 'stroke-linecap': 'round' }),
    s('path', { d: 'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1', class: 'icono-trazo', fill: 'none', 'stroke-width': 1.7, 'stroke-linecap': 'round' }),
  );

/** Copia un texto; si el navegador no deja (p. ej. dentro de un iframe), lo intenta seleccionando el campo. */
async function copiar(texto: string, campo: HTMLInputElement): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    try {
      campo.hidden = false;
      campo.select();
      return document.execCommand('copy');
    } catch {
      return false;
    }
  }
}

export function crearCompartir(op: OpcionesCompartir) {
  const boton = h(
    'button',
    { type: 'button', class: 'boton boton-compartir', 'aria-expanded': 'false', 'aria-controls': 'panel-compartir', title: 'Compartir el caso por enlace o exportar su ficha de estudio' },
    ICONO_COMPARTIR(),
    h('span', { class: 'texto-boton' }, 'Compartir'),
  );
  const cerrar = h('button', { type: 'button', class: 'boton cerrar-ajustes' }, 'Cerrar');
  // Retos por enlace: el mismo panel abre el caso o un reto con las causas ocultas.
  let modo: ModoEnlace = 'caso';
  const botonModo = (valor: ModoEnlace, texto: string) => {
    const b = h('button', { type: 'button', 'data-modo': valor, 'aria-pressed': String(valor === modo) }, texto);
    b.addEventListener('click', () => {
      modo = valor;
      estado.textContent = '';
      refrescar();
    });
    return b;
  };
  const botonesModo = [botonModo('caso', 'El caso'), botonModo('reto', 'Un reto')];
  const grupoModo = h('div', { class: 'grupo-ajuste grupo-modo-enlace' },
    h('span', { id: 't-modo-enlace' }, 'El enlace abre'),
    h('div', { class: 'interruptor interruptor-enlace', role: 'group', 'aria-labelledby': 't-modo-enlace' }, ...botonesModo),
  );
  const lleva = h('p', { class: 'lleva-enlace' });
  const chips = h('div', { class: 'chips-enlace' });
  const idPregunta = 'pregunta-enlace';
  const pregunta = h('textarea', { id: idPregunta, class: 'pregunta-enlace', maxlength: MAX_PREGUNTA, rows: 2, placeholder: 'Por ejemplo: ¿por qué baja la renina?' }) as HTMLTextAreaElement;
  const contador = h('span', { class: 'contador-pregunta', 'aria-hidden': 'true' });
  const grupoPregunta = h('div', { class: 'grupo-pregunta' },
    h('label', { for: idPregunta }, 'Pregunta para el alumno ', h('span', { class: 'tenue' }, '(opcional)')),
    pregunta,
    contador,
  );
  /** Campo de texto del reto (enunciado o explicación), de una línea como la pregunta. */
  const campoReto = (id: string, titulo: string, max: number, placeholder: string) => {
    const campo = h('textarea', { id, class: 'pregunta-enlace', maxlength: max, rows: 3, placeholder }) as HTMLTextAreaElement;
    const cuenta = h('span', { class: 'contador-pregunta', 'aria-hidden': 'true' });
    const grupo = h('div', { class: 'grupo-pregunta grupo-reto-enlace', hidden: true },
      h('label', { for: id }, `${titulo} `, h('span', { class: 'tenue' }, '(opcional)')),
      campo,
      cuenta,
    );
    return { campo, cuenta, grupo, max };
  };
  const enunciado = campoReto('enunciado-reto', 'Enunciado del caso', MAX_ENUNCIADO, 'Por ejemplo: mujer de 46 años, 158/98 mmHg en tres tomas, calambres…');
  const explicacion = campoReto('explicacion-reto', 'Explicación de la solución', MAX_EXPLICACION, 'Lo que quieres que el alumno vea al comprobar su respuesta');
  const clavesReto = h('p', { class: 'claves-enlace', hidden: true });
  const avisoReto = h('p', { class: 'aviso-reto-enlace', hidden: true });
  const campoEnlace = h('input', { type: 'text', class: 'campo-enlace', readonly: true, 'aria-label': 'Enlace del caso', spellcheck: 'false' }) as HTMLInputElement;
  const botonCopiar = h('button', { type: 'button', class: 'boton boton-copiar' }, 'Copiar enlace');
  const puedeCompartir = typeof navigator.share === 'function';
  const botonSistema = h('button', { type: 'button', class: 'boton boton-sistema', hidden: true }, 'Compartir…');
  const estado = h('p', { class: 'estado-enlace', role: 'status' });
  const nota = h('p', { class: 'nota-ajustes' });
  const NOTA: Record<ModoEnlace, string> = {
    caso: 'El enlace lleva las causas, los fármacos, el ejercicio, el momento de la sesión, la escala de tiempo y la pregunta. Todo va escrito en el propio enlace: no se guarda nada en ningún servidor.',
    reto: 'Las causas van codificadas para que no se lean en el enlace, pero no cifradas: quien sepa descodificarlas las verá. Los fármacos y el ejercicio no se ocultan. No se guarda nada en ningún servidor.',
  };

  // Ficha de estudio (punto 4): resumen u hoja de trabajo, con o sin las fichas.
  const opcionFicha = (valor: TipoFicha, titulo: string, detalle: string, marcada: boolean) =>
    h('label', { class: 'opcion-ficha' },
      h('input', { type: 'radio', name: 'tipo-ficha', value: valor, checked: marcada }),
      h('span', {}, h('span', { class: 'opcion-ficha-titulo' }, titulo), h('span', { class: 'opcion-ficha-detalle' }, detalle)),
    );
  const opciones = h('div', { class: 'opciones-ficha', role: 'radiogroup', 'aria-labelledby': 't-ficha-estudio' },
    opcionFicha('resumen', 'Resumen', 'Presión, mecanismos, analítica y «Qué mirar» en una página', true),
    opcionFicha('trabajo', 'Hoja de trabajo', 'Las mismas tablas con huecos para las flechas; soluciones en la página 2 y en el enlace del pie', false),
  );
  const conFichas = h('input', { type: 'checkbox', checked: true }) as HTMLInputElement;
  const botonImprimir = h('button', { type: 'button', class: 'boton boton-imprimir' }, 'Imprimir o guardar en PDF');
  botonImprimir.addEventListener('click', () => {
    const tipo = (opciones.querySelector<HTMLInputElement>('input:checked')?.value ?? 'resumen') as TipoFicha;
    op.alExportar(tipo, conFichas.checked, pregunta.value);
  });
  const seccionFicha = h('div', { class: 'seccion-ficha' },
    h('h3', { id: 't-ficha-estudio' }, 'Ficha de estudio'),
    opciones,
    h('label', { class: 'casilla-ficha' }, conFichas, 'Añadir las fichas de lo que está activo'),
    botonImprimir,
  );

  const contenido = [
    grupoModo,
    lleva,
    chips,
    avisoReto,
    grupoPregunta,
    enunciado.grupo,
    explicacion.grupo,
    clavesReto,
    campoEnlace,
    h('div', { class: 'botones-enlace' }, botonCopiar, botonSistema),
    estado,
    nota,
    seccionFicha,
  ];
  const panel = h(
    'div',
    { id: 'panel-compartir', class: 'panel-ajustes panel-compartir', role: 'dialog', 'aria-labelledby': 't-compartir', hidden: true },
    h('div', { class: 'cabecera-ajustes' }, h('h2', { id: 't-compartir' }, 'Compartir o exportar'), cerrar),
    ...contenido,
  );
  const velo = h('div', { class: 'velo-ajustes', hidden: true });
  const hoja = crearHoja();
  hoja.raiz.classList.add('hoja-compartir');
  hoja.raiz.addEventListener('close', () => {
    panel.append(...contenido);
    boton.setAttribute('aria-expanded', 'false');
  });

  const enReto = () => modo === 'reto';
  const enlace = () => (enReto() ? op.enlaceReto(enunciado.campo.value, explicacion.campo.value) : op.enlace(pregunta.value));
  /** En el reto, por qué no se puede hacer (sin causas o más de tres); vacío si se puede. */
  function problemaReto(): string {
    const n = op.causasReto();
    if (!n) return 'Gira al menos una causa: el alumno tiene que deducirla.';
    if (n > MAX_CAUSAS_RETO) return `Un reto admite hasta tres causas y ahora hay ${EN_LETRA[n] ?? n}: quita alguna.`;
    return '';
  }
  function refrescar() {
    const reto = enReto();
    for (const b of botonesModo) b.setAttribute('aria-pressed', String(b.dataset.modo === modo));
    panel.dataset.modo = modo;
    hoja.raiz.dataset.modo = modo;
    lleva.textContent = reto ? 'El alumno ve al paciente y deduce las causas:' : op.enHub() ? 'El enlace abre PhysiQ con el simulador así:' : 'El enlace abre el simulador así:';
    chips.replaceChildren(...op.chips().map((c) => {
      const oculta = reto && c.causa;
      return h('span', { class: 'selector-chip chip-enlace', 'data-tipo': c.tipo, 'data-oculta': oculta ? '' : undefined },
        c.texto, oculta ? h('span', { class: 'chip-oculta' }, ' · causa oculta') : null);
    }));
    const problema = reto ? problemaReto() : '';
    avisoReto.textContent = problema;
    avisoReto.hidden = !problema;
    grupoPregunta.hidden = reto;
    enunciado.grupo.hidden = explicacion.grupo.hidden = !reto;
    for (const c of [enunciado, explicacion]) c.cuenta.textContent = `${c.campo.value.length}/${c.max}`;
    contador.textContent = `${pregunta.value.length}/${MAX_PREGUNTA}`;
    const claves = reto && !problema ? op.clavesReto() : [];
    clavesReto.hidden = !reto || !!problema;
    clavesReto.replaceChildren(
      ...(claves.length
        ? ['Al comprobar se marcan en violeta los valores que más se mueven (hasta dos de la analítica y hasta dos entre mecanismos y determinantes de la presión): ',
            ...claves.flatMap((t, i) => [h('strong', {}, t), i < claves.length - 1 ? ' · ' : '']),
            '. Son los que más cambian, no necesariamente los que distinguen la causa: tu enunciado o tu explicación pueden señalar los que la delatan.']
        : ['Con estas causas no se mueve ningún valor de la analítica, de los mecanismos ni de los determinantes: al comprobar no se marcará nada y el alumno no tendrá de dónde deducirlas.']),
    );
    campoEnlace.value = problema ? '' : enlace();
    campoEnlace.setAttribute('aria-label', reto ? 'Enlace del reto' : 'Enlace del caso');
    botonCopiar.textContent = reto ? 'Copiar enlace del reto' : 'Copiar enlace';
    botonCopiar.disabled = botonSistema.disabled = !!problema;
    nota.textContent = NOTA[modo];
  }
  for (const campo of [pregunta, enunciado.campo, explicacion.campo]) {
    campo.addEventListener('input', () => {
      estado.textContent = '';
      refrescar();
    });
    // Intro no salta de línea: la pregunta, el enunciado y la explicación son de una línea.
    campo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault();
    });
  }
  campoEnlace.addEventListener('focus', () => campoEnlace.select());

  const abierto = () => !panel.hidden || hoja.raiz.open;
  function abrir(si: boolean) {
    estado.textContent = '';
    if (si) refrescar();
    // En el móvil hay menú de compartir del sistema; en la pantalla ancha basta con copiar.
    const movil = MOVIL.matches;
    botonSistema.hidden = !(movil && puedeCompartir);
    botonCopiar.classList.toggle('boton-enlace', !(movil && puedeCompartir));
    botonSistema.classList.toggle('boton-enlace', movil && puedeCompartir);
    campoEnlace.hidden = movil;
    if (si && movil) {
      boton.setAttribute('aria-expanded', 'true');
      hoja.abrir('Compartir o exportar', ...contenido);
      return;
    }
    panel.hidden = !si;
    velo.hidden = !si;
    boton.setAttribute('aria-expanded', String(si));
    if (si) (enReto() ? enunciado.campo : pregunta).focus();
  }
  boton.addEventListener('click', () => abrir(panel.hidden));
  cerrar.addEventListener('click', () => {
    abrir(false);
    boton.focus();
  });
  velo.addEventListener('click', () => abrir(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      abrir(false);
      boton.focus();
    }
  });
  document.addEventListener('pointerdown', (e) => {
    const t = e.target as Node;
    if (!panel.hidden && !panel.contains(t) && !boton.contains(t)) abrir(false);
  });

  botonCopiar.addEventListener('click', async () => {
    const url = enlace();
    campoEnlace.value = url;
    const ok = await copiar(url, campoEnlace);
    if (MOVIL.matches) campoEnlace.hidden = ok;
    estado.textContent = ok ? (enReto() ? 'Enlace del reto copiado.' : 'Enlace copiado.') : 'No se ha podido copiar: selecciona el enlace y cópialo a mano.';
    estado.dataset.ok = String(ok);
  });
  botonSistema.addEventListener('click', async () => {
    const reto = enReto();
    const texto = (reto ? enunciado.campo : pregunta).value.trim();
    try {
      await navigator.share({
        title: reto ? 'Radiostasis · reto' : 'Radiostasis · caso compartido',
        text: texto || (reto ? 'Reto de Radiostasis: deduce las causas' : 'Caso de Radiostasis'),
        url: enlace(),
      });
    } catch {
      // Cancelado por el usuario: no hace falta decir nada.
    }
  });

  return {
    boton,
    raiz: h('div', { class: 'compartir' }, boton, panel, velo, hoja.raiz),
    /** Vuelve a pintar los chips y el enlace si el panel está abierto (al mover un mando). */
    refrescar: () => {
      if (abierto()) refrescar();
    },
  };
}
