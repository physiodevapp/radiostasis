# Revisión de los textos del hito 3e (avisos de realismo y ajustes)

Para revisar con Fable 5.2 en una sesión aparte. Los textos viven en `src/temas/hipertension/avisos.ts` (avisos) y `src/app/main.ts` (ajustes). Las reglas salen de `docs/modelo-v2.1.md`, «Avisos de realismo», y el aspecto de `docs/diseno.md`.

Público: estudiantes de fisioterapia y fisioterapeutas. Español de España. El simulador es cualitativo: cada valor es una desviación de −1 a +1 respecto a lo normal, no unidades clínicas.

## 1 · Combinación hipotética

Salta con dos o más causas raras activas o con tres o más causas no comunes (una causa cuenta como activa desde 0,15 de giro).

- En la pantalla ancha: tira bajo la cabecera con icono, título, chips y texto.
- En el móvil: la barra «Qué mirar» del pie dice «Combinación hipotética: Tumor de renina (rara), Feocromocitoma (rara)» y al tocarla la hoja muestra la banda.

| Elemento | Texto actual |
| --- | --- |
| Título | Combinación hipotética |
| Texto | Muy improbable en un paciente real. El simulador muestra la lógica de los mecanismos, no un caso clínico. |
| Chip de cada causa | «Tumor de renina · rara», «Regaliz · poco frecuente» |
| Barra del móvil | «Combinación hipotética: Tumor de renina (rara), Feocromocitoma (rara)» |

## 2 · Frecuencia en cada mando

Pastilla sobre la placa del mando. Las causas comunes no llevan.

| Causa | Frecuencia | Pastilla |
| --- | --- | --- |
| Hormonas tiroideas (hipo e hiper) | poco frecuente | poco frecuente |
| Secreción de ADH autónoma (SIADH y diabetes insípida central) | rara | rara |
| Estenosis de arteria renal | poco frecuente | poco frecuente |
| Caída de la filtración renal | poco frecuente | poco frecuente |
| Tumor secretor de renina | rara | rara |
| Hiperaldosteronismo primario | poco frecuente (desde el hito 3d) | poco frecuente |
| Feocromocitoma | rara | rara |
| Regaliz | poco frecuente | poco frecuente |

## 3 · Fuera de rango

Chip con borde discontinuo junto a una salida o un valor de analítica que llega a ±0,95. Con el modelo actual salta en la aldosterona del caso 8 (hiperaldosteronismo primario) y en la volemia del caso 11 (deshidratación).

| Elemento | Texto actual |
| --- | --- |
| Chip | fuera de rango |
| Explicación (título del chip y lector de pantalla) | Fuera del rango del modelo: el valor real sería extremo, no exacto. |

## 4 · Ajustes

| Elemento | Texto actual |
| --- | --- |
| Botón | Ajustes |
| Grupos | Tema: Retro · Clásico. Tamaño: Normal · Grande |
| Nota | Se recuerdan en este dispositivo, con el sonido. |

## Preguntas para la revisión

1. ¿Son correctas y claras las frecuencias de la tabla 2 para un público de fisioterapia? En particular, el hiperaldosteronismo primario como «poco frecuente» y el regaliz como «poco frecuente».
2. ¿Se entiende el texto de la combinación hipotética? ¿Sobra o falta algo?
3. ¿Se entiende «fuera de rango» y su explicación, sabiendo que salta en dos casos de la clase (aldosterona en el hiperaldosteronismo primario y volemia en la deshidratación)? ¿Conviene matizarlo para que no parezca un error del simulador?
4. Ortografía, estilo y registro (español de España).
