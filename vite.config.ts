import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { duplicarMediaQueries } from './src/compartido/tamano.ts';

// Workers Builds de Cloudflare expone la rama y el commit durante el build: se
// muestran en el pie para saber si la previsualización abierta es la última.
// El commit se lee de git (el clon de Workers Builds lo tiene); la variable de
// entorno no siempre trae el SHA.
function gitCommit(): string | null {
  try {
    return execSync('git rev-parse --short=7 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}
const envSha = process.env.WORKERS_CI_COMMIT_SHA ?? '';
const commit = gitCommit() ?? (/^[0-9a-f]{7,40}$/i.test(envSha) ? envSha.slice(0, 7) : 'dev');
const rama = process.env.WORKERS_CI_BRANCH ?? 'local';
const { version } = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };

// Tamaño «Grande»: cada media query de ancho o alto de la hoja de estilos de la
// app se duplica escalada (src/compartido/tamano.ts).
const tamanoGrande: Plugin = {
  name: 'radiostasis-tamano-grande',
  enforce: 'pre',
  transform(codigo, id) {
    if (!/\/src\/app\/estilos\.css(\?|$)/.test(id)) return null;
    return { code: duplicarMediaQueries(codigo), map: null };
  },
};

// PWA: sw.js a partir de src/pwa/sw.js, con la lista de archivos de la build
// (sin el banco de pruebas) y una versión por commit para estrenar caché.
const serviceWorker: Plugin = {
  name: 'radiostasis-sw',
  apply: 'build',
  generateBundle(_opciones, bundle) {
    const archivos = Object.keys(bundle).filter((f) => !/^banco|\/banco[-.]/.test(f) && !f.endsWith('.map'));
    const publicos = ['manifest.json', 'favicon.svg', 'apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'];
    const lista = ['./', './index.html', ...[...archivos, ...publicos].map((f) => `./${f}`)];
    const plantilla = readFileSync(resolve(import.meta.dirname, 'src/pwa/sw.js'), 'utf8');
    this.emitFile({
      type: 'asset',
      fileName: 'sw.js',
      source: plantilla
        .replace('__VERSION__', `${version}-${commit}-${Date.now().toString(36)}`)
        .replace('__ARCHIVOS__', JSON.stringify(lista, null, 2)),
    });
  },
};

export default defineConfig({
  plugins: [tamanoGrande, serviceWorker],
  // Rutas relativas: la misma build sirve en la raíz de Cloudflare y en un
  // subdirectorio (p. ej. /physiq/radiostasis/ si lo copia el hub PhysiQ).
  base: './',
  define: {
    __VERSION__: JSON.stringify(version),
    __COMMIT__: JSON.stringify(commit),
    __RAMA__: JSON.stringify(rama),
  },
  build: {
    // Dos páginas: el simulador (index.html) y el banco de pruebas del motor (banco.html).
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        banco: resolve(import.meta.dirname, 'banco.html'),
      },
    },
  },
});
