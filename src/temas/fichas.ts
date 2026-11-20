/**
 * Textos docentes de las fichas (hito 3d). Es un tipo genérico: cada tema
 * escribe sus fichas como datos, separados del motor y de la vista.
 */

export interface FichaNodo {
  /** Qué es: una o dos frases. */
  queEs: string;
  /** Qué hace: de dos a cuatro frases. */
  queHace: string;
  /** «En este caso», escrito a mano para los casos en que el nodo importa (por número de caso). */
  enCaso?: Record<number, string>;
  /** Aviso: un matiz clínico, un error frecuente o un límite del modelo. */
  aviso?: string;
  /** Animación del mecanismo celular (id del registro de animaciones de la vista). */
  animacion?: string;
  /** Muestra el botón «Ver las capas en el vaso». */
  capas?: boolean;
  /** Fármacos (fase 4): lo que importa en la consulta de fisioterapia. */
  consulta?: string;
}

export type Fichas = Record<string, FichaNodo>;
