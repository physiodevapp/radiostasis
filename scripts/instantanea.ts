/**
 * Instantánea numérica de la hipertensión (fase N2, punto 12 de
 * docs/natremia/propuesta-modelo.md y M8 de docs/natremia/revision-n1-fable.md).
 *
 * Guarda los valores numéricos (no solo las flechas) de los 35 casos, los retos
 * y las sesiones de ejercicio en las tres escalas, y el propio modelo, tal como
 * los calcula el código. tests/instantanea.test.ts exige que coincidan con una
 * tolerancia muy estricta. Se generó el 21 nov 2026 con el código de la v0.7.0,
 * antes de la biblioteca común; no se regenera salvo que Edu apruebe un cambio
 * del modelo de hipertensión (npm run instantanea).
 */
import { writeFileSync } from 'node:fs';
import { calcularInstantanea } from '../tests/instantaneas/calcular';

writeFileSync(new URL('../tests/instantaneas/hipertension.json', import.meta.url), JSON.stringify(calcularInstantanea()) + '\n');
console.log('tests/instantaneas/hipertension.json generado');
