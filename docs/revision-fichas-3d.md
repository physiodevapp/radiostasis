# Revisión de los textos del hito 3d (fichas)

Documento generado con `npm run revision-fichas` a partir de `src/temas/hipertension/fichas.ts`, `src/temas/hipertension/vista.ts` (capas) y `src/app/animaciones.ts` (pasos). No lo edites a mano: corrige los datos y vuelve a generarlo.

## Para la sesión de revisión (Fable 5.2)

**Estado:** revisado por Fable 5.2 el 14 nov 2026 (`docs/revision-fichas-3d-fable.md`). Las correcciones de texto están aplicadas; de los cuatro «Cambios que tocarían el modelo», el 1 (frecuencia del hiperaldosteronismo) y el 4 (texto de la relación 39) están aplicados; el 2 (sistólica del hipotiroidismo) queda para una recalibración y el 3 (diabetes insípida) se deja como está. La lista siguiente sirve para revisiones futuras.

Redactado por Opus 5.5 el 14 nov 2026 a partir de `docs/modelo-v2.1.md` (matices D1–D6 y decisiones O1–O6) y de la fisiología estándar; fuentes de cada relación en `docs/fuentes.md`. El 19 nov 2026 los avisos se reescribieron como matices clínicos, errores frecuentes o límites del modelo (`docs/revision-fuentes-fable.md`).

Qué revisar en cada ficha:

1. **Exactitud fisiológica** de «Qué es», «Qué hace» y «En este caso». «En este caso» debe cuadrar con las flechas del modelo calibrado en estado estable (tabla de casos de `docs/modelo-v2.1.md`).
2. **Avisos (⚠)**: que recojan un matiz clínico, un error frecuente o un límite del modelo, y que sean correctos.
3. **Tono y extensión**: español de España, frases cortas, para estudiantes de grado; 150–200 palabras por ficha. Sin cifras clínicas que el modelo no tiene.
4. **Puntos dudosos** que conviene mirar en especial:
   - Regaliz: el umbral (unos 50 g de regaliz o 100 mg de ácido glicirrícico al día durante dos semanas); comprobar la cifra y su fuente.
   - Estenosis: displasia fibromuscular «en mujeres jóvenes».
   - Hiperaldosteronismo: «causa endocrina más frecuente de hipertensión secundaria» frente a la etiqueta «rara» de la rueda.
   - Caída de la filtración: que una obstrucción por cálculos tenga que ser bilateral (o en riñón único) para bajar la TFG total.
   - SIADH: el texto de la sed (límite del modelo).
   - Animaciones: secuencia de la aldosterona (receptor citoplasmático → núcleo → canales ENaC y bombas), 11β-HSD2, mácula densa y células granulares, y la formación de la placa.

El texto «En este caso» que no está escrito a mano lo genera la interfaz a partir del modelo, con estas plantillas (en `src/app/ficha.ts`): «Sube. Tira hacia arriba sobre todo X (↑). Frena Y (↓).», «Normal: X tira hacia arriba e Y hacia abajo, y se compensan.» y «Normal: en este caso nada lo mueve de forma apreciable.». Cada relación lleva una etiqueta: «tira hacia arriba», «tira hacia abajo», «la que más pesa», «casi no influye ahora», «actúa desde «Días»».

Devuelve las correcciones como una tabla (nodo, apartado, texto actual, propuesta, motivo) para que Edu las valide antes de aplicarlas.

### Fase 4: fármacos (revisada)

**Estado:** revisado por Fable 5.2 el 16 nov 2026 (`docs/revision-fase-4-fable.md`); las 46 correcciones, el aviso «Cuidado con la deshidratación» y los cambios del modelo 1, 2, 4 y 6 están aplicados con el visto bueno de Edu (el 3 y el 5, no). La lista siguiente sirve para revisiones futuras.

Redactado por Opus 5.5 el 16 nov 2026: las 8 fichas de la sección «Fármacos», con el apartado «En la consulta de fisioterapia»; los textos de los casos 15 a 24 («Qué mirar» y nota, en `src/temas/hipertension/vista.ts` y `casos.ts`) y los avisos de interacción (`src/temas/hipertension/avisos.ts`) van al final de este documento. Qué revisar además de lo anterior:

1. **Farmacología**: mecanismo, lugar de acción y efectos en la analítica de cada familia; que «En este caso» cuadre con las flechas de los casos 15 a 24.
2. **Orientación a la fisioterapia**: que «En la consulta de fisioterapia» recoja lo que importa en la sesión (hipotensión ortostática, frecuencia cardíaca y ejercicio con betabloqueantes, calambres con diuréticos, edemas con calcioantagonistas…), sin consejos que correspondan al médico.
3. **Avisos de interacción**: que el nivel («Contraindicado», «No se asocian», «Vigilar el potasio») y el texto sean correctos.
4. **Límites del modelo** que conviene contar o no: el feocromocitoma con solo betabloqueante no muestra la crisis; en la hipertensión sistólica del mayor el calcioantagonista baja sobre todo la diastólica.

### Fase 5: ejercicio (revisada)

**Estado:** revisado por Fable 5.2 el 16 nov 2026 (`docs/revision-fase-5-fable.md`); las 34 correcciones, el aviso «El entrenamiento no trata el tumor» y los cambios del modelo 1 a 4 están aplicados con el visto bueno de Edu (el 5 se cuenta en los textos). La lista siguiente sirve para revisiones futuras.

Redactado por Opus 5.5 el 16 nov 2026: las 5 fichas de la sección «Ejercicio», con «En la consulta de fisioterapia»; los textos de los casos 25 a 33 («Qué mirar» y nota) y los avisos del ejercicio van al final de este documento. Modelo y fuentes en `docs/modelo-v2.1.md` («Cambios de la fase 5»). Qué revisar además de lo anterior:

1. **Fisiología del ejercicio**: respuesta aguda (simpático, retirada vagal, vasodilatación del músculo, sistólica y diastólica en el aeróbico y en la fuerza), hipotensión postejercicio y adaptaciones del entrenamiento; que «En este caso» cuadre con las flechas de los casos 25 a 33.
2. **Dosificación y seguridad** en «En la consulta de fisioterapia»: pautas (150 min/semana, Borg 11–13, fuerza al 60–80 % de 1RM, isométrico 4 × 2 min), señales para parar, umbrales del ACSM (250/115, «establecidos de forma arbitraria» según Edwards 2024, PMID 38762832) y cuándo no hacer ejercicio intenso. No se ha encontrado en texto completo el umbral de 200/110 en reposo ni la caída de la sistólica de más de 10 mmHg: no se citan.
3. **Avisos del ejercicio**: nivel y texto (feocromocitoma, tiroides, betabloqueante y Borg, alfabloqueante al terminar, deshidratación y calor, Valsalva).
4. **Límites que conviene contar**: el modelo no tiene postura (la hipotensión ortostática del alfabloqueante solo la cuenta el aviso); la fuerza y el isométrico bajan la diastólica pero no la sistólica; con la rigidez de la edad el entrenamiento casi no baja la sistólica.

## Causas

### C1 · Edad

**Qué es.** Los años que tiene la persona. Es el factor que más pesa en la hipertensión y el único que no se puede evitar.

**Qué hace.** Con los años, las fibras elásticas de la pared de las arterias grandes se fragmentan y el colágeno aumenta: la arteria se vuelve rígida. Una arteria rígida no amortigua el latido, así que sube la sistólica y baja algo la diastólica. También suma años de exposición a los factores de riesgo, que favorecen la placa.

**Botón** «Ver las capas en el vaso»

**En este caso**

- Caso 1 (Edad avanzada con factores de riesgo): Junto con los factores de riesgo, la edad deja la rigidez muy alta. La sistólica sube mucho y la diastólica baja: es la hipertensión sistólica aislada del mayor. La analítica es normal.

### C2 · Factores de riesgo vascular

**Qué es.** Tabaco, LDL alto, diabetes, obesidad y sedentarismo, juntos en una sola rueda.

**Qué hace.** Dañan el endotelio y ponen en marcha la aterosclerosis: placa en las arterias grandes, que las vuelve más rígidas. Además, la disfunción del endotelio y el remodelado de las arteriolas suben un poco la resistencia vascular periférica.

**Animación:** placa · botón «Ver las capas en el vaso»

**En este caso**

- Caso 1 (Edad avanzada con factores de riesgo): Forman placas grandes en la arteria y aceleran la rigidez de la edad. La subida de la sistólica viene sobre todo de esa rigidez; la RVP sube poco.

> ⚠ Un error frecuente es pensar que la placa sube la presión porque estrecha la arteria. La placa está en las arterias grandes y no estrecha las arteriolas, donde está la resistencia. Los factores de riesgo suben la presión porque endurecen las arterias grandes y dañan el endotelio de las arteriolas.

### C3 · Ingesta de sal

**Qué es.** Cuánta sal (cloruro sódico) se toma con la dieta. La mayor parte no sale del salero: ya viene en los alimentos procesados. Hacia la izquierda, dieta baja en sal.

**Qué hace.** El sodio concentra el medio interno: sube la osmolaridad, se libera ADH y aparece la sed, y se retiene y se bebe agua hasta diluirlo. El volumen extra sube primero el gasto cardíaco; con el tiempo los tejidos se defienden del exceso de flujo, el gasto vuelve a lo normal y es la resistencia la que sostiene la hipertensión. La renina y la aldosterona bajan.

**En este caso**

- Caso 3 (Dieta alta en sal): En «Minutos» solo se mueve el agua: osmolaridad, ADH y sed suben y la diuresis cae, pero la presión no cambia. En «Días» el volumen retenido sube el gasto y la sistólica; la diuresis sigue algo baja. En estado estable el gasto vuelve a lo normal, la RVP sostiene la presión y se orina lo que se ingiere.
- Caso 14 (Dieta baja en sal): Con poca sal el riñón conserva sodio: suben la renina y la aldosterona. La volemia baja algo y la orina sale menos concentrada, pero la presión apenas cambia.

> ⚠ Con mucha sal se orina menos solo los primeros días. En estado estable se orina lo que se ingiere. Además, no todas las personas responden igual: la presión de algunas sube mucho con la sal y la de otras, casi nada (sensibilidad a la sal).

### C4 · Hormonas tiroideas

**Qué es.** Nivel de hormonas tiroideas (T3 y T4). A la derecha, hipertiroidismo; a la izquierda, hipotiroidismo.

**Qué hace.** En exceso aceleran el corazón y aumentan su fuerza: sube mucho el gasto cardíaco. A la vez, las hormonas relajan el músculo liso de las arteriolas y el mayor metabolismo de los tejidos las dilata aún más: baja la RVP. Resultado: sube la sistólica y baja la diastólica. Además se activa el sistema renina-angiotensina-aldosterona, que retiene sodio. En defecto pasa lo contrario: gasto bajo y RVP alta, con hipertensión diastólica.

**En este caso**

- Caso 2 (Hipertiroidismo): El gasto sube mucho, con la frecuencia y la contractilidad altas, y la RVP cae: sube la sistólica y baja la diastólica. La renina y la aldosterona suben: aumenta la respuesta de los receptores β del riñón, que liberan renina, y la renina arrastra a la aldosterona.
- Caso 13 (Hipotiroidismo): El corazón va más despacio y con menos fuerza y la RVP sube mucho: la diastólica sube. La sistólica queda casi normal, en parte porque las arterias grandes se vuelven algo más rígidas y eso contrarresta el gasto bajo. La presión de pulso se estrecha: es una causa de hipertensión diastólica.

> ⚠ Un error frecuente es pensar que las hormonas tiroideas hacen liberar más adrenalina. La adrenalina no sube: lo que aumenta, y poco, es la sensibilidad del corazón a ella. La taquicardia se debe sobre todo al efecto directo de las hormonas sobre el corazón. La renina también sube, sin que haya más adrenalina: aumenta la respuesta de los receptores β, que en el riñón liberan renina, y el sistema renina-angiotensina queda más activo.

### C5 · Secreción de ADH autónoma

**Qué es.** ADH que se segrega sin hacer caso a sus estímulos. A la derecha, SIADH (secreción inadecuada); a la izquierda, diabetes insípida central (no hay ADH), que hoy también se llama déficit de arginina-vasopresina. El SIADH aparece con lesiones del sistema nervioso central (traumatismo, hemorragia, meningitis), con enfermedades del pulmón como la neumonía y con algunos fármacos. También lo causan tumores que fabrican ADH por su cuenta, sobre todo el carcinoma microcítico de pulmón.

**Qué hace.** Fuera del centro, la rueda fija la ADH. Con SIADH el riñón retiene agua sin sal: el plasma se diluye (hiponatremia) y la orina sale concentrada cuando debería salir diluida. Con diabetes insípida se orina mucho y muy diluido; mientras haya agua, la sed lo compensa.

**Animación:** adh

**En este caso**

- Caso 4 (SIADH): La presión apenas cambia: el riñón escapa del exceso de volumen. Lo que queda es la analítica: natremia muy baja con orina muy concentrada.
- Caso 12 (Diabetes insípida central): Mucha orina y muy diluida. Con acceso libre al agua, la sed compensa: la sistólica baja poco, la diastólica no cambia y la creatinina no sube. Baja la rueda de acceso al agua para ver qué pasa sin beber.

> ⚠ El SIADH casi nunca causa hipertensión: el riñón escapa del exceso de volumen y queda una hiponatremia con presión casi normal. En la diabetes insípida, si la persona puede beber lo que necesita, la creatinina suele ser normal.

### C6 · Estenosis de arteria renal

**Qué es.** Estrechamiento de la arteria que lleva la sangre al riñón, casi siempre por una placa de ateroma. La segunda causa es la displasia fibromuscular, mucho más frecuente en mujeres. Puede estrechar una sola arteria (unilateral, lo más frecuente), las dos (bilateral) o la de un riñón único: el de quien solo tiene uno, de nacimiento, por una operación o por un trasplante. Al girar esta rueda aparece una franja sobre los mandos para elegir cuál; empieza en la bilateral, que es la del caso 5.

**Qué hace.** Baja la presión que llega a la arteriola aferente, y el riñón responde como si faltara presión en todo el cuerpo: libera renina, sube la angiotensina II y la aldosterona, retiene sodio y agua y contrae las arteriolas. La presión sube por volumen y por resistencia, no por el estrechamiento en sí: las arterias renales son solo dos entre todas las del cuerpo y estrecharlas apenas cambia la resistencia periférica total. Si la estenosis es unilateral, el riñón sano recibe esa presión alta, expulsa el sodio y sostiene la filtración: no hay volumen de más ni creatinina alta, y la hipertensión depende de la renina del riñón afectado. Con los años se suman otros mecanismos y la presión depende menos de la renina: el simulador muestra la fase inicial.

**Animación:** renina

**En este caso**

- Caso 5 (Estenosis renal bilateral): Bajan la perfusión renal y la filtración, y por eso sube la creatinina. La renina sube, pero menos que con un tumor de renina, porque el volumen retenido la frena en parte. La presión sube por volumen y por RVP.
- Caso 34 (Estenosis renal unilateral): Solo una arteria está estrecha. El riñón sano compensa lo que el otro deja de filtrar y expulsa el sodio: la creatinina y la volemia quedan normales. El riñón afectado sigue liberando renina, que sube más que en la bilateral porque no hay volumen de más que la frene. La presión sube por la RVP, menos que en la bilateral.

### C7 · Caída de la filtración renal

**Qué es.** Enfermedades que bajan la filtración glomerular de los dos riñones. La rueda junta dos mecanismos: membrana dañada (glomerulonefritis) y obstrucción de la salida de la orina (cálculos).

**Qué hace.** Se filtra menos: se elimina menos sodio y agua, sube la volemia y con ella la presión. La creatinina, que se elimina casi solo por filtración, se acumula. Si la caída es grande, también sube el potasio.

**En este caso**

- Caso 6 (Caída de la filtración): La creatinina sube mucho y el potasio sube: el problema está en el riñón. La presión sube por el volumen retenido. Compara la diuresis en «Días» y en estado estable.

> ⚠ La glomerulonefritis es una inflamación del glomérulo, casi siempre de causa inmunitaria; no es una infección del riñón. Una obstrucción solo baja la filtración total si afecta a los dos riñones o a un riñón único: si se obstruye uno, el otro compensa.

### C8 · Tumor secretor de renina

**Qué es.** Tumor de las células yuxtaglomerulares del riñón que segrega renina por su cuenta (reninoma). Es muy raro.

**Qué hace.** Activa todo el sistema renina-angiotensina-aldosterona sin que falte presión: vasoconstricción y retención de sodio y agua. La filtración no cae, así que la creatinina es normal.

**Animación:** renina

**En este caso**

- Caso 7 (Tumor secretor de renina): Renina y aldosterona muy altas, con potasio bajo. Es la hipertensión más intensa de las de origen renal: la angiotensina II contrae las arteriolas (mira la luz de la arteriola). La creatinina es normal.

### C9 · Hiperaldosteronismo primario

**Qué es.** La corteza suprarrenal segrega aldosterona por su cuenta, por un adenoma o por hiperplasia de las dos glándulas. Es la causa más frecuente de hipertensión secundaria de origen endocrino, y mucho menos rara de lo que se creía: pasa a menudo sin diagnosticar.

**Qué hace.** La aldosterona alta hace reabsorber sodio y agua y perder potasio. El volumen retenido sube la presión y frena la renina: renina baja con aldosterona alta es la pista que lo delata.

**Animación:** aldosterona

**En este caso**

- Caso 8 (Hiperaldosteronismo primario): Renina baja, aldosterona alta y potasio bajo: la aldosterona no viene del sistema renina-angiotensina. Compáralo con el tumor de renina (las dos altas) y con el regaliz (las dos bajas).

> ⚠ En el simulador el potasio baja, pero en la práctica solo lo tiene bajo una minoría de los pacientes: un potasio normal no descarta el hiperaldosteronismo.

### C10 · Feocromocitoma

**Qué es.** Tumor de la médula suprarrenal que segrega catecolaminas: adrenalina y noradrenalina. Si nace fuera de ella, en los ganglios simpáticos, se llama paraganglioma.

**Qué hace.** Las catecolaminas actúan como un simpático al máximo: aceleran el corazón, aumentan su fuerza y contraen las arteriolas. Suben mucho el gasto y la RVP, y con ellos las dos presiones, ya en minutos.

**En este caso**

- Caso 9 (Feocromocitoma): El simpático dispara la frecuencia, el gasto y la RVP: las dos presiones suben mucho ya en «Minutos». La volemia baja porque la presión alta hace orinar más sodio.

> ⚠ El simulador muestra una hipertensión mantenida. En el paciente real también puede aparecer en crisis, con dolor de cabeza, sudoración y palpitaciones.

### C11 · Regaliz (ácido glicirrícico)

**Qué es.** Tomar mucho regaliz de forma continuada. Su ácido glicirrícico, que el intestino transforma en ácido glicirretínico, bloquea una enzima del riñón.

**Qué hace.** En la célula del colector, la enzima 11β-HSD2 convierte el cortisol en cortisona, que no activa el receptor de la aldosterona. Con regaliz la enzima se bloquea y el cortisol, mucho más abundante que la aldosterona, ocupa el receptor: se reabsorbe sodio, se pierde potasio y sube la volemia. El volumen frena la renina y la aldosterona.

**Animación:** regaliz

**En este caso**

- Caso 10 (Regaliz): Renina y aldosterona bajas con potasio bajo: el receptor mineralocorticoide se activa sin aldosterona. Compáralo con el hiperaldosteronismo, donde la aldosterona está alta.

> ⚠ Unos 50 gramos de dulce de regaliz al día durante dos semanas ya suben algo la presión. Lo que cuenta es el ácido glicirrícico, que se mide en miligramos: bastan unos 100 al día. Cada producto lleva una cantidad distinta.

### C12 · Acceso al agua

**Qué es.** Si la persona puede beber. A la derecha, acceso libre; a la izquierda, sin agua (deshidratación por no beber).

**Qué hace.** Sin beber se sigue perdiendo agua por la respiración, el sudor y la orina obligada: baja la volemia y el plasma se concentra. Se disparan ADH, sed, renina y aldosterona, pero sin agua no hay con qué recuperar el volumen y la presión no sube. Con algo de agua, la sed compensa y casi no pasa nada: la rueda responde sobre todo en su último tramo, cerca de «nulo».

**En este caso**

- Caso 11 (Deshidratación): La volemia cae mucho y la sistólica baja, pero la diastólica no baja, incluso sube algo: el simpático y la RVP compensan. Orina escasa y muy concentrada; renina y aldosterona muy altas, y la creatinina sube.
- Caso 12 (Diabetes insípida central): Con acceso libre, la sed compensa la diabetes insípida. Gira esta rueda hasta «nulo» para ver qué pasa cuando no se puede beber.

## Mecanismos

### M1 · Osmolaridad plasmática

**Qué es.** Concentración de solutos del plasma, sobre todo sodio y sus aniones. La vigilan los osmorreceptores del hipotálamo.

**Qué hace.** Cuando sube, el hipotálamo libera ADH y da sed: se retiene y se bebe agua hasta diluir el plasma. Cuando baja, se frena la ADH y se orina el agua sobrante.

**En este caso**

- Caso 3 (Dieta alta en sal): La sal la sube; la ADH y la sed retienen y aportan agua y la frenan, pero queda algo alta.
- Caso 4 (SIADH): Muy baja: la ADH retiene agua sin sal y diluye el plasma.
- Caso 11 (Deshidratación): Alta: se pierde agua y no se repone.
- Caso 12 (Diabetes insípida central): Alta: se pierde agua por la orina y la sed solo lo compensa en parte.

### M2 · ADH (vasopresina)

**Qué es.** Hormona antidiurética o vasopresina. La fabrica el hipotálamo y se libera en la neurohipófisis cuando sube la osmolaridad, baja la volemia o sube la angiotensina II.

**Qué hace.** En el túbulo colector se une a su receptor V2 y pone acuaporinas en la membrana: se recupera agua, la orina se concentra y baja la diuresis. En niveles altos también contrae las arteriolas (receptor V1).

**Animación:** adh

**En este caso**

- Caso 3 (Dieta alta en sal): Sube por la osmolaridad: retiene el agua que diluye la sal.
- Caso 4 (SIADH): Fijada muy alta por el SIADH, aunque el plasma esté diluido.
- Caso 11 (Deshidratación): Muy alta por la osmolaridad y la volemia baja: la orina sale escasa y concentrada.
- Caso 12 (Diabetes insípida central): No hay: se orina mucho y muy diluido.

### M3 · Sed

**Qué es.** Ganas de beber. Las genera el centro de la sed del hipotálamo, con los mismos estímulos que la ADH.

**Qué hace.** Si hay agua, beber repone el volumen y diluye el plasma. Es lo que compensa la diabetes insípida. Sin acceso al agua, la sed no sirve de nada.

**En este caso**

- Caso 4 (SIADH): Baja: la osmolaridad baja la frena. En el paciente real no ocurre: el umbral de la sed se reajusta a la baja y se sigue bebiendo con normalidad, lo que mantiene la hiponatremia. Es un límite del modelo.
- Caso 11 (Deshidratación): Muy alta, pero sin agua no se traduce en beber.
- Caso 12 (Diabetes insípida central): Alta: bebiendo se compensa lo que se orina.

### M4 · Renina

**Qué es.** Enzima que liberan las células granulares de la arteriola aferente, en el aparato yuxtaglomerular. Pone en marcha el sistema renina-angiotensina-aldosterona.

**Qué hace.** Corta el angiotensinógeno del hígado y empieza la cascada que acaba en la angiotensina II. Se libera cuando baja la presión en la aferente, cuando llega poco NaCl a la mácula densa o cuando el simpático la estimula. El volumen alto la frena.

**Animación:** renina

**En este caso**

- Caso 3 (Dieta alta en sal): Baja: el volumen extra y el NaCl que llega a la mácula densa la frenan.
- Caso 5 (Estenosis renal bilateral): Sube, pero no al máximo: la estenosis la estimula y el volumen retenido la frena en parte.
- Caso 7 (Tumor secretor de renina): Muy alta: la segrega el tumor por su cuenta.
- Caso 8 (Hiperaldosteronismo primario): Baja: el volumen retenido por la aldosterona la frena. Renina baja con aldosterona alta es la pista del hiperaldosteronismo.
- Caso 10 (Regaliz): Baja, como la aldosterona: el volumen que retiene el cortisol frena todo el sistema.
- Caso 11 (Deshidratación): Muy alta por la volemia baja y la filtración baja.

### M5 · Angiotensina II

**Qué es.** Producto activo del sistema: la renina convierte el angiotensinógeno en angiotensina I, y la enzima convertidora (sobre todo en el pulmón) la pasa a angiotensina II.

**Qué hace.** Contrae las arteriolas de todo el cuerpo (sube la RVP), libera aldosterona y hace reabsorber sodio en el túbulo. Además estimula la ADH, la sed y el simpático, y contrae la arteriola eferente para sostener la filtración.

**En este caso**

- Caso 5 (Estenosis renal bilateral): Sube en «Minutos» y apenas se nota en estado estable, cuando el volumen retenido ya frena la renina.
- Caso 7 (Tumor secretor de renina): Alta: contrae las arteriolas y es la que más sube la RVP.
- Caso 8 (Hiperaldosteronismo primario): Baja, con la renina frenada por el volumen.

### M6 · Aldosterona

**Qué es.** Hormona de la corteza suprarrenal. La estimulan la angiotensina II y el potasio alto en sangre.

**Qué hace.** En el túbulo distal y el colector activa su receptor, y la célula fabrica más canales y bombas de sodio. Se reabsorbe sodio, el agua lo sigue, baja la diuresis y sube la volemia. A cambio se pierde potasio por la orina. Tarda de horas a días: en «Minutos» todavía no mueve nada.

**Animación:** aldosterona

**En este caso**

- Caso 7 (Tumor secretor de renina): Muy alta porque la empuja la angiotensina II: renina y aldosterona suben a la vez.
- Caso 8 (Hiperaldosteronismo primario): La suprarrenal la segrega sola. Por eso está alta aunque la renina y la angiotensina II estén bajas: es la pista que distingue el hiperaldosteronismo primario. El potasio bajo también la frena, pero no basta.
- Caso 10 (Regaliz): Baja: el receptor lo activa el cortisol, y la volemia alta frena la renina.
- Caso 11 (Deshidratación): Muy alta: el sistema renina-angiotensina está muy activado para conservar sodio.

### M7 · Actividad mineralocorticoide

**Qué es.** Cuánto se activa el receptor mineralocorticoide de las células del colector. Lo activa la aldosterona o, si falla la enzima 11β-HSD2, el cortisol.

**Qué hace.** Es el paso común de la aldosterona y el regaliz: más canales de sodio en la membrana que da a la orina (apical) y más bombas sodio-potasio en la que da a la sangre (basolateral). Se reabsorbe sodio y se secreta potasio.

**Animación:** aldosterona

**En este caso**

- Caso 8 (Hiperaldosteronismo primario): Muy alta por la aldosterona.
- Caso 10 (Regaliz): Muy alta con la aldosterona baja: la activa el cortisol.

### M8 · Actividad simpática

**Qué es.** Actividad del sistema nervioso simpático y de las catecolaminas de la médula suprarrenal (adrenalina y noradrenalina).

**Qué hace.** Acelera el corazón y aumenta su fuerza (receptores β1), contrae las arteriolas (α1) y libera renina (β1 del riñón). El barorreflejo lo frena cuando la presión sube; en la hipertensión mantenida se reajusta en buena parte a la nueva presión y la frena mucho menos. El modelo lo simplifica: en estado estable no lo cuenta.

**En este caso**

- Caso 2 (Hipertiroidismo): Apenas cambia: las hormonas tiroideas aumentan la sensibilidad a las catecolaminas, no su cantidad.
- Caso 9 (Feocromocitoma): Al máximo por las catecolaminas del tumor: mueve casi toda la presión.
- Caso 11 (Deshidratación): Sube por la volemia baja y sostiene la diastólica.

### M9 · Perfusión renal

**Qué es.** Presión y flujo de sangre que llegan a la arteriola aferente del glomérulo.

**Qué hace.** Si baja, cae la filtración y las células granulares liberan renina. Sube y baja con la presión arterial, pero la autorregulación renal hace que la filtración cambie mucho menos que ella cuando la presión es alta. Baja de verdad con una estenosis o con poco volumen.

**Animación:** renina

**En este caso**

- Caso 5 (Estenosis renal bilateral): Baja por la estenosis; la presión alta la recupera en parte.
- Caso 11 (Deshidratación): Baja: con poco volumen se contraen los vasos del riñón.

### M10 · Tasa de filtración glomerular (TFG)

**Qué es.** Tasa de filtración glomerular: cuánto plasma filtran por minuto los glomérulos de los dos riñones.

**Qué hace.** Depende de la membrana (Kf), de la presión en el capilar y de las que se oponen: la de la cápsula de Bowman y la oncótica. Si baja, llega menos NaCl a la mácula densa (sube la renina), baja algo la diuresis y, si la caída es apreciable, suben la creatinina y el potasio.

**En este caso**

- Caso 5 (Estenosis renal bilateral): Baja por la estenosis: sube la creatinina.
- Caso 6 (Caída de la filtración): Muy baja: es el problema de partida.
- Caso 11 (Deshidratación): Muy baja por la volemia baja: sube la creatinina.

### M11 · Reabsorción tubular de Na

**Qué es.** Sodio que los túbulos devuelven a la sangre: el proximal (con la angiotensina II), el distal y el colector (con la aldosterona).

**Qué hace.** El agua sigue al sodio: baja la diuresis y sube la volemia. Si la presión es alta, el túbulo reabsorbe menos sodio (natriuresis por presión), que es el freno que limita la retención.

**En este caso**

- Caso 3 (Dieta alta en sal): Baja: con presión alta y renina baja se elimina el exceso de sal.
- Caso 8 (Hiperaldosteronismo primario): Alta por la aldosterona.
- Caso 10 (Regaliz): Alta por el cortisol que ocupa el receptor.
- Caso 11 (Deshidratación): Alta: se conserva todo el sodio posible.

### M12 · Reabsorción de agua

**Qué es.** Agua que el túbulo colector devuelve a la sangre a través de las acuaporinas. La controla la ADH.

**Qué hace.** Recupera agua sin solutos: diluye el plasma, concentra la orina y baja la diuresis. Si el volumen se mantiene alto, el riñón «escapa»: retiene menos agua aunque la ADH siga alta.

**Animación:** adh

**En este caso**

- Caso 4 (SIADH): Muy alta por la ADH, aunque el escape la frena: queda orina muy concentrada y plasma diluido.
- Caso 12 (Diabetes insípida central): Muy baja sin ADH: orina abundante y diluida.

### M13 · Diuresis

**Qué es.** Volumen de orina. También aparece en la analítica.

**Qué hace.** Lo que se orina sale de la volemia. Baja cuando el túbulo reabsorbe más agua o más sodio, y cuando cae la filtración. En estado estable se orina lo que se ingiere: la oliguria de la retención solo se ve en los primeros días.

**En este caso**

- Caso 3 (Dieta alta en sal): Normal en estado estable: se orina lo que se ingiere. Cambia a «Minutos» y a «Días» para ver la fase de retención.
- Caso 11 (Deshidratación): Muy baja: el riñón retiene todo lo que puede.
- Caso 12 (Diabetes insípida central): Muy alta: poliuria sin ADH.

### M14 · Frecuencia cardíaca

**Qué es.** Latidos por minuto. Los marca el nódulo sinusal.

**Qué hace.** El gasto cardíaco es la frecuencia por el volumen de cada latido: si sube la frecuencia, sube el gasto. La aceleran el simpático y las hormonas tiroideas.

**En este caso**

- Caso 2 (Hipertiroidismo): Alta: taquicardia del hipertiroidismo.
- Caso 9 (Feocromocitoma): Muy alta por las catecolaminas.
- Caso 11 (Deshidratación): Sube para compensar la volemia baja.
- Caso 13 (Hipotiroidismo): Baja: el hipotiroidismo enlentece el corazón.

### M15 · Contractilidad

**Qué es.** Fuerza con que se contrae el miocardio.

**Qué hace.** Con más fuerza, cada latido expulsa más sangre: sube el volumen sistólico y el gasto. La aumentan el simpático y las hormonas tiroideas. Un corazón más fuerte por sí solo (por ejemplo, por el ejercicio) no causa hipertensión.

**En este caso**

- Caso 2 (Hipertiroidismo): Alta: efecto directo de las hormonas tiroideas.
- Caso 9 (Feocromocitoma): Alta por las catecolaminas.
- Caso 13 (Hipotiroidismo): Baja: el hipotiroidismo debilita el corazón.

### M16 · Rigidez arterial

**Qué es.** Pérdida de distensibilidad de la pared de las arterias grandes, como la aorta.

**Qué hace.** Una arteria elástica se distiende en cada latido y devuelve la sangre en la diástole (efecto Windkessel). Rígida, no amortigua la eyección: sube la sistólica y baja la diastólica, y se ensancha la presión de pulso. La suben la edad, los factores de riesgo y la placa. También, menos y de forma reversible, el hipotiroidismo mantenido.

**Botón** «Ver las capas en el vaso»

**En este caso**

- Caso 1 (Edad avanzada con factores de riesgo): Muy alta: es la que sube la sistólica y baja la diastólica. Mira el latido de la arteria grande: apenas se distiende.
- Caso 13 (Hipotiroidismo): Algo alta: en el hipotiroidismo mantenido las arterias grandes se distienden peor, y se corrige con el tratamiento. Ayuda a sostener la sistólica aunque el gasto baje.

> ⚠ La rigidez es de las arterias grandes y no cambia la resistencia vascular periférica, que está en las arteriolas. Aumenta la presión de pulso: sube la sistólica y baja la diastólica.

### M17 · Placa de ateroma

**Qué es.** Engrosamiento de la íntima de las arterias grandes y medianas: lípidos, macrófagos convertidos en células espumosas, músculo liso y colágeno.

**Qué hace.** Vuelve la pared más gruesa y fibrosa, y por eso más rígida. En el modelo solo actúa a través de la rigidez: la placa está en las arterias de conducción y no estrecha las arteriolas, donde está la resistencia.

**Animación:** placa · botón «Ver las capas en el vaso»

**En este caso**

- Caso 1 (Edad avanzada con factores de riesgo): Grande, por la edad y los factores de riesgo: se ve en la pared de la arteria grande.

> ⚠ La placa de una arteria grande no estrecha las arteriolas, donde está la resistencia. Si sube la presión, es porque la pared se vuelve más rígida.

## Salidas

### S1 · Volemia

**Qué es.** Volumen de sangre, ligado al volumen del medio interno. En el modelo es un acumulador: agua que entra menos agua que sale.

**Qué hace.** Más volumen llena más el corazón y sube el gasto. Si se mantiene, los tejidos se defienden del exceso de flujo, el gasto vuelve a lo normal y la RVP sostiene la presión. El volumen alto frena la renina, la ADH y la sed.

**En este caso**

- Caso 3 (Dieta alta en sal): Sube con el agua retenida para diluir la sal.
- Caso 4 (SIADH): Normal en estado estable: el riñón escapa del exceso de agua. En «Días» todavía está alta.
- Caso 11 (Deshidratación): Muy baja: por muchas hormonas que haya, sin agua no hay presión.
- Caso 12 (Diabetes insípida central): Baja algo: la sed compensa casi toda la orina perdida.

### S2 · Gasto cardíaco (GC)

**Qué es.** Gasto cardíaco: litros de sangre que bombea el corazón por minuto. Es la frecuencia por el volumen de cada latido.

**Qué hace.** Sube la presión, sobre todo la sistólica. Lo suben la frecuencia, la contractilidad y la volemia (más llenado, más volumen por latido).

**En este caso**

- Caso 2 (Hipertiroidismo): Muy alto: frecuencia y contractilidad suben.
- Caso 3 (Dieta alta en sal): Sube en «Días» con el volumen y vuelve a lo normal en estado estable.
- Caso 9 (Feocromocitoma): Muy alto por las catecolaminas.
- Caso 11 (Deshidratación): Bajo: falta volumen.
- Caso 13 (Hipotiroidismo): Muy bajo: corazón lento y débil.

### S3 · Resistencia vascular periférica (RVP)

**Qué es.** Resistencia vascular periférica: la oposición que ofrecen al flujo los vasos del cuerpo, sobre todo las arteriolas. Depende mucho de su radio.

**Qué hace.** Sube la presión, sobre todo la diastólica: la sangre sale más despacio de las arterias durante la diástole. La suben la angiotensina II, el simpático, la ADH alta y la autorregulación con volumen alto; la bajan las hormonas tiroideas.

**En este caso**

- Caso 2 (Hipertiroidismo): Baja mucho: las hormonas tiroideas dilatan las arteriolas.
- Caso 3 (Dieta alta en sal): Sube en estado estable y sostiene la hipertensión de la sal.
- Caso 7 (Tumor secretor de renina): Muy alta por la angiotensina II: mira la luz de la arteriola.
- Caso 9 (Feocromocitoma): Muy alta por el simpático.
- Caso 13 (Hipotiroidismo): Muy alta: hipertensión diastólica del hipotiroidismo.

### S4 · Presión sistólica (PAS)

**Qué es.** Presión sistólica: la máxima, cuando el corazón expulsa la sangre.

**Qué hace.** La suben el gasto cardíaco y la rigidez de las arterias grandes, y algo la RVP. Si sube la sistólica y baja la diastólica, mira la rigidez o un gasto muy alto.

**En este caso**

- Caso 1 (Edad avanzada con factores de riesgo): Sube mucho por la rigidez.
- Caso 2 (Hipertiroidismo): Sube por el gasto alto, aunque la RVP baje.
- Caso 11 (Deshidratación): Baja: falta volumen.
- Caso 13 (Hipotiroidismo): Casi normal: el gasto bajo tira hacia abajo, y la RVP alta y algo más de rigidez arterial lo contrarrestan.

### S5 · Presión diastólica (PAD)

**Qué es.** Presión diastólica: la mínima, entre latido y latido.

**Qué hace.** Depende sobre todo de la RVP: cuanto más cuesta que la sangre salga de las arterias, más alta queda. La baja la rigidez, porque la arteria rígida ya no devuelve la sangre en la diástole.

**En este caso**

- Caso 1 (Edad avanzada con factores de riesgo): Baja: la arteria rígida no sostiene la presión en la diástole.
- Caso 2 (Hipertiroidismo): Baja por la vasodilatación.
- Caso 11 (Deshidratación): No baja, incluso sube algo: el simpático y la RVP compensan la falta de volumen.
- Caso 13 (Hipotiroidismo): Sube: hipertensión diastólica.

### S6 · Presión arterial media (PAM)

**Qué es.** Presión arterial media: la diastólica más un tercio de la diferencia con la sistólica.

**Qué hace.** Es la presión que perfunde los órganos. La vigilan los barorreceptores y el riñón: si es alta, el túbulo elimina más sodio (natriuresis por presión) y, en minutos y días, el barorreflejo frena el simpático.

**En este caso**

- Caso 1 (Edad avanzada con factores de riesgo): Casi normal: la sistólica sube, pero la diastólica baja.
- Caso 9 (Feocromocitoma): Muy alta: suben las dos presiones.

## Analítica

### A1 · Creatinina plasmática

**Qué es.** Producto del músculo que se elimina casi solo por filtración. Es el marcador de la filtración glomerular.

**Qué hace.** Sube cuando la filtración cae de forma apreciable; con pequeñas variaciones no se mueve. Una falta de volumen importante, como en la deshidratación, también la sube: llega menos sangre al riñón y se filtra menos. Separa las causas renales (estenosis de las dos arterias o de un riñón único, caída de la filtración) de las hormonales (tumor de renina, hiperaldosteronismo).

**En este caso**

- Caso 5 (Estenosis renal bilateral): Alta: la estenosis baja la filtración.
- Caso 6 (Caída de la filtración): Muy alta: el problema es la filtración.
- Caso 7 (Tumor secretor de renina): Normal: hay mucha renina, pero el riñón filtra bien.
- Caso 11 (Deshidratación): Alta: con poco volumen se filtra menos.
- Caso 12 (Diabetes insípida central): Normal: con acceso libre al agua, la sed compensa.

> ⚠ Con acceso libre al agua, la creatinina suele ser normal en la diabetes insípida.

### A2 · Natremia

**Qué es.** Concentración de sodio en el plasma. Refleja la proporción de agua y sodio, no la cantidad total de sodio.

**Qué hace.** Sigue a la osmolaridad plasmática: baja cuando se retiene agua sin sal y sube cuando se pierde agua. Si cambia, la ADH está implicada. Cuando baja mucho o deprisa, el agua entra en las células y las hincha. En el cerebro eso produce edema cerebral.

**En este caso**

- Caso 3 (Dieta alta en sal): Algo alta: el agua retenida diluye la sal, pero no del todo.
- Caso 4 (SIADH): Muy baja: hiponatremia del SIADH.
- Caso 11 (Deshidratación): Alta: se pierde agua.
- Caso 12 (Diabetes insípida central): Alta: se orina agua sin sal. En el paciente real que bebe a demanda suele quedar en el límite alto de lo normal.

### A3 · Osmolaridad urinaria

**Qué es.** Concentración de la orina.

**Qué hace.** Sube cuando el colector recupera agua y la orina queda concentrada; baja cuando no hay ADH y la orina sale diluida.

**Animación:** adh

**En este caso**

- Caso 4 (SIADH): Muy alta: se quita agua a la orina sin parar.
- Caso 11 (Deshidratación): Muy alta: el riñón ahorra agua.
- Caso 12 (Diabetes insípida central): Muy baja: orina diluida sin ADH.

### A4 · Potasio plasmático

**Qué es.** Concentración de potasio en el plasma.

**Qué hace.** Baja cuando el receptor mineralocorticoide está activo, porque el colector cambia sodio por potasio. Sube cuando la filtración cae mucho. A su vez, el potasio alto estimula la aldosterona.

**Animación:** aldosterona

**En este caso**

- Caso 6 (Caída de la filtración): Alto: con poca filtración se elimina menos potasio.
- Caso 7 (Tumor secretor de renina): Bajo: la aldosterona alta lo elimina.
- Caso 8 (Hiperaldosteronismo primario): Muy bajo, aunque en la práctica la hipopotasemia solo aparece en una minoría de los pacientes.
- Caso 10 (Regaliz): Bajo: el cortisol ocupa el receptor de la aldosterona.

## Fármacos (fase 4)

### F1 · IECA

**Qué es.** Inhibidor de la enzima convertidora de angiotensina (enalapril, ramipril, lisinopril). Fármaco de primera línea en la hipertensión.

**Qué hace.** Frena el paso de angiotensina I a angiotensina II. Con menos angiotensina II las arteriolas se dilatan, baja la aldosterona y el riñón retiene menos sodio y algo más de potasio: baja la presión. La renina sube, porque baja la presión que llega al riñón y porque la angiotensina II deja de frenarla. En el riñón dilata la arteriola eferente: la filtración baja un poco, y mucho si el riñón depende de ella.

**En este caso**

- Caso 15 (Estenosis renal bilateral con IECA): La filtración de un riñón con poca presión se sostenía porque la angiotensina II contraía la arteriola eferente. Con el IECA falta ese apoyo y, además, baja la presión que llega al riñón: la TFG se hunde y suben la creatinina y el potasio. Por eso está contraindicado en la estenosis bilateral y en la de un riñón único.
- Caso 16 (Tumor de renina con IECA): La renina sigue muy alta, pero se forma menos angiotensina II: la presión baja de muy alta a alta y el potasio se normaliza. Compáralo con el ARA-II en el mismo caso.
- Caso 35 (Estenosis renal unilateral con IECA): Aquí la hipertensión depende de la renina del riñón afectado, así que el IECA la controla bien. Sin la angiotensina II la filtración baja algo (mira la TFG), sobre todo en ese riñón; el sano sostiene el resto y la creatinina apenas se mueve. Se vigila en la analítica de control, por si la estenosis fuera de las dos arterias.

**En la consulta de fisioterapia.** Mareo al levantarse de la camilla al empezar el tratamiento o al subir la dosis: incorporar al paciente por etapas. Tos seca y persistente sin catarro ni enfermedad pulmonar: es un efecto frecuente del fármaco y conviene que el paciente se lo cuente a su médico. Rara vez, hinchazón de labios, lengua o garganta (angioedema): es una urgencia. Con vómitos, diarrea, mucho calor o un esfuerzo largo sin beber, el riñón queda desprotegido: un paciente deshidratado no debe hacer una sesión intensa.

> ⚠ En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo. Dos límites del modelo: en una persona sana exagera algo la caída de la filtración, y con la renina suprimida (hiperaldosteronismo, regaliz) el IECA baja la presión más que en el paciente real, en el que es poco eficaz.

### F2 · ARA-II

**Qué es.** Antagonista del receptor AT1 de la angiotensina II (losartán, valsartán, candesartán). Fármaco de primera línea en la hipertensión.

**Qué hace.** No impide que se forme la angiotensina II: bloquea su receptor. Los efectos sobre la presión, la aldosterona, el potasio y el riñón son los del IECA. La diferencia está en la angiotensina II: con el IECA baja y con el ARA-II sube, igual que la renina. En la práctica solo se mide la renina, que sube con los dos. No acumula bradicinina, así que no da la tos del IECA.

**En este caso**

- Caso 17 (Tumor de renina con ARA-II): La angiotensina II está muy alta, pero su receptor está bloqueado: las arteriolas no se contraen y la aldosterona no sube. La presión vuelve a lo normal con la renina y la angiotensina II muy altas.

**En la consulta de fisioterapia.** Como el IECA: mareo al cambiar de postura al principio del tratamiento y cuidado si el paciente se deshidrata (calor, ejercicio largo, vómitos). No da tos, y el angioedema es todavía más raro.

> ⚠ En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo. Dos límites del modelo: el ARA-II sale más potente que el IECA, cuando en el paciente bajan la presión de forma parecida; y en una persona sana exagera la caída de la filtración, hasta subir algo la creatinina.

### F3 · Betabloqueante

**Qué es.** Bloqueante de los receptores β adrenérgicos. El simulador usa uno no selectivo (propranolol), que bloquea los β1 y los β2; los cardioselectivos (bisoprolol, atenolol, nebivolol) bloquean sobre todo los β1.

**Qué hace.** Bloquea los β1 del corazón: bajan la frecuencia y la contractilidad, y con ellas el gasto. Bloquea los β1 del riñón: baja la renina. Al bloquear también los β2, las arteriolas del músculo pierden su dilatación por adrenalina y la RVP sube algo. En la hipertensión se usa sobre todo cuando hay otra razón para darlo: cardiopatía isquémica, insuficiencia cardíaca o arritmias.

**En este caso**

- Caso 19 (Feocromocitoma con betabloqueante solo): Sin la dilatación β2, la vasoconstricción α1 de las catecolaminas queda sin oposición: la RVP sube algo más. La sistólica del modelo baja porque cae el gasto; en el paciente puede desencadenar una crisis hipertensiva. Nunca se da sin un alfabloqueante previo.
- Caso 20 (Feocromocitoma con alfa y betabloqueante): Con los receptores α ya bloqueados, el betabloqueante frena la taquicardia y el gasto. La presión vuelve a lo normal.
- Caso 22 (Hipertiroidismo con betabloqueante): Frena el corazón: la frecuencia y el gasto dejan de estar altos y la sistólica vuelve a lo normal. La RVP y la diastólica siguen bajas, porque no corrige la causa: se usa mientras se trata el tiroides.

**En la consulta de fisioterapia.** La frecuencia cardíaca es más baja en reposo y sube menos con el esfuerzo: las fórmulas de frecuencia máxima por edad no valen. Para dosificar el ejercicio, mejor la escala de Borg o el test del habla, o las frecuencias de una prueba de esfuerzo hecha con el fármaco. Más cansancio y manos y pies fríos. El no selectivo puede cerrar los bronquios en el asma y, en el diabético, tapar la taquicardia y el temblor que avisan de una hipoglucemia; el sudor se mantiene. Pulso muy lento con mareo o desmayo: avisar al médico.

> ⚠ En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo.

### F4 · Alfabloqueante

**Qué es.** Bloqueante de los receptores α1 de las arteriolas (doxazosina, prazosina). En el feocromocitoma se usa también la fenoxibenzamina, que bloquea los α1 y los α2.

**Qué hace.** Impide que la noradrenalina contraiga las arteriolas: baja la RVP y, con ella, sobre todo la diastólica. No es de primera línea en la hipertensión. Se usa como fármaco añadido, en hombres con hiperplasia benigna de próstata y, sobre todo, para preparar la cirugía del feocromocitoma, siempre antes del betabloqueante.

**En este caso**

- Caso 20 (Feocromocitoma con alfa y betabloqueante): El alfabloqueante dilata las arteriolas que las catecolaminas contraían y el betabloqueante frena la taquicardia: la presión vuelve a lo normal. Es la preparación para operar el tumor.

**En la consulta de fisioterapia.** Es el que más hipotensión ortostática da, sobre todo con las primeras dosis y al subirlas: levantarse de la camilla despacio, quedarse sentado unos segundos antes de ponerse de pie, y cuidado al terminar el ejercicio y al salir de la piscina o del agua caliente. Riesgo de caídas en mayores.

> ⚠ En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo.

### F5 · Tiazida

**Qué es.** Diurético tiazídico o similar (hidroclorotiazida, clortalidona, indapamida). Fármaco de primera línea en la hipertensión.

**Qué hace.** Bloquea la reabsorción de sodio y cloro en el túbulo distal: se orina más sodio y, con él, agua. Baja la volemia; la renina y la aldosterona suben para compensar. Al llegar más sodio al colector se pierde potasio. Con la filtración muy baja pierde eficacia.

**En este caso**

- Caso 21 (Dieta alta en sal con tiazida): Saca el sodio que sobra: la volemia y la RVP vuelven a lo normal y la presión también. El precio es el potasio bajo.

**En la consulta de fisioterapia.** Más riesgo de deshidratación y de golpe de calor con el ejercicio en ambiente caluroso: beber durante la sesión. Algo de mareo al levantarse. Calambres nocturnos en las piernas; si el potasio baja mucho, debilidad o palpitaciones. En mayores puede bajar el sodio: confusión, inestabilidad o caídas de aparición reciente son motivo para avisar al médico. Puede subir el ácido úrico y desencadenar un ataque de gota (dolor agudo en una articulación, típico del dedo gordo del pie).

> ⚠ En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo. Límite del modelo: en estado estable la tiazida baja la presión con la volemia y el gasto bajos. En el paciente eso pasa al principio; al cabo de unas semanas el volumen se recupera en parte y lo que queda baja es la RVP.

### F6 · Diurético de asa

**Qué es.** Diurético que actúa en el asa de Henle (furosemida, torasemida). Es el más potente.

**Qué hace.** Bloquea la reabsorción de sodio, potasio y cloro en la rama ascendente del asa de Henle. Saca mucho volumen: se usa más en los edemas (insuficiencia cardíaca, enfermedad renal) que en la hipertensión, salvo cuando la filtración es baja. También baja el potasio, y la renina y la aldosterona suben mucho.

**En este caso**

- Caso 23 (Caída de la filtración con diurético de asa): Con la filtración baja saca el volumen retenido y el potasio que sobraba: la presión vuelve a lo normal. A dosis plena se pasa: la volemia queda baja y la renina sube. La creatinina no mejora, porque el riñón sigue filtrando poco.

**En la consulta de fisioterapia.** Orina abundante durante las horas siguientes a la toma: conviene saber a qué hora la toma para programar la sesión y tener un baño cerca. Mareo al levantarse y riesgo de deshidratación con calor o esfuerzo largo. Debilidad o calambres si baja el potasio. En la insuficiencia cardíaca, ganar peso en pocos días, más ahogo o más hinchazón de tobillos pueden indicar que el tratamiento no basta: avisar al médico.

> ⚠ En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo.

### F7 · Espironolactona

**Qué es.** Antagonista del receptor mineralocorticoide (espironolactona, eplerenona). Diurético que ahorra potasio.

**Qué hace.** Ocupa el receptor de la aldosterona en el colector: ni la aldosterona ni el cortisol (en el regaliz) lo activan. Se reabsorbe menos sodio y se secreta menos potasio. Es el tratamiento del hiperaldosteronismo bilateral, el fármaco añadido en la hipertensión resistente y uno de los básicos en la insuficiencia cardíaca.

**En este caso**

- Caso 18 (Hiperaldosteronismo con espironolactona): La aldosterona sigue muy alta, pero no encuentra su receptor libre: la presión y el potasio vuelven a lo normal. La renina, que estaba baja, se recupera: es la señal de que el bloqueo es suficiente.

**En la consulta de fisioterapia.** Puede subir el potasio, sobre todo junto a un IECA o un ARA-II o con la función renal baja: debilidad muscular o palpitaciones son motivo para avisar al médico. Calambres en las piernas. La espironolactona puede dar aumento y dolor de las mamas en los hombres (ginecomastia); la eplerenona, mucho menos. Mareo al levantarse, como los otros diuréticos.

> ⚠ En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo.

### F8 · Calcioantagonista

**Qué es.** Calcioantagonista dihidropiridínico (amlodipino, nifedipino, lercanidipino). Fármaco de primera línea en la hipertensión; muy usado en mayores.

**Qué hace.** Cierra los canales de calcio del músculo liso de las arteriolas: se relajan y baja la RVP. No depende del riñón ni del sistema renina-angiotensina, y por eso funciona igual con la renina baja. Los no dihidropiridínicos (verapamilo, diltiazem) actúan además sobre el corazón y bajan la frecuencia; el simulador no los incluye.

**En este caso**

- Caso 24 (Dieta alta en sal con calcioantagonista): Dilata las arteriolas: la RVP y la presión vuelven a lo normal. Pero el volumen que retiene la sal sigue ahí, y el gasto sube algo. Compáralo con la tiazida en el mismo caso, que saca el volumen.

**En la consulta de fisioterapia.** Hinchazón de los dos tobillos, peor al final del día y con dosis altas. No es retención de líquido: las arteriolas dilatadas dejan pasar más presión al capilar, y por eso responde mal a los diuréticos. Si la hinchazón es de una sola pierna o duele, hay que pensar en otra causa. Enrojecimiento y calor en la cara, dolor de cabeza al principio y, a veces, palpitaciones. Mareo al levantarse. Pueden engrosarse las encías.

> ⚠ En el simulador, «dosis plena» es una dosis habitual, no la máxima posible, y el efecto es cualitativo. Límite del modelo: en la hipertensión sistólica del mayor la sistólica apenas baja, porque la rigidez arterial no cambia con el fármaco, y la diastólica baja mucho. En el paciente real es de los fármacos que mejor bajan la sistólica del mayor.

## Ejercicio (fase 5)

### E1 · Sesión aeróbica

**Qué es.** Una sesión de ejercicio dinámico con grandes grupos musculares: andar rápido, bicicleta, correr o nadar. La rueda es la intensidad: moderada a media rueda, vigorosa al final.

**Qué hace.** Durante el esfuerzo, la orden de la corteza motora y los receptores del músculo que trabaja activan el simpático y retiran el freno vagal: la frecuencia y el gasto suben mucho. A la vez, el músculo se dilata por sus propios metabolitos, y esa dilatación vence a la vasoconstricción simpática: la RVP baja. Resultado: la sistólica sube con el gasto y la diastólica se mantiene o baja. Al terminar, el músculo sigue dilatado unas horas y el barorreflejo se reajusta a la baja: la presión queda por debajo de la de antes (hipotensión postejercicio).

**En este caso**

- Caso 25 (Sesión aeróbica moderada): Con intensidad moderada la frecuencia y el gasto suben mucho, la RVP baja y la sistólica sube mientras la diastólica se mantiene. Cambia a «Al terminar»: la presión queda algo por debajo de la de antes, sin llegar a cambiar la flecha. Se ve mejor en el caso 28.
- Caso 26 (Sesión aeróbica con betabloqueante): Con el betabloqueante la frecuencia parte de más abajo y, con el mismo esfuerzo, se queda en lo normal; la sistólica sube menos. La escala de Borg sigue sirviendo: por eso se dosifica con ella.
- Caso 28 (Dieta alta en sal: al terminar la sesión): Al terminar una sesión aeróbica intensa, la presión del paciente con dieta alta en sal vuelve a lo normal durante unas horas. Cambia a «Antes» y a «Durante» para comparar.
- Caso 29 (Dieta alta en sal con alfabloqueante: al terminar la sesión): Al terminar, la dilatación del músculo se suma a la del alfabloqueante: la RVP queda por debajo de lo normal. Es el momento de más riesgo de mareo al levantarse.
- Caso 32 (Feocromocitoma: sesión aeróbica): El simpático ya estaba casi al máximo por las catecolaminas del tumor y el esfuerzo lo lleva al tope. La sistólica del modelo apenas cambia y la diastólica baja; en el paciente el esfuerzo puede desencadenar una crisis, que el modelo no reproduce.
- Caso 33 (Hipertiroidismo: sesión aeróbica vigorosa): La frecuencia y el gasto, ya altos en reposo, llegan al tope de escala con el esfuerzo vigoroso.

**En la consulta de fisioterapia.** Es la base del tratamiento no farmacológico de la hipertensión: de 30 a 60 minutos casi todos los días, seguidos o en tandas de 10 minutos o más, hasta sumar al menos 150 a la semana, a intensidad moderada (11 a 13 en la escala de Borg de 6 a 20: se puede hablar, pero no cantar). Progresar poco a poco, sobre todo en intensidad. Conviene tomar la presión antes de empezar: si está muy alta y sin controlar, no es día de sesión intensa y hay que comentarlo con su médico. Terminar con una vuelta a la calma, sin pararse de golpe ni levantarse bruscamente: la presión baja después de la sesión, y la media hora o la hora siguiente también es un momento de riesgo. Parar si aparece dolor u opresión en el pecho, mareo o sensación de desmayo, ahogo desproporcionado al esfuerzo, palpitaciones, dolor de cabeza intenso o agotamiento. Los umbrales de 250 mmHg de sistólica o 115 de diastólica son para parar una prueba de esfuerzo: no son un objetivo de la sesión. Con betabloqueante, dosificar con la escala de Borg o el test del habla, no con la frecuencia.

> ⚠ En el simulador la sesión se calcula sobre el estado estable del paciente, y el efecto es cualitativo. Dos límites del modelo: la bajada de después de la sesión sale igual en el sano que en el hipertenso, cuando en el paciente es mayor cuanto más alta era la presión; y no hay postura ni calor: el mareo al levantarse y la deshidratación los cuentan los avisos.

### E2 · Sesión de fuerza

**Qué es.** Una sesión de ejercicio contra resistencia: pesas, máquinas, bandas elásticas o contracciones isométricas. La rueda es la intensidad: al final, cargas altas con la respiración bloqueada (maniobra de Valsalva).

**Qué hace.** El simpático y la frecuencia suben, como en el aeróbico, pero el músculo contraído comprime sus propios vasos y la RVP sube en lugar de bajar. Con la maniobra de Valsalva sube además la presión dentro del tórax. Suben las dos presiones, la sistólica y la diastólica. En culturistas, con cargas casi máximas hasta el fallo y la respiración bloqueada, se han medido más de 300/200 mmHg.

**En este caso**

- Caso 27 (Sesión de fuerza intensa): Con cargas altas suben la RVP, la sistólica y la diastólica. Compáralo con el caso 25: en el aeróbico la diastólica se mantiene.

**En la consulta de fisioterapia.** En el hipertenso es útil y seguro si se dosifica: 2 o 3 días a la semana, de 8 a 10 ejercicios de los grandes grupos musculares, 2 o 3 series de 10 a 12 repeticiones con cargas moderadas (60–80 % de una repetición máxima), descanso entre series y respiración continua: soltar el aire en el esfuerzo. Evitar bloquear la respiración, las cargas máximas y llegar al fallo, sobre todo con la presión mal controlada. Con un alfabloqueante o un diurético, levantarse despacio del banco o del suelo. Las mismas señales para parar que en el aeróbico.

> ⚠ En el simulador la sesión se calcula sobre el estado estable del paciente, y el efecto es cualitativo. Límite del modelo: la sesión de fuerza no tiene «Al terminar». En el paciente la presión también baja algo después de una sesión de fuerza.

### E3 · Entrenamiento aeróbico

**Qué es.** Ejercicio aeróbico regular, casi todos los días, mantenido durante semanas o meses. La rueda va de sedentario a entrenado.

**Qué hace.** Mejora el endotelio (produce más óxido nítrico), baja la actividad simpática de quien la tenía alta y vuelve algo más distensibles las arterias rígidas. La RVP y la presión de reposo bajan, más cuanto más alta estaba: unos 8/5 mmHg en los hipertensos y casi nada en los normotensos. El corazón late más despacio en reposo, pero cada latido expulsa más sangre: el gasto de reposo no cambia.

**En este caso**

- Caso 30 (Dieta alta en sal con entrenamiento aeróbico): La presión, la RVP y la volemia vuelven a lo normal y aparece bradicardia de reposo.
- Caso 31 (Persona sana con entrenamiento aeróbico): En una persona sana solo se nota la bradicardia de reposo: el gasto y la presión no cambian.

**En la consulta de fisioterapia.** Es el entrenamiento más estudiado: 150 minutos a la semana o más, repartidos en casi todos los días. El efecto aparece en semanas y se pierde en semanas si se deja: lo que cuenta es la constancia. Además, en el hipertenso cada sesión deja la presión 5–7 mmHg más baja durante horas. Sumar fuerza dos o tres días a la semana. El ejercicio se suma a la medicación, no la sustituye: si la presión mejora, es el médico quien ajusta el tratamiento. La bradicardia de reposo de una persona entrenada es normal; si se acompaña de mareo o desmayos, no.

> ⚠ En el simulador el entrenamiento actúa en estado estable, y el efecto es cualitativo. Dos límites del modelo: con la rigidez de la edad el entrenamiento casi no baja la sistólica; y atenúa el exceso de actividad simpática venga de donde venga: en el feocromocitoma baja la frecuencia y la presión, cuando en el paciente el entrenamiento no trata el tumor.

### E4 · Entrenamiento de fuerza

**Qué es.** Ejercicio de fuerza dinámica regular durante meses, dos o tres días a la semana.

**Qué hace.** Baja la presión de reposo: unos 4–5 mmHg la sistólica en el metaanálisis más reciente, parecido al aeróbico, aunque con menos estudios en hipertensos. El mecanismo está menos estudiado; en el simulador atenúa la RVP alta. No cambia la rigidez arterial ni da bradicardia.

**En la consulta de fisioterapia.** Mejor combinado con el aeróbico: las guías recomiendan los dos en la misma semana, y en el metaanálisis más reciente el combinado es el que más baja la sistólica después del isométrico. Además mantiene la masa muscular, clave en mayores. Dosis y precauciones, las de la sesión de fuerza: cargas moderadas y respiración continua.

> ⚠ En el simulador el entrenamiento actúa en estado estable, y el efecto es cualitativo. Límite del modelo: baja la RVP y la diastólica, pero no la sistólica, al contrario que en los metaanálisis.

### E5 · Entrenamiento isométrico

**Qué es.** Contracciones isométricas mantenidas, como la prensión de mano o la sentadilla apoyada en la pared, tres días a la semana durante semanas.

**Qué hace.** Es el entrenamiento que más baja la presión de reposo en los metaanálisis (unos 8/4 mmHg), con estudios más pequeños y cortos que los del aeróbico. El mecanismo no está claro: en el simulador atenúa la RVP alta. No da bradicardia ni cambia la rigidez.

**En la consulta de fisioterapia.** Tres días a la semana: cuatro contracciones de dos minutos con uno a cuatro minutos de descanso, por ejemplo prensión de mano al 30 % de la fuerza máxima o sentadilla apoyada en la pared. El efecto se ve a partir de unas cuatro semanas. Respirar durante la contracción, sin bloquear el aire. A esa intensidad la presión sube poco durante la contracción; por encima de la mitad de la fuerza máxima sube mucho. Se suma al aeróbico, no lo sustituye. Con la presión muy alta o mal controlada, esperar a que su médico la controle.

> ⚠ En el simulador el entrenamiento actúa en estado estable, y el efecto es cualitativo. Límite del modelo: baja la RVP y la diastólica, pero no la sistólica, al contrario que en los metaanálisis.

## Casos con fármacos (fase 4)

### 15 · Estenosis renal bilateral con IECA

**Qué mirar.** Mira la TFG y la creatinina: con el IECA la filtración se hunde y el potasio sube. La presión baja, pero a costa del riñón. La renina sube más y, aun así, la angiotensina II no sube. Gira el IECA a 0 y compara.

**El fármaco.** La filtración de un riñón con poca presión depende de que la angiotensina II contraiga la arteriola eferente. Sin ella, la TFG se hunde: por eso el IECA está contraindicado en la estenosis bilateral (y en la de un riñón único).

### 16 · Tumor de renina con IECA

**Qué mirar.** La presión baja de ↑↑ a ↑ y el potasio se normaliza. La renina sigue muy alta, pero la angiotensina II vuelve a lo normal: el IECA corta la cascada después de la renina.

**El fármaco.** El IECA corta la cascada entre la renina y la angiotensina II. La renina sube todavía más, porque baja la presión, pero lo que cuenta es la angiotensina II, que vuelve a lo normal. La aldosterona baja y el potasio se recupera.

### 17 · Tumor de renina con ARA-II

**Qué mirar.** Presión normal con la renina y la angiotensina II muy altas: el ARA-II bloquea el receptor, no la hormona. Compáralo con el caso 16, el mismo tumor con IECA.

**El fármaco.** La angiotensina II está muy alta, pero su receptor está bloqueado: no contrae las arteriolas ni estimula la aldosterona. En el simulador, el ARA-II se distingue del IECA porque la angiotensina II sube en lugar de bajar. Que aquí la presión quede normal y con el IECA quede alta es un efecto del modelo: en el paciente los dos bajan la presión de forma parecida.

### 18 · Hiperaldosteronismo con espironolactona

**Qué mirar.** Presión y potasio normales con la aldosterona todavía muy alta: el receptor está ocupado. Mira la actividad mineralocorticoide, que queda algo baja, y la renina, que deja de estar baja.

**El fármaco.** La aldosterona sigue muy alta, pero no encuentra su receptor libre: el riñón deja de retener sodio y de perder potasio. Es el tratamiento médico del hiperaldosteronismo bilateral.

### 19 · Feocromocitoma con betabloqueante solo

**Qué mirar.** La frecuencia y el gasto vuelven a lo normal y, con ellos, la sistólica. No te fíes: la RVP sigue muy alta, incluso algo más, y la diastólica sigue alta. En el paciente el betabloqueante solo puede disparar la presión, y eso el modelo no lo muestra. Lee el aviso.

**El fármaco.** Al bloquear los receptores β desaparece la dilatación β2 y la vasoconstricción α1 queda sin oposición: la RVP sube algo más. En el modelo la sistólica baja porque el corazón bombea menos; en el paciente puede ocurrir lo contrario, una crisis hipertensiva, que el modelo no reproduce. Por eso nunca se da un betabloqueante sin haber bloqueado antes los receptores α.

### 20 · Feocromocitoma con alfa y betabloqueante

**Qué mirar.** La presión, la RVP, el gasto y la frecuencia vuelven a lo normal: el alfabloqueante dilata las arteriolas y el betabloqueante frena el corazón. La actividad simpática sigue muy alta: el tumor sigue ahí. Quita el alfabloqueante y mira qué pasa con la RVP.

**El fármaco.** Primero el alfabloqueante, que dilata las arteriolas, y después el betabloqueante, que frena la taquicardia. Es la preparación para operar el tumor.

### 21 · Dieta alta en sal con tiazida

**Qué mirar.** La volemia, la RVP y la presión vuelven a lo normal y el potasio baja. Casi siempre pasa sin síntomas; si baja mucho, da debilidad y palpitaciones.

**El fármaco.** La tiazida hace orinar el sodio que sobra: la volemia y la RVP vuelven a lo normal. El precio es el potasio bajo.

### 22 · Hipertiroidismo con betabloqueante

**Qué mirar.** El gasto vuelve a lo normal y, con él, la sistólica; la frecuencia queda incluso algo baja. La RVP y la diastólica siguen bajas: el betabloqueante no corrige el hipertiroidismo.

**El fármaco.** El betabloqueante (sobre todo el propranolol) controla la taquicardia y la sistólica mientras el tiroides se trata. No corrige la causa.

### 23 · Caída de la filtración con diurético de asa

**Qué mirar.** La presión vuelve a lo normal y el potasio, que estaba alto, también. La volemia pasa de alta a baja y la renina sube: a dosis plena el diurético se pasa. Prueba con media dosis. La creatinina sigue alta.

**El fármaco.** Con la filtración baja, la tiazida pierde eficacia y se suele usar el diurético de asa: saca el volumen retenido y el potasio que sobraba. La creatinina no mejora, porque el riñón sigue filtrando poco.

### 24 · Dieta alta en sal con calcioantagonista

**Qué mirar.** La RVP y la presión vuelven a lo normal, pero la volemia sigue alta y el gasto sube algo: el calcioantagonista dilata, no saca el volumen. Compáralo con el caso 21, la misma dieta con tiazida.

**El fármaco.** El calcioantagonista baja la presión dilatando las arteriolas, sin tocar el volumen. Por eso no depende del sistema renina-angiotensina y no baja el potasio, pero deja la volemia alta: con la sal, la tiazida ataca la causa.

### 35 · Estenosis renal unilateral con IECA

**Qué mirar.** Con el IECA la presión vuelve a lo normal. La filtración baja algo, pero la creatinina apenas se mueve. Cambia a «Bilateral» o «Riñón único»: la filtración se hunde, sube la creatinina y salta la contraindicación.

**El fármaco.** Como la hipertensión depende de la angiotensina II, el IECA la controla bien. La filtración baja algo, sobre todo en el riñón afectado, pero el sano sostiene el resto: la creatinina apenas se mueve. Aun así, se vigila: ese riñón puede perder función sin que la creatinina avise.

## Casos con ejercicio (fase 5)

### 25 · Sesión aeróbica moderada

**Qué mirar.** Mira el dial: la sistólica sube y la diastólica se queda donde estaba. El gasto y la frecuencia suben mucho y la luz de la arteriola se abre: el músculo que trabaja se dilata. Cambia el momento a «Al terminar»: la aguja queda un poco por debajo de la de antes.

**El ejercicio.** El gasto sube mucho y el músculo que trabaja se dilata: la sistólica sube y la diastólica se mantiene. Es la respuesta normal al ejercicio dinámico.

### 26 · Sesión aeróbica con betabloqueante

**Qué mirar.** Compáralo con el caso 25 y mira la aguja de antes. Con el betabloqueante la frecuencia ya era baja en reposo y, con el mismo esfuerzo, se queda en lo normal; sin fármaco está muy alta. La sistólica también sube menos. Por eso la intensidad se dosifica con la escala de Borg y no con la frecuencia.

**El ejercicio.** Con el betabloqueante la frecuencia es más baja en reposo y en cada nivel de esfuerzo: los receptores β1 están bloqueados y la frecuencia sube sobre todo por la retirada vagal. Las frecuencias diana calculadas por la edad no valen: se usa la escala de esfuerzo percibido (Borg).

### 27 · Sesión de fuerza intensa

**Qué mirar.** Aquí sube también la diastólica: la RVP sube en lugar de bajar. Compáralo con el caso 25, el ejercicio aeróbico.

**El ejercicio.** El músculo contraído comprime sus vasos y, si se bloquea la respiración (maniobra de Valsalva), la presión de dentro del tórax sube aún más: suben las dos presiones. En culturistas, con cargas casi máximas hasta el fallo y la respiración bloqueada, se han medido más de 300/200 mmHg.

### 28 · Dieta alta en sal: al terminar la sesión

**Qué mirar.** La presión, alta antes de la sesión, queda normal al terminar. Cambia entre «Antes», «Durante» y «Al terminar» y mira la aguja tenue del dial: es la presión de antes.

**El ejercicio.** Durante unas horas después de una sesión aeróbica la presión baja (hipotensión postejercicio): el músculo sigue dilatado y el barorreflejo se reajusta a la baja. Baja más cuanto más alta estaba: en el hipertenso, unos 5–7 mmHg, y puede durar buena parte del día.

### 29 · Dieta alta en sal con alfabloqueante: al terminar la sesión

**Qué mirar.** La RVP queda por debajo de lo normal: se suman el alfabloqueante y la dilatación del final de la sesión. Lee el aviso: el riesgo está al levantarse.

**El ejercicio.** A la vasodilatación del alfabloqueante se suma la del final de la sesión: la RVP queda por debajo de lo normal. Al levantarse, los vasos se contraen peor y cuesta sostener la presión (hipotensión ortostática). El modelo no tiene postura: lo cuenta el aviso.

### 30 · Dieta alta en sal con entrenamiento aeróbico

**Qué mirar.** La presión, la RVP y la volemia vuelven a lo normal y aparece bradicardia de reposo. Prueba los otros dos entrenamientos: bajan la RVP y la diastólica, pero no dan bradicardia, y en el modelo no bajan la sistólica.

**El ejercicio.** Tras meses de entrenamiento la RVP y la diastólica bajan y aparece bradicardia de reposo. En los hipertensos la presión baja unos 8/5 mmHg; en los normotensos, casi nada.

### 31 · Persona sana con entrenamiento aeróbico

**Qué mirar.** Solo cambia la frecuencia de reposo, que baja. El gasto no cambia: cada latido expulsa más sangre.

**El ejercicio.** El corazón entrenado se llena más y expulsa más sangre en cada latido: con menos latidos mantiene el mismo gasto. La presión apenas cambia en quien la tiene normal.

### 32 · Feocromocitoma: sesión aeróbica

**Qué mirar.** El simpático llega al tope con un esfuerzo moderado. No te fíes del dial: la sistólica ya estaba cerca del tope y apenas se mueve, y la diastólica incluso baja, porque el músculo se dilata. En el paciente el esfuerzo puede disparar la presión, y eso el modelo no lo muestra. Lee el aviso: hasta tratar el tumor, nada de ejercicio intenso.

**El ejercicio.** El simpático ya estaba casi al máximo por las catecolaminas del tumor y el esfuerzo lo lleva al tope. El modelo no reproduce la crisis: la sistólica no tiene margen para subir y la vasodilatación del músculo baja la diastólica. En el paciente el esfuerzo puede desencadenar una crisis hipertensiva: hasta tratar el tumor, nada de ejercicio intenso.

### 33 · Hipertiroidismo: sesión aeróbica vigorosa

**Qué mirar.** La frecuencia y el gasto llegan al tope de escala. Lee el aviso: con el hipertiroidismo sin controlar, ejercicio suave.

**El ejercicio.** La frecuencia y el gasto ya estaban altos en reposo y llegan al tope de escala con el esfuerzo. Mientras no se controle el tiroides, la tolerancia al esfuerzo es baja: ejercicio suave y vigilando la frecuencia.

## Avisos de interacción (fases 4 y 5)

- **Contraindicado** (contraindicado; estenosis + alguno de ieca o ara2): IECA o ARA-II en la estenosis renal bilateral (o de un riñón único): la filtración se sostenía porque la angiotensina II contraía la arteriola eferente. Sin ese apoyo, y con menos presión, se hunde: suben la creatinina y el potasio.
- **Vigilar la creatinina** (precaucion; estenosis + alguno de ieca o ara2): IECA o ARA-II en la estenosis renal unilateral: controlan bien esta hipertensión, que depende de la renina. La filtración baja algo, pero el riñón sano sostiene la creatinina. Se piden creatinina y potasio antes de empezar y a las pocas semanas: si suben mucho, la estenosis puede ser de las dos arterias. Con el ARA-II el modelo exagera la caída.
- **Contraindicado** (contraindicado; feo + betabloqueante + sin alfabloqueante): Betabloqueante sin alfabloqueante en el feocromocitoma: la vasoconstricción α1 queda sin oposición y puede desencadenar una crisis hipertensiva. El modelo no la reproduce: la RVP sigue muy alta, pero la sistólica baja porque cae el gasto. Primero el alfabloqueante y después el betabloqueante.
- **No se asocian** (contraindicado; ieca + ara2): IECA y ARA-II juntos (doble bloqueo del sistema renina-angiotensina): no protegen más el corazón ni el riñón y aumentan el riesgo de hiperpotasemia, hipotensión y fallo renal agudo.
- **Vigilar el potasio** (precaucion; espironolactona + alguno de ieca o ara2): Espironolactona con IECA o ARA-II: los dos retienen potasio, y más si la filtración es baja. Se asocian (por ejemplo, en la insuficiencia cardíaca o en la hipertensión resistente), pero con analíticas de control.
- **Cuidado con la deshidratación** (precaucion; accesoAgua + alguno de ieca o ara2 o tiazida o diureticoAsa o espironolactona): Sin agua, el riñón depende de la angiotensina II para filtrar y el diurético sigue sacando volumen: la presión cae y la filtración se hunde. Es lo que pasa con el calor, los vómitos o un esfuerzo largo sin beber.
- **No hacer ejercicio intenso** (contraindicado; feo + alguno de sesionAerobica o sesionFuerza + solo durante): Feocromocitoma sin tratar: el esfuerzo suma más actividad simpática a la de las catecolaminas del tumor y puede desencadenar una crisis hipertensiva. El modelo no la reproduce: la sistólica ya estaba cerca del tope. Hasta que esté tratado, solo actividad suave.
- **El entrenamiento no trata el tumor** (precaucion; feo + alguno de entrenoAerobico o entrenoFuerza o entrenoIsometrico): En el modelo el entrenamiento atenúa el exceso de actividad simpática y baja la frecuencia y la presión del feocromocitoma. En el paciente no: las catecolaminas salen del tumor. Hasta tratarlo, solo actividad suave.
- **Tiroides sin controlar** (precaucion; tiroides + alguno de sesionAerobica o sesionFuerza + solo durante): En el hipertiroidismo la frecuencia ya está alta en reposo y llega pronto al tope; en el hipotiroidismo la tolerancia al esfuerzo es baja. Hasta que esté controlado, ejercicio suave, vigilando la frecuencia. Palpitaciones o pulso irregular: parar y avisar al médico.
- **Dosificar con la escala de Borg** (precaucion; betabloqueante + alguno de sesionAerobica o sesionFuerza + solo durante): Con betabloqueante la frecuencia es más baja en reposo y en el esfuerzo: las frecuencias diana por edad no valen. Mejor la escala de esfuerzo percibido (Borg) o el test del habla.
- **Cuidado al levantarse** (precaucion; alfabloqueante + alguno de sesionAerobica o sesionFuerza + solo despues): Alfabloqueante al terminar el ejercicio: después de la sesión la presión baja, y con el fármaco los vasos se contraen peor al ponerse de pie. Vuelta a la calma larga, sin pararse de golpe, y levantarse despacio. El modelo no tiene postura: tras la sesión aeróbica se ve la RVP por debajo de lo normal, pero el mareo no se ve.
- **Hidratación y calor** (precaucion; alguno de tiazida o diureticoAsa o espironolactona o accesoAgua + alguno de sesionAerobica o sesionFuerza + solo durante o despues): Con un diurético, o sin poder beber, el sudor de un esfuerzo largo o con calor saca todavía más volumen: mareo, calambres y riesgo de golpe de calor. Beber durante la sesión y evitar las horas de calor.
- **Respirar durante el esfuerzo** (precaucion; sesionFuerza + solo durante): Con cargas altas, bloquear la respiración (maniobra de Valsalva) dispara las dos presiones. En el hipertenso, cargas moderadas, más repeticiones y soltar el aire en el esfuerzo.

## Rotular capas

1. **Íntima** (arteria): endotelio que tapiza la luz, sobre una capa fina de tejido conjuntivo. La lámina elástica interna la separa de la media.
2. **Media** (arteria): muchas láminas elásticas con músculo liso entre ellas. Con la edad se fragmentan y la pared se vuelve rígida.
3. **Adventicia** (arteria): tejido conjuntivo que envuelve el vaso.
4. **Placa de ateroma** (arteria): crece en la íntima y hace la pared más gruesa y rígida (solo se ve si hay placa).
5. **Endotelio** (arteriola): una sola capa de células que tapiza la luz.
6. **Media** (arteriola): una o dos capas de músculo liso, sin láminas elásticas gruesas. Al contraerse estrecha la luz y sube la RVP.
7. **Adventicia** (arteriola): tejido conjuntivo fino.

## Animaciones

### adh · En la célula del túbulo colector

Descripción para lector de pantalla: Animación: la ADH llega por la sangre y se une a su receptor; las vesículas con acuaporinas se funden con la membrana del lado de la orina y el agua pasa de la orina a la sangre.

1. La ADH llega por la sangre y se une a su receptor V2.
2. Las vesículas con acuaporina 2 se funden con la membrana del lado de la orina.
3. El agua pasa de la orina a la célula por las acuaporinas y sale a la sangre: la orina se concentra.

> Esquema simplificado: muestra los pasos principales del mecanismo celular, no todos.

### aldosterona · En la célula principal del túbulo colector

Descripción para lector de pantalla: Animación: la aldosterona entra en la célula y en el núcleo; aparecen canales de sodio y bombas sodio-potasio nuevos; el sodio pasa de la orina a la sangre y el potasio de la sangre a la orina.

1. La aldosterona llega por la sangre y atraviesa la membrana.
2. Se une a su receptor, dentro de la célula, y los dos entran juntos en el núcleo.
3. La célula fabrica canales de Na⁺ y bombas Na⁺/K⁺ nuevos, que van a las membranas.
4. El Na⁺ entra desde la orina y la bomba lo saca a la sangre; el K⁺ que mete la bomba sale a la orina.

> Esquema simplificado: muestra los pasos principales del mecanismo celular, no todos.

### regaliz · En la célula principal del túbulo colector

Descripción para lector de pantalla: Animación en dos partes. Sin regaliz, la enzima 11β-HSD2 convierte el cortisol en cortisona, que no activa el receptor. Con regaliz, el ácido glicirrícico bloquea la enzima y el cortisol ocupa el receptor de la aldosterona.

1. Sin regaliz: la enzima 11β-HSD2 convierte el cortisol en cortisona, que no activa el receptor.
2. Con regaliz: el ácido glicirrícico bloquea la enzima.
3. El cortisol llega intacto, ocupa el receptor de la aldosterona y actúa como ella: más Na⁺ reabsorbido y más K⁺ perdido.

> Esquema simplificado: muestra los pasos principales del mecanismo celular, no todos.

### renina · En el aparato yuxtaglomerular

Descripción para lector de pantalla: Animación: la sangre llega al glomérulo por la arteriola aferente y el túbulo de la misma nefrona pasa junto a ella. Cuando baja la presión en la aferente o llega poco NaCl a la mácula densa, las células granulares liberan renina a la sangre.

1. La sangre llega al glomérulo por la arteriola aferente. El túbulo de la misma nefrona vuelve a pasar junto a ella: ahí está la mácula densa, que mide el NaCl que pasa.
2. Baja la presión en la aferente (estenosis, poco volumen) o llega poco NaCl a la mácula densa.
3. Las células granulares de la pared de la aferente liberan renina a la sangre. El simpático (receptores β1) también las estimula.

> Esquema simplificado: muestra los pasos principales del mecanismo celular, no todos.

### placa · En la pared de la arteria grande

Descripción para lector de pantalla: Animación: el endotelio se daña, el LDL entra en la íntima y se oxida, un monocito entra y se convierte en macrófago, el macrófago se llena de LDL y se convierte en célula espumosa, y el músculo liso y el colágeno forman una capa fibrosa sobre la placa.

1. El tabaco, la diabetes, la hipertensión o el LDL alto dañan el endotelio.
2. El LDL entra en la íntima y se oxida.
3. Un monocito se pega al endotelio, entra y se convierte en macrófago.
4. El macrófago se llena de LDL oxidado: es una célula espumosa.
5. Llegan células de músculo liso de la media y forman colágeno: una capa fibrosa cubre la placa.

> Esquema simplificado: en la realidad la placa tarda años en formarse.
