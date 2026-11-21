import type { Tema } from '../tema';
import { hipertension } from './index';
import { ordenEntrenamiento, ordenSesion } from './ejercicio';
import { ordenFarmacos } from './farmacos';
import { fichas } from './fichas';
import { panelAnalitica } from './nodos';
import { retos } from './retos';
import { terminos } from './terminos';
import { notaValores, valoresOrientativos } from './valores';
import {
  capasVaso, casosConRetencion, determinantes, evitaEnPista, farmacosVista, fuentes, gruposClavesReto,
  gruposMecanismos, nombreAnalitica, nombreCorto, notaRetencion, ordenCausas, propiedadesVaso, queMirar,
} from './vista';

/** El tema de hipertensión en el registro de temas (fase N2). Es el tema por defecto. */
export const temaHipertension: Tema = {
  id: 'hipertension',
  nombre: hipertension.nombre,
  modelo: hipertension,
  fichas,
  vista: {
    fuentes, nombreCorto, farmacosVista, nombreAnalitica, gruposMecanismos, determinantes, evitaEnPista,
    gruposClavesReto, propiedadesVaso, queMirar, notaRetencion, casosConRetencion, capasVaso,
  },
  panelAnalitica,
  valores: { orientativos: valoresOrientativos, nota: notaValores },
  retos,
  terminos,
  mandos: { causas: ordenCausas, farmacos: ordenFarmacos, sesion: ordenSesion, entrenamiento: ordenEntrenamiento },
};
