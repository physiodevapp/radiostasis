import type { Reto } from '../../motor/tipos';

/**
 * Modo reto (fase 6): diez pacientes con las causas ocultas, de menos a más
 * difícil: cuatro de una causa, cuatro de dos y dos con un fármaco ya puesto.
 * Fase 7: el reto 11, de una causa, distingue la estenosis unilateral del tumor
 * de renina (los dos con renina muy alta y creatinina normal).
 * Ninguno es una «Combinación hipotética» y ninguna clave llega al tope de
 * escala (tests/retos.test.ts). Las claves son las flechas del modelo en estado
 * estable: si una recalibración las cambia, el test falla y hay que revisar el
 * reto. Revisados por Fable 5.2 (docs/revision-fase-6-fable.md). Regla: si
 * el enunciado da 65 años o más, o nombra tabaco, colesterol o diabetes, esa
 * rueda va en la solución (si no, quien razona bien recibe «Sobra»).
 */
export const retos: Reto[] = [
  // ── Una causa ──
  {
    id: 1, nivel: 'una', causas: { hiperaldo: 0.7 },
    enunciado: 'Mujer de 46 años, derivada a fisioterapia por cervicalgia. En la consulta, presión de 158/98 en tres tomas. Refiere cefaleas y algún calambre muscular. No toma fármacos.',
    pistas: [
      'Mira el sistema renina-angiotensina-aldosterona: ¿van la renina y la aldosterona en la misma dirección?',
      'El potasio también habla: ¿qué hormona lo elimina por la orina?',
    ],
    delata: [
      'Renina baja con aldosterona muy alta: la aldosterona no la está pidiendo el riñón; la suprarrenal la fabrica por su cuenta.',
      'Potasio bajo: la aldosterona lo elimina por la orina (de ahí los calambres).',
      'Volemia alta: retiene sodio y agua, y eso sube la presión.',
    ],
    claves: { renina: '↓', aldo: '↑↑', potasio: '↓', volemia: '↑' },
  },
  {
    id: 2, nivel: 'una', causas: { regaliz: 1 },
    enunciado: 'Varón de 44 años. Desde que empezó a preparar unas oposiciones, hace cuatro meses, toma cada día varias infusiones y caramelos para calmar los nervios. Ahora tiene la presión alta y se nota flojo.',
    pistas: [
      'El cuadro se parece al del exceso de aldosterona, pero mira la aldosterona en la analítica.',
      'Algo activa el receptor de la aldosterona sin ser aldosterona. ¿Qué toma a diario?',
    ],
    delata: [
      'Renina y aldosterona bajas, pero potasio bajo y volemia alta: el receptor de la aldosterona está activado por otra cosa.',
      'El regaliz (en algunos caramelos e infusiones) bloquea la enzima del riñón que aparta el cortisol de ese receptor: el cortisol lo activa como si fuera aldosterona.',
      'Por eso imita un hiperaldosteronismo, pero con la aldosterona baja.',
    ],
    claves: { renina: '↓', aldo: '↓', potasio: '↓', volemia: '↑' },
  },
  {
    id: 3, nivel: 'una', causas: { feo: 0.7 },
    enunciado: 'Mujer de 39 años. Tiene episodios de cefalea intensa, sudoración y palpitaciones; en uno le midieron 210/120, y entre ellos la presión sigue alta. Está más delgada y nerviosa.',
    pistas: [
      'Mira «Corazón y simpático»: ¿qué está disparado?',
      'La volemia está baja aunque la presión esté muy alta. Y la resistencia vascular, ¿sube o baja?',
    ],
    delata: [
      'Simpático muy alto, con la frecuencia y el gasto disparados: hay catecolaminas de sobra.',
      'Resistencia vascular alta: las arteriolas están contraídas. En el hipertiroidismo, que también acelera el corazón, se abren.',
      'Volemia baja: la presión alta hace orinar más sodio.',
    ],
    claves: { simpatico: '↑↑', fc: '↑↑', rvp: '↑', volemia: '↓' },
  },
  {
    id: 4, nivel: 'una', causas: { tiroides: 1 },
    enunciado: 'Mujer de 31 años. Ha perdido 5 kilos sin hacer dieta, no aguanta el calor, duerme mal y nota el corazón acelerado. Presión 150/62.',
    pistas: [
      'La sistólica sube y la diastólica baja. ¿Qué mueve cada una?',
      'Compara el gasto cardíaco con la resistencia vascular periférica.',
    ],
    delata: [
      'Gasto cardíaco muy alto: sube la sistólica.',
      'Resistencia vascular muy baja (los tejidos piden más sangre y las arteriolas se abren): baja la diastólica.',
      'Presión de pulso ancha en una persona joven que adelgaza y no aguanta el calor: hipertiroidismo.',
    ],
    claves: { gc: '↑↑', rvp: '↓↓', pas: '↑', pad: '↓' },
  },
  // ── Dos causas ──
  {
    id: 5, nivel: 'dos', causas: { edad: 0.8, factores: 0.8 },
    enunciado: 'Varón de 74 años, fumador desde los 20 y con diabetes tipo 2. Presión 172/64. La analítica es normal.',
    pistas: [
      'Mira los vasos: ¿cómo late la arteria grande y qué hay en su pared?',
      'La diastólica baja aunque la sistólica esté muy alta: piensa en la aorta.',
    ],
    delata: [
      'Rigidez muy alta: la aorta ya no amortigua el latido; sube la sistólica y baja la diastólica.',
      'Placas en la arteria grande: el tabaco y la diabetes suman aterosclerosis a la de la edad.',
      'Analítica normal: ni el riñón ni las hormonas explican esta presión.',
    ],
    claves: { rigidez: '↑↑', placa: '↑↑', pas: '↑↑', pad: '↓' },
  },
  {
    id: 6, nivel: 'dos', causas: { caidaFiltracion: 0.7, sal: 0.7 },
    enunciado: 'Mujer de 57 años con los tobillos hinchados por la tarde. Come a menudo precocinados y embutido. Presión 168/102.',
    pistas: [
      'En la analítica hay dos alteraciones distintas: una es del riñón y la otra, de lo que come.',
      'Mira primero la creatinina y el potasio; después, la natremia y la ADH.',
    ],
    delata: [
      'Creatinina y potasio altos con la filtración muy baja: el riñón filtra poco.',
      'Natremia alta con la ADH y la volemia altas: entra más sal de la que el riñón enfermo puede eliminar. En el paciente el sodio apenas sube, porque con la sal se retiene agua: lo que se ve son los tobillos hinchados.',
      'Juntas suben la presión más que cada una por separado: el riñón enfermo es sensible a la sal.',
    ],
    claves: { creatinina: '↑', potasio: '↑', tfg: '↓↓', natremia: '↑' },
  },
  {
    id: 7, nivel: 'dos', causas: { estenosis: 1, factores: 1 },
    enunciado: 'Varón de 58 años, fumador y con el colesterol alto. Su presión estaba controlada solo con dieta, pero en pocos meses ha subido a 186/94.',
    pistas: [
      'La renina está alta aunque la presión también lo está: ¿por qué sigue pidiendo presión el riñón?',
      'Mira también las placas: la aterosclerosis no se queda en la aorta.',
    ],
    delata: [
      'Renina y aldosterona altas, con la filtración baja y la creatinina alta: al riñón le llega poca presión.',
      'Placas y rigidez muy altas: los factores de riesgo explican la aterosclerosis, que también estrecha la arteria renal.',
      'Una hipertensión que se descontrola en pocos meses en una persona con factores de riesgo hace sospechar una estenosis aterosclerótica.',
    ],
    claves: { renina: '↑', aldo: '↑', creatinina: '↑', placa: '↑↑' },
  },
  {
    id: 8, nivel: 'dos', causas: { edad: 0.7, tiroides: 0.7 },
    enunciado: 'Mujer de 77 años. En los últimos meses ha perdido peso, está inquieta y duerme mal. Presión 178/60.',
    pistas: [
      'La presión de pulso es muy ancha. ¿Hay una sola razón o dos?',
      'El gasto y la frecuencia están altos y la resistencia, baja. Y la aorta, ¿cómo está a esta edad?',
    ],
    delata: [
      'Gasto y frecuencia altos con la resistencia baja: hipertiroidismo. En la persona mayor da pocos síntomas: a veces solo pérdida de peso, cansancio o una fibrilación auricular.',
      'Rigidez de la aorta por la edad: el volumen de más no se amortigua y la sistólica sube mucho.',
      'Las dos causas abren la presión de pulso: la sistólica sube y la diastólica baja.',
    ],
    claves: { gc: '↑', fc: '↑', rvp: '↓', rigidez: '↑' },
  },
  // ── Con un fármaco ya puesto ──
  {
    id: 9, nivel: 'farmaco', causas: { estenosis: 1 }, farmacos: { ieca: 1 },
    enunciado: 'Mujer de 44 años con una hipertensión difícil de controlar desde los 35. Hace dos semanas empezó a tomar un IECA (míralo en la pestaña «Fármacos»). La presión ha bajado, pero en la analítica de control han subido la creatinina y el potasio.',
    pistas: [
      'El IECA frena la formación de angiotensina II. ¿Cuándo la necesita el riñón para seguir filtrando?',
      'Mira la renina: el riñón sigue pidiendo presión.',
    ],
    delata: [
      'Creatinina y potasio que suben al empezar un IECA: la filtración dependía de la angiotensina II.',
      'Filtración muy baja con la renina alta: al riñón le llega poca presión por una arteria estrecha.',
      'Es el aviso clásico de una estenosis de las dos arterias renales (o de un riñón único). En una mujer joven, sin placas ni rigidez, la causa habitual es la displasia fibromuscular.',
    ],
    claves: { creatinina: '↑', potasio: '↑', tfg: '↓↓', renina: '↑' },
  },
  {
    id: 10, nivel: 'farmaco', causas: { tiroides: 1 }, farmacos: { betabloqueante: 1 },
    enunciado: 'Mujer de 35 años. Por palpitaciones le han pautado un betabloqueante (míralo en la pestaña «Fármacos»). Ahora el pulso es lento, pero sigue con calor, ha perdido peso y la diastólica está baja.',
    pistas: [
      'El betabloqueante frena el corazón, pero no explica que la diastólica esté baja.',
      'Mira la resistencia vascular: ¿por qué están abiertas las arteriolas?',
    ],
    delata: [
      'Resistencia vascular baja y diastólica baja: los tejidos piden más sangre y las arteriolas se abren.',
      'El betabloqueante frena la frecuencia y el gasto, pero no trata la causa.',
      'Pérdida de peso y calor con la resistencia baja: hipertiroidismo.',
      'Volemia alta: con las arteriolas abiertas baja la presión media y el riñón retiene sodio y agua.',
    ],
    claves: { fc: '↓', rvp: '↓', pad: '↓', volemia: '↑' },
  },
  // ── Fase 7: lateralidad de la estenosis ──
  {
    id: 11, nivel: 'una', causas: { estenosis: 1 }, variantes: { estenosis: 'unilateral' },
    enunciado: 'Mujer de 31 años con una hipertensión que empezó hace un año: 156/100 en varias tomas, todavía sin tratamiento. No fuma, no toma regaliz ni anticonceptivos. En la analítica le han pedido la renina, que ha salido muy alta.',
    pistas: [
      'Renina muy alta con la presión alta: el cuerpo no la necesita. Mira la volemia: con tanta renina y tanta aldosterona, ¿por qué no ha subido?',
      'Mira la creatinina: es normal. Si los dos riñones filtraran mal, habría subido.',
    ],
    delata: [
      'Renina muy alta con la creatinina normal: la filtración de los dos riñones juntos se mantiene. Eso descarta la estenosis de las dos arterias y la caída de la filtración, pero no el tumor de renina.',
      'Volemia normal: el riñón sano expulsa el sodio que retiene el otro. Con un tumor de renina, el simulador muestra más volemia y más presión. En la paciente los dos cuadros se parecen (renina muy alta, potasio a menudo bajo) y los separa la prueba de imagen.',
      'Es una estenosis de una sola arteria renal; en una mujer joven, casi siempre por displasia fibromuscular. Ahora la franja de la estenosis marca «Unilateral»: cambia a «Bilateral» y compara.',
    ],
    claves: { renina: '↑↑', creatinina: '=', volemia: '=', pas: '↑' },
  },
];
