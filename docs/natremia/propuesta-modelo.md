# Natremia — Fase N1: alcance y modelo fisiológico (v0.2)

20 nov 2026 · v0.1: propuesta de Opus 5.5 · 21 nov 2026 · **v0.2**: integra la revisión de Fable 5.2 (`docs/natremia/revision-n1-fable.md`) con las 14 decisiones aprobadas por Edu. **No hay código**: este documento es la entrada de las fases N2 y N3.

## Resumen

El segundo tema del motor enseña **por qué baja o sube el sodio en sangre**. La idea central, que el tema de hipertensión no podía enseñar, es que **la natremia es una concentración**: depende del agua corporal tanto como del sodio, y el volumen extracelular (los edemas, la falta de volumen) va por otro lado. Por eso el modelo separa dos balances, el del **agua** y el del **sodio**, y la natremia sale de los dos.

Modelo: **11 ruedas de causa, 15 mecanismos, 5 salidas y 9 valores de analítica**, unidos por **68 relaciones** (36 reutilizadas del tema de hipertensión y 32 nuevas), y **14 casos** con sus resultados esperados (12 de enseñanza y 2 de control), que serán la batería de tests.

Todo lo que entra viene de PubMed. Las relaciones reutilizadas conservan sus PMID y frases ya cotejadas (`docs/fuentes.md`). Las nuevas llevan PMID comprobados y una frase literal del resumen, cotejada con un script contra E-utilities (Fable 5.2 el 20 nov 2026; los artículos que añadió su revisión, otra vez el 21 nov 2026). **Una relación, la 230, entra como supuesto validado por Edu**: no hay todavía una frase literal que la respalde (ver «Supuestos»).

### Cambios de la v0.2

| Cambio | Qué | Motivo (revisión de Fable 5.2) |
| --- | --- | --- |
| Rueda nueva C11 | «Dieta pobre en solutos»; la sal se reutiliza tal cual | P9 reabierta: los solutos que limitan la dilución son sobre todo la urea de las proteínas, y una dieta baja en sal no da hiponatremia (T16, E10) |
| Regla del estado estable | En estado estable el volumen circulante efectivo solo queda fuera de lo normal con un flujo de sodio mantenido o un defecto que lo impida | El acumulador de sodio obliga a ello (E1) |
| Convención isotónica | Agua y sodio en unidades isotónicas: una pérdida igual al plasma no cambia la natremia | Las pérdidas digestivas bajaban la natremia por sí solas (E5) |
| Nueva 230 | Reabsorción de agua → Sodio urinario (+) | El sodio urinario es una concentración (E2) |
| Nueva 231 | Hiperglucemia → Reabsorción de Na (−) | La diuresis osmótica también pierde sodio (E6) |
| 16 partida en 16 y 16b | La falta de solutos solo limita la dilución | El `modula` actuaba en los dos sentidos (E7) |
| 219 pasa a `bloquea` | La diabetes insípida nefrogénica corta la acción de la ADH | Con `modula` el caso 3 no movía nada (E3) |
| 75\* desde el agua corporal | El escape sale del agua retenida; falla en la insuficiencia cardíaca y la cirrosis | El volumen circulante efectivo no lo encendía (E4) |
| 74 reutilizada | Angiotensina II → TFG | Es renal y protege la filtración en los casos 6 y 7 (E14) |
| Intensidades de partida | 13 fuerte; 201, 202 y 206 moderadas; 211 fuerte; 209 a 0,45; 213 a 0,45; 63 débil arriba; 226 débil; 203 con umbral | E5, E6, E8, E9, R3, R5, R8, R10, R17 |
| Fuentes | Edelman, pérdidas digestivas, potasio de la diarrea e insuficiencia suprarrenal con artículos mejores | Ya no queda ninguna ⚠ (F5–F8) |
| Flechas esperadas | Casos 1, 4, 6, 8, 9, 10, 11 y 12; casos de control 13 y 14 | C1–C17, E10 |
| Nombres | «Células del cerebro» y «osmolitos cerebrales» | En la hiponatremia se hinchan sobre todo los astrocitos (E12) |

## Alcance

### Qué entra en la primera versión

| Bloque | Contenido |
| --- | --- |
| Hiponatremia hipotónica | Las tres familias por el volumen extracelular: hipovolémica (pérdidas digestivas, insuficiencia suprarrenal), euvolémica (SIADH, polidipsia, dieta pobre en solutos) e hipervolémica (insuficiencia cardíaca o cirrosis) |
| Hipernatremia | Falta de agua (acceso, edad), diabetes insípida central y nefrogénica, diuresis osmótica |
| Hiponatremia no hipotónica | La hiperglucemia: sodio bajo con osmolaridad alta |
| Cerebro | Volumen de las células del cerebro y su adaptación (osmolitos): por qué la hiponatremia que se instaura deprisa es más peligrosa que la crónica |
| Analítica del diagnóstico | Natremia, osmolaridad plasmática, osmolaridad urinaria y sodio urinario: las cuatro pruebas del algoritmo diagnóstico (PMID 28174217) |

### Qué queda para fases posteriores

| Fase | Contenido | Por qué después |
| --- | --- | --- |
| N6 · Tratamientos | Suero salino 0,9 %, salino hipertónico, restricción hídrica, vaptanes, desmopresina, urea; **tiazida y diurético de asa** (reutilizando los mandos de la fase 4); velocidad de corrección y desmielinización osmótica | Necesitan una escala de tiempo «horas» y un aviso de corrección rápida; mejor con el tema ya calibrado |
| N7 · Ejercicio | **Hiponatremia asociada al ejercicio** (beber de más en pruebas de resistencia, ADH no osmótica; PMID 32097926, 16180947 y 26102445) y **pérdidas por sudor**, que pierden más agua que sodio | Muy útil en fisioterapia; reutiliza la mecánica de sesión de la fase 5 |
| N8 · Uso docente | Retos, valores orientativos (mmol/L), notas de interacción, compartir por enlace | Igual que la fase 6 de hipertensión |
| Fuera | Pseudohiponatremia (artefacto del laboratorio), síndrome pierde sal cerebral (discutido), hipotiroidismo (solo en casos graves y por mecanismo discutido) | Ver «Límites conocidos» |

La tiazida es la causa farmacológica más frecuente de hiponatremia y la que más verá un fisioterapeuta en personas mayores. Va en N6 con el asa, porque el contraste entre las dos es una lección en sí misma; la ficha de la edad y «Límites conocidos» la nombran para que no parezca un olvido.

## Esquema: qué cambia respecto a la hipertensión

En la hipertensión, la volemia es un único acumulador de agua y la osmolaridad plasmática es un nodo de suma que empujan la sal, la sed y la reabsorción de agua. Bastaba para enseñar que la sal sube la presión y que el SIADH da hiponatremia, pero no puede separar volumen y concentración. En la natremia:

| Concepto | Hipertensión | Natremia |
| --- | --- | --- |
| Agua | Implícita en la volemia | **Agua corporal total**: acumulador (lo que se bebe menos lo que se orina y se pierde) |
| Sodio | No existe como cantidad | **Sodio corporal**: acumulador (lo que se ingiere menos lo que se excreta o se pierde) |
| Natremia | Sigue a la osmolaridad (relación 20) | Sube con el sodio corporal y baja con el agua corporal (ecuación de Edelman, PMID 13575523 y 16180947) |
| Osmolaridad plasmática | Nodo que empujan la sal, la sed y el riñón | Sale de la natremia y de la glucosa: es la **tonicidad** que leen los osmorreceptores |
| Volumen | Volemia | **Volumen extracelular** (plasma y líquido entre las células; sigue al sodio: edemas o falta de volumen) y **volumen circulante efectivo** (lo bien llenas que están las arterias: lo que «ven» los barorreceptores y el riñón) |

Esto respalda la distinción clásica entre **deshidratación** (falta de agua, natremia alta) y **depleción de volumen** (pérdida de sodio con su agua): Mange et al., PMID 9382413.

### Dos reglas del modelo

**Convención isotónica.** Agua y sodio corporal se miden en unidades isotónicas: perder (o ganar) un líquido igual al plasma mueve lo mismo los dos acumuladores y no cambia la natremia. Solo lo que se pierde o se gana con más agua que sodio (o al revés) mueve la natremia. Así, la diarrea, que lleva menos sodio que el plasma (40–60 mmol/L, PMID 2701836), no baja la natremia por sí sola: la baja el agua que se bebe y que la ADH retiene.

**Regla del estado estable.** El acumulador de sodio solo se detiene cuando lo que se reabsorbe iguala lo que entra y lo que se pierde. Por eso, en estado estable, **el volumen circulante efectivo solo queda fuera de lo normal si hay un flujo de sodio mantenido (sal, pérdidas) o un defecto que impide corregirlo (insuficiencia suprarrenal, insuficiencia cardíaca o cirrosis)**. Es la misma idea que el D3 de la hipertensión («en estado estable se excreta lo que se ingiere»). Consecuencia: en la falta de agua (casos 10 y 11) las flechas firmes de volumen, renina, aldosterona y creatinina se comprueban en «días», que es lo que representan: nadie vive en estado estable sin agua.

**Topes.** Una rueda de causa a tope no debe meter en un acumulador más flujo del que el cuerpo puede compensar, salvo donde el tope es lo que se quiere enseñar (sin agua; insuficiencia cardíaca o cirrosis, ver caso 7). El aviso «tope de escala» se acepta solo en esos casos.

## Nodos

### Causas: 11 ruedas

| Id | Rueda | Rango y extremos | Frecuencia | Reutilizada |
| --- | --- | --- | --- | --- |
| C1 | Acceso al agua | −1 nulo → 0 libre | Común | Sí (`accesoAgua`, C12 de hipertensión) |
| C2 | Polidipsia primaria | 0 → +1 | Poco frecuente | Nueva |
| C3 | Ingesta de sal | −1 baja → +1 alta | Común | Sí (`sal`, C3), tal cual |
| C4 | Secreción de ADH autónoma | −1 diabetes insípida central → +1 SIADH | DI rara · SIADH poco frecuente | Sí (`adhAutonoma`, C5) |
| C5 | Diabetes insípida nefrogénica (litio, hipercalcemia, genética) | 0 → +1 | Poco frecuente (la genética es rara; con litio no) | Nueva |
| C6 | Pérdidas digestivas (vómitos, diarrea) | 0 → +1 | Común | Nueva |
| C7 | Insuficiencia cardíaca o cirrosis | 0 → +1 | Común | Nueva |
| C8 | Insuficiencia suprarrenal primaria | 0 → +1 | Rara | Nueva |
| C9 | Hiperglucemia | 0 → +1 | Común | Nueva |
| C10 | Edad | 0 joven → +1 mayor | Común | Sí (`edad`, C1) |
| C11 | Dieta pobre en solutos («té con tostadas», cerveza) | 0 → +1 | Poco frecuente | Nueva |

C7 junta insuficiencia cardíaca y cirrosis porque comparten el mecanismo: el volumen circulante efectivo baja aunque sobre líquido (Schrier, PMID 2193561 y 3050523). La ficha dedica una línea a cada una (gasto bajo en una, vasodilatación arterial en la otra).

C6 junta vómitos y diarrea porque para el agua, el sodio y la ADH se comportan igual. Difieren en lo que el modelo no ve: el equilibrio ácido-base, que con vómitos el sodio urinario puede salir alto (el bicarbonato arrastra sodio) y que el potasio se pierde por el riñón, no por el vómito. Lo dicen la ficha y la nota del caso 6.

### Mecanismos: 15 ruedas que se mueven solas

| Id | Rueda | Reutilizado |
| --- | --- | --- |
| M1 | Osmolaridad plasmática efectiva (tonicidad) | Sí (`osmP`): se comparte el nodo; sus entradas son las del tema. La ficha añade: «La urea cuenta en la osmolaridad que mide el laboratorio, pero no mueve agua entre compartimentos» |
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
| M15 | Osmolitos cerebrales | Nuevo: solutos que las células del cerebro pierden o ganan para defender su volumen (lento) |

Quedan fuera los mecanismos hemodinámicos de la hipertensión (frecuencia, contractilidad, rigidez, placa): no mueven el sodio.

### Salidas: 5 indicadores

| Id | Indicador | Cálculo | Qué lo determina |
| --- | --- | --- | --- |
| S1 | Agua corporal total | Acumulador | Bebida (sed, polidipsia, acceso) menos diuresis y pérdidas |
| S2 | Sodio corporal | Acumulador | Ingesta de sal menos natriuresis y pérdidas digestivas |
| S3 | Volumen extracelular | Suma | Sigue al sodio corporal; algo al agua (un tercio del agua es extracelular) |
| S4 | Natremia | Suma | Sodio corporal (+), agua corporal (−, algo más que el sodio), glucosa (−) |
| S5 | Volumen de las células del cerebro | Suma | Baja con la tonicidad; los osmolitos lo devuelven a lo normal con el tiempo |

La vista (fase N4) dibujaría tres compartimentos —célula, intersticio y vaso— con una célula del cerebro que se hincha o se encoge (el dibujo puede ser una neurona).

### Analítica: 9 valores

| Id | Valor | Qué lo mueve | Propio o reflejo |
| --- | --- | --- | --- |
| A1 | Natremia | S4 | Salida |
| A2 | Osmolaridad plasmática | M1 | Mecanismo |
| A3 | Osmolaridad urinaria | Reabsorción de agua | Nodo propio (reutilizado `osmU`) |
| A4 | Sodio urinario | Baja con la reabsorción de Na; sube con la reabsorción de agua (es una concentración) | **Nodo nuevo** |
| A5 | Potasio | Actividad mineralocorticoide, TFG, pérdidas digestivas | Reutilizado |
| A6 | Creatinina | TFG por debajo de −0,3 | Reutilizado |
| A7 | Glucemia | Rueda C9 | Refleja la causa |
| A8 | Diuresis | M13 | Mecanismo |
| A9 | Renina | M4 | Mecanismo |

La ADH (en la clínica, la copeptina) se ve como mecanismo.

## Relaciones

Escalas de tiempo, intensidades y umbrales como en la hipertensión: débil 0,3 · moderada 0,6 · fuerte 1,0; minutos · días · estado estable. **Las nuevas se numeran desde la 201** para que nunca coincidan con las de la hipertensión. Las reutilizadas conservan su número y sus PMID; las marcadas con \* cambian de origen o de destino porque el nodo de la hipertensión se divide, y su explicación y su frase se revisan para este tema (ver «Qué necesita el motor»). Las intensidades son de partida: se ajustan en la calibración (fase N3) y se informa a Edu en una tabla.

### Balance de agua

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 13\* | Sed → Agua corporal | + | Fuerte | Días | 18843231, 14739394 | Beber repone agua. Tiene que poder igualar a la poliuria: con agua libre, la sed compensa la diabetes insípida |
| 15\* | Acceso al agua ⊗ 13 | modula | — | — | 12152926, 14739394, 20646222 | Sin acceso al agua, la sed no se traduce en ingesta |
| 67\* | Acceso al agua → Agua corporal | + | Fuerte | Días | 20646222, 4750450 | Sin ingesta se sigue perdiendo agua por la piel, la respiración y la orina |
| 121\* | Edad ⊗ 67 | modula (+0,5) | — | — | 11528342, 9050029, 6472364 | Con los años se nota menos la sed: ante la misma falta de agua se bebe menos |
| 201 | Polidipsia primaria → Agua corporal | + | Moderada | Días | 29120013 | Se bebe por encima de la sed; un riñón sano elimina casi todo el exceso |
| 19\* | Diuresis → Agua corporal | − | Fuerte | Días | 2063193 | Lo que se orina sale del agua corporal |
| 202 | Pérdidas digestivas → Agua corporal | − | Moderada | Días | 2701836, 9382413 | Vómitos y diarrea pierden agua con sodio (igual que la 206: convención isotónica) |
| 203 | Hiperglucemia → Diuresis | + | Moderada (umbral 0,25) | Días | 38610721, 32984372 | Diuresis osmótica: por encima del umbral renal, la glucosa filtrada arrastra agua |

### Balance de sodio

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 204 | Ingesta de sal → Sodio corporal | + | Moderada | Días | 23096366, 16599862 | Más sal ingerida, más sodio corporal hasta que el riñón la iguala |
| 205 | Reabsorción de Na → Sodio corporal | + | Fuerte | Días | 2063193, 16599862 | El sodio que no se excreta se queda |
| 206 | Pérdidas digestivas → Sodio corporal | − | Moderada | Días | 2701836, 9382413 | Depleción de volumen: pérdida neta de sodio con su agua |

### Concentración y volúmenes

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 207 | Sodio corporal → Natremia | + | Fuerte | Minutos | 41692632, 16180947, 13575523 | La natremia depende del sodio (y del potasio) intercambiable… |
| 208 | Agua corporal → Natremia | − | Fuerte (algo más que la 207) | Minutos | 41692632, 41087199, 41176477 | …dividido por el agua corporal total. Pesa algo más para que, si sobran los dos (caso 7), la natremia baje |
| 209 | Hiperglucemia → Natremia | − | 0,45 (entre débil y moderada) | Minutos | 10225241, 38610721 | La glucosa saca agua de las células y diluye el sodio |
| 210 | Natremia → Osmolaridad plasmática | + | Fuerte | Minutos | 16599862 (y 35779183, 27156756 de la 20) | El sodio es el principal soluto del plasma |
| 211 | Hiperglucemia → Osmolaridad plasmática | + | Fuerte | Minutos | 32984372, 38610721, 28174217 | La glucosa sube la tonicidad más de lo que el agua que sale de las células la corrige: sodio bajo con osmolaridad alta |
| 212 | Sodio corporal → Volumen extracelular | + | Fuerte | Minutos | 16599862, 23096366 | El sodio se queda fuera de las células y sujeta allí el agua: más sodio corporal, más volumen extracelular |
| 213 | Agua corporal → Volumen extracelular | + | 0,45 | Minutos | 21923421 | Unos dos tercios del agua corporal están dentro de las células: al extracelular le toca un tercio |
| 214 | Volumen extracelular → Volumen circulante efectivo | + | Fuerte | Minutos | 23096366 | En la persona sana, más extracelular llena más las arterias |
| 215 | Insuficiencia cardíaca o cirrosis → Volumen circulante efectivo | − | Fuerte | Minutos | 2193561, 3050523 | Gasto bajo o vasodilatación arterial: las arterias quedan poco llenas |
| 216 | Insuficiencia cardíaca o cirrosis ⊗ 214 y 75\* | modula (−0,7) | — | — | 2193561, 21852582 | El líquido retenido va a edemas y ascitis y no llena las arterias; y el riñón no escapa de la ADH |

### ADH y sed

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 8 | Osmolaridad → ADH | + | Fuerte | Minutos | 18509340, 4750450 | Osmorreceptores → hipotálamo |
| 9 | Osmolaridad → Sed | + | Fuerte | Minutos | 14739394 | Los mismos osmorreceptores activan la sed |
| 10 | ADH autónoma → ADH | fija | — | — | 17507705, 31395885, 36974717, 38693275 | SIADH o diabetes insípida central |
| 63\* | Volumen circulante efectivo → ADH | − | Débil (fuerte por debajo de 0) | Minutos | 4750450, 18671303, 20309584 | ADH no osmótica: una pérdida de volumen importante la libera aunque la osmolaridad sea baja; con volumen alto el efecto es pequeño |
| 64\* | Volumen circulante efectivo → Sed | − | Moderada | Minutos | 14739394 | Con poco volumen hay sed |
| 30 | Angiotensina II → ADH | + | Débil | Minutos | 15089972, 32736759 | Activa el hipotálamo |
| 31 | Angiotensina II → Sed | + | Débil | Minutos | 9674690, 14739394 | Activa el centro de la sed |
| 217 | Pérdidas digestivas → ADH | + | Débil | Minutos | 16322164, 20309584 | Las náuseas y los vómitos liberan ADH por sí mismos (la diarrea no) |
| 218 | Insuficiencia suprarrenal → ADH | + | Moderada | Días | 2548097 | Sin cortisol, la ADH se libera de más. Es el efecto de la falta de cortisol, que comparten la forma primaria y la secundaria |
| 11 | ADH → Reabsorción de agua | + | Fuerte | Minutos | 11773613 | Acuaporinas en el colector |
| 219 | Diabetes insípida nefrogénica ⊣ 11 | bloquea (máximo 1) | — | — | 26077742 | El colector no responde a la ADH. Es un bloqueo, como el de los vaptanes: corta también el tono normal de la vía |
| 220 | Edad ⊗ 11 | modula (−0,3) | — | — | 6472364, 11528342 | El riñón del mayor concentra peor la orina |
| 75\* | Agua corporal → Reabsorción de agua | − | Moderada, solo por encima de 0 | Estable | 16843081 (y los de la 75) | Escape de la antidiuresis: con agua retenida, baja la acuaporina 2 aunque la ADH siga alta |
| 16 | Reabsorción de agua → Diuresis (concentrar) | − | Fuerte, solo por encima de 0 | Minutos | 11773613, 31395885 | Con la ADH alta, menos agua en la orina |
| 16b | Reabsorción de agua → Diuresis (diluir) | − | Fuerte, solo por debajo de 0 | Minutos | 11773613, 31395885 | Con la ADH suprimida, orina abundante y diluida |
| 18 | Reabsorción de agua → Osmolaridad urinaria | + | Fuerte | Minutos | 11773613, 31395885 | La orina se concentra |
| 221 | Dieta pobre en solutos ⊗ 16b | modula (−0,6) | — | — | 18337482, 9631849, 29120013 | El riñón no elimina agua pura: sin solutos que excretar, no puede eliminar mucha agua aunque la ADH esté suprimida |

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
| 74 | Angiotensina II → TFG | + | Débil | Minutos | 24944035, 32606889 | Contrae la eferente y sostiene la filtración cuando llega poca presión al riñón |
| 222 | Insuficiencia suprarrenal → Aldosterona | − | Fuerte | Minutos | 25617169, 26760044 | La corteza destruida apenas fabrica aldosterona |
| 223 | Insuficiencia suprarrenal ⊗ 28 y 73 | modula (−1) | — | — | 25617169, 8977748 | Ni la angiotensina ni el potasio pueden estimularla: aldosterona muy baja con renina muy alta |
| 34 | Aldosterona → Actividad mineralocorticoide | + | Fuerte | Días | 29982819, 25540145 | Receptor renal |
| 29 | Angiotensina II → Reabsorción de Na | + | Moderada | Días | 12642017, 17878513 | Transportadores tubulares |
| 36 | Actividad mineralocorticoide → Reabsorción de Na | + | Fuerte | Días | 25540145 | Canales y bombas del colector |
| 37 | Actividad mineralocorticoide → Potasio | − | Moderada (umbral 0,2) | Días | 25903070, 25540145 | Se secreta K a cambio de Na |
| 81 | Actividad mineralocorticoide → Potasio | − | Moderada (umbral −0,3) | Días | (los de la 81) | Sin aldosterona el K sube |
| 224 | Volumen circulante efectivo → Reabsorción de Na | − | Moderada | Días | 16843081, 2034926 | Natriuresis por volumen: el escape del sodio en el SIADH. Con volumen bajo se suma a la vía renina-aldosterona: vigilar en la calibración que el sodio urinario de los casos 6 y 7 no dependa solo de ella |
| 231 | Hiperglucemia → Reabsorción de Na | − | Moderada | Días | 32984372 | La glucosa que no se reabsorbe retiene agua y sodio en el túbulo: la diuresis osmótica pierde sodio, aunque menos que agua |
| 76\* | Volumen circulante efectivo → Perfusión renal | + | Solo por debajo de 0 (0,6) | Días | (los de la 76) | Azotemia prerrenal |
| 40 | Perfusión renal → TFG | + | Fuerte | Minutos | 8574595, 25834230 | Menos flujo, menos filtración |
| 42 | TFG → Diuresis | + | Moderada | Minutos | 28271233, 25098598 | Se filtra menos |
| 43 | Reabsorción de Na → Diuresis | − | Moderada | Días | 26240596, 2063193 | El agua sigue al Na |
| 45 | TFG → Creatinina | − | Fuerte (umbral −0,3) | Días | 27647862, 1394976 | Marcador de filtración |
| 66 | TFG → Potasio | − | Moderada (umbral −0,3) | Estable | 19546417 | Se excreta menos K |
| 225 | Reabsorción de Na → Sodio urinario | − | Fuerte | Minutos | 3674097, 41087199 | Sodio urinario bajo cuando el riñón retiene (hipovolemia, edemas) |
| 230 | Reabsorción de agua → Sodio urinario | + | Moderada | Minutos | 41087199 · **supuesto** | El sodio urinario es una concentración: la orina concentrada concentra su sodio y la diluida lo diluye. Por eso está alto en el SIADH y bajo en la diabetes insípida aunque se excrete el sodio que se come |
| 226 | Pérdidas digestivas → Potasio | − | Débil | Días | 21278718 | La diarrea pierde potasio; con vómitos, el potasio se pierde por el riñón (ya lo hacen la 37 y la aldosterona alta) |

### Cerebro

| # | Relación | Signo | Intensidad | Tiempo | PMID | Por qué |
| --- | --- | --- | --- | --- | --- | --- |
| 227 | Osmolaridad → Volumen de las células del cerebro | − | Fuerte | Minutos | 41176477, 24074529, 20417691 | Con tonicidad baja entra agua en las células (edema); con alta sale |
| 228 | Osmolaridad → Osmolitos cerebrales | + | Fuerte | Estable | 30554800, 20417691 | Las células pierden osmolitos en la hiponatremia y los acumulan en la hipernatremia |
| 229 | Osmolitos cerebrales → Volumen de las células del cerebro | + | Fuerte | Estable | 30554800, 20417691 | Así recuperan su volumen: la hiponatremia crónica da menos síntomas, y corregirla deprisa daña (24074529) |

«Días» enseña la hiponatremia **recién instaurada** (células hinchadas, sin adaptar); «estado estable», la **crónica**, ya adaptada. La adaptación real tarda unos dos días; la escala «horas» de N6 lo afinará.

### Relaciones de la hipertensión que no pasan a la natremia

| # | Relación | Por qué no |
| --- | --- | --- |
| 7, 14, 17, 20, 44, 68 | Empujan directamente la osmolaridad o la natremia | Aquí salen de los balances de agua y sodio (207–211). Es el cambio de estructura del tema |
| 1–6, 12, 24, 25, 27, 32, 33, 35, 38, 39, 41, 46–62, 65, 70–72, 78, 79 | Vasos, corazón, presión, simpático central y causas propias de la hipertensión | No mueven el sodio. Siguen en su tema |

## Supuestos (validados por Edu el 21 nov 2026)

| # | Supuesto | Por qué | Qué se hará |
| --- | --- | --- | --- |
| 230 | Reabsorción de agua → Sodio urinario (+) | Es aritmética de una concentración, pero no hay todavía una frase de resumen que lo diga literalmente. 41087199 lo respalda de forma indirecta (en el SIADH, osmolaridad y sodio urinarios altos a la vez) | En N3, leer entero 21852582 (PMC3171932, sodio urinario y flujo de orina). Si aparece la frase, deja de ser supuesto |

## Frases de los artículos nuevos

Frases literales de los resúmenes de PubMed, cotejadas con un script contra E-utilities (20 y 21 nov 2026). Al construir pasan a la bibliografía común con su comprobación.

| PMID | Artículo | Frase | Relaciones |
| --- | --- | --- | --- |
| 41692632 | Pathophysiology of different etiologies (Best Pract Res Clin Endocrinol Metab 2026) | «Hyponatremia can occur by an increase in total body water (TBW), a decrease in body Na+ or K+, or any combination of these.» · «a low serum [Na+] can be associated with a decreased, normal, or increased ECF volume» | 207, 208, N3 |
| 16180947 | Exercise-associated hyponatraemia: a mathematical review (Sports Med 2005) | «In 1958, Edelman and colleagues empirically showed plasma sodium concentration ([Na+]p) to be primarily a function of the sum of exchangeable sodium and potassium (E) divided by total body water (TBW).» | 207, N7 |
| 41087199 | Diagnostic algorithm of hyponatremia (2026) | «It is driven by an excess of free water relative to total body sodium.» · «The most common cause of hyponatremia is the syndrome of inappropriate diuresis, characterised by inappropriate arginine vasopressin activity resulting a high urine osmolality and high urine sodium concentration.» (errata del resumen: se copia tal cual) | 208, 225, 230 |
| 41176477 | Pathophysiology and aetiologies of hypernatremia (2026) | «It reflects a relative deficiency of free water rather than sodium excess.» · «The resultant hyperosmolality causes osmotic efflux of water from brain cells, leading to cerebral shrinkage» | 208, 227 |
| 16599862 | Osmolar disorders (Crit Care Resusc 1999) | «An increase (or decrease) in total body sodium is associated with retention (or excretion) of body water, an increase (or decrease) in the extracellular fluid (ECF) volume, and no change in plasma osmolality.» · «plasma osmolality is determined largely by the concentration of sodium» | 204, 205, 210, 212 |
| 23096366 | Renal renin secretion (Pflugers Arch 2013) | «Close associations exist between sodium intake, total body sodium, extracellular fluid volume, and blood volume.» · «volume-mediated regulation of renin secretion is the primary regulator» | 69, 204, 212, 214 |
| 21923421 | The science behind hyponatremia (Pharmacotherapy 2011) | «About two thirds of total body water is intracellular fluid.» | 213 |
| 9382413 | Dehydration versus volume depletion (Ann Intern Med 1997) | «Dehydration largely refers to intracellular water deficits stemming from hypertonicity» · «volume depletion describes the net loss of total body sodium and a reduction in intravascular volume» | 202, 206, N2 |
| 2701836 | Childhood acute diarrhoea in Europe (Acta Paediatr Scand Suppl 1989) | «Although water loss may be high, the mean sodium loss is close to 40 mmol/l of stool in rotaviral diarrhoea, and to 60 mmol/l in diarrhoeas due to invasive pathogens such as campylobacter and salmonella.» | 202, 206, convención isotónica |
| 21278718 | Pathophysiology and management of hypokalemia (Nat Rev Nephrol 2011) | «Extrarenal K(+) losses from the body are usually small, but can be marked in individuals with chronic diarrhea, severe burns or prolonged sweating.» | 226 |
| 2193561 | Schrier, unifying hypothesis (Ann Intern Med 1990) | «With a decrease in effective arterial blood volume (EABV) initiated by either decreased cardiac output or peripheral arterial vasodilation» · «thus maximizing the water-retaining effect of vasopressin and impairing normal escape from the sodium-retaining effect of aldosterone» | 215, 216 |
| 3050523 | Schrier (N Engl J Med 1988) | «either a fall in cardiac output or peripheral arterial vasodilatation may diminish arterial vascular filling and thereby initiate a series of hemodynamic and hormonal events that result in renal sodium and water retention» | 215 |
| 21852582 | Urinary sodium, chloride, urea and flow (J Am Soc Nephrol 2011) | «arterial underfilling in causing prerenal azotemia in the presence of an increase in total body sodium and extracellular fluid expansion» | 216 |
| 18671303 | Hyponatremia in cirrhosis (Hepatology 2008) | «a retention of water that is disproportionate to the retention of sodium» · «nonosmotic hypersecretion of arginine vasopressin … related to circulatory dysfunction» | 63, caso 7 |
| 16843081 | Escape from antidiuresis (Am J Med 2006) | «escape from antidiuresis is caused by downregulation of kidney aquaporin-2 expression despite high AVP plasma levels» · «solute losses occur through the secondary natriuresis induced by water retention» | 75, 224 |
| 2034926 | Effective arterial blood volume and proximal reabsorption (Semin Nephrol 1991) | «effective arterial volume is able to regulate the transport of NaCl … in the proximal tubule» | 224 |
| 3674097 | Urine sodium in hyponatremia (Am J Med 1987) | «the concentration of sodium in a spot urine sample clearly separated hypovolemic (mean UNa = 18.4 …) from normovolemic (mean UNa = 72 …) hyponatremic patients» | 225 |
| 33222764 | Primary polydipsia: update (2020) | «In primary polydipsia pathologically high levels of water intake physiologically lower arginine vasopressin (AVP) secretion» | Caso 4 (ADH baja) |
| 29120013 | Primary polydipsia (Swiss Med Wkly 2017) | «factors reducing the renal excretory capacity of the kidney such as acute illness, medications or low solute intake may accumulate in hyponatraemia» | 201, 221 |
| 18337482 | Solute intake and water excretion (J Am Soc Nephrol 2008) | «a decrement in solute intake markedly reduces the above-mentioned flexibility and puts the individual at risk for the unexpected development of hyponatremia» | 221 |
| 9631849 | «Beer potomania» in non-beer drinkers (Am J Kidney Dis 1998) | «the very low intake of solute limited her water excretion and caused the hyponatremia despite only a modest increase in fluid intake» | 221, caso 5 |
| 26077742 | Nephrogenic diabetes insipidus (Nat Rev Nephrol 2015) | «In nephrogenic diabetes insipidus (NDI), inability of the kidneys to respond to AVP results in functional AQP deficiency.» | 219 |
| 25768671 | Copeptin in the polyuria-polydipsia syndrome (J Clin Endocrinol Metab 2015) | «Without prior thirsting, a single baseline copeptin level >21.4 pmol/L differentiated nephrogenic DI from other etiologies with a 100% sensitivity and specificity» | Caso 3 (ADH alta) |
| 2548097 | Hypopituitarism and vasopressin (N Engl J Med 1989) | «ACTH deficiency may cause the syndrome of inappropriate secretion of antidiuretic hormone» · «The beneficial effect of hydrocortisone is probably exerted through the suppression of vasopressin secretion.» | 218 |
| 25617169 | Mineralocorticoid substitution in primary adrenal insufficiency (Best Pract Res Clin Endocrinol Metab 2015) | «Patients with primary adrenal insufficiency usually show pronounced impairment of aldosterone secretion» · «Mineralocorticoid deficiency is confirmed by demonstration of profoundly decreased aldosterone and highly elevated plasma renin activity (PRA).» | 222, 223, caso 8 |
| 8977748 | Plasma renin activity in primary adrenal insufficiency (Clin Endocrinol (Oxf) 1996) | «Elevation of plasma renin activity (PRA) is a feature of mineralocorticoid deficiency in patients with primary adrenal insufficiency.» | 223, caso 8 |
| 42966941 | Addison's disease mimicking cerebral salt wasting (Cureus 2026; caso clínico) | «elevated urinary sodium as expected in Addison's disease» | Caso 8 |
| 16322164 | ADH in children with gastroenteritis (Pediatrics 2005) | «The nonosmotic stimuli of ADH secretion that we identified were vomiting (50 of 52), dehydration» | 217 |
| 20309584 | Fluids in gastroenteritis (Pediatr Nephrol 2010) | «a state of arginine vasopressin (AVP) excess due to both hemodynamic stimuli from volume depletion and non-hemodynamic stimuli such as nausea and vomiting» · «Free water will be retained until the volume deficit is corrected» | 63, 217, caso 6 |
| 10225241 | Correction factor for hyperglycemia (Am J Med 1999) | «the mean decrease in serum sodium concentration averaged 2.4 meq/L for every 100 mg/dL increase in glucose concentration» | 209 |
| 38610721 | Hypernatremia in hyperglycemia (J Clin Med 2024) | «the fluid exit from the intracellular compartment and thirst, which cause [Na]S decreases» · «osmotic diuresis … results in a [Na]S increase» | 203, 209, 211, caso 9 |
| 32984372 | Corrected serum sodium in hyperglycemic crises (Front Med 2020) | «In hyperglycemia, hypertonicity results from solute (glucose) gain and loss of water in excess of sodium plus potassium through osmotic diuresis.» | 203, 211, 231 |
| 28174217 | Compilation of the guidelines (J Am Soc Nephrol 2017) | «the initial step is to differentiate hypotonic from nonhypotonic hyponatremia» · «further differentiated on the basis of urine osmolality, urine sodium level, and volume status» | 211, analítica |
| 30554800 | Allostasis in chronic hyponatremia (Am J Kidney Dis 2019) | «To avoid intolerable changes in their volume, cells export organic osmolytes when exposed to a low serum sodium concentration and accumulate these intracellular solutes when serum sodium concentration increases.» | 228, 229 |
| 20417691 | Brain volume regulation (Neuroscience 2010) | «brain edema during hypoosmolar states and brain dehydration during hyperosmolar states» | 227, 228 |
| 24074529 | Expert panel recommendations (Am J Med 2013) | «Untreated acute hyponatremia can cause substantial morbidity and mortality as a result of osmotically induced cerebral edema, and excessively rapid correction of chronic hyponatremia can cause severe neurologic impairment» | 227, 229 |
| 4750450 | Dunn 1973, en ratas (ya en la bibliografía) | «did not become significant until volume had decreased by 8% or more» | 63 (umbral) |

Para las fases N6 y N7 ya hay candidatos comprobados: 32097926, 16180947 y 26102445 (hiponatremia del ejercicio; la 26102445 no tiene resumen y su frase saldrá del texto completo), 18550938 y 29637415 (tiazidas), 24569125 (guía europea), 3713747 (desmielinización osmótica).

## Casos y resultados esperados (batería de tests)

En **estado estable** salvo que se indique; entre paréntesis, lo que cambia en otra escala o con otro ajuste. Flechas con los umbrales de siempre (= por debajo de 0,15 · ↑/↓ hasta 0,5 · ↑↑/↓↓ desde 0,5). Los casos 10 y 11 tienen dos filas: su estado estable y su escala «días», que es la que enseña (regla del estado estable).

### Agua, sodio y volumen

| Caso | Ruedas | Agua corporal | Sodio corporal | Vol. extracelular | Vol. circulante efectivo | Natremia | Osmolaridad | Vol. células del cerebro |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. SIADH | ADH autónoma +1 | ↑ | = o ↓ | = o ↑ | = o ↑ | ↓↓ | ↓↓ | = o ↑ (↑↑ en días) |
| 2. Diabetes insípida central | ADH autónoma −1 | = o ↓ (↓↓ sin agua) | = | = o ↓ (↓ sin agua) | = o ↓ | = o ↑ (↑↑ sin agua) | = o ↑ | = (↓↓ sin agua, en días) |
| 3. Diabetes insípida nefrogénica | DI nefrogénica +1 | = o ↓ | = | = o ↓ | = o ↓ | = o ↑ | = o ↑ | = |
| 4. Polidipsia primaria | Polidipsia +1 | = o ↑ | = | = | = | = o ↓ | = o ↓ | = |
| 5. Dieta pobre en solutos con mucha bebida | Polidipsia +0,6, solutos +1 | ↑ | = o ↓ | = | = | ↓↓ | ↓↓ | = o ↑ (↑↑ en días) |
| 6. Vómitos o diarrea | Pérdidas +1 | = o ↓ | ↓ o ↓↓ | ↓↓ | ↓↓ | ↓ (↑ sin agua) | ↓ (↑ sin agua) | = o ↑ |
| 7. Insuficiencia cardíaca o cirrosis | IC/cirrosis +1 | ↑↑ | ↑↑ | ↑↑ | ↓ | ↓ | ↓ | = |
| 8. Insuficiencia suprarrenal primaria | Suprarrenal +1 | = o ↓ | ↓ | ↓ | ↓ | ↓ | ↓ | = o ↑ |
| 9. Hiperglucemia | Glucosa +1 | ↓ | = o ↓ | ↓ | ↓ | = o ↓ (↓ en minutos) | ↑↑ | = o ↓ (↓↓ en minutos) |
| 10. Falta de agua · estable | Acceso −1 | ↓↓ | = o ↑ | = o ↓ | = o ↓ | ↑↑ | ↑↑ | = o ↓ |
| 10. Falta de agua · días | Acceso −1 | ↓↓ | = | ↓ | ↓ | ↑↑ | ↑↑ | ↓↓ |
| 11. Falta de agua en el mayor · estable | Acceso −0,5, edad +1 | ↓↓ | = o ↑ | = o ↓ | = o ↓ | ↑↑ (↑ con edad 0) | ↑↑ | = o ↓ |
| 11. Falta de agua en el mayor · días | Acceso −0,5, edad +1 | ↓↓ | = | ↓ | ↓ | ↑↑ | ↑↑ | ↓ |
| 12. Dieta alta en sal | Sal +1 | = o ↑ | ↑ | ↑ | ↑ | = o ↑ | = o ↑ | = |
| 13. Control: dieta baja en sal | Sal −1 | = o ↓ | ↓ | = o ↓ | = o ↓ | = | = | = |
| 14. Control: edad sola | Edad +1 | = | = | = | = | = | = | = |

### Hormonas y analítica

| Caso | ADH | Sed | Renina | Aldosterona | Osm. urinaria | Na urinario | Diuresis | Potasio | Creatinina |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. SIADH | ↑↑ | ↓ | = o ↓ | = o ↓ | ↑ o ↑↑ | ↑ | = o ↓ (↓ en días) | = | = |
| 2. Diabetes insípida central | ↓↓ | ↑↑ | = o ↑ | = o ↑ | ↓↓ | ↓ | ↑↑ | = | = (↑ sin agua) |
| 3. Diabetes insípida nefrogénica | **↑** | ↑↑ | = o ↑ | = o ↑ | ↓↓ | ↓ | ↑↑ | = | = |
| 4. Polidipsia primaria | ↓ o ↓↓ | ↓ | = o ↓ | = o ↓ | ↓↓ | ↓ | ↑↑ | = | = |
| 5. Dieta pobre en solutos con mucha bebida | ↓↓ | ↓ | = | = | ↓↓ | ↓↓ | ↑ (menos que en el 4) | = | = |
| 6. Vómitos o diarrea | ↑ | ↑ | ↑↑ | ↑↑ | ↑ | ↓↓ | ↓ | ↓ | ↑ |
| 7. Insuficiencia cardíaca o cirrosis | ↑ | ↑ | ↑↑ | ↑↑ | ↑ | ↓↓ | ↓ | = o ↓ | = o ↑ |
| 8. Insuficiencia suprarrenal primaria | ↑ | = o ↑ | ↑↑ | **↓↓** | ↑ | **↑** | = o ↓ | ↑ | = o ↑ |
| 9. Hiperglucemia | ↑ | ↑↑ | ↑ | ↑ | = o ↑ | = | ↑↑ | = | = o ↑ |
| 10. Falta de agua · estable | ↑↑ | ↑↑ | = o ↑ | = o ↑ | ↑↑ | = o ↑ | ↓↓ | = | = o ↑ |
| 10. Falta de agua · días | ↑↑ | ↑↑ | ↑ | ↑ | ↑↑ | = o ↑ | ↓↓ | = | ↑ |
| 11. Falta de agua en el mayor · estable | ↑↑ | ↑ | = o ↑ | = o ↑ | ↑ (menos que en el 10) | = o ↑ | ↓↓ | = | = o ↑ |
| 11. Falta de agua en el mayor · días | ↑↑ | ↑ | ↑ | ↑ | ↑ (menos que en el 10) | = o ↑ | ↓↓ | = | ↑ |
| 12. Dieta alta en sal | = o ↑ | = o ↑ | ↓ | ↓ | = o ↑ | ↑↑ | = o ↑ | = | = |
| 13. Control: dieta baja en sal | = | = | ↑ | ↑ | = | ↓ | = | = | = |
| 14. Control: edad sola | = | = | = | = | = | = | = | = | = |

**El caso 7 no llega al equilibrio.** Es una retención mantenida (un paciente descompensado): el sodio y el agua siguen subiendo hasta el tope, y por eso el sodio urinario sigue ↓↓. Se acepta el aviso «tope de escala» en el agua y el sodio de este caso, igual que en la falta de agua.

**Las parejas que mejor enseñan a diferenciar:**

- **Diabetes insípida central frente a nefrogénica** (2 y 3): todo igual salvo la ADH, baja en la central y alta en la nefrogénica.
- **Vómitos o diarrea frente a insuficiencia suprarrenal** (6 y 8): las dos son hipovolémicas con natremia baja, pero el sodio urinario es bajo en la primera (el riñón retiene) y alto en la segunda (sin aldosterona no puede); el potasio va al revés.
- **SIADH frente a vómitos** (1 y 6): sodio urinario alto en el SIADH y bajo en la hipovolemia (PMID 3674097).
- **Sodio urinario en el SIADH y en la diabetes insípida** (1 y 2): los dos excretan el sodio que comen; en uno la orina lo concentra y en el otro lo diluye.
- **SIADH frente a insuficiencia cardíaca** (1 y 7): las dos con ADH alta y natremia baja; volumen extracelular normal en una y edemas en la otra.
- **Polidipsia con o sin solutos** (4 y 5): el mismo exceso de agua solo baja mucho la natremia cuando faltan solutos.
- **Vómitos con o sin agua** (6 y su ajuste): la misma pérdida da hiponatremia si se bebe agua y hipernatremia si no.
- **Sal frente a agua** (12 frente a 10): la sal cambia el volumen; el agua cambia la natremia.

### Notas «La fisiología» (revisadas por Fable 5.2)

| Caso | Nota |
| --- | --- |
| 1 | En el SIADH el riñón retiene agua, no sodio. Dos tercios de esa agua entran en las células y, además, el riñón «escapa»: elimina algo de sodio y responde menos a la ADH. Por eso la natremia baja mucho y no hay edemas |
| 2 | Sin ADH se orina mucho, pero la sed lo compensa: mientras haya agua, la natremia apenas sube. El problema empieza cuando no se puede beber |
| 3 | La diabetes insípida nefrogénica se parece a la central en todo menos en la ADH, que está alta: el riñón no responde a ella. Con agua a su alcance, la sed compensa |
| 4 | Se bebe sin sed. El riñón sano elimina el exceso con una orina muy diluida y la natremia apenas baja; por eso la sed y la ADH están frenadas |
| 5 | El riñón no elimina agua pura: cada litro de orina necesita un mínimo de solutos. Quien come muy poco excreta pocos solutos al día y, aunque su orina sea lo más diluida posible, solo puede eliminar unos pocos litros. Si bebe más que eso, el agua se queda |
| 6 | El líquido que se pierde lleva menos sodio que el plasma: por sí sola, la pérdida no baja la natremia. Baja porque, con poco volumen, la ADH se libera aunque la natremia sea baja y el agua que se bebe se queda. Con vómitos, el sodio urinario puede salir alto |
| 7 | Hay sodio y agua de sobra, pero no llenan las arterias: el riñón «cree» que falta volumen y retiene más agua que sodio. Por eso hay edemas y, a la vez, sodio bajo |
| 8 | Sin aldosterona el riñón pierde sodio aunque falte volumen: sodio urinario alto y potasio alto. Sin cortisol, además, la ADH sube. Más que sed, lo típico es el apetito por la sal |
| 9 | La glucosa saca agua de las células y diluye el sodio: sodio bajo con osmolaridad alta. Si la hiperglucemia se mantiene, la orina arrastra más agua que sodio y la natremia vuelve a subir: puede acabar normal o alta con mucha agua perdida. Si la osmolaridad fuera normal, el sodio bajo sería un artefacto del laboratorio (pseudohiponatremia). Sin insulina, el potasio sale de las células: en sangre puede estar normal o alto aunque falte en el cuerpo |
| 10 | Falta agua, no sodio: la natremia sube y el agua sale de las células. El volumen extracelular baja poco, porque solo un tercio del agua perdida era suya |
| 11 | La persona mayor nota menos la sed y concentra peor la orina: con la misma falta de agua, la natremia sube más |
| 12 | La sal cambia el volumen, no la natremia: da sed, se bebe, y el sodio queda casi igual en más líquido |

## Errores frecuentes y matices (N1–N8)

Mismo criterio que en la hipertensión (O4): el motor sigue la fisiología estándar y la nota explica el matiz.

| # | Planteamiento simplificado | Fisiología estándar | En el simulador |
| --- | --- | --- | --- |
| N1 | Hiponatremia = falta de sodio | Casi siempre sobra agua respecto al sodio. El sodio corporal puede estar bajo, normal o incluso alto (41087199, 41692632) | Natremia = sodio corporal frente a agua corporal; el caso 1 la baja sin perder sodio |
| N2 | Deshidratación y depleción de volumen son lo mismo | La deshidratación es falta de agua: la natremia sube y el agua sale de las células. La depleción de volumen es pérdida de sodio con su agua: se vacía el líquido extracelular y la natremia puede ser baja, normal o alta (9382413) | Dos acumuladores; casos 6 y 10 |
| N3 | La natremia indica el volumen | Una natremia baja puede ir con volumen bajo, normal o alto (41692632) | Casos 6, 1 y 7 |
| N4 | La ADH solo responde a la osmolaridad | Una pérdida de volumen importante la libera aunque la osmolaridad sea baja: el volumen manda sobre la concentración (en animales, a partir de un 8 % de volumen perdido: 4750450) | Relación 63 asimétrica |
| N5 | En la insuficiencia cardíaca sobra líquido, así que el riñón debería eliminarlo | Sobra líquido extracelular, pero las arterias están poco llenas: el riñón recibe la señal de que falta volumen y retiene sodio y agua (2193561) | Nodo M14 y relación 216 |
| N6 | La hiponatremia baja la osmolaridad siempre | No siempre. La hiperglucemia da sodio bajo con osmolaridad alta; y si la osmolaridad es normal, el sodio bajo es un artefacto del laboratorio (28174217) | Caso 9 |
| N7 | Cuanto más baja, más síntomas | Importa la velocidad. El cerebro se adapta en unos dos días soltando solutos; por eso la hiponatremia que se instaura deprisa da más síntomas, y corregir deprisa una crónica daña el cerebro (24074529, 30554800) | «Días» enseña la hiponatremia recién instaurada, con las células hinchadas; «estado estable», la crónica, ya adaptada |
| N8 | El sodio urinario dice cuánto sodio pierde el riñón | Es una concentración: depende también del agua de la orina. En el SIADH está alto porque la orina está concentrada, aunque se excrete el sodio que se come (41087199) | Relaciones 225 y 230; casos 1 y 2 |

## Qué se reutiliza del tema de hipertensión

| Qué | Cuánto | Cómo |
| --- | --- | --- |
| Causas | 4 de 11 (acceso al agua, sal, ADH autónoma, edad) | Mismo id, tal cual |
| Mecanismos | 13 de 15 | Mismo id y misma ficha «Qué es»; «La mueven» y «Mueve a» se calculan de las relaciones del tema |
| Relaciones | 36 de 68 | Mismo número y PMID; 11 de ellas (\*) con origen o destino cambiado porque la volemia se divide |
| Bibliografía | Los PMID de esas 36 relaciones, ya cotejados | Para las \*, la frase se revisa en el tema nuevo |
| Motor | Todo: suma, acumuladores (aquí dos), modula con signo, bloquea, fija, umbrales, asimetría, tres escalas | Sin cambios de cálculo |
| Interfaz | Mandos, fichas, analítica, selector de casos, avisos, temas Retro/Clásico, PWA | Generalizar lo que hoy importa `hipertension` directamente |

## Qué necesita el motor para que dos temas compartan mecanismos

El motor ya es genérico: `simular` no conoce ningún id y admite varios acumuladores. Lo que hay que cambiar está alrededor (fase N2).

1. **Biblioteca común de fisiología** (`src/fisiologia/`): los nodos y sus relaciones, una sola vez, con su número, PMID y frases. Cada tema importa los que usa. **Regla:** se comparte el **nodo** (qué es); sus **entradas** son de cada tema. Por eso `osmP` se comparte aunque en la natremia salga de los balances. Un nodo que cambia de significado (la volemia) no se comparte.
2. **Sobrescritura por tema** de nombre, etiquetas, frecuencia y explicación de un nodo, declarada al importar.
3. **Reasignar origen o destino al importar** (las relaciones \*): `importar(63, { volemia: 'vce' })` copia la relación con otro nodo y conserva número y PMID. **La explicación y la frase se revisan por tema**: el test «toda relación cita PMID con frase» exige una frase validada en cada tema, no heredada. En los documentos, siempre con asterisco. Un test vigila que la copia solo cambie lo declarado.
4. **Referencias a números.** `modula` y `bloquea` llevan listas de relaciones (la 15 modula la 13 y la 14; la 121, la 67 y la 68). Al importar, las listas se filtran a las relaciones presentes en el tema, y un test falla si queda una referencia muerta. Si no, `bloquea` lanzaría un error al importar los fármacos en N6.
5. **Qué es común y qué es de cada tema.** Común: signo, PMID y frase. Por tema: intensidad, `intensidadNegativa`, umbral, escala, origen o destino reasignado (con `aplicarAjustes` y su tabla de motivos, que pasa a ser por tema). Si se corrige un signo, cambia en los dos temas y los dos juegos de tests lo vigilan.
6. **Parámetros por tema** (`parametros` ya está en `Modelo`): con dos acumuladores acoplados, el horizonte de «días» de la natremia se calibra aparte para que «días» quede a medio camino y no sature.
7. **Bibliografía común**: `articulos` y `frases` pasan de `src/temas/hipertension/fuentes.ts` a la biblioteca común; `npm run fuentes` genera un `docs/fuentes.md` por tema (o uno con secciones).
8. **Registro de temas en la interfaz.** Un objeto `Tema` (modelo, fichas, vista, panel de analítica, valores, retos, términos, orden de los mandos) elegido por la dirección (`#t=natremia&c=…`). Los enlaces y el hub PhysiQ ya pasan el fragmento: un satélite, dos temas. Los enlaces antiguos sin `t=` abren la hipertensión. **Lo que se guarda en el dispositivo** (preferencias por tema, último caso, retos hechos) y el reto por enlace del profesor se separan por tema.
9. **Vista propia** para la natremia (compartimentos y célula del cerebro).
10. **Scripts por tema**: `revision-fichas`, `revision-retos`, `fuentes` y `calibrar` reciben el tema como argumento.
11. **Avisos de tope por tema y por caso**: el tope de un acumulador es parte de la lección en «sin agua» y en el caso 7, y un defecto de calibración en los demás.
12. **La hipertensión, idéntica.** Antes de tocar nada en N2, se guardan los **valores numéricos** (no solo las flechas) de los 35 casos, los retos y las sesiones de ejercicio en las tres escalas, y un test exige que coincidan tras el cambio.

**Combinar temas** (un paciente con hipertensión y natremia a la vez) no se hace ahora: los dos temas representan el volumen de forma incompatible (volemia frente a agua, sodio, extracelular y circulante efectivo), y combinarlos exigiría rehacer la hipertensión sobre los dos acumuladores.

## Plan de fases

| Fase | Contenido | Modelo recomendado |
| --- | --- | --- |
| N1 · Modelo (este documento) | Hecho: propuesta, revisión de Fable 5.2 y decisiones de Edu | — |
| N2 · Motor compartido | Hecho (21 nov 2026, ver `docs/plan.md`): biblioteca común, registro de temas, scripts por tema; la hipertensión idéntica en valores numéricos | — |
| N3 · Modelo como datos | Nodos, relaciones, 14 casos como tests, cotejo de frases con el script, calibración con tabla de ajustes (incluido el conflicto de la sed, ver «Límites») | Opus 5.5 |
| N4 · Diseño de la vista | Compartimentos y célula del cerebro, en el modo diseño de claude.ai, como el prototipo de la fase 2 | claude.ai (modo diseño) |
| N5 · Pantalla y fichas | Selector de tema, vista, fichas y avisos; textos revisados por Fable 5.2 | Opus 5.5; Fable 5.2 para los textos |
| N6 · Tratamientos | Ver «Alcance» | Opus 5.5 |
| N7 · Ejercicio y uso docente | Hiponatremia del ejercicio, pérdidas por sudor, retos, valores orientativos | Opus 5.5; búsqueda de valores en una sesión aparte |

## Decisiones de Edu

### Propuesta (20 nov 2026)

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | Las causas y lo que queda fuera | Aprobada; con P9 pasan a ser 11 causas (21 nov 2026) |
| P2 | Tiazida en N6, con el asa | Aprobada |
| P3 | Volumen de las células del cerebro y osmolitos en la primera versión | Aprobada |
| P4 | Hiperglucemia en la primera versión | Aprobada |
| P5 | Insuficiencia cardíaca y cirrosis juntas | Aprobada |
| P6 | Relaciones con respaldo débil | Resuelta con las fuentes de la revisión; queda la 230 como supuesto |
| P7 | Biblioteca común con intensidades por tema | Aprobada |
| P8 | Un satélite con dos temas (`#t=`) | Aprobada |
| P9 | Sal y solutos en la misma rueda | **Cambiada el 21 nov 2026**: rueda propia «Dieta pobre en solutos»; la sal se reutiliza tal cual |

### Revisión de Fable 5.2 (aprobadas el 21 nov 2026)

| # | Decisión | Dónde |
| --- | --- | --- |
| 1 | Sodio urinario como concentración: relación 230, como supuesto | E2, «Supuestos» |
| 2 | Diabetes insípida nefrogénica como bloqueo | E3, relación 219 |
| 3 | Escape desde el agua corporal, atenuado en insuficiencia cardíaca y cirrosis | E4, relaciones 75\* y 216 |
| 4 | Convención isotónica; pérdidas digestivas con 202 = 206 | E5 |
| 5 | Hiperglucemia: 211 fuerte, 209 menor y relación 231 | E6 |
| 6 | Solutos solo sobre la dilución: 16 y 16b | E7, relación 221 |
| 7 | Regla del estado estable; casos 10 y 11 en «días», sin la relación alternativa Osmolaridad → Reabsorción de Na | E1, C10 |
| 8 | Flechas esperadas de los casos 1, 4, 6, 8, 9 y 12 | C1–C17 |
| 9 | Rueda propia «Dieta pobre en solutos» (11 causas) | T16 |
| 10 | Reutilizar la 74 | E14 |
| 11 | Casos de control 13 (sal baja) y 14 (edad) | E10 |
| 12 | Fuentes nuevas para 202, 206, 207, 222, 223 y 226 | F5–F8 |
| 13 | «Células del cerebro» en lugar de «neuronal» | E12 |
| 14 | Caso 7 sin equilibrio, con el aviso de tope aceptado | C11, M7 |

Se aplicaron también las opciones principales de las mejoras y del estilo de la revisión (alcance, textos, motor compartido). Lo que no se aplicó, y por qué:

| Punto | Qué proponía | Por qué no |
| --- | --- | --- |
| T16, parte | Que la rueda de solutos baje también algo el sodio corporal | No hay frase en PubMed que lo respalde; sin esa relación, las flechas del caso 5 (renina y aldosterona «=») siguen valiendo |
| C15 | Relación Hiperglucemia → Volumen extracelular (+) al principio | Alternativa, no opción principal: queda en «Límites» |

## Límites conocidos

- El modelo no está calibrado: las intensidades son de partida y se ajustan con los 14 casos en la fase N3.
- **Conflicto de la sed** (E9): la sed tiene que ser fuerte para que la diabetes insípida con agua libre no se deshidrate, y con esa misma sed la hiperglucemia bebe de más. Se intentará equilibrar con la 203 en N3; si no se puede, la alternativa (que la sed por glucosa pese menos que la sed por sodio) sería un cambio de modelo para Edu.
- La natremia sale de una suma (sodio menos agua), no del cociente de Edelman: vale para las flechas, no para mmol/L.
- No hay escala «horas»: la adaptación cerebral se ve entre «días» (recién instaurada) y «estado estable» (crónica). La velocidad de corrección necesitará la escala nueva en N6.
- El potasio no entra en la natremia, aunque perder potasio también la baja; y no se modela el paso de potasio entre células y plasma (en la hiperglucemia sin insulina, el potasio en sangre puede ser normal o alto aunque falte en el cuerpo).
- No hay ninguna pérdida **renal** de sodio salvo la insuficiencia suprarrenal (el síndrome pierde sal cerebral queda fuera). La tiazida (N6) cubrirá ese hueco.
- Vómitos y diarrea van juntos: el modelo no ve el equilibrio ácido-base, ni el sodio urinario alto que puede dar el vómito.
- En la hiperglucemia, el agua que sale de las células expande al principio el volumen extracelular; el modelo no lo ve (solo la pérdida posterior por la orina).
- Las frases de los artículos nuevos son del resumen; los que tengan texto completo en PubMed Central se leerán enteros al construir. Algunas cifras de los textos (umbral renal de la glucosa, 15–20 L de diuresis máxima) son fisiología estándar sin frase cotejada todavía: no entran en las fichas sin ella.
