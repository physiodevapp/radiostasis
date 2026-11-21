import { relacionDe } from '../../fisiologia';
import type { Escala, RelacionSuma } from '../../motor/tipos';

/** Relación nueva de la biblioteca común (fase N2: allí está su definición). */
const suma = (n: number) => relacionDe(n) as RelacionSuma;

/**
 * Cambios de ESTRUCTURA propuestos en la calibración del hito 3a y validados por
 * Edu el 14 nov 2026. No son intensidades: sin ellos, algunos resultados de la
 * tabla de casos no se pueden alcanzar con ningún juego de pesos (ver
 * docs/calibracion.md). Se mantienen aparte de relaciones.ts para que se vea
 * qué cambió respecto al documento del modelo v2.1.
 */

export interface CambioTiempo {
  id: string;
  n: number;
  antes: Escala;
  despues: Escala;
  motivo: string;
}

export interface RelacionNueva {
  id: string;
  relacion: RelacionSuma;
  motivo: string;
}

export const cambiosTiempo: CambioTiempo[] = [25, 33, 38, 41].map((n) => ({
  id: 'P1',
  n,
  antes: 'estable' as const,
  despues: 'minutos' as const,
  motivo:
    'La causa actúa desde que existe; la escala de tiempo mide el tiempo desde que aparece. Con «estable», en «días» ' +
    'el tumor, el hiperaldosteronismo y la estenosis no hacían nada, y la tabla pide oliguria en días (casos 5, 7 y 8).',
}));

export interface CambioUmbral {
  id: string;
  n: number;
  antes: number | undefined;
  despues: number;
  motivo: string;
}

export const cambiosUmbral: CambioUmbral[] = [
  {
    id: 'P4',
    n: 37,
    antes: undefined,
    despues: 0.2,
    motivo:
      'La secreción de K depende de la aldosterona y del Na que llega al túbulo distal («paradoja de la aldosterona»): ' +
      'con aldosterona alta secundaria a volumen bajo llega poco Na y el K no cae. Sin umbral, el K ↓↓ del ' +
      'hiperaldosteronismo (caso 8) arrastra a ↓ el K de los casos 3, 9, 11 y 12, que deben quedar en «=». Mismo ' +
      'recurso que las relaciones 45 y 66.',
  },
];

export const relacionesNuevas: RelacionNueva[] = [
  {
    id: 'P2',
    relacion: suma(75),
    motivo:
      'Caso 4 (SIADH, D1): con la ADH fija, la diuresis solo vuelve a «=» con volemia «=» si el riñón deja de responder ' +
      'a la ADH. El documento ya cita la «pérdida de respuesta a la ADH»; faltaba la relación. Solo actúa por encima de 0.',
  },
  {
    id: 'P3',
    relacion: suma(76),
    motivo:
      'Casos 11 y 12 sin agua: la creatinina solo sube si la TFG baja de −0,45, y la única vía era la PAM (39, débil) ' +
      'contra la angiotensina II, que sostiene la TFG (74). Solo actúa por debajo de 0 (revisión fisiológica): por ' +
      'encima, la autorregulación renal impide que el volumen alto haga hiperfiltrar.',
  },
  {
    id: 'P5',
    relacion: suma(77),
    motivo:
      'Revisión fisiológica (hallazgo 4): sin ella la deshidratación no daba taquicardia ni activación simpática, porque ' +
      'el barorreflejo (65) no actúa en estado estable. Solo actúa con volemia por debajo de −0,4 (revisión P5/48): sin ' +
      'umbral se encendía con hipovolemias leves y su bucle con el riñón vaciaba la volemia. El umbral es un recurso del ' +
      'modelo (el simpático real sube antes): representa que el reflejo no se nota hasta un déficit moderado.',
  },
  {
    id: 'P6',
    relacion: suma(78),
    motivo:
      'Caso 13 (hito 3e, aprobado por Edu y revisado por Fable 5.2, docs/revision-hipotiroidismo-3e.md): sin ella la sistólica del hipotiroidismo ' +
      'salía −0,46, casi ↓↓, y en el paciente real suele ser normal. Con intensidades no basta: al bajar más el gasto, ' +
      'la diuresis del caso 13 se sale de lo esperado. Solo actúa hacia el hipotiroidismo; el hipertiroidismo no cambia.',
  },
  // Fase 4 (fármacos), aprobadas por Edu el 16 nov 2026.
  {
    id: 'F4-1',
    relacion: suma(79),
    motivo:
      'Aplazada a la fase 4 en el modelo v2.1: explica por qué un betabloqueante sin alfabloqueante empeora el ' +
      'feocromocitoma (queda la vasoconstricción α sin la dilatación β2). La 53 sube de 0,557 a 0,857 para que, sin ' +
      'fármacos, la RVP neta por el simpático sea la misma: ningún caso cambia.',
  },
  {
    id: 'F4-2',
    relacion: suma(81),
    motivo:
      'Sin ella la espironolactona y los IECA no subían el potasio: la 37 solo actúa por encima de 0,2. Solo actúa por ' +
      'debajo de −0,3, así que no cambia ningún caso básico (con la dieta alta en sal la aldosterona baja menos). ' +
      'La relación 80 (angiotensina II → renina, asa corta) no se añade: la renina ya sube con IECA y ARA-II por la ' +
      'presión y el volumen, y con ella fallaban los casos 2 y 4.',
  },
];
