import { biblioteca } from '../../fisiologia';
import { nodosEjercicio as nodosBiblioteca, relacionesEjercicio as relacionesBiblioteca } from '../../fisiologia/ejercicio';
import { importarNodos, importarRelaciones } from '../../fisiologia/importar';

/**
 * Ejercicio (fase 5). Fase N2: nodos y relaciones están en la biblioteca común
 * (src/fisiologia/ejercicio.ts, con su historia); la hipertensión los importa
 * todos sin cambios.
 */
export const nodosEjercicio = importarNodos(biblioteca, nodosBiblioteca.map((n) => n.id));
export const relacionesEjercicio = importarRelaciones(biblioteca, relacionesBiblioteca.map((r) => r.n));

/** Mandos de la sesión y del entrenamiento, en el orden de la rejilla. */
export const ordenSesion = ['sesionAerobica', 'sesionFuerza'];
export const ordenEntrenamiento = ['entrenoAerobico', 'entrenoFuerza', 'entrenoIsometrico'];
export const ordenEjercicio = [...ordenSesion, ...ordenEntrenamiento];
