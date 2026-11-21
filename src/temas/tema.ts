import type { Modelo, Reto } from '../motor/tipos';
import type { ValorOrientativo } from '../motor/valores';
import type { Fichas } from './fichas';

/**
 * Registro de temas en la interfaz (fase N2, punto 8 de «Qué necesita el motor»
 * en docs/natremia/propuesta-modelo.md). Un tema reúne todo lo que la interfaz
 * necesita de él: el modelo (datos del motor), las fichas, la vista, el panel de
 * analítica, los valores orientativos, los retos, los términos enlazados y el
 * orden de los mandos. Son datos: la interfaz no conoce ningún tema por su nombre.
 */
export interface Tema {
  /** Id del tema; va en la dirección (`#t=…`) salvo en el tema por defecto. */
  id: string;
  /** Nombre corto del tema («Tensión arterial»). */
  nombre: string;
  modelo: Modelo;
  fichas: Fichas;
  vista: VistaTema;
  /** Valores del panel de analítica, en el orden de la interfaz. */
  panelAnalitica: string[];
  /** Valores orientativos (fase 6, punto 5) y su nota. */
  valores: { orientativos: Record<string, ValorOrientativo>; nota: string };
  retos: Reto[];
  /** Enlaces internos de las fichas: nodo → palabras que lo enlazan. */
  terminos: Record<string, string[]>;
  /** Orden de los mandos en sus rejillas. */
  mandos: {
    causas: string[];
    farmacos: string[];
    /** Mandos de la sesión de ejercicio (minutos). */
    sesion: string[];
    /** Mandos del entrenamiento (meses). */
    entrenamiento: string[];
  };
}

/**
 * Vista del tema: textos y agrupaciones que pinta la interfaz. La de la
 * hipertensión dibuja vasos (arteria grande y arteriola); otro tema tendrá la
 * suya (fase N4 de la natremia: compartimentos y célula del cerebro).
 */
export interface VistaTema {
  /** Línea de fuentes del pie. */
  fuentes: string;
  /** Nombre corto de los nodos para las placas (con guiones blandos). */
  nombreCorto: Record<string, string>;
  /** Pastilla e insignia de cada fármaco. */
  farmacosVista: Record<string, { pastilla: string; insignia: string }>;
  /** Nombre de algunos valores en el panel de analítica. */
  nombreAnalitica: Record<string, string>;
  /** Grupos del panel de mecanismos. */
  gruposMecanismos: { nombre: string; nodos: string[] }[];
  /** Determinantes de la presión (o de la salida principal del tema). */
  determinantes: string[];
  /** Valores que la pista automática de un reto no nombra (se llaman como una causa). */
  evitaEnPista: string[];
  /** Grupos de las claves automáticas de un reto del profesor. */
  gruposClavesReto: string[][];
  /** Propiedades del vaso y el nodo que las mueve. */
  propiedadesVaso: { propiedad: string; nodo: string; texto: string }[];
  /** «Qué mirar» de cada caso (por número de caso). */
  queMirar: Record<number, string>;
  /** Nota de los casos con fase de retención, y cuáles son. */
  notaRetencion: string;
  casosConRetencion: number[];
  /** Capas de la pared de los vasos. */
  capasVaso: { id: string; vaso: 'arteria' | 'arteriola'; nombre: string; texto: string }[];
}
