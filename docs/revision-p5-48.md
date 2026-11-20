# Revisión de los dos puntos a medias: P5 (relación 77) y relación 48

14 nov 2026 · continuación de `docs/revision-fisiologica-3a.md` · no se ha tocado `src/` ni ningún otro documento. Todo lo que aparece como «medido» se ha ejecutado con el motor (`simular`) sobre una copia local del modelo calibrado actual.

**Nota sobre los recuentos.** El trabajo se hizo con la renina del caso 8 todavía pendiente (179 + 1). Mientras tanto, otra sesión cerró esa decisión («↓ o ↓↓») sin tocar ningún peso. Repetido sobre la rama actualizada: punto de partida 180/180 y propuesta completa **181/181, ya sin pendientes**. Donde el texto dice «la pendiente», léase como una celda correcta más.

## Resumen

| Punto | Diagnóstico | Propuesta recomendada | Resultado medido |
| --- | --- | --- | --- |
| **48** · Tiroides → Contractilidad (0,05) | No es la contractilidad lo que no cabe: es la **celda RVP «↓» del caso 2**, que hoy está en −0,499. Cualquier inotropismo la lleva a −0,51…−0,53 (↓↓). La PAS aguanta en ↑ hasta 48 = 0,4 | **48 = 0,3** (igual que la 47) y **caso 2, RVP «↓ o ↓↓»** | 180/180 sin recalibrar. Contractilidad +0,33 ↑, GC +0,58 ↑↑, PAS +0,48 ↑, RVP −0,53 |
| **77** · Volemia → Simpático (0,05) | El reflejo hace lo que debe (defender la presión) y eso choca con dos celdas: **PAD «=» del caso 11** y **PAS «↓↓» del caso 12 sin agua**. Además hay un bucle: reflejo → presión ↑ → el riñón conserva menos → volemia a −1,00. Sin umbral, el reflejo se enciende también en la diabetes insípida con agua y rompe 4–6 celdas más | **77 con umbral −0,4 y peso 0,3**; caso 11, PAD **«= o ↑»** y simpático «↑ o ↑↑» (celda nueva); caso 12 sin agua, PAS **«↓ o ↓↓»** | 181/181 sin recalibrar. Deshidratación: simpático +0,25 ↑, FC +0,31 ↑ (antes +0,12 y +0,15). Celdas frágiles: 12 (antes 16) |

Las dos propuestas juntas: **181 de 181 comprobaciones (180 correctas + la pendiente de la renina del caso 8), sin tocar ningún otro peso y sin recalibrar.** Cambian dos pesos, un umbral y cuatro celdas de la tabla (tres que se amplían y una nueva). Las cuatro celdas son contenido docente: **las valida Edu**.

Lo que no he conseguido: un reflejo «fuerte» (simpático ↑↑ en la deshidratación) y mantener la tabla tal cual. Con la tabla estricta, la recalibración vuelve a dejar el reflejo en casi nada (medido: ver «Alternativas descartadas»).

## Punto 2 · Relación 48, Tiroides → Contractilidad

### Diagnóstico

Estado del caso 2 (tiroides +1, estado estable) con el modelo actual:

| FC | Contractilidad | Volemia | GC | RVP | PAS | PAD | PAM | Renina | Aldosterona |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| +0,37 ↑ | +0,09 = | +0,18 ↑ | **+0,51 ↑↑** | **−0,499 ↓** | +0,42 ↑ | −0,22 ↓ | −0,01 = | +0,17 ↑ | +0,17 ↑ |

La calibración está encajada entre dos umbrales: el GC tiene que llegar a ↑↑ (≥ 0,50) y la RVP no puede pasar de ↓ (> −0,50). Barrido de la 48 con todo lo demás igual:

| 48 | Contractilidad | GC | RVP | PAS | Volemia | Celdas que fallan |
| --- | --- | --- | --- | --- | --- | --- |
| 0,05 (actual) | +0,09 = | +0,51 | −0,50 | +0,42 | +0,18 | — |
| 0,15 | +0,19 ↑ | +0,54 | −0,51 | +0,44 | +0,17 | 2 RVP |
| 0,2 | +0,24 ↑ | +0,55 | −0,52 | +0,46 | +0,16 | 2 RVP |
| **0,3** | **+0,33 ↑** | +0,58 | −0,53 | +0,48 | +0,16 | 2 RVP |
| 0,4 | +0,42 ↑ | +0,60 | −0,54 | +0,50 (↑ por milésimas) | +0,15 | 2 RVP |
| 0,5 | +0,50 ↑ | +0,62 | −0,54 | +0,51 ↑↑ | +0,15 = | 2 RVP, 2 PAS, 2 volemia |
| 1,0 | +0,78 ↑↑ | +0,68 | −0,57 | +0,56 ↑↑ | +0,13 = | 2 RVP, 2 PAS, 2 volemia, 2 días diuresis |

Dos cosas que el motivo escrito en `calibracion.ts` no dice:

1. **Hasta 0,4 la PAS no llega a ↑↑.** Lo que falla primero, y lo único que falla hasta 0,4, es la RVP.
2. **Por qué baja la RVP cuando sube la contractilidad:** más GC → más PAS → más PAM → natriuresis por presión (70) → menos volemia → menos RVP por la 71 (autorregulación, ganancia 1,75). Es coherente con la fisiología: el gasto alto del hipertiroidismo convive con una resistencia muy baja.

### ¿Es correcta la celda «RVP ↓»?

Es discutible, y a favor de ampliarla. En el hipertiroidismo la resistencia vascular sistémica es el cambio hemodinámico mayor: cae en torno a un 50–70 % y el gasto sube entre un 50 y un 300 % **[M: cifras de Klein y Ojamaa 2001; el artículo existe en PubMed, pero sin resumen, así que las cifras no están comprobadas]**. Lo verificado: los rasgos más reconocibles del hipertiroidismo son «resistencia vascular sistémica disminuida y aumento de la frecuencia cardíaca en reposo, la contractilidad del ventrículo izquierdo, el volumen sanguíneo y el gasto» **[V: Dahl, Danzi y Klein 2008]**; la revisión de Circulation explica por los mismos mecanismos los cambios de gasto, contractilidad, presión y resistencia **[V: Klein y Danzi 2007]**.

La tabla pide GC ↑↑ con RVP solo ↓, y con PAM «=» eso es asimétrico (PAM ≈ GC × RVP: si uno sube mucho y la presión media no cambia, la otra baja mucho). De hecho, en la escala de días el modelo actual ya da RVP −0,68 ↓↓ en el caso 2; no se nota porque esa celda no se comprueba.

En cambio, **mantengo la PAS en ↑** (no «↑ o ↑↑»): la hipertensión del hipertiroidismo es sistólica y moderada, con presión de pulso ancha; no es la de un feocromocitoma **[M]**.

### Propuesta

| Dónde | Cambio |
| --- | --- |
| `calibracion.ts`, ajuste de la 48 | `despues: 0.05` → `despues: 0.3`. Motivo nuevo: «Efecto inotrópico directo, con el mismo peso que el cronotrópico (47). Con 0,3 la contractilidad sale ↑ sin llevar la PAS a ↑↑» |
| `casos.ts`, caso 2, estado estable | RVP `'↓'` → `['↓', '↓↓']` |

**Por qué 0,3 y no 1,0.** La 47 quedó en 0,3 por la misma razón (con más, PAS ↑↑). Con 0,3 las dos ruedas del corazón se mueven a la par (FC +0,37, contractilidad +0,33) y el alumno ve los dos efectos directos. Con 1,0 haría falta aceptar además PAS ↑↑ y volemia «=», y recalibrar; no lo recomiendo.

**Resultado medido:** 180/180 (179 + la pendiente), sin recalibrar. Caso 2: FC +0,37 ↑ · contractilidad +0,33 ↑ · volemia +0,16 ↑ · GC +0,58 ↑↑ · RVP −0,53 ↓↓ · PAS +0,48 ↑ · PAD −0,22 ↓ · renina +0,17 ↑ · aldosterona +0,16 ↑. Con la rueda a la mitad (tiroides +0,5): contractilidad +0,17 ↑, GC +0,32 ↑, RVP −0,29 ↓, PAS +0,28 ↑.

### Riesgos

- **PAS del caso 2 a 0,02 del umbral** (+0,48). Si se prefiere más margen: 48 = 0,25 (contractilidad +0,28, PAS +0,47) o 0,2 (+0,24 y +0,46). Las tres pasan 180/180 con la celda de RVP ampliada.
- Volemia, renina y aldosterona del caso 2 quedan cerca de 0,15 (+0,157, +0,166 y +0,162). La aldosterona ya lo estaba (+0,168).
- **Hipotiroidismo (caso 13):** contractilidad −0,32 ↓ (antes −0,08), GC −0,63, y la PAS baja de −0,40 a −0,46. La PAS no está en la tabla del caso 13; en el hipotiroidismo real la sistólica apenas cambia y lo que sube es la diastólica **[M]**. El problema ya existe con el modelo actual (−0,40); la 48 lo acentúa un poco. Si se quiere corregir, es otra asimetría (48 más débil por debajo de 0) y habría que añadir PAS «= o ↓» al caso 13. No lo he probado a fondo.
- Probado y descartado: subir la 48 a 0,6–1,0 y compensar bajando la 55 (contractilidad → GC) a 0,2–0,3. La rueda de contractilidad sale ↑↑, pero rompe la FC del caso 11 y deja la contractilidad casi sin efecto en el feocromocitoma.

## Punto 1 · P5, relación 77, Volemia → Simpático

### Diagnóstico

Estado completo de los casos implicados con el modelo actual (77 = 0,05):

| Caso | Simpático | FC | Volemia | GC | RVP | PAS | PAD | PAM | Renina | TFG | Creatinina | K | Diuresis |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 11 · Deshidratación | +0,12 = | +0,15 ↑ | −0,79 | −0,46 | +0,36 | −0,42 | +0,12 | −0,06 | +0,67 | −0,56 | +0,26 | −0,08 | −0,85 |
| 12 · Diabetes insípida | +0,08 = | +0,10 = | −0,41 | −0,23 | +0,14 | −0,24 | +0,03 | −0,06 | +0,44 | −0,38 | +0,08 | −0,06 | +0,52 |
| 12 sin agua | +0,14 = | +0,18 ↑ | −1,00 | −0,57 | +0,29 | −0,55 | +0,02 | −0,17 | +0,78 | −0,72 | +0,40 | −0,05 | +0,27 |

Barrido de la 77 sin umbral, todo lo demás igual:

| 77 | Caso 11: simpático / FC / volemia / RVP / PAS / PAD | Celdas que fallan |
| --- | --- | --- |
| 0,05 | +0,12 / +0,15 / −0,79 / +0,36 / −0,42 / +0,12 | — |
| 0,1 | +0,17 / +0,21 / −0,85 / +0,39 / −0,39 / +0,16 | 11 PAD, 12 RVP, 12 sin agua PAS, 13 diuresis |
| 0,2 | +0,29 / +0,34 / **−1,00** / +0,46 / −0,33 / +0,23 | 11 PAD, 12 PAS, 12 RVP, 12 sin agua PAS, 13 diuresis |
| 0,3 | +0,37 / +0,44 / −1,00 / +0,50 / −0,19 / +0,29 | 11 celdas (creatinina y K del 11; PAS, PAD, volemia, RVP, GC y renina del 12…) |
| 0,6 | +0,60 / +0,63 / −1,00 / +0,58 / **+0,16** / +0,44 | 21 celdas; la PAS de la deshidratación sale ↑ |

Hay **tres causas distintas**, y conviene separarlas porque cada una tiene una solución diferente:

1. **La RVP del caso 11 ya está «llena» sin el reflejo.** RVP = 0,6 × angiotensina II (+0,41) + 0,07 × ADH (+0,86) + 0,56 × simpático. Sin simpático suma 0,31; cada 0,1 de simpático añade 0,056. La PAD es 0,4 × GC + 0,86 × RVP, y con GC −0,45 queda en «=» solo si la RVP no pasa de ≈ 0,38. Es decir: con los pesos actuales de la 58 y la 59, **PAD «=» y simpático ↑ claro son incompatibles en la deshidratación**.
2. **Bucle de realimentación positiva.** Sin agua, la volemia solo deja de caer cuando la diuresis baja a −0,85 (lo que se pierde por la 67). El reflejo sube la presión; la presión entra en el riñón por la natriuresis por presión (70) y por la perfusión renal (39 → 40 → 42); el riñón conserva menos, la diuresis no llega a −0,85 y la volemia cae hasta el tope (−1,00). Con la volemia en −1,00, el caso 11 y el 12 sin agua se vuelven casi iguales y la diferencia que pide la tabla (PAS ↓ frente a ↓↓) desaparece. Con 0,3 o más, la presión defendida sostiene además la TFG y se pierde la creatinina ↑ de la deshidratación.
3. **El reflejo se enciende con hipovolemias leves.** Sin umbral actúa en la diabetes insípida con agua (volemia −0,41), en el hipotiroidismo (−0,31) y en la dieta baja en sal (−0,19), y mueve celdas que estaban a 0,01 de un umbral (12 RVP +0,144, 13 diuresis +0,147).

### Qué dice la fisiología

- En voluntarios sometidos a hipovolemia central progresiva (presión negativa en la mitad inferior del cuerpo hasta −60 mmHg), **la sistólica baja (129 → 111 mmHg), la diastólica no cambia (78 → 81 mmHg, no significativo), la presión de pulso se estrecha (50 → 29), la actividad simpática muscular sube de forma lineal (14 → 36 descargas por minuto) y la presión media no cambia** **[V: Convertino, Cooke y Holcomb 2006]**. Es exactamente la fila del caso 11 (PAS ↓, PAD =, presión media =) con un simpático claramente alto.
- La activación simpática empieza con déficits pequeños: con −10 a −15 mmHg ya sube un 28–93 % y aumenta la resistencia del antebrazo, **sin que cambie la presión arterial** **[V: Rowell y Seals 1990]**. La hipovolemia por diurético eleva la actividad simpática de reposo **[V: Kimmerly y Shoemaker 2003]**.
- La taquicardia, en cambio, aparece más tarde: en la clasificación clínica de la hemorragia no hay taquicardia hasta perder alrededor del 15 % del volumen, y entre el 15 y el 30 % la diastólica **sube** algo y la presión de pulso se estrecha, con la sistólica todavía conservada **[M: clasificación ATLS, no verificada en PubMed]**.
- El simpático renal reduce el flujo renal y la filtración y aumenta la reabsorción tubular de Na **[V: DiBona y Kopp 1997]**. Es el brazo renal del reflejo, y es lo que en el paciente real impide el bucle del punto 2. En el modelo ese papel lo hace la 76 (volemia → perfusión renal), que no pasa por el nodo simpático.

Conclusiones para la tabla:

- **Caso 11, PAD «=»:** bien fundada (dato medido). Pero una subida pequeña de la diastólica también es fisiología aceptada de la hipovolemia compensada. «= o ↑» es defendible; ↑↑ no lo sería.
- **Caso 12 sin agua, PAS «↓↓»:** es la celda más discutible. Mientras la hipovolemia está compensada, la sistólica baja poco; el desplome es la fase descompensada. Lo que enseña esa fila es la creatinina ↑ (D4), que se mantiene.
- **Un umbral en la 77 es un recurso del modelo, no un hecho:** el simpático real sube desde el principio. Lo que sí tiene umbral es lo que el alumno ve en las ruedas (taquicardia y cambio de presión). Como el nodo «actividad simpática» del modelo arrastra a la vez FC, contractilidad, RVP y renina, el umbral representa «el reflejo no se nota hasta que el déficit es moderado». Es el mismo recurso que ya usan las relaciones 37, 45 y 66.

### Propuesta

| Dónde | Cambio |
| --- | --- |
| `propuestas.ts`, P5 (relación 77) | Añadir `umbral: -0.4`. El resto igual (`intensidad: 0`, `intensidadNegativa: 0.6`, `tiempo: 'dias'`). Explicación: «Reflejo de volumen bajo: cuando la pérdida de volumen es moderada o mayor, los receptores de baja presión activan el simpático» |
| `calibracion.ts`, ajuste de la 77 | `despues: 0.05` → `despues: 0.3` |
| `casos.ts`, caso 11 | PAD `'='` → `['=', '↑']`; añadir `simpatico: ['↑', '↑↑']` junto a la FC |
| `casos.ts`, caso 12 «sin acceso al agua» | PAS `'↓↓'` → `['↓', '↓↓']` |

El motor ya admite un umbral negativo con peso por debajo de 0 (`entradaEfectiva`): la entrada es (volemia + 0,4) cuando la volemia baja de −0,4, y 0 en el resto.

**Resultado medido** (junto con la propuesta de la 48): 181/181, sin recalibrar.

| Caso | Simpático | FC | Contract. | Volemia | GC | RVP | PAS | PAD | PAM | Renina | Creatinina | K |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 11 · Deshidratación | **+0,25 ↑** | **+0,31 ↑** | +0,15 | −0,96 ↓↓ | −0,43 ↓ | +0,44 ↑ | −0,35 ↓ | **+0,21 ↑** | +0,02 = | +0,75 ↑↑ | +0,24 ↑ | −0,12 = |
| 12 · Diabetes insípida | +0,06 = | +0,07 = | +0,03 | −0,39 ↓ | −0,25 ↓ | +0,13 = | −0,26 ↓ | +0,01 = | −0,08 = | +0,43 ↑ | +0,10 = | −0,05 = |
| 12 sin agua | +0,27 ↑ | +0,32 ↑ | +0,16 | −1,00 ↓↓ | −0,44 ↓ | +0,35 ↑ | **−0,40 ↓** | +0,13 = | −0,05 = | +0,79 ↑↑ | +0,32 ↑ | −0,09 = |

Los casos 13 (hipotiroidismo, volemia −0,27) y 14 (dieta baja en sal, −0,18) no llegan al umbral: el reflejo no los toca. El feocromocitoma (volemia −0,19) tampoco.

La deshidratación queda como en el estudio de Convertino: sistólica ↓, presión media «=», presión de pulso estrecha, simpático y FC ↑. La diastólica sale +0,21 (↑ leve) en lugar de «=».

**Robustez.** Con la tabla ampliada pasan 181/181 las 12 combinaciones de umbral −0,4, −0,45 y −0,5 con peso 0,25, 0,3, 0,35 y 0,4 (con umbral −0,35 pasa hasta peso 0,35). No es un punto aislado:

| Umbral | Peso | Caso 11: simpático / FC / PAD / PAS / volemia | Fallos |
| --- | --- | --- | --- |
| −0,3 | 0,3 | +0,29 / +0,35 / +0,23 / −0,32 / −1,00 | 12 RVP (+0,16) |
| −0,35 | 0,3 | +0,28 / +0,33 / +0,22 / −0,33 / −0,99 | — |
| **−0,4** | **0,3** | **+0,25 / +0,31 / +0,21 / −0,35 / −0,96** | — |
| −0,4 | 0,4 | +0,32 / +0,38 / +0,25 / −0,28 / −1,00 | — |
| −0,4 | 0,5 | +0,37 / +0,44 / +0,29 / −0,19 / −1,00 | 11 creatinina, 11 K |
| −0,5 | 0,4 | +0,29 / +0,34 / +0,23 / −0,33 / −1,00 | — |

Elijo −0,4 y 0,3 porque es la combinación más fuerte en la que la volemia del caso 11 todavía no toca el tope (−0,96): así la deshidratación y la diabetes insípida sin agua siguen siendo distinguibles. Si Edu prefiere más taquicardia, −0,4 y 0,4 también pasa (FC +0,38, PAD +0,25), con la volemia en −1,00.

**Fragilidad.** Con las dos propuestas, las celdas a menos de 0,02 de un umbral bajan de 16 a 12. Dejan de ser frágiles la FC del caso 11 (+0,15 → +0,31), la aldosterona del 11, la RVP del 12, la diuresis del 13 y el GC del caso 2; pasan a serlo la volemia y la renina del caso 2 (por la 48).

### Riesgos

- **La PAD de la deshidratación sube (+0,21).** En un simulador de hipertensión puede sorprender que la deshidratación «suba la mínima». Conviene una nota en el caso 11: «la mínima se mantiene o sube un poco porque los vasos se contraen; la presión de pulso se estrecha». Si Edu no quiere esa flecha, ver la opción B.
- **El caso 12 sin agua pierde el contraste de PAS con el caso 11** (−0,40 frente a −0,35; antes −0,55 frente a −0,42). Se distinguen por la natremia (↑↑ frente a ↑), la creatinina (+0,32 frente a +0,24) y la diuresis (↑ frente a ↓↓), que es lo que importa en esa fila.
- **El umbral es un recurso.** Con la rueda de acceso al agua a medias o con la diabetes insípida con agua (volemia −0,39) el simpático no se mueve. Es aceptable (hipovolemia leve, sin signos), pero no es literalmente cierto: en el paciente real el simpático ya está algo activado.
- **Bucle no resuelto.** El reflejo sigue vaciando la volemia (−0,79 → −0,96). Probé cerrarlo con una relación nueva Simpático → Reabsorción de Na (+) (el brazo renal de DiBona y Kopp): con peso 0,3 la volemia del feocromocitoma pasa de −0,19 a +0,04 y se pierde su «volumen bajo», que es un rasgo real y está en la tabla. Descartada. Reforzar la 76 por debajo de 0 (0,6 → 0,9–1,2) tampoco sirve: sube la creatinina de la diabetes insípida con agua (+0,15…+0,19) y baja su diuresis de ↑↑.
- **Observación al margen (no es de este encargo):** la rueda de acceso al agua responde de forma muy brusca. Con −0,9 la volemia es −0,37 y con −1,0 es −0,96; hasta −0,75 casi no pasa nada. Es anterior a estos cambios (viene de la modulación de la sed, relación 15). El umbral de la 77 lo acentúa: el simpático pasa de +0,05 a +0,25 en la última décima de la rueda. Merece una revisión aparte antes de construir esa rueda en la interfaz.
- La columna «sin este ajuste falla» de `calibracion.ts` hay que regenerarla con `npx tsx scripts/sin-ajuste.ts` después de aplicar los cambios, y actualizar `docs/calibracion.md` (P5, tabla de ajustes, «Ajustes que conviene revisar», «Decisiones tomadas», fragilidad).

### Alternativas descartadas (todas medidas)

| Alternativa | Resultado |
| --- | --- |
| **A. Sin umbral y sin tocar la tabla**, recalibrando con la 77 fijada en 0,3 (calibrador `es`, 3000 evaluaciones desde los pesos actuales, 48 fijada en 0,3) | No llega: quedan 3 fallos (11 PAD +0,17, 12 RVP +0,21, 12 sin agua PAS −0,45) |
| **B. Umbral −0,3 y peso 0,4 o 0,6, tabla estricta**, misma recalibración | No llega: 2 fallos con 0,4 (12 diuresis +0,48, 12 sin agua PAS −0,47) y 3 con 0,6 (11 PAD +0,24, 12 diuresis, 12 sin agua PAS −0,34) |
| **C. Umbral −0,4 y peso 0,3, tabla estricta**, descenso por coordenadas de paso pequeño sobre todos los pesos libres | **Sí llega a 0 fallos**, pero moviendo 38 pesos (hasta ×2,4) y **diluyendo el reflejo aguas abajo**: baja la 51 (simpático → FC) de 1,25 a 1,01 y la 52 de 0,6 a 0,3. Resultado en la deshidratación: simpático +0,18, FC +0,18. Es volver al punto de partida por otro camino |
| D. Relación nueva Simpático → Reabsorción de Na | Rompe la volemia del feocromocitoma (ver riesgos) |
| E. Sin umbral, peso 0,2, y ampliar la tabla | Harían falta 4 o 5 celdas (11 PAD, 12 PAS, 12 RVP, 12 sin agua PAS y, con la 48 en 0,05, 13 diuresis), entre ellas RVP ↑ en la diabetes insípida con agua. Peor que la propuesta |

La lectura de A, B y C es la misma: **con PAD «=» estricta y PAS «↓↓» estricta, el calibrador solo puede aprobar la tabla quitándole fuerza al reflejo**, sea en la 77 o en la 51. Por eso la propuesta pasa por ampliar esas dos celdas.

### Opción B, si Edu quiere mantener la tabla tal cual

Es viable, pero hay que saber lo que se compra: una recalibración completa y un reflejo más débil (simpático y FC ≈ +0,18). Restricciones exactas:

- Estructura: 77 con `umbral: -0.4`.
- Tabla: caso 2 RVP «↓ o ↓↓»; caso 11 con `simpatico: ['↑', '↑↑']`. PAD del 11 y PAS del 12 sin agua, sin tocar.
- Pesos fijados (`--congeladas`): `40:intensidad,40:intensidadNegativa,47:intensidad,48:intensidad,7:intensidadNegativa,71:intensidadNegativa,74:intensidad,54:intensidad,76:intensidad,77:intensidad,77:intensidadNegativa`, con 48 = 0,3 y 77 por debajo de 0 = 0,3. Las dos de intensidad 0 (76 y 77 por encima de 0) hay que congelarlas siempre: el calibrador calcula log(peso / peso del documento) y con 0 da un valor no numérico.
- **Añadir `51:intensidad` a las congeladas (1,25)**, o un mínimo (`--minimos 27:intensidad=0.6,51:intensidad=1.25,52:intensidad=0.6`). Sin esto el calibrador recorta el reflejo por la 51 y la 52, como en la alternativa C. No he comprobado que con la 51 fijada se llegue a 0 fallos; por lo visto en A y B, lo dudo.
- Orden: `npm run calibrar -- --metodo es --desde-calibrado --evaluaciones 6000 --congeladas … --minimos … --salida pesos.json`. Con 3000 evaluaciones no basta.

## Qué decide Edu

| # | Decisión | Recomendación |
| --- | --- | --- |
| 1 | Caso 2 (hipertiroidismo): RVP «↓» → «↓ o ↓↓» | Sí. La caída de resistencia es grande y es coherente con GC ↑↑ y presión media «=» |
| 2 | 48 = 0,3 (contractilidad ↑ en el hipertiroidismo, ↓ en el hipotiroidismo) | Sí |
| 3 | Caso 11 (deshidratación): PAD «=» → «= o ↑», con una nota sobre la presión de pulso | Sí. Alternativa: opción B, con un reflejo más débil |
| 4 | Caso 11: celda nueva, simpático «↑ o ↑↑» | Sí. Es lo que impide que una calibración futura vuelva a anular el reflejo |
| 5 | Caso 12 sin agua: PAS «↓↓» → «↓ o ↓↓» | Sí. La fila enseña la creatinina, no el grado de hipotensión |
| 6 | 77 con umbral −0,4 y peso 0,3 | Sí. Es un recurso del modelo (el simpático real sube antes), pero deja las hipovolemias leves sin signos, que es lo que se ve en clínica |

Si Edu acepta las seis, aplicar los cambios es un trabajo pequeño y mecánico (dos pesos, un umbral, cuatro celdas, regenerar la columna de `sin-ajuste` y actualizar `docs/calibracion.md`): se puede hacer en la sesión principal sin recalibrar. Los textos nuevos (nota del caso 11, explicación de la 77) conviene revisarlos en la sesión de redacción docente.

## Fuentes

Según PubMed (existencia y resumen comprobados durante esta revisión, salvo donde se indica):

- **[V]** Convertino VA, Cooke WH, Holcomb JB. Arterial pulse pressure and its association with reduced stroke volume during progressive central hypovolemia. J Trauma. 2006;61(3):629-34. PMID 16966999. [doi:10.1097/01.ta.0000196663.34175.33](https://doi.org/10.1097/01.ta.0000196663.34175.33)
- **[V]** Rowell LB, Seals DR. Sympathetic activity during graded central hypovolemia in hypoxemic humans. Am J Physiol. 1990;259(4 Pt 2):H1197-206. PMID 2221126. [doi:10.1152/ajpheart.1990.259.4.H1197](https://doi.org/10.1152/ajpheart.1990.259.4.H1197)
- **[V]** Kimmerly DS, Shoemaker JK. Hypovolemia and MSNA discharge patterns: assessing and interpreting sympathetic responses. Am J Physiol Heart Circ Physiol. 2003;284(4):H1198-204. PMID 12595281. [doi:10.1152/ajpheart.00229.2002](https://doi.org/10.1152/ajpheart.00229.2002)
- **[V]** DiBona GF, Kopp UC. Neural control of renal function. Physiol Rev. 1997;77(1):75-197. PMID 9016301. [doi:10.1152/physrev.1997.77.1.75](https://doi.org/10.1152/physrev.1997.77.1.75)
- **[V]** Dahl P, Danzi S, Klein I. Thyrotoxic cardiac disease. Curr Heart Fail Rep. 2008;5(3):170-6. PMID 18752767. [doi:10.1007/s11897-008-0026-9](https://doi.org/10.1007/s11897-008-0026-9)
- **[V]** Klein I, Danzi S. Thyroid disease and the heart. Circulation. 2007;116(15):1725-35. PMID 17923583. [doi:10.1161/CIRCULATIONAHA.106.678326](https://doi.org/10.1161/CIRCULATIONAHA.106.678326)
- **[V, solo existencia; sin resumen en PubMed]** Klein I, Ojamaa K. Thyroid hormone and the cardiovascular system. N Engl J Med. 2001;344(7):501-9. PMID 11172193. [doi:10.1056/NEJM200102153440707](https://doi.org/10.1056/NEJM200102153440707). Las cifras (RVP −50 a −70 %, gasto +50 a +300 %) son de memoria **[M]**.
- **[M]** Clasificación de la hemorragia del ATLS (clases I–IV: taquicardia a partir de ≈ 15 % de pérdida; diastólica ↑ y presión de pulso estrecha en la clase II). No verificada.
- **[M]** Hipertensión sistólica moderada del hipertiroidismo e hipertensión diastólica del hipotiroidismo: fisiología de manual, no verificada aquí.

## Cómo se ha comprobado

- `npm ci` y `npx tsx scripts/informe.ts` en el repositorio: 180/180 con 1 pendiente (punto de partida).
- Variantes construidas en memoria sobre `hipertension` (mismo motor, mismas relaciones, cambiando solo lo indicado) y evaluadas con la misma lógica que `evaluar.ts`. Volcado de los 25 nodos en los casos 2, 9, 11, 12, 12 sin agua, 13 y 14.
- Recalibraciones (alternativas A y B) en copias locales del repositorio con `scripts/calibrar.ts` sin modificar.
- No se ha subido ningún cambio del modelo. Los tests de Vitest del repositorio no cambian: este documento es lo único nuevo.
