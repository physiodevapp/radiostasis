import { temaHipertension } from './hipertension/tema';
import type { Tema } from './tema';

/**
 * Temas del simulador (fase N2). Un satélite, varios temas: la dirección elige
 * el tema con `#t=<id>` (P8, aprobada por Edu). Sin `t=`, o con un tema que no
 * existe, se abre el tema por defecto: la hipertensión, como siempre.
 */
export const temas: readonly Tema[] = [temaHipertension];

export const TEMA_POR_DEFECTO = temaHipertension;

/** Tema por su id; el tema por defecto si no existe. */
export const temaPorId = (id: string | null | undefined): Tema => temas.find((t) => t.id === id) ?? TEMA_POR_DEFECTO;

/**
 * Clave de lo que se guarda en el dispositivo para un tema (M10). La
 * hipertensión conserva las claves de siempre («radiostasis-valores»), para no
 * perder lo que ya tienen guardado sus usuarios; los demás temas llevan su id
 * («radiostasis-natremia-valores»).
 */
export const claveDelTema = (tema: string, nombre: string): string =>
  tema === TEMA_POR_DEFECTO.id ? `radiostasis-${nombre}` : `radiostasis-${tema}-${nombre}`;
