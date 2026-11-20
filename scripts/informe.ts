import { evaluar } from '../src/motor/evaluar';
import { simular } from '../src/motor/motor';
import { hipertension, hipertensionDocumento, hipertensionSinCalibrar } from '../src/temas/hipertension';

const modelo = process.argv.includes('--documento')
  ? hipertensionDocumento
  : process.argv.includes('--sin-calibrar')
    ? hipertensionSinCalibrar
    : hipertension;
const r = evaluar(modelo);
const fallos = r.filter((c) => !c.ok && !c.pendiente);
for (const c of r.filter((c) => c.pendiente)) console.log(`pendiente caso ${c.caso} ${c.nodo}: ${c.obtenido} (${c.valor.toFixed(2)}), tabla ${c.esperado.join('/')}`);
for (const f of fallos)
  console.log(`caso ${f.caso} ${f.escala}${f.condicion ? ' ' + f.condicion : ''} ${f.nodo}: ${f.valor.toFixed(3)} ${f.obtenido} (esperado ${f.esperado.join('/')})`);
console.log(`${r.length - fallos.length}/${r.length} comprobaciones correctas`);
for (const c of modelo.casos) {
  const s = simular(modelo, c.causas, 'estable');
  if (!s.convergido) console.log(`caso ${c.id}: NO converge (${s.iteraciones})`);
}
