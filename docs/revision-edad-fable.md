# Revisión de Fable 5.2: textos de la relación 121 (17 nov 2026)

Revisión de los dos textos que cambian con la relación 121 (la edad refuerza la falta de agua). Fable 5.2 no editó archivos; se aplicaron sus propuestas principales.

| Texto | Antes | Después | Tipo | Motivo |
| --- | --- | --- | --- | --- |
| Nota 4 «Menos sed con la edad» | La persona mayor nota menos la sed y concentra peor la orina: con el mismo acceso al agua pierde más, sobre todo con calor, esfuerzo o fiebre. En el simulador, con la edad la falta de agua sube más la natremia: la deshidratación llega antes. | La persona mayor nota menos la sed y concentra peor la orina. Si falta agua o hace falta más (calor, esfuerzo, fiebre), bebe menos de lo que pierde y se deshidrata antes. El modelo no le baja la sed: hace que la misma falta de agua suba más la natremia. | error leve y mejora | «Con el mismo acceso pierde más» no era exacto: repone menos y pierde más por la orina, y con acceso libre no pasa nada. Calor, esfuerzo y fiebre son situaciones en que hace falta más agua, no en que se pierda más. En pantalla la sed sube con la edad (+0,69 frente a +0,57): la nota tiene que decirlo. «Llega antes» se leía como tiempo en la frase del modelo, que cambia la magnitud |
| Relación 121 (fichas de Edad y Volemia) | Con los años se nota menos la sed y el riñón concentra peor la orina: con el mismo acceso al agua, se pierde más y la deshidratación llega antes | Con los años se nota menos la sed y el riñón concentra peor la orina: la misma falta de agua deshidrata más | error leve y estilo | Mismo motivo; deja claro que solo actúa cuando falta agua. Una línea, como las demás |
| Fuentes | PMID 11528342, 9050029 | Se añade PMID 6472364 (Phillips et al., N Engl J Med 1984, [doi](https://doi.org/10.1056/NEJM198409203111202)) | mejora | Es el experimento que la relación reproduce: tras 24 h sin agua, los mayores tienen más osmolaridad y sodio, menos sed, beben menos y concentran menos la orina |

**No aplicado (opcional según Fable):** cambiar el título a «Con la edad, el agua falta antes». Se mantiene «Menos sed con la edad», que describe al paciente.

**Riesgos docentes señalados por Fable** (anotados en `docs/modelo-v2.1.md`, «Límites»): la sed del simulador sube con la edad en lugar de bajar (lo dice la nota); sin agua, la relación solo se justifica por la orina, de ahí la fuente de Phillips; el efecto visible es la natremia; la 121 no aparece en la ficha de Osmolaridad plasmática. Ningún reto usa el acceso al agua (comprobado).
