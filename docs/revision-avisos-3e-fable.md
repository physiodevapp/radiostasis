# Revisión de Fable 5.2: textos del hito 3e

15 nov 2026 · Sesión aparte con Fable 5.2 sobre `docs/revision-avisos-3e.md`. Las referencias con PMID las comprobó en PubMed; lo que cita de memoria va marcado.

## Estado de cada propuesta

| Elemento | Antes | Ahora | Estado |
| --- | --- | --- | --- |
| Texto de la combinación hipotética | Muy improbable en un paciente real. El simulador muestra la lógica de los mecanismos, no un caso clínico. | Es muy improbable que estas causas coincidan en un mismo paciente. Sirve para ver cómo interactúan los mecanismos, no como caso clínico. | Aplicado |
| Chip de cada causa | Tumor de renina · rara | Tumor de renina · causa rara; Regaliz · causa poco frecuente | Aplicado |
| Barra del móvil | Combinación hipotética: Tumor de renina (rara), Feocromocitoma (rara) | Combinación hipotética: tumor de renina y feocromocitoma (causas raras). Con frecuencias distintas: «tumor de renina (causa rara), regaliz (poco frecuente)» | Aplicado |
| Pastilla del mando, causas raras | rara | causa rara | Aplicado |
| Chip de saturación | fuera de rango | tope de escala | Aplicado |
| Explicación de saturación | Fuera del rango del modelo: el valor real sería extremo, no exacto. | Tope de la escala del simulador: indica un valor muy alterado, pero no cuánto. Más allá de aquí el simulador no distingue. | Aplicado |
| Nota de ajustes | Se recuerdan en este dispositivo, con el sonido. | Estos ajustes y el del sonido se guardan en este dispositivo. | Aplicado |
| Frecuencia de la ADH autónoma | rara en los dos extremos | «poco frecuente» hacia SIADH y «causa rara» hacia diabetes insípida; los avisos nombran el extremo («Diabetes insípida central · causa rara») | Aplicado con el visto bueno de Edu |
| Qué mide la frecuencia | Sin explicar | «Frecuencia con que se ve en la práctica clínica.»: título de la pastilla y nota bajo el indicador de la ficha | Aplicado con el visto bueno de Edu |

## Respuesta de Fable 5.2 (resumen)

**Frecuencias.** Son correctas salvo el SIADH; la caída de la filtración, con un matiz.

- Hiperaldosteronismo primario, «poco frecuente»: correcto. 5,9 % de los hipertensos de atención primaria (PMID 28385310, DOI 10.1016/j.jacc.2017.01.052) y 11,2 % de los derivados a unidades de hipertensión (PMID 17161262, DOI 10.1016/j.jacc.2006.07.059). Hay un estudio más reciente con cifras mayores de enfermedad bioquímica (PMID 32449886, DOI 10.7326/M20-0065). Ni «común» ni «rara».
- Regaliz, «poco frecuente»: aceptable. No hay datos fiables de prevalencia como causa de hipertensión. El efecto está documentado desde 100 mg diarios de ácido glicirrícico: +5,45 mmHg de sistólica, con descenso de potasio, renina y aldosterona (metaanálisis, PMID 28660884, DOI 10.1038/jhh.2017.45).
- SIADH, «rara»: lo pasaría a «poco frecuente». Es la causa más frecuente de hiponatremia hipotónica, y la hiponatremia afecta a más del 15 % de los pacientes hospitalizados (PMID 36974717, DOI 10.1210/endrev/bnad010). La diabetes insípida central sí es rara (en torno a 1 de cada 25.000 personas; cifra de memoria, sin comprobar).
- Caída de la filtración, «poco frecuente»: vale para las causas que nombra la rueda (glomerulonefritis, cálculos, hiperproteinemia). La enfermedad renal parenquimatosa está entre las causas habituales de hipertensión secundaria (PMID 31823067, DOI 10.1007/s11936-019-0790-8). Si la rueda pasara a representar la enfermedad renal crónica en general, habría que revisarlo.
- Tiroides, estenosis renal, tumor de renina y feocromocitoma: correctas. La guía ESC 2024 (PMID 39210715, DOI 10.1093/eurheartj/ehae178) trae una tabla de prevalencias de causas secundarias; de memoria, 1–10 % la renovascular y menos del 1 % el feocromocitoma. No pudo abrir el texto completo para confirmarlo.

**Combinación hipotética.** Se entendía, pero no decía que lo improbable es la coincidencia, no cada causa. No sobra nada: la segunda frase justifica que el simulador no lo prohíba.

**Saturación.** Conviene matizarla: salta en dos casos de la clase con la rueda a tope y un alumno puede tomarla por un fallo. Además, «fuera de rango» en una analítica significa «valor anormal». Fisiológicamente es coherente en los dos casos: aldosterona muy alta en el hiperaldosteronismo primario y volemia muy baja sin acceso al agua.

**Ortografía y registro.** Sin faltas. Los cambios son la mayúscula tras los dos puntos, la concordancia de «rara» y la ambigüedad de «con el sonido».

**Otras observaciones.**

1. No se dice qué mide la frecuencia: las etiquetas mezclan frecuencia de la enfermedad y frecuencia como causa de hipertensión (el SIADH no sube la presión en el modelo, y el hipotiroidismo es una enfermedad frecuente).
2. El aviso hipotético tiene dos condiciones con un solo texto. Dos causas raras a la vez son casi imposibles; tres poco frecuentes son improbables pero no absurdas. «Muy improbable» vale para las dos.
3. Los textos están también en `docs/modelo-v2.1.md`, «Avisos de realismo»: hay que actualizarlos a la vez que `avisos.ts`.
