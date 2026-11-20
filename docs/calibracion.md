# Calibración del modelo de hipertensión (hito 3a)

14 nov 2026 · motor programado y 12 casos como tests · propuestas y decisiones validadas por Edu el mismo día · recalibrado tras la revisión fisiológica (`docs/revision-fisiologica-3a.md`)

## Resumen

Con las intensidades del documento (`docs/modelo-v2.1.md`), el motor acertaba 100 de las 158 comprobaciones de la tabla de casos. **Solo con intensidades no se llegaba al 100 %:** había cuatro huecos de estructura y tres resultados de la tabla que se contradecían con otros. Tras la calibración y las decisiones de Edu: 158 de 158.

Después, la revisión fisiológica (Fable 5.2) encontró que la tabla escondía errores fuera de sus columnas: hiperfiltración en toda hipertensión, hipertiroidismo sin taquicardia, dieta baja en sal con volemia ↓↓ y deshidratación sin taquicardia. Se recalibró con esas restricciones fijadas y con la tabla ampliada (TFG, FC y dos casos nuevos): **180 de 180 correctas** tras la decisión 3 (renina del caso 8). Con las intensidades del documento, la tabla ampliada da 121 de 180.

Este documento recoge:

1. **Cambios de estructura (P1–P4)**, en `src/temas/hipertension/propuestas.ts`. Cambian el modelo, no solo los pesos. **Validados por Edu.**
2. **Ajustes de intensidad**, en `src/temas/hipertension/calibracion.ts`, con valor anterior, nuevo y motivo. Incluyen asimetrías nuevas (otro peso por debajo de 0), el mismo recurso que ya usan las relaciones 27 y 28.
3. **Cambios en la tabla de casos**: tres celdas que se contradecían con otras. **Decididos por Edu** según las recomendaciones de abajo.

`relaciones.ts` conserva las 73 relaciones del documento sin tocar. Las celdas que el modelo no puede cumplir sin una decisión de Edu quedan como `pendientes` (test omitido con su motivo): ahora no hay ninguna.

## Cómo calcula el motor

| Pieza | Implementación |
| --- | --- |
| Nodo `suma` | Valor = tanh(Σ entradas × intensidad); se relaja con amortiguación 0,3 hacia ese objetivo (con 0,5, las ganancias altas oscilaban) |
| `acumulador` (volemia) | Integra Σ entradas (sin tanh) con paso 0,02; limitado a ±1 |
| `derivado` (PAM) | ⅓ PAS + ⅔ PAD |
| `fija` (10) | Si la ADH autónoma ≠ 0, la ADH vale exactamente eso |
| `modula` (15) | Multiplica las relaciones 13 y 14 por (1 + acceso al agua) |
| Asimetría | `intensidadNegativa` cuando el origen está por debajo de 0 |
| Umbral | Con umbral u, la entrada es (origen − u) solo pasado el umbral |
| Minutos | Solo relaciones `minutos`; la volemia no tiene entradas activas y queda en 0 |
| Días | `minutos` + `dias`; la volemia se integra durante un horizonte fijo (1 unidad = 50 pasos): la retención está en marcha |
| Estado estable | Todas menos el barorreflejo (65); se itera hasta que nada cambia más de 1e-6 |

**Consecuencia importante del acumulador.** En estado estable, la volemia deja de cambiar solo cuando lo que entra iguala a lo que sale: **diuresis = ingesta**, y la ingesta la marca la sed (13), modulada por el acceso al agua. Es el principio del documento («en estado estable se orina lo que se ingiere»), pero tiene un efecto que la tabla no siempre respeta: la columna de diuresis en estado estable depende solo de la sed. De ahí salen la decisión 1 y varias asimetrías.

## Cambios de estructura (validados)

| Id | Cambio | Motivo |
| --- | --- | --- |
| P1 | Relaciones 25, 33, 38 y 41 (tumor, hiperaldosteronismo, estenosis, caída de filtración → su mecanismo): tiempo `estable` → `minutos` | La causa actúa desde que existe; la escala mide el tiempo desde que aparece. Con `estable`, en «días» esas causas no hacían nada y la tabla pide oliguria en días en los casos 5, 7 y 8 |
| P2 | Nueva 75: Volemia → Reabsorción de agua (−), solo por encima de 0, estado estable | Escape de la ADH (D1): con volumen alto mantenido, el colector pierde acuaporinas aunque la ADH siga alta. Sin ella, el SIADH no puede volver a volemia y presión «=» |
| P3 | Nueva 76: Volemia → Perfusión renal (+), días, **solo por debajo de 0** | Azotemia prerrenal. Sin ella, la creatinina no sube en la deshidratación (caso 11) ni en la diabetes insípida sin agua. Por encima de 0 no actúa (revisión fisiológica): sumaba a la hiperfiltración |
| P4 | Umbral de 0,2 en la relación 37 (actividad mineralocorticoide → potasio) | «Paradoja de la aldosterona»: la secreción de K depende de la aldosterona y del Na que llega al túbulo distal. Con aldosterona alta secundaria a volumen bajo llega poco Na y el K no cae. Sin umbral, el K ↓↓ del hiperaldosteronismo arrastra a ↓ el K de los casos 3, 9, 11 y 12 |
| P5 | Nueva 77: Volemia → Simpático (−), días, solo por debajo de −0,4 | Reflejo de volumen bajo (revisión fisiológica, hallazgo 4). Sin ella la deshidratación no daba taquicardia, porque el barorreflejo (65) no actúa en estado estable. Con umbral −0,4 y peso 0,3 (revisión P5/48, `docs/revision-p5-48.md`): solo actúa con déficits moderados o mayores; el umbral es un recurso del modelo |

## Ajustes de intensidad

64 ajustes en 57 relaciones (tras la revisión P5/48 cambian la 48 y la 77; el 19 nov 2026, con las fuentes propias, se añade la 4). «Peso» indica si el ajuste es el peso único, el de por encima de 0 o el de por debajo de 0 (asimetría). Los marcados «Fijado por la revisión fisiológica» no los ha movido el calibrador. La última columna la calcula `scripts/sin-ajuste.ts`: qué celdas de la tabla fallan si se quita solo ese ajuste («3 días diuresis» = caso 3, escala de días, diuresis); quitar un peso fijado o una asimetría también cuenta.

| # | Relación | Peso | Antes | Después | Motivo | Sin este ajuste falla |
| --- | --- | --- | --- | --- | --- | --- |
| 4 | Factores de riesgo vascular → Rigidez arterial (+) | única | 0,60 | 0,30 | Fuentes (19 nov 2026, validado por Edu): fuera de la edad y la presión, los factores de riesgo apenas se asocian a la rigidez aórtica, salvo la diabetes y de forma débil (Cecelja y Chowienczyk 2009, PMID 19884567). Ningún caso ni reto cambia de flecha | — |
| 7 | Ingesta de sal → Osmolaridad plasmática (+) | por encima de 0 | 0,60 | 0,80 | La sal tiene que subir la osmolaridad lo bastante para que la ADH y la sed retengan volumen; si no, la hipertensión por sal se queda corta | 3 días diuresis |
| 7 | Ingesta de sal → Osmolaridad plasmática (+) | por debajo de 0 | — | 0,30 | Revisión fisiológica: con poca sal el riñón conserva Na y la osmolaridad apenas baja. Sin esto, la dieta baja en sal daba volemia ↓↓, creatinina ↑ e hiponatremia | 14 volemia, 14 natremia |
| 8 | Osmolaridad plasmática → ADH (vasopresina) (+) | única | 1,00 | 3,00 | Los osmorreceptores responden a cambios de un 1–2 %: la ADH se mueve mucho mientras la natremia apenas cambia (casos 3, 8 y 10 con natremia «=») | 2 volemia, 3 natremia, 3 diuresis, 3 días diuresis, 6 natremia, 6 osmU, 8 natremia, 8 osmU, 10 rvp, 10 natremia, 14 renina, 14 aldo, 14 natremia |
| 9 | Osmolaridad plasmática → Sed (+) | única | 1,00 | 0,47 | El umbral osmótico de la sed es más alto que el de la ADH; con fuerte, la sed movía demasiado la volemia y la renina en los casos 3 y 4 | 2 renina, 2 aldo, 3 gc, 3 diuresis, 3 días diuresis, 4 renina, 4 aldo, 4 diuresis, 4 días volemia, 4 días diuresis, 10 aldo, 12 gc |
| 11 | ADH (vasopresina) → Reabsorción de agua (+) | única | 1,00 | 0,99 | Ajuste fino (prácticamente el valor del documento) | — (mejora márgenes) |
| 12 | ADH (vasopresina) → Resistencia vascular periférica (RVP) (+) | única | 0,30 | 0,07 | El efecto V1 solo pesa con niveles muy altos (lo dice el documento); con 0,3 el SIADH subía la RVP y la PAD | 3 días diuresis, 4 pad, 4 rvp, 4 días volemia, 11 rvp, 11 creatinina, 11 potasio, 12 gc, 12 creatinina, 12 diuresis |
| 13 | Sed → Volemia (+) | única | 0,60 | 1,37 | En estado estable diuresis = ingesta: la polidipsia de la diabetes insípida tiene que reponer mucha agua para que la diuresis sea ↑↑ | 4 pas, 4 pad, 4 volemia, 4 rvp, 10 aldo, 12 volemia, 12 rvp, 12 renina, 12 aldo, 12 creatinina, 12 diuresis |
| 14 | Sed → Osmolaridad plasmática (−) | por encima de 0 | 0,60 | 0,45 | El agua bebida diluye algo menos; ajuste fino de la diuresis del hipotiroidismo y la RVP de la diabetes insípida | 12 diuresis |
| 14 | Sed → Osmolaridad plasmática (−) | por debajo de 0 | — | 0,05 | Asimetría nueva: en el SIADH el umbral osmótico de la sed se reajusta a la baja, así que la hiponatremia no se corrige bebiendo menos. Sin ella el SIADH no llega a natremia ↓↓ | 4 pas, 4 pad, 4 rvp, 4 natremia, 10 aldo |
| 16 | Reabsorción de agua → Diuresis (−) | por encima de 0 | 1,00 | 0,89 | Junto con su asimetría: la antidiuresis máxima reduce la orina, pero no a cero (caso 4 en días ↓, no ↓↓) | 4 pas, 4 pad, 4 rvp, 4 días diuresis, 11 aldo |
| 16 | Reabsorción de agua → Diuresis (−) | por debajo de 0 | — | 1,37 | Asimetría nueva: sin ADH la orina puede multiplicarse por diez (diuresis acuosa); la antidiuresis solo la reduce a un tercio. Caso 12 con diuresis ↑↑ | 2 aldo, 10 aldo, 12 pas, 12 gc, 12 diuresis, 14 renina, 14 aldo |
| 17 | Reabsorción de agua → Osmolaridad plasmática (−) | única | 0,60 | 0,84 | El agua reabsorbida sin solutos tiene que diluir más: hiponatremia del SIADH | 2 volemia, 4 pas, 4 pad, 4 rvp, 4 natremia, 12 rvp, 12 diuresis, 14 natremia |
| 19 | Diuresis → Volemia (−) | única | 1,00 | 1,16 | Ajuste fino del balance de agua (casos 4 en días y 11) | 4 renina, 4 días volemia |
| 20 | Osmolaridad plasmática → Natremia (+) | única | 1,00 | 1,11 | La natremia sigue a la osmolaridad con algo más de ganancia: hiponatremia ↓↓ del SIADH | 4 natremia |
| 21 | Perfusión renal → Renina (−) | única | 1,00 | 0,37 | La presión llega ahora a la renina por la 39 (más fuerte); con las dos fuertes, la renina reaccionaba en exceso a cualquier cambio de presión | 5 creatinina, 6 gc, 6 aldo, 7 aldo, 8 rvp, 8 potasio, 9 rvp, 9 diuresis, 10 pad, 10 rvp, 10 aldo, 11 potasio, 12 rvp, 12 renina |
| 22 | Tasa de filtración glomerular (TFG) → Renina (−) | única | 0,60 | 0,30 | Mismo motivo que la 21: la mácula densa amplificaba los cambios secundarios de TFG (casos 5 y 6) | 5 creatinina, 6 pas, 6 pad, 6 rvp, 10 aldo, 11 potasio, 12 rvp |
| 23 | Actividad simpática → Renina (+) | única | 1,00 | 0,80 | Ajuste fino de la renina por el simpático (feocromocitoma: renina ↑ con volemia ↓) | 9 volemia |
| 24 | Hormonas tiroideas → Renina (+) | única | 0,30 | 0,20 | Más débil aún (D5): la subida de renina del hipertiroidismo es moderada y en buena parte indirecta | 2 pas |
| 25 | Tumor secretor de renina → Renina (+) | única | 1,00 | 1,50 | El tumor tiene que vencer el frenado por volumen y presión para dar renina y aldosterona ↑↑ (caso 7) | 7 pad, 7 aldo |
| 26 | Renina → Angiotensina II (+) | única | 1,00 | 0,66 | La cascada amplificaba demasiado los cambios secundarios de renina (casos 3, 5, 10 y 12) | 2 pas, 2 renina, 3 días diuresis, 4 renina, 5 creatinina, 7 natremia, 8 potasio, 9 volemia, 10 pad, 10 rvp, 10 aldo, 11 rvp, 11 creatinina, 11 potasio, 12 rvp, 12 potasio |
| 27 | Angiotensina II → Resistencia vascular periférica (RVP) (+) | por encima de 0 | 1,00 | 0,60 | La vasoconstricción por angiotensina II con mínimo de 0,6 (revisión fisiológica: no puede quedar débil). Con fuerte, la RVP de la deshidratación y la diabetes insípida se pasaban | 2 volemia, 11 rvp, 11 potasio, 12 rvp |
| 27 | Angiotensina II → Resistencia vascular periférica (RVP) (+) | por debajo de 0 | 0,30 | 0,80 | Deshace la asimetría de la v2, como en la 28: sin la hiperfiltración, la RVP del SIADH solo vuelve a «=» si la angiotensina baja resta | 3 días diuresis, 4 pad, 4 rvp |
| 28 | Angiotensina II → Aldosterona (+) | por encima de 0 | 1,00 | 1,50 | La aldosterona tiene que llegar a ↑↑ en el tumor de renina y en la deshidratación | 2 volemia, 2 aldo, 7 aldo, 7 potasio, 9 diuresis, 11 aldo, 14 aldo |
| 28 | Angiotensina II → Aldosterona (+) | por debajo de 0 | 0,60 | 2,00 | Deshace la asimetría de la v2 (revisión fisiológica: con renina suprimida la aldosterona baja de verdad). Sin hiperfiltración la renina baja menos, así que hace falta más ganancia para la aldosterona ↓ de los casos 3, 4 y 10 | 3 gc, 3 aldo, 4 pas, 4 pad, 4 rvp, 4 aldo, 4 días diuresis |
| 29 | Angiotensina II → Reabsorción tubular de Na (+) | única | 0,60 | 0,51 | Ajuste fino de la retención de Na por angiotensina (casos 3, 8, 10 y 12) | — (mejora márgenes) |
| 30 | Angiotensina II → ADH (vasopresina) (+) | única | 0,30 | 0,15 | La angiotensina activa poco la ADH; ajuste fino de la FC en la deshidratación | — (mejora márgenes) |
| 31 | Angiotensina II → Sed (+) | única | 0,30 | 0,15 | Con 0,3, la angiotensina alta mantenía la sed y la diuresis de estado estable dejaba de ser «=» (casos 8 y 9). Queda casi anulada | 4 renina, 9 diuresis |
| 32 | Angiotensina II → Actividad simpática (+) | única | 0,30 | 0,20 | Ajuste fino de la activación simpática por angiotensina (deshidratación y diabetes insípida) | 12 rvp |
| 33 | Hiperaldosteronismo primario → Aldosterona (+) | única | 1,00 | 2,50 | El adenoma tiene que vencer la renina baja y el potasio bajo, que frenan la aldosterona: aldosterona ↑↑ y K ↓↓ (caso 8) | 8 pad, 8 volemia, 8 rvp, 8 potasio, 8 días gc |
| 34 | Aldosterona → Actividad mineralocorticoide (+) | única | 1,00 | 0,80 | Ajuste fino: con fuerte, el K y la volemia se iban de rango con aldosterona alta secundaria (casos 9 y 12) | 3 días diuresis, 4 renina, 7 aldo, 11 aldo, 11 potasio, 12 diuresis |
| 35 | Regaliz (ácido glicirrícico) → Actividad mineralocorticoide (+) | única | 0,60 | 1,00 | El regaliz tiene que subir la presión con la renina y la aldosterona suprimidas (caso 10) | 10 pas, 10 pad, 10 volemia, 10 rvp, 10 días gc |
| 36 | Actividad mineralocorticoide → Reabsorción tubular de Na (+) | única | 1,00 | 0,75 | Ajuste fino de la retención de Na mineralocorticoide (casos 3, 4, 8, 9 y 10) | 3 días diuresis, 4 renina, 8 gc, 8 natremia, 8 potasio, 9 volemia, 10 aldo, 11 aldo, 12 diuresis |
| 37 | Actividad mineralocorticoide → Potasio plasmático (−) | única | 0,60 | 1,25 | Con el umbral de P4, por encima de 0,2 el efecto tiene que ser grande: K ↓↓ en el hiperaldosteronismo y ↓ en el tumor de renina | 7 potasio, 8 potasio |
| 39 | Presión arterial media (PAM) → Perfusión renal (+) | única | 0,30 | 1,50 | La presión aferente sigue a la arterial (revisión fisiológica: defendible); la autorregulación está en la 40, fijada en 0,3 por encima de 0. Es la vía por la que la renina baja con la presión | 3 gc, 4 pas, 4 pad, 4 rvp, 4 renina, 4 aldo, 5 pas, 5 pad, 5 rvp, 6 pas, 8 gc, 9 volemia, 10 gc, 10 renina |
| 40 | Perfusión renal → Tasa de filtración glomerular (TFG) (+) | por encima de 0 | 1,00 | 0,30 | Fijado por la revisión fisiológica (hallazgo 1): autorregulación renal. La TFG apenas sube con la presión alta; sin esto, la hipertensión producía hiperfiltración | 7 tfg, 9 tfg, 9 diuresis, 10 pad, 10 rvp, 10 aldo |
| 40 | Perfusión renal → Tasa de filtración glomerular (TFG) (+) | por debajo de 0 | — | 1,50 | Fijado por la revisión fisiológica (hallazgo 1): la autorregulación falla con la presión baja y la TFG cae (estenosis, deshidratación) | 5 volemia, 5 gc, 5 creatinina, 11 aldo, 11 creatinina, 11 potasio, 12 volemia, 12 rvp, 12 sin acceso al agua creatinina |
| 41 | Caída de la filtración renal → Tasa de filtración glomerular (TFG) (−) | única | 1,00 | 2,00 | La caída de la filtración tiene que vencer la compensación (angiotensina, presión) para dar creatinina ↑↑ (caso 6) | 6 volemia, 6 gc, 6 aldo, 6 creatinina |
| 42 | Tasa de filtración glomerular (TFG) → Diuresis (+) | única | 0,60 | 0,30 | Equilibrio glomerulotubular: el túbulo reabsorbe en proporción a lo filtrado, así que la diuresis depende de la reabsorción más que de la TFG. En estado estable la marca el balance de agua | 4 renina, 5 creatinina, 6 aldo, 6 natremia, 6 osmU, 9 diuresis, 11 aldo, 11 creatinina, 12 diuresis |
| 43 | Reabsorción tubular de Na → Diuresis (−) | única | 0,60 | 0,96 | El agua sigue al Na: sin hiperfiltración, la natriuresis por presión (70) llega a la diuresis por aquí | 2 volemia, 3 gc, 4 pas, 4 pad, 4 rvp, 4 días diuresis, 8 días gc, 10 volemia, 10 rvp, 10 días gc, 12 volemia, 12 rvp, 12 renina |
| 44 | Reabsorción tubular de Na → Osmolaridad plasmática (+) | única | 0,30 | 0,10 | Casi anulada: el Na retenido arrastra agua y la natremia apenas cambia (lo que dice la propia relación) | 2 aldo, 4 renina, 10 aldo, 12 natremia |
| 47 | Hormonas tiroideas → Frecuencia cardíaca (+) | única | 1,00 | 0,30 | Fijado por la revisión fisiológica (hallazgo 2): efecto cronotrópico directo. Con 0,3 da taquicardia (y bradicardia en el hipotiroidismo) sin pasar por el simpático (D5) | 2 pas, 2 volemia, 2 renina, 2 aldo, 2 días diuresis |
| 48 | Hormonas tiroideas → Contractilidad (+) | única | 1,00 | 0,30 | Efecto inotrópico directo, con el mismo peso que el cronotrópico (47). Con 0,3 la contractilidad sale ↑ sin llevar la PAS del hipertiroidismo a ↑↑ (revisión P5/48) | 2 pas, 2 volemia, 2 días diuresis |
| 49 | Hormonas tiroideas → Resistencia vascular periférica (RVP) (−) | única | 1,00 | 0,98 | La vasodilatación tiroidea tiene que bajar la PAD aunque el gasto suba (caso 2) | — (mejora márgenes) |
| 50 | Hormonas tiroideas → Actividad simpática (+) | única | 0,30 | 0,05 | Casi anulada (D5): el hipertiroidismo aumenta la sensibilidad adrenérgica, no la actividad simpática | 2 pas, 2 pad, 2 volemia |
| 51 | Actividad simpática → Frecuencia cardíaca (+) | única | 1,00 | 1,25 | Con el simpático poco activado en la deshidratación, la FC tiene que responder más para dar taquicardia (caso 11) | — (mejora márgenes) |
| 52 | Actividad simpática → Contractilidad (+) | única | 1,00 | 0,60 | Ajuste fino del efecto inotrópico simpático | — (mejora márgenes) |
| 53 | Actividad simpática → Resistencia vascular periférica (RVP) (+) | única | 1,00 | 0,56 | Ajuste fino de la vasoconstricción simpática (casos 9, 10 y 12) | 9 diuresis, 11 rvp, 12 rvp |
| 55 | Contractilidad → Gasto cardíaco (GC) (+) | única | 0,60 | 0,45 | Ajuste fino del volumen sistólico | 2 pas, 2 volemia |
| 56 | Volemia → Gasto cardíaco (GC) (+) | única | 1,00 | 0,87 | Con fuerte, la volemia retenida subía el gasto en casos donde debe volver a «=» (casos 3 y 8) | 3 gc, 8 gc, 12 diuresis |
| 57 | Gasto cardíaco (GC) → Presión sistólica (PAS) (+) | única | 1,00 | 1,31 | El gasto pesa algo más en la sistólica; ajuste fino de la PAS en la deshidratación y la diabetes insípida sin agua | 4 pad, 4 rvp, 13 diuresis |
| 58 | Gasto cardíaco (GC) → Presión diastólica (PAD) (+) | única | 0,30 | 0,40 | El gasto pesa algo más en la diastólica: PAD «=» en la deshidratación con RVP ↑ y GC ↓ | — (mejora márgenes) |
| 59 | Resistencia vascular periférica (RVP) → Presión diastólica (PAD) (+) | única | 1,00 | 0,86 | Ajuste fino de la PAD por la RVP (casos 4 y 11) | 4 pad, 13 diuresis |
| 60 | Resistencia vascular periférica (RVP) → Presión sistólica (PAS) (+) | única | 0,60 | 0,45 | Ajuste fino de la poscarga en la sistólica | 4 pas |
| 64 | Volemia → Sed (−) | única | 0,60 | 0,53 | Ajuste fino de la sed por volumen (hipotiroidismo sin poliuria) | — (mejora márgenes) |
| 67 | Acceso al agua → Volemia (+) | única | 1,00 | 0,98 | Ajuste fino de la pérdida de volumen sin agua (caso 11) | — (mejora márgenes) |
| 68 | Acceso al agua → Osmolaridad plasmática (−) | única | 0,60 | 0,80 | Sin agua el medio interno se concentra más: natremia ↑ en la deshidratación | 11 natremia |
| 69 | Volemia → Renina (−) | única | 0,60 | 0,45 | Ajuste fino del frenado de la renina por volumen (casos 10 y 12) | 2 aldo, 10 aldo |
| 70 | Presión arterial media (PAM) → Reabsorción tubular de Na (−) | única | 0,60 | 0,49 | Natriuresis por presión algo más débil; ahora es la única vía de la presión a la diuresis (O2) | 4 renina, 9 diuresis |
| 71 | Volemia → Resistencia vascular periférica (RVP) (+) | por encima de 0 | 0,60 | 1,75 | Autorregulación de todo el organismo (modelo explicativo de Guyton): lleva la hipertensión de volumen a la RVP con gasto «=» (casos 3, 8 y 10). Es la relación con más ganancia del modelo | 3 pad, 3 rvp, 3 gc, 4 renina, 7 rvp, 8 pad, 8 rvp, 8 gc, 8 natremia, 10 pad, 10 rvp, 10 gc |
| 71 | Volemia → Resistencia vascular periférica (RVP) (+) | por debajo de 0 | — | 0,00 | Fijado por la revisión fisiológica (hallazgo 4): con volumen bajo no actúa la autorregulación; la vasoconstricción refleja va por el simpático (77), la angiotensina II y la ADH | 9 volemia, 9 rvp, 11 fc, 11 simpatico, 11 pad, 11 volemia, 11 rvp, 11 aldo, 12 pad, 12 rvp, 12 gc, 12 creatinina, 12 diuresis |
| 74 | Angiotensina II → Tasa de filtración glomerular (TFG) (+) | por debajo de 0 | — | 0,10 | Por encima de 0 se mantiene el 0,3 del documento: la arteriola eferente sostiene la filtración en la estenosis (necesario para enseñar el IECA en la fase 4). Por debajo de 0, débil: con renina suprimida la TFG apenas baja | 4 pad, 4 rvp |
| 75 | Volemia → Reabsorción de agua (−) | única | 0,60 | 1,25 | El escape tiene que ser más fuerte para que el SIADH vuelva a presión y RVP «=» | 4 pad, 4 rvp, 10 aldo |
| 77 | Volemia → Actividad simpática (−) | por debajo de 0 | 0,60 | 0,30 | Con el umbral de −0,4 (revisión P5/48), la deshidratación da simpático y FC ↑ claros sin que la volemia llegue al tope; con más peso la presión defendida sostiene la TFG y se pierde la creatinina ↑ | 11 pas, 11 rvp, 11 creatinina, 11 potasio, 12 sin acceso al agua pas, 12 sin acceso al agua creatinina |

### Ajustes que conviene revisar

| Relación | Por qué revisarla |
| --- | --- |
| 77 · Volemia → Simpático: umbral −0,4 y 0,3 | Resuelto en la revisión P5/48: simpático +0,25 y FC +0,31 en la deshidratación. Queda un bucle sin resolver (el reflejo sube la presión, el riñón conserva menos y la volemia cae a −0,96) y la rueda de acceso al agua responde de forma brusca entre −0,9 y −1 (anterior a este cambio; revisar antes de construir esa rueda)
| 71 · Volemia → RVP: 0,6 → 1,75 | La relación con más ganancia del modelo. Es la autorregulación de todo el organismo de Guyton: un modelo explicativo, no un hecho medido con esa fuerza |
| 39 · PAM → Perfusión renal: 0,3 → 1,5 | Defendible según la revisión (es la presión aferente), y ya no produce hiperfiltración porque la 40 está limitada. Pero en la caída de la filtración la perfusión renal sale ↑↑ (+0,51) |
| 28 y 27 por debajo de 0: 2,0 y 0,8 | Deshacen las asimetrías de la v2. La revisión lo da por bueno para la 28 |
| 8 y 33: 3,0 y 2,5 | Por encima de «fuerte»; motivos correctos según la revisión. Saturan las ruedas pronto |

### Fragilidad

12 de 181 comprobaciones quedan a menos de 0,02 de un umbral (entre ellas la PAS del hipertiroidismo, +0,48, y su volemia, renina y aldosterona, cerca de 0,15). Los tests son deterministas y pasan siempre, pero un cambio pequeño en cualquier relación puede mover una flecha.

## Decisiones tomadas (14 nov 2026)

| Celda | Antes | Ahora | Motivo |
| --- | --- | --- | --- |
| Caso 4 (SIADH), diuresis en estado estable | = | ↓ | En estado estable diuresis = ingesta, y la ingesta la marca la sed. Con hiponatremia ↓↓ la sed baja y se bebe menos |
| Caso 6 (caída de la filtración), diuresis en estado estable | ↓ | = (↓ en días) | Mismo principio que D3: la oliguria es la fase de días; en estado estable se orina lo que se bebe. Se añade la comprobación de días |
| Caso 11 (deshidratación), PAD | ↓ | = | En la hipovolemia compensada la vasoconstricción mantiene la diastólica (se estrecha la presión de pulso). Con PAD ↓ chocaba con el caso 2 |
| Caso 3 (sal), natremia | = (↑ leve) | = o ↑ leve | Lectura del paréntesis sin condición; el test acepta las dos |

Descartada la alternativa de añadir una ingesta basal de agua independiente de la sed.

### Tras la revisión fisiológica

**Tabla ampliada.** Para que la calibración no pueda esconder los errores que encontró la revisión:

| Dónde | Comprobación nueva |
| --- | --- |
| Casos 7, 8 y 9 | TFG «= o ↑» (nunca ↑↑: autorregulación) |
| Casos 2, 9 y 11 | FC «↑ o ↑↑» (taquicardia del hipertiroidismo, del feocromocitoma y de la hipovolemia) |
| Caso 13 · Hipotiroidismo (tiroides −1) | PAD y RVP ↑ o ↑↑, GC y FC ↓ o ↓↓; volemia, diuresis y natremia «= o ↓» (sin poliuria) |
| Caso 14 · Dieta baja en sal (sal −1) | Renina y aldosterona ↑ o ↑↑; PAS, PAD, volemia y GC «= o ↓»; creatinina, natremia y potasio «=» |

Las celdas de los casos 13 y 14 son fisiología de manual (los del 14 apoyados en Graudal 2020, citado en la revisión). **Validadas por Edu el 14 nov 2026.**

**Decisión 3 (tomada: «↓ o ↓↓») · Renina del hiperaldosteronismo (caso 8).** La tabla pide ↓↓. Antes se conseguía por la hiperfiltración, que la revisión eliminó. Ahora la renina solo baja por la volemia (69) y la presión renal (21), y llega a ↓ (−0,27) pero no a ↓↓ sin romper otros casos. Decisión de Edu: aceptar «↓ o ↓↓». El contraste docente se mantiene: renina baja con aldosterona ↑↑ (hiperaldosteronismo) frente a las dos bajas (regaliz).

### Aplicación de la revisión fisiológica

| Hallazgo | Estado |
| --- | --- |
| 1 · Hiperfiltración | Aplicado: 40 limitada a 0,3 por encima de 0 y 76 solo por debajo de 0. TFG: tumor +0,35, feocromocitoma +0,27, hiperaldosteronismo +0,09 (antes +0,77, +0,65 y +0,53). Consecuencia: decisión 3 |
| 2 · Taquicardia del hipertiroidismo | Aplicado: 47 fijada en 0,3. FC +0,37 (+0,28 con la rueda a tres cuartos) |
| 3 · Dieta baja en sal | Aplicado: 7 por debajo de 0 en 0,3. Volemia −0,19, creatinina 0, natremia −0,13, renina +0,21 |
| 4 · Deshidratación sin taquicardia | Aplicado en dos pasos: nueva relación 77 y 71 por debajo de 0 a 0; después, umbral −0,4 y peso 0,3 en la 77 (revisión P5/48). Simpático +0,25 ↑, FC +0,31 ↑ |
| 5 · 74 | Aplicado: 0,3 por encima de 0 y 0,1 por debajo |
| 6 · Caso 4, motivo | Aplicado: motivo de la 14 y nota del caso. La celda (diuresis ↓) se mantiene como límite del modelo |
| 7 · Hipotiroidismo | Aplicado: caso 13. Ya no da poliuria (diuresis «=», volemia ↓ leve) |
| 8 · Motivo de P4 | Aplicado |
| 9 · No eliminar 12 y 31 | Aplicado: quedan en 0,07 y 0,15 |
| 10 · 28 por debajo de 0 | Se mantiene sin asimetría (2,0) |
| 11 · Ganancias 8, 33, 41 | 33 baja a 2,5 y 41 a 2,0; la 8 sigue en 3 |
| 12 · Motivo de 71 por debajo de 0 | Aplicado; el valor pasa a 0 (hallazgo 4) |
| 13 · 54 | Aplicado: vuelve a 1,0 |
| 14 · Explicación de la 75 | Aplicado |
| 15 y 16 · Notas de los casos 8 y 9 | Aplicado |
| 17 · Sal +1 en minutos | Sin tocar: la escala de minutos no tiene tabla |

### Revisión de P5 y la 48 (`docs/revision-p5-48.md`)

Fable 5.2 diagnosticó por qué el modelo no admitía valores fisiológicos y propuso seis cambios, aplicados sin recalibrar (181 de 181):

| # | Cambio | Motivo |
| --- | --- | --- |
| 1 | Caso 2: RVP «↓» → «↓ o ↓↓» | Con GC ↑↑ y PAM «=» la resistencia cae mucho; era la celda que bloqueaba la 48 |
| 2 | 48 = 0,3 | Inotropismo directo, a la par de la 47. Contractilidad +0,33 ↑ en el hipertiroidismo |
| 3 | Caso 11: PAD «=» → «= o ↑», con nota | En la hipovolemia central la diastólica no baja y puede subir; se estrecha la presión de pulso (Convertino 2006) |
| 4 | Caso 11: celda nueva, simpático «↑ o ↑↑» | Impide que una calibración futura vuelva a anular el reflejo |
| 5 | Caso 12 sin agua: PAS «↓↓» → «↓ o ↓↓» | La fila enseña la creatinina ↑ (D4); el desplome de la sistólica es la fase descompensada |
| 6 | 77 con umbral −0,4 y peso 0,3 | El reflejo no se nota hasta un déficit moderado; sin umbral se encendía con hipovolemias leves |

## Herramientas

- `npx tsx scripts/informe.ts`: lista los resultados que no coinciden (y los pendientes, si los hay).
- `npx tsx scripts/informe.ts --documento` (o `--sin-calibrar`): lo mismo con las intensidades del documento, sin o con las propuestas.
- `npx tsx scripts/sin-ajuste.ts`: recalcula la columna «sin este ajuste falla» de `calibracion.ts`.
- `npm run calibrar -- --metodo es --negativas 9,13,14,16,71 --desde pesos.json --salida pesos.json`: búsqueda evolutiva (1+1) en escala logarítmica, con penalización por alejarse del documento.
- `npx tsx scripts/podar.ts pesos.json`: redondea a múltiplos de 0,05, revierte los ajustes innecesarios y calcula qué falla sin cada ajuste.
- `npx tsx scripts/tabla-ajustes.ts`: imprime la tabla de ajustes de este documento.
