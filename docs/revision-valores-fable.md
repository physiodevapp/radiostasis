# Revisión docente de los valores orientativos (fase 6, punto 5)

17 nov 2026 · revisión de los valores orientativos de analítica y presión (rama `fase-6-uso-docente`, commit `097d586`): los datos de `src/temas/hipertension/valores.ts`, los textos de la vista en `src/app/main.ts` y `src/app/ficha.ts`, la traducción de `src/motor/valores.ts`, los casos de `tests/valores.test.ts` y su coherencia con `docs/valores-orientativos.md` y `docs/diseno.md` · no se ha tocado ningún archivo de código ni ningún otro documento.

## Resumen

- La idea está bien resuelta: opción desactivada por defecto, «≈» y redondeo en las cifras, bandas en las cuatro magnitudes que más dependen del laboratorio, «≥ / ≤» en el tope de escala y una nota fija que dice lo que la cifra no es.
- Hay **19 correcciones: 4 errores, 9 mejoras y 6 de estilo**.
- Ningún error es de fisiología. Tres son valores «normales» que se contradicen en pantalla y el cuarto es una fuente mal resumida:
  - **Aldosterona:** la línea gris dice «normal 3–25» y la banda de la misma celda dice «normal (5–20 ng/dL)». Con sal alta se lee «suprimida (3–5 ng/dL)» encima de «normal 3–25».
  - **Presión:** la persona sana sale en «≈ 120/80 mmHg · normal < 120/80», es decir, fuera de su propio rango normal. Además, «< 120/80» es la presión *óptima* de la ESH 2023, no la normal, y la aclaración de la ficha lo dice a la vez de las dos maneras.
  - **Fuente [20] de `docs/valores-orientativos.md`:** el estudio encontró lo contrario de lo que se le atribuye (la aldosterona quedó *por encima* de 5 ng/dL tras la sobrecarga salina en casi todos los sanos).
- **Falsa precisión.** Las cifras la evitan bien. Las bandas, no del todo: el borrador proponía «suprimida (≈ < 0,5 ng/mL/h)» y la versión construida muestra «suprimida (0,2–0,5 ng/mL/h)», sin «≈». Son los intervalos peor documentados de toda la tabla y se leen como cortes de laboratorio. Propongo devolverles el «≈» (corrección 5).
- **Ancla de la natremia en 146 (y 297 en la osmolaridad): la mantendría.** Es un arreglo de vista para un límite del modelo, y cumple: la sal queda en ≈ 145 y la diabetes insípida con agua en ≈ 146, sin mover el SIADH (≈ 129) ni la diabetes insípida sin agua (≈ 153). Tiene tres costes, que detallo en su apartado. El problema de fondo es del modelo: sube más el sodio con la sal (+0,38) que sin acceso al agua (+0,27).
- **Dos anclas que propongo mover** (son datos de la vista, no del modelo; las valida Edu):
  - presión en +0,5: de 150/95 a **160/100**, para que cada flecha coincida con una categoría de la ESH;
  - potasio en −0,5: de 3,3 a **3,0 mmol/L**, para que el regaliz, la tiazida y el hiperaldosteronismo no salgan con un potasio normal o casi.
- **Traducción y tests:** correctos. He ejecutado los 33 casos, 12 variantes y todas las parejas de entradas a tope; `tests/valores.test.ts` pasa (6 de 6). Propongo un ajuste en el tope de escala y tres comprobaciones nuevas; una de ellas habría detectado el error de la aldosterona.
- **Fuentes:** he vuelto a comprobar en PubMed 19 de los PMID del documento de fuentes. Todos existen y 18 dicen lo que se les atribuye; el otro es el [20]. Añado una fuente nueva, con PMID y DOI verificados.
- **Cambios que tocarían el modelo: ninguno.** Dejo dos observaciones para una revisión aparte.

## Tabla de correcciones

Cada propuesta es el texto completo, listo para pegar en lugar del actual. Gravedad: **error** (se contradice en pantalla o con la fuente), **mejora** (correcto pero impreciso, incompleto o con riesgo de falsa precisión), **estilo** (redacción). Los valores entre paréntesis son del modelo en estado estable.

### Errores

| # | Archivo · texto | Texto actual | Propuesta | Motivo |
| --- | --- | --- | --- | --- |
| 1 | `valores.ts` · `aldo` · `normal` y `aclaracion` | `normal: '3–25', aclaracion: 'sentado; depende del laboratorio, la postura y la sal'` | `normal: '5–20', aclaracion: 'con la persona sentada y una dieta con sal normal; el rango de cada laboratorio suele ser más ancho y cambia con la postura, la sal y el método'` | La celda de la persona sana muestra «normal (5–20 ng/dL)» y debajo «normal 3–25». Con sal alta, «suprimida (3–5 ng/dL)» sobre «normal 3–25»: una banda suprimida dentro del rango normal. Lo mismo arriba: «alta (20–30)» con un normal que llega a 25. Unifico con las bandas porque son las que usa la vista en las cinco posiciones. Ninguno de los dos rangos está comprobado en PubMed (lo dice el documento de fuentes): conviene que Edu lo contraste con su laboratorio. |
| 2 | `main.ts` · `pintarValores`, bajo el dial | `' · normal < 120/80'` | `' · normal en reposo < 130/85'` | La persona sana sale en «≈ 120/80 mmHg · normal < 120/80»: no cumple su propio normal. El SIADH, con las dos flechas en «=», sale en «≈ 130/85 · normal < 120/80». En la ESH 2023, < 120/80 es la presión *óptima*; la normal llega a 129/84 y la normal-alta empieza en 130/85 (PMID 41039765). «< 130/85» coincide además con lo que el simulador llama «=» (hasta v = 0,15 → 129/84). «En reposo» hace falta porque la línea también se ve durante la sesión de ejercicio («≈ 160/80» en la aeróbica moderada, «muy alta durante el esfuerzo» en la de fuerza). Actualizar la cita de `docs/diseno.md`. |
| 3 | `valores.ts` · `pas` y `pad` · `normal` y `aclaracion` | `normal: '< 120', aclaracion: '< 120 óptima y 120–129 normal (ESH 2023)'` · `normal: '< 80', aclaracion: '< 80 óptima y 80–84 normal (ESH 2023)'` | `normal: '< 130', aclaracion: 'en reposo y en consulta; óptima < 120, normal 120–129, normal-alta 130–139 e hipertensión desde 140 (ESH 2023)'` · `normal: '< 85', aclaracion: 'en reposo y en consulta; óptima < 80, normal 80–84, normal-alta 85–89 e hipertensión desde 90 (ESH 2023)'` | Acompaña a la corrección 2. Hoy la ficha de la sistólica dice «normal < 120 mmHg (< 120 óptima y 120–129 normal (ESH 2023))»: el rótulo llama normal a lo que el paréntesis llama óptimo, y hay un paréntesis dentro de otro. La propuesta añade el dato que más le sirve al estudiante: desde dónde se llama hipertensión (grado 1: 140–159 y/o 90–99; PMID 38616483). |
| 4 | `docs/valores-orientativos.md` · fuente 20 (y la nota de la aldosterona que la cita) | «20. Li X, et al. J Clin Endocrinol Metab. 2015. Tras la sobrecarga salina, la aldosterona queda por debajo de 5 ng/dL en la hipertensión esencial y en sanos, y por encima de 10 ng/dL en la mayoría de los pacientes con hiperaldosteronismo primario (resumen).» | 20. Li Y, et al. J Clin Endocrinol Metab. 2016;101:89-95. El criterio habitual (guía de la Endocrine Society [17]) es que, tras la sobrecarga salina, la aldosterona baja de 5 ng/dL en sanos y en la hipertensión esencial. En este estudio, en población china, quedó por encima de 5 ng/dL en casi todos ellos y por encima de 10 ng/dL en la mayoría de los pacientes con hiperaldosteronismo primario; el mejor corte fue 11,45 ng/dL (resumen). | El resumen cita «menos de 5 ng/dL» como el criterio que pone a prueba, y su resultado es el contrario: «greater than 5 ng/dL in both EH and NC except for 1». El primer autor es Li Y (Yanyan Li). Consecuencia: el corte de 5 ng/dL que separa «suprimida» de «normal» se apoya en la guía [17], cuyo resumen no trae la cifra. Es una razón más para la corrección 5. |

### Mejoras

| # | Archivo · texto | Texto actual | Propuesta | Motivo |
| --- | --- | --- | --- | --- |
| 5 | `valores.ts` · intervalos de las bandas de `diuresis`, `renina` y `aldo` | `['< 500', '500–800', '800–2000', '2000–3000', '> 3000']` · `['< 0,2', '0,2–0,5', '0,5–3', '3–10', '> 10']` · `['< 3', '3–5', '5–20', '20–30', '> 30']` | `['< 500', '≈ 500–800', '≈ 800–2000', '≈ 2000–3000', '> 3000']` · `['< 0,2', '≈ 0,2–0,5', '≈ 0,5–3', '≈ 3–10', '> 10']` · `['< 3', '≈ 3–5', '≈ 5–20', '≈ 20–30', '> 30']` | Es el principal riesgo de falsa precisión que queda. Las cifras llevan «≈»; las bandas, no, y «suprimida (0,2–0,5 ng/mL/h)» se lee como un corte de laboratorio. Son justo los intervalos sin comprobar en PubMed y los que más cambian con el método, la postura y la sal. El borrador de rótulos ya lo preveía («suprimida (≈ < 0,5 ng/mL/h)»). Se ve «suprimida (≈ 0,2–0,5 ng/mL/h)». Hay que actualizar dos expectativas de `tests/valores.test.ts` y el ejemplo de `docs/diseno.md`. |
| 6 | `valores.ts` · `pas` y `pad` · ancla de +0,5 | `anclas: [80, 100, 120, 150, 180]` · `anclas: [50, 65, 80, 95, 110]` | `anclas: [80, 100, 120, 160, 180]` · `anclas: [50, 65, 80, 100, 110]` | Con 160/100 cada flecha coincide con una categoría de la ESH 2023: «=» es óptima o normal (hasta 129/84), «↑» es normal-alta o grado 1 (130–159/85–99), «↑↑» es grado 2 o más (desde 160/100) y el tope es grado 3 (≥ 180/110). Hoy «↑↑» empieza en 150/95, a mitad del grado 1. La propuesta del plan para «↑↑» (165/100) también encaja mejor. Los cuadros se acercan a lo publicado: hiperaldosteronismo, de 135/85 a 140/90 (registro alemán: 155–164/93–96, PMID 19190103); sal alta, de 135/90 a 140/90; estenosis, de 145/90 a 155/95; tumor de renina, de 155/100 a 165/100. Sana, SIADH y feocromocitoma no cambian. **Coste:** el hipotiroidismo y la deshidratación pasan de una diastólica de 85 a 90 con la misma flecha «↑». No es un cambio del modelo, pero mueve lo que se ve: lo valida Edu. |
| 7 | `valores.ts` · `potasio` · ancla de −0,5 | `anclas: [2.5, 3.3, 4.2, 5.5, 6.5]` | `anclas: [2.5, 3.0, 4.2, 5.5, 6.5]` | Con 3,3, tres cuadros que enseñan hipopotasemia salen con un potasio normal: regaliz ≈ 3,5 (↓), sal con tiazida ≈ 3,5 (↓) y tumor de renina ≈ 3,8 (↓, con hipopotasemia en el 79 % de los casos publicados, PMID 38438720). La flecha dice «baja» y la cifra queda dentro de «normal 3,5–5,0». Con 3,0 salen en ≈ 3,2, ≈ 3,3 y ≈ 3,6, y el hiperaldosteronismo en ≈ 3,0 (dentro de lo que exige el test: entre 2,8 y 3,6). Además «↓↓» pasa a empezar donde acaba la hipopotasemia leve (3,0–3,5; moderada 2,5–3,0; grave < 2,5; PMID 36096723), igual que en la natremia «↓↓» empieza donde acaba la hiponatremia leve (130). El tumor de renina sigue saliendo normal: eso es del modelo (v = −0,24). Cambia el ejemplo de `docs/diseno.md` («≈ 3,3 mmol/L»). |
| 8 | `valores.ts` · `natremia` · `aclaracion` | (no tiene) | `aclaracion: 'en el paciente, la sal de la dieta la mueve muy poco: entre 0,4 y 3 mmol/L'` | El simulador muestra «↑ ≈ 145» con la dieta alta en sal. La ficha es el sitio para decir que en el paciente el cambio es mínimo, con las cifras ya verificadas (PMID 15557392). Es el mismo matiz que la revisión de la fase 6 añadió al reto 6. Solo se ve en la ficha, no en la celda. |
| 9 | `valores.ts` · `notaValores` | «El simulador solo calcula hacia dónde y cuánto se mueve cada valor (las flechas). Estos números traducen esas flechas a cifras típicas para hacerse una idea; no son un cálculo del valor real ni sirven para interpretar una analítica. Los rangos normales cambian según el laboratorio.» | El simulador solo calcula hacia dónde y cuánto se mueve cada valor (las flechas). Con esta opción, cada flecha se traduce a una cifra o a un intervalo típicos, para hacerse una idea del orden de magnitud. No es el valor que tendría un paciente, ni sirve para interpretar una analítica o una toma de presión reales. Los rangos normales cambian según el laboratorio. | La nota se lee también con la opción en «No»: «Estos números» no tiene todavía a qué referirse. Cuatro de las ocho magnitudes muestran un intervalo, no un número. «El valor real» es ambiguo (¿el real del simulador?); «el valor que tendría un paciente» no lo es. Falta la presión, que también se traduce. |
| 10 | `valores.ts` · `osmU` · `aclaracion` | `aclaracion: 'según lo que se beba'` | `aclaracion: 'según lo que se beba; se interpreta junto con la osmolaridad del plasma'` | En el SIADH la celda dice «muy concentrada» y la ficha, «normal 50–1200 mOsm/kg (según lo que se beba)»: el estudiante puede concluir que es normal. La clave (el comentario del archivo ya la explica) es que está concentrada *para un plasma diluido*. |
| 11 | `motor/valores.ts` · `traducir`, cifra en el tope de escala | `const x = interpolar(v, def.anclas);` | `const enTope = Math.abs(v) >= tope - 1e-9;` y `const x = interpolar(enTope ? Math.sign(v) : v, def.anclas);` | Entre el tope (0,95) y 1 la cifra se sigue interpolando, y el mismo aviso «tope de escala» puede leerse «≥ 175 mmHg» (v = 0,95) o «≥ 180 mmHg» (v = 0,97); «≤ 2,6» o «≤ 2,5 mmol/L»; «≥ 2,9» o «≥ 3,0 mg/dL». Si en el tope se usa siempre el ancla del extremo, la cifra es única, es la documentada y es la que mejor dice «a partir de aquí el simulador no distingue». `enTope` sirve también para elegir el signo. |
| 12 | `valores.ts` · comentario de cabecera, párrafo de las bandas | «…con los nombres de cada magnitud y un intervalo fijo. La osmolaridad urinaria va sin intervalo…» | Añadir tras «un intervalo fijo.»: «En modo banda las anclas no se muestran, y sus intervalos son más extremos que ellas a propósito (diuresis: el ancla de −0,5 es 800 mL/día y la banda «oliguria» empieza ahí con < 500): cada banda describe el cuadro típico de esa flecha. Si algún día se muestra la cifra, hay que alinearlas antes.» | Las anclas de la diuresis, la renina y la aldosterona contradicen a sus bandas (renina: ancla de −0,15 ≈ 1,1 ng/mL/h, banda «suprimida ≈ 0,2–0,5»; ancla de +0,5 = 5, banda «muy alta > 10»). Hoy no se ve porque la cifra no se pinta, pero `traducir` la sigue devolviendo en `valor` y la tabla del documento de fuentes las da como si se usaran. He comprobado que los intervalos de las bandas son razonables para los cuadros que caen en cada una (ver «Lo que he revisado»); lo que falta es dejarlo escrito. |
| 13 | `tests/valores.test.ts` · comprobaciones nuevas | (no existen) | Tres `expect`, en «Tests propuestos», más abajo. | El primer test anuncia «el 0 dentro del rango» y no lo comprueba. No hay ningún test que compare la banda «normal» con el campo `normal` (habría detectado el error 1) ni que fije la relación osmolaridad ≈ 2 × Na + 5, que el comentario del archivo da por hecha y que se rompe si alguien mueve un ancla sin la otra. |

### Estilo

| # | Archivo · texto | Texto actual | Propuesta | Motivo |
| --- | --- | --- | --- | --- |
| 14 | `main.ts` · subtítulo de la analítica | `' · cifras orientativas'` | `' · valores orientativos'` | La mitad de la analítica muestra bandas, no cifras, y la opción se llama «Valores orientativos». Actualizar la cita de `docs/diseno.md`. |
| 15 | `main.ts` · `pintarValores`, línea gris de la celda | `c.rango.textContent = \`normal ${d.normal}\`;` | `c.rango.textContent = t.banda === 'normal' \|\| t.texto === 'normal' ? '' : \`normal ${d.normal}\`;` | En la persona sana, cuatro celdas dicen dos veces lo mismo: «normal (0,5–3 ng/mL/h)» y debajo «normal 0,5–3». Si la banda ya es la normal, la línea gris sobra. La segunda condición cubre la creatinina baja («normal» sobre «normal 0,6–1,2»). |
| 16 | `valores.ts` · `diuresis` · `aclaracion` | `aclaracion: 'se orina lo que se bebe'` | `aclaracion: 'depende sobre todo de lo que se beba'` | Dentro del paréntesis de la ficha («normal 800–2000 mL/día (se orina lo que se bebe)») suena a sentencia, y no es exacto: también se pierde agua por la piel y la respiración. |
| 17 | `valores.ts` · `renina` · `aclaracion` | `'actividad de renina plasmática, sentado; depende del laboratorio, la postura, la sal y los fármacos'` | `'actividad de renina plasmática, con la persona sentada; depende del laboratorio, la postura, la sal y los fármacos'` | «Sentado» no concuerda con nada. Igual que en la aldosterona (corrección 1). |
| 18 | `motor/valores.ts` · comentario de `Traduccion.texto` | `/** Lo que se muestra: «≈ 145 mmol/L», «suprimida (< 0,5 ng/mL/h)», «normal». */` | `/** Lo que se muestra: «≈ 145 mmol/L», «suprimida (≈ 0,2–0,5 ng/mL/h)», «muy concentrada», «normal». */` | El ejemplo es del borrador: esa banda no existe. Falta el caso sin intervalo (osmolaridad urinaria). |
| 19 | `tests/valores.test.ts` · títulos de dos tests | `'hay valor para la presión y los ocho de la analítica, con anclas crecientes y el 0 dentro del rango'` · `'la persona sana sale en el centro del rango normal'` | `'hay valor para la presión y los ocho de la analítica, con anclas crecientes'` (si no se añade la comprobación 13) · `'la persona sana sale en el centro del rango normal; bandas con y sin intervalo'` | El primero anuncia algo que no comprueba. El segundo incluye una renina suprimida (v = −0,27) y una orina muy concentrada (v = 0,6), que no son de la persona sana. |

Las correcciones 2, 14 y 15 son de `main.ts`; la 11, de `src/motor/valores.ts`; la 4, de un documento. El resto son datos de `valores.ts` o tests.

### Tests propuestos (corrección 13)

```ts
it('el normal de la celda, el de la banda y el centro de la escala no se contradicen', () => {
  for (const [id, d] of Object.entries(V)) {
    // La banda «normal», si lleva intervalo, es el mismo rango que la línea gris.
    const normal = d.bandas?.find((b) => b.texto === 'normal');
    if (normal?.intervalo) expect(normal.intervalo.replace('≈ ', ''), id).toBe(d.normal);
  }
  // La persona sana cumple el «normal» de la presión (< 130/85).
  expect(V.pas.anclas[2]).toBeLessThan(130);
  expect(V.pad.anclas[2]).toBeLessThan(85);
  // Osmolaridad plasmática ≈ 2 × Na + 5 en las cinco anclas.
  V.natremia.anclas.forEach((na, i) => expect(V.osmP.anclas[i], `ancla ${i}`).toBe(2 * na + 5));
});
```

Y en «los cuadros quedan cerca de lo publicado», una línea para el segundo cuadro que justifica el ancla 146:

```ts
expect(na({ adhAutonoma: -1 })).toBeLessThan(147); // diabetes insípida con agua: sodio alto-normal
```

Con los datos actuales, el primer `expect` falla en la aldosterona (es el error 1) y los demás pasan.

## El ancla de la natremia: 146 en lugar de 150

**Valoración: mantener 146 (y 297 en la osmolaridad plasmática).** Es un arreglo de vista para un límite del modelo, y el comentario del archivo lo cuenta con honradez.

Lo que consigue (valores del modelo → cifra con 150 → cifra con 146):

| Cuadro | v | Con 150 | Con 146 | En el paciente |
| --- | --- | --- | --- | --- |
| Dieta alta en sal | +0,38 | 148 | **145** | 141–143: la sal mueve el sodio entre 0,4 y 3 mmol/L (PMID 15557392) |
| Diabetes insípida con agua | +0,46 | 149 | **146** | Normal o alto-normal mientras se pueda beber |
| Caída de la filtración con sal | +0,53 | 151 | **147** | Normal: se retiene agua con la sal |
| Hiperaldosteronismo con sal | +0,57 | 151 | **148** | Normal o alto-normal |
| Deshidratación (sin acceso al agua) | +0,27 | 145 | **143** | Hipernatremia (> 145) |
| Diabetes insípida sin agua | +0,76 | 155 | **153** | Hipernatremia franca |
| SIADH | −0,53 | 129 | 129 | Mediana 127 (126–129), PMID 32879954 |

La osmolaridad plasmática cuadra con el sodio en las cinco anclas (2 × Na + 5: 245, 265, 285, 297, 325). En todas las parejas de entradas a tope, la mayor diferencia entre la osmolaridad mostrada y 2 × Na + 5 es de 8 mOsm/kg (diabetes insípida sin agua: Na ≈ 153, osmolaridad ≈ 320). Es aceptable: en la deshidratación sube también la urea.

Los tres costes:

1. **Flecha «↑↑» con un sodio casi normal.** En v = +0,5 se lee «↑↑ ≈ 146 mmol/L» y «↑↑ ≈ 295 mOsm/kg» (297 redondeado a 5), justo en el límite alto del rango normal. Ocurre en las combinaciones con sal de la tabla. La cifra es la que está más cerca del paciente; la que exagera es la flecha.
2. **La deshidratación se queda en 143.** Sin acceso al agua, con oliguria y la creatinina en ≈ 1,2, un sodio de 143 es poco creíble. Con 150 tampoco pasaba de 145. No lo arregla ningún ancla: el modelo sube más el sodio con la sal que sin agua (ver «Cambios que tocarían el modelo»).
3. **El tramo de 0 a +0,5 queda muy plano** (12 mmol/L por unidad, frente a 28 de +0,5 a +1). Entre v = +0,15 y +0,42 la flecha es «↑» y la cifra va de 142 a 145, dentro de lo normal. Es correcto para la sal y por eso se acepta.

Alternativas descartadas: 147 y 299 dan las mismas cifras redondeadas en la sal (145) y la diabetes insípida con agua (146) y empeoran el coste 1; mostrar la natremia como banda quitaría la cifra que mejor funciona (SIADH).

Pendiente si se mantiene: la tabla principal y las notas de `docs/valores-orientativos.md` siguen diciendo 150 y 305, y su «Comprobación caso a caso» da 148 y 149. Conviene una línea al principio que remita al comentario de `valores.ts`.

## Lo que he revisado y no cambia

**Datos (`valores.ts`).**

| Magnitud | Comprobación |
| --- | --- |
| Creatinina | Rango, aclaración y anclas razonables. +0,5 = 1,5 mg/dL coincide con el estadio 1 de KDIGO sobre una basal de 0,9 (PMID 33931017). La flecha «↑» da 1,1–1,5: empieza dentro de lo normal, que es justo lo que pasa con una creatinina que sube. El `minimo` (creatinina baja → «normal») es prudente, pero no llega a actuar: en ninguna entrada sola ni en ninguna pareja a tope la creatinina baja de 0,00. |
| Natremia, lado bajo | 130 en −0,5 y 120 en −1 siguen las clases de hiponatremia (PMID 41493707). SIADH ≈ 129; SIADH con sal baja ≈ 127. |
| Osmolaridad plasmática | Rango 275–295 y paso de 5. Coherente con la natremia en todos los casos. Unidad mOsm/kg con el nombre «osmolaridad»: es lo habitual en los informes; no lo tocaría. |
| Osmolaridad urinaria | Solo banda, sin intervalo: decisión acertada. Los cinco nombres se entienden y «intermedia» evita llamar «normal» a un valor cuyo normal va de 50 a 1200. |
| Diuresis | Las bandas son coherentes entre sí y con «normal 800–2000». Cuadros: deshidratación «oliguria (< 500)», SIADH «escasa (500–800)» (cuadra con una orina muy concentrada: unos 600 mOsm de solutos al día a 800 mOsm/kg son 750 mL), diabetes insípida «poliuria (> 3000)» (definición > 50 mL/kg/día, PMID 40294614). |
| Renina | «Suprimida (0,2–0,5)» y «muy suprimida (< 0,2)» no contradicen «normal 0,5–3». Cuadros: sal alta, regaliz e hiperaldosteronismo «suprimida»; hiperaldosteronismo con sal «muy suprimida»; estenosis y sal baja «alta (3–10)»; tumor de renina «muy alta (> 10)» (mediana publicada: 7,9 veces el límite superior, PMID 38438720). La aclaración es la mejor de la tabla. |
| Aldosterona, bandas | Con el normal unificado (corrección 1), coherentes. Hiperaldosteronismo y tumor de renina «muy alta (> 30)»; sal alta y regaliz «suprimida (3–5)». |
| Potasio, lado alto | 5,5 en +0,5 y 6,5 en +1. El máximo del modelo es +0,39 (≈ 5,2). |
| «muy alta durante el esfuerzo» | Correcto y prudente: los picos publicados son de 320/250 y 270/183 mmHg en prensa de piernas (PMID 3980383, PMID 8125893), y el modelo daría «≈ 170/100». |

**Vista (`main.ts`, `ficha.ts`).** «Valores orientativos: No | Sí», desactivada por defecto. La etiqueta «ORIENTATIVO» delante de la cifra, bajo el dial y en la ficha. El «≈» en todas las cifras. La descripción accesible («Orientativo: … Normal: …») y el `title` con la aclaración. La línea de la ficha («orientativo ≈ 3,3 mmol/L · normal 3,5–5,0 mmol/L (depende del laboratorio)») se lee bien también con bandas: «orientativo suprimida (0,2–0,5 ng/mL/h) · normal 0,5–3 ng/mL/h (…)».

**Flechas «=» con cifras distintas.** Con la flecha en «=», la natremia puede leerse 137 (sal baja), 139 o 141. He valorado mostrar siempre el centro mientras la flecha sea «=», y lo descarto: daría un salto de 140 a 142 (o de 120/80 a 130/85) al cruzar el umbral, y el «≈» ya avisa.

**Traducción (`motor/valores.ts`).** La interpolación es correcta y no extrapola. `formatear` redondea bien al paso y usa coma decimal (comprobado con pasos de 0,1, 1, 5, 50 y 100). El «≥ / ≤» se activa con el mismo umbral que el chip «tope de escala» (0,95). En modo banda el tope no cambia el texto, y está bien: «muy alta (> 30 ng/dL)» ya es abierto. Los cortes de las bandas coinciden con los de las flechas salvo en el punto exacto +0,15 y +0,5 (la banda usa «≤» y la flecha «<»): no tiene efecto práctico.

**Tests.** Los seis pasan. «Los cuadros quedan cerca de lo publicado» es el más valioso: avisa si una recalibración del modelo saca un cuadro de lo publicado. Con las correcciones 6 y 7 sigue pasando (potasio del hiperaldosteronismo ≈ 3,0).

## Avisos que no son de texto

| Aviso | Detalle |
| --- | --- |
| «≥» de la presión | `pintarValores` quita el signo de la diastólica: con factores de riesgo y feocromocitoma (sistólica +0,96, diastólica +0,39) se lee «≥ 180/90 mmHg», como si el «≥» valiera para las dos. La diastólica no llega al tope en ninguna pareja (máximo +0,78), así que basta con saberlo. |
| Diuresis durante la sesión | En «durante» y «después», la diuresis sigue en mL/día («escasa (500–800 mL/día)» en la sesión aeróbica vigorosa). Una hora de ejercicio no se mide en mL/día. Si molesta, la banda podría ir sin intervalo en los momentos de sesión. |
| Bandas justo al cruzar el umbral | En el hipertiroidismo, renina (+0,17) y aldosterona (+0,16) acaban de pasar a «↑» y la celda salta a «alta (3–10 ng/mL/h)» y «alta (20–30 ng/dL)». En las cifras, una flecha «↑» recién cruzada sigue dentro de lo normal (creatinina 1,1 con +0,17; potasio 4,9 con +0,27). Es el precio de las bandas; el «≈» de la corrección 5 lo suaviza. |
| Documentos que citan estos textos | `docs/diseno.md`, «Valores orientativos»: «normal < 120/80», «cifras orientativas», «≈ 3,3 mmol/L» y «suprimida (0,2–0,5 ng/mL/h)». `docs/valores-orientativos.md`: anclas de la natremia y la osmolaridad, fuente [20] y, si se aceptan, las de las correcciones 6 y 7. |
| Quién aplica las correcciones | Son cambios de datos y de cadenas: pueden ir con Sonnet 5.5 u Opus 5.5 en la sesión de la fase 6. La revisión de la natremia en el modelo, si Edu la quiere, es otra sesión y la valida él. |

## Cambios que tocarían el modelo

**Ninguno.** No propongo cambiar signos, intensidades ni relaciones, y ninguna corrección de la tabla lo necesita. Dos observaciones para una revisión aparte, si Edu la quiere:

| Observación | Qué muestra el modelo | En el paciente | Cómo queda hoy |
| --- | --- | --- | --- |
| La sal sube el sodio más que la falta de agua | Dieta alta en sal: natremia +0,38. Sin acceso al agua: +0,27 (en días, +0,29), con la volemia muy baja y oliguria | Al revés: la sal apenas mueve el sodio (PMID 15557392) y la falta de agua lo sube con claridad | El ancla 146 tapa la mitad (la sal queda en ≈ 145) y deja la otra (la deshidratación en ≈ 143). Arreglarlo pide bajar el efecto de la sal sobre la natremia o subir el de la falta de agua, y volver a pasar los casos 3, 11 y 12. Es la causa de fondo de los puntos 1 y 2 de «Qué deja a la vista la traducción» del documento de fuentes |
| Hiperaldosteronismo, regaliz y tumor de renina se quedan cortos | Hiperaldosteronismo: presión +0,26. Tumor de renina: potasio −0,24. Regaliz: potasio −0,40 | Hipertensión de grado 1–2 en el registro alemán (PMID 19190103); hipopotasemia en el 79 % de los tumores de renina (PMID 38438720) | Ya anotado en el documento de fuentes (punto 4). Las correcciones 6 y 7 lo acercan desde la vista sin tocar el modelo |

## Fuentes

Comprobadas en PubMed el 17 nov 2026 con el conector de PubMed. Todo lo citado está leído en el resumen, no en el texto completo.

**Fuentes de `docs/valores-orientativos.md` que he vuelto a comprobar (19).** Existen y dicen lo que se les atribuye, salvo la [20]:

| N.º en el documento | PMID · DOI | Comprobado |
| --- | --- | --- |
| [1] | 38616483 · [10.1016/j.ejim.2024.04.008](https://doi.org/10.1016/j.ejim.2024.04.008) | Grados 1, 2 y 3 (140–159/90–99, 160–179/100–109, ≥ 180/110) |
| [2] | 41039765 · [10.1097/HJH.0000000000004140](https://doi.org/10.1097/HJH.0000000000004140) | ESH 2023: óptima < 120/< 80, normal 120–129/80–84, normal-alta 130–139/85–89. ESC 2024: no elevada < 120/< 70 |
| [5] | 32114853 · [10.1161/HYPERTENSIONAHA.119.14063](https://doi.org/10.1161/HYPERTENSIONAHA.119.14063) | Hipopotasemia en el 15,8 %; 88,5 % de hiperaldosteronismo con K < 2,5 mmol/L |
| [6] | 33931017 · [10.1186/s12871-021-01353-2](https://doi.org/10.1186/s12871-021-01353-2) | Criterios KDIGO de creatinina |
| [9] | 41493707 · [10.1007/s12020-025-04515-1](https://doi.org/10.1007/s12020-025-04515-1) | Sodio normal 135–145; hiponatremia leve, moderada y profunda |
| [10] | 19769706 · [10.1111/j.1742-1241.2009.02103.x](https://doi.org/10.1111/j.1742-1241.2009.02103.x) | SIADH: osmolaridad urinaria > 100 mOsm/kg |
| [11] | 36683312 · [10.12659/AJCR.939034](https://doi.org/10.12659/AJCR.939034) | Rangos 275–295 y 50–1200 (un caso; el primer autor es Li JJ). El caso es una diabetes insípida con Na 149 y osmolaridad 304: cuadra con 2 × Na + 5 |
| [12] | 40294614 · [10.1016/S2213-8587(25)00053-1](https://doi.org/10.1016/S2213-8587(25)00053-1) y 30067922 · [10.1056/NEJMoa1803760](https://doi.org/10.1056/NEJMoa1803760) | Poliuria > 50 mL/kg/día con orina < 800 mOsm/kg; suero hipertónico hasta Na ≥ 150 |
| [13] | 30566641 · [10.1210/jc.2018-02195](https://doi.org/10.1210/jc.2018-02195) | Osmolaridad urinaria 879 → 384 mOsm/kg y diuresis 1,06 → 2,27 L/día |
| [14] | 15001583 · [10.1210/jc.2003-031337](https://doi.org/10.1210/jc.2003-031337) | Hipopotasemia en el 9–37 % |
| [15] | 19190103 · [10.1210/jc.2008-2116](https://doi.org/10.1210/jc.2008-2116) | 56,1 % con hipopotasemia; 164/96 y 155/93 mmHg |
| [19] | 38438720 · [10.1038/s41440-024-01606-w](https://doi.org/10.1038/s41440-024-01606-w) | Hipertensión 97,2 %, hipopotasemia 78,7 %, ARP 7,89 veces el límite superior |
| [20] | 26565948 · [10.1210/jc.2015-2840](https://doi.org/10.1210/jc.2015-2840) | **No dice lo que se le atribuye** (corrección 4) |
| [23] | 3980383 · [10.1152/jappl.1985.58.3.785](https://doi.org/10.1152/jappl.1985.58.3.785) | Picos de 320/250 mmHg en prensa de piernas |
| [24] | 8125893 · [10.1152/jappl.1993.75.6.2703](https://doi.org/10.1152/jappl.1993.75.6.2703) | Sistólica de 160 a 270 y diastólica de 91 a 183 |
| [29] | 15557392 · [10.1161/01.HYP.0000149431.79450.a2](https://doi.org/10.1161/01.HYP.0000149431.79450.a2) | La sal mueve el sodio plasmático ≈ 3 mmol/L (de 350 a 10–20 mmol/día) y 0,4 ± 0,2 mmol/L (de ≈ 170 a ≈ 100) |
| [30] | 32879954 · [10.1210/clinem/dgaa619](https://doi.org/10.1210/clinem/dgaa619) | SIADH: sodio basal 127 (126–129) |

No he vuelto a comprobar las demás ([3], [4], [7], [8], [16]–[18], [21], [22], [25]–[28], [31], [32]): no sostienen ninguna de mis correcciones.

**Fuente nueva:**

| PMID | Referencia | Qué respalda |
| --- | --- | --- |
| 36096723 | Chu T, Wu Z, Xu A. Association between preoperative hypokalemia and postoperative complications in elderly patients: a retrospective study. *BMC Geriatr* 2022;22:743. [doi:10.1186/s12877-022-03445-1](https://doi.org/10.1186/s12877-022-03445-1) | Corrección 7: hipopotasemia leve 3,0–3,5, moderada 2,5–3,0 y grave < 2,5 mmol/L (resumen). **Fuente débil:** es la clasificación que usa una cohorte en sus métodos, no una guía. Es la habitual en los manuales |

**Lo que no he podido comprobar en PubMed:** un rango de referencia de la aldosterona en sedestación (he buscado y no he encontrado ninguno con las cifras en el resumen). El «5–20 ng/dL» de la corrección 1 unifica lo que ya muestra la vista; no es un dato verificado, y sigue en la lista de «Datos de manual o de laboratorio sin comprobar» del documento de fuentes.

No cito ninguna fuente para las correcciones de redacción ni para las que solo comparan el texto con lo que muestra el simulador.
