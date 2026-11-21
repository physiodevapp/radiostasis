# Radiostasis — instrucciones para Claude Code

Radiostasis es un simulador web docente para entender las causas de la hipertensión arterial girando «ruedas» de causa y viendo cómo responden los mecanismos, los vasos, la presión y la analítica. Es el primer tema de un motor genérico que después tendrá más temas (natremia, insuficiencia cardíaca…), fármacos, ejercicio y modos docentes.

Autor: Edu (fisioterapeuta y desarrollador web autodidacta, GitHub `physiodevapp`). Idioma del proyecto y de la interfaz: español de España.

## Reglas de trabajo con Edu

- **Avísale siempre que convenga cambiar de modelo, abrir una sesión nueva, volver a claude.ai (modo conversación o modo diseño) o pasar una revisión a otro modelo.** Es una pauta suya para todo el proyecto, incluidas las ampliaciones. Ejemplos: la redacción de textos docentes se revisa con Fable 5.2 en una sesión aparte; los retoques pequeños de interfaz pueden ir con Sonnet 5.5.
- Edu trabaja solo desde el móvil (Pixel 8) con pantalla externa y teclado. No tiene entorno local: todo debe poder probarse en el navegador y desplegarse sin pasos manuales en un ordenador.
- Antes de cambiar el modelo fisiológico (signos, intensidades, relaciones), díselo y explica el motivo: es contenido docente y él lo valida.

## Primera tarea: alinear con PhysiQ

Este simulador puede acabar siendo un satélite del ecosistema PhysiQ (hub PWA en el repo `physiodevapp/physiq`, satélites en repos propios). Antes de elegir tecnología, revisa ese repo (pide acceso si no lo tienes) y sigue sus convenciones de stack, estructura y despliegue. Si no hay acceso o no hay convención clara, propón a Edu:

- Vite + TypeScript, interfaz con SVG.
- Motor en TypeScript puro, sin dependencias de interfaz, con tests en Vitest.
- PWA desplegada en Cloudflare Workers (ver «Despliegue»).

## Despliegue (Cloudflare)

Como en `physiodevapp/dualkinema` y `physiodevapp/orbicula`.

**Estado:** el Worker `radiostasis` está conectado al repo con Workers Builds desde el 14 nov 2026, con Production y Preview activados en *Domains → Worker URL*. Una rama solo tiene previsualización tras su primer push posterior a la conexión.

**Repo nuevo (20 nov 2026):** `physiodevapp/radiostasis` empezó de cero con un único commit (v0.7.0), sin la historia anterior, que queda archivada en el repo privado `physiodevapp/radiostasis-archivo` (no se toca ni se publica). El Worker se reconectó al repo nuevo ese día; tras reconectar, hace falta un push para que construya.

- Configuración en `wrangler.jsonc` (nombre `radiostasis`, `assets.directory: ./dist`, bloque `previews: {}`, que `wrangler preview` exige aunque vaya vacío). En Workers Builds: build `npm run build`; despliegue `npx wrangler deploy`; previsualización `npx wrangler preview`; *Enable Preview Builds* activado; direcciones públicas activadas en *Domains → Worker URL* (Production y Preview).
- Producción (`main`): https://radiostasis.edu-gamboa-rodriguez.workers.dev
- Previsualización de cada rama: `https://<rama>-radiostasis.edu-gamboa-rodriguez.workers.dev` (rama en minúsculas, lo que no sea letra o número cambiado por `-`). **Indica siempre esta URL a Edu al terminar una fase.**
- El pie muestra versión, rama y commit (`WORKERS_CI_BRANCH`, `WORKERS_CI_COMMIT_SHA`, ver `vite.config.ts`) para comprobar que la previsualización abierta es la última.
- `base: './'`: la misma build sirve en la raíz y en un subdirectorio (p. ej. dentro de PhysiQ).
- GitHub Actions (`.github/workflows/ci.yml`) pasa tipos, tests y build en cada push y PR; no despliega.
- Desde el entorno en la nube de Claude Code, `*.workers.dev` puede no ser accesible: la comprobación en el móvil la hace Edu.
- Si las ramas no construyen (la previsualización dice «There is nothing here yet» o no aparece ningún build en *Deployments*), mira si el Worker dice «disconnected from your Git account» en *Settings → Build* y da acceso a la app de Cloudflare al repo con *Manage* en GitHub. Después hace falta un push nuevo a la rama.
- No se fusiona en `main` sin que Edu lo pida.

## Documentación (léela antes de empezar)

| Archivo | Qué contiene |
| --- | --- |
| `docs/modelo-v2.1.md` | Modelo fisiológico revisado: 12 causas, 17 mecanismos, 6 salidas, analítica, 73 relaciones, tabla de 12 casos con resultados esperados, errores frecuentes y matices (D1–D6), avisos de realismo |
| `docs/diseno.md` | Diseño cerrado: distribución, componentes, dos temas, animaciones y accesibilidad |
| `docs/plan.md` | Alcance de la v1, hitos de construcción y lo que queda fuera |
| `docs/revision-fichas-3d.md` | Todos los textos de las fichas, capas y animaciones para revisarlos con Fable 5.2. Se genera con `npm run revision-fichas` desde `src/temas/hipertension/fichas.ts`; no se edita a mano |
| `docs/notas-interaccion.md` | Notas de interacción entre causas (fase 6): qué muestra el modelo en cada pareja y fuentes con PMID |
| `docs/retos.md` | Los 10 retos del modo reto (fase 6). Se genera con `npm run revision-retos` desde `src/temas/hipertension/retos.ts`; no se edita a mano |
| `docs/natremia/propuesta-modelo.md` | Tema de natremia: modelo v0.2 aprobado (fase N1), con «Qué necesita el motor para que dos temas compartan mecanismos» y el plan de fases N1–N7 |
| `docs/natremia/revision-n1-fable.md` | Revisión fisiológica de la N1 por Fable 5.2; su sección 7 (M1–M10) es la base del motor compartido (N2) |
| `docs/prototipo/*.dc.html` | Prototipo del lienzo de diseño (4 pantallas). Referencia visual: el marcado y los estilos se pueden portar, pero el formato `.dc.html` no funciona fuera del lienzo |
| `docs/fuentes.md` | Fuentes de cada relación (PMID, cómo se comprobó y la frase literal que la respalda) y bibliografía. Se genera con `npm run fuentes` desde la bibliografía común (`src/fisiologia/bibliografia.ts`) y las relaciones del tema; no se edita a mano |

## Principios del motor

- El modelo de cada tema es **datos** (JSON o TS tipado), separado del motor y de la vista. Corregir un signo no debe tocar código de interfaz.
- La tabla de casos de `docs/modelo-v2.1.md` es la **batería de tests**: cada caso es un test que compara flechas con los umbrales definidos (= por debajo de 0,15 · ↑/↓ hasta 0,5 · ↑↑/↓↓ desde 0,5).
- Las fuentes son solo de PubMed (Edu no tiene los manuales): cada relación del tema, también las de fármacos y ejercicio, cita en `pmid` los artículos que la respaldan, comprobados en PubMed y con su cita en la bibliografía común (`src/fisiologia/bibliografia.ts`), y `fuente` vale «PubMed» (un test lo vigila). Cada relación guarda además en `frases` la frase literal que la respalda, cotejada con un script contra el resumen o el texto completo de PubMed Central (E-utilities de NCBI); el test también lo vigila. Una relación nueva sin artículo no entra en el modelo sin que Edu la valide como supuesto. Los textos docentes son propios: no resumen material docente de terceros.
- **Varios temas, un motor (fase N2).** Los nodos y las relaciones viven una sola vez en la biblioteca común (`src/fisiologia/`), con su número, sus PMID y su frase (`bibliografia.ts`). Cada tema los importa (`src/fisiologia/importar.ts`): se comparte el nodo (qué es) y sus entradas son de cada tema. Común: signo, PMID y frase. De cada tema: nombre, etiquetas, frecuencia, explicación y código del nodo; intensidad, `intensidadNegativa`, umbral, escala y variante de la relación (con `cambios` al importar o con `aplicarAjustes` y su tabla de motivos); y el origen o el destino reasignado (relación con asterisco, `reasignada`), que exige explicación y frase propias del tema (`Modelo.frases`). Las listas de `modula` y `bloquea` se filtran a las relaciones del tema (`filtrarReferencias`). `tests/temas.test.ts` vigila todo esto en cada tema del registro. Si se corrige un signo, cambia en todos los temas.
- **Registro de temas** (`src/temas/registro.ts`): un objeto `Tema` (modelo, fichas, vista, analítica, valores, retos, términos y orden de los mandos) por tema; la interfaz no importa ningún tema por su nombre. La dirección lo elige con `#t=<tema>`; sin `t=`, la hipertensión, cuyos enlaces no cambian. `t=` también es la escala (`t=dias`): los ids de tema no pueden llamarse como una escala. Lo que se guarda en el dispositivo y depende del tema usa `claveDelTema` (la hipertensión conserva sus claves).
- **Scripts por tema**: `npm run fuentes|revision-fichas|revision-retos|calibrar -- <tema>`; sin tema, la hipertensión. Rutas y modelo sin calibrar de cada tema en `scripts/temas.ts`.
- **La hipertensión, idéntica**: `tests/instantanea.test.ts` compara los valores numéricos de sus casos, retos y sesiones de ejercicio (tres escalas) y el modelo como datos con `tests/instantaneas/hipertension.json` (tolerancia 1e-12). Si falla, algo ha cambiado el modelo de hipertensión: no se regenera (`npm run instantanea`) sin el visto bueno de Edu.
- **Avisos de tope**: umbral por tema y por nodo (`fueraDeRango.umbralNodo`). Con `fueraDeRango.casos: 'declarados'`, cada caso declara en `topes` los topes que son parte de la lección; un tope no declarado es un defecto de calibración (`topesNoDeclarados`, en los tests) y el aviso solo sale en los declarados. La hipertensión tiene los topes libres.
- El modelo no está calibrado: ajusta intensidades hasta que pasen los 12 casos e informa a Edu de cada ajuste en una tabla (relación, antes, después, motivo).
