import type { Caso, Esperado } from '../../motor/tipos';

/**
 * Los 12 casos de docs/modelo-v2.1.md («Casos y resultados esperados»).
 * La primera expectativa de cada caso es la de la tabla (estado estable);
 * las siguientes son los paréntesis («↑ en días», «sin acceso al agua»…).
 * Es la batería de tests del motor.
 */

/** Columnas de la tabla, en orden. */
const HEMO = ['pas', 'pad', 'volemia', 'rvp', 'gc'] as const;
const ANALITICA = ['renina', 'aldo', 'creatinina', 'natremia', 'osmU', 'diuresis', 'potasio'] as const;

function fila(hemo: Esperado[], analitica: Esperado[], extra: Record<string, Esperado> = {}): Record<string, Esperado> {
  const v: Record<string, Esperado> = { ...extra };
  HEMO.forEach((id, i) => (v[id] = hemo[i]));
  ANALITICA.forEach((id, i) => (v[id] = analitica[i]));
  return v;
}

export const casos: Caso[] = [
  {
    id: 1, nombre: 'Edad avanzada con factores de riesgo', causas: { edad: 1, factores: 1 },
    esperado: [{ escala: 'estable', valores: fila(['↑↑', '↓', '=', '↑', '='], ['=', '=', '=', '=', '=', '=', '=']) }],
    nota: 'La presión sube porque las arterias grandes se vuelven rígidas, no porque su pared estreche el paso de la sangre. La sistólica sube durante toda la vida adulta; la diastólica sube hasta los 50–60 años y después baja.',
  },
  {
    id: 2, nombre: 'Hipertiroidismo', causas: { tiroides: 1 },
    esperado: [
      // FC añadida tras la revisión fisiológica: taquicardia del hipertiroidismo.
      // Revisión P5/48 (14 nov): RVP «↓ o ↓↓» (antes ↓). Con GC ↑↑ y PAM «=», la resistencia cae mucho.
      { escala: 'estable', valores: fila(['↑', '↓', '↑', ['↓', '↓↓'], '↑↑'], ['↑', '↑', '=', '=', '=', '=', '='], { fc: ['↑', '↑↑'] }) },
      { escala: 'dias', valores: { diuresis: '↓' } },
    ],
    nota: 'Las hormonas tiroideas no hacen liberar más adrenalina. Actúan directamente sobre el corazón y aumentan algo su sensibilidad a ella: por eso el cuadro parece simpático. La renina sube: en el hipertiroidismo el sistema renina-angiotensina está más activo. Se atribuye a que aumenta la respuesta de los receptores β, que en el riñón liberan renina.',
  },
  {
    id: 3, nombre: 'Dieta alta en sal', causas: { sal: 1 },
    esperado: [
      // Natremia «= (↑ leve)»: se acepta «= o ↑ leve» (validado el 14 nov).
      { escala: 'estable', valores: fila(['↑', '↑', '↑', '↑', '='], ['↓', '↓', '=', ['=', '↑'], '↑', '=', '=']) },
      { escala: 'dias', valores: { gc: '↑', diuresis: '↓' } },
    ],
    nota: 'Se orina menos solo los primeros días: a largo plazo se orina lo que se ingiere. Con el tiempo el gasto cardíaco vuelve a lo normal y es la RVP la que sostiene la hipertensión.',
  },
  {
    id: 4, nombre: 'SIADH', causas: { adhAutonoma: 1 },
    esperado: [
      // Decisión 1 (14 nov): diuresis ↓ en estado estable (antes «=»). Es un límite del modelo: diuresis = ingesta y aquí
      // la sed baja; en el paciente real la sed se mantiene (umbral reajustado) y la orina es de volumen casi normal.
      { escala: 'estable', valores: fila(['=', '=', '=', '=', '='], ['↓', '↓', '=', '↓↓', '↑↑', '↓', '=']) },
      { escala: 'dias', valores: { volemia: '↑', diuresis: '↓' } },
    ],
    nota: 'El SIADH casi nunca causa hipertensión: el riñón escapa del exceso de volumen (pierde sodio y responde menos a la ADH) y queda una hiponatremia con presión casi normal. En el modelo la diuresis sale baja porque la sed disminuye. En el paciente real se sigue bebiendo: la orina es concentrada y su volumen depende de lo que se bebe.',
  },
  {
    id: 5, nombre: 'Estenosis renal bilateral', causas: { estenosis: 1 },
    esperado: [
      { escala: 'estable', valores: fila(['↑', '↑', '↑', '↑', '↑'], ['↑', '↑', '↑', '=', '=', '=', '=']) },
      { escala: 'dias', valores: { diuresis: '↓' } },
    ],
    nota: 'La creatinina sube de forma clara solo si la estenosis es bilateral o de un riñón único. Aquí el volumen retenido frena en parte la renina. Cambia a «Unilateral» en la franja de la estenosis: el otro riñón compensa, la creatinina vuelve a lo normal y la renina sube más.',
  },
  {
    id: 6, nombre: 'Caída de la filtración', causas: { caidaFiltracion: 1 },
    esperado: [
      // Decisión 1 (14 nov): diuresis «=» en estado estable (antes ↓); la oliguria es la fase de días.
      { escala: 'estable', valores: fila(['↑', '↑', '↑', '↑', '↑'], [['=', '↑'], '↑', '↑↑', '=', '=', '=', '↑']) },
      { escala: 'dias', valores: { diuresis: '↓' } },
    ],
    nota: 'Glomerulonefritis y cálculos bajan la TFG por mecanismos distintos: la membrana dañada filtra peor y la obstrucción sube la presión en la cápsula de Bowman.',
  },
  {
    id: 7, nombre: 'Tumor secretor de renina', causas: { tumorRenina: 1 },
    esperado: [
      // TFG añadida tras la revisión fisiológica: la autorregulación impide la hiperfiltración.
      { escala: 'estable', valores: fila(['↑↑', '↑↑', '↑', '↑↑', '↑'], ['↑↑', '↑↑', '=', '=', '=', '=', '↓'], { tfg: ['=', '↑'] }) },
      { escala: 'dias', valores: { diuresis: '↓' } },
    ],
  },
  {
    id: 8, nombre: 'Hiperaldosteronismo primario', causas: { hiperaldo: 1 },
    esperado: [
      // Decisión 3 (14 nov): renina «↓ o ↓↓» (antes ↓↓). Sin hiperfiltración la renina baja menos; el contraste
      // docente (renina baja con aldosterona ↑↑) se mantiene.
      { escala: 'estable', valores: fila(['↑', '↑', '↑', '↑', '='], [['↓', '↓↓'], '↑↑', '=', '=', '=', '=', '↓↓'], { tfg: ['=', '↑'] }) },
      { escala: 'dias', valores: { gc: '↑', diuresis: '↓' } },
    ],
    nota: 'Es el cuadro clásico, pero la hipopotasemia solo aparece en una minoría de los hiperaldosteronismos primarios: un potasio normal no lo descarta.',
  },
  {
    id: 9, nombre: 'Feocromocitoma', causas: { feo: 1 },
    esperado: [{
      escala: 'estable',
      valores: fila(['↑↑', '↑↑', '↓', '↑↑', '↑↑'], ['↑', '↑', '=', '=', '=', '=', '='], { tfg: ['=', '↑'], fc: ['↑', '↑↑'] }),
    }],
    nota: 'La presión alta hace orinar más sodio y la volemia baja: el feocromocitoma suele cursar con volumen bajo. Con predominio de noradrenalina, la hipertensión es sobre todo por RVP y el gasto sube menos de lo que muestra el modelo.',
  },
  {
    id: 10, nombre: 'Regaliz', causas: { regaliz: 1 },
    esperado: [
      { escala: 'estable', valores: fila(['↑', '↑', '↑', '↑', '='], ['↓', '↓', '=', '=', '=', '=', '↓']) },
      { escala: 'dias', valores: { gc: '↑', diuresis: '↓' } },
    ],
  },
  {
    id: 11, nombre: 'Deshidratación', causas: { accesoAgua: -1 },
    esperado: [
      // Decisión 2 (14 nov): PAD «=» (antes ↓); revisión P5/48: «= o ↑». En la hipovolemia compensada la
      // vasoconstricción mantiene o sube algo la diastólica (Convertino 2006).
      // FC y simpático añadidos tras las revisiones fisiológicas: reflejo de volumen bajo.
      {
        escala: 'estable',
        valores: fila(['↓', ['=', '↑'], '↓↓', '↑', '↓'], ['↑↑', '↑↑', '↑', '↑', '↑↑', '↓↓', '='], {
          fc: ['↑', '↑↑'], simpatico: ['↑', '↑↑'],
        }),
      },
    ],
    nota: 'La mínima se mantiene o sube un poco porque los vasos se contraen; la máxima baja y la presión de pulso se estrecha. El simpático y la frecuencia cardíaca suben.',
  },
  {
    id: 12, nombre: 'Diabetes insípida central', causas: { adhAutonoma: -1 },
    esperado: [
      { escala: 'estable', valores: fila(['↓', '=', '↓', '=', '↓'], ['↑', '↑', '=', '↑', '↓↓', '↑↑', '=']) },
      { escala: 'estable', condicion: 'sin acceso al agua', ajustes: { accesoAgua: -1 }, valores: { pas: ['↓', '↓↓'], creatinina: '↑' } },
    ],
    nota: 'Con acceso al agua, la sed compensa y la creatinina queda normal. Prueba a bajar la rueda de acceso al agua: sin beber, la volemia cae, se filtra menos y la creatinina sube.',
  },
  // Casos 13 y 14: añadidos tras la revisión fisiológica (hallazgos 3 y 7) para que la calibración no
  // pueda esconder los extremos de dos ruedas. Solo se comprueban las celdas de fisiología de manual.
  // Validados por Edu el 14 nov 2026.
  {
    id: 13, nombre: 'Hipotiroidismo', causas: { tiroides: -1 },
    esperado: [{
      escala: 'estable',
      valores: {
        pad: ['↑', '↑↑'], rvp: ['↑', '↑↑'], gc: ['↓', '↓↓'], fc: ['↓', '↓↓'],
        volemia: ['=', '↓'], diuresis: ['=', '↓'], natremia: ['=', '↓'],
        // Hito 3e: en el paciente real la sistólica suele ser normal.
        pas: ['=', '↓'],
      },
    }],
    nota: 'Hipertensión diastólica: la RVP sube y el gasto baja (bradicardia, menos contractilidad). No da poliuria.',
  },
  {
    id: 14, nombre: 'Dieta baja en sal', causas: { sal: -1 },
    esperado: [{
      escala: 'estable',
      valores: {
        pas: ['=', '↓'], pad: ['=', '↓'], volemia: ['=', '↓'], gc: ['=', '↓'],
        renina: ['↑', '↑↑'], aldo: ['↑', '↑↑'], creatinina: '=', natremia: '=', potasio: '=',
      },
    }],
    nota: 'Con poca sal el riñón conserva Na: suben la renina y la aldosterona y la presión baja poco (más en hipertensos). No daña el riñón ni da hiponatremia.',
  },
  // Casos 15 a 24: fase 4, fármacos (aprobados por Edu el 16 nov 2026). Cada uno
  // parte de un caso básico con un fármaco a dosis plena. Solo se comprueban
  // las celdas que enseñan el fármaco.
  {
    id: 15, nombre: 'Estenosis renal bilateral con IECA', causas: { estenosis: 1 }, farmacos: { ieca: 1 },
    esperado: [{
      escala: 'estable',
      valores: { tfg: '↓↓', creatinina: ['↑', '↑↑'], potasio: '↑', renina: ['↑', '↑↑'], angII: ['=', '↓'], pas: ['=', '↑'] },
    }],
    nota: 'La filtración de un riñón con poca presión depende de que la angiotensina II contraiga la arteriola eferente. Sin ella, la TFG se hunde: por eso el IECA está contraindicado en la estenosis bilateral (y en la de un riñón único).',
  },
  {
    id: 16, nombre: 'Tumor de renina con IECA', causas: { tumorRenina: 1 }, farmacos: { ieca: 1 },
    esperado: [{
      escala: 'estable',
      valores: { pas: '↑', pad: '↑', renina: '↑↑', angII: '=', potasio: '=' },
    }],
    nota: 'El IECA corta la cascada entre la renina y la angiotensina II. La renina sube todavía más, porque baja la presión, pero lo que cuenta es la angiotensina II, que vuelve a lo normal. La aldosterona baja y el potasio se recupera.',
  },
  {
    id: 17, nombre: 'Tumor de renina con ARA-II', causas: { tumorRenina: 1 }, farmacos: { ara2: 1 },
    esperado: [{
      escala: 'estable',
      valores: { pas: '=', pad: '=', renina: '↑↑', angII: '↑↑', aldo: '=', potasio: '=' },
    }],
    nota: 'La angiotensina II está muy alta, pero su receptor está bloqueado: no contrae las arteriolas ni estimula la aldosterona. En el simulador, el ARA-II se distingue del IECA porque la angiotensina II sube en lugar de bajar. Que aquí la presión quede normal y con el IECA quede alta es un efecto del modelo: en el paciente los dos bajan la presión de forma parecida.',
  },
  {
    id: 18, nombre: 'Hiperaldosteronismo con espironolactona', causas: { hiperaldo: 1 }, farmacos: { espironolactona: 1 },
    esperado: [{
      escala: 'estable',
      valores: { pas: '=', pad: '=', aldo: '↑↑', mineralo: '↓', potasio: '=', renina: '=' },
    }],
    nota: 'La aldosterona sigue muy alta, pero no encuentra su receptor libre: el riñón deja de retener sodio y de perder potasio. Es el tratamiento médico del hiperaldosteronismo bilateral.',
  },
  {
    id: 19, nombre: 'Feocromocitoma con betabloqueante solo', causas: { feo: 1 }, farmacos: { betabloqueante: 1 },
    esperado: [{
      escala: 'estable',
      valores: { rvp: '↑↑', pad: '↑', fc: '=', gc: '=' },
    }],
    nota: 'Al bloquear los receptores β desaparece la dilatación β2 y la vasoconstricción α1 queda sin oposición: la RVP sube algo más. En el modelo la sistólica baja porque el corazón bombea menos; en el paciente puede ocurrir lo contrario, una crisis hipertensiva, que el modelo no reproduce. Por eso nunca se da un betabloqueante sin haber bloqueado antes los receptores α.',
  },
  {
    id: 20, nombre: 'Feocromocitoma con alfa y betabloqueante', causas: { feo: 1 }, farmacos: { alfabloqueante: 1, betabloqueante: 1 },
    esperado: [{
      escala: 'estable',
      valores: { pas: '=', pad: '=', rvp: '=', gc: '=', fc: '=' },
    }],
    nota: 'Primero el alfabloqueante, que dilata las arteriolas, y después el betabloqueante, que frena la taquicardia. Es la preparación para operar el tumor.',
  },
  {
    id: 21, nombre: 'Dieta alta en sal con tiazida', causas: { sal: 1 }, farmacos: { tiazida: 1 },
    esperado: [{
      escala: 'estable',
      valores: { pas: '=', pad: '=', volemia: '=', rvp: '=', potasio: '↓' },
    }],
    nota: 'La tiazida hace orinar el sodio que sobra: la volemia y la RVP vuelven a lo normal. El precio es el potasio bajo.',
  },
  {
    id: 22, nombre: 'Hipertiroidismo con betabloqueante', causas: { tiroides: 1 }, farmacos: { betabloqueante: 1 },
    esperado: [{
      escala: 'estable',
      valores: { fc: ['=', '↓'], gc: '=', pas: '=' },
    }],
    nota: 'El betabloqueante (sobre todo el propranolol) controla la taquicardia y la sistólica mientras el tiroides se trata. No corrige la causa.',
  },
  {
    id: 23, nombre: 'Caída de la filtración con diurético de asa', causas: { caidaFiltracion: 1 }, farmacos: { diureticoAsa: 1 },
    esperado: [{
      escala: 'estable',
      valores: { pas: '=', volemia: '↓', potasio: '=', creatinina: ['↑', '↑↑'] },
    }],
    nota: 'Con la filtración baja, la tiazida pierde eficacia y se suele usar el diurético de asa: saca el volumen retenido y el potasio que sobraba. La creatinina no mejora, porque el riñón sigue filtrando poco.',
  },
  {
    // Caso 24: añadido con la revisión de Fable 5.2 (cambio 1), aprobado por Edu el 16 nov 2026.
    id: 24, nombre: 'Dieta alta en sal con calcioantagonista', causas: { sal: 1 }, farmacos: { calcioantagonista: 1 },
    esperado: [{
      escala: 'estable',
      valores: { pas: '=', pad: '=', rvp: '=', volemia: '↑', potasio: '=' },
    }],
    nota: 'El calcioantagonista baja la presión dilatando las arteriolas, sin tocar el volumen. Por eso no depende del sistema renina-angiotensina y no baja el potasio, pero deja la volemia alta: con la sal, la tiazida ataca la causa.',
  },
  // Casos 25 a 33: fase 5, ejercicio (aprobados por Edu el 16 nov 2026,
  // docs/propuesta-fase-5.md). La sesión se calcula sobre el estado estable del
  // paciente (`momento`); el entrenamiento, en estado estable.
  {
    id: 25, nombre: 'Sesión aeróbica moderada', causas: {}, ejercicio: { sesionAerobica: 0.5 }, momento: 'durante',
    esperado: [{
      escala: 'estable', momento: 'durante',
      valores: { pas: ['↑', '↑↑'], pad: ['=', '↓'], rvp: ['↓', '↓↓'], fc: ['↑', '↑↑'], gc: ['↑', '↑↑'] },
    }],
    nota: 'El gasto sube mucho y el músculo que trabaja se dilata: la sistólica sube y la diastólica se mantiene. Es la respuesta normal al ejercicio dinámico.',
  },
  {
    id: 26, nombre: 'Sesión aeróbica con betabloqueante', causas: {}, farmacos: { betabloqueante: 1 }, ejercicio: { sesionAerobica: 0.5 }, momento: 'durante',
    esperado: [{
      escala: 'estable', momento: 'durante',
      valores: { fc: ['=', '↑'], gc: '↑', pas: '↑', pad: ['=', '↓'] },
    }],
    nota: 'Con el betabloqueante la frecuencia es más baja en reposo y en cada nivel de esfuerzo: los receptores β1 están bloqueados y la frecuencia sube sobre todo por la retirada vagal. Las frecuencias diana calculadas por la edad no valen: se usa la escala de esfuerzo percibido (Borg).',
  },
  {
    id: 27, nombre: 'Sesión de fuerza intensa', causas: {}, ejercicio: { sesionFuerza: 1 }, momento: 'durante',
    esperado: [{
      escala: 'estable', momento: 'durante',
      valores: { pas: '↑↑', pad: '↑↑', rvp: '↑↑' },
    }],
    nota: 'El músculo contraído comprime sus vasos y, si se bloquea la respiración (maniobra de Valsalva), la presión de dentro del tórax sube aún más: suben las dos presiones. En culturistas, con cargas casi máximas hasta el fallo y la respiración bloqueada, se han medido más de 300/200 mmHg.',
  },
  {
    id: 28, nombre: 'Dieta alta en sal: al terminar la sesión', causas: { sal: 1 }, ejercicio: { sesionAerobica: 0.75 }, momento: 'despues',
    esperado: [{
      escala: 'estable', momento: 'despues',
      valores: { pas: '=', pad: '=' },
    }],
    nota: 'Durante unas horas después de una sesión aeróbica la presión baja (hipotensión postejercicio): el músculo sigue dilatado y el barorreflejo se reajusta a la baja. Baja más cuanto más alta estaba: en el hipertenso, unos 5–7 mmHg, y puede durar buena parte del día.',
  },
  {
    id: 29, nombre: 'Dieta alta en sal con alfabloqueante: al terminar la sesión', causas: { sal: 1 }, farmacos: { alfabloqueante: 1 },
    ejercicio: { sesionAerobica: 0.75 }, momento: 'despues',
    esperado: [{
      escala: 'estable', momento: 'despues',
      valores: { rvp: '↓', pad: ['=', '↓'], pas: '=' },
    }],
    nota: 'A la vasodilatación del alfabloqueante se suma la del final de la sesión: la RVP queda por debajo de lo normal. Al levantarse, los vasos se contraen peor y cuesta sostener la presión (hipotensión ortostática). El modelo no tiene postura: lo cuenta el aviso.',
  },
  {
    id: 30, nombre: 'Dieta alta en sal con entrenamiento aeróbico', causas: { sal: 1 }, ejercicio: { entrenoAerobico: 1 },
    esperado: [{
      escala: 'estable',
      valores: { pad: '=', rvp: '=', fc: '↓', pas: '=' },
    }],
    nota: 'Tras meses de entrenamiento la RVP y la diastólica bajan y aparece bradicardia de reposo. En los hipertensos la presión baja unos 8/5 mmHg; en los normotensos, casi nada.',
  },
  {
    id: 31, nombre: 'Persona sana con entrenamiento aeróbico', causas: {}, ejercicio: { entrenoAerobico: 1 },
    esperado: [{
      escala: 'estable',
      valores: { pas: '=', pad: '=', fc: '↓', gc: '=' },
    }],
    nota: 'El corazón entrenado se llena más y expulsa más sangre en cada latido: con menos latidos mantiene el mismo gasto. La presión apenas cambia en quien la tiene normal.',
  },
  {
    id: 32, nombre: 'Feocromocitoma: sesión aeróbica', causas: { feo: 1 }, ejercicio: { sesionAerobica: 0.5 }, momento: 'durante',
    esperado: [{
      escala: 'estable', momento: 'durante',
      valores: { simpatico: '↑↑', fc: '↑↑', pas: '↑↑' },
    }],
    nota: 'El simpático ya estaba casi al máximo por las catecolaminas del tumor y el esfuerzo lo lleva al tope. El modelo no reproduce la crisis: la sistólica no tiene margen para subir y la vasodilatación del músculo baja la diastólica. En el paciente el esfuerzo puede desencadenar una crisis hipertensiva: hasta tratar el tumor, nada de ejercicio intenso.',
  },
  {
    id: 33, nombre: 'Hipertiroidismo: sesión aeróbica vigorosa', causas: { tiroides: 1 }, ejercicio: { sesionAerobica: 1 }, momento: 'durante',
    esperado: [{
      escala: 'estable', momento: 'durante',
      valores: { fc: '↑↑', gc: '↑↑', pas: '↑↑' },
    }],
    nota: 'La frecuencia y el gasto ya estaban altos en reposo y llegan al tope de escala con el esfuerzo. Mientras no se controle el tiroides, la tolerancia al esfuerzo es baja: ejercicio suave y vigilando la frecuencia.',
  },
  // Casos 34 y 35: fase 7, lateralidad de la estenosis (aprobados por Edu el 17 nov 2026).
  {
    id: 34, nombre: 'Estenosis renal unilateral', causas: { estenosis: 1 }, variantes: { estenosis: 'unilateral' },
    esperado: [
      { escala: 'estable', valores: fila(['↑', '↑', '=', '↑', '='], ['↑↑', '↑', '=', '=', '=', '=', ['=', '↓']], { tfg: '=' }) },
      { escala: 'dias', valores: { volemia: '=', creatinina: '=', renina: '↑↑' } },
    ],
    nota: 'Con una sola arteria estrecha, el riñón sano compensa: filtra lo que el otro deja de filtrar y expulsa el sodio que el otro retiene. La creatinina queda normal y el volumen no crece, pero el riñón afectado sigue liberando renina: la hipertensión depende de la angiotensina II.',
  },
  {
    id: 35, nombre: 'Estenosis renal unilateral con IECA', causas: { estenosis: 1 }, variantes: { estenosis: 'unilateral' }, farmacos: { ieca: 1 },
    esperado: [{
      escala: 'estable',
      // Creatinina «=» (+0,13): los textos dicen que apenas se mueve (revisión de Fable 5.2).
      valores: { pas: ['=', '↓'], pad: ['=', '↓'], renina: '↑↑', angII: '=', creatinina: '=', potasio: '=' },
    }],
    nota: 'Como la hipertensión depende de la angiotensina II, el IECA la controla bien. La filtración baja algo, sobre todo en el riñón afectado, pero el sano sostiene el resto: la creatinina apenas se mueve. Aun así, se vigila: ese riñón puede perder función sin que la creatinina avise.',
  },
];
