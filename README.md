# Radiostasis

Simulador web docente de fisiología: giras las «ruedas» de las causas, como en una radio antigua, y ves cómo responden los mecanismos, los vasos, la presión arterial y la analítica.

Primer tema: causas de la hipertensión arterial. El motor es genérico y está pensado para más temas (natremia, insuficiencia cardíaca…), fármacos, ejercicio y modos docentes.

> Modelo cualitativo con fines docentes. No es un simulador clínico.

## Estado

Hito 3b: pantalla horizontal. `index.html` es el simulador (mandos, mecanismos, vasos animados, dial, analítica, selector de caso y escala de tiempo). El banco de pruebas del motor sigue en `banco.html`. La distribución de móvil llega en el hito 3c.

## Tecnología

| Pieza | Elección | Por qué |
| --- | --- | --- |
| Lenguaje | TypeScript | El modelo es datos tipados: un signo o un id mal escrito falla al compilar |
| Motor | `src/motor/`, TypeScript puro, sin dependencias | Se reutiliza en los temas siguientes y se prueba sin navegador |
| Temas | `src/temas/<tema>/`: nodos, relaciones, casos, propuestas y calibración | Corregir un signo no toca la interfaz |
| Tests | Vitest | La tabla de casos del modelo es la batería de tests |
| Interfaz (3b) | Vite + TypeScript sin framework, dibujo en SVG | Como los satélites de PhysiQ (HTML/CSS/JS sin framework), pero con compilación |
| Despliegue | Cloudflare Workers (archivos estáticos) con Workers Builds | Sin pasos manuales; cada rama tiene su URL de previsualización para probar en el móvil |

Compatibilidad con PhysiQ: la compilación usa rutas relativas (`base: './'`), así que el mismo `dist/` sirve en `/radiostasis/` y en `/physiq/radiostasis/`. Para integrarlo como satélite bastará un flujo que copie `dist/` al repo `physiq` con `PHYSIQ_DEPLOY_TOKEN`, como hacen los demás satélites.

## Estructura

```
src/motor/           tipos, motor (simular, flechas) y evaluación de casos
src/temas/hipertension/
  nodos.ts           12 causas, 17 mecanismos, 6 salidas, 4 de analítica
  relaciones.ts      las 73 relaciones del documento, intactas
  propuestas.ts      cambios de estructura pendientes de validar
  calibracion.ts     ajustes de intensidad, con antes, después y motivo
  casos.ts           los 12 casos con sus resultados esperados
  vista.ts           datos de presentación: nombres cortos, grupos, «Qué mirar»
src/app/             interfaz (lee el resultado de simular; el motor no la conoce)
src/banco.ts         banco de pruebas del motor (banco.html)
tests/               tests del motor y de los 12 casos
scripts/calibrar.ts  calibrador (herramienta de desarrollo)
docs/                modelo, diseño, plan, prototipo y calibración
```

## Comandos

```
npm test            tests (motor + 12 casos)
npm run dev         servidor de desarrollo
npm run build       compilación en dist/
npm run calibrar    busca intensidades que cumplan la tabla de casos
npx tsx scripts/informe.ts   lista los resultados que no coinciden
```

## Despliegue

Igual que en `dualkinema` y `orbicula`: Cloudflare Workers con archivos estáticos, conectado al repo con Workers Builds.

| Rama | Orden | URL |
| --- | --- | --- |
| `main` | `npx wrangler deploy` (producción) | https://radiostasis.edu-gamboa-rodriguez.workers.dev |
| Cualquier otra | `npx wrangler preview` (previsualización) | `https://<rama>-radiostasis.edu-gamboa-rodriguez.workers.dev` |

- Configuración en `wrangler.jsonc`; build `npm run build` (sale en `dist/`).
- El pie de la página muestra versión, rama y commit para saber si la previsualización abierta es la última.
- GitHub Actions (`.github/workflows/ci.yml`) pasa la comprobación de tipos, los tests y el build en cada push y en cada PR. No despliega.
- El banco de pruebas del motor está en `banco.html` dentro de la misma URL.

## Documentación

- [Modelo fisiológico](docs/modelo-v2.1.md)
- [Diseño](docs/diseno.md)
- [Plan de construcción](docs/plan.md)
- [Calibración del hito 3a](docs/calibracion.md)
- [Instrucciones para Claude Code](CLAUDE.md)
