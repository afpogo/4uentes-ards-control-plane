# Resumen de archivos modificados

Fecha: 2026-09-05. Request: `CR-4UENTES-0039`.

El PR owner `afpogo/4uentes-portfolio#2` partió de
`origin/develop@877b528fab491382806ced0de8c3d376226e02f2` y fue fusionado como
`056b6e4ede90854685c48ff9880d475e54b8db84`.

La allowlist se expandió exactamente a doce paths:

- se agregó `config/public-resources.json` con una lista pública vacía;
- se agregaron `scripts/check-public-assets.js` y cuatro superficies owner en
  `docs/` y `specs/features/`;
- se modificaron `package.json`, los dos archivos Webpack y dos superficies de
  Home;
- se eliminó `src/assets/resources/afpogo_cv.pdf` del tip sin reescribir la
  historia.

No cambiaron `package-lock.json`, imágenes, Vite, Sass, otras páginas,
workflows, variables de entorno ni artefactos de build. El checkout histórico
sucio no fue modificado ni usado como fuente global.
