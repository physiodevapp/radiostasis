/**
 * Banco de pruebas del hito 3a: tabla de los 12 casos con las flechas que da
 * el motor frente a las esperadas. Se sustituye por la interfaz en el hito 3b.
 */
import { flecha, simular } from './motor/motor';
import type { Escala, Esperado } from './motor/tipos';
import { hipertension as modelo } from './temas/hipertension';

const COLUMNAS: [string, string][] = [
  ['pas', 'PAS'], ['pad', 'PAD'], ['volemia', 'Volemia'], ['rvp', 'RVP'], ['gc', 'GC'],
  ['renina', 'Renina'], ['aldo', 'Aldost.'], ['creatinina', 'Creat.'], ['natremia', 'Na'],
  ['osmU', 'Osm. ur.'], ['diuresis', 'Diuresis'], ['potasio', 'K'],
];
const NOMBRE: Record<Escala, string> = { minutos: 'Minutos', dias: 'Días', estable: 'Estado estable' };

let escala: Escala = 'estable';
const app = document.getElementById('app')!;

function lista(e: Esperado | undefined): string[] | undefined {
  return e === undefined ? undefined : Array.isArray(e) ? e : [e];
}

function pintar() {
  let ok = 0;
  let total = 0;
  let pendientes = 0;
  const filas = modelo.casos.map((caso) => {
    const { valores } = simular(modelo, caso.causas, escala);
    const esperados = caso.esperado.filter((e) => e.escala === escala && !e.ajustes);
    const celdas = COLUMNAS.map(([id]) => {
      const f = flecha(valores[id]);
      const esp = esperados.map((e) => lista(e.valores[id])).find(Boolean);
      const pendiente = esperados.map((e) => e.pendientes?.[id]).find(Boolean);
      let clase = '';
      let pista = '';
      if (esp && pendiente) {
        pendientes++;
        clase = 'pendiente';
        pista = `<small>tabla ${esp.join('/')} · pendiente</small>`;
      } else if (esp) {
        total++;
        const bien = esp.includes(f);
        if (bien) ok++;
        clase = bien ? 'ok' : 'fallo';
        pista = bien ? '' : `<small>esp. ${esp.join('/')}</small>`;
      }
      const titulo = pendiente ? `${valores[id].toFixed(3)} · ${pendiente}` : valores[id].toFixed(3);
      return `<td class="${clase}" title="${titulo.replace(/"/g, '&quot;')}">${f}${pista}</td>`;
    });
    return `<tr><td>${caso.id}. ${caso.nombre}</td>${celdas.join('')}</tr>`;
  });

  app.innerHTML = `
    <h1>Radiostasis · banco de pruebas del motor</h1>
    <p>Hito 3a: los 12 casos del modelo v2.1 simulados con las intensidades calibradas.
       Verde = coincide con la tabla; rojo = no coincide (debajo, lo esperado); ámbar = pendiente de decisión (ver docs/calibracion.md). Sin color: la tabla no dice nada para esta escala. Mantén pulsada una celda para ver el valor.</p>
    <div class="escalas" role="group" aria-label="Escala de tiempo">
      ${(['minutos', 'dias', 'estable'] as Escala[])
        .map((e) => `<button type="button" data-escala="${e}" aria-pressed="${e === escala}">${NOMBRE[e]}</button>`)
        .join('')}
    </div>
    <div class="resumen">${total ? `${ok} de ${total} comprobaciones coinciden` : 'Sin resultados esperados en esta escala'}${
      pendientes ? ` · ${pendientes} pendientes de decisión (ámbar)` : ''
    }</div>
    <div class="tabla"><table>
      <thead><tr><th>Caso</th>${COLUMNAS.map(([, n]) => `<th>${n}</th>`).join('')}</tr></thead>
      <tbody>${filas.join('')}</tbody>
    </table></div>
    <p class="nota">Modelo cualitativo con fines docentes. No es un simulador clínico.</p>`;
  app.querySelectorAll<HTMLButtonElement>('[data-escala]').forEach((b) =>
    b.addEventListener('click', () => {
      escala = b.dataset.escala as Escala;
      pintar();
    }),
  );
}

pintar();
