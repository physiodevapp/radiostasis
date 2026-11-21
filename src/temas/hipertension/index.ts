import { filtrarReferencias } from '../../fisiologia/importar';
import { aplicarAjustes } from '../../motor/ajustes';
import type { Modelo, Relacion } from '../../motor/tipos';
import { avisos } from './avisos';
import { ajustes } from './calibracion';
import { casos } from './casos';
import { nodosEjercicio, relacionesEjercicio } from './ejercicio';
import { nodosFarmacos, relacionesFarmacos } from './farmacos';
import { intensidad38, relacionesLateralidad } from './lateralidad';
import { nodos } from './nodos';
import { relacionesEdad } from './edad';
import { cambiosTiempo, cambiosUmbral, relacionesNuevas } from './propuestas';
import { relaciones } from './relaciones';

/**
 * Tema de hipertensión. Fase N2: los nodos y las relaciones están en la
 * biblioteca común (src/fisiologia/) y este tema los importa. Lo propio del tema
 * se aplica encima: los cambios de estructura (`propuestas.ts`: escalas y
 * umbrales), la calibración (`calibracion.ts`, con `aplicarAjustes`), la
 * variante de la 38 (`lateralidad.ts`), los parámetros del motor y los casos.
 */
export { aplicarAjustes };

/** Relaciones del documento con los cambios de estructura propuestos (sin calibrar). */
export const relacionesPropuestas: Relacion[] = [
  ...relaciones.map((r) => {
    const tiempo = cambiosTiempo.find((c) => c.n === r.n);
    const umbral = cambiosUmbral.find((c) => c.n === r.n);
    if (!tiempo && !umbral) return r;
    if (r.tipo !== 'suma') throw new Error(`Propuesta sobre la relación ${r.n}, que no es de suma`);
    const copia = { ...r };
    if (tiempo) {
      if (r.tiempo !== tiempo.antes) throw new Error(`Propuesta ${tiempo.id}: relación ${r.n} no coincide`);
      copia.tiempo = tiempo.despues;
    }
    if (umbral) {
      if (r.umbral !== umbral.antes) throw new Error(`Propuesta ${umbral.id}: relación ${r.n} no coincide`);
      copia.umbral = umbral.despues;
    }
    return copia;
  }),
  ...relacionesNuevas.map((p) => p.relacion),
];

/**
 * Fase 7: la 38 cambia de peso en la estenosis unilateral y se añaden la 119 y la 120. Revisión del nodo edad: la 121.
 * Fase N2 (M2): las listas de `modula` y `bloquea` se quedan con las relaciones del tema (aquí están todas).
 */
function conLateralidad(lista: Relacion[]): Relacion[] {
  return filtrarReferencias([...lista.map((r) => (r.n === 38 ? { ...r, variante: intensidad38 } : r)), ...relacionesLateralidad, ...relacionesEdad]);
}

export const parametros = {
  amortiguacion: 0.3,
  paso: 0.02,
  horizonteDias: 1,
  tolerancia: 1e-6,
  maxIteraciones: 200000,
};

export const hipertension: Modelo = {
  id: 'hipertension',
  nombre: 'Tensión arterial',
  nodos: [...nodos, ...nodosFarmacos, ...nodosEjercicio],
  relaciones: conLateralidad([...aplicarAjustes(relacionesPropuestas, ajustes), ...relacionesFarmacos, ...relacionesEjercicio]),
  casos,
  parametros,
  avisos,
};

/** Modelo con las propuestas de estructura, sin calibrar (punto de partida de la calibración). */
export const hipertensionSinCalibrar: Modelo = { ...hipertension, relaciones: conLateralidad([...relacionesPropuestas, ...relacionesFarmacos, ...relacionesEjercicio]) };

/** Modelo tal como está en docs/modelo-v2.1.md: sin propuestas ni calibración. */
export const hipertensionDocumento: Modelo = { ...hipertension, relaciones };
