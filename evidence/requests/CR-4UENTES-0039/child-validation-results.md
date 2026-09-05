# Validación del repositorio owner

Fecha: 2026-09-05. Repositorio: `4uentes-portfolio`.

Resultados:

- `npm ci`: PASS; instaló el lockfile sin modificarlo.
- `npm run check`: PASS.
- `npm run build`: PASS con warning heredado de `caniuse-lite` desactualizado.
- `scripts/check-public-assets.js`: PASS; cero recursos públicos y ningún CV o
  PDF en `dist`.
- `git diff --check`: PASS.
- expansión de promotion path allowlist: PASS, exactamente doce paths.
- escaneo de rutas locales, credenciales y claves privadas sobre el diff:
  PASS, sin coincidencias.
- árbol del head `11b1f67` y del merge `056b6e4`: idéntico,
  `524296244113a491eb339bdaceb79a511212e3df`.

`npm ci` reportó vulnerabilidades heredadas: 3 críticas, 24 altas, 13
moderadas y 6 bajas. No se ejecutó `npm audit fix` porque las dependencias y
`package-lock.json` están fuera de la allowlist. El riesgo permanece como gate
de promoción estable.
