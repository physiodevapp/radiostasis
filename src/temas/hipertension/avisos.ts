import type { AvisosTema } from '../../motor/tipos';
import { panelAnalitica } from './nodos';

/**
 * Avisos de realismo del tema (docs/modelo-v2.1.md, «Avisos de realismo»;
 * docs/diseno.md). Los textos se revisan con Fable 5.2.
 */
export const avisos: AvisosTema = {
  // Revisión de Fable 5.2 (docs/revision-avisos-3e-fable.md): «causa rara» para
  // que concuerde con nombres masculinos («tumor», «feocromocitoma»).
  queMideFrecuencia: 'Frecuencia con que se ve en la práctica clínica.',
  frecuencia: {
    poco_frecuente: { pastilla: 'poco frecuente', chip: 'causa poco frecuente', plural: 'causas poco frecuentes' },
    rara: { pastilla: 'causa rara', chip: 'causa rara', plural: 'causas raras' },
  },
  // Fase 7: la estenosis es bilateral si no se elige otra variante (la primera de su nodo).
  variantesPorDefecto: { estenosis: 'bilateral' },
  // El mismo umbral que separa «=» de una flecha: un mando apenas girado no cuenta.
  causaActiva: 0.15,
  hipotetica: {
    titulo: 'Combinación hipotética',
    texto: 'Es muy improbable que estas causas coincidan en un mismo paciente. Sirve para ver cómo interactúan los mecanismos, no como caso clínico.',
    minRaras: 2,
    minNoComunes: 3,
  },
  // Fase 4: interacciones de los fármacos. Revisadas por Fable 5.2 (docs/revision-fase-4-fable.md).
  interacciones: [
    {
      id: 'estenosis-sraa', nivel: 'contraindicado', titulo: 'Contraindicado',
      texto: 'IECA o ARA-II en la estenosis renal bilateral (o de un riñón único): la filtración se sostenía porque la angiotensina II contraía la arteriola eferente. Sin ese apoyo, y con menos presión, se hunde: suben la creatinina y el potasio.',
      todas: ['estenosis'], alguna: ['ieca', 'ara2'],
      variantes: { estenosis: ['bilateral', 'unico'] },
    },
    {
      id: 'estenosis-unilateral-sraa', nivel: 'precaucion', titulo: 'Vigilar la creatinina',
      texto: 'IECA o ARA-II en la estenosis renal unilateral: controlan bien esta hipertensión, que depende de la renina. La filtración baja algo, pero el riñón sano sostiene la creatinina. Se piden creatinina y potasio antes de empezar y a las pocas semanas: si suben mucho, la estenosis puede ser de las dos arterias. Con el ARA-II el modelo exagera la caída.',
      todas: ['estenosis'], alguna: ['ieca', 'ara2'],
      variantes: { estenosis: ['unilateral'] },
    },
    {
      id: 'feo-beta', nivel: 'contraindicado', titulo: 'Contraindicado',
      texto: 'Betabloqueante sin alfabloqueante en el feocromocitoma: la vasoconstricción α1 queda sin oposición y puede desencadenar una crisis hipertensiva. El modelo no la reproduce: la RVP sigue muy alta, pero la sistólica baja porque cae el gasto. Primero el alfabloqueante y después el betabloqueante.',
      todas: ['feo', 'betabloqueante'], ninguna: ['alfabloqueante'],
    },
    {
      id: 'doble-bloqueo', nivel: 'contraindicado', titulo: 'No se asocian',
      texto: 'IECA y ARA-II juntos (doble bloqueo del sistema renina-angiotensina): no protegen más el corazón ni el riñón y aumentan el riesgo de hiperpotasemia, hipotensión y fallo renal agudo.',
      todas: ['ieca', 'ara2'],
    },
    {
      id: 'potasio', nivel: 'precaucion', titulo: 'Vigilar el potasio',
      texto: 'Espironolactona con IECA o ARA-II: los dos retienen potasio, y más si la filtración es baja. Se asocian (por ejemplo, en la insuficiencia cardíaca o en la hipertensión resistente), pero con analíticas de control.',
      todas: ['espironolactona'], alguna: ['ieca', 'ara2'],
    },
    {
      // Propuesta de Fable 5.2 (corrección 38), aprobada por Edu el 16 nov 2026.
      id: 'deshidratacion', nivel: 'precaucion', titulo: 'Cuidado con la deshidratación',
      texto: 'Sin agua, el riñón depende de la angiotensina II para filtrar y el diurético sigue sacando volumen: la presión cae y la filtración se hunde. Es lo que pasa con el calor, los vómitos o un esfuerzo largo sin beber.',
      todas: ['accesoAgua'], alguna: ['ieca', 'ara2', 'tiazida', 'diureticoAsa', 'espironolactona'],
    },
    // Fase 5: ejercicio. Solo saltan durante la sesión o al terminar (salvo el del
    // entrenamiento con feocromocitoma). Revisados por Fable 5.2 (docs/revision-fase-5-fable.md).
    {
      id: 'ejercicio-feo', nivel: 'contraindicado', titulo: 'No hacer ejercicio intenso',
      texto: 'Feocromocitoma sin tratar: el esfuerzo suma más actividad simpática a la de las catecolaminas del tumor y puede desencadenar una crisis hipertensiva. El modelo no la reproduce: la sistólica ya estaba cerca del tope. Hasta que esté tratado, solo actividad suave.',
      todas: ['feo'], alguna: ['sesionAerobica', 'sesionFuerza'], momentos: ['durante'],
    },
    {
      // Corrección 30 de Fable 5.2: el modelo no distingue el origen del exceso simpático.
      id: 'entreno-feo', nivel: 'precaucion', titulo: 'El entrenamiento no trata el tumor',
      texto: 'En el modelo el entrenamiento atenúa el exceso de actividad simpática y baja la frecuencia y la presión del feocromocitoma. En el paciente no: las catecolaminas salen del tumor. Hasta tratarlo, solo actividad suave.',
      todas: ['feo'], alguna: ['entrenoAerobico', 'entrenoFuerza', 'entrenoIsometrico'],
    },
    {
      id: 'ejercicio-tiroides', nivel: 'precaucion', titulo: 'Tiroides sin controlar',
      texto: 'En el hipertiroidismo la frecuencia ya está alta en reposo y llega pronto al tope; en el hipotiroidismo la tolerancia al esfuerzo es baja. Hasta que esté controlado, ejercicio suave, vigilando la frecuencia. Palpitaciones o pulso irregular: parar y avisar al médico.',
      todas: ['tiroides'], alguna: ['sesionAerobica', 'sesionFuerza'], momentos: ['durante'],
    },
    {
      id: 'ejercicio-beta', nivel: 'precaucion', titulo: 'Dosificar con la escala de Borg',
      texto: 'Con betabloqueante la frecuencia es más baja en reposo y en el esfuerzo: las frecuencias diana por edad no valen. Mejor la escala de esfuerzo percibido (Borg) o el test del habla.',
      todas: ['betabloqueante'], alguna: ['sesionAerobica', 'sesionFuerza'], momentos: ['durante'],
    },
    {
      id: 'ejercicio-alfa', nivel: 'precaucion', titulo: 'Cuidado al levantarse',
      texto: 'Alfabloqueante al terminar el ejercicio: después de la sesión la presión baja, y con el fármaco los vasos se contraen peor al ponerse de pie. Vuelta a la calma larga, sin pararse de golpe, y levantarse despacio. El modelo no tiene postura: tras la sesión aeróbica se ve la RVP por debajo de lo normal, pero el mareo no se ve.',
      todas: ['alfabloqueante'], alguna: ['sesionAerobica', 'sesionFuerza'], momentos: ['despues'],
    },
    {
      id: 'ejercicio-deshidratacion', nivel: 'precaucion', titulo: 'Hidratación y calor',
      texto: 'Con un diurético, o sin poder beber, el sudor de un esfuerzo largo o con calor saca todavía más volumen: mareo, calambres y riesgo de golpe de calor. Beber durante la sesión y evitar las horas de calor.',
      todas: [], alguna: ['tiazida', 'diureticoAsa', 'espironolactona', 'accesoAgua'], momentos: ['durante', 'despues'],
      requiere: ['sesionAerobica', 'sesionFuerza'],
    },
    {
      id: 'ejercicio-valsalva', nivel: 'precaucion', titulo: 'Respirar durante el esfuerzo',
      texto: 'Con cargas altas, bloquear la respiración (maniobra de Valsalva) dispara las dos presiones. En el hipertenso, cargas moderadas, más repeticiones y soltar el aire en el esfuerzo.',
      todas: ['sesionFuerza'], momentos: ['durante'],
    },
  ],
  // Fase 6: notas de interacción entre causas activas (docs/notas-interaccion.md,
  // con lo que muestra el modelo y las fuentes). Revisadas por Fable 5.2 (docs/revision-fase-6-fable.md).
  // Si el modelo no reproduce la interacción, la nota lo dice.
  notas: [
    {
      id: 'edad-factores', nivel: 'nota', titulo: 'Rigidez y placa se suman',
      texto: 'Con la edad la aorta se vuelve rígida, y los factores de riesgo añaden placa y más rigidez. La sistólica sube más, la diastólica baja y la presión de pulso se ensancha: es la hipertensión sistólica aislada típica de la persona mayor.',
      todas: ['edad', 'factores'],
      fuentes: ['PMID 31466622 · doi:10.1016/j.jacc.2019.07.012', 'PMID 16687971 · doi:10.1111/j.1076-7460.2006.04794.x'],
    },
    {
      id: 'edad-hipertiroidismo', nivel: 'nota', titulo: 'Hipertiroidismo con la aorta rígida',
      texto: 'El hipertiroidismo sube el gasto cardíaco y dilata las arteriolas. Con la aorta rígida de la edad, la sangre de más que sale en cada latido no se amortigua: la sistólica sube mucho más que en una persona joven y la diastólica baja.',
      todas: ['edad', 'tiroides'], signo: { tiroides: 1 },
      fuentes: ['PMID 18752767 · doi:10.1007/s11897-008-0026-9', 'PMID 31466622 · doi:10.1016/j.jacc.2019.07.012'],
    },
    {
      id: 'edad-sal', nivel: 'nota', titulo: 'Más sensible a la sal',
      texto: 'Con la edad el riñón elimina peor el exceso de sodio, así que la misma sal sube más la presión que en una persona joven. El modelo suma los dos efectos, pero no recoge esta mayor sensibilidad.',
      todas: ['edad', 'sal'], signo: { sal: 1 },
      fuentes: ['PMID 38545804 · doi:10.1161/HYPERTENSIONAHA.123.21369', 'PMID 27757935 · doi:10.1007/5584_2016_147'],
    },
    {
      id: 'edad-agua', nivel: 'nota', titulo: 'Menos sed con la edad',
      texto: 'La persona mayor nota menos la sed y concentra peor la orina. Si falta agua o hace falta más (calor, esfuerzo, fiebre), bebe menos de lo que pierde y se deshidrata antes. El modelo no le baja la sed: hace que la misma falta de agua suba más la natremia.',
      todas: ['edad', 'accesoAgua'],
      fuentes: ['PMID 11528342 · doi:10.1097/00005768-200109000-00016', 'PMID 9050029 · doi:10.1093/ndt/11.supp9.9', 'PMID 6472364 · doi:10.1056/NEJM198409203111202'],
    },
    {
      id: 'estenosis-aterosclerosis', nivel: 'nota', titulo: 'Estenosis aterosclerótica',
      texto: 'En la persona mayor o con factores de riesgo, la estenosis de la arteria renal suele ser aterosclerótica y a veces bilateral. Se sospecha si la presión se descontrola deprisa, se resiste al tratamiento o la creatinina sube al empezar un IECA o un ARA-II.',
      todas: ['estenosis'], alguna: ['edad', 'factores'],
      fuentes: ['PMID 29094913', 'PMID 16251847 · doi:10.1097/01.hjh.0000192096.83302.02'],
    },
    {
      id: 'mineralocorticoide-sal-alta', nivel: 'nota', titulo: 'Aldosterona y sal se potencian',
      texto: 'La aldosterona (o el regaliz) retiene sodio, pero necesita sodio que retener: con mucha sal, la volemia y la presión suben bastante más. Por eso se reduce la sal. En el paciente, además, con más sal se pierde más potasio; el modelo no lo recoge.',
      todas: ['sal'], alguna: ['hiperaldo', 'regaliz'], signo: { sal: 1 },
      fuentes: ['PMID 36945842 · doi:10.1111/joim.13618', 'PMID 20706195 · doi:10.1038/ajh.2010.169'],
    },
    {
      id: 'mineralocorticoide-sal-baja', nivel: 'nota', titulo: 'Con poca sal, menos efecto',
      texto: 'Con poca sal, el exceso de aldosterona (o el regaliz) apenas sube la presión: hay poco sodio que retener. En el paciente también se pierde menos potasio, porque llega menos sodio al final del túbulo; el modelo no lo distingue y lo muestra igual de bajo.',
      todas: ['sal'], alguna: ['hiperaldo', 'regaliz'], signo: { sal: -1 },
      fuentes: ['PMID 31863347 · doi:10.1007/s42000-019-00167-9', 'PMID 37089096'],
    },
    {
      id: 'filtracion-sal', nivel: 'nota', titulo: 'Riñón enfermo, presión sensible a la sal',
      texto: 'Con menos filtración, el riñón elimina peor el exceso de sal: la volemia y la presión suben más que con cada causa por separado. En la enfermedad renal crónica, reducir la sal baja la presión y refuerza el efecto de los IECA y los ARA-II.',
      todas: ['caidaFiltracion', 'sal'], signo: { sal: 1 },
      fuentes: ['PMID 32635265 · doi:10.3390/ijms21134744'],
    },
    {
      id: 'diabetes-insipida-agua', nivel: 'nota', titulo: 'La sed compensa la diabetes insípida',
      texto: 'Mientras haya agua, la sed repone buena parte de lo que se pierde por la orina y la creatinina se mantiene normal. Sin agua (o sin sed), la pérdida sigue: el sodio sube mucho, la volemia cae y sube la creatinina.',
      todas: ['adhAutonoma', 'accesoAgua'], signo: { adhAutonoma: -1 },
      fuentes: ['PMID 35771962 · doi:10.1210/clinem/dgac381'],
    },
    {
      id: 'siadh-agua', nivel: 'nota', titulo: 'Restringir el agua en el SIADH',
      texto: 'Beber menos, por indicación médica, es el primer paso en el SIADH: entra menos agua que retener y el sodio se recupera. A casi la mitad de los pacientes no les basta. En el simulador, baja el acceso al agua poco a poco; quitarla del todo deshidrata.',
      todas: ['adhAutonoma', 'accesoAgua'], signo: { adhAutonoma: 1 },
      fuentes: ['PMID 39009016 · doi:10.1093/ndt/gfae162', 'PMID 30855321 · doi:10.1097/MCC.0000000000000589'],
    },
    {
      id: 'siadh-sal-baja', nivel: 'nota', titulo: 'Poca sal empeora el SIADH',
      texto: 'Con la ADH alta, el riñón solo elimina el agua que arrastran la sal y la urea (que sale de las proteínas). Con poca sal se orina menos, se retiene más agua y el sodio baja más; por eso se cuidan la sal y las proteínas de la dieta y, si no basta, se da urea.',
      todas: ['adhAutonoma', 'sal'], signo: { adhAutonoma: 1, sal: -1 },
      fuentes: ['PMID 39009016 · doi:10.1093/ndt/gfae162'],
    },
  ],
  fueraDeRango: {
    // «Fuera de rango» en una analítica significa «valor anormal»: Fable 5.2
    // propuso «tope de escala» para que se lea como límite del simulador.
    etiqueta: 'tope de escala',
    texto: 'Tope de la escala del simulador: indica un valor muy alterado, pero no cuánto. Más allá de aquí el simulador no distingue.',
    umbral: 0.95,
    nodos: ['volemia', 'gc', 'rvp', 'pas', 'pad', 'pam', ...panelAnalitica],
  },
};
