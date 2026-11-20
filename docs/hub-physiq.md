# Enlace desde el hub PhysiQ (convención propuesta, 17 nov 2026)

Convención elegida por Edu: **`?sat=` + fragmento + aviso**. Radiostasis ya la cumple (v0.6.0); falta aplicar en el hub (`physiodevapp/physiq`, `index.html`) los cambios de abajo, en una sesión de ese repo. Mientras el hub no los tenga, Radiostasis se comporta como siempre: el enlace de «Compartir» abre Radiostasis sola.

## El enlace

```
https://physiodevapp.github.io/physiq/?sat=radiostasis#c=hiperaldo:1&p=…
```

- `?sat=` es el satélite que el hub abre al cargar (ya existe en el hub).
- El fragmento (`#…`) es del satélite: el hub no lo interpreta, solo se lo pasa al iframe. Vale para cualquier satélite, no solo Radiostasis. En Radiostasis lleva un caso (`#c=…`) y también un reto (`#reto=…`).
- Como el fragmento no llega al servidor ni al service worker, funciona igual en GitHub Pages, sin conexión y con el satélite en otro dominio (p. ej. `radiostasis…workers.dev`).

## Cambios en el hub (`index.html`)

### 1. Leer `?sat=` y el fragmento antes de `replaceState` (corrige un fallo actual)

Hoy `restoreState` hace `history.replaceState(…, '/physiq/')` **antes** de leer `?sat=`: `location.search` ya está vacío y `?sat=` no abre nunca el satélite.

```js
(function restoreState() {
  // Se leen antes de replaceState, que los borra de la dirección.
  const sat = new URLSearchParams(location.search).get('sat');
  const fragmento = location.hash;
  history.replaceState({ hub: 'home' }, '', '/physiq/');
  if (sat && SATS[sat]) openSat(sat, fragmento);
}());
```

Los enlaces `#peer=` y `#peer-ans=` no llevan `?sat=`: no les afecta.

### 2. Pasar el fragmento al iframe

```js
function _showSat(name, fragmento = '') {
  const frame = document.getElementById('sat-' + name);
  // Con fragmento, se pone siempre: si el iframe ya estaba cargado en esa misma
  // dirección, solo cambia el fragmento (el satélite recibe hashchange, sin recargar).
  if (fragmento) frame.src = SATS[name] + fragmento;
  else if (!frame.src) frame.src = SATS[name];
  // … lo demás, igual …
}

function openSat(name, fragmento = '') {
  if (!SATS[name] || reorderMode) return;
  _showSat(name, fragmento);
  // … lo demás, igual …
}
```

### 3. Anunciarse al satélite

El satélite necesita saber que está en el hub y su dirección para escribir el enlace. Se añade un mensaje al cargar cada iframe (el `PHYSIQ_SAT_VISIBLE` de `_showSat` sale antes de que el iframe termine de cargar y se pierde la primera vez) y, por si acaso, los mismos campos en `PHYSIQ_SAT_VISIBLE`:

```js
function _avisarHub(name) {
  try {
    document.getElementById('sat-' + name).contentWindow?.postMessage(
      { type: 'PHYSIQ_HUB', hub: location.origin + location.pathname, sat: name }, '*');
  } catch (_) {}
}
Object.keys(SATS).forEach((k) => document.getElementById('sat-' + k).addEventListener('load', () => _avisarHub(k)));

// En _showSat, en los dos postMessage de PHYSIQ_SAT_VISIBLE:
{ type: 'PHYSIQ_SAT_VISIBLE', hub: location.origin + location.pathname, sat: name }
```

`location.pathname` es `/physiq/` tras `restoreState`. En la tabla «postMessage protocol» del README y del CLAUDE.md del hub: `PHYSIQ_HUB` (hub → satélite) «Dirección del hub y nombre del satélite, para que el satélite escriba enlaces que abran el hub».

### 4. Radiostasis como satélite

Hoy Radiostasis no está en el hub. Para añadirla hace falta su entrada en `SATS`, su tarjeta y su `<iframe id="sat-radiostasis">` (sin permisos especiales). Dos formas:

| Forma | `SATS.radiostasis` | Qué falta |
| --- | --- | --- |
| Copiada como los demás satélites | `'/physiq/radiostasis/'` | Workflow de CD en este repo que copie `dist/` a `physiq/radiostasis/` (como los otros satélites, con `PHYSIQ_DEPLOY_TOKEN`). La build ya funciona en un subdirectorio (`base: './'`) |
| Desde Cloudflare | `'https://radiostasis.edu-gamboa-rodriguez.workers.dev/'` | Nada más: la convención funciona entre dominios (probado) |

## Qué hace Radiostasis (`src/app/hub.ts`)

- Escucha `PHYSIQ_HUB` y `PHYSIQ_SAT_VISIBLE` **solo de la ventana que la contiene**, y acepta la dirección solo si es `https:` (o `http:` en `localhost`, para pruebas). El nombre del satélite, si no es válido, es `radiostasis`.
- Con aviso, «Compartir» (y el QR de la ficha de estudio) dan `https://…/physiq/?sat=radiostasis#…` y el panel dice «El enlace abre PhysiQ con el simulador así:». Sin aviso, todo como antes.
- Al abrir el enlace, el fragmento llega al iframe y Radiostasis lo lee como siempre (al cargar o con `hashchange`).

## Comprobación

Hub de prueba con estos cambios (mismo dominio y otro dominio) y otro sin ellos, con Playwright: el caso llega al iframe, «Compartir» da el enlace del hub, ida y vuelta, abierto desde la tarjeta y, con el hub actual, enlace de Radiostasis sola. Tests en `tests/hub.test.ts`.
