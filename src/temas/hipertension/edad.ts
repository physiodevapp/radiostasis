import { biblioteca } from '../../fisiologia';
import { importarRelaciones } from '../../fisiologia/importar';

/**
 * Revisión del nodo edad (17 nov 2026), aprobada por Edu. La persona mayor nota
 * menos la sed y concentra peor la orina: ante la misma falta de agua, repone
 * menos y pierde más por la orina (Phillips 1984, PMID 6472364). La edad refuerza las relaciones 67 (Acceso al agua
 * → Volemia) y 68 (Acceso al agua → Osmolaridad): con la edad a tope, la falta
 * de agua pesa 1,5 veces. Con acceso libre esas relaciones valen 0, así que
 * solo actúa cuando falta agua: la edad sola y los 35 casos no cambian.
 *
 * La sed del simulador no baja con la edad (sube algo, porque la osmolaridad sube
 * más): lo dice la nota 4. Textos revisados por Fable 5.2 (docs/revision-edad-fable.md).
 *
 * Probado y descartado (docs/modelo-v2.1.md, «Revisión del nodo edad…»): atenuar
 * la sed (en el modelo la sed apenas compensa un acceso parcial) y empeorar la
 * natriuresis por presión (con la edad la sistólica ya está cerca del tope).
 *
 * Fase N2: la relación 121 está en la biblioteca común (src/fisiologia/relaciones.ts).
 */
export const relacionesEdad = importarRelaciones(biblioteca, [121]);
