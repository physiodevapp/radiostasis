# Notas de interacción entre causas (fase 6, 17 nov 2026)

Once notas que saltan cuando dos causas activas se combinan de una forma que conviene contar. Son datos del tema (`notas` en `src/temas/hipertension/avisos.ts`) y se muestran en «Qué mirar» con borde gris azulado e icono «i»: informan, no avisan de un riesgo. Van detrás de los avisos de fármacos y ejercicio; en el móvil, la barra del pie muestra la primera si no hay otro aviso.

Una causa cuenta como activa desde 0,15, como las flechas. Las que dependen del extremo de la rueda (sal alta o baja, SIADH o diabetes insípida, hipertiroidismo) lo comprueban con `signo`.

**Revisión:** redacción revisada por Fable 5.2 (`docs/revision-fase-6-fable.md`, 17 nov 2026): retoques en siete notas, entre ellos dos límites del modelo que ahora se cuentan (con sal alta se pierde más potasio en el paciente; la restricción de agua no basta en casi la mitad de los SIADH). Las 17 fuentes, verificadas en PubMed.

## Las once notas

Valores del modelo en estado estable con las ruedas a tope (salvo donde se indica): combinación, y entre paréntesis cada causa por separado.

| # | Nota | Salta con | Qué muestra el modelo | ¿Lo reproduce? | Fuentes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Rigidez y placa se suman** | Edad + factores de riesgo | PAS +0,77 (+0,60 · +0,68), PAD −0,32 | Sí | PMID 31466622 ([doi](https://doi.org/10.1016/j.jacc.2019.07.012)); PMID 16687971 ([doi](https://doi.org/10.1111/j.1076-7460.2006.04794.x)) |
| 2 | **Hipertiroidismo con la aorta rígida** | Edad + hipertiroidismo | PAS +0,85 (+0,60 · +0,48), PAD −0,49 | Sí | PMID 18752767 ([doi](https://doi.org/10.1007/s11897-008-0026-9)); PMID 31466622 |
| 3 | **Más sensible a la sal** | Edad + sal alta | PAS +0,76 (+0,60 · +0,27): suma, sin sensibilidad añadida | No: la nota lo dice | PMID 38545804 ([doi](https://doi.org/10.1161/HYPERTENSIONAHA.123.21369)); PMID 27757935 ([doi](https://doi.org/10.1007/5584_2016_147)) |
| 4 | **Menos sed con la edad** | Edad + acceso al agua bajo | Desde el 17 nov 2026 (relación 121): natremia +0,55 (sin edad, +0,27); con acceso −0,5, +0,19 (sin edad, +0,11). La sed no baja (+0,69 frente a +0,57): la nota lo dice | Sí, por la natremia; la sed, no | PMID 11528342 ([doi](https://doi.org/10.1097/00005768-200109000-00016)); PMID 9050029 ([doi](https://doi.org/10.1093/ndt/11.supp9.9)); PMID 6472364 ([doi](https://doi.org/10.1056/NEJM198409203111202)) |
| 5 | **Estenosis aterosclerótica** | Estenosis + edad o factores | Sin afirmación sobre el modelo (dato clínico: causa, bilateralidad, sospecha) | No aplica | PMID 29094913; PMID 16251847 ([doi](https://doi.org/10.1097/01.hjh.0000192096.83302.02)) |
| 6 | **Aldosterona y sal se potencian** | Sal alta + hiperaldosteronismo o regaliz | Hiperaldo: PAS +0,64 (+0,26 · +0,27), volemia +0,56 (+0,21 · +0,21). Regaliz: PAS +0,57 | Sí | PMID 36945842 ([doi](https://doi.org/10.1111/joim.13618)); PMID 20706195 ([doi](https://doi.org/10.1038/ajh.2010.169)) |
| 7 | **Con poca sal, menos efecto** | Sal baja + hiperaldosteronismo o regaliz | PAS +0,05 (hiperaldo solo, +0,26); potasio −0,51 (solo, −0,50) | La presión sí; el potasio no: la nota lo dice | PMID 31863347 ([doi](https://doi.org/10.1007/s42000-019-00167-9)); PMID 37089096 (en chino, resumen en inglés) |
| 8 | **Riñón enfermo, presión sensible a la sal** | Caída de la filtración + sal alta | PAS +0,66 (+0,38 · +0,27), volemia +0,52 (+0,21 · +0,21) | Sí | PMID 32635265 ([doi](https://doi.org/10.3390/ijms21134744)) |
| 9 | **La sed compensa la diabetes insípida** | Diabetes insípida + acceso al agua bajo | Con agua: natremia +0,46, creatinina +0,06. Sin agua: natremia +0,76, volemia −1,00, creatinina +0,30 | Sí | PMID 35771962 ([doi](https://doi.org/10.1210/clinem/dgac381)) |
| 10 | **Restringir el agua en el SIADH** | SIADH + acceso al agua bajo | Natremia −0,53 → −0,38 (agua −0,3) → −0,25 (−0,5); sin agua, volemia −0,84 | Sí | PMID 39009016 ([doi](https://doi.org/10.1093/ndt/gfae162)); PMID 30855321 ([doi](https://doi.org/10.1097/MCC.0000000000000589)) |
| 11 | **Poca sal empeora el SIADH** | SIADH + sal baja | Natremia −0,66 (SIADH solo, −0,53) | Sí | PMID 39009016 |

Los textos completos están en `avisos.ts`. `tests/notas.test.ts` comprueba que cada nota salta con su pareja (y no con una sola causa ni con el extremo contrario) y que el modelo sigue mostrando lo que cuenta cada una: si una recalibración lo cambia, el test falla y hay que reescribir la nota.

## Parejas que se quedaron fuera

| Pareja | Motivo |
| --- | --- |
| Hiperaldosteronismo + caída de la filtración (el potasio bajo queda enmascarado) | El modelo lo reproduce (potasio −0,18), pero no encontré en PubMed una fuente que lo diga de forma directa, y la combinación es poco habitual como caso docente. Se puede añadir si Edu tiene una fuente |
| Feocromocitoma + hipertiroidismo | Combinación muy improbable, y el modelo da una diastólica más baja que con el feocromocitoma solo (la vasodilatación del tiroides contrarresta): enseñaría algo confuso |

## Cambios del modelo que estas notas sugieren (decide Edu)

No se ha cambiado nada del modelo. Dos notas cuentan límites que una relación nueva podría resolver:

| Nota | Posible cambio | Efecto |
| --- | --- | --- |
| 3 · Más sensible a la sal | Relación de la edad que refuerce el efecto de la sal sobre la retención de sodio (tipo `modula`) | La misma sal subiría más la presión en la persona mayor |
| ~~4 · Menos sed con la edad~~ | Hecho el 17 nov 2026 con otra forma: relación 121, la edad refuerza la falta de agua (67 y 68) | Con la misma falta de agua, la natremia sube más en la persona mayor |

Cualquiera de los dos obligaría a revisar los casos 1 y 12 y los tests de la fase 5 (entrenamiento con la edad en tope).

### Prueba del 17 nov 2026 (en una copia, sin cambiar el modelo)

| Cambio probado | Resultado | Por qué no vale así |
| --- | --- | --- |
| Edad → sed, negativa y débil (`suma`) | Falla el caso 1: con agua libre la volemia baja (−0,13) y la sistólica pasa de 0,60 a 0,52. Sin agua, la natremia sale igual (+0,27) | La sed baja siempre, no solo cuando falta agua, y no enseña que la persona mayor se deshidrate antes |
| La edad modula la relación 7 (sal → osmolaridad) | Pasan los 33 casos; con edad y sal la sistólica pasa de 0,76 a 0,84 | La sal solo entra por la osmolaridad: el refuerzo dispara la natremia (+0,72, ↑↑) y con sal baja la hunde (−0,27). La persona mayor sensible a la sal retiene sal y agua juntas, sin sodio alto |

**Decisión (Edu, 17 nov 2026):** dejarlo anotado. **Resuelto en parte el mismo día** (revisión del nodo edad, `docs/modelo-v2.1.md`): la nota 4 pasa a reproducirse con la relación 121 (la edad refuerza la falta de agua, solo con déficit). Atenuar la sed y empeorar la natriuresis se probaron y no se ven en el modelo; la nota 3 sigue contando su límite. Hacerlo bien pide cambios de estructura, para una revisión futura del nodo edad: que la edad atenúe la respuesta de la sed solo con déficit de agua (el motor aún no sabe atenuar con `modula`) y que empeore la eliminación renal de sodio (natriuresis por presión), no la osmolaridad. Las dos cosas obligan a recalibrar la edad, que ya está en tope de escala con la rigidez.
