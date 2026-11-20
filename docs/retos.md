# Modo reto (fase 6, 17 nov 2026)

Once pacientes con las causas ocultas: cuatro de una causa, cuatro de dos y dos con un fármaco ya puesto, de menos a más difícil, y el de la lateralidad de la estenosis (fase 7). Son datos del tema (`src/temas/hipertension/retos.ts`). Este documento se genera a partir de ellos (`npm run revision-retos`); si se cambia un reto, hay que regenerarlo. Revisados por Fable 5.2 (`docs/revision-fase-6-fable.md`).

**Reglas** (vigiladas por `tests/retos.test.ts`): ningún reto es una «Combinación hipotética»; las claves son flechas del modelo en estado estable y ninguna está en el tope de escala; si una recalibración cambia una clave, el test falla.

**Corrección:** acierto si la respuesta coincide con las causas; a medias si acierta alguna (aunque falte o sobre otra); fallo si no acierta ninguna. Se eligen una o dos causas.

## Reto 1 · una causa

**Solución:** Hiperaldosteronismo primario (0.7)

**Enunciado:** Mujer de 46 años, derivada a fisioterapia por cervicalgia. En la consulta, presión de 158/98 en tres tomas. Refiere cefaleas y algún calambre muscular. No toma fármacos.

**Pistas:**

1. Mira el sistema renina-angiotensina-aldosterona: ¿van la renina y la aldosterona en la misma dirección?
2. El potasio también habla: ¿qué hormona lo elimina por la orina?

**Lo que lo delataba:**

- Renina baja con aldosterona muy alta: la aldosterona no la está pidiendo el riñón; la suprarrenal la fabrica por su cuenta.
- Potasio bajo: la aldosterona lo elimina por la orina (de ahí los calambres).
- Volemia alta: retiene sodio y agua, y eso sube la presión.

**Claves (se marcan al corregir):** Renina ↓ · Aldosterona ↑↑ · Potasio plasmático ↓ · Volemia ↑

**Presión en el modelo:** sistólica ↑, diastólica ↑

## Reto 2 · una causa

**Solución:** Regaliz (ácido glicirrícico) (1)

**Enunciado:** Varón de 44 años. Desde que empezó a preparar unas oposiciones, hace cuatro meses, toma cada día varias infusiones y caramelos para calmar los nervios. Ahora tiene la presión alta y se nota flojo.

**Pistas:**

1. El cuadro se parece al del exceso de aldosterona, pero mira la aldosterona en la analítica.
2. Algo activa el receptor de la aldosterona sin ser aldosterona. ¿Qué toma a diario?

**Lo que lo delataba:**

- Renina y aldosterona bajas, pero potasio bajo y volemia alta: el receptor de la aldosterona está activado por otra cosa.
- El regaliz (en algunos caramelos e infusiones) bloquea la enzima del riñón que aparta el cortisol de ese receptor: el cortisol lo activa como si fuera aldosterona.
- Por eso imita un hiperaldosteronismo, pero con la aldosterona baja.

**Claves (se marcan al corregir):** Renina ↓ · Aldosterona ↓ · Potasio plasmático ↓ · Volemia ↑

**Presión en el modelo:** sistólica ↑, diastólica ↑

## Reto 3 · una causa

**Solución:** Feocromocitoma (0.7)

**Enunciado:** Mujer de 39 años. Tiene episodios de cefalea intensa, sudoración y palpitaciones; en uno le midieron 210/120, y entre ellos la presión sigue alta. Está más delgada y nerviosa.

**Pistas:**

1. Mira «Corazón y simpático»: ¿qué está disparado?
2. La volemia está baja aunque la presión esté muy alta. Y la resistencia vascular, ¿sube o baja?

**Lo que lo delataba:**

- Simpático muy alto, con la frecuencia y el gasto disparados: hay catecolaminas de sobra.
- Resistencia vascular alta: las arteriolas están contraídas. En el hipertiroidismo, que también acelera el corazón, se abren.
- Volemia baja: la presión alta hace orinar más sodio.

**Claves (se marcan al corregir):** Actividad simpática ↑↑ · Frecuencia cardíaca ↑↑ · Resistencia vascular periférica (RVP) ↑ · Volemia ↓

**Presión en el modelo:** sistólica ↑↑, diastólica ↑↑

## Reto 4 · una causa

**Solución:** Hormonas tiroideas (1)

**Enunciado:** Mujer de 31 años. Ha perdido 5 kilos sin hacer dieta, no aguanta el calor, duerme mal y nota el corazón acelerado. Presión 150/62.

**Pistas:**

1. La sistólica sube y la diastólica baja. ¿Qué mueve cada una?
2. Compara el gasto cardíaco con la resistencia vascular periférica.

**Lo que lo delataba:**

- Gasto cardíaco muy alto: sube la sistólica.
- Resistencia vascular muy baja (los tejidos piden más sangre y las arteriolas se abren): baja la diastólica.
- Presión de pulso ancha en una persona joven que adelgaza y no aguanta el calor: hipertiroidismo.

**Claves (se marcan al corregir):** Gasto cardíaco (GC) ↑↑ · Resistencia vascular periférica (RVP) ↓↓ · Presión sistólica (PAS) ↑ · Presión diastólica (PAD) ↓

**Presión en el modelo:** sistólica ↑, diastólica ↓

## Reto 5 · dos causas

**Solución:** Edad (0.8) + Factores de riesgo vascular (0.8)

**Enunciado:** Varón de 74 años, fumador desde los 20 y con diabetes tipo 2. Presión 172/64. La analítica es normal.

**Pistas:**

1. Mira los vasos: ¿cómo late la arteria grande y qué hay en su pared?
2. La diastólica baja aunque la sistólica esté muy alta: piensa en la aorta.

**Lo que lo delataba:**

- Rigidez muy alta: la aorta ya no amortigua el latido; sube la sistólica y baja la diastólica.
- Placas en la arteria grande: el tabaco y la diabetes suman aterosclerosis a la de la edad.
- Analítica normal: ni el riñón ni las hormonas explican esta presión.

**Claves (se marcan al corregir):** Rigidez arterial ↑↑ · Placa de ateroma ↑↑ · Presión sistólica (PAS) ↑↑ · Presión diastólica (PAD) ↓

**Presión en el modelo:** sistólica ↑↑, diastólica ↓

## Reto 6 · dos causas

**Solución:** Caída de la filtración renal (0.7) + Ingesta de sal (0.7)

**Enunciado:** Mujer de 57 años con los tobillos hinchados por la tarde. Come a menudo precocinados y embutido. Presión 168/102.

**Pistas:**

1. En la analítica hay dos alteraciones distintas: una es del riñón y la otra, de lo que come.
2. Mira primero la creatinina y el potasio; después, la natremia y la ADH.

**Lo que lo delataba:**

- Creatinina y potasio altos con la filtración muy baja: el riñón filtra poco.
- Natremia alta con la ADH y la volemia altas: entra más sal de la que el riñón enfermo puede eliminar. En el paciente el sodio apenas sube, porque con la sal se retiene agua: lo que se ve son los tobillos hinchados.
- Juntas suben la presión más que cada una por separado: el riñón enfermo es sensible a la sal.

**Claves (se marcan al corregir):** Creatinina plasmática ↑ · Potasio plasmático ↑ · Tasa de filtración glomerular (TFG) ↓↓ · Natremia ↑

**Presión en el modelo:** sistólica ↑↑, diastólica ↑↑

## Reto 7 · dos causas

**Solución:** Estenosis de arteria renal (1) + Factores de riesgo vascular (1)

**Enunciado:** Varón de 58 años, fumador y con el colesterol alto. Su presión estaba controlada solo con dieta, pero en pocos meses ha subido a 186/94.

**Pistas:**

1. La renina está alta aunque la presión también lo está: ¿por qué sigue pidiendo presión el riñón?
2. Mira también las placas: la aterosclerosis no se queda en la aorta.

**Lo que lo delataba:**

- Renina y aldosterona altas, con la filtración baja y la creatinina alta: al riñón le llega poca presión.
- Placas y rigidez muy altas: los factores de riesgo explican la aterosclerosis, que también estrecha la arteria renal.
- Una hipertensión que se descontrola en pocos meses en una persona con factores de riesgo hace sospechar una estenosis aterosclerótica.

**Claves (se marcan al corregir):** Renina ↑ · Aldosterona ↑ · Creatinina plasmática ↑ · Placa de ateroma ↑↑

**Presión en el modelo:** sistólica ↑↑, diastólica ↑

## Reto 8 · dos causas

**Solución:** Edad (0.7) + Hormonas tiroideas (0.7)

**Enunciado:** Mujer de 77 años. En los últimos meses ha perdido peso, está inquieta y duerme mal. Presión 178/60.

**Pistas:**

1. La presión de pulso es muy ancha. ¿Hay una sola razón o dos?
2. El gasto y la frecuencia están altos y la resistencia, baja. Y la aorta, ¿cómo está a esta edad?

**Lo que lo delataba:**

- Gasto y frecuencia altos con la resistencia baja: hipertiroidismo. En la persona mayor da pocos síntomas: a veces solo pérdida de peso, cansancio o una fibrilación auricular.
- Rigidez de la aorta por la edad: el volumen de más no se amortigua y la sistólica sube mucho.
- Las dos causas abren la presión de pulso: la sistólica sube y la diastólica baja.

**Claves (se marcan al corregir):** Gasto cardíaco (GC) ↑ · Frecuencia cardíaca ↑ · Resistencia vascular periférica (RVP) ↓ · Rigidez arterial ↑

**Presión en el modelo:** sistólica ↑↑, diastólica ↓

## Reto 9 · con fármaco

**Solución:** Estenosis de arteria renal (1) · fármaco: IECA

**Enunciado:** Mujer de 44 años con una hipertensión difícil de controlar desde los 35. Hace dos semanas empezó a tomar un IECA (míralo en la pestaña «Fármacos»). La presión ha bajado, pero en la analítica de control han subido la creatinina y el potasio.

**Pistas:**

1. El IECA frena la formación de angiotensina II. ¿Cuándo la necesita el riñón para seguir filtrando?
2. Mira la renina: el riñón sigue pidiendo presión.

**Lo que lo delataba:**

- Creatinina y potasio que suben al empezar un IECA: la filtración dependía de la angiotensina II.
- Filtración muy baja con la renina alta: al riñón le llega poca presión por una arteria estrecha.
- Es el aviso clásico de una estenosis de las dos arterias renales (o de un riñón único). En una mujer joven, sin placas ni rigidez, la causa habitual es la displasia fibromuscular.

**Claves (se marcan al corregir):** Creatinina plasmática ↑ · Potasio plasmático ↑ · Tasa de filtración glomerular (TFG) ↓↓ · Renina ↑

**Presión en el modelo:** sistólica ↑, diastólica =

## Reto 10 · con fármaco

**Solución:** Hormonas tiroideas (1) · fármaco: Betabloqueante

**Enunciado:** Mujer de 35 años. Por palpitaciones le han pautado un betabloqueante (míralo en la pestaña «Fármacos»). Ahora el pulso es lento, pero sigue con calor, ha perdido peso y la diastólica está baja.

**Pistas:**

1. El betabloqueante frena el corazón, pero no explica que la diastólica esté baja.
2. Mira la resistencia vascular: ¿por qué están abiertas las arteriolas?

**Lo que lo delataba:**

- Resistencia vascular baja y diastólica baja: los tejidos piden más sangre y las arteriolas se abren.
- El betabloqueante frena la frecuencia y el gasto, pero no trata la causa.
- Pérdida de peso y calor con la resistencia baja: hipertiroidismo.
- Volemia alta: con las arteriolas abiertas baja la presión media y el riñón retiene sodio y agua.

**Claves (se marcan al corregir):** Frecuencia cardíaca ↓ · Resistencia vascular periférica (RVP) ↓ · Presión diastólica (PAD) ↓ · Volemia ↑

**Presión en el modelo:** sistólica =, diastólica ↓

## Reto 11 · una causa

**Solución:** Estenosis de arteria renal (1, unilateral)

**Enunciado:** Mujer de 31 años con una hipertensión que empezó hace un año: 156/100 en varias tomas, todavía sin tratamiento. No fuma, no toma regaliz ni anticonceptivos. En la analítica le han pedido la renina, que ha salido muy alta.

**Pistas:**

1. Renina muy alta con la presión alta: el cuerpo no la necesita. Mira la volemia: con tanta renina y tanta aldosterona, ¿por qué no ha subido?
2. Mira la creatinina: es normal. Si los dos riñones filtraran mal, habría subido.

**Lo que lo delataba:**

- Renina muy alta con la creatinina normal: la filtración de los dos riñones juntos se mantiene. Eso descarta la estenosis de las dos arterias y la caída de la filtración, pero no el tumor de renina.
- Volemia normal: el riñón sano expulsa el sodio que retiene el otro. Con un tumor de renina, el simulador muestra más volemia y más presión. En la paciente los dos cuadros se parecen (renina muy alta, potasio a menudo bajo) y los separa la prueba de imagen.
- Es una estenosis de una sola arteria renal; en una mujer joven, casi siempre por displasia fibromuscular. Ahora la franja de la estenosis marca «Unilateral»: cambia a «Bilateral» y compara.

**Claves (se marcan al corregir):** Renina ↑↑ · Creatinina plasmática = · Volemia = · Presión sistólica (PAS) ↑

**Presión en el modelo:** sistólica ↑, diastólica ↑

## Qué se oculta durante el reto

- Los mandos de las causas, su valor y la pastilla de frecuencia: el panel de causas pasa a «Respuesta» y sus placas se eligen.
- La franja de la lateralidad de la estenosis y la variante en su placa (fase 7).
- El selector de casos, «Compartir», la «Combinación hipotética», los avisos de interacción y las notas entre causas (nombrarían la causa).
- En las fichas, el valor de todas las causas (activas o no, para que no se adivinen por eliminación), su peso en «La mueven» y «Mueve a», y su nombre en «En este caso» («una causa oculta»).
- Al corregir aparece todo, y las claves se marcan en violeta en la analítica, los mecanismos y la leyenda del dial.

