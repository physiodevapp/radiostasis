# Revisión de Fable 5.2: textos y fuentes propias (19 nov 2026)

Revisión de los textos reescritos al dejar el tema con fuentes propias: avisos de las fichas, notas de los casos 1 a 5 y 12 («La fisiología»), pie de la página y de la ficha de estudio, notas de las animaciones, sección «Errores frecuentes y matices (D1–D6)» de `docs/modelo-v2.1.md` y encaje de cada fuente con su relación (`docs/fuentes.md`). Fable 5.2 juzgó los capítulos de Guyton y Hall de memoria y comprobó en PubMed los artículos que cita abajo.

**Resultado:** sin errores fisiológicos graves; ningún texto contradice signos ni resultados de los casos. Las cifras del regaliz son correctas (comprobadas en PubMed). Aplicadas todas las correcciones de texto y los cambios de fuentes que no tocan el modelo.

## Correcciones de texto (aplicadas)

| # | Dónde | Cambio | Motivo | Gravedad |
| --- | --- | --- | --- | --- |
| 1 | Ficha del regaliz · aviso | «Unos 50 gramos de dulce de regaliz al día durante dos semanas ya suben algo la presión…» | El estudio de los 50 g usó golosina; «algo» evita sugerir un efecto grande | mejora |
| 2 | Ficha de la ADH autónoma · aviso | «si la persona puede beber lo que necesita» en lugar de «con agua libre» | «Agua libre» es un término renal con otro significado | error |
| 3 | Ficha de las hormonas tiroideas · aviso | «Un error frecuente es pensar que…» | Sonaba a réplica de algo no dicho | mejora |
| 4 | Caso 2 · nota | Añade «y por eso el cuadro parece simpático» | Explica por qué existe el error | mejora |
| 5 | Ficha de la sal · aviso | «Con mucha sal se orina menos solo los primeros días» | «La oliguria» aparecía sin presentar | mejora |
| 6 | Caso 3 · nota | Igual que la 5; «gasto cardíaco» en lugar de «gasto» | Jerga | mejora |
| 7 | Ficha de la caída de la filtración · aviso | Frases más cortas; las proteínas «retienen agua en el capilar» | «Según la ecuación de filtración» no explicaba nada | mejora |
| 8 | Ficha de los factores de riesgo · aviso | Añade el daño del endotelio de las arteriolas | Coherencia con la relación 72 | mejora |
| 9 | Ficha de la placa · aviso | «Si sube la presión, es porque la pared se vuelve más rígida» | «No por el diámetro» era ambiguo | mejora |
| 10 | Ficha de la rigidez · aviso | Dos frases, sin tono de réplica | Estilo | estilo |
| 11 | Ficha del feocromocitoma · aviso | Dice que el simulador muestra una hipertensión mantenida y añade dolor de cabeza, sudoración y palpitaciones | Qué simplifica el modelo y la tríada clásica | mejora |
| 12 | Ficha del hiperaldosteronismo · aviso | «En el simulador el potasio baja, pero en la práctica…» | Sin la aclaración contradecía la analítica | mejora |
| 13 | Ficha del IECA · aviso | «es poco eficaz» en lugar de «apenas funciona» | Coloquial | estilo |
| 14 | Caso 1 · nota | «no porque su pared estreche el paso de la sangre» | El engrosamiento sí contribuye a la rigidez (relación 5) | mejora |
| 15 | Caso 4 · nota | «pierde sodio y deja de responder del todo a la ADH»; la diuresis depende de lo que se bebe | «Natriuresis» sin explicar; en el SIADH la diuresis sigue a la ingesta | mejora |
| 16 | Caso 5 · nota | «sube de forma clara solo si…» | «Solo» era tajante | estilo |
| 17 | Pie (`fuentes` en `vista.ts`) | «Basado en el manual de fisiología de Guyton y Hall y en artículos científicos indexados en PubMed.» | Boron y Boulpaep no se cita en ninguna relación; PubMed es un índice | error |
| 18 | `docs/modelo-v2.1.md` · D1, D2 y D4 | «Fisiología estándar» en lugar de «Corregir» | «Corregir» solo se entendía frente a la fuente retirada | mejora |
| 19 | `docs/modelo-v2.1.md` · introducción de D1–D6 | Redacción más neutra; «matizó D6» | Estilo | estilo |
| 20 | `docs/modelo-v2.1.md` · D1, D5 y D6 | Enlaces web sustituidos por PMID ya comprobados (17507705, 16896276, 11172181) | Fuentes citables | mejora |
| 21 | `docs/modelo-v2.1.md` · límites y fuentes | Fuera la nota de fuentes «sin verificar» | Contradecía `docs/fuentes.md` | error |
| 22 | Animación «placa» · nota | «en la realidad la placa tarda años en formarse» | Opcional | estilo |

## Fuentes (aplicado)

| Relación | Cambio | Motivo |
| --- | --- | --- |
| 4 · Factores de riesgo → Rigidez | Cecelja y Chowienczyk 2009 (PMID 19884567) sustituido por Stehouwer et al. 2008 (PMID 18239908) | La revisión de Cecelja va en contra de la relación: fuera de la edad y la presión, los factores de riesgo apenas se asocian a la rigidez aórtica (la diabetes, en el 52 % de los estudios y con fuerza baja). **Validado por Edu (19 nov 2026):** intensidad de 0,6 a 0,3 (`calibracion.ts`); ningún caso ni reto cambia de flecha |
| 35 · Regaliz → Actividad mineralocorticoide | Añadidos Sigurjónsdóttir et al. 2001 (PMID 11494093) y af Geijerstam et al. 2024 (PMID 38246526) | Respaldan las cifras del aviso: 50 g/día de regaliz (75 mg de ácido glicirretínico) durante 2 semanas suben la sistólica 3,1 mmHg; 100 mg/día de ácido glicirrícico, también 3,1 mmHg, con renina y aldosterona frenadas |
| 41 · Caída de la filtración → TFG | Fuera Ku et al. 2019 (PMID 30898362); queda Guyton y Hall, cap. 27 | Trata de la hipertensión en la enfermedad renal crónica, no de por qué cae la filtración |
| 20 · Osmolaridad → Natremia | Fuera Bourque 2008; queda Guyton y Hall, cap. 25 | Trata de cómo se detecta la osmolaridad, no de que el sodio sea el soluto principal |
| 14 · Sed → Osmolaridad | Fuera Bourque 2008; queda McKinley y Johnson 2004 | Encaje débil |
| 53 · Simpático → RVP | Guyton y Hall, cap. 17 → cap. 18 | La vasoconstricción simpática está en el capítulo de regulación nerviosa (de memoria) |

## Seguimiento (19 nov 2026, después de la revisión)

- **Capítulos por su título.** Las fuentes consultadas numeran distinto la 14.ª ed. de Guyton y Hall (el capítulo del riñón y la presión a largo plazo sale como 19 o como 20), así que todas las relaciones citan el capítulo por su título, que vale en cualquier edición.
- **Relación 24:** cita el capítulo del riñón y la presión a largo plazo (sistema renina-angiotensina) en lugar del de las hormonas tiroideas.
- **Relaciones «Fisiología»:** las 21 del modelo v2.1 citan ya un capítulo; nueve llevan además PMID (la 72, Schiffrin 2004, PMID 15607629, y Bonetti et al. 2003, PMID 12588755, nuevos y comprobados en PubMed). Una segunda revisión de Fable 5.2 corrigió 11 textos y movió la 56 al capítulo del gasto cardíaco y la 60 al de la visión general de la circulación; la 31 se queda solo con McKinley y Johnson 2004.
- **Explicaciones de las relaciones 2, 49 y 50** completadas como proponía la búsqueda de fuentes; la ficha de las hormonas tiroideas dice ahora que relajan el músculo de las arteriolas.

## Pendiente de cotejar con el libro (no aplicado)

- **Capítulos de las relaciones 24, 30 y 32** (cap. 77, 29 y 18): según Fable, de memoria, no tratan esa relación concreta (renina en el hipertiroidismo, angiotensina II y ADH, angiotensina II y simpático). El artículo de cada una sí encaja.
- **Capítulo de la aterosclerosis** (relaciones 2 y 3): de memoria, el cap. 69 de la 14.ª ed.
- **Relaciones 57, 67 y 68**: sus artículos encajan de forma indirecta (revisiones del hipertiroidismo; un estudio en ratas sobre la vasopresina que recoge el efecto de la restricción de agua). Se mantienen.
- **Relaciones marcadas «Fisiología»** que podrían citar un capítulo (de memoria): 9 y 31 (cap. 29; la 31 también McKinley y Johnson 2004), 21, 69, 70 y 71 (cap. 19), 23 (caps. 18–19), 65 (cap. 18), 37, 66 y 73 (cap. 30), 39 y 74 (cap. 27), 54 y 56 (caps. 9 y 20), 60 y 62 (cap. 15), 82–85 (cap. 32).

## Lo que está bien

Fisiología del SIADH y su escape, creatinina normal en la diabetes insípida con acceso al agua, hipopotasemia minoritaria en el hiperaldosteronismo, glomerulonefritis inmunitaria, obstrucción bilateral o de riñón único y reparto rigidez (presión de pulso) frente a arteriolas (RVP). Las notas de los casos 5 y 12, el aviso del IECA, la nota general de las animaciones y la columna «Planteamiento simplificado» de D1–D6. Español de España, sin anglicismos; las cifras nuevas son correctas.
