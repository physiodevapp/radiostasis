import { biblioteca } from '../../fisiologia';
import { importarRelaciones } from '../../fisiologia/importar';
import { relacionesV21 } from '../../fisiologia/relaciones';

/**
 * Las 73 relaciones del modelo v2.1 (docs/modelo-v2.1.md), con las intensidades
 * del documento. Fase N2: están en la biblioteca común
 * (src/fisiologia/relaciones.ts) y la hipertensión las importa sin cambios. Los
 * cambios de estructura (`propuestas.ts`) y los ajustes de la calibración
 * (`calibracion.ts`), que son de este tema, se aplican encima en `index.ts`.
 */
export const relaciones = importarRelaciones(biblioteca, relacionesV21.map((r) => r.n));
