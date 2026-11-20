# Revisión fisiológica del hito 3a

14 nov 2026 · revisión de la fisiología del modelo calibrado (158/158) · no se ha tocado `relaciones.ts`, `propuestas.ts`, `calibracion.ts` ni `casos.ts`

## Resumen

La calibración pasa los 12 casos, pero la tabla solo mira 12 columnas. Al mirar también las ruedas de mecanismo (TFG, perfusión renal, frecuencia cardíaca, simpático) y las combinaciones que no están en la tabla, aparecen **cuatro problemas de gravedad alta**:

1. **La hipertensión produce hiperfiltración** (TFG ↑↑ en el tumor de renina, el feocromocitoma y el hiperaldosteronismo). Es el efecto real de subir la 39 a 1,0 con la 40 en 1,5: la autorregulación renal ha desaparecido y la natriuresis por presión vuelve a pasar por la TFG, que es justo lo que O2 quería evitar.
2. **El hipertiroidismo casi no da taquicardia** y la poca que da llega por el simpático, que es el error que D5 corregía. La 47 no hace falta anularla: **con 0,3 pasan los 158 tests** y la FC sale ↑.
3. **La dieta baja en sal (sal −1) produce volemia ↓↓, creatinina ↑ e hiponatremia.** No está en ningún caso, pero es el extremo de una rueda común y la recomendación que se da a todo hipertenso. Una asimetría en la 7 lo arregla sin romper nada.
4. **La deshidratación no da taquicardia ni activación simpática** (FC y simpático «=» con volemia ↓↓). Falta el reflejo de volumen bajo; añadirlo exige recalibrar.

Tres cambios se pueden aplicar ya sin romper ningún test (comprobado en una copia local): 47 a 0,3 · 7 con peso 0,3 por debajo de 0 · 74 a 0,3 por encima de 0. El resto necesita una recalibración o una decisión de Edu.

De las cuatro decisiones sobre la tabla, tres son correctas. La del **caso 4 (diuresis ↓ en el SIADH)** se apoya en un motivo que la bibliografía contradice: los pacientes con SIADH siguen bebiendo lo normal.

## Cómo se ha revisado

- Lectura de `modelo-v2.1.md`, `calibracion.md`, los cuatro archivos del tema y el motor.
- Volcado del estado completo (todos los nodos, tres escalas) de los 12 casos, más 23 combinaciones fuera de la tabla y curvas de dosis-respuesta de 9 ruedas.
- Cada propuesta se ha probado sobre el modelo calibrado en una copia local, cambiando solo esa relación. «Pasa 158/158» y «rompe N celdas» son resultados medidos, no estimaciones. No se ha vuelto a ejecutar el calibrador.
- Fuentes: las marcadas **[V]** se han comprobado en PubMed durante esta revisión (existencia y resumen). Las marcadas **[M]** son de memoria (fisiología de manual, tipo Guyton y Hall) y no se han verificado.

## Hallazgos, por gravedad

| # | Dónde | Problema | Gravedad | Propuesta | ¿Rompe casos? |
| --- | --- | --- | --- | --- | --- |
| 1 | 39 (1,0) + 40 (1,5) + 76 | Sin autorregulación renal: TFG ↑↑ con cualquier hipertensión. Caso 7: TFG +0,77 · caso 9: +0,65 · caso 8: +0,53. En la caída de la filtración (caso 6) la «perfusión renal» sale ↑↑ | **Alta** | Mantener la 39 fuerte y hacer asimétrica la 40: ≤ 0,3 por encima de 0, 1,5 por debajo. 76 solo por debajo de 0. Añadir la TFG a la tabla en los casos 7, 8 y 9 (= o ↑, nunca ↑↑) | 40 a 0,3/1,5: 9 celdas. 40 a 1,0/1,5: 1 celda (4 días diuresis, −0,51). 76 solo < 0: 10 celdas. Hay que recalibrar |
| 2 | 47 (1,0 → 0,05) | Hipertiroidismo con FC +0,20, toda vía simpático. Con tiroides 0,75 el gasto es ↑↑ y la FC «=» | **Alta** | 47 = 0,3 (FC +0,42, PAS +0,47) | No: 158/158. Con 0,4 también pasa (PAS +0,49, muy justa). Desde 0,5 falla 2 PAS |
| 3 | 7 y 8 por debajo de 0 (sal −1) | Dieta baja en sal: volemia −0,56 ↓↓, creatinina ↑, natremia ↓, renina ↑↑ | **Alta** | 7 con `intensidadNegativa` 0,3: volemia −0,17, renina y aldosterona ↑, creatinina y natremia «=» | No: 158/158 (ningún caso usa sal < 0) |
| 4 | Estado estable sin 65; 71 < 0; 12 | Deshidratación (caso 11): simpático +0,14 y FC +0,09, las dos «=», con volemia ↓↓ | **Alta** | Nueva relación Volemia → Simpático (−), solo por debajo de 0, desde «días». Con ella, 71 por debajo de 0 puede ir a 0 | Sí: 11–16 celdas de los casos 11 y 12. Hay que recalibrar |
| 5 | 74 (0,3 → 0,1) | La angiotensina II apenas sostiene la TFG: en el caso 5 aporta 0,02. La lección del IECA en la estenosis bilateral (fase 4), para la que se creó la 74, queda sin efecto. El motivo escrito no coincide con lo que mide `sin-ajuste.ts` | Media | 74 = 0,3 por encima de 0 y 0,1 por debajo | No: 158/158 |
| 6 | Caso 4, diuresis ↓; 13 y 14 < 0 | El motivo «con hiponatremia se bebe menos» no es lo que ocurre en el SIADH. Además, 14 < 0 dice «se sigue bebiendo por hábito» y 13 dice que se bebe menos: se contradicen | Media | Mantener la celda como límite del modelo, cambiar el motivo y añadir una nota al caso. Arreglo real: reajuste del umbral de sed o ingesta basal, en una recalibración | Probado 9 con peso bajo por debajo de 0: rompe 5–6 celdas (el SIADH retiene volumen y sube la presión) |
| 7 | Tiroides −1 (hipotiroidismo) | Extremo de rueda sin caso: sale sed ↑, diuresis ↑ y volemia ↓↓. La hipertensión diastólica (PAD ↑, RVP ↑↑) sí sale bien | Media | Añadir un caso 13 (hipotiroidismo) a la tabla antes de la próxima calibración, o un aviso en ese extremo | No se ha probado |
| 8 | P4 (umbral en 37) | El recurso es razonable; el motivo («K muy defendido») es pobre. La razón de manual es otra | Baja | Reescribir el motivo: la secreción de K depende de la aldosterona **y** del Na que llega al túbulo distal; con volumen bajo llega poco y el K no cae | No (solo texto) |
| 9 | 12 y 31 (0,05) | No conviene eliminarlas. La 12 es lo poco que sostiene la RVP ↑ de la deshidratación; la 31 es fisiología bien establecida y es bloqueable en la fase 4 | Baja | Dejarlas como están | Sin la 12: 4 celdas. Sin la 31: 1 celda (12 renina, +0,50) |
| 10 | 28 < 0 (0,6 → 1,0) | Correcto. La asimetría de la v2 era un recurso de modelado, no fisiología: con renina suprimida la aldosterona baja de verdad | Baja | Mantener 1,0 | Volver a 0,6 rompe 2 celdas |
| 11 | 8, 33 y 41 (2,5–3) | Los motivos son correctos. Efecto secundario: las ruedas saturan pronto (hiperaldosteronismo 0,5 ya da aldosterona ↑↑) y la 8 simétrica causa el hallazgo 3 | Baja | Mantener. Opcional: aceptar K «↓ o ↓↓» en el caso 8 y bajar la 33 a 2 | 33 = 2: 1 celda (8 potasio, −0,47). 41 = 2: 1 celda (6 creatinina, +0,49) |
| 12 | 71 < 0 (0,45) | El motivo dice «domina la vasoconstricción», pero el peso sigue siendo positivo: con volumen bajo la relación **baja** la RVP | Baja | Corregir el texto ahora; el valor, con el hallazgo 4 | 71 < 0 a 0: 9 celdas |
| 13 | 54 (1,0 → 1,25) | Una ganancia mayor que 1 de la FC sobre el gasto no es fisiológica (a FC alta cae el llenado) | Baja | Volver a 1,0 en la próxima calibración | 1 celda (10 RVP, 0,15) |
| 14 | P2 (75), texto | Actúa en todos los casos con volemia alta, no solo en el SIADH. «Pierde acuaporinas» solo está descrito para el escape de la vasopresina | Baja | Explicación más general: «con volumen alto mantenido el riñón deja de retener agua (escape)» | No (solo texto) |
| 15 | Caso 8, potasio ↓↓ | Es el cuadro clásico, pero la hipopotasemia solo aparece en una minoría de los hiperaldosteronismos primarios | Baja | Nota en el caso 8 | No |
| 16 | Caso 9, gasto ↑↑ | Discutible: con predominio de noradrenalina la hipertensión es sobre todo por RVP y el gasto no sube tanto | Baja | Nota, o aceptar «↑ o ↑↑» | No se ha probado |
| 17 | Sal +1 en minutos | Natremia ↑↑ (+0,58) y diuresis ↓↓ a los minutos de una comida salada | Baja | Revisar al calibrar la escala de minutos | — |

## A. Los cinco puntos marcados para revisar

### 39 · PAM → perfusión renal (0,3 → 1,0)

**Opinión: la 39 fuerte es defendible; lo que falla es la 40.** La «perfusión renal» del modelo es la presión en la arteriola aferente, y esa presión sí sigue a la arterial. De hecho es la lógica del riñón de Goldblatt: la presión sistémica sube hasta que la presión más allá de la estenosis se recupera, y eso es lo que hace el caso 5 (perfusión −0,67 en minutos, −0,37 en estado estable) **[M]**.

El problema está un paso después. La TFG se mantiene estable entre 80 y 180 mmHg de presión de perfusión **[V: Carlström 2015]**, pero la 40 (1,5) pasa a la TFG toda la subida. Consecuencias que se ven en las ruedas:

- TFG ↑↑ en el tumor de renina (+0,77), el feocromocitoma (+0,65) y el hiperaldosteronismo (+0,53); ↑ con la sal (+0,44). En el feocromocitoma y con angiotensina II alta, el flujo renal real baja por vasoconstricción aferente **[M]**. En el hiperaldosteronismo sí hay una hiperfiltración relativa descrita **[V: Ribstein 2005]**, pero leve: ↑, no ↑↑.
- La natriuresis por presión vuelve a pasar por la TFG (39 → 40 → 42 y 22). O2 se contradice en el fondo, no solo en la letra.
- En la caída de la filtración (caso 6) la perfusión renal sale ↑↑ (+0,55) con el riñón enfermo.

Propuesta: 40 asimétrica (débil por encima de 0, fuerte por debajo). Es la forma de la autorregulación: protege de la presión alta y falla con la presión baja. Con 0,3/1,5 se rompen 9 celdas (2 diuresis, 3 GC, 4 PAD, 4 aldosterona, 4 días diuresis, 8 GC, 8 renina, 8 diuresis, 9 volemia), casi todas por márgenes de 0,01–0,05: la calibración actual se apoya en esa hiperfiltración. Hay que recalibrar con la 40 fijada.

### 47 · Tiroides → FC (1,0 → 0,05)

**Opinión: no hace falta anularla.** La taquicardia es el signo cardinal del hipertiroidismo y es un efecto directo sobre el nódulo sinusal **[V: Klein y Ojamaa 2001, existencia; el detalle del mecanismo, M]**. Con 0,05, la FC del caso 2 (+0,20) llega casi toda por el nodo simpático, y el alumno deduce «el hipertiroidismo acelera el corazón porque activa el simpático», que es lo que D5 corrige.

| 47 | FC caso 2 | PAS caso 2 | Tests |
| --- | --- | --- | --- |
| 0,05 (actual) | +0,20 ↑ | +0,40 ↑ | 158/158 |
| 0,3 | +0,42 ↑ | +0,47 ↑ | 158/158 |
| 0,4 | +0,50 ↑↑ | +0,49 ↑ | 158/158 |
| 0,5 | +0,57 ↑↑ | +0,51 ↑↑ | falla 2 PAS |
| 1,0 | — | +0,55 ↑↑ | fallan 2 PAS y 2 RVP |

Recomiendo 0,3. De paso, el hipotiroidismo pasa a dar bradicardia clara (FC −0,41 en lugar de −0,18). La alternativa de aceptar PAS ↑↑ en el caso 2 no la recomiendo: la hipertensión del hipertiroidismo es sistólica y moderada.

### 28 por debajo de 0 (0,6 → 1,0)

**De acuerdo.** Con la renina suprimida la aldosterona baja (es lo que pide el caso 10 y lo que se ve en el seudohiperaldosteronismo por regaliz) **[M]**. El freno que queda en el modelo para que no caiga a cero es el potasio (73), que es el correcto.

### 8, 33 y 41 (ganancias de 2,5 a 3)

**Aceptables, con un efecto secundario cada una.**

- **8 (osmolaridad → ADH, 3,0).** Motivo correcto: la ADH responde a cambios del 1–2 % **[M]**. Pero la ganancia es simétrica: una osmolaridad algo baja apaga la ADH y provoca una diuresis acuosa que vacía la volemia. Es el origen del hallazgo 3.
- **33 (adenoma → aldosterona, 3,0).** Motivo correcto (secreción autónoma). La rueda satura: con 0,5 la aldosterona ya es ↑↑ (+0,74) y la PAS apenas llega a ↑ (+0,19). Con 33 = 2 solo falla el potasio del caso 8 (−0,47 en lugar de ↓↓).
- **41 (caída de la filtración → TFG, 2,5).** Coherente con el umbral de la creatinina. Con 2,0 la creatinina queda en +0,49.

### 12 y 31 (a 0,05)

**No eliminarlas.** Sin la 12, la RVP de la deshidratación baja de +0,18 a +0,14 y falla: la vasoconstricción del caso 11 depende de 0,04 unidades de ADH, lo que indica que al caso le falta su mecanismo real (hallazgo 4). La 31 es fisiología sólida: la angiotensina II es un estímulo potente de la sed **[V: Fitzsimons 1998]**; con peso 0,05 no enseña nada falso y queda disponible para la fase 4.

## B. Motivos de `calibracion.ts`

De los 42, la mayoría son correctos o son ajustes finos sin contenido fisiológico («ajuste fino de…»), que no enseñan nada falso. Los que conviene cambiar:

| Relación | Motivo escrito | Problema | Texto propuesto |
| --- | --- | --- | --- |
| 74 | «La angiotensina sostenía tanto la TFG que la estenosis no subía la creatinina» | Eso es fisiología real, no un defecto. Y al volver a 0,3 solo falla «4 días diuresis»; la creatinina del caso 5 sigue en ↑ | Restaurar 0,3 por encima de 0 (hallazgo 5) |
| 14 < 0 | «Se sigue bebiendo por hábito» | Se contradice con la 13, que con la misma sed baja reduce la ingesta | «En el SIADH el umbral de la sed se reajusta a la baja: la hiponatremia no hace beber menos» |
| 71 < 0 | «Con volumen bajo domina la vasoconstricción» | El peso es positivo: sigue vasodilatando, solo que menos | «Con volumen bajo la autorregulación pesa menos; la vasoconstricción refleja se modela aparte» |
| 54 | «Compensa el debilitamiento de la 51» | Es un motivo de calibración, no fisiológico, y deja una ganancia > 1 | Marcar como provisional |
| 42 | «En estado estable la diuresis la marca el balance de agua» | Correcto, pero hay un motivo mejor | «Equilibrio glomerulotubular: el túbulo reabsorbe en proporción a lo filtrado, y la diuresis depende de la reabsorción más que de la TFG» **[M]** |
| 21 | «La presión llega ahora a la renina por la 39» | Correcto, pero deja en «débil» el sensor principal de la renina. No rompe nada hoy; sí limitará la estenosis unilateral (renina ↑↑) | Anotarlo como límite para la ampliación de lateralidad |
| 9 | «El umbral osmótico de la sed es más alto que el de la ADH» | Es la enseñanza clásica **[M]**; una ganancia menor no es lo mismo que un umbral más alto | Aceptable |

Los motivos de 16 (por debajo de 0: sin ADH la diuresis se multiplica; la antidiuresis solo la reduce a un tercio) y 63 (la volemia frena poco la ADH con cambios pequeños) son correctos **[M]**.

## C. Asimetrías nuevas y P1–P4

- **14 por debajo de 0.** El resultado (la hiponatremia del SIADH no se corrige sola) es correcto; el motivo no (ver B).
- **16 por debajo de 0.** Correcta y bien motivada.
- **71 por debajo de 0.** El valor es un parche. Con volumen bajo, la RVP sube por reflejo simpático, angiotensina II y ADH, no por menos autorregulación. Ver hallazgo 4.
- **71 por encima de 0 (1,3).** Es la relación de fisiología con más ganancia del modelo y representa la autorregulación de todo el organismo de Guyton, que es la explicación de manual pero no un hecho medido con esa fuerza **[M]**. Reproduce bien el patrón «gasto normal, RVP alta» de los casos 3, 8 y 10. Aceptable; conviene decir en la ficha que es un modelo explicativo.
- **P1.** Correcto. Detalle: en «minutos» el hiperaldosteronismo muestra aldosterona ↑↑ y nada más, lo que es coherente (los efectos renales tardan horas).
- **P2 (75).** Fisiología verificada para el SIADH: el escape coincide con una caída de la acuaporina 2 independiente de la vasopresina **[V: Ecelbarger 1997, en rata]**. Reparo menor: el texto (hallazgo 14).
- **P3 (76).** Correcta por debajo de 0 (azotemia prerrenal). Por encima de 0 suma a la hiperfiltración del hallazgo 1; debería actuar solo con volumen bajo.
- **P4.** Recurso correcto, motivo mejorable (hallazgo 8). La «paradoja de la aldosterona» explica por qué el hiperaldosteronismo secundario a hipovolemia no da hipopotasemia y el primario sí **[V: Arroyo 2011, concepto; el detalle, M]**.

## D. Decisiones sobre la tabla

| Caso | Decisión | Opinión |
| --- | --- | --- |
| 3 · natremia «= o ↑ leve» | Aceptar las dos | Correcta |
| 6 · diuresis «=» (↓ en días) | La oliguria es de la fase de días | Correcta. En la enfermedad renal crónica estable el volumen de orina se conserva hasta fases avanzadas **[M]** |
| 11 · PAD «=» | La vasoconstricción mantiene la diastólica | Correcta: en la hipovolemia compensada se estrecha la presión de pulso **[M]**. Pero el modelo llega a ese resultado sin simpático ni taquicardia (hallazgo 4) |
| 4 · diuresis ↓ | Con hiponatremia se bebe menos | **Enseña algo dudoso.** Los pacientes con SIADH siguen bebiendo cantidades normales pese a la hiponatremia, porque el umbral osmótico de la sed se reajusta a la baja **[V: Smith 2004]**. En estado estable la diuresis iguala a esa ingesta normal: orina concentrada, de volumen normal o algo bajo. El «=» original era más fiel |

Para el caso 4 no hay arreglo barato: al impedir que la sed baje con la hipoosmolaridad, el SIADH retiene volumen y sube la presión (5–6 celdas). Propongo dejar la celda, corregir el motivo y añadir a la nota del caso: «En el modelo la diuresis sale baja porque la sed disminuye; en el paciente real la sed se mantiene y la orina es concentrada pero de volumen casi normal». Lo que sí funciona bien: la restricción de agua mejora la natremia (de −0,53 a −0,33 con acceso al agua −0,5) y la sal también (natremia «=»).

## E. Riesgos docentes al girar las ruedas

Conclusiones erróneas que un alumno podría sacar, con los pesos actuales:

| Lo que hace el alumno | Lo que ve | Lo que concluiría | Hallazgo |
| --- | --- | --- | --- |
| Cualquier causa de hipertensión | TFG y perfusión renal ↑ o ↑↑ | «La hipertensión hace filtrar más al riñón» | 1 |
| Tiroides hasta 0,75 | Gasto ↑↑ con FC «=» | «El hipertiroidismo no da taquicardia» | 2 |
| Sal a −1 | Volemia ↓↓, creatinina ↑, natremia ↓ | «La dieta sin sal daña el riñón y da hiponatremia» | 3 |
| Acceso al agua a −1 | FC y simpático «=» | «La deshidratación no acelera el pulso» | 4 |
| Tiroides a −1 | Sed ↑, diuresis ↑, volemia ↓↓ | «El hipotiroidismo da poliuria» | 7 |
| Hiperaldosteronismo a 0,3 · sal a 0,75 · regaliz a 0,75 | Mecanismos alterados y PAS «=» | «Hace falta mucha causa para que suba la presión» | Ver abajo |
| Hiperaldosteronismo a 0,5 frente a 1 | Aldosterona ↑↑ en los dos | «La rueda no hace nada a partir de la mitad» | 11 |
| Sal −1 con hiperaldosteronismo +1 | La presión se normaliza (bien) y el K sigue ↓↓ | Lo primero es correcto; lo segundo no: con poca sal se pierde menos K **[M]** | 8 |

**Causas de volumen con poco margen.** La PAS del hiperaldosteronismo (+0,25), la sal (+0,19) y el regaliz (+0,17) queda cerca del umbral de 0,15 incluso con la rueda al máximo; a tres cuartos de rueda ya es «=». La tabla lo pide así (↑), pero en la interfaz parecerá que esas causas casi no suben la presión. Convendría más margen en la próxima calibración (PAS ≥ 0,25 con la rueda al máximo).

Combinaciones que salen bien y se pueden usar como casos combinados: sal + caída de la filtración (presión ↑↑: sensibilidad a la sal en la enfermedad renal), SIADH + restricción de agua, SIADH + sal, diabetes insípida sin agua (natremia ↑↑, creatinina ↑), edad + factores + sal (PAS ↑↑ con PAD normal).

## Recomendaciones

**1. Aplicar ya (pasan 158/158 juntos; Edu valida):**

| Relación | Antes | Después | Motivo |
| --- | --- | --- | --- |
| 47 · Tiroides → FC | 0,05 | 0,3 | Efecto cronotrópico directo: taquicardia en el hipertiroidismo, bradicardia en el hipotiroidismo |
| 7 · Sal → Osmolaridad, por debajo de 0 | — (0,8) | 0,3 | Con poca sal el riñón conserva Na; la osmolaridad apenas baja |
| 74 · Angiotensina II → TFG, por encima de 0 | 0,1 | 0,3 (0,1 por debajo) | La arteriola eferente sostiene la filtración en la estenosis; necesaria para la fase 4 |

Con los tres, las comprobaciones a menos de 0,02 de un umbral siguen siendo 13. Aparece una nueva justa: diuresis del caso 9 (+0,147).

**2. Corregir textos, sin tocar valores:** motivos de 14, 71 y 74; motivo de P4; explicación de la 75; motivo y nota del caso 4; notas de los casos 8 y 9.

**3. Recalibración (hito 3b), con estas restricciones fijadas antes de buscar pesos:**

- 40 con peso ≤ 0,3 por encima de 0, y 76 solo por debajo de 0.
- Nueva relación Volemia → Simpático (−), solo por debajo de 0; 71 por debajo de 0 a 0.
- 54 a 1,0.
- Ampliar la tabla para que la calibración no pueda esconder estos efectos: TFG en los casos 7, 8 y 9; FC en los casos 2, 9 y 11; un caso 13 (hipotiroidismo) y un caso 14 (dieta baja en sal).

**4. No hacer:** eliminar la 12 o la 31; volver a la asimetría de la 28.

Sobre el reparto de trabajo: la recalibración es de la sesión que tiene el calibrador (`scripts/calibrar.ts`), no de esta. Los textos del punto 2 son redacción docente y, según la pauta del proyecto, se revisan con Fable 5.2 en una sesión aparte.

## Fuentes

Verificadas en PubMed durante esta revisión (existencia y resumen):

- Carlström M, Wilcox CS, Arendshorst WJ. Renal autoregulation in health and disease. Physiol Rev 2015;95:405-511. https://doi.org/10.1152/physrev.00042.2012 — la TFG y el flujo renal se mantienen entre 80 y 180 mmHg.
- Klein I, Ojamaa K. Thyroid hormone and the cardiovascular system. N Engl J Med 2001;344:501-9. https://doi.org/10.1056/NEJM200102153440707 — sin resumen en PubMed: verificada la existencia, no el contenido.
- Graudal NA, Hubeck-Graudal T, Jurgens G. Effects of low sodium diet versus high sodium diet on blood pressure, renin, aldosterone, catecholamines, cholesterol, and triglyceride. Cochrane Database Syst Rev 2020;12:CD004022. https://doi.org/10.1002/14651858.CD004022.pub5 — al reducir el sodio suben la renina y la aldosterona; la PAS baja en torno a 1 mmHg en normotensos y 5–6 en hipertensos.
- Smith D, Moore K, Tormey W, Baylis PH, Thompson CJ. Downward resetting of the osmotic threshold for thirst in patients with SIADH. Am J Physiol Endocrinol Metab 2004;287:E1019-23. https://doi.org/10.1152/ajpendo.00033.2004 — los pacientes con SIADH siguen bebiendo cantidades normales.
- Ecelbarger CA et al. Role of renal aquaporins in escape from vasopressin-induced antidiuresis in rat. J Clin Invest 1997;99:1852-63. https://doi.org/10.1172/JCI119352 — el escape coincide con la caída de la acuaporina 2.
- Ribstein J, Du Cailar G, Fesler P, Mimran A. Relative glomerular hyperfiltration in primary aldosteronism. J Am Soc Nephrol 2005;16:1320-5. https://doi.org/10.1681/ASN.2004100878
- Fitzsimons JT. Angiotensin, thirst, and sodium appetite. Physiol Rev 1998;78:583-686. https://doi.org/10.1152/physrev.1998.78.3.583
- Arroyo JP, Ronzaud C, Lagnaz D, Staub O, Gamba G. Aldosterone paradox: differential regulation of ion transport in distal nephron. Physiology 2011;26:115-23. https://doi.org/10.1152/physiol.00049.2010
- Funder JW et al. The management of primary aldosteronism: an Endocrine Society clinical practice guideline. J Clin Endocrinol Metab 2016;101:1889-916. https://doi.org/10.1210/jc.2015-4061 — verificada la existencia; que la hipopotasemia aparezca solo en una minoría (hallazgo 15) lo cito de memoria, no está en el resumen.

De memoria, sin verificar: todo lo marcado **[M]** (riñón de Goldblatt, efecto de las catecolaminas y la angiotensina II sobre el flujo renal, equilibrio glomerulotubular, sensibilidad de los osmorreceptores, umbral de la sed, presión de pulso en la hipovolemia, hemodinámica del feocromocitoma, autorregulación de Guyton).
