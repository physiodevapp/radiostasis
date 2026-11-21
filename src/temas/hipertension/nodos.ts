import { biblioteca } from '../../fisiologia';
import { importarNodos } from '../../fisiologia/importar';
import { nodosBase } from '../../fisiologia/nodos';

/**
 * Nodos del modelo v2.1: 12 causas, 17 mecanismos, 6 salidas y 4 de analítica.
 * Fase N2: están en la biblioteca común (src/fisiologia/nodos.ts) y la
 * hipertensión, el primer tema, los importa todos sin cambios.
 */
export const nodos = importarNodos(biblioteca, nodosBase.map((n) => n.id));

/** Panel de analítica: 8 valores, en el orden de la interfaz. */
export const panelAnalitica = ['creatinina', 'natremia', 'osmU', 'potasio', 'osmP', 'diuresis', 'renina', 'aldo'];
