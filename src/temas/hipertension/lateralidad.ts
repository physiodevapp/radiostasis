import { INTENSIDAD, type Relacion, type Variante } from '../../motor/tipos';

/**
 * Fase 7: lateralidad de la estenosis renal (aprobada por Edu el 17 nov 2026).
 *
 * La estenosis tiene tres variantes. «Bilateral» es la de siempre (casos 5 y 15,
 * reto 9); «riñón único» usa las mismas relaciones, porque solo hay un riñón y
 * está estrecho (es el modelo experimental de un riñón y un clip, PMID 4332626).
 * «Unilateral» cambia tres relaciones: el riñón sano compensa la filtración y
 * expulsa el sodio, mientras el riñón afectado sigue liberando renina.
 */
export const variantesEstenosis: Variante[] = [
  { id: 'bilateral', nombre: 'Bilateral', corto: 'bilateral' },
  { id: 'unilateral', nombre: 'Unilateral', corto: 'unilateral' },
  { id: 'unico', nombre: 'Riñón único', corto: 'riñón único' },
];

const { debil: D, moderada: M } = INTENSIDAD;
const UNILATERAL = { nodo: 'estenosis', solo: ['unilateral'] };

/** Relación 38 (Estenosis → Perfusión renal): en la unilateral, débil. */
export const intensidad38 = { nodo: 'estenosis', intensidad: { unilateral: D } };

export const relacionesLateralidad: Relacion[] = [
  {
    n: 119, tipo: 'suma', origen: 'estenosis', destino: 'renina', signo: '+', intensidad: M, tiempo: 'minutos',
    fuente: 'PubMed', variante: UNILATERAL, pmid: ['2652313', '4332626', '16202699'],
    explicacion: 'Solo en la unilateral: el riñón afectado sigue notando poca presión en su arteriola aferente y libera renina, aunque los dos riñones juntos filtren casi lo normal',
  },
  {
    n: 120, tipo: 'suma', origen: 'estenosis', destino: 'reabNa', signo: '-', intensidad: D, tiempo: 'dias',
    fuente: 'PubMed', variante: UNILATERAL, pmid: ['2652313', '4332626'],
    explicacion: 'Solo en la unilateral: el riñón sano, con la presión alta, expulsa el sodio y el volumen no crece',
  },
];
