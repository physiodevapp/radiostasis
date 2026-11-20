# Fase 5 · Ejercicio agudo y crónico (propuesta, 16 nov 2026)

**Aprobada por Edu el 16 nov 2026** («adelante con tus recomendaciones»: opción A, cambios del modelo con la relación 110 y tres ruedas de entrenamiento). Lo construido y los ajustes de la calibración están en `docs/modelo-v2.1.md` («Cambios de la fase 5»); allí las relaciones quedan numeradas de la 94 a la 115. Este documento se conserva como propuesta original.

## Alcance

| Bloque | Qué enseña | Escala de tiempo |
| --- | --- | --- |
| **Sesión aeróbica** (andar rápido, bici, correr) | Simpático y frecuencia ↑↑, gasto ↑↑, vasodilatación del músculo (RVP ↓), sistólica ↑↑ y diastólica = o ↓ | Minutos, **sobre el estado estable del paciente** |
| **Sesión de fuerza** (pesas, isométrico) | La RVP sube por la compresión del músculo y la maniobra de Valsalva: sube también la diastólica | Ídem |
| **Al terminar** (1–2 h) | Hipotensión postejercicio: vasodilatación por histamina H1/H2 y barorreflejo reajustado a la baja | Ídem |
| **Entrenamiento** aeróbico, de fuerza dinámica e isométrico (meses) | Bajan la presión de reposo, el simpático y la RVP; bradicardia de reposo con gasto normal; mejora endotelial; algo menos de rigidez (solo aeróbico) | Estado estable (en Minutos y Días no actúa, como la edad) |

### Cómo encaja con las escalas de tiempo

Una sesión dura minutos, pero el paciente que la hace ya tiene su hipertensión establecida. Por eso la sesión **no usa el interruptor de tiempo**. El motor calcula primero el estado estable del paciente (causas, fármacos y entrenamiento) y después, sobre él, la respuesta de la sesión. En esa respuesta solo actúan las relaciones de minutos. Las lentas (volemia, rigidez, placa) se quedan en su valor de reposo. Mientras haya sesión, el interruptor se atenúa con la nota «La sesión se ve sobre el estado estable».

Si no se hace así, en «Minutos» la edad y los factores de riesgo no tienen rigidez, y la sesión de un paciente mayor saldría igual que la de uno joven.

Hacen falta tres mandos de sesión y entrenamiento y un selector del momento («Antes · Durante · Al terminar»).

## Casos nuevos (tests)

Las flechas se comparan con lo normal, como siempre. En la sesión, además, se compara con «Antes» (el mismo paciente en reposo).

| Caso | Esperado |
| --- | --- |
| 25 · Persona sana, sesión aeróbica moderada | PAS ↑↑, PAD =, RVP ↓, FC ↑↑, GC ↑↑ |
| 26 · Ídem con betabloqueante | FC ↑ (no ↑↑): se prescribe por la escala de Borg, no por la frecuencia diana |
| 27 · Persona sana, fuerza intensa | PAS ↑↑, PAD ↑↑ |
| 28 · Dieta alta en sal, al terminar | PAS y PAD bajan respecto a «Antes» (de ↑ a = o ↑) |
| 29 · Ídem con alfabloqueante | Bajan más que en el caso 28 |
| 30 · Dieta alta en sal + entrenamiento aeróbico | PAS y PAD bajan un escalón respecto al caso 3 |
| 31 · Persona sana + entrenamiento aeróbico | PAS = o ↓ leve, FC ↓, GC = |
| 32 · Feocromocitoma, sesión | Simpático en tope de escala (aviso) |
| 33 · Hipertiroidismo, sesión | FC en tope de escala (aviso) |

## Avisos de interacción (datos del tema)

| Situación | Aviso | Fuente |
| --- | --- | --- |
| Betabloqueante y sesión | La frecuencia sube menos: dosifica con la escala de Borg | PMID 8776008, 14555886 |
| Alfabloqueante y «Al terminar» | Riesgo de hipotensión al levantarse: vuelta a la calma larga y sin cambios bruscos de postura | PMID 34752479 (ortostática; sin datos con ejercicio) |
| Diurético o acceso al agua bajo, y sesión | Riesgo de deshidratación y golpe de calor: hidratación y evitar el calor | PMID 14715036 |
| Feocromocitoma y sesión | No hacer ejercicio intenso hasta tratarlo | PMID 426471, 20960160 (casos clínicos) |
| Hipertiroidismo y sesión vigorosa | Taquicardia y poca tolerancia: esperar a controlarlo | PMID 8549218, 1752962 |
| Sesión de fuerza intensa | Evitar la maniobra de Valsalva: la presión puede pasar de 300/200 | PMID 3980383 |

**Sin verificar todavía** (no salen en los resúmenes de PubMed; hay que leer el texto completo de Pescatello 2004, Fletcher 2013 y la guía ESC 2024): las cifras de presión de reposo a partir de las cuales no se hace ejercicio intenso, los criterios para parar la sesión y la pauta de 150 min a la semana más fuerza 2–3 días.

## Cambios del modelo (para el visto bueno)

Ninguna relación existente cambia. Todo es nuevo.

### Nodos y motor

| Cambio | Antes | Después | Motivo |
| --- | --- | --- | --- |
| Nodos E1–E5 (tipo `ejercicio`, rueda 0–1) | — | Sesión aeróbica, sesión de fuerza, entrenamiento aeróbico, de fuerza e isométrico | Modificadores con su propia rueda, como los fármacos |
| Campo `momento` en las relaciones | — | `durante` o `despues` | Las relaciones de la sesión solo actúan en su momento |
| Cálculo de la sesión | — | Estado estable de base, y encima la respuesta de minutos con las relaciones lentas congeladas en su valor de reposo | Que la sesión de un paciente mayor tenga su rigidez |
| Barorreflejo (65) en la sesión | No actúa en estado estable | Actúa sobre el cambio respecto a «Antes» (reajustado al nivel del paciente) | Es lo que limita la subida de presión en el esfuerzo y la hipotensión al terminar |

### Relaciones nuevas

| # | Relación | Antes | Después (de partida) | Motivo | Fuente |
| --- | --- | --- | --- | --- | --- |
| 94 | Sesión aeróbica → Simpático, durante | — | +0,8 | Orden central y metaborreflejo | Fisiología |
| 95 | Sesión aeróbica → FC, durante | — | +0,9 | Retirada vagal: el betabloqueante no la bloquea, y por eso la FC aún sube algo | Fisiología; PMID 14555886 |
| 96 | Sesión aeróbica → Gasto cardíaco, durante | — | +0,5 | Bomba muscular y retorno venoso | Fisiología |
| 97 | Sesión aeróbica → RVP, durante | — | −1,2 | Vasodilatación metabólica del músculo que vence al simpático (simpaticolisis funcional) | PMID 25834232 |
| 98 | Sesión aeróbica → Perfusión renal, durante | — | −0,4 | Vasoconstricción renal: la sangre va al músculo | Fisiología |
| 99 | Sesión aeróbica bloquea la 65, durante | — | 70 % | El barorreflejo se reajusta al alza en el esfuerzo | Fisiología |
| 100 | Sesión de fuerza → Simpático, durante | — | +0,8 | Orden central y metaborreflejo | Fisiología |
| 101 | Sesión de fuerza → FC, durante | — | +0,45 | Menor que en la aeróbica | Fisiología |
| 102 | Sesión de fuerza → RVP, durante | — | +0,5 | Compresión mecánica y Valsalva: sube la diastólica | PMID 3980383 |
| 103 | Sesión aeróbica → RVP, al terminar | — | −0,3 | Vasodilatación sostenida por histamina H1 y H2 | PMID 22872658 |
| 104 | Sesión aeróbica → Simpático, al terminar | — | −0,2 | Barorreflejo reajustado a la baja | PMID 22872658, 15076798 |
| 105 | Entrenamiento → Simpático, estable | — | −0,25 | Baja la actividad simpática muscular de los hipertensos | PMID 17438307 |
| 106 | Entrenamiento → FC, estable | — | −0,35 | Bradicardia de reposo, intrínseca del nódulo sinusal | PMID 24825544 (animales) |
| 107 | Entrenamiento → Contractilidad, estable | — | +0,45 | Volumen sistólico mayor: el gasto de reposo no baja | PMID 2000315 (fuente débil) |
| 108 | Entrenamiento aeróbico → Rigidez, estable | — | −0,15 | VOP −0,63 m/s; la fuerza no la cambia | PMID 25333969 |
| 109 | Entrenamiento bloquea la 72 (factores → RVP) | — | 50 % | Mejora endotelial dependiente del óxido nítrico | PMID 10484540 |
| 110 | Entrenamiento bloquea la 71 (volemia → RVP) | — | 50 % | **Decisión de Edu.** Hace que baje más la presión de quien la tiene alta (−8,3/−5,2 mmHg en hipertensos y −0,8/−1,1 en normotensos) | PMID 23525435 |

Pesos por tipo de entrenamiento (de 0 a 1 sobre las relaciones 105–110): isométrico 1, aeróbico y fuerza 0,55 (en Edwards 2023, PAS −8,2 con isométrico frente a −4,5 con aeróbico o fuerza; PMID 37491419). Solo el aeróbico actúa sobre la rigidez.

### Lo que dio el prototipo

- La sesión aeróbica sale como se espera: en la persona sana, PAS +0,75 ↑↑, PAD −0,10 =, RVP ↓↓ y FC ↑↑. Con betabloqueante a dosis media, la FC queda en ↑.
- La sesión de fuerza sube la PAD a ↑↑.
- Sin la relación 107, el entrenamiento bajaba el gasto de reposo (↓↓) y la sistólica de la persona sana (↓↓). Con la 107 y los bloqueos 109–110, el efecto ya es mayor en la persona con sal que en la sana, pero la sana sigue bajando demasiado. Se ajusta en la calibración.
- La hipotensión al terminar sale demasiado fuerte en la persona sana. También se ajusta.

### Límites previstos

- Edad con rigidez (caso 1): el entrenamiento casi no baja la sistólica, porque la rigidez está en tope de escala. Se contará en la ficha.
- El calor no es un mando. La deshidratación se ve con el mando de acceso al agua y el aviso.
- Ni el potasio ni el lactato del esfuerzo entran en el modelo.

## Interfaz

**Opción A (recomendada):** una tercera pestaña, «Causas · Fármacos · Ejercicio». Lleva mandos de cobre, una sección «Sesión» con el selector «Antes · Durante · Al terminar» y la sesión aeróbica y de fuerza, y una sección «Entrenamiento» con los mandos aeróbico, de fuerza e isométrico. Incluye un botón «Sin ejercicio». En la cabecera hay un chip («🏃 Aeróbico moderado · durante») y el interruptor de tiempo se atenúa. En el móvil, cinco pestañas en la barra.

**Opción B:** dos mandos, «Sesión» y «Entrenamiento», cada uno con un selector de tipo debajo, y la línea «Reposo — Durante — Al terminar» encima de los vasos. Tiene menos mandos, pero la línea quita alto al tablero y empuja la analítica.

Idea para las dos: durante la sesión, el dial muestra una aguja tenue con el valor de «Antes».

## Fichas

Las fichas de los nodos E1–E5 llevarán «En la consulta de fisioterapia», con la dosificación, las señales para parar y cuándo no hacer ejercicio intenso. Se redactan en esta sesión y se revisan con Fable 5.2 en una sesión aparte.
