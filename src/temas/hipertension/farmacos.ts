import { biblioteca } from '../../fisiologia';
import { nodosFarmacos as nodosBiblioteca, relacionesFarmacos as relacionesBiblioteca } from '../../fisiologia/farmacos';
import { importarNodos, importarRelaciones } from '../../fisiologia/importar';

/**
 * Fármacos antihipertensivos (fase 4). Fase N2: nodos y relaciones están en la
 * biblioteca común (src/fisiologia/farmacos.ts, con su historia); la
 * hipertensión los importa todos sin cambios.
 */
export const nodosFarmacos = importarNodos(biblioteca, nodosBiblioteca.map((n) => n.id));
export const relacionesFarmacos = importarRelaciones(biblioteca, relacionesBiblioteca.map((r) => r.n));

/** Orden de los mandos de fármacos en la rejilla. */
export const ordenFarmacos = nodosFarmacos.map((n) => n.id);
