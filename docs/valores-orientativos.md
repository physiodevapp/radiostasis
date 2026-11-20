# Valores orientativos de analítica y presión

Punto 5 de la fase 6 (propuesta de Edu del 14 nov 2026, `docs/plan.md`, «Fuera de la v1», punto 4). Documento de fuentes y propuesta. **No cambia el modelo ni el código.** Las anclas las valida Edu y los rótulos se revisan con Fable 5.2 en una sesión aparte.

Fecha: 17 nov 2026.

**Lo que se aplicó (17 nov 2026).** Las anclas en uso están en `src/temas/hipertension/valores.ts`, no en esta tabla. Diferencias: natremia +0,5 en 146 mmol/L y osmolaridad plasmática +0,5 en 297 (en lugar de 150 y 305; la «Comprobación caso a caso» da 148 y 149 con las anclas de aquí, y con las aplicadas salen ≈ 145 y ≈ 146); bandas con intervalo fijo y «≈» en diuresis, renina y aldosterona, y solo banda en la osmolaridad urinaria; normal de la presión «< 130/85» y de la aldosterona «5–20»; presión en +0,5 a 160/100 y potasio en −0,5 a 3,0 mmol/L. Revisión de Fable 5.2 en `docs/revision-valores-fable.md`; anclas validadas por Edu el 17 nov 2026.

## Resumen

- Se propone una tabla de traducción, como datos, de la escala del modelo (−1 a 1 respecto a lo normal) a valores clínicos de 10 magnitudes. Hay cinco anclas por magnitud (v = −1, −0,5, 0, +0,5, +1) y se interpola en línea recta entre ellas.
- Las anclas se colocan así:
  - El 0 es el centro del rango normal.
  - ±0,5 cae donde empiezan ↑↑/↓↓ y corresponde a un valor claramente anormal.
  - ±1 es un valor muy alterado pero frecuente en la clínica.
  - Las anclas no tienen por qué ser simétricas: el potasio, la creatinina, la diuresis, la renina y la aldosterona no lo son.
- Se ejecutaron los 33 casos de `src/temas/hipertension/casos.ts` y cinco variantes (días, diabetes insípida sin agua). En la mayoría el valor traducido cae en un sitio razonable.
- Siete cuadros quedan lejos de los valores publicados. No es un defecto de las anclas, sino algo que el modelo hace en flechas y que la traducción a números deja a la vista:
  - natremia con dieta alta en sal;
  - natremia en la diabetes insípida con acceso al agua;
  - osmolaridad urinaria en el SIADH;
  - presión en el hiperaldosteronismo primario y en el tumor de renina;
  - potasio en el regaliz y en el tumor de renina.

  Se detallan en «Comprobación caso a caso». **No se ha tocado el modelo:** si Edu quiere corregir algo, es una decisión aparte.
- Recomendación: mostrar número solo en presión, natremia, potasio, creatinina y osmolaridad plasmática. En diuresis, osmolaridad urinaria, renina y aldosterona, mostrar una banda o una categoría («suprimida», «normal», «alta», «muy alta») con un intervalo aproximado. En estas cuatro el rango normal depende del laboratorio, la postura, la sal de la dieta o la ingesta de agua, y un número exacto engaña.
- Varias cifras de referencia (los intervalos de creatinina, sodio y potasio, la renina y la aldosterona normales) **no se pudieron comprobar en PubMed**: las guías que las dan no tienen el texto libre y su resumen no trae los números. Están marcadas como «no comprobado en PubMed» y conviene contrastarlas con el laboratorio de referencia de Edu o con el texto completo de la guía.

## Cómo se ha trabajado

1. Se leyeron la escala y los umbrales en `docs/modelo-v2.1.md` y `src/motor/motor.ts`:
   - «=» por debajo de 0,15;
   - «↑/↓» hasta 0,5;
   - «↑↑/↓↓» desde 0,5;
   - tope de escala en ±0,95.
2. Se ejecutó `simular()` sobre `hipertension.casos` (estado estable; los casos 25–33 con su momento de ejercicio) con un script tsx fuera del repositorio. Valores de cada nodo: «Comprobación caso a caso».
3. Las referencias se buscaron y comprobaron en PubMed con el conector:
   - Solo se cita lo que figura en el **resumen** de PubMed. Ninguna de las guías principales tiene texto libre en PMC.
   - Cuando un dato no se pudo comprobar se dice expresamente.
   - Algunos rangos de laboratorio proceden de casos clínicos que los citan, una fuente más débil. Se indica en cada caso.

## Tabla principal

Interpolación lineal entre anclas. Fuera de [−1, 1] no se extrapola: el motor ya limita a ±1 y por encima de ±0,95 salta el chip «tope de escala».

| Magnitud | Unidad | Rango normal (adulto) | −1 | −0,5 | 0 | +0,5 | +1 | Fuentes del rango y de las anclas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Presión sistólica | mmHg | < 120 óptima; 120–129 normal (ESH 2023) | 80 | 100 | 120 | 150 | 180 | [1] [2] [3] |
| Presión diastólica | mmHg | < 80 óptima; 80–84 normal (ESH 2023) | 50 | 65 | 80 | 95 | 110 | [1] [2] [3] |
| Creatinina plasmática | mg/dL | ≈ 0,6–1,2 (depende del sexo, la masa muscular y el método; **no comprobado en PubMed**) | 0,4 | 0,6 | 0,9 | 1,5 | 3,0 | [4] [5] [6] [7] |
| Natremia | mmol/L | 135–145 | 120 | 130 | 140 | 150 | 160 | [8] [9] [10] |
| Osmolaridad urinaria | mOsm/kg | 50–1200 (muy dependiente del agua bebida); habitual ≈ 400–900 | 100 | 250 | 600 | 800 | 1000 | [11] [12] [13] |
| Potasio plasmático | mmol/L | 3,5–5,0 (**no comprobado en PubMed**; habitual en laboratorios españoles) | 2,5 | 3,3 | 4,2 | 5,5 | 6,5 | [5] [14] [15] |
| Osmolaridad plasmática | mOsm/kg | 275–295 | 245 | 265 | 285 | 305 | 325 | [11] [16] |
| Diuresis | mL/día | ≈ 800–2000 (= lo que se bebe); poliuria > 50 mL/kg/día (≈ 3,5 L en 70 kg) | 400 | 800 | 1500 | 3000 | 6000 | [12] [13] |
| Renina (actividad de renina plasmática, ARP) | ng/mL/h | ≈ 0,5–3 sentado con sal normal (depende del laboratorio, la postura y la sal; **no comprobado en PubMed**) | 0,1 | 0,3 | 1,5 | 5 | 15 | [17] [18] [19] |
| Aldosterona plasmática | ng/dL | ≈ 3–25 sentado con sal normal (depende del laboratorio; **no comprobado en PubMed**). 1 ng/dL ≈ 27,7 pmol/L (factor de conversión estándar, no comprobado en PubMed) | 2 | 4 | 10 | 20 | 40 | [17] [20] [21] [22] |

### Notas por magnitud (unidad, anclas y límites)

**Presión arterial (PAS/PAD).**
- La persona sana del simulador está en 120/80, el límite superior de la presión óptima de la ESH 2023 [2].
- +0,5 = 150/95, la mitad del grado 1 (140–159/90–99) [1].
- +1 = 180/110, el umbral del grado 3 (≥ 180/≥ 110) [1]. Es frecuente en consulta y en urgencias, y no es un récord.
- La propuesta del plan (120/80 → 165/100 para «↑↑») queda entre +0,5 y +1 (v ≈ 0,75): es compatible con estas anclas.
- Abajo: −0,5 = 100/65 (hipotensión leve, ortostatismo, deshidratación) y −1 = 80/50 (hipotensión marcada, frecuente en urgencias). No se baja más porque el modelo no simula el shock.
- **El ejercicio de fuerza se sale de la escala.** En levantamientos máximos hay picos intraarteriales de 320/250 mmHg [23] y de 270/183 mmHg [24]. El caso 27 da +0,87/+0,75, que se traduce en 172/102, muy por debajo. En las sesiones de ejercicio conviene no mostrar número, o mostrar «muy alta durante el esfuerzo (picos de más de 250 mmHg)».

**Creatinina.**
- Unidad mg/dL, la habitual en los informes de España (también se da en µmol/L: 1 mg/dL = 88,4 µmol/L).
- El centro es 0,9 mg/dL.
- **Las anclas son asimétricas**, porque la creatinina sube de forma hiperbólica cuando cae la filtración:
  - +0,5 = 1,5 mg/dL: una subida de ≥ 0,3 mg/dL o de 1,5 veces la basal es estadio 1 de lesión renal aguda en KDIGO [6].
  - +1 = 3,0 mg/dL: algo más de tres veces la basal (KDIGO estadios 2–3: «2 a 3 veces la basal o ≥ 4,0 mg/dL») [6].
- **El lado bajo tiene poco sentido clínico.** Una creatinina baja indica poca masa muscular (persona mayor, desnutrición, embarazo), no un riñón «mejor». El modelo nunca la baja de forma apreciable: el menor valor en los 33 casos es 0,00. Propuesta: no mostrar valores por debajo de 0,6 y rotular «normal» todo v < 0,15.

**Natremia.**
- Rango 135–145, centro 140.
- −0,5 = 130, límite entre hiponatremia leve (130–134) y moderada (125–129).
- −1 = 120, hiponatremia profunda (< 125) [9].
- +0,5 = 150, el valor al que se lleva el sodio en la prueba de suero salino hipertónico para la diabetes insípida [12].
- +1 = 160, hipernatremia grave, frecuente en personas mayores sin acceso al agua.
- El rango 135–145 aparece en [9]. La definición de hiponatremia (< 135) está en el resumen de la guía europea [8].

**Osmolaridad urinaria.**
- Es la magnitud con el «normal» más ancho: va de 50 a 1200 mOsm/kg según el agua que se beba [11].
- En adultos sanos que beben poco la mediana es 879 mOsm/kg; al añadir 1,5 L de agua al día baja a 384 [13]. El centro se pone en 600, entre ambos.
- −0,5 = 250 y −1 = 100: la orina hipotónica de la diabetes insípida está por debajo de 800 mOsm/kg en la definición y suele estar muy por debajo [12].
- +0,5 = 800 y +1 = 1000: la deshidratación lleva la orina hacia el máximo de concentración (≈ 1200).
- **Limitación importante:** en el SIADH la orina no está «muy concentrada» en términos absolutos, sino «inadecuadamente» concentrada para un plasma diluido. El criterio diagnóstico es solo > 100 mOsm/kg [10]. Ver la comprobación del caso 4.

**Potasio.**
- Centro 4,2.
- Lado bajo: −0,5 = 3,3 (hipopotasemia leve-moderada) y −1 = 2,5 (hipopotasemia grave).
  - En el hiperaldosteronismo primario, la proporción de pacientes con hipopotasemia es del 56 % en el registro alemán [15] y de solo el 9–37 % en las series con cribado [14].
  - Por debajo de 2,5 mmol/L, el 88,5 % de los hipertensos con hipopotasemia espontánea tienen hiperaldosteronismo primario [5].
- Lado alto: +0,5 = 5,5 (hiperpotasemia leve-moderada) y +1 = 6,5 (hiperpotasemia grave, frecuente en la enfermedad renal con IECA o espironolactona).

**Osmolaridad plasmática.**
- Rango de laboratorio 275–295 mOsm/kg [11] [16], centro 285.
- **Las anclas se han elegido coherentes con la natremia** (≈ 2 × Na + 5):
  - ±0,5 = 265/305 (Na 130/150);
  - ±1 = 245/325 (Na 120/160).
- Así, si el modelo da la misma v a la natremia y a la osmolaridad, los dos números cuadran.

**Diuresis.**
- Centro 1500 mL/día. En sanos que beben poco la diuresis es ≈ 1,06 L/día y sube a 2,27 L/día al añadir 1,5 L de agua [13].
- Lado alto:
  - +0,5 = 3000 mL/día (umbral habitual de poliuria; la definición por peso es > 50 mL/kg/día [12]);
  - +1 = 6000 mL/día (diabetes insípida completa, frecuente; **cifra típica no comprobada en PubMed**).
- **El lado bajo no puede bajar de la oliguria:**
  - −0,5 = 800 mL/día;
  - −1 = 400 mL/día, la oliguria (< 400–500 mL/día). Definición de manual; KDIGO usa < 0,5 mL/kg/h, **no comprobado en PubMed**.
  - La anuria (< 100 mL/día) queda fuera de la escala, igual que el modelo no simula el fracaso renal establecido.

**Renina.**
- En España se piden las dos determinaciones: actividad de renina plasmática (ARP, ng/mL/h) y concentración directa de renina (µUI/mL o mUI/L). Se propone **ARP**, porque es la que se usa en el cociente aldosterona/renina de casi toda la bibliografía sobre hiperaldosteronismo [14] [15] [18].
- El factor de conversión entre ARP y concentración depende del método, así que no se propone ninguno.
- **La renina varía en escala logarítmica** (de 0,1 a 30 ng/mL/h). Por eso las anclas son geométricas (0,1 · 0,3 · 1,5 · 5 · 15) y la interpolación lineal entre ellas es una aproximación tosca.
- En el tumor de renina, la mediana de ARP es 7,9 veces el límite superior normal (rango intercuartílico 3,6–14,4) [19]. Con un límite superior de ≈ 2–3 ng/mL/h serían ≈ 15–25 ng/mL/h: +1 = 15 está en la parte baja de ese rango.

**Aldosterona.**
- Unidad ng/dL, la más usada en los informes de España. Algunos laboratorios dan pmol/L (× 27,7).
- Centro 10 ng/dL.
- Lado bajo:
  - −0,5 = 4 ng/dL: suprimida. Tras la sobrecarga salina, la aldosterona baja de 5 ng/dL en sanos e hipertensos esenciales [20].
  - −1 = 2 ng/dL: muy suprimida, como en el regaliz [21] [22].
- Lado alto:
  - +0,5 = 20 ng/dL;
  - +1 = 40 ng/dL. En el hiperaldosteronismo primario la aldosterona supera los 10 ng/dL tras la sobrecarga salina [20], y en el adenoma es frecuente por encima de 30–40 ng/dL (**cifra típica no comprobada en PubMed**).

## Comprobación caso a caso

Valores del modelo en estado estable (los casos 25–33 en su momento de ejercicio) y traducción con las anclas de arriba. «v» es el valor del nodo; la flecha es la que muestra el simulador. El juicio compara la traducción con los valores publicados.

### Casos que mueven la presión

| Caso | PAS (v → mmHg) | PAD (v → mmHg) | Valor publicado | Juicio |
| --- | --- | --- | --- | --- |
| 1 · Edad avanzada con factores | +0,77 → 166 | −0,32 → 70 | Hipertensión sistólica aislada del mayor (presión diferencial ancha) [25] | Razonable |
| 2 · Hipertiroidismo | +0,48 → 149 | −0,22 → 73 | Sube la sistólica (baja la RVP, sube la FC y el gasto) sin cambio significativo de la diastólica [26] [27] | Razonable; cifras exactas no comprobadas |
| 7 · Tumor de renina | +0,62 → 157 | +0,60 → 98 | Hipertensión en el 97 % [19]; suele ser grave (cifra no comprobada) | Algo bajo |
| 8 · Hiperaldosteronismo primario | +0,26 → 136 | +0,23 → 87 | Registro alemán: 164/96 (con hipopotasemia) y 155/93 (sin ella) [15] | **Bajo**: el modelo da una hipertensión de grado 1 o menos |
| 9 · Feocromocitoma | +0,80 → 168 | +0,61 → 98 | Hipertensión mantenida en el 47 % y crisis paroxísticas en el 72 % [28] | Razonable para la hipertensión mantenida; las crisis superan 180/110 |
| 10 · Regaliz | +0,22 → 133 | +0,19 → 86 | Hipertensión de nueva aparición [21]; cifras no comprobadas | Plausible para un consumo moderado |
| 11 · Deshidratación | −0,35 → 106 | +0,21 → 86 | — | La PAD alta con PAS baja es lo que da el modelo (ver `docs/modelo-v2.1.md`) |
| 27 · Sesión de fuerza intensa | +0,87 → 172 | +0,75 → 102 | Picos de 320/250 [23] y de 270/183 [24] | **Fuera de escala**: no mostrar número |

### Casos que mueven la analítica

| Caso | Magnitud | v → valor | Valor publicado | Juicio |
| --- | --- | --- | --- | --- |
| 3 · Dieta alta en sal | Natremia | +0,38 → 148 mmol/L | Cambiar la sal de 10 a 350 mmol/día mueve el sodio plasmático unos 3 mmol/L; con cambios moderados, 0,4 mmol/L [29] | **Demasiado alto**: en la clínica sería 141–143 |
| 3 · Dieta alta en sal | Renina / aldosterona | −0,29 → 0,8 ng/mL/h · −0,36 → 6 ng/dL | La sal suprime el eje (la sobrecarga salina baja la aldosterona por debajo de 5 en sanos [20]) | Razonable |
| 4 · SIADH | Natremia | −0,53 → 129 mmol/L | Mediana basal 127 (rango intercuartílico 126–129) en un ensayo [30] | **Bien** |
| 4 · SIADH | Osmolaridad urinaria | +0,61 → 844 mOsm/kg | Criterio > 100 [10]; un caso publicado con 482 [16] | **Alta**: el SIADH típico ronda 300–600. Ver riesgos |
| 4 · SIADH | Osmolaridad plasmática | −0,54 → 263 mOsm/kg | Coherente con un Na de 127–129 | Bien |
| 5 · Estenosis bilateral | Creatinina | +0,17 → 1,10 mg/dL (en días: +0,40 → 1,38) | — | Plausible |
| 15 · Estenosis bilateral con IECA | Creatinina | +0,43 → 1,42 mg/dL (+58 % sobre 0,9; +29 % sobre el caso 5) | Captopril en la hipertensión renovascular: de 117 a 162 µmol/L (1,32 → 1,83 mg/dL, +38 %), mucho más en la bilateral [31]; fracaso renal agudo en 3 de 13 bilaterales [32] | Razonable como orden de magnitud. Puede quedarse corta en la bilateral grave |
| 6 · Caída de la filtración | Creatinina / potasio | +0,57 → 1,71 mg/dL · +0,37 → 5,2 mmol/L | — | Plausible (estadio 1–2 de KDIGO, potasio alto-normal) |
| 8 · Hiperaldosteronismo primario | Potasio | −0,50 → 3,3 mmol/L | Hipopotasemia en el 9–37 % [14] o en el 56 % [15] | Razonable para la forma clásica |
| 8 · Hiperaldosteronismo primario | Aldosterona / renina | +0,95 → 38 ng/dL (tope de escala) · −0,27 → 0,9 ng/mL/h | Aldosterona > 10 tras la sobrecarga salina [20]; renina suprimida | Aldosterona bien. **Renina poco suprimida**: en la clínica suele ser < 0,5 ng/mL/h (cifra no comprobada en PubMed) |
| 18 · Hiperaldosteronismo con espironolactona | Aldosterona | +0,99 → 40 ng/dL | La espironolactona no baja la aldosterona (bloquea el receptor) | Bien |
| 7 · Tumor de renina | Renina / aldosterona / potasio | +0,80 → 11 ng/mL/h · +0,52 → 21 ng/dL · −0,24 → 3,8 mmol/L | ARP con mediana de 7,9 veces el límite superior normal; hipopotasemia en el 79 % [19] | Renina razonable. **Potasio poco bajo** |
| 16–17 · Tumor de renina con IECA o ARA-II | Renina | +0,87 → 12 · +0,91 → 13 ng/mL/h | Los IECA y ARA-II suben la renina | Bien |
| 10 · Regaliz | Potasio / renina / aldosterona | −0,40 → 3,5 mmol/L · −0,23 → 0,9 ng/mL/h · −0,50 → 4 ng/dL | Casos publicados: K 2,1 [21] y 2,4 [22] mmol/L, con renina y aldosterona por debajo del límite de detección [21] [22] | Aldosterona bien. **Potasio y renina poco alterados**; los casos publicados son la parte grave del espectro (sesgo de publicación) |
| 11 · Deshidratación | Natremia / osmolaridad urinaria / diuresis | +0,27 → 145 · +0,61 → 844 · −0,85 → 520 mL/día | — | Razonable (orina concentrada y escasa, Na alto-normal) |
| 12 · Diabetes insípida central (con agua) | Diuresis / osmolaridad urinaria | +0,52 → 3100 mL/día · −0,64 → 210 mOsm/kg | Poliuria > 50 mL/kg/día con orina < 800 [12] | Razonable; la diuresis puede quedar corta en la forma completa |
| 12 · Diabetes insípida central (con agua) | Natremia | +0,46 → 149 mmol/L | Con acceso al agua, el sodio suele quedar normal o alto-normal (fisiología; **cifra no comprobada en PubMed**) | **Demasiado alto** |
| 12 · Diabetes insípida sin agua (variante) | Natremia / osmolaridad plasmática | +0,76 → 155 · +0,90 → 321 | Hipernatremia franca | Razonable |
| 21 · Sal con tiazida | Potasio | −0,38 → 3,5 mmol/L | Hipopotasemia leve por tiazidas (cifra no comprobada en PubMed) | Plausible |

Los demás casos (13, 14, 19, 20, 22–26 y 28–33) dejan la analítica en «=» o cerca, y la traducción queda dentro del rango normal. El 29 se traduce en un Na de 148 por el mismo efecto de la sal del caso 3.

### Qué deja a la vista la traducción (para Edu, sin tocar el modelo)

1. **La sal mueve demasiado la natremia** (casos 3, 21, 24, 28–30). En flechas «= o ↑ leve» se aceptó el 14 nov. En números, 148 mmol/L no es realista: la sal cambia el sodio plasmático en 0,4–3 mmol/L [29].
2. **La diabetes insípida con agua da una natremia de 149.** En la clínica, el paciente que bebe mantiene el sodio casi normal.
3. **Osmolaridad urinaria del SIADH (844).** El nodo representa «orina concentrada respecto a lo esperable», pero el número parece absoluto.
4. **Hiperaldosteronismo y tumor de renina dan menos presión e hipopotasemia que las series** [15] [19]. El regaliz también se queda corto en hipopotasemia, aunque su comparación se apoya solo en casos publicados [21] [22], la parte grave del espectro.

Opciones para estos puntos, a decidir por Edu:

- **(a)** No mostrar el número en esas magnitudes cuando el cuadro está activo, solo la banda.
- **(b)** Anclas por caso. No se recomienda: rompe la idea de una traducción única.
- **(c)** Revisar las intensidades del modelo en una sesión aparte.

Las anclas no pueden arreglar los puntos 1 y 2 sin estropear el SIADH y la deshidratación, que salen bien.

## Riesgos de falsa precisión y propuesta de rótulos

### Riesgos por magnitud

| Magnitud | Riesgo | Cómo mostrarla |
| --- | --- | --- |
| PAS / PAD | Riesgo bajo: es la más intuitiva. El modelo da presión en reposo; en las sesiones de ejercicio, sobre todo de fuerza, la real es mucho mayor | Número redondeado a 5 mmHg («≈ 165/100»). En sesión de fuerza, sin número |
| Creatinina | La relación con la filtración no es lineal y depende de la masa muscular; el lado bajo no significa nada | Número con un decimal; por debajo de v = 0,15, «normal» |
| Natremia | Es la que más invita a leer decimales; además, la sal la exagera (ver arriba) | Número entero |
| Potasio | Riesgo moderado | Número con un decimal |
| Osmolaridad plasmática | Si se muestra a la vez que la natremia, dos números deben cuadrar | Redondeo a 5; se mueve en paralelo a la natremia |
| Osmolaridad urinaria | El «normal» va de 50 a 1200 y depende del agua bebida; en el SIADH el número absoluto engaña | **Banda**: «diluida (< 300)», «intermedia», «concentrada (> 600)», con el número aproximado entre paréntesis |
| Diuresis | Depende de lo que se bebe; el modelo no simula la anuria | Redondeo a 100 mL; por debajo de 500, «oliguria»; por encima de 3000, «poliuria» |
| Renina | Escala logarítmica, dos determinaciones (ARP y concentración), rangos de laboratorio distintos, efecto de la postura, la sal y los fármacos | **Categoría**: «suprimida», «normal», «alta», «muy alta», con un intervalo aproximado en ARP |
| Aldosterona | Depende de la postura, la sal y el laboratorio; ng/dL frente a pmol/L | Categoría como la renina, o número redondeado a 5 ng/dL con su equivalencia en pmol/L |

### Rótulos (borrador para Fable 5.2)

- **Interruptor:** «Mostrar valores orientativos» (desactivado por defecto).
- **Cada valor:**
  - con número: «≈ 148 mmol/L · orientativo», con el rango normal al lado en gris: «normal 135–145»;
  - con categoría: «Renina: suprimida (≈ < 0,5 ng/mL/h) · orientativo · normal ≈ 0,5–3».
- **Tope de escala** (|v| ≥ 0,95): mostrar «≥ 40 ng/dL» o «≤ 2,5 mmol/L» en vez de un número cerrado, junto al chip que ya existe.
- **Nota fija al activar el interruptor:** «El simulador solo calcula hacia dónde y cuánto se mueve cada valor (las flechas). Estos números traducen esas flechas a cifras típicas para hacerse una idea; no son un cálculo del valor real ni sirven para interpretar una analítica. Los rangos normales cambian según el laboratorio.»
- **Ficha de la magnitud** (opcional): una línea con la fuente del rango normal y, si aplica, «Valor de laboratorio: depende del método, la postura y la sal de la dieta».

### Sugerencia para los datos (sin código)

Una entrada por magnitud con estos campos:

- `id` del nodo;
- unidad;
- rango normal (texto y límites);
- las cinco anclas;
- decimales o paso de redondeo;
- modo (`numero` o `banda`), con los cortes de banda;
- fuentes.

La interpolación va en el motor o en la vista, separada de los datos, como pide el plan.

## Fuentes

Todas se comprobaron en PubMed con el conector el 17 nov 2026. Las cifras citadas figuran en el resumen. Cuando no ha sido así, se dice.

1. Angeli F, et al. Eur J Intern Med. 2024. Clasificación de la ESH 2023 en el resumen: grado 1 140–159 y/o 90–99, grado 2 160–179 y/o 100–109, grado 3 ≥ 180 y/o ≥ 110 mmHg. PMID 38616483 · DOI [10.1016/j.ejim.2024.04.008](https://doi.org/10.1016/j.ejim.2024.04.008)
2. Tocci G, et al. J Hypertens. 2025. Categorías de la ESH 2023 (óptima < 120/< 80; normal 120–129/80–84; normal-alta 130–139/85–89) y de la ESC 2024 (no elevada < 120/< 70; elevada 120–139/70–89) en el resumen. PMID 41039765 · DOI [10.1097/HJH.0000000000004140](https://doi.org/10.1097/HJH.0000000000004140)
3. Mancia G, et al. 2023 ESH Guidelines for the management of arterial hypertension. J Hypertens. 2023. Guía original. Su resumen no trae las cifras, que se comprobaron en [1] y [2]. PMID 37345492 · DOI [10.1097/HJH.0000000000003480](https://doi.org/10.1097/HJH.0000000000003480). Ver también McEvoy JW, et al. 2024 ESC Guidelines. Eur Heart J. 2024. PMID 39210715 · DOI [10.1093/eurheartj/ehae178](https://doi.org/10.1093/eurheartj/ehae178)
4. Ceriotti F, et al. Reference intervals for serum creatinine concentrations. Clin Chem. 2008. Revisión sistemática de intervalos de referencia. **Las cifras no están en el resumen: no comprobado en PubMed.** PMID 18202155 · DOI [10.1373/clinchem.2007.099648](https://doi.org/10.1373/clinchem.2007.099648)
5. Burrello J, et al. Prevalence of hypokalemia and primary aldosteronism in 5100 patients. Hypertension. 2020. Hipopotasemia en el 15,8 % de los hipertensos; el hiperaldosteronismo primario llega al 88,5 % con hipopotasemia espontánea y K < 2,5 mmol/L. PMID 32114853 · DOI [10.1161/HYPERTENSIONAHA.119.14063](https://doi.org/10.1161/HYPERTENSIONAHA.119.14063). Para los intervalos de sodio, potasio y creatinina se consultó también Rustad P, et al. The Nordic Reference Interval Project 2000. Scand J Clin Lab Invest. 2004. **Las cifras no están en el resumen: no comprobado en PubMed.** PMID 15223694 · DOI [10.1080/00365510410006324](https://doi.org/10.1080/00365510410006324)
6. Joosten A, et al. BMC Anesthesiol. 2021. Criterios KDIGO en el resumen: estadio 1, subida de creatinina ≥ 0,3 mg/dL en 48 h o de 1,5–1,9 veces la basal; estadios 2–3, de 2 a 3 veces la basal o ≥ 4,0 mg/dL. PMID 33931017 · DOI [10.1186/s12871-021-01353-2](https://doi.org/10.1186/s12871-021-01353-2). El resumen de KDIGO (Khwaja A. Nephron Clin Pract. 2012) no tiene resumen en PubMed. PMID 22890468 · DOI [10.1159/000339789](https://doi.org/10.1159/000339789)
7. Hricik DE, et al. Captopril-induced functional renal insufficiency in patients with bilateral renal-artery stenoses or renal-artery stenosis in a solitary kidney. N Engl J Med. 1983. Sin resumen en PubMed; citado como referencia clásica. PMID 6337327 · DOI [10.1056/NEJM198302173080706](https://doi.org/10.1056/NEJM198302173080706)
8. Spasovski G, et al. Clinical practice guideline on diagnosis and treatment of hyponatraemia. Eur J Endocrinol. 2014. El resumen define la hiponatremia como < 135 mmol/L. Las clases de gravedad no están en el resumen. PMID 24569125 · DOI [10.1530/EJE-13-1020](https://doi.org/10.1530/EJE-13-1020)
9. Al Alawi AM, et al. Endocrine. 2026. Clases en el resumen: normal 135–145, leve 130–134, moderada 125–129 y profunda < 125 mmol/L. PMID 41493707 · DOI [10.1007/s12020-025-04515-1](https://doi.org/10.1007/s12020-025-04515-1)
10. Reddy P, et al. Int J Clin Pract. 2009. SIADH: hiponatremia euvolémica con osmolaridad urinaria > 100 mOsm/kg y sodio urinario > 40 mEq/L (resumen). PMID 19769706 · DOI [10.1111/j.1742-1241.2009.02103.x](https://doi.org/10.1111/j.1742-1241.2009.02103.x)
11. Li et al. Am J Case Rep. 2023. Caso clínico que cita los rangos de laboratorio «osmolaridad sérica 275–295» y «osmolaridad urinaria 50–1200». Fuente débil (rango de un laboratorio). PMID 36683312 · DOI [10.12659/AJCR.939034](https://doi.org/10.12659/AJCR.939034)
12. Atila C, et al. Lancet Diabetes Endocrinol. 2025. Poliuria hipotónica: > 50 mL/kg en 24 h con osmolaridad urinaria < 800 mOsm/kg; polidipsia > 3 L/día (resumen). PMID 40294614 · DOI [10.1016/S2213-8587(25)00053-1](https://doi.org/10.1016/S2213-8587(25)00053-1). Prueba de suero salino hipertónico hasta Na ≥ 150 mmol/L: Fenske W, et al. N Engl J Med. 2018. PMID 30067922 · DOI [10.1056/NEJMoa1803760](https://doi.org/10.1056/NEJMoa1803760). Revisión general: Christ-Crain M, et al. Nat Rev Dis Primers. 2019. PMID 31395885 · DOI [10.1038/s41572-019-0103-2](https://doi.org/10.1038/s41572-019-0103-2)
13. Enhörning S, et al. J Clin Endocrinol Metab. 2019. Adultos sanos que beben poco: osmolaridad urinaria 879 (705–996) mOsm/kg y diuresis 1,06 (0,90–1,20) L/día. Con 1,5 L/día más de agua, 384 mOsm/kg y 2,27 L/día (resumen). PMID 30566641 · DOI [10.1210/jc.2018-02195](https://doi.org/10.1210/jc.2018-02195)
14. Mulatero P, et al. J Clin Endocrinol Metab. 2004. En las series con cribado, «solo una pequeña proporción (entre el 9 y el 37 %) tenía hipopotasemia» (resumen). PMID 15001583 · DOI [10.1210/jc.2003-031337](https://doi.org/10.1210/jc.2003-031337)
15. Born-Frontsberg E, et al. J Clin Endocrinol Metab. 2009. Registro alemán de Conn (n = 553): el 56,1 % con hipopotasemia; PAS 164 ± 29 frente a 155 ± 27 y PAD 96 ± 18 frente a 93 ± 15 mmHg (con y sin hipopotasemia) (resumen). PMID 19190103 · DOI [10.1210/jc.2008-2116](https://doi.org/10.1210/jc.2008-2116)
16. Rhyu J, et al. 2020. Caso de SIADH: Na mínimo 124 mmol/L, osmolaridad urinaria 482 mOsm/kg; cita el rango sérico 275–295 mOsm/kg. Fuente débil (un caso). PMID 34095469 · DOI [10.1016/j.aace.2020.11.026](https://doi.org/10.1016/j.aace.2020.11.026)
17. Funder JW, et al. The management of primary aldosteronism. Endocrine Society clinical practice guideline. J Clin Endocrinol Metab. 2016. Guía de referencia del cociente aldosterona/renina. **Las cifras (corte de la sobrecarga salina, conversiones) no están en el resumen: no comprobado en PubMed.** PMID 26934393 · DOI [10.1210/jc.2015-4061](https://doi.org/10.1210/jc.2015-4061)
18. Vaidya A, et al. The expanding spectrum of primary aldosteronism. Endocr Rev. 2018. Secreción de aldosterona independiente de la renina y la angiotensina II (resumen). PMID 30124805 · DOI [10.1210/er.2018-00139](https://doi.org/10.1210/er.2018-00139)
19. Dong H, et al. Clinical features, laboratory findings and treatment of juxtaglomerular cell tumors: a systemic review. Hypertens Res. 2024. 261 pacientes: hipertensión en el 97,2 %, hipopotasemia en el 78,7 %, mediana de ARP 7,89 veces el límite superior normal (rango intercuartílico 3,58–14,41) (resumen). PMID 38438720 · DOI [10.1038/s41440-024-01606-w](https://doi.org/10.1038/s41440-024-01606-w)
20. Li Y, et al. J Clin Endocrinol Metab. 2016;101:89-95. El criterio habitual (guía de la Endocrine Society [17]) es que, tras la sobrecarga salina, la aldosterona baja de 5 ng/dL en sanos y en la hipertensión esencial. En este estudio, en población china, quedó por encima de 5 ng/dL en casi todos ellos y por encima de 10 ng/dL en la mayoría de los pacientes con hiperaldosteronismo primario; el mejor corte fue 11,45 ng/dL (resumen). (Corregido según la revisión de Fable 5.2: antes se le atribuía lo contrario.) PMID 26565948 · DOI [10.1210/jc.2015-2840](https://doi.org/10.1210/jc.2015-2840)
21. Sturluson et al. Laeknabladid. 2024. Caso de regaliz: K 2,1 mmol/L, hipertensión de nueva aparición, aldosterona y renina por debajo del límite de detección (resumen). PMID 39331666 · DOI [10.17992/lbl.2024.09.809](https://doi.org/10.17992/lbl.2024.09.809)
22. Arai et al. Cureus. 2023. Regaliz en fórmulas Kampo: K 2,4 mmol/L, renina y aldosterona bajas (resumen). PMID 37261160 · DOI [10.7759/cureus.38267](https://doi.org/10.7759/cureus.38267). Revisión de 104 casos (sin cifras en el resumen): Ceccuzzi G, et al. Nutrients. 2023. PMID 37764649 · DOI [10.3390/nu15183866](https://doi.org/10.3390/nu15183866)
23. MacDougall JD, et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol. 1985. Prensa de piernas: media de picos 320/250 mmHg (resumen). PMID 3980383 · DOI [10.1152/jappl.1985.58.3.785](https://doi.org/10.1152/jappl.1985.58.3.785)
24. Lentini AC, et al. J Appl Physiol. 1993. Prensa de piernas al 95 %: PAS de 160 a 270 y PAD de 91 a 183 mmHg (resumen). PMID 8125893 · DOI [10.1152/jappl.1993.75.6.2703](https://doi.org/10.1152/jappl.1993.75.6.2703)
25. Tang KS, et al. Wide pulse pressure: a clinical review. J Clin Hypertens. 2020. La presión diferencial aumenta con la edad por la rigidez arterial; el hipertiroidismo es una causa de presión diferencial ancha (resumen). PMID 32986936 · DOI [10.1111/jch.14051](https://doi.org/10.1111/jch.14051)
26. Prisant LM, et al. Hyperthyroidism: a secondary cause of isolated systolic hypertension. J Clin Hypertens. 2006. Sube la sistólica al bajar la RVP y subir la FC y el gasto (resumen, sin cifras). PMID 16896276 · DOI [10.1111/j.1524-6175.2006.05180.x](https://doi.org/10.1111/j.1524-6175.2006.05180.x)
27. Iglesias P, et al. Clin Endocrinol. 2005. PAS de 24 h mayor en el hipertiroidismo que en controles, sin diferencias significativas en la PAD (resumen, sin cifras en mmHg). PMID 15963064 · DOI [10.1111/j.1365-2265.2005.02301.x](https://doi.org/10.1111/j.1365-2265.2005.02301.x)
28. Orchard T, et al. Surgery. 1993. Feocromocitoma (110 pacientes): hipertensión mantenida en el 47 % y crisis paroxísticas en el 72 % (resumen). PMID 8256222 · DOI no disponible en PubMed. Guía de referencia (sin cifras en el resumen): Lenders JWM, et al. J Clin Endocrinol Metab. 2014. PMID 24893135 · DOI [10.1210/jc.2014-1498](https://doi.org/10.1210/jc.2014-1498)
29. He FJ, et al. Plasma sodium: ignored and underestimated. Hypertension. 2005. Bajar la sal de 350 a 10–20 mmol/día baja el sodio plasmático ≈ 3 mmol/L; un mes con ≈ 170 frente a ≈ 100 mmol/día lo cambia 0,4 ± 0,2 mmol/L (resumen). PMID 15557392 · DOI [10.1161/01.HYP.0000149431.79450.a2](https://doi.org/10.1161/01.HYP.0000149431.79450.a2)
30. Garrahy A, et al. J Clin Endocrinol Metab. 2020. SIADH (n = 46): mediana del Na basal 127 mmol/L (rango intercuartílico 126–129) (resumen). PMID 32879954 · DOI [10.1210/clinem/dgaa619](https://doi.org/10.1210/clinem/dgaa619)
31. Greminger P, et al. Nephron. 1986. Hipertensión renovascular con captopril: creatinina de 117 a 162 µmol/L, con una subida mucho mayor en la estenosis bilateral (resumen). PMID 3528886 · DOI [10.1159/000184055](https://doi.org/10.1159/000184055)
32. Jackson B, et al. Hypertension. 1986. Fracaso renal agudo con IECA en 3 de 8 pacientes con riñón único y en 3 de 13 con estenosis bilateral; ninguno con estenosis unilateral (resumen). PMID 3015794 · DOI [10.1161/01.hyp.8.8.650](https://doi.org/10.1161/01.hyp.8.8.650)

### Datos de manual o de laboratorio sin comprobar en PubMed

Conviene que Edu los contraste con su laboratorio o con el texto completo de las guías:

- Intervalos de creatinina (≈ 0,6–1,2 mg/dL) y potasio (3,5–5,0 mmol/L) [4] [5].
- Rangos normales de ARP y aldosterona, y conversión de aldosterona a pmol/L (× 27,7) [17].
- Oliguria < 400–500 mL/día o < 0,5 mL/kg/h (KDIGO).
- Diuresis típica de la diabetes insípida completa.
- Natremia en la diabetes insípida con acceso al agua.
- Hipopotasemia por tiazidas.
- Aldosterona típica del adenoma.

## Siguientes pasos

1. Edu valida o corrige las anclas y decide qué hacer con los puntos 1–4 de «Qué deja a la vista la traducción» (banda en vez de número, o revisión del modelo en otra sesión).
2. La redacción de los rótulos y de la nota fija se revisa con **Fable 5.2 en una sesión aparte**.
3. La implementación (tabla en datos y vista con el interruptor) puede ir con Opus 5.5 o Sonnet 5.5 en otra sesión, una vez cerradas las anclas.
