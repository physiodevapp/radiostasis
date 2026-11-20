# Simulador de hipertensión — Fase 1: modelo fisiológico (v2.1)

13 nov 2026 · @Edu · v2: integra la revisión de Fable 5.2 (fase 1b) · v2.1: frecuencia de las causas y avisos de realismo

## Resumen

El modelo de hipertensión tiene **12 ruedas de causa, 17 mecanismos, 6 salidas y 8 valores de analítica**, unidos por 73 relaciones con signo. Es cualitativo: cada valor es una desviación respecto a lo normal (de −1 a +1), no mmHg ni mmol/L.

La v2 corrige los fallos que encontró la revisión al simular el modelo: el caso de deshidratación daba cero en todo, la renina no bajaba en el hiperaldosteronismo ni con el regaliz, y el modo agudo no podía producir varios resultados. La tabla de casos es la batería de tests de la fase 3: el ajuste fino de intensidades hasta que cuadren los 12 casos se hace allí, con el motor ya programado.

Cada relación cita los artículos de PubMed que la respaldan (PMID; detalle, citas y frases en `docs/fuentes.md`). La sección «Cambios de la v2» resume qué cambió y por qué.

## Cambios de la v2

| Cambio | Qué | Motivo |
| --- | --- | --- |
| Nuevas 67 y 68 | Acceso al agua → Volemia y → Osmolaridad | Sin ellas, quitar el agua no cambiaba nada (caso 11) |
| Nueva 69 | Volemia → Renina (−) | La renina no bajaba en los casos 8 y 10 |
| 27 y 28 asimétricas | Por debajo de 0, la angiotensina II resta poco | Una renina suprimida anulaba la hipertensión de los casos 8 y 10 |
| Nueva 70, 39 a débil | Presión arterial media → Reabsorción de Na (−) | La natriuresis por presión es tubular; vía TFG bajaba la creatinina de forma artificial |
| Nueva 71 | Volemia → RVP (+, crónica) | Autorregulación a largo plazo: el gasto vuelve a lo normal y la RVP sostiene la hipertensión |
| 6 eliminada, nueva 72 | Factores de riesgo → RVP en lugar de Placa → RVP | La placa de una arteria de conducción no estrecha las arteriolas (D2) |
| Nueva 73 | Potasio → Aldosterona (+) | Segundo regulador principal de la aldosterona |
| Nueva 74 | Angiotensina II → TFG (+, débil) | Arteriola eferente; necesaria para enseñar el IECA en la estenosis bilateral (fase 4) |
| 45 y 66 con umbral | Creatinina y potasio solo cambian si la TFG cae por debajo de −0,3 | Evita falsos cambios con hiperfiltración; apoya D6 |
| Intensidades | 7 → moderada · 23 → fuerte · 24 → débil | Casos 3, 9 y 2 |
| 46 | Sin fármaco | Alfa y betabloqueantes actúan sobre los receptores (23, 51–53), no sobre el tumor |
| Nodo derivado | Presión arterial media (S6) = PAD + ⅓(PAS − PAD) | La usaban las relaciones 39, 65 y la vista sin estar definida |
| O6 | Tres escalas de tiempo: minutos · días · estado estable | El modo agudo dejaba sin entradas a la volemia y a casi todas las causas |
| Rueda C7 | Renombrada «Caída de la filtración renal» | Los cálculos son una obstrucción posrenal, no daño glomerular |
| Tabla de casos | Corregidos los casos 1, 3–10 y 12 | Ver la tabla y la nota sobre la diuresis |
| v2.1: frecuencia y avisos | Cada causa lleva su frecuencia; reglas de aviso para combinaciones irreales y saturación | Las ruedas se giran por separado y permiten pacientes que no existen |

Aplazadas a la fase 4: Angiotensina II → Renina (−, débil; asa corta) y Simpático → RVP por β2 (−, débil; explica por qué un betabloqueante solo empeora el feocromocitoma).

## Esquema genérico del modelo

Cada tema (hipertensión, natremia, insuficiencia cardíaca…) es un archivo de datos con seis partes. El motor y las ruedas son comunes; solo cambian los datos y la vista.

### Nodo

| Campo | Contenido | Ejemplo |
| --- | --- | --- |
| id | Identificador corto | `adh` |
| nombre | Texto visible | ADH (vasopresina) |
| tipo | `causa` (la mueves tú), `mecanismo` (se mueve solo), `salida`, `analitica` | mecanismo |
| calculo | `suma` (lo normal) · `acumulador` (integra entradas menos salidas en el tiempo: volemia) · `derivado` (fórmula de otros nodos: PAM) | suma |
| rango | De −1 a +1; 0 = normal. Algunas causas van de 0 a +1 (no existe un tumor «negativo») | −1 a +1 |
| etiquetas | Texto de los extremos de la rueda | «Diabetes insípida» / «SIADH» |
| explicacion | Una o dos frases que se ven al tocar el nodo | Hormona del hipotálamo que… |
| frecuencia | Solo causas: `comun` · `poco_frecuente` · `rara`, según se ve en la práctica clínica. Alimenta los avisos de realismo. Si cambia con el extremo de la rueda, `frecuenciaExtremos` (lado mínimo, lado máximo) | rara |

### Relación

| Campo | Contenido |
| --- | --- |
| origen → destino | Ids de los dos nodos |
| signo | `+` (mismo sentido) o `−` (sentido contrario) |
| intensidad | débil (0,3) · moderada (0,6) · fuerte (1,0) |
| intensidad_negativa | Opcional. Intensidad cuando el origen está por debajo de 0, si difiere (relaciones 27 y 28) |
| umbral | Opcional. El efecto solo empieza cuando el origen pasa de ese valor (relaciones 45 y 66: TFG < −0,3) |
| tiempo | `minutos` · `dias` · `estable` (la escala más corta en la que la relación ya actúa) |
| tipo | `suma` (lo normal) · `modula` (multiplica: el acceso al agua escala el efecto de la sed) · `fija` (anula el valor del destino: SIADH, diabetes insípida) |
| bloqueable | Fármacos que la cortan, para la fase 4 (IECA, ARA-II, betabloqueante…) |
| explicacion | Una frase: el porqué fisiológico. De aquí saldrán las fichas de estudio |
| fuente | «PubMed» (artículos en `pmid`; ver `docs/fuentes.md`) |

### Modificador (fases 4 y 5)

Un fármaco o el ejercicio. Puede bloquear relaciones, mover un nodo o imitarlo (un diurético tiazídico baja la reabsorción de Na). Tiene su propia rueda de dosis o intensidad.

### Caso

Nombre, valores de las ruedas de causa, resultados esperados (flecha por nodo) y texto explicativo. Sirve a la vez para los botones de casos, el modo reto y los tests del motor.

### Aviso

Regla que muestra un mensaje cuando el estado del simulador deja de representar a un paciente real. Tiene condición, texto y si bloquea el modo reto. Ver «Avisos de realismo».

### Vista

Asigna nodos a propiedades visuales del dibujo del tema (ver la sección del vaso). Es la única parte que se programa a mano para cada tema.

### Cómo calcula el motor (para la fase 3)

- Cada nodo de tipo `suma` toma la suma de sus entradas × intensidad, suavizada con tanh para que no pase de ±1. Como hay bucles de retroalimentación, el motor itera con amortiguación hasta que todo se estabiliza.
- La volemia es un **acumulador**: cambia según lo que entra (sed, acceso al agua) menos lo que sale (diuresis), no de golpe. Así los estados estables salen correctos.
- **Tres escalas de tiempo**, con un interruptor de tres posiciones:

| Escala | Relaciones activas | Qué enseña |
| --- | --- | --- |
| Minutos | Solo `minutos` | Reflejos: barorreflejo, ADH, simpático |
| Días | `minutos` + `dias` | Fase de retención: volemia, aldosterona, oliguria |
| Estado estable | Todas menos el barorreflejo (65) | Lo que ves en un paciente con hipertensión mantenida |

- **Umbrales de las flechas**, también para los tests: «=» si |valor| < 0,15 · ↑ o ↓ entre 0,15 y 0,5 · ↑↑ o ↓↓ desde 0,5. Los tests comparan signo y magnitud con esa tolerancia.

## Nodos de la hipertensión

### Causas: 12 ruedas que mueves tú

| Id | Rueda | Rango y extremos | Frecuencia |
| --- | --- | --- | --- |
| C1 | Edad | 0 joven → +1 mayor | Común |
| C2 | Factores de riesgo vascular (tabaco, LDL, diabetes, obesidad, sedentarismo) | 0 → +1 | Común |
| C3 | Ingesta de sal | −1 baja → +1 alta | Común |
| C4 | Hormonas tiroideas (T3/T4) | −1 hipotiroidismo → +1 hipertiroidismo | Poco frecuente |
| C5 | Secreción de ADH autónoma | −1 diabetes insípida central → +1 SIADH | Diabetes insípida: rara · SIADH: poco frecuente (hito 3e; antes «rara» en los dos) |
| C6 | Estenosis de arteria renal | 0 → +1 | Poco frecuente |
| C7 | Caída de la filtración renal (glomerulonefritis, cálculos) | 0 → +1 | Poco frecuente |
| C8 | Tumor secretor de renina | 0 → +1 | Rara |
| C9 | Hiperaldosteronismo primario | 0 → +1 | Poco frecuente (antes «rara»; ver «Cambios del hito 3d») |
| C10 | Feocromocitoma | 0 → +1 | Rara |
| C11 | Regaliz (ácido glicirrícico) | 0 → +1 | Poco frecuente |
| C12 | Acceso al agua | −1 nulo → 0 libre | Común |

C4 cuenta como poco frecuente en ambos extremos (hipo e hipertiroidismo). C5 tiene una frecuencia en cada extremo (revisión de Fable 5.2, hito 3e): la diabetes insípida central es rara; el SIADH, poco frecuente, porque es la causa más frecuente de hiponatremia hipotónica (PMID 36974717). Como comparten mando, no pueden activarse a la vez. La frecuencia mide **con qué frecuencia se ve en la práctica clínica**, con el mismo criterio para las doce causas.

La explicación de C7 aclara que son dos mecanismos distintos: daño de la membrana (glomerulonefritis) y obstrucción de la salida de la orina, que sube la presión en la cápsula de Bowman (cálculos). Los dos bajan la TFG. La hiperproteinemia se quitó el 20 nov 2026 (validado por Edu): no hay respaldo en PubMed para ella como causa de caída de la filtración.

### Mecanismos: 17 ruedas que se mueven solas

| Id | Rueda | Qué representa |
| --- | --- | --- |
| M1 | Osmolaridad plasmática | Concentración de solutos; la detectan los osmorreceptores |
| M2 | ADH (vasopresina) | Secreción hipotalámica |
| M3 | Sed | Centro de la sed del hipotálamo |
| M4 | Renina | Liberada por el aparato yuxtaglomerular |
| M5 | Angiotensina II | Producto activo del sistema |
| M6 | Aldosterona | Secreción suprarrenal |
| M7 | Actividad mineralocorticoide | Activación del receptor renal, por aldosterona o por cortisol (regaliz) |
| M8 | Actividad simpática | Tónica simpática y catecolaminas circulantes |
| M9 | Perfusión renal | Presión en la arteriola aferente |
| M10 | Tasa de filtración glomerular (TFG) | Filtración de ambos riñones |
| M11 | Reabsorción tubular de Na | Túbulo proximal, distal y colector |
| M12 | Reabsorción de agua | Acuaporinas del colector |
| M13 | Diuresis | Volumen de orina; también se ve en la analítica |
| M14 | Frecuencia cardíaca | |
| M15 | Contractilidad | Fuerza de contracción del miocardio |
| M16 | Rigidez arterial | Pérdida de distensibilidad de la pared |
| M17 | Placa de ateroma | Engrosamiento de la pared; en la v2 solo actúa a través de la rigidez |

### Salidas: 6 indicadores

| Id | Indicador | Cálculo | Qué lo determina en el modelo |
| --- | --- | --- | --- |
| S1 | Volemia | Acumulador | Agua que entra menos agua que sale |
| S2 | Gasto cardíaco (GC) | Suma | Frecuencia × volumen sistólico (contractilidad y precarga por volemia) |
| S3 | Resistencia vascular periférica (RVP) | Suma | Vasoconstricción, vasodilatación y autorregulación de las arteriolas |
| S4 | Presión sistólica (PAS) | Suma | GC, rigidez y RVP |
| S5 | Presión diastólica (PAD) | Suma | RVP sobre todo; baja con la rigidez |
| S6 | Presión arterial media (PAM) | Derivado | PAD + ⅓(PAS − PAD) |

### Analítica: panel de 8 valores

Cuatro son nodos propios (creatinina, natremia, osmolaridad urinaria y potasio) y cuatro reflejan mecanismos (osmolaridad plasmática, diuresis, renina y aldosterona).

| Id | Valor | Qué lo mueve |
| --- | --- | --- |
| A1 | Creatinina plasmática | Sube cuando la TFG baja de forma apreciable |
| A2 | Natremia | Sigue a la osmolaridad plasmática |
| A3 | Osmolaridad urinaria | Sube con la reabsorción de agua |
| A4 | Potasio plasmático | Baja con la actividad mineralocorticoide; sube si la TFG cae mucho |

## Relaciones

73 relaciones activas en 7 grupos (la 6 queda eliminada; las nuevas, de la 67 a la 74, van en su grupo). Signo `+` = el destino se mueve en el mismo sentido que el origen. Tiempo = la escala más corta en la que la relación ya actúa. PMID = artículos de PubMed que respaldan la relación (citas, comprobación y frases en `docs/fuentes.md`). La columna Fármaco prepara la fase 4.

### Vasos y edad

| # | Relación | Signo | Intensidad | Tiempo | Fármaco | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Edad → Rigidez arterial | + | Moderada | Estable | — | 9236450, 15731494 | Las arterias pierden distensibilidad con los años |
| 2 | Edad → Placa de ateroma | + | Débil | Estable | — | 22773427 | La edad cuenta por sí misma: más años de exposición a los factores de riesgo y envejecimiento de las células de la pared |
| 3 | Factores de riesgo → Placa de ateroma | + | Fuerte | Estable | — | 31420554, 9887164 | Daño endotelial y LDL: inflamación, células espumosas, fibrosis |
| 4 | Factores de riesgo → Rigidez arterial | + | Moderada | Estable | — | 15731494, 18239908, 19884567 | Aceleran la rigidez propia de la edad |
| 5 | Placa de ateroma → Rigidez arterial | + | Moderada | Estable | — | 24175067, 15731494 | La pared engrosada y fibrosa se distiende menos |
| ~~6~~ | ~~Placa de ateroma → RVP~~ | | | | | | Eliminada en la v2: la sustituye la 72 (D2) |
| 72 | Factores de riesgo → RVP | + | Débil | Estable | — | 11238267, 12588755 | Disfunción endotelial y remodelado de las arteriolas, donde está la resistencia |

La relación 4 conserva aquí la intensidad de partida. El 19 nov 2026 se bajó a 0,3 por las fuentes (`docs/calibracion.md`): fuera de la edad y la presión, los factores de riesgo apenas se asocian a la rigidez aórtica.

### Sal, agua y ADH

| # | Relación | Signo | Intensidad | Tiempo | Fármaco | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 7 | Sal → Osmolaridad plasmática | + | Moderada | Minutos | — | 15557392 | El Na ingerido concentra el medio interno |
| 8 | Osmolaridad → ADH | + | Fuerte | Minutos | — | 18509340, 4750450 | Osmorreceptores → hipotálamo |
| 9 | Osmolaridad → Sed | + | Fuerte | Minutos | — | 14739394 | Los mismos osmorreceptores activan el centro de la sed |
| 10 | ADH autónoma → ADH | fija | — | — | — | 17507705, 31395885, 36974717, 38693275 | Fuera de 0, la ADH ignora sus estímulos (SIADH o diabetes insípida) |
| 11 | ADH → Reabsorción de agua | + | Fuerte | Minutos | Vaptanes | 11773613 | Inserta acuaporinas en el colector |
| 12 | ADH → RVP | + | Débil | Minutos | — | 11555538, 23073632 | Vasoconstricción V1, relevante solo con niveles altos |
| 13 | Sed → Volemia | + | Moderada | Días | — | 18843231, 14739394 | Beber repone volumen |
| 14 | Sed → Osmolaridad plasmática | − | Moderada | Días | — | 2669525, 14739394 | El agua bebida diluye |
| 15 | Acceso al agua ⊗ relaciones 13 y 14 | modula | — | — | — | 12152926, 14739394, 20646222 | Sin acceso al agua, la sed no se traduce en ingesta |
| 67 | Acceso al agua → Volemia | + | Fuerte | Días | — | 20646222, 4750450 | Sin ingesta basal se pierde volumen (respiración, sudor, orina obligada) |
| 68 | Acceso al agua → Osmolaridad plasmática | − | Moderada | Días | — | 4750450, 20646222 | Sin agua, el medio interno se concentra |
| 16 | Reabsorción de agua → Diuresis | − | Fuerte | Minutos | — | 11773613, 31395885 | Menos agua en la orina |
| 17 | Reabsorción de agua → Osmolaridad plasmática | − | Moderada | Días | — | 23817822, 17507705 | Se recupera agua sin solutos: diluye |
| 18 | Reabsorción de agua → Osmolaridad urinaria | + | Fuerte | Minutos | — | 11773613, 31395885 | La orina se concentra |
| 19 | Diuresis → Volemia | − | Fuerte | Días | — | 2063193 | Lo que se orina sale del volumen |
| 20 | Osmolaridad plasmática → Natremia | + | Fuerte | Minutos | — | 35779183, 27156756 | El Na es el principal soluto del plasma |

### Sistema renina-angiotensina-aldosterona

| # | Relación | Signo | Intensidad | Tiempo | Fármaco | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 21 | Perfusión renal → Renina | − | Fuerte | Minutos | — | 24944035, 20360309 | Barorreceptor de la arteriola aferente |
| 22 | TFG → Renina | − | Moderada | Minutos | — | 20360309 | Mácula densa: llega menos NaCl |
| 69 | Volemia → Renina | − | Moderada | Días | — | 24944035, 20360309 | Con volumen alto llega más NaCl a la mácula densa y baja el tono simpático renal |
| 23 | Simpático → Renina | + | Fuerte | Minutos | Betabloqueante | 20360309 | Receptores β1 yuxtaglomerulares |
| 24 | Hormonas tiroideas → Renina | + | Débil | Días | — | 14594573, 11172193, 16452532, 7040892 | Más respuesta de los receptores β, que en el riñón liberan renina; el sistema renina-angiotensina queda más activo (D5) |
| 25 | Tumor de renina → Renina | + | Fuerte | Estable | — | 38438720 | Secreción autónoma |
| 26 | Renina → Angiotensina II | + | Fuerte | Minutos | IECA, aliskireno | 17970613 | Cascada angiotensinógeno → I → II |
| 27 | Angiotensina II → RVP | + | Fuerte (débil por debajo de 0) | Minutos | ARA-II | 17970613 | Vasoconstricción generalizada; su ausencia vasodilata poco |
| 28 | Angiotensina II → Aldosterona | + | Fuerte (moderada por debajo de 0) | Días | ARA-II | 10619573, 17970613 | Estimula la corteza suprarrenal |
| 73 | Potasio → Aldosterona | + | Moderada | Días | — | 1167307, 15044681 | El K alto estimula la aldosterona directamente |
| 29 | Angiotensina II → Reabsorción de Na | + | Moderada | Días | ARA-II | 12642017, 17878513 | Transportadores de Na en el túbulo |
| 30 | Angiotensina II → ADH | + | Débil | Minutos | ARA-II | 15089972, 32736759 | Activa el hipotálamo |
| 31 | Angiotensina II → Sed | + | Débil | Minutos | ARA-II | 9674690, 14739394 | Activa el centro de la sed |
| 32 | Angiotensina II → Simpático | + | Débil | Minutos | ARA-II | 1616014, 32736759 | Potencia la actividad simpática |
| 74 | Angiotensina II → TFG | + | Débil | Minutos | IECA, ARA-II | 24944035, 32606889 | Contrae la arteriola eferente y sostiene la filtración, sobre todo cuando llega poca presión al riñón |
| 33 | Hiperaldosteronismo → Aldosterona | + | Fuerte | Estable | — | 32724183, 26934393 | Secreción autónoma |
| 34 | Aldosterona → Actividad mineralocorticoide | + | Fuerte | Días | Espironolactona | 29982819, 25540145 | Activa su receptor renal |
| 35 | Regaliz → Actividad mineralocorticoide | + | Moderada | Días | Espironolactona | 2889032, 11494093, 38246526 | Inhibe la 11β-HSD2: el cortisol activa el receptor de aldosterona |
| 36 | Actividad mineralocorticoide → Reabsorción de Na | + | Fuerte | Días | Espironolactona | 25540145 | Canales y bombas de Na en el colector |
| 37 | Actividad mineralocorticoide → Potasio | − | Moderada | Días | Espironolactona | 25903070, 25540145 | Se secreta K a cambio del Na reabsorbido |

### Riñón

| # | Relación | Signo | Intensidad | Tiempo | Fármaco | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 38 | Estenosis renal → Perfusión renal | − | Fuerte | Estable | — | 23258796, 11172181 | Llega menos sangre al riñón |
| 39 | Presión arterial media → Perfusión renal | + | Débil | Minutos | — | 40775567, 25834230 | La TFG está autorregulada: la presión influye poco en ella |
| 70 | Presión arterial media → Reabsorción de Na | − | Moderada | Días | — | 1730460, 2063193 | Natriuresis por presión: con presión alta el túbulo reabsorbe menos Na (O2) |
| 40 | Perfusión renal → TFG | + | Fuerte | Minutos | — | 8574595, 25834230 | Menos flujo, menos filtración |
| 41 | Caída de la filtración → TFG | − | Fuerte | Estable | — | 3613404, 6522141 | Membrana dañada u obstrucción de la salida de la orina |
| 42 | TFG → Diuresis | + | Moderada | Minutos | — | 28271233, 25098598 | Se filtra menos líquido |
| 43 | Reabsorción de Na → Diuresis | − | Moderada | Días | Tiazidas, diuréticos de asa | 26240596, 2063193 | El agua sigue al Na |
| 44 | Reabsorción de Na → Osmolaridad plasmática | + | Débil | Días | — | 15557392 | El Na retenido activa la ADH y arrastra agua: la natremia apenas cambia |
| 45 | TFG → Creatinina | − | Fuerte, con umbral (TFG < −0,3) | Días | — | 27647862, 1394976 | La creatinina es el marcador de filtración; no se mueve con pequeñas variaciones |
| 66 | TFG → Potasio | − | Moderada, con umbral (TFG < −0,3) | Estable | — | 19546417 | Con mucha menos filtración se excreta menos K |

### Corazón y simpático

| # | Relación | Signo | Intensidad | Tiempo | Fármaco | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 46 | Feocromocitoma → Simpático | + | Fuerte | Minutos | — | 16112304 | Catecolaminas circulantes; los bloqueantes actúan en las relaciones 23 y 51–53 |
| 47 | Hormonas tiroideas → Frecuencia cardíaca | + | Fuerte | Días | — | 11172193, 14594573 | Efecto cronotrópico directo |
| 48 | Hormonas tiroideas → Contractilidad | + | Fuerte | Días | — | 11172193, 14594573 | Efecto inotrópico directo |
| 49 | Hormonas tiroideas → RVP | − | Fuerte | Días | — | 11172193, 16896276 | La T3 relaja el músculo liso de las arteriolas y el mayor metabolismo de los tejidos las dilata |
| 50 | Hormonas tiroideas → Simpático | + | Débil | Días | — | 6263953, 11172193, 6317368 | Más respuesta a las catecolaminas, cuya concentración es normal o baja; el efecto es débil y discutido (D5) |
| 51 | Simpático → Frecuencia cardíaca | + | Fuerte | Minutos | Betabloqueante | 20713547, 10581327 | β1 en el nódulo sinusal |
| 52 | Simpático → Contractilidad | + | Fuerte | Minutos | Betabloqueante | 11527117, 10581327 | β1 en el miocardio |
| 53 | Simpático → RVP | + | Fuerte | Minutos | Alfabloqueante | 7491088, 11356987 | α1 en las arteriolas |
| 54 | Frecuencia cardíaca → Gasto cardíaco | + | Fuerte | Minutos | — | 18771592, 27613307 | GC = FC × volumen sistólico |
| 55 | Contractilidad → Gasto cardíaco | + | Moderada | Minutos | — | 18771592 | Más volumen sistólico |
| 56 | Volemia → Gasto cardíaco | + | Fuerte | Minutos | — | 18771592, 27613307 | Más precarga, más volumen sistólico (Frank-Starling) |

### Presiones

| # | Relación | Signo | Intensidad | Tiempo | Fármaco | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 57 | Gasto cardíaco → PAS | + | Fuerte | Minutos | — | 16896276, 14594573 | Más sangre eyectada por latido |
| 58 | Gasto cardíaco → PAD | + | Débil | Minutos | — | 30305136, 11263624 | Sube algo la presión de base |
| 59 | RVP → PAD | + | Fuerte | Minutos | — | 17515449, 9236450 | La sangre sale más despacio en diástole |
| 60 | RVP → PAS | + | Moderada | Minutos | — | 30305136 | Más poscarga |
| 61 | Rigidez arterial → PAS | + | Fuerte | Estable | — | 9236450, 15731494 | La pared no amortigua la eyección |
| 62 | Rigidez arterial → PAD | − | Moderada | Estable | — | 9236450 | Se pierde el efecto Windkessel |
| 71 | Volemia → RVP | + | Moderada | Estable | — | 2667575, 2063193 | Autorregulación a largo plazo: los tejidos limitan el exceso de flujo, el gasto vuelve a lo normal y la RVP sostiene la hipertensión |

### Retroalimentación

| # | Relación | Signo | Intensidad | Tiempo | Fármaco | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 63 | Volemia → ADH | − | Moderada | Minutos | — | 4750450 | Barorreceptores de volumen frenan la ADH |
| 64 | Volemia → Sed | − | Moderada | Minutos | — | 14739394 | Con volumen alto no hay sed |
| 65 | Presión arterial media → Simpático | − | Moderada | Minutos | — | 32736759, 25729060 | Barorreflejo. En la hipertensión mantenida se reajusta en buena parte: el modelo lo simplifica y no lo cuenta en estado estable (O1) |

## Vista del vaso

El corte longitudinal muestra seis propiedades a la vez, para que la volemia y el corazón se vean aunque no cambien la luz del vaso.

| Propiedad visual | Nodo | Cómo se ve |
| --- | --- | --- |
| Diámetro de la luz | RVP | Se estrecha con la vasoconstricción y se ensancha con la vasodilatación |
| Grosor de la pared y placas | Placa de ateroma | Pared más gruesa, con placas amarillentas que invaden la luz, sin mover la aguja de la RVP |
| Distensión en cada latido | Rigidez arterial | Un vaso elástico se expande con cada pulso; uno rígido apenas se mueve |
| Llenado y tensión de la pared | Volemia | Más densidad de partículas de sangre y pared tensa hacia fuera |
| Ritmo y fuerza del pulso | Frecuencia cardíaca y contractilidad | Velocidad y amplitud de la onda que recorre el vaso |
| Color de la pared | Presión arterial media | De neutro a rojo según la presión soportada |

Junto al vaso: un dial grande con dos agujas (PAS y PAD), las ruedas de causa, las de mecanismo, el panel de analítica y el interruptor de tres escalas de tiempo. La distribución se decide en la fase 2.

## Avisos de realismo

Las ruedas de causa se giran por separado, de modo que se pueden montar pacientes que no existen. El simulador no lo prohíbe: una combinación hipotética también enseña cómo interactúan los mecanismos. Pero lo avisa.

| Aviso | Condición | Texto | Modo reto |
| --- | --- | --- | --- |
| Combinación hipotética | Dos o más causas raras activas, o tres o más causas no comunes | «Combinación hipotética. Es muy improbable que estas causas coincidan en un mismo paciente. Sirve para ver cómo interactúan los mecanismos, no como caso clínico.» | No la usa |
| Tope de escala | Una salida o un valor de analítica llega a ±0,95 | Chip «tope de escala»: «Tope de la escala del simulador: indica un valor muy alterado, pero no cuánto. Más allá de aquí el simulador no distingue.» Con el modelo actual salta en la aldosterona del caso 8 y en la volemia del caso 11 | No la usa |
| Interacción (fase de uso docente) | Dos o más causas activas con una interacción conocida | Nota breve, por ejemplo «La sed compensa la diabetes insípida mientras haya agua» | Sí, como casos combinados |

Hito 3e: los textos y las reglas son datos del tema (`src/temas/hipertension/avisos.ts`), revisados por Fable 5.2 (`docs/revision-avisos-3e-fable.md`). El aviso «Fuera de rango» pasó a llamarse «Tope de escala» porque en una analítica «fuera de rango» significa «valor anormal».

Una causa cuenta como activa cuando su valor se aparta de lo normal más de 0,15, el mismo umbral que las flechas.

## Casos y resultados esperados

Los 12 casos de partida, con lo que el motor debe mostrar **en estado estable**. Es la batería de tests de la fase 3: si el motor da otra flecha, el error está en el modelo o en esta tabla. Flechas según los umbrales del motor: ↑↑ ≥ 0,5 · ↑ entre 0,15 y 0,5 · = por debajo de 0,15 · ↓ · ↓↓. Entre paréntesis, lo que cambia en la escala de días o en otra condición.

### Hemodinámica

| Caso | Ruedas | PAS | PAD | Volemia | RVP | GC |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Edad avanzada con factores de riesgo | Edad +1, factores +1 | ↑↑ | ↓ | = | ↑ | = |
| 2. Hipertiroidismo | Tiroides +1 | ↑ | ↓ | ↑ | ↓ o ↓↓ | ↑↑ |
| 3. Dieta alta en sal | Sal +1 | ↑ | ↑ | ↑ | ↑ | = (↑ en días) |
| 4. SIADH | ADH autónoma +1 | = | = | = (↑ en días) | = | = |
| 5. Estenosis renal bilateral | Estenosis +1 | ↑ | ↑ | ↑ | ↑ | ↑ |
| 6. Caída de la filtración | Caída +1 | ↑ | ↑ | ↑ | ↑ | ↑ |
| 7. Tumor secretor de renina | Tumor +1 | ↑↑ | ↑↑ | ↑ | ↑↑ | ↑ |
| 8. Hiperaldosteronismo primario | Hiperaldo +1 | ↑ | ↑ | ↑ | ↑ | = (↑ en días) |
| 9. Feocromocitoma | Feo +1 | ↑↑ | ↑↑ | ↓ | ↑↑ | ↑↑ |
| 10. Regaliz | Regaliz +1 | ↑ | ↑ | ↑ | ↑ | = (↑ en días) |
| 11. Deshidratación | Acceso al agua −1 | ↓ | = o ↑ | ↓↓ | ↑ | ↓ |
| 12. Diabetes insípida central | ADH autónoma −1 | ↓ leve (↓ o ↓↓ sin acceso al agua) | = | ↓ | = | ↓ leve |

### Analítica

| Caso | Renina | Aldosterona | Creatinina | Natremia | Osm. urinaria | Diuresis | Potasio |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Edad avanzada con factores de riesgo | = | = | = | = | = | = | = |
| 2. Hipertiroidismo | ↑ | ↑ | = | = | = | = (↓ en días) | = |
| 3. Dieta alta en sal | ↓ | ↓ | = | = o ↑ leve | ↑ | = (↓ en días) | = |
| 4. SIADH | ↓ | ↓ | = | ↓↓ | ↑↑ | ↓ | = |
| 5. Estenosis renal bilateral | ↑ | ↑ | ↑ (= si fuera unilateral) | = | = | = (↓ en días) | = |
| 6. Caída de la filtración | = o ↑ leve | ↑ | ↑↑ | = | = | = (↓ en días) | ↑ |
| 7. Tumor secretor de renina | ↑↑ | ↑↑ | = | = | = | = (↓ en días) | ↓ |
| 8. Hiperaldosteronismo primario | ↓ o ↓↓ | ↑↑ | = | = | = | = (↓ en días) | ↓↓ |
| 9. Feocromocitoma | ↑ | ↑ | = | = | = | = | = |
| 10. Regaliz | ↓ | ↓ | = | = | = | = (↓ en días) | ↓ |
| 11. Deshidratación | ↑↑ | ↑↑ | ↑ | ↑ | ↑↑ | ↓↓ | = |
| 12. Diabetes insípida central | ↑ | ↑ | = (↑ sin acceso al agua) | ↑ | ↓↓ | ↑↑ | = |

**Diuresis en estado estable.** En estado estable se orina lo que se ingiere, así que la diuresis vuelve a «=» en todos los casos de retención. La oliguria es la fase de días, que termina con el escape: natriuresis por volumen y por presión. Es el mismo principio que D3 aplica a la sal, extendido a todos los casos. Las excepciones son los casos en que la causa cambia lo que se bebe o actúa directamente sobre el volumen de orina: SIADH (4: con hiponatremia se bebe menos), deshidratación (11) y diabetes insípida (12). En la caída de la filtración (6) la oliguria es de la fase de días (corregido en la fase 3a).

**Las tres filas que mejor enseñan a diferenciar:** tumor de renina (renina y aldosterona altas), hiperaldosteronismo primario (renina baja, aldosterona alta) y regaliz (las dos bajas, con potasio bajo). Con las relaciones 69, 27 y 28 asimétricas y 73, el modelo debería producirlas solo; la fase 3 lo comprueba.

### Notas que muestra cada caso

| Caso | Nota «La fisiología» |
| --- | --- |
| 1 | La presión sube porque las arterias grandes se vuelven rígidas, no porque su pared estreche el paso de la sangre. La sistólica sube durante toda la vida adulta; la diastólica sube hasta los 50–60 años y después baja (D2) |
| 2 | Las hormonas tiroideas no hacen liberar más adrenalina. Actúan directamente sobre el corazón y aumentan algo su sensibilidad a ella: por eso el cuadro parece simpático. La renina sube: en el hipertiroidismo el sistema renina-angiotensina está más activo. Se atribuye a que aumenta la respuesta de los receptores β, que en el riñón liberan renina (D5) |
| 3 | Se orina menos solo los primeros días: a largo plazo se orina lo que se ingiere. Con el tiempo el gasto cardíaco vuelve a lo normal y es la RVP la que sostiene la hipertensión (D3) |
| 4 | El SIADH casi nunca causa hipertensión: el riñón escapa del exceso de volumen (pierde sodio y responde menos a la ADH) y queda una hiponatremia con presión casi normal (D1) |
| 5 | La creatinina sube de forma clara solo si la estenosis es bilateral (o de un riñón único). En la unilateral el otro riñón compensa y la renina sigue alta. En la bilateral, el volumen retenido frena en parte la renina (D6) |
| 6 | Glomerulonefritis y cálculos bajan la TFG por mecanismos distintos: la membrana dañada filtra peor y la obstrucción sube la presión en la cápsula de Bowman |
| 9 | La presión alta hace orinar más sodio y la volemia baja: el feocromocitoma suele cursar con volumen bajo |
| 12 | Con acceso al agua, la sed compensa y la creatinina queda normal. Prueba a bajar la rueda de acceso al agua: sin beber, la volemia cae, se filtra menos y la creatinina sube (D4) |

## Errores frecuentes y matices (D1–D6)

Seis simplificaciones frecuentes al explicar las causas de la hipertensión y lo que dice la fisiología de manual. Criterio general (O4): el motor sigue la fisiología estándar y la nota del caso explica el matiz. La revisión de Fable 5.2 confirmó D1–D5 y matizó D6.

| # | Tema | Planteamiento simplificado | Fisiología estándar | Decisión |
| --- | --- | --- | --- | --- |
| D1 | SIADH | Causa hipertensión por aumento de volemia | Hiponatremia euvolémica: Na corporal total y volumen extracelular normales o casi normales; el escape incluye natriuresis y pérdida de respuesta a la ADH (Ellison y Berl, PMID 17507705) | **Fisiología estándar.** Caso 4 con hiponatremia marcada y presión casi normal |
| D2 | Placa de ateroma y RVP | El engrosamiento reduce el diámetro y sube la presión | La placa de una arteria de conducción no estrecha las arteriolas, donde está la resistencia. La aterosclerosis sube la presión sobre todo por rigidez | **Fisiología estándar.** Sin relación placa → RVP (la 6 se eliminó); la 72 lleva los factores de riesgo a la RVP por disfunción endotelial |
| D3 | Sal y diuresis | La sal produce oliguria | Cierto en los primeros días. En estado estable se excreta lo que se ingiere | **Escala de tiempo**, extendida a todos los casos de retención |
| D4 | Diabetes insípida y creatinina | La creatinina sube | Con acceso libre al agua, la sed compensa y la creatinina suele ser normal | **Fisiología estándar.** Creatinina normal con acceso libre; sube al bajar la rueda de acceso al agua |
| D5 | Hormonas tiroideas y adrenalina | Activan la liberación de adrenalina | Aumentan algo la sensibilidad β-adrenérgica. Más respuesta de los receptores β, que en el riñón liberan renina; el sistema renina-angiotensina queda más activo (Vargas et al., PMID 16452532; Ganong, PMID 7040892) | **Fisiología estándar.** Relaciones 50 y 24 débiles |
| D6 | Estenosis renal | La creatinina sube siempre | Unilateral: el otro riñón compensa, sin expansión de volumen; creatinina normal y renina alta. Bilateral: hipertensión dependiente de volumen, que frena en parte la renina (Safian y Textor, PMID 11172181) | **Bilateral en la v1**, con renina ↑ (no ↑↑) y nota. **Fase 7:** la estenosis puede ser bilateral, unilateral o de riñón único (ver «Cambios de la fase 7») |

## Decisiones

Las seis decisiones del 13 de noviembre de 2026, tras la revisión de Fable 5.2.

- **O1. Barorreflejo** (relación 65). Se mantiene: actúa en minutos y días, no en estado estable, porque en la hipertensión mantenida se reajusta en buena parte (el reajuste es incompleto: Lohmeier e Iliescu, PMID 25729060).
- **O2. Natriuresis por presión.** Se mantiene, reimplementada por el túbulo (relación 70) en lugar de por la TFG; la 39 pasa a débil.
- **O3. Potasio y TFG** (relación 66). Se mantiene, con umbral, y se añade Potasio → Aldosterona (73).
- **O4. Criterio ante los errores frecuentes (D1–D6).** Se mantiene: el motor sigue la fisiología estándar.
- **O5. Granularidad de las ruedas.** Se mantiene: factores de riesgo en una sola rueda. La estenosis era bilateral hasta la fase 7, que añade la variante (bilateral, unilateral o riñón único) sin una rueda nueva.
- **O6. Escalas de tiempo.** Cambia: interruptor de tres posiciones (minutos · días · estado estable) en lugar de agudo/crónico.

## Límites conocidos

- El modelo no está ajustado: los signos están revisados, pero las intensidades exactas que hacen cuadrar los 12 casos se fijan en la fase 3, con el motor programado y esta tabla como tests.
- Los artículos de las relaciones se comprobaron en PubMed el 19 nov 2026 (`docs/fuentes.md`); los de acceso abierto se leyeron enteros.
- No está demostrado que la estenosis bilateral humana equivalga al modelo experimental de un solo riñón (D6). El riñón único sí es ese modelo (un riñón y un clip, PMID 4332626); en el simulador se calcula igual que la bilateral.

## Fuentes

- Franklin SS et al. Hemodynamic patterns of age-related changes in blood pressure. Circulation 1997;96:308-315. https://doi.org/10.1161/01.cir.96.1.308
- Prisant LM, Gujral JS, Mulloy AL. Hyperthyroidism: a secondary cause of isolated systolic hypertension. J Clin Hypertens (Greenwich). 2006;8(8):596-9. PMID 16896276.
- Ellison DH, Berl T. The syndrome of inappropriate antidiuresis. N Engl J Med. 2007;356(20):2064-72. PMID 17507705.
- Safian RD, Textor SC. Renal-artery stenosis. N Engl J Med. 2001;344(6):431-42. PMID 11172181.
- Pravenec M et al. Hemodynamic mechanisms initiating salt-sensitive hypertension in rat model of primary aldosteronism. Physiol Res 2024;73:S365. https://www.biomed.cas.cz/physiolres/pdf/73/73_S365.pdf
- Christ-Crain M et al., Diabetes insipidus, Nat Rev Dis Primers 2019, PMID 31395885. Bibliografía completa de las relaciones en `docs/fuentes.md`.

## Cambios de la fase 3a (14 nov 2026)

Al programar el motor y calibrar con la tabla de casos (detalle en `docs/calibracion.md`), Edu validó:

| Cambio | Qué | Motivo |
| --- | --- | --- |
| P1 · Tiempo de 25, 33, 38 y 41 | De `estable` a `minutos` | La causa actúa desde que existe; si no, en «días» el tumor, el hiperaldosteronismo y la estenosis no hacían nada |
| P2 · Nueva 75 | Volemia → Reabsorción de agua (−), solo por encima de 0, estado estable | Escape de la ADH en el SIADH (D1) |
| P3 · Nueva 76 | Volemia → Perfusión renal (+), días, solo por debajo de 0 | Azotemia prerrenal: la creatinina sube en la deshidratación |
| P4 · Umbral en 37 | 0,2 | Paradoja de la aldosterona: con volumen bajo llega poco Na al túbulo distal y el K no cae |
| P5 · Nueva 77 | Volemia → Simpático (−), días, solo por debajo de −0,4 | Reflejo de volumen bajo: taquicardia en la deshidratación (revisiones fisiológicas) |
| Tabla, casos 2, 11 y 12 | Caso 2: RVP «↓ o ↓↓» · caso 11: PAD «= o ↑» y simpático «↑ o ↑↑» · caso 12 sin agua: PAS «↓ o ↓↓» | Revisión P5/48 (`docs/revision-p5-48.md`) |
| Tabla, columnas nuevas | TFG «= o ↑» en los casos 7, 8 y 9; FC «↑ o ↑↑» en los casos 2, 9 y 11 | La autorregulación impide la hiperfiltración; taquicardia del hipertiroidismo, el feocromocitoma y la hipovolemia |
| Tabla, casos nuevos | 13 · Hipotiroidismo y 14 · Dieta baja en sal | Extremos de rueda que la tabla no vigilaba (validados) |
| Tabla, caso 8 | Renina ↓↓ → «↓ o ↓↓» | Sin hiperfiltración la renina baja menos; el contraste con el regaliz se mantiene |
| Tabla, caso 4 | Diuresis «=» → ↓ | En estado estable diuresis = ingesta, y con hiponatremia se bebe menos |
| Tabla, caso 6 | Diuresis ↓ → «=» (↓ en días) | La oliguria es de la fase de días (D3) |
| Tabla, caso 11 | PAD ↓ → «=» | La vasoconstricción mantiene la diastólica en la hipovolemia compensada |
| Tabla, caso 3 | Natremia «= (↑ leve)» → «= o ↑ leve» | Lectura del paréntesis |
| Intensidades | 63 ajustes con motivo, recalibrados tras la revisión fisiológica | Ver `docs/calibracion.md`, `docs/revision-fisiologica-3a.md` y `src/temas/hipertension/calibracion.ts` |

Las intensidades y relaciones de las secciones anteriores son las de la v2.1, sin estos cambios.

## Cambios del hito 3d (14 nov 2026)

Tras la revisión de las fichas con Fable 5.2 (`docs/revision-fichas-3d-fable.md`), validado por Edu:

- **C9, hiperaldosteronismo primario: frecuencia «rara» → «poco frecuente».** Afecta a entre un 5 y un 11 % de los hipertensos (PMID 28385310 y 17161262), más que la estenosis de arteria renal. Solo cambia la etiqueta de la rueda y los avisos de realismo, no las flechas.
- **Relación 39, texto del «por qué»:** pasa a «La presión de la aferente sigue a la arterial; la autorregulación protege la filtración». Tras la calibración la 39 es fuerte (1,5) y la autorregulación está en la 40; la tabla de relaciones de arriba conserva el texto original de la v2.1.
- ~~Pendiente: la sistólica del hipotiroidismo (caso 13) sale ↓ casi ↓↓~~: resuelto en el hito 3e (ver «Cambios del hito 3e»).


## Cambios del hito 3e (15 nov 2026)

Aprobados por Edu y revisados por Fable 5.2 (`docs/revision-avisos-3e-fable.md`, `docs/revision-hipotiroidismo-3e.md`).

| Cambio | Antes | Después | Motivo |
| --- | --- | --- | --- |
| C5 · frecuencia | Rara en los dos extremos | Diabetes insípida central: rara · SIADH: poco frecuente | El SIADH es la causa más frecuente de hiponatremia hipotónica (PMID 36974717) |
| Criterio de la frecuencia | Sin definir | «Frecuencia con que se ve en la práctica clínica» | Las etiquetas mezclaban frecuencia de la enfermedad y como causa de hipertensión. C4 sigue «poco frecuente» en los dos extremos: el hipotiroidismo franco sin tratar no es común (prevalencia europea del 3 %, PMID 24423323) |
| Relación 47 · Hormonas tiroideas → FC, por debajo de 0 | 0,3 | 0,15 | Bradicardia leve en el hipotiroidismo |
| Relación 78 (nueva) · Hormonas tiroideas → Rigidez (−) | — | Débil (0,3), solo por debajo de 0, estado estable | Más rigidez central en el hipotiroidismo, reversible con tiroxina (PMID 12364455, 29545561, 15758564) |
| Caso 13 · esperado | Sin sistólica | Sistólica «= o ↓» | En el paciente real suele ser normal (PMID 11994331) |

Resultado en el caso 13 (estado estable): sistólica −0,46 ↓ → −0,12 =; diastólica +0,35 ↑ → +0,21 ↑; rigidez 0 → +0,29 ↑. En «Días» la sistólica sigue en ↓ (la rigidez es un cambio crónico). Con la rueda a −0,5 la diastólica queda en «=» (+0,14). Punto frágil: la diuresis del caso 13 está en +0,14 (esperado «= o ↓»; antes +0,12), así que cualquier recalibración futura del caso puede sacarla de rango.

## Cambios de la fase 4: fármacos (16 nov 2026)

Aprobados por Edu el 16 nov 2026. Datos en `src/temas/hipertension/farmacos.ts` (fármacos), `propuestas.ts` (relaciones 79 y 81) y `calibracion.ts` (53). La columna «Fármaco» de las tablas de relaciones de arriba conserva lo que decía la v2.1; lo que vale ahora es esta tabla.

### Modificador en el motor

Cada fármaco es un nodo de tipo `farmaco` con su rueda de dosis (0 = sin, 1 = dosis plena) y actúa de dos maneras:

- **Bloquea relaciones** (relación de tipo `bloquea`). Con bloqueo *b* = dosis × fracción con la dosis plena, la relación bloqueada ve su origen como (1 + x)(1 − b) − 1: el fármaco corta también el tono normal de la vía, no solo la desviación. Si el origen es una causa (sin tono normal), solo se recorta la desviación, x (1 − b). Varios fármacos sobre la misma relación se suman, hasta 1.
- **Mueve un nodo** con una relación de suma normal (diuréticos y calcioantagonista).

Motivo: si el fármaco solo recortara la desviación, el IECA subía la presión de la dieta con sal (de +0,30 a +0,47) y no hacía nada en una persona sana.

### Fármacos

| Fármaco | Actúa | Dosis plena |
| --- | --- | --- |
| F1 · IECA | Bloquea la 26 (renina → angiotensina II) | 35 % |
| F2 · ARA-II | Bloquea la 27 a la 32 y la 74 (receptor AT1) | 35 % |
| F3 · Betabloqueante (no selectivo) | Bloquea la 23, la 51, la 52 y la 79 (β1 y β2) | 40 % |
| F4 · Alfabloqueante | Bloquea la 53 (α1) | 50 % |
| F5 · Tiazida | 82: → Reabsorción de Na (−0,4, minutos); 83: → Potasio (−0,4, días) | — |
| F6 · Diurético de asa | 84: → Reabsorción de Na (−0,8, minutos); 85: → Potasio (−0,3, días) | — |
| F7 · Espironolactona | Bloquea la 34 y la 35 (receptor mineralocorticoide) | 60 % |
| F8 · Calcioantagonista (dihidropiridina) | 86: → RVP (−0,5, minutos); 92: → Reabsorción de Na (−0,2, días); 93: → Sistólica (−0,25, minutos) | — |

Fuera de esta fase: aliskireno (marcado en la 26), vaptanes (marcados en la 11), antihipertensivos centrales y calcioantagonistas no dihidropiridínicos.

### Cambios de relaciones

| Relación | Antes | Después | Motivo |
| --- | --- | --- | --- |
| 79 (nueva) · Simpático → RVP por β2 | — | −, débil (0,3), minutos; la bloquea el betabloqueante | Aplazada en la v2.1. Sin la dilatación β2, el betabloqueante deja la vasoconstricción α sin oposición en el feocromocitoma |
| 53 · Simpático → RVP por α1 | 0,557 | 0,857 | Compensa exactamente la 79: sin fármacos ningún caso cambia |
| 80 · Angiotensina II → Renina (asa corta) | Aplazada | No se añade | La renina ya sube con IECA y ARA-II por la presión y el volumen; con ella, incluso a 0,15, fallaban los casos 2 y 4 |
| 81 (nueva) · Act. mineralocorticoide → Potasio | — | −, moderada (0,6), solo por debajo de −0,3, días | Sin ella la espironolactona no subía el potasio (la 37 solo actúa por encima de 0,2). No cambia ningún caso |
| 43 · Reabsorción de Na → Diuresis | Bloqueable por tiazidas y diuréticos de asa | Sin bloqueo | Bloquearla bajaría la diuresis; los diuréticos actúan sobre la reabsorción de Na |
| 36 y 37 | Bloqueables por espironolactona | Sin bloqueo | Contarían dos veces el bloqueo, que va en la 34 y la 35 |
| 74 · Angiotensina II → TFG | Bloqueable por IECA y ARA-II | Solo ARA-II | El IECA actúa antes, en la 26 |

### Casos con fármaco (15 a 24)

Cada uno parte de un caso básico con un fármaco a dosis plena; solo se comprueban las celdas que enseñan el fármaco (`src/temas/hipertension/casos.ts`).

| Caso | Esperado (estado estable) |
| --- | --- |
| 15 · Estenosis bilateral con IECA | TFG ↓↓, creatinina ↑ o ↑↑, K ↑, renina ↑ o ↑↑, angiotensina II = o ↓, PAS = o ↑ |
| 16 · Tumor de renina con IECA | PAS y PAD ↑ (desde ↑↑), renina ↑↑, angiotensina II =, K = |
| 17 · Tumor de renina con ARA-II | PAS y PAD =, renina ↑↑, angiotensina II ↑↑, aldosterona =, K = |
| 18 · Hiperaldosteronismo con espironolactona | PAS y PAD =, aldosterona ↑↑, act. mineralocorticoide ↓, K =, renina = |
| 19 · Feocromocitoma con betabloqueante solo | RVP ↑↑, PAD ↑, FC =, GC = |
| 20 · Feocromocitoma con alfa y betabloqueante | PAS, PAD, RVP, GC y FC = |
| 21 · Dieta alta en sal con tiazida | PAS, PAD, volemia y RVP =, K ↓ |
| 22 · Hipertiroidismo con betabloqueante | FC = o ↓, GC =, PAS = |
| 23 · Caída de la filtración con diurético de asa | PAS =, volemia ↓, K =, creatinina ↑ o ↑↑ |
| 24 · Dieta alta en sal con calcioantagonista | PAS, PAD y RVP =, volemia ↑, K = |

La diuresis del caso 13 sigue en +0,141.

### Avisos de interacción

Datos del tema (`avisos.ts`, campo `interacciones`): IECA o ARA-II en la estenosis renal (contraindicado), betabloqueante sin alfabloqueante en el feocromocitoma (contraindicado), IECA con ARA-II (no se asocian), espironolactona con IECA o ARA-II (vigilar el potasio) y, desde la revisión de Fable 5.2, acceso al agua bajo con IECA, ARA-II o un diurético (cuidado con la deshidratación).

### Revisión de Fable 5.2 (16 nov 2026)

`docs/revision-fase-4-fable.md`. Aprobada por Edu: 46 correcciones de texto, aviso de deshidratación y estos cambios del modelo.

| Cambio | Antes | Después | Motivo |
| --- | --- | --- | --- |
| 83 · Tiazida → Potasio | 0,3 | 0,4 | A las dosis habituales la tiazida baja el potasio el doble que la furosemida (PMID 7388366) |
| 85 · Diurético de asa → Potasio | 0,4 | 0,3 | Ídem |
| 92 (nueva) · Calcioantagonista → Reabsorción de Na | — | −0,2, días | Las dihidropiridinas son algo natriuréticas: sin ella, la natriuresis por presión retenía volumen y la sistólica no bajaba (en «Días» subía) |
| 93 (nueva) · Calcioantagonista → Sistólica | — | −0,25, minutos | Al dilatar las arterias baja la onda reflejada. Persona sana: sistólica «=» → ↓ (−0,25); con sal, ↑ → «=» |
| 39 · PAM → Perfusión renal, por debajo de 0 | 1,5 | 0,8 | La autorregulación amortigua también las caídas moderadas. Persona sana con ARA-II: TFG ↓↓ → ↓ (−0,47), potasio ↑ → «=». No cambia ninguna flecha de los casos 1 a 14 |
| Caso 24 (nuevo) | — | Dieta alta en sal con calcioantagonista | La ficha del calcioantagonista no tenía caso |

No se aplican: igualar IECA y ARA-II (empeora la filtración en la persona sana; se cuenta en las fichas) ni reproducir la crisis del feocromocitoma con betabloqueante (no se consigue calibrando; se cuenta en el texto). La diuresis del caso 13 sigue en +0,141.

### Límites conocidos de la fase 4

- Feocromocitoma con solo betabloqueante: la RVP sube más, pero la sistólica baja con el gasto. El modelo no muestra la crisis hipertensiva; la cuenta el aviso.
- La TFG cae algo de más con fármacos en una persona sana (con el ARA-II, ↓ y creatinina ↑ leve; antes de la revisión, ↓↓). En los pacientes hipertensos no pasa.
- Diuréticos en estado estable: la RVP no baja, porque la 71 no actúa por debajo de 0. En el paciente real la tiazida mantenida baja la RVP.
- Hipertensión sistólica del mayor (caso 1): ningún fármaco baja bien la sistólica, porque la rigidez no cambia (con el calcioantagonista, de 0,77 a 0,61), y la diastólica baja mucho.
- El ARA-II sale más potente que el IECA (casos 16 y 17); en el paciente son parecidos. Se cuenta en las fichas.
- IECA con hiperaldosteronismo o regaliz: baja la presión más de lo real, porque la renina del modelo nunca está tan suprimida.

## Cambios de la fase 5: ejercicio (16 nov 2026)

Aprobados por Edu el 16 nov 2026 a partir de `docs/propuesta-fase-5.md`. Datos en `src/temas/hipertension/ejercicio.ts`; casos en `casos.ts` (25 a 33); tests en `tests/ejercicio.test.ts`.

### Modificador temporal en el motor

- **Nodos de tipo `ejercicio`** con su rueda de 0 a 1: E1 sesión aeróbica, E2 sesión de fuerza, E3 entrenamiento aeróbico, E4 de fuerza y E5 isométrico. El texto del valor va por tramos (campo `niveles` del nodo: «reposo», «suave», «moderada», «intensa», «vigorosa»…).
- **Momento de la sesión** (`antes`, `durante`, `despues`): las relaciones de la sesión llevan `momento` y solo actúan en el suyo. «Antes» es la simulación de siempre.
- **La sesión parte del estado estable del paciente** (`simular` con `momento`): primero se calcula el estado estable sin la sesión (causas, fármacos y entrenamiento) y, encima, la respuesta de minutos. Las relaciones de días o de estado estable actúan con el valor de reposo de su origen; la volemia (acumulador) no cambia; las que se reajustan (`hasta`, el barorreflejo 65) actúan sobre el cambio respecto al reposo. Así, en la sesión el interruptor de tiempo no cuenta, y el mayor conserva su rigidez.
- **Bloqueo «solo del exceso»** (`soloExceso` en `bloquea`): recorta la desviación del origen por encima de lo normal sin cortar el tono normal. Lo usa el entrenamiento: atenúa lo que está alto y no toca a quien lo tiene normal.
- **Avisos con momento** (`momentos` y `requiere` en las interacciones).

### Relaciones nuevas

La propuesta numeraba 94–110; al separar el entrenamiento por tipos quedan 94–115, y la revisión de Fable 5.2 añade la 116, la 117 y la 118. Ninguna relación de las fases anteriores cambia. Intensidades calibradas con los casos 25 a 33.

| # | Relación | Valor | Momento o tiempo | Motivo | Fuente |
| --- | --- | --- | --- | --- | --- |
| 94 | Sesión aeróbica → Simpático | +0,8 | durante | Orden central y metaborreflejo | PMID 32861944, 26024683 |
| 95 | Sesión aeróbica → FC | +0,9 | durante | Retirada vagal (no la bloquea el betabloqueante) | PMID 24756637, 14555886 |
| 96 | Sesión aeróbica → Gasto cardíaco | +0,5 | durante | Más retorno venoso: el músculo que trabaja se dilata y deja pasar más sangre, que vuelve al corazón. La bomba muscular ayuda, pero pesa menos que esa vasodilatación | PMID 18339690, 11719890, 8847255 |
| 97 | Sesión aeróbica → RVP | −1,2 | durante | Vasodilatación metabólica; simpaticolisis funcional | PMID 9457657, 25834232 |
| 98 | Sesión aeróbica → Perfusión renal | −0,8 | durante | Vasoconstricción renal: el flujo no cambia con el esfuerzo moderado y cae con el intenso | PMID 29525855 |
| 99 | Sesión aeróbica bloquea la 65 | 40 % (antes 70 %; 20 nov 2026) | durante | El barorreflejo se reajusta al alza: deja subir la presión, pero sigue regulándola | PMID 22002871, 26024683 |
| 100 | Sesión de fuerza → Simpático | +0,8 | durante | Metaborreflejo: los metabolitos que se acumulan en el músculo en tensión activan el simpático. La orden central apenas sube el simpático que va a los vasos del músculo | PMID 1936089, 4028348 |
| 101 | Sesión de fuerza → FC | +0,45 | durante | Retirada vagal, sobre todo en los primeros 30 segundos. Después la frecuencia sigue subiendo por el simpático, que el modelo cuenta aparte (relaciones 100 y 51) | PMID 4600046 |
| 102 | Sesión de fuerza → RVP | +0,5 | durante | Compresión del músculo y Valsalva | PMID 3980383 |
| 103 | Sesión de fuerza bloquea la 65 | 40 % (antes 70 %; 20 nov 2026) | durante | El barorreflejo se reajusta al alza: deja subir la presión, pero sigue regulándola | PMID 22002871 |
| 104 | Sesión aeróbica → RVP | −0,3 | al terminar | Vasodilatación por histamina H1 y H2 | PMID 22872658 |
| 105 | Sesión aeróbica → Simpático | −0,2 | al terminar | Barorreflejo reajustado a la baja | PMID 22872658, 15076798 |
| 106 | Sesión aeróbica bloquea la 65 | 50 % | al terminar | El barorreflejo defiende menos la presión | PMID 22872658 |
| 107 | Entrenamiento aeróbico bloquea 23, 51, 52, 53 y 79 (solo exceso) | 40 % | estable | Baja la actividad simpática de los hipertensos hasta lo normal | PMID 17438307 |
| 108 | Entrenamiento aeróbico → FC | −0,3 | estable | Bradicardia de reposo | PMID 24825544 (animales) |
| 109 | Entrenamiento aeróbico → Gasto cardíaco | +0,3 | estable | Más volumen sistólico: el gasto de reposo no baja | PMID 2000315 (fuente débil) |
| 110 | Entrenamiento aeróbico bloquea 1, 4, 5 y 78 (solo exceso) | 20 % | estable | Menos rigidez en las arterias rígidas | PMID 25333969 |
| 111 | Entrenamiento aeróbico bloquea 71 y 72 (solo exceso) | 70 % | estable | Mejora endotelial; baja más la presión de quien la tiene alta | PMID 10484540, 23525435 |
| ~~112~~ | ~~Entrenamiento de fuerza bloquea 23, 51, 52, 53 y 79 (solo exceso)~~ | | | Quitada el 20 nov 2026 (validado por Edu): sin respaldo en PubMed | — |
| 113 | Entrenamiento de fuerza bloquea 71 y 72 (solo exceso) | 70 % | estable | Baja la presión de reposo como el aeróbico | PMID 37975709, 37491419 |
| 114 | Entrenamiento isométrico bloquea 23, 51, 52, 53 y 79 (solo exceso) | 25 % | estable | Menos exceso simpático | PMID 35950976, 24174307 |
| 115 | Entrenamiento isométrico bloquea 71 y 72 (solo exceso) | 100 % | estable | El que más baja la presión de reposo | PMID 37491419 |
| 116 | Entrenamiento aeróbico → Reabsorción de Na | −0,2 | estable | Menos actividad simpática renal y menos renina: el riñón excreta la misma sal con menos presión | PMID 1937659, 16157788 |
| 117 | Entrenamiento aeróbico bloquea la 7 (solo exceso) | 30 % | estable | Menos sensibilidad a la sal | PMID 23035134 |
| 118 | Sesión de fuerza → Perfusión renal | −1,2 | durante | Vasoconstricción renal en el esfuerzo | PMID 12750063, 28855178 |

Cambios respecto a la propuesta, hechos al calibrar: el efecto del entrenamiento sobre el simpático (107) y la rigidez (110) pasan de restar a todos a bloquear «solo el exceso», porque restando a todos la persona sana entrenada bajaba la sistólica a ↓↓ y, con menos rigidez de la normal, subía su diastólica. La 109 va al gasto en lugar de a la contractilidad (con la contractilidad no compensaba la bradicardia). La 111 sube de 50 % a 70 %.

### Casos 25 a 33

| Caso | Momento | Esperado | Obtenido |
| --- | --- | --- | --- |
| 25 · Sesión aeróbica moderada | durante | PAS ↑ o ↑↑, PAD = o ↓, RVP ↓ o ↓↓, FC y GC ↑ o ↑↑ | PAS +0,70, PAD +0,01, RVP −0,34, FC +0,69, GC +0,77 |
| 26 · Ídem con betabloqueante | durante | FC = o ↑, GC ↑, PAS ↑, PAD = o ↓ | FC +0,14, GC +0,34, PAS +0,31 |
| 27 · Sesión de fuerza intensa | durante | PAS, PAD y RVP ↑↑ | +0,86, +0,72, +0,70 |
| 28 · Dieta alta en sal, al terminar | al terminar | PAS y PAD = (antes, ↑) | +0,07 y +0,05 |
| 29 · Ídem con alfabloqueante | al terminar | RVP ↓, PAD = o ↓, PAS = | −0,17, −0,10, +0,08 |
| 30 · Dieta alta en sal con entrenamiento aeróbico | estable | PAS, PAD y RVP =, FC ↓ | PAS +0,12, PAD +0,06, RVP +0,03, FC −0,31 |
| 31 · Persona sana con entrenamiento aeróbico | estable | PAS, PAD y GC =, FC ↓ | −0,07, +0,01, −0,07, −0,28 |
| 32 · Feocromocitoma, sesión aeróbica | durante | Simpático, FC y PAS ↑↑ | +0,91, +0,92, +0,82 |
| 33 · Hipertiroidismo, sesión vigorosa | durante | FC, GC y PAS ↑↑ | +0,97, +0,96 (tope de escala), +0,71 |

La diuresis del caso 13 sigue en +0,141.

### La sistólica del caso 30 (resuelto con la revisión de Fable 5.2)

Con las relaciones aprobadas, el entrenamiento baja la RVP y la diastólica de la dieta alta en sal, pero no la sistólica (+0,27 → +0,29). En el modelo, la presión a largo plazo la fija el riñón (natriuresis por presión, 70): al bajar la RVP se retiene algo más de volumen y sube el gasto. Es lo mismo que obligó a añadir la 92 al calcioantagonista en la fase 4. Opciones probadas (estado estable):

| Opción | Persona sana (PAS) | Sal (PAS / PAD) | Hiperaldosteronismo (PAS / PAD) |
| --- | --- | --- | --- |
| Lo aprobado (actual) | +0,01 | +0,29 / +0,12 | +0,26 / +0,09 |
| a · Entrenamiento → Reabsorción de Na (−0,2): algo natriurético | −0,07 | +0,21 / +0,09 | +0,16 / +0,05 |
| c · Rigidez −0,15 para todos (como en la propuesta) | −0,15 | +0,14 / +0,21 | +0,11 / +0,18 |
| a + c | −0,23 | +0,05 / +0,18 | +0,01 / +0,14 |

Fable 5.2 recomendó la «a» a 0,2 (con base en humanos: menos noradrenalina renal, PMID 1937659; menos renina, PMID 16157788) más una relación nueva «h», la 117 (menos sensibilidad a la sal, PMID 23035134), solo en el entrenamiento aeróbico, y desaconsejó la «c». Aprobado por Edu el 16 nov 2026: sistólica del caso 30 +0,12 «=», persona sana entrenada −0,07. La fuerza y el isométrico bajan la RVP y la diastólica, pero no la sistólica.

### Revisión de Fable 5.2 (16 nov 2026)

`docs/revision-fase-5-fable.md`. Aprobada por Edu: 34 correcciones de texto, aviso nuevo «El entrenamiento no trata el tumor» y cuatro cambios del modelo (116 y 117 para el caso 30; 98 de −0,4 a −0,8; 118 nueva; 113 de 50 % a 70 %). No se toca el feocromocitoma con entrenamiento (punto 5): se cuenta en la ficha y en el aviso.

### Límites conocidos de la fase 5

- El modelo no tiene postura: la hipotensión ortostática al terminar con alfabloqueante la cuenta el aviso; el caso 29 solo muestra la RVP por debajo de lo normal.
- La sesión de fuerza no tiene «Al terminar»; en el paciente la presión también baja algo después.
- Feocromocitoma: el esfuerzo no dispara la presión del modelo (la sistólica ya está cerca del tope) y el entrenamiento atenúa el exceso simpático aunque venga del tumor. Lo cuentan los textos y los avisos.
- Los entrenamientos de fuerza e isométrico bajan la RVP y la diastólica, pero no la sistólica.
- La hipotensión postejercicio sale igual en el sano que en el hipertenso; en el paciente es mayor cuanto más alta es la presión de partida.
- El calor y el sudor no son un mando: la deshidratación se ve con el acceso al agua y el aviso.
- Con la rigidez de la edad en tope de escala, el entrenamiento casi no baja la sistólica.

## Siguiente paso: fase 2, prototipo visual

En el modo diseño, en este mismo chat con Opus 5.5: distribución del vaso, las 29 ruedas, el dial de presión, el panel de analítica y el interruptor de escalas de tiempo, en la pantalla externa horizontal y en el móvil en vertical.

## Cambios de la fase 7: lateralidad de la estenosis (17 nov 2026)

Aprobados por Edu el 17 nov 2026. Datos en `src/temas/hipertension/lateralidad.ts`; casos 34 y 35 en `casos.ts`; tests en `tests/lateralidad.test.ts`.

### Variantes de una causa en el motor

- Un nodo de causa puede tener `variantes` (la primera es la de siempre). La estenosis tiene tres: **bilateral** (la de siempre: casos 5 y 15, reto 9), **unilateral** y **riñón único**.
- Una relación puede depender de la variante: con `variante.solo` solo actúa en esas variantes; con `variante.intensidad` cambia su peso. `aplicarVariantes` devuelve el modelo con las variantes elegidas, y `simular` lo aplica siempre (sin elegir, la bilateral). Sin elegir variante, el modelo es exactamente el de antes de la fase 7 (un test lo vigila).
- El riñón único usa las mismas relaciones que la bilateral: solo hay un riñón y está estrecho. Cambian los textos, no las flechas.

### Relaciones

| Relación | Antes | Después (solo unilateral) | Motivo |
| --- | --- | --- | --- |
| 38 · Estenosis → Perfusión renal | −, fuerte (1,0) | −, débil (0,3) | El riñón sano compensa: la perfusión y la filtración de los dos riñones juntos apenas caen |
| 119 (nueva) · Estenosis → Renina | — | +, moderada (0,6), minutos | El barorreceptor del riñón estrecho sigue liberando renina aunque la perfusión de conjunto sea casi normal (PMID 4332626, 16202699) |
| 120 (nueva) · Estenosis → Reabsorción de Na | — | −, débil (0,3), días | El riñón sano, con la presión alta, expulsa el sodio: no hay expansión de volumen (PMID 4332626) |

No hizo falta calibrar: con las intensidades de partida pasan todos los casos. Ningún caso de 1 a 33, ni los retos 1 a 10, ni las notas, ni los valores orientativos se mueven, porque las relaciones nuevas solo actúan en la unilateral. La diuresis del caso 13 sigue en +0,141.

### Casos 34 y 35 (estado estable)

| Caso | Esperado | Modelo |
| --- | --- | --- |
| 34 · Estenosis renal unilateral | PAS ↑, PAD ↑, volemia =, RVP ↑, GC =, renina ↑↑, aldosterona ↑, creatinina =, natremia =, osm. urinaria =, diuresis =, potasio = o ↓, TFG =; en días, volemia y creatinina = y renina ↑↑ | PAS +0,23, volemia 0,00, renina +0,54, aldosterona +0,40, creatinina 0,00, potasio −0,14 |
| 35 · Unilateral con IECA | PAS y PAD = o ↓, renina ↑↑, angiotensina II =, creatinina =, potasio = | PAS −0,04, renina +0,72, angiotensina II +0,08, creatinina +0,13 (menos de la mitad que en el caso 15, +0,43; un test lo vigila) |

### Avisos y reto

- «IECA o ARA-II en la estenosis» (contraindicado) salta solo en la bilateral y en el riñón único. En la unilateral salta uno nuevo de precaución, «Vigilar la creatinina».
- Reto 11: estenosis unilateral, que hay que distinguir del tumor de renina (claves: renina ↑↑, creatinina =, volemia =, PAS ↑).

### Fuentes nuevas (PubMed)

- Brunner HR, Kirshman JD, Sealey JE, Laragh JH. Hypertension of renal origin: evidence for two different mechanisms. Science. 1971;174:1344-6. PMID 4332626 · DOI [10.1126/science.174.4016.1344](https://doi.org/10.1126/science.174.4016.1344)
- Garovic V, Textor SC. Renovascular hypertension: current concepts. Semin Nephrol. 2005;25:261-71. PMID 16202699 · DOI [10.1016/j.semnephrol.2005.02.010](https://doi.org/10.1016/j.semnephrol.2005.02.010)
- Kiyohara Y, et al. Endocrinol Diabetes Metab Case Rep. 2023. Caso clínico: displasia fibromuscular de una rama con renina y aldosterona altas y potasio bajo. PMID 38006656 · DOI [10.1530/EDM-23-0054](https://doi.org/10.1530/EDM-23-0054)
- Ya citadas en `docs/valores-orientativos.md`: Jackson 1986 (PMID 3015794; fracaso renal con IECA en el riñón único y en la bilateral, ninguno en la unilateral) y Hricik 1983 (PMID 6337327).

### Límites conocidos de la fase 7

- Unilateral con ARA-II: la creatinina sube algo (+0,30, ↑), más que con el IECA (+0,13). Es el mismo límite de la fase 4 (el ARA-II sale más potente que el IECA); en el paciente la creatinina de la unilateral apenas cambia con los dos.
- El riñón único se calcula igual que la bilateral y no tiene caso propio en el selector: aparece como «Combinación libre».
- El modelo no distingue el riñón estrecho del sano: la TFG y la perfusión renal son las de los dos riñones juntos.


### Revisión de Fable 5.2 (17 nov 2026)

`docs/revision-fase-7-fable.md`. Aprobada por Edu: 21 correcciones de texto aplicadas con la opción principal. Ningún cambio de modelo. El caso 35 fija ahora la creatinina en «=» (+0,13), que es lo que dicen sus textos. Quedan como observaciones para una revisión futura del modelo: el ARA-II en la unilateral (heredado de la fase 4), la volemia del tumor de renina frente a la de la unilateral (sin fuente) y el potasio de la unilateral (−0,14, a 0,01 de ↓).

## Revisión del nodo edad y de las observaciones de la fase 7 (17 nov 2026)

Aprobada por Edu el 17 nov 2026. Datos en `src/temas/hipertension/edad.ts`; tests en `tests/edad.test.ts` y `tests/notas.test.ts`. Las pruebas se hicieron sobre una copia del modelo, con los 35 casos y los valores de las notas y los retos.

### Motor

`modula` admite `intensidad` y `signo`: factor = máx(0, 1 ± intensidad × origen). Sin ellos, «+» y 1, como antes (la relación 15 no cambia).

### Relación nueva

| Relación | Origen → destino | Signo | Intensidad | Motivo |
| --- | --- | --- | --- | --- |
| 121 · Edad modula 67 y 68 | Edad → (Acceso al agua → Volemia; Acceso al agua → Osmolaridad) | + | 0,5 (con la edad a tope, la falta de agua pesa 1,5 veces) | La persona mayor nota menos la sed y concentra peor la orina: ante la misma falta de agua repone menos y pierde más por la orina (PMID 11528342, 9050029 y 6472364, Phillips 1984: tras 24 h sin agua, más osmolaridad y sodio, menos sed y orina menos concentrada en los mayores). Con acceso libre la 67 y la 68 valen 0: solo actúa cuando falta agua |

Qué cambia (estado estable, edad a tope; entre paréntesis, antes):

| Situación | Natremia | Volemia |
| --- | --- | --- |
| Edad + acceso −0,5 | +0,19 ↑ (+0,12 =) | −0,12 (−0,06) |
| Edad + acceso −0,7 | +0,29 ↑ (+0,17 ↑) | −0,40 (−0,13) |
| Edad + acceso nulo | +0,55 ↑↑ (+0,27 ↑) | −1,00, tope (−0,87) |

Ningún caso de 1 a 35, ni los retos, ni los valores orientativos cambian; la edad sola tampoco (un test lo vigila). La diuresis del caso 13 sigue en +0,141. Cambia el texto de la nota 4 («Menos sed con la edad»), revisado por Fable 5.2 (`docs/revision-edad-fable.md`).

Límites: la sed del simulador no baja con la edad, sube algo (+0,69 frente a +0,57 sin agua) porque la osmolaridad sube más; la nota 4 lo dice. La 121 sale en las fichas de Edad y Volemia, no en la de Osmolaridad plasmática, aunque también refuerza la 68. El efecto visible es la natremia; la volemia solo cambia de flecha con acceso intermedio (−0,7: −0,40 ↓ frente a −0,13 =).

### Probado y descartado

| Cambio probado | Resultado | Por qué no |
| --- | --- | --- |
| La edad atenúa la sed (relaciones 9 y 64, o 13 y 14), hasta 0,8 | Con la edad y acceso −0,7, volemia −0,16 frente a −0,17 sin edad: casi igual | En el modelo la sed apenas compensa un acceso parcial al agua (la 15 la recorta con el acceso), así que atenuarla no se ve. Sin agua, la sed ya no hace beber |
| La edad empeora la natriuresis por presión (relación 70), hasta anularla | Edad y sal: volemia +0,25 → +0,30, sistólica +0,76 → +0,79 | Con la edad la sistólica está cerca del tope de escala y no deja ver la sal. Haría falta recalibrar la edad, y eso rompe el «↑↑» del caso 1. La nota 3 sigue contando el límite |
| ARA-II en la unilateral: sin efecto en la arteriola eferente (74) | Creatinina +0,30 → +0,24 (sigue ↑) | El exceso viene de que el ARA-II baja más la presión y la perfusión renal la sigue (39) |
| ARA-II más suave (0,25 en lugar de 0,35) | Unilateral con ARA-II igual que con IECA (creatinina +0,13) | Rompe el caso 17: el tumor de renina con ARA-II deja la sistólica en +0,23 |
| Autorregulación renal más fuerte (39 de 1,5 a 1,0 o 1,2) | El ARA-II no cambia | Rompe los casos 4 y 9 |

Sin cambio, con motivo: la **volemia del tumor de renina** (+0,24, frente a 0,00 en la unilateral) no tiene fuente para igualarla y el reto 11 se apoya en esa diferencia; el **potasio de la unilateral** (−0,14) se queda en «=»: en PubMed solo hay casos clínicos aislados con potasio bajo, ninguna frecuencia, y el caso 34 admite «= o ↓». El límite del ARA-II sigue contado en el aviso «Vigilar la creatinina».
