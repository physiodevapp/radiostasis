import type { Nodo, Relacion, RelacionBloquea, RelacionSuma } from '../../motor/tipos';

/**
 * Fármacos antihipertensivos (fase 4). Cada fármaco es un nodo con su rueda de
 * dosis (0 = sin, 1 = dosis plena) y actúa de dos maneras:
 * - bloqueando relaciones del modelo (`bloquea`): IECA, ARA-II, betabloqueante,
 *   alfabloqueante y espironolactona;
 * - moviendo un nodo como una relación más (`suma`): diuréticos y calcioantagonista.
 *
 * Alcance, relaciones y fracciones aprobados por Edu el 16 nov 2026. Las
 * fracciones con la dosis plena (`maximo`) y las intensidades de los efectos se
 * ajustaron para que pasen los casos de fármacos (casos.ts, del 15 en adelante).
 * Revisión de Fable 5.2 (16 nov 2026): potasio de los diuréticos al revés que
 * antes (la tiazida lo baja más que el asa) y relaciones 92 y 93 del
 * calcioantagonista.
 */

const farmaco = (id: string, codigo: string, nombre: string, explicacion: string): Nodo => ({
  id, codigo, nombre, tipo: 'farmaco', calculo: 'entrada', rango: [0, 1], etiquetas: ['sin', 'dosis plena'], explicacion,
});

export const nodosFarmacos: Nodo[] = [
  farmaco('ieca', 'F1', 'IECA', 'Inhibidor de la enzima convertidora de angiotensina (enalapril, ramipril…).'),
  farmaco('ara2', 'F2', 'ARA-II', 'Antagonista del receptor AT1 de la angiotensina II (losartán, valsartán…).'),
  farmaco('betabloqueante', 'F3', 'Betabloqueante', 'Bloquea los receptores β1 y β2 (no selectivo, como el propranolol).'),
  farmaco('alfabloqueante', 'F4', 'Alfabloqueante', 'Bloquea los receptores α1 de las arteriolas (doxazosina, prazosina). En el feocromocitoma se usa también la fenoxibenzamina, que bloquea los α1 y los α2.'),
  farmaco('tiazida', 'F5', 'Tiazida', 'Diurético tiazídico (hidroclorotiazida, clortalidona, indapamida).'),
  farmaco('diureticoAsa', 'F6', 'Diurético de asa', 'Furosemida o torasemida.'),
  farmaco('espironolactona', 'F7', 'Espironolactona', 'Antagonista del receptor mineralocorticoide (también eplerenona).'),
  farmaco('calcioantagonista', 'F8', 'Calcioantagonista', 'Calcioantagonista dihidropiridínico (amlodipino, nifedipino).'),
];

/** Orden de los mandos de fármacos en la rejilla. */
export const ordenFarmacos = nodosFarmacos.map((n) => n.id);

function bloquea(n: number, origen: string, destino: string, relaciones: number[], maximo: number, explicacion: string, pmid: string[]): RelacionBloquea {
  return { n, tipo: 'bloquea', origen, destino, relaciones, maximo, fuente: 'PubMed', pmid, explicacion };
}

function efecto(n: number, origen: string, destino: string, intensidad: number, tiempo: RelacionSuma['tiempo'], explicacion: string, pmid: string[]): RelacionSuma {
  return { n, tipo: 'suma', origen, destino, signo: '-', intensidad, tiempo, fuente: 'PubMed', pmid, explicacion };
}

export const relacionesFarmacos: Relacion[] = [
  // Efectos directos sobre un nodo.
  efecto(82, 'tiazida', 'reabNa', 0.4, 'minutos', 'Bloquea el cotransportador Na-Cl del túbulo distal', ['36998989']),
  efecto(83, 'tiazida', 'potasio', 0.4, 'dias', 'Llega más Na al colector y se secreta más K', ['29540487', '7388366']),
  efecto(84, 'diureticoAsa', 'reabNa', 0.8, 'minutos', 'Bloquea el cotransportador Na-K-2Cl del asa de Henle: el diurético más potente', ['29141174']),
  efecto(85, 'diureticoAsa', 'potasio', 0.3, 'dias', 'Llega mucho Na al colector y se secreta más K', ['29540487', '7388366']),
  efecto(86, 'calcioantagonista', 'rvp', 0.5, 'minutos', 'Cierra los canales de calcio del músculo liso de las arteriolas: se dilatan', ['21896151', '16398057']),
  // Revisión de Fable 5.2 (docs/revision-fase-4-fable.md, cambios 1 y 2), aprobada por Edu el 16 nov 2026.
  efecto(92, 'calcioantagonista', 'reabNa', 0.2, 'dias', 'Algo natriurético: no hace retener sodio como otros vasodilatadores', ['1614068', '8268889']),
  efecto(93, 'calcioantagonista', 'pas', 0.25, 'minutos', 'Al dilatar las arterias baja la onda reflejada y, con ella, la sistólica', ['15911742', '16476843']),

  // Bloqueos.
  bloquea(87, 'ieca', 'angII', [26], 0.35, 'Inhibe la enzima convertidora: se forma menos angiotensina II', ['37284934', '9577953']),
  bloquea(88, 'ara2', 'angII', [27, 28, 29, 30, 31, 32, 74], 0.35,
    'Bloquea el receptor AT1: la angiotensina II está alta, pero no actúa', ['10082498', '20395378']),
  bloquea(89, 'betabloqueante', 'simpatico', [23, 51, 52, 79], 0.4,
    'Bloquea los receptores β1 (corazón y renina) y β2 (vasodilatación del músculo)', ['39229379', '37313725']),
  bloquea(90, 'alfabloqueante', 'simpatico', [53], 0.5, 'Bloquea los receptores α1 de las arteriolas', ['39229379', '22895943']),
  bloquea(91, 'espironolactona', 'mineralo', [34, 35], 0.6,
    'Ocupa el receptor mineralocorticoide: ni la aldosterona ni el cortisol (regaliz) lo activan', ['27057293', '29540487']),
];
