/**
 * Scripts por tema (fase N2, punto 10 de «Qué necesita el motor»). Cada script
 * de documentos recibe el tema como primer argumento:
 *
 *   npm run fuentes -- natremia
 *   npm run calibrar -- natremia --lambda 0.02
 *
 * Sin argumento, la hipertensión, que escribe sus documentos donde siempre. Lo
 * que solo necesitan los scripts (rutas, modelo sin calibrar…) va aquí y no en
 * el registro de temas, para no meterlo en la aplicación.
 */
import { relacionesV21 } from '../src/fisiologia/relaciones';
import type { Modelo } from '../src/motor/tipos';
import { hipertensionSinCalibrar } from '../src/temas/hipertension';
import { TEMA_POR_DEFECTO, temas } from '../src/temas/registro';
import type { Tema } from '../src/temas/tema';

export interface TemaScripts {
  tema: Tema;
  /** Modelo sin calibrar: punto de partida de `npm run calibrar`. */
  sinCalibrar: Modelo;
  /** Documentos generados, desde la raíz del repositorio. */
  documentos: { fuentes: string; fichas: string; retos: string };
  /** Archivos de datos que se citan en los documentos. */
  datos: { fichas: string; vista: string; retos: string; avisos: string; casos: string };
  /** Relaciones del documento del modelo; las demás salen en «añadidas después». Sin él, una sola tabla. */
  relacionesDocumento?: ReadonlySet<number>;
}

const CONFIGURACION: Record<string, Omit<TemaScripts, 'tema'>> = {
  hipertension: {
    sinCalibrar: hipertensionSinCalibrar,
    documentos: { fuentes: 'docs/fuentes.md', fichas: 'docs/revision-fichas-3d.md', retos: 'docs/retos.md' },
    datos: {
      fichas: 'src/temas/hipertension/fichas.ts',
      vista: 'src/temas/hipertension/vista.ts',
      retos: 'src/temas/hipertension/retos.ts',
      avisos: 'src/temas/hipertension/avisos.ts',
      casos: 'src/temas/hipertension/casos.ts',
    },
    relacionesDocumento: new Set(relacionesV21.map((r) => r.n)),
  },
};

/** Rutas por defecto de un tema nuevo: sus documentos en docs/<tema>/ y sus datos en src/temas/<tema>/. */
const porDefecto = (id: string): Omit<TemaScripts, 'tema' | 'sinCalibrar'> => ({
  documentos: { fuentes: `docs/${id}/fuentes.md`, fichas: `docs/${id}/revision-fichas.md`, retos: `docs/${id}/retos.md` },
  datos: {
    fichas: `src/temas/${id}/fichas.ts`,
    vista: `src/temas/${id}/vista.ts`,
    retos: `src/temas/${id}/retos.ts`,
    avisos: `src/temas/${id}/avisos.ts`,
    casos: `src/temas/${id}/casos.ts`,
  },
});

/** Tema del primer argumento (si no empieza por «--»); sin él, el tema por defecto. Sale con error si no existe. */
export function temaDelScript(argv: readonly string[] = process.argv.slice(2)): TemaScripts {
  const id = argv[0] && !argv[0].startsWith('--') ? argv[0] : TEMA_POR_DEFECTO.id;
  const tema = temas.find((t) => t.id === id);
  if (!tema) {
    console.error(`Tema desconocido «${id}». Temas: ${temas.map((t) => t.id).join(', ')}.`);
    process.exit(1);
  }
  const c = CONFIGURACION[id];
  return { tema, ...porDefecto(id), ...(c ?? { sinCalibrar: tema.modelo }) };
}

/** URL de un archivo del repositorio para escribirlo (la ruta, desde la raíz). */
export const rutaRepositorio = (ruta: string) => new URL(`../${ruta}`, import.meta.url);
