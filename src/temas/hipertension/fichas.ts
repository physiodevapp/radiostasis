import type { Fichas } from '../fichas';

/**
 * Fichas del tema de hipertensión (hito 3d).
 *
 * Redactado por Opus 5.5 a partir de docs/modelo-v2.1.md y de la fisiología
 * estándar, y revisado por Fable 5.2 (docs/revision-fichas-3d-fable.md, 14 nov
 * 2026; docs/revision-fuentes-fable.md, 19 nov 2026). El campo `aviso` recoge un
 * matiz clínico, un error frecuente o un límite del modelo.
 */
/** Aviso común de las fichas de fármacos. */
const AVISO_FARMACOS =
  'En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo.';

export const fichas: Fichas = {
  // ─────────────────────────── Causas ───────────────────────────

  edad: {
    queEs: 'Los años que tiene la persona. Es el factor que más pesa en la hipertensión y el único que no se puede evitar.',
    queHace:
      'Con los años, las fibras elásticas de la pared de las arterias grandes se fragmentan y el colágeno aumenta: la arteria se vuelve rígida. Una arteria rígida no amortigua el latido, así que sube la sistólica y baja algo la diastólica. También suma años de exposición a los factores de riesgo, que favorecen la placa.',
    enCaso: {
      1: 'Junto con los factores de riesgo, la edad deja la rigidez muy alta. La sistólica sube mucho y la diastólica baja: es la hipertensión sistólica aislada del mayor. La analítica es normal.',
    },
    capas: true,
  },

  factores: {
    queEs: 'Tabaco, LDL alto, diabetes, obesidad y sedentarismo, juntos en una sola rueda.',
    queHace:
      'Dañan el endotelio y ponen en marcha la aterosclerosis: placa en las arterias grandes, que las vuelve más rígidas. Además, la disfunción del endotelio y el remodelado de las arteriolas suben un poco la resistencia vascular periférica.',
    enCaso: {
      1: 'Forman placas grandes en la arteria y aceleran la rigidez de la edad. La subida de la sistólica viene sobre todo de esa rigidez; la RVP sube poco.',
    },
    aviso:
      'Un error frecuente es pensar que la placa sube la presión porque estrecha la arteria. La placa está en las arterias grandes y no estrecha las arteriolas, donde está la resistencia. Los factores de riesgo suben la presión porque endurecen las arterias grandes y dañan el endotelio de las arteriolas.',
    animacion: 'placa',
    capas: true,
  },

  sal: {
    queEs: 'Cuánta sal (cloruro sódico) se toma con la dieta. La mayor parte no sale del salero: ya viene en los alimentos procesados. Hacia la izquierda, dieta baja en sal.',
    queHace:
      'El sodio concentra el medio interno: sube la osmolaridad, se libera ADH y aparece la sed, y se retiene y se bebe agua hasta diluirlo. El volumen extra sube primero el gasto cardíaco; con el tiempo los tejidos se defienden del exceso de flujo, el gasto vuelve a lo normal y es la resistencia la que sostiene la hipertensión. La renina y la aldosterona bajan.',
    enCaso: {
      3: 'En «Minutos» solo se mueve el agua: osmolaridad, ADH y sed suben y la diuresis cae, pero la presión no cambia. En «Días» el volumen retenido sube el gasto y la sistólica; la diuresis sigue algo baja. En estado estable el gasto vuelve a lo normal, la RVP sostiene la presión y se orina lo que se ingiere.',
      14: 'Con poca sal el riñón conserva sodio: suben la renina y la aldosterona. La volemia baja algo y la orina sale menos concentrada, pero la presión apenas cambia.',
    },
    aviso:
      'Con mucha sal se orina menos solo los primeros días. En estado estable se orina lo que se ingiere. Además, no todas las personas responden igual: la presión de algunas sube mucho con la sal y la de otras, casi nada (sensibilidad a la sal).',
  },

  tiroides: {
    queEs: 'Nivel de hormonas tiroideas (T3 y T4). A la derecha, hipertiroidismo; a la izquierda, hipotiroidismo.',
    queHace:
      'En exceso aceleran el corazón y aumentan su fuerza: sube mucho el gasto cardíaco. A la vez, las hormonas relajan el músculo liso de las arteriolas y el mayor metabolismo de los tejidos las dilata aún más: baja la RVP. Resultado: sube la sistólica y baja la diastólica. Además se activa el sistema renina-angiotensina-aldosterona, que retiene sodio. En defecto pasa lo contrario: gasto bajo y RVP alta, con hipertensión diastólica.',
    enCaso: {
      2: 'El gasto sube mucho, con la frecuencia y la contractilidad altas, y la RVP cae: sube la sistólica y baja la diastólica. La renina y la aldosterona suben: aumenta la respuesta de los receptores β del riñón, que liberan renina, y la renina arrastra a la aldosterona.',
      13: 'El corazón va más despacio y con menos fuerza y la RVP sube mucho: la diastólica sube. La sistólica queda casi normal, en parte porque las arterias grandes se vuelven algo más rígidas y eso contrarresta el gasto bajo. La presión de pulso se estrecha: es una causa de hipertensión diastólica.',
    },
    aviso:
      'Un error frecuente es pensar que las hormonas tiroideas hacen liberar más adrenalina. La adrenalina no sube: lo que aumenta, y poco, es la sensibilidad del corazón a ella. La taquicardia se debe sobre todo al efecto directo de las hormonas sobre el corazón. La renina también sube, sin que haya más adrenalina: aumenta la respuesta de los receptores β, que en el riñón liberan renina, y el sistema renina-angiotensina queda más activo.',
  },

  adhAutonoma: {
    queEs:
      'ADH que se segrega sin hacer caso a sus estímulos. A la derecha, SIADH (secreción inadecuada); a la izquierda, diabetes insípida central (no hay ADH), que hoy también se llama déficit de arginina-vasopresina. El SIADH aparece con lesiones del sistema nervioso central (traumatismo, hemorragia, meningitis), con enfermedades del pulmón como la neumonía y con algunos fármacos. También lo causan tumores que fabrican ADH por su cuenta, sobre todo el carcinoma microcítico de pulmón.',
    queHace:
      'Fuera del centro, la rueda fija la ADH. Con SIADH el riñón retiene agua sin sal: el plasma se diluye (hiponatremia) y la orina sale concentrada cuando debería salir diluida. Con diabetes insípida se orina mucho y muy diluido; mientras haya agua, la sed lo compensa.',
    enCaso: {
      4: 'La presión apenas cambia: el riñón escapa del exceso de volumen. Lo que queda es la analítica: natremia muy baja con orina muy concentrada.',
      12: 'Mucha orina y muy diluida. Con acceso libre al agua, la sed compensa: la sistólica baja poco, la diastólica no cambia y la creatinina no sube. Baja la rueda de acceso al agua para ver qué pasa sin beber.',
    },
    aviso:
      'El SIADH casi nunca causa hipertensión: el riñón escapa del exceso de volumen y queda una hiponatremia con presión casi normal. En la diabetes insípida, si la persona puede beber lo que necesita, la creatinina suele ser normal.',
    animacion: 'adh',
  },

  estenosis: {
    queEs:
      'Estrechamiento de la arteria que lleva la sangre al riñón, casi siempre por una placa de ateroma. La segunda causa es la displasia fibromuscular, mucho más frecuente en mujeres. Puede estrechar una sola arteria (unilateral, lo más frecuente), las dos (bilateral) o la de un riñón único: el de quien solo tiene uno, de nacimiento, por una operación o por un trasplante. Al girar esta rueda aparece una franja sobre los mandos para elegir cuál; empieza en la bilateral, que es la del caso 5.',
    queHace:
      'Baja la presión que llega a la arteriola aferente, y el riñón responde como si faltara presión en todo el cuerpo: libera renina, sube la angiotensina II y la aldosterona, retiene sodio y agua y contrae las arteriolas. La presión sube por volumen y por resistencia, no por el estrechamiento en sí: las arterias renales son solo dos entre todas las del cuerpo y estrecharlas apenas cambia la resistencia periférica total. Si la estenosis es unilateral, el riñón sano recibe esa presión alta, expulsa el sodio y sostiene la filtración: no hay volumen de más ni creatinina alta, y la hipertensión depende de la renina del riñón afectado. Con los años se suman otros mecanismos y la presión depende menos de la renina: el simulador muestra la fase inicial.',
    enCaso: {
      5: 'Bajan la perfusión renal y la filtración, y por eso sube la creatinina. La renina sube, pero menos que con un tumor de renina, porque el volumen retenido la frena en parte. La presión sube por volumen y por RVP.',
      34: 'Solo una arteria está estrecha. El riñón sano compensa lo que el otro deja de filtrar y expulsa el sodio: la creatinina y la volemia quedan normales. El riñón afectado sigue liberando renina, que sube más que en la bilateral porque no hay volumen de más que la frene. La presión sube por la RVP, menos que en la bilateral.',
    },
    animacion: 'renina',
  },

  caidaFiltracion: {
    queEs:
      'Enfermedades que bajan la filtración glomerular de los dos riñones. La rueda junta dos mecanismos: membrana dañada (glomerulonefritis) y obstrucción de la salida de la orina (cálculos).',
    queHace:
      'Se filtra menos: se elimina menos sodio y agua, sube la volemia y con ella la presión. La creatinina, que se elimina casi solo por filtración, se acumula. Si la caída es grande, también sube el potasio.',
    enCaso: {
      6: 'La creatinina sube mucho y el potasio sube: el problema está en el riñón. La presión sube por el volumen retenido. Compara la diuresis en «Días» y en estado estable.',
    },
    aviso:
      'La glomerulonefritis es una inflamación del glomérulo, casi siempre de causa inmunitaria; no es una infección del riñón. Una obstrucción solo baja la filtración total si afecta a los dos riñones o a un riñón único: si se obstruye uno, el otro compensa.',
  },

  tumorRenina: {
    queEs: 'Tumor de las células yuxtaglomerulares del riñón que segrega renina por su cuenta (reninoma). Es muy raro.',
    queHace:
      'Activa todo el sistema renina-angiotensina-aldosterona sin que falte presión: vasoconstricción y retención de sodio y agua. La filtración no cae, así que la creatinina es normal.',
    enCaso: {
      7: 'Renina y aldosterona muy altas, con potasio bajo. Es la hipertensión más intensa de las de origen renal: la angiotensina II contrae las arteriolas (mira la luz de la arteriola). La creatinina es normal.',
    },
    animacion: 'renina',
  },

  hiperaldo: {
    queEs:
      'La corteza suprarrenal segrega aldosterona por su cuenta, por un adenoma o por hiperplasia de las dos glándulas. Es la causa más frecuente de hipertensión secundaria de origen endocrino, y mucho menos rara de lo que se creía: pasa a menudo sin diagnosticar.',
    queHace:
      'La aldosterona alta hace reabsorber sodio y agua y perder potasio. El volumen retenido sube la presión y frena la renina: renina baja con aldosterona alta es la pista que lo delata.',
    enCaso: {
      8: 'Renina baja, aldosterona alta y potasio bajo: la aldosterona no viene del sistema renina-angiotensina. Compáralo con el tumor de renina (las dos altas) y con el regaliz (las dos bajas).',
    },
    aviso:
      'En el simulador el potasio baja, pero en la práctica solo lo tiene bajo una minoría de los pacientes: un potasio normal no descarta el hiperaldosteronismo.',
    animacion: 'aldosterona',
  },

  feo: {
    queEs: 'Tumor de la médula suprarrenal que segrega catecolaminas: adrenalina y noradrenalina. Si nace fuera de ella, en los ganglios simpáticos, se llama paraganglioma.',
    queHace:
      'Las catecolaminas actúan como un simpático al máximo: aceleran el corazón, aumentan su fuerza y contraen las arteriolas. Suben mucho el gasto y la RVP, y con ellos las dos presiones, ya en minutos.',
    enCaso: {
      9: 'El simpático dispara la frecuencia, el gasto y la RVP: las dos presiones suben mucho ya en «Minutos». La volemia baja porque la presión alta hace orinar más sodio.',
    },
    aviso:
      'El simulador muestra una hipertensión mantenida. En el paciente real también puede aparecer en crisis, con dolor de cabeza, sudoración y palpitaciones.',
  },

  regaliz: {
    queEs: 'Tomar mucho regaliz de forma continuada. Su ácido glicirrícico, que el intestino transforma en ácido glicirretínico, bloquea una enzima del riñón.',
    queHace:
      'En la célula del colector, la enzima 11β-HSD2 convierte el cortisol en cortisona, que no activa el receptor de la aldosterona. Con regaliz la enzima se bloquea y el cortisol, mucho más abundante que la aldosterona, ocupa el receptor: se reabsorbe sodio, se pierde potasio y sube la volemia. El volumen frena la renina y la aldosterona.',
    enCaso: {
      10: 'Renina y aldosterona bajas con potasio bajo: el receptor mineralocorticoide se activa sin aldosterona. Compáralo con el hiperaldosteronismo, donde la aldosterona está alta.',
    },
    aviso:
      'Unos 50 gramos de dulce de regaliz al día durante dos semanas ya suben algo la presión. Lo que cuenta es el ácido glicirrícico, que se mide en miligramos: bastan unos 100 al día. Cada producto lleva una cantidad distinta.',
    animacion: 'regaliz',
  },

  accesoAgua: {
    queEs: 'Si la persona puede beber. A la derecha, acceso libre; a la izquierda, sin agua (deshidratación por no beber).',
    queHace:
      'Sin beber se sigue perdiendo agua por la respiración, el sudor y la orina obligada: baja la volemia y el plasma se concentra. Se disparan ADH, sed, renina y aldosterona, pero sin agua no hay con qué recuperar el volumen y la presión no sube. Con algo de agua, la sed compensa y casi no pasa nada: la rueda responde sobre todo en su último tramo, cerca de «nulo».',
    enCaso: {
      11: 'La volemia cae mucho y la sistólica baja, pero la diastólica no baja, incluso sube algo: el simpático y la RVP compensan. Orina escasa y muy concentrada; renina y aldosterona muy altas, y la creatinina sube.',
      12: 'Con acceso libre, la sed compensa la diabetes insípida. Gira esta rueda hasta «nulo» para ver qué pasa cuando no se puede beber.',
    },
  },

  // ─────────────────────────── Mecanismos ───────────────────────────

  osmP: {
    queEs:
      'Concentración de solutos del plasma, sobre todo sodio y sus aniones. La vigilan los osmorreceptores del hipotálamo.',
    queHace:
      'Cuando sube, el hipotálamo libera ADH y da sed: se retiene y se bebe agua hasta diluir el plasma. Cuando baja, se frena la ADH y se orina el agua sobrante.',
    enCaso: {
      3: 'La sal la sube; la ADH y la sed retienen y aportan agua y la frenan, pero queda algo alta.',
      4: 'Muy baja: la ADH retiene agua sin sal y diluye el plasma.',
      11: 'Alta: se pierde agua y no se repone.',
      12: 'Alta: se pierde agua por la orina y la sed solo lo compensa en parte.',
    },
  },

  adh: {
    queEs:
      'Hormona antidiurética o vasopresina. La fabrica el hipotálamo y se libera en la neurohipófisis cuando sube la osmolaridad, baja la volemia o sube la angiotensina II.',
    queHace:
      'En el túbulo colector se une a su receptor V2 y pone acuaporinas en la membrana: se recupera agua, la orina se concentra y baja la diuresis. En niveles altos también contrae las arteriolas (receptor V1).',
    enCaso: {
      3: 'Sube por la osmolaridad: retiene el agua que diluye la sal.',
      4: 'Fijada muy alta por el SIADH, aunque el plasma esté diluido.',
      11: 'Muy alta por la osmolaridad y la volemia baja: la orina sale escasa y concentrada.',
      12: 'No hay: se orina mucho y muy diluido.',
    },
    animacion: 'adh',
  },

  sed: {
    queEs: 'Ganas de beber. Las genera el centro de la sed del hipotálamo, con los mismos estímulos que la ADH.',
    queHace:
      'Si hay agua, beber repone el volumen y diluye el plasma. Es lo que compensa la diabetes insípida. Sin acceso al agua, la sed no sirve de nada.',
    enCaso: {
      4: 'Baja: la osmolaridad baja la frena. En el paciente real no ocurre: el umbral de la sed se reajusta a la baja y se sigue bebiendo con normalidad, lo que mantiene la hiponatremia. Es un límite del modelo.',
      11: 'Muy alta, pero sin agua no se traduce en beber.',
      12: 'Alta: bebiendo se compensa lo que se orina.',
    },
  },

  reabAgua: {
    queEs: 'Agua que el túbulo colector devuelve a la sangre a través de las acuaporinas. La controla la ADH.',
    queHace:
      'Recupera agua sin solutos: diluye el plasma, concentra la orina y baja la diuresis. Si el volumen se mantiene alto, el riñón «escapa»: retiene menos agua aunque la ADH siga alta.',
    enCaso: {
      4: 'Muy alta por la ADH, aunque el escape la frena: queda orina muy concentrada y plasma diluido.',
      12: 'Muy baja sin ADH: orina abundante y diluida.',
    },
    animacion: 'adh',
  },

  diuresis: {
    queEs: 'Volumen de orina. También aparece en la analítica.',
    queHace:
      'Lo que se orina sale de la volemia. Baja cuando el túbulo reabsorbe más agua o más sodio, y cuando cae la filtración. En estado estable se orina lo que se ingiere: la oliguria de la retención solo se ve en los primeros días.',
    enCaso: {
      3: 'Normal en estado estable: se orina lo que se ingiere. Cambia a «Minutos» y a «Días» para ver la fase de retención.',
      11: 'Muy baja: el riñón retiene todo lo que puede.',
      12: 'Muy alta: poliuria sin ADH.',
    },
  },

  renina: {
    queEs:
      'Enzima que liberan las células granulares de la arteriola aferente, en el aparato yuxtaglomerular. Pone en marcha el sistema renina-angiotensina-aldosterona.',
    queHace:
      'Corta el angiotensinógeno del hígado y empieza la cascada que acaba en la angiotensina II. Se libera cuando baja la presión en la aferente, cuando llega poco NaCl a la mácula densa o cuando el simpático la estimula. El volumen alto la frena.',
    enCaso: {
      3: 'Baja: el volumen extra y el NaCl que llega a la mácula densa la frenan.',
      5: 'Sube, pero no al máximo: la estenosis la estimula y el volumen retenido la frena en parte.',
      7: 'Muy alta: la segrega el tumor por su cuenta.',
      8: 'Baja: el volumen retenido por la aldosterona la frena. Renina baja con aldosterona alta es la pista del hiperaldosteronismo.',
      10: 'Baja, como la aldosterona: el volumen que retiene el cortisol frena todo el sistema.',
      11: 'Muy alta por la volemia baja y la filtración baja.',
    },
    animacion: 'renina',
  },

  angII: {
    queEs:
      'Producto activo del sistema: la renina convierte el angiotensinógeno en angiotensina I, y la enzima convertidora (sobre todo en el pulmón) la pasa a angiotensina II.',
    queHace:
      'Contrae las arteriolas de todo el cuerpo (sube la RVP), libera aldosterona y hace reabsorber sodio en el túbulo. Además estimula la ADH, la sed y el simpático, y contrae la arteriola eferente para sostener la filtración.',
    enCaso: {
      5: 'Sube en «Minutos» y apenas se nota en estado estable, cuando el volumen retenido ya frena la renina.',
      7: 'Alta: contrae las arteriolas y es la que más sube la RVP.',
      8: 'Baja, con la renina frenada por el volumen.',
    },
  },

  aldo: {
    queEs: 'Hormona de la corteza suprarrenal. La estimulan la angiotensina II y el potasio alto en sangre.',
    queHace:
      'En el túbulo distal y el colector activa su receptor, y la célula fabrica más canales y bombas de sodio. Se reabsorbe sodio, el agua lo sigue, baja la diuresis y sube la volemia. A cambio se pierde potasio por la orina. Tarda de horas a días: en «Minutos» todavía no mueve nada.',
    enCaso: {
      7: 'Muy alta porque la empuja la angiotensina II: renina y aldosterona suben a la vez.',
      8: 'La suprarrenal la segrega sola. Por eso está alta aunque la renina y la angiotensina II estén bajas: es la pista que distingue el hiperaldosteronismo primario. El potasio bajo también la frena, pero no basta.',
      10: 'Baja: el receptor lo activa el cortisol, y la volemia alta frena la renina.',
      11: 'Muy alta: el sistema renina-angiotensina está muy activado para conservar sodio.',
    },
    animacion: 'aldosterona',
  },

  mineralo: {
    queEs:
      'Cuánto se activa el receptor mineralocorticoide de las células del colector. Lo activa la aldosterona o, si falla la enzima 11β-HSD2, el cortisol.',
    queHace:
      'Es el paso común de la aldosterona y el regaliz: más canales de sodio en la membrana que da a la orina (apical) y más bombas sodio-potasio en la que da a la sangre (basolateral). Se reabsorbe sodio y se secreta potasio.',
    enCaso: {
      8: 'Muy alta por la aldosterona.',
      10: 'Muy alta con la aldosterona baja: la activa el cortisol.',
    },
    animacion: 'aldosterona',
  },

  simpatico: {
    queEs:
      'Actividad del sistema nervioso simpático y de las catecolaminas de la médula suprarrenal (adrenalina y noradrenalina).',
    queHace:
      'Acelera el corazón y aumenta su fuerza (receptores β1), contrae las arteriolas (α1) y libera renina (β1 del riñón). El barorreflejo lo frena cuando la presión sube; en la hipertensión mantenida se reajusta en buena parte a la nueva presión y la frena mucho menos. El modelo lo simplifica: en estado estable no lo cuenta.',
    enCaso: {
      9: 'Al máximo por las catecolaminas del tumor: mueve casi toda la presión.',
      11: 'Sube por la volemia baja y sostiene la diastólica.',
      2: 'Apenas cambia: las hormonas tiroideas aumentan la sensibilidad a las catecolaminas, no su cantidad.',
    },
  },

  perfRenal: {
    queEs: 'Presión y flujo de sangre que llegan a la arteriola aferente del glomérulo.',
    queHace:
      'Si baja, cae la filtración y las células granulares liberan renina. Sube y baja con la presión arterial, pero la autorregulación renal hace que la filtración cambie mucho menos que ella cuando la presión es alta. Baja de verdad con una estenosis o con poco volumen.',
    enCaso: {
      5: 'Baja por la estenosis; la presión alta la recupera en parte.',
      11: 'Baja: con poco volumen se contraen los vasos del riñón.',
    },
    animacion: 'renina',
  },

  tfg: {
    queEs: 'Tasa de filtración glomerular: cuánto plasma filtran por minuto los glomérulos de los dos riñones.',
    queHace:
      'Depende de la membrana (Kf), de la presión en el capilar y de las que se oponen: la de la cápsula de Bowman y la oncótica. Si baja, llega menos NaCl a la mácula densa (sube la renina), baja algo la diuresis y, si la caída es apreciable, suben la creatinina y el potasio.',
    enCaso: {
      5: 'Baja por la estenosis: sube la creatinina.',
      6: 'Muy baja: es el problema de partida.',
      11: 'Muy baja por la volemia baja: sube la creatinina.',
    },
  },

  reabNa: {
    queEs: 'Sodio que los túbulos devuelven a la sangre: el proximal (con la angiotensina II), el distal y el colector (con la aldosterona).',
    queHace:
      'El agua sigue al sodio: baja la diuresis y sube la volemia. Si la presión es alta, el túbulo reabsorbe menos sodio (natriuresis por presión), que es el freno que limita la retención.',
    enCaso: {
      3: 'Baja: con presión alta y renina baja se elimina el exceso de sal.',
      8: 'Alta por la aldosterona.',
      10: 'Alta por el cortisol que ocupa el receptor.',
      11: 'Alta: se conserva todo el sodio posible.',
    },
  },

  fc: {
    queEs: 'Latidos por minuto. Los marca el nódulo sinusal.',
    queHace:
      'El gasto cardíaco es la frecuencia por el volumen de cada latido: si sube la frecuencia, sube el gasto. La aceleran el simpático y las hormonas tiroideas.',
    enCaso: {
      2: 'Alta: taquicardia del hipertiroidismo.',
      9: 'Muy alta por las catecolaminas.',
      13: 'Baja: el hipotiroidismo enlentece el corazón.',
      11: 'Sube para compensar la volemia baja.',
    },
  },

  contractilidad: {
    queEs: 'Fuerza con que se contrae el miocardio.',
    queHace:
      'Con más fuerza, cada latido expulsa más sangre: sube el volumen sistólico y el gasto. La aumentan el simpático y las hormonas tiroideas. Un corazón más fuerte por sí solo (por ejemplo, por el ejercicio) no causa hipertensión.',
    enCaso: {
      2: 'Alta: efecto directo de las hormonas tiroideas.',
      9: 'Alta por las catecolaminas.',
      13: 'Baja: el hipotiroidismo debilita el corazón.',
    },
  },

  rigidez: {
    queEs: 'Pérdida de distensibilidad de la pared de las arterias grandes, como la aorta.',
    queHace:
      'Una arteria elástica se distiende en cada latido y devuelve la sangre en la diástole (efecto Windkessel). Rígida, no amortigua la eyección: sube la sistólica y baja la diastólica, y se ensancha la presión de pulso. La suben la edad, los factores de riesgo y la placa. También, menos y de forma reversible, el hipotiroidismo mantenido.',
    enCaso: {
      1: 'Muy alta: es la que sube la sistólica y baja la diastólica. Mira el latido de la arteria grande: apenas se distiende.',
      13: 'Algo alta: en el hipotiroidismo mantenido las arterias grandes se distienden peor, y se corrige con el tratamiento. Ayuda a sostener la sistólica aunque el gasto baje.',
    },
    aviso:
      'La rigidez es de las arterias grandes y no cambia la resistencia vascular periférica, que está en las arteriolas. Aumenta la presión de pulso: sube la sistólica y baja la diastólica.',
    capas: true,
  },

  placa: {
    queEs:
      'Engrosamiento de la íntima de las arterias grandes y medianas: lípidos, macrófagos convertidos en células espumosas, músculo liso y colágeno.',
    queHace:
      'Vuelve la pared más gruesa y fibrosa, y por eso más rígida. En el modelo solo actúa a través de la rigidez: la placa está en las arterias de conducción y no estrecha las arteriolas, donde está la resistencia.',
    enCaso: {
      1: 'Grande, por la edad y los factores de riesgo: se ve en la pared de la arteria grande.',
    },
    aviso:
      'La placa de una arteria grande no estrecha las arteriolas, donde está la resistencia. Si sube la presión, es porque la pared se vuelve más rígida.',
    animacion: 'placa',
    capas: true,
  },

  // ─────────────────────────── Salidas ───────────────────────────

  volemia: {
    queEs: 'Volumen de sangre, ligado al volumen del medio interno. En el modelo es un acumulador: agua que entra menos agua que sale.',
    queHace:
      'Más volumen llena más el corazón y sube el gasto. Si se mantiene, los tejidos se defienden del exceso de flujo, el gasto vuelve a lo normal y la RVP sostiene la presión. El volumen alto frena la renina, la ADH y la sed.',
    enCaso: {
      3: 'Sube con el agua retenida para diluir la sal.',
      4: 'Normal en estado estable: el riñón escapa del exceso de agua. En «Días» todavía está alta.',
      11: 'Muy baja: por muchas hormonas que haya, sin agua no hay presión.',
      12: 'Baja algo: la sed compensa casi toda la orina perdida.',
    },
  },

  gc: {
    queEs: 'Gasto cardíaco: litros de sangre que bombea el corazón por minuto. Es la frecuencia por el volumen de cada latido.',
    queHace:
      'Sube la presión, sobre todo la sistólica. Lo suben la frecuencia, la contractilidad y la volemia (más llenado, más volumen por latido).',
    enCaso: {
      2: 'Muy alto: frecuencia y contractilidad suben.',
      3: 'Sube en «Días» con el volumen y vuelve a lo normal en estado estable.',
      9: 'Muy alto por las catecolaminas.',
      13: 'Muy bajo: corazón lento y débil.',
      11: 'Bajo: falta volumen.',
    },
  },

  rvp: {
    queEs: 'Resistencia vascular periférica: la oposición que ofrecen al flujo los vasos del cuerpo, sobre todo las arteriolas. Depende mucho de su radio.',
    queHace:
      'Sube la presión, sobre todo la diastólica: la sangre sale más despacio de las arterias durante la diástole. La suben la angiotensina II, el simpático, la ADH alta y la autorregulación con volumen alto; la bajan las hormonas tiroideas.',
    enCaso: {
      2: 'Baja mucho: las hormonas tiroideas dilatan las arteriolas.',
      3: 'Sube en estado estable y sostiene la hipertensión de la sal.',
      7: 'Muy alta por la angiotensina II: mira la luz de la arteriola.',
      9: 'Muy alta por el simpático.',
      13: 'Muy alta: hipertensión diastólica del hipotiroidismo.',
    },
  },

  pas: {
    queEs: 'Presión sistólica: la máxima, cuando el corazón expulsa la sangre.',
    queHace:
      'La suben el gasto cardíaco y la rigidez de las arterias grandes, y algo la RVP. Si sube la sistólica y baja la diastólica, mira la rigidez o un gasto muy alto.',
    enCaso: {
      1: 'Sube mucho por la rigidez.',
      2: 'Sube por el gasto alto, aunque la RVP baje.',
      11: 'Baja: falta volumen.',
      13: 'Casi normal: el gasto bajo tira hacia abajo, y la RVP alta y algo más de rigidez arterial lo contrarrestan.',
    },
  },

  pad: {
    queEs: 'Presión diastólica: la mínima, entre latido y latido.',
    queHace:
      'Depende sobre todo de la RVP: cuanto más cuesta que la sangre salga de las arterias, más alta queda. La baja la rigidez, porque la arteria rígida ya no devuelve la sangre en la diástole.',
    enCaso: {
      1: 'Baja: la arteria rígida no sostiene la presión en la diástole.',
      2: 'Baja por la vasodilatación.',
      11: 'No baja, incluso sube algo: el simpático y la RVP compensan la falta de volumen.',
      13: 'Sube: hipertensión diastólica.',
    },
  },

  pam: {
    queEs: 'Presión arterial media: la diastólica más un tercio de la diferencia con la sistólica.',
    queHace:
      'Es la presión que perfunde los órganos. La vigilan los barorreceptores y el riñón: si es alta, el túbulo elimina más sodio (natriuresis por presión) y, en minutos y días, el barorreflejo frena el simpático.',
    enCaso: {
      9: 'Muy alta: suben las dos presiones.',
      1: 'Casi normal: la sistólica sube, pero la diastólica baja.',
    },
  },

  // ─────────────────────────── Analítica ───────────────────────────

  creatinina: {
    queEs: 'Producto del músculo que se elimina casi solo por filtración. Es el marcador de la filtración glomerular.',
    queHace:
      'Sube cuando la filtración cae de forma apreciable; con pequeñas variaciones no se mueve. Una falta de volumen importante, como en la deshidratación, también la sube: llega menos sangre al riñón y se filtra menos. Separa las causas renales (estenosis de las dos arterias o de un riñón único, caída de la filtración) de las hormonales (tumor de renina, hiperaldosteronismo).',
    enCaso: {
      5: 'Alta: la estenosis baja la filtración.',
      6: 'Muy alta: el problema es la filtración.',
      7: 'Normal: hay mucha renina, pero el riñón filtra bien.',
      11: 'Alta: con poco volumen se filtra menos.',
      12: 'Normal: con acceso libre al agua, la sed compensa.',
    },
    aviso:
      'Con acceso libre al agua, la creatinina suele ser normal en la diabetes insípida.',
  },

  natremia: {
    queEs: 'Concentración de sodio en el plasma. Refleja la proporción de agua y sodio, no la cantidad total de sodio.',
    queHace:
      'Sigue a la osmolaridad plasmática: baja cuando se retiene agua sin sal y sube cuando se pierde agua. Si cambia, la ADH está implicada. Cuando baja mucho o deprisa, el agua entra en las células y las hincha. En el cerebro eso produce edema cerebral.',
    enCaso: {
      4: 'Muy baja: hiponatremia del SIADH.',
      11: 'Alta: se pierde agua.',
      12: 'Alta: se orina agua sin sal. En el paciente real que bebe a demanda suele quedar en el límite alto de lo normal.',
      3: 'Algo alta: el agua retenida diluye la sal, pero no del todo.',
    },
  },

  osmU: {
    queEs: 'Concentración de la orina.',
    queHace: 'Sube cuando el colector recupera agua y la orina queda concentrada; baja cuando no hay ADH y la orina sale diluida.',
    enCaso: {
      4: 'Muy alta: se quita agua a la orina sin parar.',
      11: 'Muy alta: el riñón ahorra agua.',
      12: 'Muy baja: orina diluida sin ADH.',
    },
    animacion: 'adh',
  },

  potasio: {
    queEs: 'Concentración de potasio en el plasma.',
    queHace:
      'Baja cuando el receptor mineralocorticoide está activo, porque el colector cambia sodio por potasio. Sube cuando la filtración cae mucho. A su vez, el potasio alto estimula la aldosterona.',
    enCaso: {
      6: 'Alto: con poca filtración se elimina menos potasio.',
      7: 'Bajo: la aldosterona alta lo elimina.',
      8: 'Muy bajo, aunque en la práctica la hipopotasemia solo aparece en una minoría de los pacientes.',
      10: 'Bajo: el cortisol ocupa el receptor de la aldosterona.',
    },
    animacion: 'aldosterona',
  },

  // ─────────────────────────── Fármacos (fase 4) ───────────────────────────
  // Redactado por Opus 5.5 el 16 nov 2026 y revisado por Fable 5.2 el mismo día
  // (docs/revision-fase-4-fable.md); correcciones validadas por Edu.

  ieca: {
    queEs: 'Inhibidor de la enzima convertidora de angiotensina (enalapril, ramipril, lisinopril). Fármaco de primera línea en la hipertensión.',
    queHace:
      'Frena el paso de angiotensina I a angiotensina II. Con menos angiotensina II las arteriolas se dilatan, baja la aldosterona y el riñón retiene menos sodio y algo más de potasio: baja la presión. La renina sube, porque baja la presión que llega al riñón y porque la angiotensina II deja de frenarla. En el riñón dilata la arteriola eferente: la filtración baja un poco, y mucho si el riñón depende de ella.',
    enCaso: {
      15: 'La filtración de un riñón con poca presión se sostenía porque la angiotensina II contraía la arteriola eferente. Con el IECA falta ese apoyo y, además, baja la presión que llega al riñón: la TFG se hunde y suben la creatinina y el potasio. Por eso está contraindicado en la estenosis bilateral y en la de un riñón único.',
      35: 'Aquí la hipertensión depende de la renina del riñón afectado, así que el IECA la controla bien. Sin la angiotensina II la filtración baja algo (mira la TFG), sobre todo en ese riñón; el sano sostiene el resto y la creatinina apenas se mueve. Se vigila en la analítica de control, por si la estenosis fuera de las dos arterias.',
      16: 'La renina sigue muy alta, pero se forma menos angiotensina II: la presión baja de muy alta a alta y el potasio se normaliza. Compáralo con el ARA-II en el mismo caso.',
    },
    aviso:
      'En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo. Dos límites del modelo: en una persona sana exagera algo la caída de la filtración, y con la renina suprimida (hiperaldosteronismo, regaliz) el IECA baja la presión más que en el paciente real, en el que es poco eficaz.',
    consulta:
      'Mareo al levantarse de la camilla al empezar el tratamiento o al subir la dosis: incorporar al paciente por etapas. Tos seca y persistente sin catarro ni enfermedad pulmonar: es un efecto frecuente del fármaco y conviene que el paciente se lo cuente a su médico. Rara vez, hinchazón de labios, lengua o garganta (angioedema): es una urgencia. Con vómitos, diarrea, mucho calor o un esfuerzo largo sin beber, el riñón queda desprotegido: un paciente deshidratado no debe hacer una sesión intensa.',
  },

  ara2: {
    queEs: 'Antagonista del receptor AT1 de la angiotensina II (losartán, valsartán, candesartán). Fármaco de primera línea en la hipertensión.',
    queHace:
      'No impide que se forme la angiotensina II: bloquea su receptor. Los efectos sobre la presión, la aldosterona, el potasio y el riñón son los del IECA. La diferencia está en la angiotensina II: con el IECA baja y con el ARA-II sube, igual que la renina. En la práctica solo se mide la renina, que sube con los dos. No acumula bradicinina, así que no da la tos del IECA.',
    enCaso: {
      17: 'La angiotensina II está muy alta, pero su receptor está bloqueado: las arteriolas no se contraen y la aldosterona no sube. La presión vuelve a lo normal con la renina y la angiotensina II muy altas.',
    },
    aviso:
      'En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo. Dos límites del modelo: el ARA-II sale más potente que el IECA, cuando en el paciente bajan la presión de forma parecida; y en una persona sana exagera la caída de la filtración, hasta subir algo la creatinina.',
    consulta:
      'Como el IECA: mareo al cambiar de postura al principio del tratamiento y cuidado si el paciente se deshidrata (calor, ejercicio largo, vómitos). No da tos, y el angioedema es todavía más raro.',
  },

  betabloqueante: {
    queEs: 'Bloqueante de los receptores β adrenérgicos. El simulador usa uno no selectivo (propranolol), que bloquea los β1 y los β2; los cardioselectivos (bisoprolol, atenolol, nebivolol) bloquean sobre todo los β1.',
    queHace:
      'Bloquea los β1 del corazón: bajan la frecuencia y la contractilidad, y con ellas el gasto. Bloquea los β1 del riñón: baja la renina. Al bloquear también los β2, las arteriolas del músculo pierden su dilatación por adrenalina y la RVP sube algo. En la hipertensión se usa sobre todo cuando hay otra razón para darlo: cardiopatía isquémica, insuficiencia cardíaca o arritmias.',
    enCaso: {
      19: 'Sin la dilatación β2, la vasoconstricción α1 de las catecolaminas queda sin oposición: la RVP sube algo más. La sistólica del modelo baja porque cae el gasto; en el paciente puede desencadenar una crisis hipertensiva. Nunca se da sin un alfabloqueante previo.',
      20: 'Con los receptores α ya bloqueados, el betabloqueante frena la taquicardia y el gasto. La presión vuelve a lo normal.',
      22: 'Frena el corazón: la frecuencia y el gasto dejan de estar altos y la sistólica vuelve a lo normal. La RVP y la diastólica siguen bajas, porque no corrige la causa: se usa mientras se trata el tiroides.',
    },
    aviso: AVISO_FARMACOS,
    consulta:
      'La frecuencia cardíaca es más baja en reposo y sube menos con el esfuerzo: las fórmulas de frecuencia máxima por edad no valen. Para dosificar el ejercicio, mejor la escala de Borg o el test del habla, o las frecuencias de una prueba de esfuerzo hecha con el fármaco. Más cansancio y manos y pies fríos. El no selectivo puede cerrar los bronquios en el asma y, en el diabético, tapar la taquicardia y el temblor que avisan de una hipoglucemia; el sudor se mantiene. Pulso muy lento con mareo o desmayo: avisar al médico.',
  },

  alfabloqueante: {
    queEs: 'Bloqueante de los receptores α1 de las arteriolas (doxazosina, prazosina). En el feocromocitoma se usa también la fenoxibenzamina, que bloquea los α1 y los α2.',
    queHace:
      'Impide que la noradrenalina contraiga las arteriolas: baja la RVP y, con ella, sobre todo la diastólica. No es de primera línea en la hipertensión. Se usa como fármaco añadido, en hombres con hiperplasia benigna de próstata y, sobre todo, para preparar la cirugía del feocromocitoma, siempre antes del betabloqueante.',
    enCaso: {
      20: 'El alfabloqueante dilata las arteriolas que las catecolaminas contraían y el betabloqueante frena la taquicardia: la presión vuelve a lo normal. Es la preparación para operar el tumor.',
    },
    aviso: AVISO_FARMACOS,
    consulta:
      'Es el que más hipotensión ortostática da, sobre todo con las primeras dosis y al subirlas: levantarse de la camilla despacio, quedarse sentado unos segundos antes de ponerse de pie, y cuidado al terminar el ejercicio y al salir de la piscina o del agua caliente. Riesgo de caídas en mayores.',
  },

  tiazida: {
    queEs: 'Diurético tiazídico o similar (hidroclorotiazida, clortalidona, indapamida). Fármaco de primera línea en la hipertensión.',
    queHace:
      'Bloquea la reabsorción de sodio y cloro en el túbulo distal: se orina más sodio y, con él, agua. Baja la volemia; la renina y la aldosterona suben para compensar. Al llegar más sodio al colector se pierde potasio. Con la filtración muy baja pierde eficacia.',
    enCaso: {
      21: 'Saca el sodio que sobra: la volemia y la RVP vuelven a lo normal y la presión también. El precio es el potasio bajo.',
    },
    aviso:
      'En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo. Límite del modelo: en estado estable la tiazida baja la presión con la volemia y el gasto bajos. En el paciente eso pasa al principio; al cabo de unas semanas el volumen se recupera en parte y lo que queda baja es la RVP.',
    consulta:
      'Más riesgo de deshidratación y de golpe de calor con el ejercicio en ambiente caluroso: beber durante la sesión. Algo de mareo al levantarse. Calambres nocturnos en las piernas; si el potasio baja mucho, debilidad o palpitaciones. En mayores puede bajar el sodio: confusión, inestabilidad o caídas de aparición reciente son motivo para avisar al médico. Puede subir el ácido úrico y desencadenar un ataque de gota (dolor agudo en una articulación, típico del dedo gordo del pie).',
  },

  diureticoAsa: {
    queEs: 'Diurético que actúa en el asa de Henle (furosemida, torasemida). Es el más potente.',
    queHace:
      'Bloquea la reabsorción de sodio, potasio y cloro en la rama ascendente del asa de Henle. Saca mucho volumen: se usa más en los edemas (insuficiencia cardíaca, enfermedad renal) que en la hipertensión, salvo cuando la filtración es baja. También baja el potasio, y la renina y la aldosterona suben mucho.',
    enCaso: {
      23: 'Con la filtración baja saca el volumen retenido y el potasio que sobraba: la presión vuelve a lo normal. A dosis plena se pasa: la volemia queda baja y la renina sube. La creatinina no mejora, porque el riñón sigue filtrando poco.',
    },
    aviso: AVISO_FARMACOS,
    consulta:
      'Orina abundante durante las horas siguientes a la toma: conviene saber a qué hora la toma para programar la sesión y tener un baño cerca. Mareo al levantarse y riesgo de deshidratación con calor o esfuerzo largo. Debilidad o calambres si baja el potasio. En la insuficiencia cardíaca, ganar peso en pocos días, más ahogo o más hinchazón de tobillos pueden indicar que el tratamiento no basta: avisar al médico.',
  },

  espironolactona: {
    queEs: 'Antagonista del receptor mineralocorticoide (espironolactona, eplerenona). Diurético que ahorra potasio.',
    queHace:
      'Ocupa el receptor de la aldosterona en el colector: ni la aldosterona ni el cortisol (en el regaliz) lo activan. Se reabsorbe menos sodio y se secreta menos potasio. Es el tratamiento del hiperaldosteronismo bilateral, el fármaco añadido en la hipertensión resistente y uno de los básicos en la insuficiencia cardíaca.',
    enCaso: {
      18: 'La aldosterona sigue muy alta, pero no encuentra su receptor libre: la presión y el potasio vuelven a lo normal. La renina, que estaba baja, se recupera: es la señal de que el bloqueo es suficiente.',
    },
    aviso: AVISO_FARMACOS,
    consulta:
      'Puede subir el potasio, sobre todo junto a un IECA o un ARA-II o con la función renal baja: debilidad muscular o palpitaciones son motivo para avisar al médico. Calambres en las piernas. La espironolactona puede dar aumento y dolor de las mamas en los hombres (ginecomastia); la eplerenona, mucho menos. Mareo al levantarse, como los otros diuréticos.',
  },

  calcioantagonista: {
    queEs: 'Calcioantagonista dihidropiridínico (amlodipino, nifedipino, lercanidipino). Fármaco de primera línea en la hipertensión; muy usado en mayores.',
    queHace:
      'Cierra los canales de calcio del músculo liso de las arteriolas: se relajan y baja la RVP. No depende del riñón ni del sistema renina-angiotensina, y por eso funciona igual con la renina baja. Los no dihidropiridínicos (verapamilo, diltiazem) actúan además sobre el corazón y bajan la frecuencia; el simulador no los incluye.',
    enCaso: {
      24: 'Dilata las arteriolas: la RVP y la presión vuelven a lo normal. Pero el volumen que retiene la sal sigue ahí, y el gasto sube algo. Compáralo con la tiazida en el mismo caso, que saca el volumen.',
    },
    aviso:
      'En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo. Límite del modelo: en la hipertensión sistólica del mayor la sistólica apenas baja, porque la rigidez arterial no cambia con el fármaco, y la diastólica baja mucho. En el paciente real es de los fármacos que mejor bajan la sistólica del mayor.',
    consulta:
      'Hinchazón de los dos tobillos, peor al final del día y con dosis altas. No es retención de líquido: las arteriolas dilatadas dejan pasar más presión al capilar, y por eso responde mal a los diuréticos. Si la hinchazón es de una sola pierna o duele, hay que pensar en otra causa. Enrojecimiento y calor en la cara, dolor de cabeza al principio y, a veces, palpitaciones. Mareo al levantarse. Pueden engrosarse las encías.',
  },

  // ─────────────────────────── Ejercicio (fase 5) ───────────────────────────
  // Redactado por Opus 5.5 el 16 nov 2026 a partir de docs/propuesta-fase-5.md y
  // revisado por Fable 5.2 (docs/revision-fase-5-fable.md); correcciones validadas por Edu. Cifras de la
  // consulta comprobadas en texto completo: pauta aeróbica y de fuerza y
  // hipotensión postejercicio (PMID 26423529), isométrico y umbrales de parada
  // del ACSM, 250/115 (PMID 38762832), presión de reposo sin controlar (PMID
  // 36918919), signos para parar la prueba (PMID 38896581).

  sesionAerobica: {
    queEs: 'Una sesión de ejercicio dinámico con grandes grupos musculares: andar rápido, bicicleta, correr o nadar. La rueda es la intensidad: moderada a media rueda, vigorosa al final.',
    queHace:
      'Durante el esfuerzo, la orden de la corteza motora y los receptores del músculo que trabaja activan el simpático y retiran el freno vagal: la frecuencia y el gasto suben mucho. A la vez, el músculo se dilata por sus propios metabolitos, y esa dilatación vence a la vasoconstricción simpática: la RVP baja. Resultado: la sistólica sube con el gasto y la diastólica se mantiene o baja. Al terminar, el músculo sigue dilatado unas horas y el barorreflejo se reajusta a la baja: la presión queda por debajo de la de antes (hipotensión postejercicio).',
    enCaso: {
      25: 'Con intensidad moderada la frecuencia y el gasto suben mucho, la RVP baja y la sistólica sube mientras la diastólica se mantiene. Cambia a «Al terminar»: la presión queda algo por debajo de la de antes, sin llegar a cambiar la flecha. Se ve mejor en el caso 28.',
      26: 'Con el betabloqueante la frecuencia parte de más abajo y, con el mismo esfuerzo, se queda en lo normal; la sistólica sube menos. La escala de Borg sigue sirviendo: por eso se dosifica con ella.',
      28: 'Al terminar una sesión aeróbica intensa, la presión del paciente con dieta alta en sal vuelve a lo normal durante unas horas. Cambia a «Antes» y a «Durante» para comparar.',
      29: 'Al terminar, la dilatación del músculo se suma a la del alfabloqueante: la RVP queda por debajo de lo normal. Es el momento de más riesgo de mareo al levantarse.',
      32: 'El simpático ya estaba casi al máximo por las catecolaminas del tumor y el esfuerzo lo lleva al tope. La sistólica del modelo apenas cambia y la diastólica baja; en el paciente el esfuerzo puede desencadenar una crisis, que el modelo no reproduce.',
      33: 'La frecuencia y el gasto, ya altos en reposo, llegan al tope de escala con el esfuerzo vigoroso.',
    },
    aviso:
      'En el simulador la sesión se calcula sobre el estado estable del paciente, y el efecto es cualitativo. Dos límites del modelo: la bajada de después de la sesión sale igual en el sano que en el hipertenso, cuando en el paciente es mayor cuanto más alta era la presión; y no hay postura ni calor: el mareo al levantarse y la deshidratación los cuentan los avisos.',
    consulta:
      'Es la base del tratamiento no farmacológico de la hipertensión: de 30 a 60 minutos casi todos los días, seguidos o en tandas de 10 minutos o más, hasta sumar al menos 150 a la semana, a intensidad moderada (11 a 13 en la escala de Borg de 6 a 20: se puede hablar, pero no cantar). Progresar poco a poco, sobre todo en intensidad. Conviene tomar la presión antes de empezar: si está muy alta y sin controlar, no es día de sesión intensa y hay que comentarlo con su médico. Terminar con una vuelta a la calma, sin pararse de golpe ni levantarse bruscamente: la presión baja después de la sesión, y la media hora o la hora siguiente también es un momento de riesgo. Parar si aparece dolor u opresión en el pecho, mareo o sensación de desmayo, ahogo desproporcionado al esfuerzo, palpitaciones, dolor de cabeza intenso o agotamiento. Los umbrales de 250 mmHg de sistólica o 115 de diastólica son para parar una prueba de esfuerzo: no son un objetivo de la sesión. Con betabloqueante, dosificar con la escala de Borg o el test del habla, no con la frecuencia.',
  },

  sesionFuerza: {
    queEs: 'Una sesión de ejercicio contra resistencia: pesas, máquinas, bandas elásticas o contracciones isométricas. La rueda es la intensidad: al final, cargas altas con la respiración bloqueada (maniobra de Valsalva).',
    queHace:
      'El simpático y la frecuencia suben, como en el aeróbico, pero el músculo contraído comprime sus propios vasos y la RVP sube en lugar de bajar. Con la maniobra de Valsalva sube además la presión dentro del tórax. Suben las dos presiones, la sistólica y la diastólica. En culturistas, con cargas casi máximas hasta el fallo y la respiración bloqueada, se han medido más de 300/200 mmHg.',
    enCaso: {
      27: 'Con cargas altas suben la RVP, la sistólica y la diastólica. Compáralo con el caso 25: en el aeróbico la diastólica se mantiene.',
    },
    aviso:
      'En el simulador la sesión se calcula sobre el estado estable del paciente, y el efecto es cualitativo. Límite del modelo: la sesión de fuerza no tiene «Al terminar». En el paciente la presión también baja algo después de una sesión de fuerza.',
    consulta:
      'En el hipertenso es útil y seguro si se dosifica: 2 o 3 días a la semana, de 8 a 10 ejercicios de los grandes grupos musculares, 2 o 3 series de 10 a 12 repeticiones con cargas moderadas (60–80 % de una repetición máxima), descanso entre series y respiración continua: soltar el aire en el esfuerzo. Evitar bloquear la respiración, las cargas máximas y llegar al fallo, sobre todo con la presión mal controlada. Con un alfabloqueante o un diurético, levantarse despacio del banco o del suelo. Las mismas señales para parar que en el aeróbico.',
  },

  entrenoAerobico: {
    queEs:
      'Ejercicio aeróbico regular, casi todos los días, mantenido durante semanas o meses. La rueda va de sedentario a entrenado.',
    queHace:
      'Mejora el endotelio (produce más óxido nítrico), baja la actividad simpática de quien la tenía alta y vuelve algo más distensibles las arterias rígidas. La RVP y la presión de reposo bajan, más cuanto más alta estaba: unos 8/5 mmHg en los hipertensos y casi nada en los normotensos. El corazón late más despacio en reposo, pero cada latido expulsa más sangre: el gasto de reposo no cambia.',
    enCaso: {
      30: 'La presión, la RVP y la volemia vuelven a lo normal y aparece bradicardia de reposo.',
      31: 'En una persona sana solo se nota la bradicardia de reposo: el gasto y la presión no cambian.',
    },
    aviso:
      'En el simulador el entrenamiento actúa en estado estable, y el efecto es cualitativo. Dos límites del modelo: con la rigidez de la edad el entrenamiento casi no baja la sistólica; y atenúa el exceso de actividad simpática venga de donde venga: en el feocromocitoma baja la frecuencia y la presión, cuando en el paciente el entrenamiento no trata el tumor.',
    consulta:
      'Es el entrenamiento más estudiado: 150 minutos a la semana o más, repartidos en casi todos los días. El efecto aparece en semanas y se pierde en semanas si se deja: lo que cuenta es la constancia. Además, en el hipertenso cada sesión deja la presión 5–7 mmHg más baja durante horas. Sumar fuerza dos o tres días a la semana. El ejercicio se suma a la medicación, no la sustituye: si la presión mejora, es el médico quien ajusta el tratamiento. La bradicardia de reposo de una persona entrenada es normal; si se acompaña de mareo o desmayos, no.',
  },

  entrenoFuerza: {
    queEs: 'Ejercicio de fuerza dinámica regular durante meses, dos o tres días a la semana.',
    queHace:
      'Baja la presión de reposo: unos 4–5 mmHg la sistólica en el metaanálisis más reciente, parecido al aeróbico, aunque con menos estudios en hipertensos. El mecanismo está menos estudiado; en el simulador atenúa la RVP alta. No cambia la rigidez arterial ni da bradicardia.',
    enCaso: {},
    aviso:
      'En el simulador el entrenamiento actúa en estado estable, y el efecto es cualitativo. Límite del modelo: baja la RVP y la diastólica, pero no la sistólica, al contrario que en los metaanálisis.',
    consulta:
      'Mejor combinado con el aeróbico: las guías recomiendan los dos en la misma semana, y en el metaanálisis más reciente el combinado es el que más baja la sistólica después del isométrico. Además mantiene la masa muscular, clave en mayores. Dosis y precauciones, las de la sesión de fuerza: cargas moderadas y respiración continua.',
  },

  entrenoIsometrico: {
    queEs: 'Contracciones isométricas mantenidas, como la prensión de mano o la sentadilla apoyada en la pared, tres días a la semana durante semanas.',
    queHace:
      'Es el entrenamiento que más baja la presión de reposo en los metaanálisis (unos 8/4 mmHg), con estudios más pequeños y cortos que los del aeróbico. El mecanismo no está claro: en el simulador atenúa la RVP alta. No da bradicardia ni cambia la rigidez.',
    enCaso: {},
    aviso:
      'En el simulador el entrenamiento actúa en estado estable, y el efecto es cualitativo. Límite del modelo: baja la RVP y la diastólica, pero no la sistólica, al contrario que en los metaanálisis.',
    consulta:
      'Tres días a la semana: cuatro contracciones de dos minutos con uno a cuatro minutos de descanso, por ejemplo prensión de mano al 30 % de la fuerza máxima o sentadilla apoyada en la pared. El efecto se ve a partir de unas cuatro semanas. Respirar durante la contracción, sin bloquear el aire. A esa intensidad la presión sube poco durante la contracción; por encima de la mitad de la fuerza máxima sube mucho. Se suma al aeróbico, no lo sustituye. Con la presión muy alta o mal controlada, esperar a que su médico la controle.',
  },
};
