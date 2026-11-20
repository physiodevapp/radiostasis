# Diseño del simulador (cerrado el 13 nov 2026)

Referencia visual: `docs/prototipo/` (pantalla horizontal, móvil, ficha de mecanismo, avisos). El prototipo muestra el caso 8 (hiperaldosteronismo primario, estado estable) con valores fijos.

## Principio visual

**Lo que se toca es de metal; lo que se lee está iluminado.** Las causas son mandos físicos que gira el usuario. Los mecanismos, la presión y las salidas son indicadores que se leen y se mueven solos. Además, la forma distingue las dos cosas: mandos redondos frente a ventanas de sintonía.

## Distribución

### Pantalla horizontal (pantalla externa, página fluida)

1. **Cabecera:** título «Tensión arterial», selector de caso, interruptor de escala de tiempo (Minutos · Días · Estado estable), botón «Modo reto» (inactivo en la v1) y «Restablecer».
2. **Tres columnas** (en flex-wrap, se apilan en pantallas estrechas):
   - **Causas** (320–410 px): panel con los 12 mandos en rejilla de 3.
   - **Centro** (2 fr): tarjeta «Vasos» con las dos vistas y el botón de pausa; debajo, el dial de presión y las tres salidas (volemia, gasto, RVP) como ventanas anchas.
   - **Mecanismos** (340–420 px): 17 ventanas de sintonía agrupadas por sistema, en 2 columnas por grupo.
3. **Pie:** panel de analítica (8 valores en rejilla de 4, estilo informe en papel crema) y tarjeta «Qué mirar en este caso».
4. Nota final: «Modelo cualitativo con fines docentes. No es un simulador clínico.»

### Móvil (390 px de ancho)

Cabecera con «Modo reto», selector de caso, interruptor de tiempo («Estable» abreviado), fila de vasos (longitudinal + transversal de 90 px + pausa), dial pequeño con las tres salidas, pestañas Causas · Mecanismos · Analítica (la de causas en rejilla de 4 mandos de 72 px) y botón «Qué mirar» al pie.

Construido en el hito 3c (hasta 720 px de ancho; más ancho, la página de siempre):

- Cabecera: título con Sonido y Restablecer solo con icono; «Modo reto» oculto en el móvil mientras esté inactivo.
- Vasos, presión y pestañas quedan fijos arriba al bajar si la ventana tiene al menos 640 px de alto. Con menos alto (texto ampliado, móvil en horizontal) bajan con la página y, cuando el dial sale de la vista, aparece una pastilla «PAS · PAD» con flechas que devuelve al dial. Además (18 nov 2026), no se fijan si ocupan más del 55 % del alto de la pantalla: con «Grande» llegaban a 695 de 915 px y las placas de las causas quedaban en una franja de 60 px, imposible de tocar. Entonces bajan con la página y aparece la pastilla (`ajustarFijo` en `src/app/movil.ts`).
- La lista de propiedades de los vasos y su explicación van a una hoja («Cómo leerlos», botón ⓘ).
- «Qué mirar» es una barra fija al pie con el principio de la nota; al tocarla, la nota completa en una hoja.
- Ficha y hojas suben desde abajo y se cierran con «Cerrar», tocando el fondo, con Escape o deslizándolas hacia abajo desde la cabecera.
- Hito 3e: el asa queda siempre arriba del todo; «← volver» es un icono a la izquierda del título. Mientras la hoja está abierta, cada ficha ocupa una entrada del historial del navegador (`src/app/historial.ts`): el «atrás» del sistema (gesto desde el borde, botón atrás, Alt+← en escritorio) vuelve a la ficha anterior y, en la primera, cierra la hoja; al cerrarla de otro modo se retiran esas entradas. Deslizar a la derecha sobre la ficha también vuelve (solo gestos horizontales claros: no choca con el scroll ni con mantener pulsado para seleccionar texto). La hoja «Qué mirar» se cierra igual con el «atrás». En Android, Chrome trata el «atrás» del sistema como una petición de cerrar el diálogo modal («cancel», sin pasar por el historial): si hay una ficha anterior, la ficha cancela el cierre y vuelve a ella; Escape sigue cerrando. Chrome solo deja cancelar ese cierre si ha habido alguna pulsación en la página desde la vez anterior; con dos «atrás» seguidos el segundo cierra la hoja a la fuerza, y entonces se reabre al instante, sin animación, en la ficha anterior (`src/app/historial.ts`).
- Con anchos de 340 px o menos (texto ampliado al 150 %), mandos en 3 columnas; con 320 px o menos, pestañas en varias filas; con 300 px o menos, salidas bajo el dial, pestañas apiladas y botones de los vasos debajo de los dibujos. Hasta el 18 nov 2026 las salidas pasaban bajo el dial desde 340 px: con «Grande», un móvil de 412 px mide 330 px y uno de 384 px, 307, y el dial quedaba solo en su fila. Por encima de 300 px, la leyenda (sistólica y diastólica) y la presión orientativa van a todo el ancho bajo el dial y los determinantes, no en la columna del dial (18 nov 2026).

### Ficha de mecanismo o causa

Panel lateral de 480 px en la pantalla horizontal; hoja deslizante desde abajo en el móvil. Se abre al tocar un mando o una ventana. Secciones:

1. Indicador del nodo y valor en este caso.
2. Qué es · Qué hace.
3. Animación del mecanismo celular, con pausa y pasos que se resaltan (hito 3d: ADH, aldosterona, regaliz, renina y placa; con movimiento reducido, quieta en el último paso).
4. En este caso (texto del caso activo).
5. La mueven · Mueve a (relaciones del modelo; cada una abre su ficha).
6. Aviso (⚠), si lo hay: un matiz clínico, un error frecuente o un límite del modelo.

En los textos de la ficha y de «Qué mirar», los términos del modelo son enlaces internos a su ficha (subrayado punteado; lista en `src/temas/hipertension/terminos.ts`: palabras completas o frases concretas, la más larga primero, una vez por apartado). «Ampliar con IA», como en `physiq-assessment`: al seleccionar texto, barra «✨ Ampliar en … ↗ | ▾» (Perplexity por defecto, Google con Gemini o Claude); al pie de cada ficha, «✨ Preguntar sobre esta ficha ↗». La pregunta se orienta a la fisioterapia (`src/app/ampliar-ia.ts`). No se activa dentro del hub PhysiQ.

### Avisos de realismo

- **Combinación hipotética:** banda con icono, borde de acento y chips de las causas implicadas («Tumor de renina · causa rara»). En la pantalla ancha, tira fina bajo la cabecera, a todo el ancho (el tablero se reduce para que siga cabiendo). En el móvil, la barra «Qué mirar» del pie pasa a ser el aviso («Combinación hipotética: tumor de renina y feocromocitoma (causas raras)») y su hoja muestra la banda completa.
- **Frecuencia en cada mando:** sin etiqueta si es común; pastilla «poco frecuente» o «causa rara» sobre el borde superior de la placa (sin ocupar alto en el mando). Mide con qué frecuencia se ve en la práctica clínica (título de la pastilla y nota en la ficha). En la ADH autónoma cambia con el extremo: «causa rara» hacia la diabetes insípida y «poco frecuente» hacia el SIADH. La placa tiene un hueco en forma de cápsula, 3 px más grande que la pastilla, por el que se ve el fondo del panel (la madera en Retro); lo calcula cada mando a partir del ancho de su pastilla. La pastilla nunca tapa los rótulos de los extremos del mando («0 1», «− +»). En el tablero de escritorio muy bajo (p. ej. 1280×720) el panel de causas se compacta para que quepa «Qué mirar».
- **Tope de escala** (antes «fuera de rango»): chip con borde discontinuo junto al indicador saturado; en la analítica, bajo la flecha. Un indicador en tope de escala gana un poco de margen arriba, para que con varios a la vez (volemia, gasto, RVP, sistólica, diastólica) cada chip tenga su sitio.

Textos y reglas en `src/temas/hipertension/avisos.ts`, revisados por Fable 5.2 (`docs/revision-avisos-3e-fable.md`). Hito 3e.

### Fármacos (fase 4, 16 nov 2026)

Opción A de la maqueta, elegida por Edu.

- **Pestañas «Causas | Fármacos»** en la cabecera del panel de madera, con el número de fármacos activos. Las dos rejillas ocupan la misma celda, así que el panel no cambia de alto. En el móvil son dos pestañas de la barra (Causas · Fármacos · Mecanismos · Analítica) que comparten el panel; la cuenta va sobre la palabra.
- **Mandos de acero**: lo que se toca sigue siendo metal, pero los fármacos son de acero (degradado `#FFFFFF → #B9C3CA → #5E6870`, moleteado `#5D666E`/`#DFE6EA`, arco `#8FBBE3`) y su placa es gris azulada (`#E9EEF1 → #C9D2D8`, borde `#7C8A94`). Rueda de 0 a «dosis plena»; valores «sin», «50 %», «dosis plena». En lugar de la frecuencia, la pastilla dice dónde actúa («SRAA», «β1 · β2», «túbulo distal»…). Celda final «Quitar tratamiento»: apagada (40 %) sin fármacos; con fármacos, borde continuo azul y fondo `#1F2A33`. No se oculta, para que la rejilla no se mueva. En el móvil ocupa todo el ancho de la rejilla. En Clásico, mando de acero sobre la superficie lisa.
- **Chip «Tratamiento»** en la cabecera (icono de pastilla, «IECA · plena»), visible aunque se esté en Causas; al tocarlo se abre la pestaña Fármacos. En la pantalla ancha el selector de caso se estrecha para que quepa sin partir la fila. No aparece en el móvil (lo sustituye la cuenta de la pestaña).
- **Insignias** «⊘ IECA» (bloquea) o «↓ tiazida» (baja el nodo) sobre las ventanas de los nodos donde actúa cada fármaco activo.
- **Avisos de interacción**: banda con borde naranja (`#E0703A`, «Contraindicado», «No se asocian») o ámbar («Vigilar el potasio») al principio de «Qué mirar»; en el móvil ocupan la barra del pie si no hay combinación hipotética.
- **Portátiles con la pantalla escalada** (16 nov 2026): desde 1180 px de ancho las tres columnas se estrechan (290 · 460 · 300 px de base) para caber en una fila aunque no haya tablero fijo (alto menor de 700 px), p. ej. 1920×1080 al 150 % de Windows (1280 px). Antes, los mecanismos bajaban a otra fila por debajo de unos 1325 px.
- **Selector de caso** con dos grupos: «Casos básicos» (1 a 14) y «Con fármacos» (15 a 24). En los casos con fármaco, la nota se titula «El fármaco»; en los de ejercicio, «El ejercicio», y en los demás, «La fisiología».
- **Ficha de fármaco**: «Dosis», «Qué es», «Qué hace», «En este caso», **«En la consulta de fisioterapia»**, «Actúa sobre» (cada bloqueo dice qué relaciones corta y cuánto) y el aviso de que «dosis plena» es una dosis habitual y el efecto, cualitativo. En las fichas de los mecanismos, la relación bloqueada lleva «bloqueada un 35 % por IECA».

### Ejercicio (fase 5, 16 nov 2026)

Opción A de la maqueta, elegida por Edu.

- **Tercera pestaña** «Causas | Fármacos | Ejercicio» en el panel de madera, con el número de mandos activos. En el móvil, cinco pestañas en la barra (Causas · Fármacos · Ejercicio · Mecanismos · Analítica); con poco ancho (texto ampliado o «Grande» a 412 px) pasan a 3 + 2.
- **Mandos de cobre** (degradado `#FBD9BC → #C27445 → #6B3518`, moleteado `#6E3A1C`/`#F1B98E`, arco `#E58A4E`, placa `#F5E1D2 → #DDBBA2` con borde `#A8683F`). Pastilla «minutos» en la sesión y «meses» en el entrenamiento. Valores por tramos: «reposo · suave · moderada · intensa · vigorosa» (aeróbica), «reposo · ligera · moderada · alta · intensa» (fuerza), «sedentario · ocasional · regular · entrenado».
- **Sección «Sesión»**: selector «Antes · Durante · Al terminar», sesión aeróbica y de fuerza, y «Sin ejercicio» (como «Quitar tratamiento», en el color del ejercicio). Girar una rueda de la sesión con el momento en «Antes» pasa a «Durante»; elegir «Durante» o «Al terminar» sin sesión pone una aeróbica moderada.
- **Sección «Entrenamiento»**: aeróbico, fuerza e isométrico. Actúan en el reposo (estado estable).
- **Escala de tiempo en la sesión**: el interruptor se atenúa y debajo aparece «La sesión parte del estado estable» (en el móvil, solo atenuado). Elegir una escala vuelve a «Antes». La analítica dice «Durante la sesión» o «Al terminar la sesión».
- **Dial**: en la sesión, agujas discontinuas y tenues con la presión de antes, y «Antes de la sesión» en la leyenda.
- **Chip «Ejercicio»** en la cabecera («Aeróbica moderada · durante», «Entreno isométrico regular»), que abre la pestaña. Con el chip del tratamiento a la vez, los dos se estrechan y «Modo reto» pierde su etiqueta para no partir la fila.
- **Selector de caso** (opción C de la maqueta, elegida por Edu): ya no es un `select` nativo. El botón «Caso» abre una lista con buscador: en la pantalla ancha, un panel bajo el botón con el cursor en el buscador (flechas para recorrer, Intro elige, Escape cierra); en el móvil, una hoja como las demás (asa, deslizar, «atrás» del sistema) que no abre el teclado y no cambia de alto al filtrar, para que el buscador no se mueva bajo el dedo. Con un teclado físico, al teclear sobre la lista el texto va al buscador. Cada caso lleva su número, su nombre y chips de lo que combina: causa (ámbar si es poco frecuente, naranja si es rara), fármaco (acero) y ejercicio (cobre). El buscador mira el número, el nombre, los chips y el grupo («fármacos», «ejercicio»), sin distinguir tildes ni mayúsculas, y resalta lo encontrado. Tres grupos: «Casos básicos», «Con fármacos» y «Con ejercicio» (25 a 33). Código en `src/app/selector-caso.ts`. La nota de los casos con ejercicio se titula «El ejercicio».
- **Ficha de ejercicio**: «Intensidad» o «Entrenamiento», «Qué es», «Qué hace», «En este caso», «En la consulta de fisioterapia», «Actúa sobre». Las relaciones de la sesión fuera de su momento salen apagadas («solo durante la sesión»). En la sesión, el valor de cada nodo dice «durante la sesión» o «al terminar la sesión».


### Compartir por enlace (fase 6, 16 nov 2026)

Opción A de la maqueta, elegida por Edu: con panel y pregunta para el alumno, en verde agua (`--enlace: #8fd0c0`, fondo `#1d2a27`), porque el ámbar es de los avisos, el azul de las bajadas y el acero de los fármacos.

- **Botón «Compartir»** en la cabecera, antes de Ajustes. En la pantalla ancha abre un panel bajo el botón (como Ajustes); en el móvil es un icono al final de la fila del caso, bajo «Restablecer», y abre una hoja como las demás.
- **Panel**: «El enlace abre el simulador así:» con chips de lo que lleva (causas con su frecuencia, fármacos en acero, ejercicio en cobre, escala o momento), «Pregunta para el alumno (opcional)» de hasta 200 caracteres en una línea, el enlace (solo en la pantalla ancha), «Copiar enlace» y, en el móvil con menú de compartir del sistema, «Compartir…» (WhatsApp, Classroom, correo…). Nota: «El enlace lleva las causas, los fármacos, el ejercicio, el momento de la sesión, la escala de tiempo y la pregunta. Todo va escrito en el propio enlace: no se guarda nada en ningún servidor.»
- **Enlace**: el estado va en el fragmento (`#c=hiperaldo:1&f=espironolactona:1&e=sesionAerobica:0.5&m=durante&t=dias&p=…`); lo que vale lo de siempre no se escribe. Funciona en la raíz, en un subdirectorio y sin conexión. Al leerlo se descarta sin error lo que no se reconoce. Código en `src/app/enlace-caso.ts` (tests en `tests/enlace-caso.test.ts`) y `src/app/compartir.ts`.
- **Al abrir un enlace**: tira «Caso compartido» bajo la cabecera con la pregunta («Abierto desde un enlace» si no hay) y «Quitar». En el móvil, la pregunta ocupa la barra «Qué mirar» del pie (antes que la combinación hipotética y los avisos de interacción) y la banda completa va en su hoja. Mover un mando no la quita; «Quitar» sí, y «Restablecer» quita además el enlace de la dirección. Si el estado coincide con un caso, el selector lo nombra. La pregunta es texto plano del profesor: no se revisa.
- **Cabecera en una fila**: si los controles no caben junto al título, se compactan por pasos: sin «próximamente», después Compartir, Ajustes y Sonido solo con icono, y por último sin el botón inactivo «Modo reto». Si ni así caben, quedan en dos filas como antes.
- **Dentro del hub PhysiQ**, el enlace abre Radiostasis sola (decisión de Edu, 16 nov 2026), salvo que el hub se anuncie (convención del 17 nov 2026, `docs/hub-physiq.md`): entonces abre el hub con Radiostasis dentro (`…/physiq/?sat=radiostasis#c=…`) y el panel dice «El enlace abre PhysiQ con el simulador así:».

### Notas de interacción entre causas (fase 6, 17 nov 2026)

- Bandas en «Qué mirar», como los avisos de fármacos, pero en **gris azulado** (`--nota: #a9bccd`, fondo `#222a31`) y con icono «i» en lugar de «!»: cuentan cómo se combinan dos causas, no avisan de un riesgo.
- Van detrás de los avisos de fármacos y ejercicio. En el móvil, la barra del pie muestra la primera nota si no hay pregunta del profesor, combinación hipotética ni otro aviso.
- Once notas, con sus fuentes y lo que muestra el modelo, en `docs/notas-interaccion.md`.

### Modo reto (fase 6, 17 nov 2026)

Opción A de la maqueta, elegida por Edu, con las pistas en texto de la opción C. Color violeta (`--reto: #c4a8f0`, fondo `#241f30`): ni aviso, ni fármaco, ni ejercicio, ni enlace.

- **Entrada**: botón «Modo reto» en la cabecera de la pantalla ancha (sustituye al «Modo reto · próximamente») y, también en el móvil, la primera fila de la lista de casos («Modo reto · 10 pacientes con las causas ocultas…»).
- **Cabecera**: el selector de casos y «Compartir» dejan sitio al chip «Reto 3 de 10» con un punto por reto (verde acierto, ámbar a medias, naranja fallo, violeta el actual). El botón pasa a «Salir del reto» (en el móvil, una «×» al final de la fila del reto). «Restablecer» devuelve el paciente del reto como empezó, sin tocar la respuesta.
- **Panel de causas → «Respuesta»**: sin mandos, sin valor y sin pastilla de frecuencia; las placas se eligen (una o dos; una tercera sustituye a la primera) con borde violeta y «✓». Fármacos y ejercicio se pueden tocar para explorar.
- **«Qué mirar» → el paciente**: enunciado, pregunta, pistas destapadas, «Tu respuesta», «Pista · quedan N» y «Comprobar». En el móvil, el enunciado ocupa la barra del pie.
- **Corrección**: los mandos vuelven con el paciente real; cada placa elegida se marca en verde (acierto) o naranja (sobra), y la que faltaba con borde discontinuo y «!». Las claves se marcan en violeta en la analítica, los mecanismos y la leyenda del dial (sistólica y diastólica). «Qué mirar» muestra «Correcto / A medias / No», qué falta o sobra, «Siguiente reto», «Lo que lo delataba» y, ya sin ocultar, los avisos y las notas de interacción.
- **Resultado**: tras el reto 10, aciertos y retos a medias, con la lista de soluciones, «Empezar de nuevo» y «Salir del reto».
- **Lo que se oculta** mientras el reto está sin corregir: ver `docs/retos.md`. En las fichas, todas las causas salen con «?» y sin peso, al final de «La mueven», y «En este caso» dice «una causa oculta».
- **Cabecera apretada**: primero «Modo reto» se queda solo con icono; después, también Compartir, Ajustes y Sonido.
- Datos en `src/temas/hipertension/retos.ts`; corrección en `src/motor/reto.ts`; `docs/retos.md` se genera con `npm run revision-retos`.

### Ficha de estudio exportable (fase 6, 17 nov 2026)

Maqueta elegida por Edu, con las recomendaciones: dos tipos de hoja, fichas añadidas por defecto, preguntas genéricas y QR.

- **Dónde**: en el panel de «Compartir», que pasa a llamarse «Compartir o exportar». Sección «Ficha de estudio»: «Resumen» u «Hoja de trabajo», casilla «Añadir las fichas de lo que está activo» (marcada) y «Imprimir o guardar en PDF», que abre el cuadro de imprimir del navegador (en Android, «Guardar como PDF»). En el reto no se ofrece: «Compartir» está oculto.
- **Resumen**: título del caso (o «Combinación libre»), fecha, chips de lo que está puesto, pregunta del profesor si la hay (la escrita en el panel o la del enlace), presión con sus determinantes, analítica, mecanismos por grupos y «Qué mirar» con avisos y notas.
- **Hoja de trabajo**: las mismas tablas con huecos para las flechas y tres preguntas genéricas con líneas; las soluciones, en la página siguiente (el enlace y el QR abren el caso resuelto: lo dice el detalle de la opción).
- **Fichas**: «Qué es», «Qué hace», «En este caso» y «En la consulta de fisioterapia» de cada causa, fármaco o ejercicio activo.
- **Pie**: «Simulador docente y cualitativo…», las fuentes del modelo (artículos indexados en PubMed), el enlace al caso escrito y su QR (librería `qrcode-generator`, MIT, que se carga solo al exportar). Sin número de página: las fichas largas ocupan más de una hoja.
- Papel blanco y poca tinta; tipografía de la aplicación. Código en `src/app/exportar.ts`.

### Valores orientativos (fase 6, punto 5, 17 nov 2026)

- **Opción** «Valores orientativos: No | Sí» en Ajustes, desactivada por defecto y recordada en el dispositivo, con la nota fija debajo («El simulador solo calcula hacia dónde y cuánto se mueve cada valor…»).
- **Analítica**: bajo la flecha de cada valor, la cifra («≈ 141 mmol/L») o la banda con su intervalo aproximado («suprimida (≈ 0,2–0,5 ng/mL/h)») y una línea gris con el rango normal (no aparece si la banda ya es la normal); el subtítulo añade «valores orientativos». Con cifras, la celda pasa a dos líneas para que nada se salga.
- **Bandas, no cifras**, en la osmolaridad urinaria (solo la banda: en el SIADH un número absoluto engaña), la diuresis, la renina y la aldosterona: la cifra interpolada podía contradecir la banda.
- **Presión**: bajo el dial, «ORIENTATIVO ≈ 135/85 mmHg · normal en reposo < 130/85» (ESH 2023: óptima < 120/80, normal hasta 129/84). En una sesión de fuerza, «muy alta durante el esfuerzo» (los picos reales superan los 250 mmHg).
- **Ficha** de cada valor: «ORIENTATIVO ≈ 3,0 mmol/L · normal 3,5–5,0 mmol/L (depende del laboratorio)». En el tope de escala, «≥» o «≤» con el ancla del extremo.
- En el tope de escala, «≥» o «≤». La creatinina por debajo de lo normal se muestra «normal» (indica poca masa muscular, no un riñón mejor).
- Datos en `src/temas/hipertension/valores.ts` (anclas y bandas), traducción en `src/motor/valores.ts`; fuentes y comprobación caso a caso en `docs/valores-orientativos.md`.
### Ir a cualquier reto (fase 7, 17 nov 2026)

Propuesta de Edu: los puntos de progreso del chip «Reto N de 11» llevan a cualquier reto. En escritorio, clic en el punto (se agranda al pasar el cursor); con teclado, el chip de puntos es un control deslizante y las flechas pasan al reto anterior o siguiente. En pantalla táctil se toca un punto o se arrastra el dedo por la fila: el punto de debajo se agranda, aparece encima un globo «Reto 7» (debajo lo taparía el dedo) y al levantar el dedo se salta a ese reto. Se conservan los resultados de los demás retos. En el móvil los puntos ocupan el resto del chip y, por debajo de 400 px, «de 11» se oculta para que quepan los once.

### Retos por enlace (17 nov 2026)

Opción A de la maqueta, elegida por Edu, con claves automáticas, explicación del profesor, pista automática y `#reto=N`.

- **En «Compartir o exportar»**, arriba, el interruptor «El enlace abre: El caso | Un reto». «Un reto» se pinta en violeta, como el modo reto. Con él, «El alumno ve al paciente y deduce las causas:», los chips de las causas salen discontinuos con «· causa oculta» (fármacos, ejercicio y escala se ven), y la pregunta del caso deja sitio a dos campos de una línea: «Enunciado del caso» y «Explicación de la solución» (los dos opcionales, hasta 300 caracteres). Debajo, las claves que se marcarán, con el aviso de que son los valores que más cambian y no necesariamente los que distinguen la causa, y «Copiar enlace del reto» en violeta (en el móvil, también «Compartir…»). Sin causas o con más de tres, un aviso en ámbar y los botones apagados. La ficha de estudio no cambia.
- **Claves automáticas**: los valores que más se mueven, hasta dos de la analítica y dos de los mecanismos y los determinantes de la presión (si un grupo no llega, se completa con el otro), sin las que quedan en «=». Se calculan al abrir el enlace con el estado que lleva (`clavesAutomaticas` en `src/motor/reto.ts`, grupos en `gruposClavesReto` de la vista). Edu aprobó «las cuatro de la analítica y los determinantes»; al probarlo con los 11 retos de la lista se quedaban fuera la rigidez y la placa (reto 5) o el simpático (reto 3), y se cambió a dos y dos: coinciden 25 claves con las escritas a mano frente a 21.
- **Pista automática**: una sola, «Fíjate en «Potasio plasmático» y «Actividad mineralocorticoide»: son los valores que más se mueven» (la mayor de cada grupo, con el nombre completo). No nombra los valores que se llaman como una causa (ADH, renina, aldosterona y TFG, en `evitaEnPista`): casi darían la respuesta, y la pista pasa al siguiente que más se mueve (opción A, elegida por Edu el 18 nov 2026). Esos valores sí pueden ser claves al corregir.
- **El alumno**: el modo reto de siempre con un solo paciente. Chip «Reto del profesor» con el icono del enlace, sin puntos ni «Siguiente»; «Qué mirar» con el enunciado (sin él: «Este reto no tiene enunciado: todo lo que sabes del paciente está en el simulador»), «Pista» («No hay pistas» si nada se mueve), «Comprobar» y hasta tres causas en «Respuesta». Al corregir: el resultado, «Salir del reto», «Explicación del profesor» si la hay y «Lo que más se mueve» con las claves en chips violeta.
- **Enlace**: `#reto=` y el estado del caso (con `p` = enunciado y `x` = explicación) en base64url, para que las causas no se lean a simple vista. No es un cifrado y el panel lo dice. Admite de una a tres causas; lo que no se descodifica se descarta sin error y abre el simulador normal. `#reto=3` abre el reto 3 de la lista (de 1 a 11). Al recargar, el reto sigue; al salir, se quita de la dirección. Código en `src/app/enlace-caso.ts` y tests en `tests/retos-enlace.test.ts`.
- **Textos** revisados por Fable 5.2 (`docs/revision-retos-enlace-fable.md`): 14 retoques aplicados con la opción principal. También cambian dos textos de los retos de la lista: «¿Qué causa o causas explican lo que ves?» y «Toca las causas que creas que explican el caso (una o dos)».

### Lateralidad de la estenosis (fase 7, 17 nov 2026)

Opción A de la maqueta, elegida por Edu: una franja «Estenosis renal · Bilateral · Unilateral · Riñón único» en la cabecera del panel de causas. Ocupa el sitio de la ayuda («Gira un mando…») solo mientras la estenosis está activa (desde 0,15, como los avisos) y en la vista de causas; con la rueda en 0 vuelve la ayuda. En la pantalla ancha mide lo mismo que esa ayuda (botones de 20 px) para no empujar «Qué mirar»; en el móvil los botones tienen 36 px de alto. La placa de la estenosis añade una línea con la variante («unilateral»), con el mismo umbral que la franja, y el lector de pantalla la lee con el valor de la rueda.

- La variante de siempre es la bilateral. Al elegir un caso se pone la suya; «Restablecer» vuelve a la bilateral.
- Selector de casos: grupo nuevo «Estenosis unilateral» (casos 34 y 35), con la variante en el chip. Con la estenosis a 0 la variante no cuenta para reconocer el caso.
- Enlace: `v=estenosis:unilateral` (o `unico`); la bilateral no se escribe, así que los enlaces anteriores abren igual. Los chips de «Compartir» y la ficha de estudio nombran la variante.
- Modo reto: la franja y la variante de la placa se ocultan hasta corregir. Reto 11 (unilateral frente a tumor de renina).
- Avisos: el contraindicado de IECA o ARA-II solo en la bilateral y el riñón único; en la unilateral, «Vigilar la creatinina».
- Las fichas enseñan las relaciones de la variante elegida (con la unilateral aparecen la 119 y la 120, y la 38 pesa menos).

## Componentes

### Mando de causa

- Recorrido de 270°: de −135° (mínimo) a +135° (máximo); el puntero gira con el valor.
- Escala exterior de 11 marcas y extremos rotulados: «− / +» en las bipolares, «0 / 1» en las unipolares, «nulo / libre» en el acceso al agua.
- Arco de valor en la pista: desde el centro en las bipolares (ámbar hacia +, azul hacia −), desde el inicio en las unipolares (ámbar), y desde el extremo derecho en el acceso al agua (azul cuando baja).
- Placa con nombre y valor («normal», «no», «joven», «libre», «+1»…).
- Interacción: arrastre circular o vertical con el puntero y teclado (flechas, Inicio y Fin). Usa la semántica de slider (`role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`). Tamaño táctil mínimo de 44 px.
- Con el dedo (18-19 nov 2026): para girar hay que mantener pulsado el mando unos 300 ms; entonces vibra (40 ms; Chrome solo vibra tras el primer toque en la página), se marca con un aro ámbar y el arrastre lo gira sin mover la página. Mientras está agarrado, si algo de encima cambia de alto (la franja de la estenosis, la cabecera que deja de quedarse fija), la página lo compensa y el mando se queda bajo el dedo. Con el dedo se usan eventos táctiles: Chrome para Android corta los de puntero a los 500 ms, al detectar su propia pulsación larga. `?depurar` en la dirección muestra los eventos del dedo en pantalla. Si el dedo se mueve antes, se desplaza la página y el mando no cambia: así bajar por el panel no cambia valores sin querer. Un toque corto enseña «Mantén pulsado para girar» durante 1,6 s. En pantalla táctil la ayuda del panel dice «Mantén pulsado un mando y gíralo…». Con ratón, rueda del ratón y teclado, como siempre.

### Ventana de sintonía (mecanismos y salidas)

Escala horizontal de −1 a +1 con marca central más larga, nombre dentro de la ventana, flecha a la derecha y aguja vertical. Es un botón: abre la ficha.

### Dial de presión

Esfera de 270° con zonas «Baja · Normal · Alta», aguja de la sistólica y de la diastólica (giro = valor × 135°), PAM con flecha en el centro.

## Temas

Selector de tema en «Ajustes» (botón con engranaje en la cabecera; en escritorio, panel desplegable; en el móvil, icono junto a Sonido que abre una hoja como las demás, con asa, que se cierra deslizando hacia abajo, con «Cerrar» o con el «atrás» del sistema). Cambia colores y la apariencia de los componentes, no la distribución. Junto al tema, el tamaño «Normal / Grande».

Tema, tamaño y sonido se recuerdan en este dispositivo (`localStorage`: `radiostasis-tema`, `radiostasis-tamano`, `radiostasis-sonido`). Un script en `<head>` aplica tema y tamaño antes de pintar. Si el sonido se dejó encendido, el botón aparece encendido «en espera» (borde discontinuo y ondas atenuadas; «Sonido activo: toca la pantalla para que empiece») y suena desde la primera pulsación en la página, porque el navegador no deja antes; entonces pasa al aspecto normal.

### Tamaño «Grande»

Toda la interfaz al 125 %, también los textos de los SVG, igual que la ampliación del navegador: `zoom` en `<html>`, y la build duplica cada media query de ancho o alto con sus medidas multiplicadas por 1,25 (`src/compartido/tamano.ts`), de modo que con 1366 px y «Grande» la página se maqueta como en 1093 px. Las medidas con `vh`/`vw` se dividen por `--zoom`, y los globos y barras que se colocan con JavaScript pasan las coordenadas de pantalla a CSS (`rectCss` en `src/app/preferencias.ts`).

### Retro (por defecto)

| Elemento | Valor |
| --- | --- |
| Fondo / superficie / línea | `#1C1916` / `#26221E` / `#3A342E` |
| Texto / secundario | `#EDE6D6` / `#CFC6B6` · `#A89F91` |
| Acento (sube) / baja | `#F2B544` / `#6FA8DC` |
| Panel de causas (nogal) | `repeating-linear-gradient(92deg, #5A3420 0, #6B3F26 7px, #4E2C1A 13px, #633923 21px)`, marco `#3A2114`, sombra interior |
| Mando de latón | radial `#F6E3A6 → #C9A24A → #7E5E22`; estrías concéntricas `#5C4418` al 25 %; moleteado base `#7A5A22` con dientes `#E6C878`; contorno `#1F120A`; puntero `#2B1E0A` |
| Placa | degradado `#F3E7C6 → #DCC99A`, borde `#A88A48`, texto `#2B1E0A` |
| Cristal ámbar | radial `#FFE7B0 → #E0A63E`, tinta `#3A2410`, aguja `#1C1916`, marco `#2B211B` |
| Agujas del dial | sistólica `#B3362F`, diastólica `#8A5A2E` (leyenda `#C58B4E`); aro de latón |

### Clásico (estilo original)

| Elemento | Valor |
| --- | --- |
| Fondo, texto y acentos | Los mismos que Retro |
| Panel de causas | Superficie `#26221E` con borde `#3A342E` (sin madera ni placas) |
| Mando de baquelita | radial `#F7F1E3 → #D9CFBB → #A99D85` con sombra; pista cónica `#3A342E` con arco de valor; nombre y valor como texto bajo el mando |
| Mecanismos | Vúmetros semicirculares: medio anillo azul (izquierda) y ámbar (derecha) al 35 %, aguja girada valor × 80°. En el hito 3e caben en la misma ventana (a la izquierda del nombre), así que la distribución no cambia |
| Dial de presión | Esfera oscura con tres zonas (azul, crema, ámbar) y aguja diastólica crema |

Tipografía en ambos: IBM Plex Sans Condensed (texto) e IBM Plex Mono (valores y flechas).

## Vasos y animación

Cada vista representa un tipo de vaso distinto, para no enseñar que la placa sube la RVP (error frecuente D2):

| Vista | Vaso | Qué muestra |
| --- | --- | --- |
| Longitudinal | Arteria grande de conducción | Flujo, onda de pulso, rigidez (amplitud del latido), placas |
| Transversal | Arteriola de resistencia | Diámetro de la luz (RVP) y pared |

| Animación | Parámetro |
| --- | --- |
| Hematíes en la longitudinal | Dos tandas idénticas de partículas desplazadas de 0 a +ancho para un bucle sin saltos; duración = 4 / (1 + 0,8 · GC) s |
| Latido de la pared | Periodo = 1 / (1 + 0,6 · FC) s; amplitud 6 px si rigidez < 0,15, 3 px si < 0,5, 1 px si mayor |
| Onda de pulso | Elipse clara que recorre la luz con el periodo del latido |
| Luz de la arteriola | radio = 44 · (1 − 0,35 · RVP) sobre 44 de referencia |
| Hematíes en la transversal | 8 hematíes que aparecen, crecen y se desvanecen (atraviesan el plano), desfasados; duración = 1,8 / (1 + 0,8 · GC) s; recortados a la luz |
| Arteriola | No late: el pulso llega amortiguado |

Botón de pausa común a todas las animaciones y `prefers-reduced-motion` las detiene.

## Accesibilidad

Botones y controles reales (nada de `div` clicables), `aria-label` en iconos, objetivos táctiles de 44 px como mínimo, contraste de texto 4,5:1. Nunca se distingue subir y bajar solo por color: siempre van también la flecha y la posición.
