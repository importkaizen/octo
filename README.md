# OCTO — High Ticket Sales Course Template

A single-page, interactive 3D course map for OCTO. The spider sits at the center of an eight-leg web; each chapter node opens a full-screen lesson outline, and scrolling along a leg zooms into and opens its chapter.

## Run locally

Serve this folder over HTTP so the browser can load the ES modules:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Customize

- Edit the eight sample chapters in `app.js`.
- Adjust the crimson and graphite palette in `style.css`.
- Change the site title and introductory copy in `index.html`.

The 3D runtime files are bundled locally (`three.module.js` and `three.core.js`), so no package install or external runtime dependency is needed. Three.js is MIT licensed; see `THREE-LICENSE.txt`.
