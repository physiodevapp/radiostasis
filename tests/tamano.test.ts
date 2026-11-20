import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { duplicarMediaQueries, escalarConsulta } from '../src/compartido/tamano';

describe('tamaño «Grande»: media queries escaladas', () => {
  it('escala ancho y alto, y deja lo demás', () => {
    expect(escalarConsulta('(min-width: 1200px) and (min-height: 700px)')).toBe('(min-width: 1500px) and (min-height: 875px)');
    expect(escalarConsulta('(max-width: 720px)')).toBe('(max-width: 900px)');
    expect(escalarConsulta('(prefers-reduced-motion: reduce)')).toBe('(prefers-reduced-motion: reduce)');
  });

  it('duplica solo las @media de ancho o alto de primer nivel', () => {
    const css = '.a{color:red}\n@media (max-width: 720px) { .a { color: blue } @container (min-width: 10px) { .b{x:1} } }\n@media (prefers-reduced-motion: reduce) { .c { y: 2 } }';
    const r = duplicarMediaQueries(css);
    expect(r).toContain("@media (max-width: 720px) {\n:where(html:not([data-tamano='grande'])) { .a { color: blue } @container (min-width: 10px) { .b{x:1} } }");
    expect(r).toContain("@media (max-width: 900px) {\n:where(html[data-tamano='grande']) { .a { color: blue }");
    expect(r).toContain('@media (prefers-reduced-motion: reduce) { .c { y: 2 } }');
    expect(r.startsWith('.a{color:red}')).toBe(true);
  });

  it('la hoja de estilos de la app se transforma sin perder llaves', () => {
    const css = readFileSync('src/app/estilos.css', 'utf8');
    const r = duplicarMediaQueries(css);
    const cuenta = (t: string, c: string) => t.split(c).length - 1;
    expect(cuenta(r, '{')).toBe(cuenta(r, '}'));
    // Ninguna regla de <html> o :root dentro de una @media (no se podría anidar bajo html).
    expect(r).not.toMatch(/:where\(html[^)]*\)\) \{\s*(?:html|:root)\b/);
  });
});

describe('cortes de ancho sin huecos', () => {
  it('ninguna regla «min-width: N+1px» acompaña a una «max-width: Npx» (con «Grande», ×1,25, quedaba un hueco)', () => {
    const css = readFileSync(new URL('../src/app/estilos.css', import.meta.url), 'utf8');
    const max = new Set([...css.matchAll(/max-width:\s*(\d+)px/g)].map((m) => Number(m[1])));
    for (const [, n] of css.matchAll(/@media[^{]*min-width:\s*(\d+)px/g)) expect(max.has(Number(n) - 1), `min-width: ${n}px`).toBe(false);
  });
});
