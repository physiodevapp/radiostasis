# Natremia — Fase N1: propuesta de alcance y modelo fisiológico (v0.1)

20 nov 2026 · Propuesta para que la valide Edu. **No hay código**: nada se construye hasta su visto bueno. Los textos docentes (notas, matices, fichas) se revisan después con Fable 5.2 en una sesión aparte.

## Resumen

El segundo tema del motor enseña **por qué baja o sube el sodio en sangre**. La idea central, que el tema de hipertensión no podía enseñar, es que **la natremia es una concentración**: depende del agua corporal tanto como del sodio, y el volumen extracelular (los edemas, la deshidratación del espacio vascular) va por otro lado. Por eso el modelo separa dos balances, el del **agua** y el del **sodio**, y la natremia sale de su cociente.

Propuesta: **10 ruedas de causa, 15 mecanismos, 5 salidas y 9 valores de analítica**, unidos por **64 relaciones** (35 reutilizadas del tema de hipertensión y 29 nuevas), y **12 casos** con sus resultados esperados, que serán la batería de tests.

Todo lo que entra viene de PubMed. Las relaciones reutilizadas conservan sus PMID y frases ya cotejadas (`docs/fuentes.md`). Las nuevas llevan PMID comprobados en PubMed (título, autores, revista y año, con E-utilities el 20 nov 2026) y una frase candidata del resumen; el cotejo con el script, como en la hipertensión, se hace al construir. **Cinco relaciones tienen un respaldo débil o indirecto** y están marcadas: no entran sin que Edu las valide o se encuentre un artículo mejor.

## Alcance propuesto

### Qué entra en la primera versión

| Bloque | Contenido |
| --- | --- |
| Hiponatremia hipotónica | Las tres familias por el volumen extracelular: hipovolémica (pérdidas digestivas, insuficiencia suprarrenal), euvolémica (SIADH, polidipsia, poca ingesta de solutos) e hipervolémica (insuficiencia cardíaca o cirrosis) |
| Hipernatremia | Falta de agua (acceso, edad), diabetes insípida central y nefrogénica, diuresis osmótica |
| Hiponatremia no hipotónica | La hiperglucemia: sodio bajo con osmolaridad alta |
| Cerebro | Volumen de las neuronas y su adaptación (osmolitos): por qué la hiponatremia aguda es más peligrosa que la crónica |
| Analítica del diagnóstico | Natremia, osmolaridad plasmática, osmolaridad urinaria y sodio urinario: las cuatro pruebas del algoritmo diagnóstico (PMID 28174217) |

### Qué queda para fases posteriores

| Fase | Contenido | Por qué después |
| --- | --- | --- |
| N6 · Tratamientos | Suero salino 0,9 %, salino hipertónico, restricción hídrica, vaptanes, desmopresina, urea; **tiazida y diurético de asa** (reutilizando los mandos de la fase 4); velocidad de corrección y desmielinización osmótica | Necesitan una escala de tiempo «horas» y un aviso de corrección rápida; mejor con el tema ya calibrado |
| N7 · Ejercicio | **Hiponatremia asociada al ejercicio** (beber de más en pruebas de resistencia, ADH no osmótica; PMID 32097926 y 26102445) | Muy útil en fisioterapia; reutiliza la mecánica de sesión de la fase 5 |
| N8 · Uso docente | Retos, valores orientativos (mmol/L), notas de interacción, compartir por enlace | Igual que la fase 6 de hipertensión |
| Fuera | Pseudohiponatremia (lípidos, proteínas: es un artefacto del laboratorio, no fisiología), síndrome pierde sal cerebral (discutido), hipotiroidismo (su papel en la hiponatremia es discutido), potomanía como causa separada (se monta con dos ruedas) | Ver «Límites conocidos» |

**Tiazida en la primera versión o en N6.** Es la causa farmacológica más frecuente de hiponatremia. La propongo en N6, junto al asa, porque el contraste entre las dos (la tiazida baja el sodio; el asa mucho menos, porque impide concentrar la orina) es una lección en sí misma. Si Edu la quiere ya, entra como modificador reutilizado de la fase 4 con dos relaciones nuevas.

## Esquema: qué cambia respecto a la hipertensión

En la hipertensión, la volemia es un único acumulador de agua y la osmolaridad plasmática es un nodo de suma que empujan la sal, la sed y la reabsorción de agua. Bastaba para enseñar que la sal sube la presión y que el SIADH da hiponatremia, pero no puede separar volumen y concentración. En la natremia:

| Concepto | Hipertensión | Natremia (propuesta) |
| --- | --- | --- |
| Agua | Implícita en la volemia | **Agua corporal total**: acumulador (lo que se bebe menos lo que se orina y se pierde) |
| Sodio | No existe como cantidad | **Sodio corporal**: acumulador (lo que se ingiere menos lo que se excreta o se pierde) |
| Natremia | Sigue a la osmolaridad (relación 20) | Sube con el sodio corporal y baja con el agua corporal (relación de Edelman, PMID 13575523) |
| Osmolaridad plasmática | Nodo que empujan la sal, la sed y el riñón | Sale de la natremia y de la glucosa: es la **tonicidad** que leen los osmorreceptores |
| Volumen | Volemia | **Volumen extracelular** (sigue al sodio: edemas o deshidratación extracelular) y **volumen circulante efectivo** (lo que «ven» los barorreceptores) |

Esto respalda la distinción clásica entre **deshidratación** (falta de agua, sodio alto) y **depleción de volumen** (falta de sodio, volumen extracelular bajo): Mange et al., PMID 9382413.

## Nodos

### Causas: 10 ruedas

| Id | Rueda | Rango y extremos | Frecuencia | Reutilizada |
| --- | --- | --- | --- | --- |
| C1 | Acceso al agua | −1 nulo → 0 libre | Común | Sí (`accesoAgua`, C12 de hipertensión) |
| C2 | Polidipsia primaria | 0 → +1 | Poco frecuente | Nueva |
| C3 | Ingesta de sal y solutos | −1 baja («té con tostadas», cerveza) → +1 alta | Común | Sí (`sal`, C3), con texto propio del tema |
| C4 | Secreción de ADH autónoma | −1 diabetes insípida central → +1 SIADH | DI rara · SIADH poco frecuente | Sí (`adhAutonoma`, C5) |
| C5 | Diabetes insípida nefrogénica (litio, hipercalcemia, genética) | 0 → +1 | Rara | Nueva |
| C6 | Pérdidas digestivas (vómitos, diarrea) | 0 → +1 | Común | Nueva |
| C7 | Insuficiencia cardíaca o cirrosis | 0 → +1 | Común | Nueva |
| C8 | Insuficiencia suprarrenal primaria | 0 → +1 | Rara | Nueva |
| C9 | Hiperglucemia | 0 → +1 | Común | Nueva |
| C10 | Edad | 0 joven → +1 mayor | Común | Sí (`edad`, C1) |

C7 junta insuficiencia cardíaca y cirrosis porque comparten el mecanismo: el volumen circulante efectivo baja aunque sobre líquido (Schrier, PMID 2193561 y 3050523). Si Edu prefiere separarlas, la cirrosis añadiría la vasodilatación arterial (RVP baja), que hoy no está en el tema.

La frecuencia sigue el criterio de la hipertensión (con qué frecuencia se ve en la práctica clínica) y la revisa Fable 5.2.

### Mecanismos: 15 ruedas que se mueven solas

| Id | Rueda | Reutilizado |
| --- | --- | --- |
| M1 | Osmolaridad plasmática efectiva (tonicidad) | Sí (`osmP`), pero cambia su cálculo (ver «Qué necesita el motor») |
| M2 | ADH (vasopresina) | Sí |
| M3 | Sed | Sí |
| M4 | Renina | Sí |
| M5 | Angiotensina II | Sí |
| M6 | Aldosterona | Sí |
| M7 | Actividad mineralocorticoide | Sí |
| M8 | Actividad simpática | Sí |
| M9 | Perfusión renal | Sí |
| M10 | TFG | Sí |
| M11 | Reabsorción tubular de Na | Sí |
| M12 | Reabsorción de agua | Sí |
| M13 | Diuresis | Sí |
| M14 | Volumen circulante efectivo | Nuevo |
| M15 | Osmolitos neuronales | Nuevo: solutos que la neurona pierde o gana para defender su volumen (lento) |

Quedan fuera los mecanismos hemodinámicos de la hipertensión (frecuencia, contractilidad, rigidez, placa): no mueven el sodio.

### Salidas: 5 indicadores

| Id | Indicador | Cálculo | Qué lo determina |
| --- | --- | --- | --- |
| S1 | Agua corporal total | Acumulador | Bebida (sed, polidipsia, acceso) menos diuresis y pérdidas |
| S2 | Sodio corporal | Acumulador | Ingesta de sal menos natriuresis y pérdidas digestivas |
| S3 | Volumen extracelular | Suma | Sigue al sodio corporal; algo al agua |
| S4 | Natremia | Suma | Sodio corporal (+), agua corporal (−), glucosa (−) |
| S5 | Volumen neuronal | Suma | Baja con la tonicidad; los osmolitos lo devuelven a lo normal con el tiempo |

La vista (fase N4) dibujaría tres compartimentos —célula, intersticio y vaso— con la neurona que se hincha o se encoge. Se diseña aparte (ver «Cambios de modelo o de sesión»).

### Analítica: 9 valores

| Id | Valor | Qué lo mueve | Propio o reflejo |
| --- | --- | --- | --- |
| A1 | Natremia | S4 | Salida |
| A2 | Osmolaridad plasmática | M1 | Mecanismo |
| A3 | Osmolaridad urinaria | Reabsorción de agua | Nodo propio (reutilizado `osmU`) |
| A4 | Sodio urinario | Baja con la reabsorción de Na | **Nodo nuevo** |
| A5 | Potasio | Actividad mineralocorticoide, TFG, pérdidas digestivas | Reutilizado |
| A6 | Creatinina | TFG por debajo de −0,3 | Reutilizado |
| A7 | Glucemia | Rueda C9 | Refleja la causa |
| A8 | Diuresis | M13 | Mecanismo |
| A9 | Renina | M4 | Mecanismo |

La ADH (en la clínica, la copeptina) se ve como mecanismo; si Edu quiere, puede ir también en el panel.

## Relaciones

Escalas de tiempo, intensidades y umbrales como en la hipertensión: débil 0,3 · moderada 0,6 · fuerte 1,0; minutos · días · estado estable. **Las nuevas se numeran desde la 201** para que nunca coincidan con las de la hipertensión. Las reutilizadas conservan su número y sus PMID; las marcadas con \* cambian de origen o de destino porque el nodo de la hipertensión se divide (p. ej. la 63 sale del volumen circulante efectivo en lugar de la volemia). Las intensidades son de partida: se ajustan en la calibración, como en la fase 3a, y se informa a Edu en una tabla.

### Balance de agua

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 13\* | Sed → Agua corporal | + | Moderada | Días | 18843231, 14739394 | Beber repone agua |
| 15\* | Acceso al agua ⊗ 13 | modula | — | — | 12152926, 14739394, 20646222 | Sin acceso al agua, la sed no se traduce en ingesta |
| 67\* | Acceso al agua → Agua corporal | + | Fuerte | Días | 20646222, 4750450 | Sin ingesta se sigue perdiendo agua por la piel, la respiración y la orina |
| 121\* | Edad ⊗ 67 | modula (+0,5) | — | — | 11528342, 9050029, 6472364 | Con los años se nota menos la sed: la misma falta de agua deshidrata más |
| 201 | Polidipsia primaria → Agua corporal | + | Fuerte | Días | 33222764, 29120013 | Se bebe por encima de la sed |
| 19\* | Diuresis → Agua corporal | − | Fuerte | Días | 2063193 | Lo que se orina sale del agua corporal |
| 202 | Pérdidas digestivas → Agua corporal | − | Moderada | Días | 9382413, 20309584 ⚠ | Vómitos y diarrea pierden agua con sodio |
| 203 | Hiperglucemia → Diuresis | + | Moderada | Días | 38610721, 30203382 | Diuresis osmótica: la glucosa filtrada arrastra agua |

### Balance de sodio

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 204 | Ingesta de sal → Sodio corporal | + | Moderada | Días | 23096366, 16599862 | Más sal ingerida, más sodio corporal hasta que el riñón la iguala |
| 205 | Reabsorción de Na → Sodio corporal | + | Fuerte | Días | 2063193, 16599862 | El sodio que no se excreta se queda |
| 206 | Pérdidas digestivas → Sodio corporal | − | Fuerte | Días | 9382413, 20309584 ⚠ | Depleción de volumen: pérdida neta de sodio |

### Concentración y volúmenes

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 207 | Sodio corporal → Natremia | + | Fuerte | Minutos | 41692632, 13575523 | La natremia depende del sodio (y del potasio) intercambiable… |
| 208 | Agua corporal → Natremia | − | Fuerte | Minutos | 41692632, 41087199, 41176477 | …dividido por el agua corporal total |
| 209 | Hiperglucemia → Natremia | − | Moderada | Minutos | 10225241, 38610721 | La glucosa saca agua de las células y diluye el sodio |
| 210 | Natremia → Osmolaridad plasmática | + | Fuerte | Minutos | 16599862 (y 35779183, 27156756 de la 20) | El sodio es el principal soluto del plasma |
| 211 | Hiperglucemia → Osmolaridad plasmática | + | Moderada | Minutos | 38610721, 28174217 | La glucosa es un soluto eficaz: hiponatremia con osmolaridad alta |
| 212 | Sodio corporal → Volumen extracelular | + | Fuerte | Minutos | 16599862, 23096366 | El sodio retenido retiene agua y expande el extracelular sin cambiar la osmolaridad |
| 213 | Agua corporal → Volumen extracelular | + | Débil | Minutos | 16843081 | El agua retenida se reparte por todos los compartimentos; al extracelular le toca poca |
| 214 | Volumen extracelular → Volumen circulante efectivo | + | Fuerte | Minutos | 2193561, 21852582 | En la persona sana, más extracelular llena más el árbol arterial |
| 215 | Insuficiencia cardíaca o cirrosis → Volumen circulante efectivo | − | Fuerte | Minutos | 2193561, 3050523 | Gasto bajo o vasodilatación arterial: el árbol arterial queda poco lleno |
| 216 | Insuficiencia cardíaca o cirrosis ⊗ 214 | modula (−0,7) | — | — | 2193561, 21852582 | El líquido retenido va a edemas y ascitis y no llena las arterias |

### ADH y sed

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 8 | Osmolaridad → ADH | + | Fuerte | Minutos | 18509340, 4750450 | Osmorreceptores → hipotálamo |
| 9 | Osmolaridad → Sed | + | Fuerte | Minutos | 14739394 | Los mismos osmorreceptores activan la sed |
| 10 | ADH autónoma → ADH | fija | — | — | 17507705, 31395885, 36974717, 38693275 | SIADH o diabetes insípida central |
| 63\* | Volumen circulante efectivo → ADH | − | Moderada (fuerte por debajo de 0) | Minutos | 4750450, 18671303 | ADH no osmótica: con poco volumen efectivo se libera aunque la osmolaridad sea baja |
| 64\* | Volumen circulante efectivo → Sed | − | Moderada | Minutos | 14739394 | Con poco volumen hay sed |
| 30 | Angiotensina II → ADH | + | Débil | Minutos | 15089972, 32736759 | Activa el hipotálamo |
| 31 | Angiotensina II → Sed | + | Débil | Minutos | 9674690, 14739394 | Activa el centro de la sed |
| 217 | Pérdidas digestivas → ADH | + | Débil | Minutos | 16322164, 20309584 | Náuseas y vómitos estimulan la ADH por sí mismos |
| 218 | Insuficiencia suprarrenal → ADH | + | Moderada | Días | 2548097 | Sin cortisol, la ADH se libera de más |
| 11 | ADH → Reabsorción de agua | + | Fuerte | Minutos | 11773613 | Acuaporinas en el colector |
| 219 | Diabetes insípida nefrogénica ⊗ 11 | modula (−1) | — | — | 26077742 | El colector no responde a la ADH |
| 220 | Edad ⊗ 11 | modula (−0,3) | — | — | 6472364, 11528342 | El riñón del mayor concentra peor la orina |
| 75\* | Volumen circulante efectivo → Reabsorción de agua | − | Moderada, solo por encima de 0 | Estable | 16843081 (y los de la 75) | Escape de la antidiuresis: baja la acuaporina 2 aunque la ADH siga alta |
| 16 | Reabsorción de agua → Diuresis | − | Fuerte | Minutos | 11773613, 31395885 | Menos agua en la orina |
| 18 | Reabsorción de agua → Osmolaridad urinaria | + | Fuerte | Minutos | 11773613, 31395885 | La orina se concentra |
| 221 | Ingesta de solutos ⊗ 16 | modula (+0,6) | — | — | 18337482, 9631849 | Sin solutos que excretar, el riñón no puede eliminar mucha agua aunque la ADH esté suprimida |

### Riñón, sodio y sistema renina-angiotensina-aldosterona

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 21 | Perfusión renal → Renina | − | Fuerte | Minutos | 24944035, 20360309 | Barorreceptor de la aferente |
| 22 | TFG → Renina | − | Moderada | Minutos | 20360309 | Mácula densa |
| 69\* | Volumen circulante efectivo → Renina | − | Moderada | Días | 24944035, 20360309, 23096366 | El volumen es el principal regulador de la renina |
| 23 | Simpático → Renina | + | Fuerte | Minutos | 20360309 | β1 yuxtaglomerulares |
| 77\* | Volumen circulante efectivo → Simpático | − | Moderada, por debajo de −0,4 | Días | (los de la 77) | Reflejo de volumen bajo |
| 26 | Renina → Angiotensina II | + | Fuerte | Minutos | 17970613 | Cascada |
| 28 | Angiotensina II → Aldosterona | + | Fuerte (moderada por debajo de 0) | Días | 10619573, 17970613 | Corteza suprarrenal |
| 73 | Potasio → Aldosterona | + | Moderada | Días | 1167307, 15044681 | El K alto estimula la aldosterona |
| 222 | Insuficiencia suprarrenal → Aldosterona | − | Fuerte | Minutos | 40982814, 26760044 | La corteza destruida no fabrica aldosterona |
| 223 | Insuficiencia suprarrenal ⊗ 28 y 73 | modula (−1) | — | — | 40982814 | Ni la angiotensina ni el potasio pueden estimularla |
| 34 | Aldosterona → Actividad mineralocorticoide | + | Fuerte | Días | 29982819, 25540145 | Receptor renal |
| 29 | Angiotensina II → Reabsorción de Na | + | Moderada | Días | 12642017, 17878513 | Transportadores tubulares |
| 36 | Actividad mineralocorticoide → Reabsorción de Na | + | Fuerte | Días | 25540145 | Canales y bombas del colector |
| 37 | Actividad mineralocorticoide → Potasio | − | Moderada (umbral 0,2) | Días | 25903070, 25540145 | Se secreta K a cambio de Na |
| 81 | Actividad mineralocorticoide → Potasio | − | Moderada (umbral −0,3) | Días | (los de la 81) | Sin aldosterona el K sube |
| 224 | Volumen circulante efectivo → Reabsorción de Na | − | Moderada | Días | 16843081, 2034926 | Natriuresis por volumen: el escape del sodio en el SIADH |
| 76\* | Volumen circulante efectivo → Perfusión renal | + | Solo por debajo de 0 (0,6) | Días | (los de la 76) | Azotemia prerrenal |
| 40 | Perfusión renal → TFG | + | Fuerte | Minutos | 8574595, 25834230 | Menos flujo, menos filtración |
| 42 | TFG → Diuresis | + | Moderada | Minutos | 28271233, 25098598 | Se filtra menos |
| 43 | Reabsorción de Na → Diuresis | − | Moderada | Días | 26240596, 2063193 | El agua sigue al Na |
| 45 | TFG → Creatinina | − | Fuerte (umbral −0,3) | Días | 27647862, 1394976 | Marcador de filtración |
| 66 | TFG → Potasio | − | Moderada (umbral −0,3) | Estable | 19546417 | Se excreta menos K |
| 225 | Reabsorción de Na → Sodio urinario | − | Fuerte | Minutos | 3674097, 41087199 | Sodio urinario bajo cuando el riñón retiene (hipovolemia, edemas); alto en el SIADH y la insuficiencia suprarrenal |
| 226 | Pérdidas digestivas → Potasio | − | Moderada | Días | 39161253 ⚠ | La diarrea pierde potasio |

### Cerebro

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 227 | Osmolaridad → Volumen neuronal | − | Fuerte | Minutos | 41176477, 24074529, 20417691 | Con tonicidad baja entra agua en las neuronas (edema); con alta sale |
| 228 | Osmolaridad → Osmolitos neuronales | + | Fuerte | Estable | 30554800, 20417691 | La neurona pierde osmolitos en la hiponatremia y los acumula en la hipernatremia |
| 229 | Osmolitos neuronales → Volumen neuronal | + | Fuerte | Estable | 30554800, 20417691 | Así recupera su volumen: la hiponatremia crónica da menos síntomas, y corregirla deprisa daña (24074529) |

### Relaciones de la hipertensión que no pasan a la natremia

| # | Relación | Por qué no |
| --- | --- | --- |
| 7, 14, 17, 20, 44, 68 | Empujan directamente la osmolaridad o la natremia | Aquí salen de los balances de agua y sodio (207–211). Es el cambio de estructura del tema |
| 1–6, 12, 24, 25, 27, 33, 35, 38, 39, 41, 46–62, 65, 70–72, 74, 78, 79 | Vasos, corazón, presión y causas propias de la hipertensión | No mueven el sodio. Si se combinan los temas (ver más abajo), siguen en el suyo |

### Relaciones con respaldo débil (⚠)

| # | Problema | Propuesta |
| --- | --- | --- |
| 202, 206 | Los artículos hablan de depleción de volumen y de gastroenteritis, pero ninguna frase dice literalmente «la diarrea pierde sodio y agua» | Buscar una revisión de pérdidas digestivas con resumen; si no la hay, Edu la valida como supuesto |
| 226 | La frase de 39161253 solo menciona la diarrea como causa frecuente de hipopotasemia, de pasada | Igual |
| 207 | Edelman 1958 (13575523) no tiene resumen: hay que leer el texto completo en PubMed Central (PMC1062793), que es un escaneo | La 41692632 la respalda sola mientras tanto |
| 222, 223 | 40982814 es una revista de psiquiatría; la guía 26760044 no lo dice en el resumen | Buscar una revisión endocrinológica con la frase sobre la aldosterona |

## Frases candidatas de los artículos nuevos

Frases literales de los resúmenes de PubMed (leídos el 20 nov 2026). Al construir se cotejan con el script y pasan a `fuentes.ts`.

| PMID | Artículo | Frase | Relaciones |
| --- | --- | --- | --- |
| 41692632 | Pathophysiology of different etiologies (Best Pract Res Clin Endocrinol Metab 2026) | «Hyponatremia can occur by an increase in total body water (TBW), a decrease in body Na+ or K+, or any combination of these.» · «a low serum [Na+] can be associated with a decreased, normal, or increased ECF volume» | 207, 208 |
| 41087199 | Diagnostic algorithm of hyponatremia (2026) | «It is driven by an excess of free water relative to total body sodium.» · «The most common cause of hyponatremia is the syndrome of inappropriate diuresis, characterised by inappropriate arginine vasopressin activity resulting a high urine osmolality and high urine sodium concentration.» | 208, 225 |
| 41176477 | Pathophysiology and aetiologies of hypernatremia (2026) | «It reflects a relative deficiency of free water rather than sodium excess.» · «The resultant hyperosmolality causes osmotic efflux of water from brain cells, leading to cerebral shrinkage» | 208, 227 |
| 16599862 | Osmolar disorders (Crit Care Resusc 1999) | «An increase (or decrease) in total body sodium is associated with retention (or excretion) of body water, an increase (or decrease) in the extracellular fluid (ECF) volume, and no change in plasma osmolality.» · «plasma osmolality is determined largely by the concentration of sodium» | 204, 205, 210, 212 |
| 23096366 | Renal renin secretion (Pflugers Arch 2013) | «Close associations exist between sodium intake, total body sodium, extracellular fluid volume, and blood volume.» · «volume-mediated regulation of renin secretion is the primary regulator» | 204, 212, 69 |
| 9382413 | Dehydration versus volume depletion (Ann Intern Med 1997) | «Dehydration largely refers to intracellular water deficits stemming from hypertonicity» · «volume depletion describes the net loss of total body sodium and a reduction in intravascular volume» | 202, 206, matiz N2 |
| 2193561 | Schrier, unifying hypothesis (Ann Intern Med 1990) | «With a decrease in effective arterial blood volume (EABV) initiated by either decreased cardiac output or peripheral arterial vasodilation» · «neither total extracellular fluid volume nor total blood volume are determinants of renal sodium and water excretion» | 214, 215, 216 |
| 3050523 | Schrier (N Engl J Med 1988) | «either a fall in cardiac output or peripheral arterial vasodilatation may diminish arterial vascular filling and thereby initiate a series of hemodynamic and hormonal events that result in renal sodium and water retention» | 215 |
| 21852582 | Urinary sodium, chloride, urea and flow (J Am Soc Nephrol 2011) | «arterial underfilling in causing prerenal azotemia in the presence of an increase in total body sodium and extracellular fluid expansion» | 214, 216 |
| 18671303 | Hyponatremia in cirrhosis (Hepatology 2008) | «a retention of water that is disproportionate to the retention of sodium» · «nonosmotic hypersecretion of arginine vasopressin … related to circulatory dysfunction» | 63, caso 7 |
| 16843081 | Escape from antidiuresis (Am J Med 2006) | «escape from antidiuresis is caused by downregulation of kidney aquaporin-2 expression despite high AVP plasma levels» · «solute losses occur through the secondary natriuresis induced by water retention» | 75, 213, 224 |
| 2034926 | Effective arterial blood volume and proximal reabsorption (Semin Nephrol 1991) | «effective arterial volume is able to regulate the transport of NaCl … in the proximal tubule» | 224 |
| 3674097 | Urine sodium in hyponatremia (Am J Med 1987) | «the concentration of sodium in a spot urine sample clearly separated hypovolemic (mean UNa = 18.4 …) from normovolemic (mean UNa = 72 …) hyponatremic patients» | 225 |
| 33222764 | Primary polydipsia: update (2020) | «In primary polydipsia pathologically high levels of water intake physiologically lower arginine vasopressin (AVP) secretion» | 201 |
| 29120013 | Primary polydipsia (Swiss Med Wkly 2017) | «factors reducing the renal excretory capacity of the kidney such as acute illness, medications or low solute intake may accumulate in hyponatraemia» | 201, 221 |
| 18337482 | Solute intake and water excretion (J Am Soc Nephrol 2008) | «a decrement in solute intake markedly reduces the above-mentioned flexibility and puts the individual at risk for the unexpected development of hyponatremia» | 221 |
| 9631849 | «Beer potomania» in non-beer drinkers (Am J Kidney Dis 1998) | «the very low intake of solute limited her water excretion and caused the hyponatremia despite only a modest increase in fluid intake» | 221, caso 5 |
| 26077742 | Nephrogenic diabetes insipidus (Nat Rev Nephrol 2015) | «In nephrogenic diabetes insipidus (NDI), inability of the kidneys to respond to AVP results in functional AQP deficiency.» | 219 |
| 2548097 | Hypopituitarism and vasopressin (N Engl J Med 1989) | «ACTH deficiency may cause the syndrome of inappropriate secretion of antidiuretic hormone» · «The beneficial effect of hydrocortisone is probably exerted through the suppression of vasopressin secretion.» | 218 |
| 40982814 | Addison's disease (Psychiatr Danub 2025) ⚠ | «Aldosterone deficiency leads to dysregulation of sodium and potassium homeostasis» | 222, 223 |
| 42966941 | Addison's disease mimicking cerebral salt wasting (Cureus 2026) | «elevated urinary sodium as expected in Addison's disease» | caso 8 |
| 16322164 | ADH in children with gastroenteritis (Pediatrics 2005) | «The nonosmotic stimuli of ADH secretion that we identified were vomiting (50 of 52), dehydration» | 217 |
| 20309584 | Fluids in gastroenteritis (Pediatr Nephrol 2010) | «a state of arginine vasopressin (AVP) excess due to both hemodynamic stimuli from volume depletion and non-hemodynamic stimuli such as nausea and vomiting» · «Free water will be retained until the volume deficit is corrected» | 63, 217, caso 6 |
| 10225241 | Correction factor for hyperglycemia (Am J Med 1999) | «the mean decrease in serum sodium concentration averaged 2.4 meq/L for every 100 mg/dL increase in glucose concentration» | 209 |
| 38610721 | Hypernatremia in hyperglycemia (J Clin Med 2024) | «the fluid exit from the intracellular compartment and thirst, which cause [Na]S decreases» · «osmotic diuresis … results in a [Na]S increase» | 203, 209, 211, caso 9 |
| 30203382 | Dysnatremias in cirrhosis (Hepatol Int 2018) | «Hypernatremia usually follows hypotonic fluid losses due to osmotic diuresis (glycosuria)» | 203 |
| 28174217 | Compilation of the guidelines (J Am Soc Nephrol 2017) | «the initial step is to differentiate hypotonic from nonhypotonic hyponatremia» · «further differentiated on the basis of urine osmolality, urine sodium level, and volume status» | 211, analítica |
| 30554800 | Allostasis in chronic hyponatremia (Am J Kidney Dis 2019) | «To avoid intolerable changes in their volume, cells export organic osmolytes when exposed to a low serum sodium concentration and accumulate these intracellular solutes when serum sodium concentration increases.» | 228, 229 |
| 20417691 | Brain volume regulation (Neuroscience 2010) | «brain edema during hypoosmolar states and brain dehydration during hyperosmolar states» | 227, 228 |
| 24074529 | Expert panel recommendations (Am J Med 2013) | «Untreated acute hyponatremia can cause substantial morbidity and mortality as a result of osmotically induced cerebral edema, and excessively rapid correction of chronic hyponatremia can cause severe neurologic impairment» | 227, 229 |
| 39161253 | Beta-lactam-associated hypokalemia (2024) ⚠ | «other causes of hypokalemia are likely to be diagnosed more frequently (e.g., due to diuretic therapy or diarrhea)» | 226 |
| 4750450 | Dunn 1973 (ya en la bibliografía) | «did not become significant until volume had decreased by 8% or more» | 63 (asimetría) |

Para las fases N6 y N7 ya hay candidatos comprobados: 32097926 y 26102445 (hiponatremia del ejercicio), 18550938 y 29637415 (tiazidas), 24569125 (guía europea), 3713747 (desmielinización osmótica).

## Casos y resultados esperados (batería de tests)

En **estado estable** salvo que se indique; entre paréntesis, lo que cambia en otra escala o con otro ajuste. Flechas con los umbrales de siempre (= por debajo de 0,15 · ↑/↓ hasta 0,5 · ↑↑/↓↓ desde 0,5).

### Agua, sodio y volumen

| Caso | Ruedas | Agua corporal | Sodio corporal | Vol. extracelular | Vol. circulante efectivo | Natremia | Osmolaridad | Vol. neuronal |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. SIADH | ADH autónoma +1 | ↑ | = o ↓ | = o ↑ | = o ↑ | ↓↓ | ↓↓ | = o ↑ (↑↑ en días) |
| 2. Diabetes insípida central | ADH autónoma −1 | = o ↓ (↓↓ sin agua) | = | = o ↓ (↓ sin agua) | = o ↓ | = o ↑ (↑↑ sin agua) | = o ↑ | = (↓↓ sin agua, en días) |
| 3. Diabetes insípida nefrogénica | DI nefrogénica +1 | = o ↓ | = | = o ↓ | = o ↓ | = o ↑ | = o ↑ | = |
| 4. Polidipsia primaria | Polidipsia +1 | = o ↑ | = | = | = | = o ↓ | = o ↓ | = |
| 5. Poca ingesta de solutos | Polidipsia +0,6, solutos −1 | ↑ | = o ↓ | = | = | ↓↓ | ↓↓ | = o ↑ (↑↑ en días) |
| 6. Vómitos o diarrea | Pérdidas +1 | ↓ | ↓↓ | ↓↓ | ↓↓ | ↓ (↑ sin agua) | ↓ (↑ sin agua) | = o ↑ |
| 7. Insuficiencia cardíaca o cirrosis | IC/cirrosis +1 | ↑↑ | ↑↑ | ↑↑ | ↓ | ↓ | ↓ | = |
| 8. Insuficiencia suprarrenal primaria | Suprarrenal +1 | = o ↓ | ↓ | ↓ | ↓ | ↓ | ↓ | = o ↑ |
| 9. Hiperglucemia | Glucosa +1 | ↓ | = o ↓ | ↓ | ↓ | = o ↓ (↓ en minutos) | ↑↑ | ↓ (↓↓ en minutos) |
| 10. Falta de agua | Acceso −1 | ↓↓ | = | ↓ | ↓ | ↑↑ | ↑↑ | = o ↓ (↓↓ en días) |
| 11. Falta de agua en el mayor | Acceso −0,5, edad +1 | ↓↓ | = | ↓ | ↓ | ↑↑ (↑ con edad 0) | ↑↑ | = o ↓ |
| 12. Dieta alta en sal | Sal +1 | ↑ | ↑ | ↑ | ↑ | = o ↑ | = o ↑ | = |

### Hormonas y analítica

| Caso | ADH | Sed | Renina | Aldosterona | Osm. urinaria | Na urinario | Diuresis | Potasio | Creatinina |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. SIADH | ↑↑ | ↓ | ↓ | = o ↓ | ↑↑ | ↑ | ↓ | = | = |
| 2. Diabetes insípida central | ↓↓ | ↑↑ | = o ↑ | = o ↑ | ↓↓ | ↓ | ↑↑ | = | = (↑ sin agua) |
| 3. Diabetes insípida nefrogénica | **↑** | ↑↑ | = o ↑ | = o ↑ | ↓↓ | ↓ | ↑↑ | = | = |
| 4. Polidipsia primaria | ↓↓ | ↓ | = o ↓ | = o ↓ | ↓↓ | ↓ | ↑↑ | = | = |
| 5. Poca ingesta de solutos | ↓↓ | ↓ | = | = | ↓↓ | ↓↓ | ↑ (menos que en el 4) | = | = |
| 6. Vómitos o diarrea | ↑ | ↑ | ↑↑ | ↑↑ | ↑ | ↓↓ | ↓ | ↓ | ↑ |
| 7. Insuficiencia cardíaca o cirrosis | ↑ | ↑ | ↑↑ | ↑↑ | ↑ | ↓↓ | ↓ | = o ↓ | = o ↑ |
| 8. Insuficiencia suprarrenal primaria | ↑ | ↑ | ↑↑ | **↓↓** | ↑ | **↑** | = | ↑ | = o ↑ |
| 9. Hiperglucemia | ↑ | ↑↑ | ↑ | ↑ | = o ↑ | = | ↑↑ | = | = o ↑ |
| 10. Falta de agua | ↑↑ | ↑↑ | ↑ | ↑ | ↑↑ | = o ↑ | ↓↓ | = | ↑ |
| 11. Falta de agua en el mayor | ↑↑ | ↑ | ↑ | ↑ | ↑ (menos que en el 10) | = o ↑ | ↓↓ | = | ↑ |
| 12. Dieta alta en sal | = o ↑ | = o ↑ | ↓ | ↓ | ↑ | ↑↑ | = | = | = |

**Las parejas que mejor enseñan a diferenciar:**

- **Diabetes insípida central frente a nefrogénica** (2 y 3): todo igual salvo la ADH, baja en la central y alta en la nefrogénica.
- **Vómitos o diarrea frente a insuficiencia suprarrenal** (6 y 8): las dos son hipovolémicas con natremia baja, pero el sodio urinario es bajo en la primera (el riñón retiene) y alto en la segunda (sin aldosterona no puede); el potasio va al revés.
- **SIADH frente a vómitos** (1 y 6): sodio urinario alto en el SIADH y bajo en la hipovolemia (PMID 3674097).
- **SIADH frente a insuficiencia cardíaca** (1 y 7): las dos con ADH alta y natremia baja; volumen extracelular normal en una y edemas en la otra.
- **Polidipsia con o sin solutos** (4 y 5): el mismo exceso de agua solo baja mucho la natremia cuando faltan solutos.
- **Vómitos con o sin agua** (6 y su ajuste): la misma pérdida da hiponatremia si se bebe agua y hipernatremia si no.
- **Sal frente a agua** (12 frente a 10): la sal cambia el volumen; el agua cambia la natremia.

### Notas «La fisiología» (borrador; las revisa Fable 5.2)

| Caso | Nota |
| --- | --- |
| 1 | El SIADH retiene agua, no sodio: la natremia cae mucho y el volumen extracelular apenas sube, porque el riñón escapa (pierde sodio y responde menos a la ADH). Por eso no hay edemas |
| 3 | La diabetes insípida nefrogénica se parece a la central en todo menos en la ADH, que está alta: el riñón no la oye |
| 5 | El riñón solo puede eliminar agua si tiene solutos que llevarse con ella. Con poca comida y mucho líquido, la orina no puede diluirse más y el agua se queda |
| 6 | Con poco volumen, la ADH se libera aunque la natremia sea baja: el volumen manda sobre la osmolaridad. Si se repone con agua sola, el sodio baja |
| 7 | Hay sodio y agua de sobra, pero no llenan las arterias: el riñón «cree» que falta volumen y retiene más agua que sodio |
| 8 | Sin aldosterona el riñón pierde sodio aunque falte volumen: sodio urinario alto y potasio alto. Sin cortisol, además, la ADH sube |
| 9 | La glucosa saca agua de las células y diluye el sodio: hiponatremia con osmolaridad alta. Con el tiempo, la diuresis osmótica pierde agua y la natremia corregida sube |
| 11 | La persona mayor nota menos la sed y concentra peor la orina: con la misma falta de agua, el sodio sube más |

## Errores frecuentes y matices (N1–N7)

Mismo criterio que en la hipertensión (O4): el motor sigue la fisiología estándar y la nota explica el matiz.

| # | Planteamiento simplificado | Fisiología estándar | En el simulador |
| --- | --- | --- | --- |
| N1 | Hiponatremia = falta de sodio | Casi siempre es un exceso de agua respecto al sodio (41087199, 41692632) | Natremia = sodio corporal frente a agua corporal; el caso 1 la baja sin perder sodio |
| N2 | Deshidratación y depleción de volumen son lo mismo | La deshidratación es falta de agua (sodio alto); la depleción de volumen, pérdida de sodio (9382413) | Dos acumuladores; casos 6 y 10 |
| N3 | La natremia indica el volumen | Una natremia baja puede ir con volumen bajo, normal o alto (41692632) | Casos 6, 1 y 7 |
| N4 | La ADH solo responde a la osmolaridad | La pérdida de volumen la libera aunque la osmolaridad sea baja (4750450) | Relación 63 asimétrica |
| N5 | En la insuficiencia cardíaca sobra volumen, así que no hay estímulo para retener | Sobra extracelular, pero falta volumen circulante efectivo (2193561) | Nodo M14 y relación 216 |
| N6 | La hiponatremia baja la osmolaridad siempre | La hiperglucemia da hiponatremia con osmolaridad alta (28174217) | Caso 9 |
| N7 | Cuanto más baja, más síntomas | Importa la velocidad: el cerebro se adapta en unos dos días, y corregir deprisa una hiponatremia crónica daña (24074529, 30554800) | Volumen neuronal: edema en «días», casi normal en estado estable |

## Qué se reutiliza del tema de hipertensión

| Qué | Cuánto | Cómo |
| --- | --- | --- |
| Causas | 4 de 10 (acceso al agua, sal, ADH autónoma, edad) | Mismo id; la sal con texto propio del tema («sal y solutos») |
| Mecanismos | 13 de 15 | Mismo id y misma ficha «Qué es»; «La mueven» y «Mueve a» se calculan de las relaciones del tema |
| Relaciones | 35 de 64 | Mismo número y PMID; 11 de ellas (\*) con origen o destino cambiado porque la volemia se divide |
| Bibliografía | Los PMID de esas 35 relaciones, ya cotejados | Ninguna búsqueda nueva para ellas |
| Motor | Todo: suma, acumuladores (aquí dos), modula con signo, fija, umbrales, asimetría, tres escalas | Sin cambios de cálculo |
| Interfaz | Mandos, fichas, analítica, selector de casos, avisos, temas Retro/Clásico, PWA | Generalizar lo que hoy importa `hipertension` directamente |

## Qué necesita el motor para que dos temas compartan mecanismos

El motor ya es genérico: `simular` no conoce ningún id y admite varios acumuladores. Lo que hay que cambiar está alrededor.

1. **Biblioteca común de fisiología** (`src/fisiologia/`): los nodos que significan lo mismo en los dos temas (ADH, sed, renina, angiotensina II, aldosterona, actividad mineralocorticoide, simpático, perfusión renal, TFG, reabsorción de Na y de agua, diuresis, osmolaridad urinaria, potasio, creatinina) y sus relaciones, una sola vez, con su número, PMID y frases. Cada tema importa los que usa. **Regla:** un nodo se comparte solo si significa lo mismo; si cambia de significado o de cálculo (la volemia, la natremia, la osmolaridad), cada tema tiene el suyo.
2. **Reasignar origen o destino al importar** (las relaciones \*): `importar(63, { volemia: 'vce' })` copia la relación con otro nodo y conserva número, PMID y frases. Un test vigila que la copia solo cambie lo declarado.
3. **Intensidades por tema.** Cada tema es una simplificación distinta: la misma relación puede pesar distinto en cada uno. Ya existe el mecanismo (`aplicarAjustes` con su tabla y su motivo); pasaría a ser por tema. Signo y PMID sí son comunes: si se corrige un signo, cambia en los dos temas y los dos juegos de tests lo vigilan.
4. **Bibliografía común**: `articulos` y `frases` pasan de `src/temas/hipertension/fuentes.ts` a la biblioteca común; `npm run fuentes` genera un `docs/fuentes.md` por tema (o uno con secciones). El test «toda relación cita PMID con frase» corre en los dos temas.
5. **Registro de temas en la interfaz.** `src/app/main.ts` importa hoy `hipertension` directamente. Haría falta un objeto `Tema` (modelo, fichas, vista, panel de analítica, valores, retos, términos, orden de los mandos) y elegirlo por la dirección (`#t=natremia&c=…`). Los enlaces y el hub PhysiQ ya pasan el fragmento: un satélite, dos temas. Los enlaces antiguos sin `t=` abren la hipertensión.
6. **Vista propia.** El vaso es de la hipertensión. La natremia necesita su dibujo (compartimentos y neurona); `Vista` ya es la parte que se programa a mano para cada tema.
7. **Scripts por tema**: `revision-fichas`, `revision-retos`, `fuentes` y `calibrar` reciben el tema como argumento.
8. **Combinar temas (más adelante).** Si algún día se quiere un paciente con hipertensión **y** hiponatremia (p. ej. la tiazida), la biblioteca común permite montar un modelo que sea la unión de los dos. No lo propongo para ahora: duplica la calibración.

Ninguno de estos cambios toca el modelo de hipertensión: los 35 casos, los retos y las notas tienen que seguir pasando igual, y se comprueba antes de añadir nada de la natremia.

## Plan de fases propuesto

| Fase | Contenido | Modelo recomendado |
| --- | --- | --- |
| N1 · Modelo (este documento) | Validación de Edu; revisión fisiológica de Fable 5.2 (como la fase 1b) | Fable 5.2 en una sesión aparte |
| N2 · Motor compartido | Biblioteca común, registro de temas, scripts por tema; la hipertensión idéntica | Opus 5.5 |
| N3 · Modelo como datos | Nodos, relaciones, 12 casos como tests, cotejo de frases con el script, calibración con tabla de ajustes | Opus 5.5 |
| N4 · Diseño de la vista | Compartimentos y neurona, en el modo diseño de claude.ai, como el prototipo de la fase 2 | claude.ai (modo diseño) |
| N5 · Pantalla y fichas | Selector de tema, vista, fichas y avisos; textos revisados por Fable 5.2 | Opus 5.5; Fable 5.2 para los textos |
| N6 · Tratamientos | Ver «Alcance» | Opus 5.5 |
| N7 · Ejercicio y uso docente | Hiponatremia del ejercicio, retos, valores orientativos | Opus 5.5; búsqueda de valores en una sesión aparte |

## Decisiones de Edu

Edu aprobó las nueve propuestas el 20 nov 2026, antes de conocer la revisión de Fable 5.2. Si la revisión cambia alguna, se le vuelve a preguntar.

| # | Pregunta | Propuesta | Decisión de Edu (20 nov 2026) |
| --- | --- | --- | --- |
| P1 | ¿Las 10 causas y lo que queda fuera? | Sí, tal cual | Aprobada |
| P2 | ¿Tiazida ya o en N6? | En N6, con el asa | Aprobada |
| P3 | ¿Volumen neuronal y osmolitos en la primera versión? | Sí: es lo que da sentido a «aguda o crónica» y prepara la velocidad de corrección de N6 | Aprobada |
| P4 | ¿Hiperglucemia en la primera versión? | Sí: enseña la hiponatremia no hipotónica con una sola rueda | Aprobada |
| P5 | ¿Insuficiencia cardíaca y cirrosis juntas o separadas? | Juntas | Aprobada |
| P6 | Las cinco relaciones ⚠ | Busco mejores artículos en la fase N3; si no aparecen, te las presento como supuestos | Aprobada |
| P7 | Biblioteca común con intensidades por tema (no un modelo único) | Sí | Aprobada |
| P8 | Un satélite con dos temas (selector y `#t=`) en lugar de una app aparte | Sí | Aprobada |
| P9 | ¿La sal de la hipertensión y los «solutos» de la natremia, la misma rueda? | Sí, con texto propio en cada tema; en la natremia, el extremo bajo es «té con tostadas» | Aprobada |

## Límites conocidos

- El modelo no está calibrado: las intensidades son de partida y se ajustan con los 12 casos en la fase N3.
- La natremia sale de una suma (sodio menos agua), no del cociente de Edelman: vale para las flechas, no para mmol/L.
- No hay escala «horas»: la adaptación cerebral se ve entre «días» (sin adaptar) y «estado estable» (adaptada). La velocidad de corrección necesitará la escala nueva en N6.
- El potasio solo entra por la aldosterona, la TFG y la diarrea; no se modela el paso de potasio entre células y plasma.
- Las frases de los artículos nuevos son del resumen; los que tengan texto completo en PubMed Central se leerán enteros al construir.
