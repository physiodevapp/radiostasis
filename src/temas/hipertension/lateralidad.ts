import { biblioteca } from '../../fisiologia';
import { importarRelaciones } from '../../fisiologia/importar';
import { INTENSIDAD } from '../../motor/tipos';

export { variantesEstenosis } from '../../fisiologia/nodos';

/**
 * Fase 7: lateralidad de la estenosis renal (aprobada por Edu el 17 nov 2026).
 *
 * La estenosis tiene tres variantes. «Bilateral» es la de siempre (casos 5 y 15,
 * reto 9); «riñón único» usa las mismas relaciones, porque solo hay un riñón y
 * está estrecho (es el modelo experimental de un riñón y un clip, PMID 4332626).
 * «Unilateral» cambia tres relaciones: el riñón sano compensa la filtración y
 * expulsa el sodio, mientras el riñón afectado sigue liberando renina.
 */

const { debil: D } = INTENSIDAD;

/** Relación 38 (Estenosis → Perfusión renal): en la unilateral, débil. */
export const intensidad38 = { nodo: 'estenosis', intensidad: { unilateral: D } };

/** Relaciones 119 y 120, de la biblioteca común (src/fisiologia/relaciones.ts), sin cambios. */
export const relacionesLateralidad = importarRelaciones(biblioteca, [119, 120]);
