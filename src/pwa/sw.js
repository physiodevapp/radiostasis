// Service worker de Radiostasis (hito 3e). Plantilla: la build (vite.config.ts)
// rellena VERSION y ARCHIVOS y lo publica como sw.js junto a index.html.
// Estrategia como en physiq-assessment: los archivos propios, primero de la red
// y, sin conexión, de la caché; las fuentes de Google, de la caché.
// Todas las rutas son relativas al propio sw.js: sirve en la raíz y en un
// subdirectorio (p. ej. dentro del hub PhysiQ).
const CACHE = 'radiostasis-__VERSION__';
const ARCHIVOS = __ARCHIVOS__;
const FUENTES = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k.startsWith('radiostasis-') && k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Fuentes: de la caché si están; si no, de la red y se guardan.
  if (FUENTES.includes(url.hostname)) {
    event.respondWith(
      caches.match(request, { ignoreVary: true }).then(
        (guardada) =>
          guardada ||
          fetch(request).then((respuesta) => {
            if (respuesta.ok || respuesta.type === 'opaque') {
              const copia = respuesta.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copia));
            }
            return respuesta;
          }),
      ),
    );
    return;
  }

  // Otros orígenes (enlaces a la IA, etc.): sin tocar.
  if (url.origin !== self.location.origin) return;

  // Archivos propios: red primero (revalidando la caché HTTP para no servir una
  // versión vieja tras un despliegue) y, sin conexión, la copia guardada.
  const red = request.mode === 'navigate' ? request : new Request(request, { cache: 'no-cache' });
  event.respondWith(
    fetch(red)
      .then((respuesta) => {
        if (respuesta.ok) {
          const copia = respuesta.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
        }
        return respuesta;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: request.mode === 'navigate', ignoreVary: true }).then(
          (guardada) => guardada || (request.mode === 'navigate' ? caches.match('./index.html', { ignoreVary: true }) : undefined) || Response.error(),
        ),
      ),
  );
});
