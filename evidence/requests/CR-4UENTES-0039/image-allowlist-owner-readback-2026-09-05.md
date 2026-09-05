# Readback owner de allowlist pública de imágenes

Fecha: 2026-09-05  
Repositorio: `afpogo/4uentes-portfolio`  
Destino: `develop`

## Publicación

- PR owner: `#3`
- Base observada: `056b6e4ede90854685c48ff9880d475e54b8db84`
- Head validado: `7a512c2e357e73065c0ec1fa50b96753fa7e1acb`
- Merge remoto: `f28b01683ea8191960452bf5a2a5d7c196628c1e`
- Árbol de head y merge: `6caa390502a456393ed998f4825eb2da9ae9ba73`
- Paths modificados: los ocho paths exactos autorizados; ningún binario cambió.
- Checks GitHub: ninguno configurado o reportado.

## Contrato resultante

- 74 imágenes públicas fijadas por `source + destination + Git blob`.
- 4 imágenes excluidas del artefacto, conservadas sin cambios en Git.
- 78 fuentes forman una partición completa y disjunta.
- Ambos Webpack consumen la allowlist y ya no copian el directorio de imágenes
  recursivamente.
- El checker invalida blobs cambiados, fuentes o destinos duplicados, imágenes
  sin disposición, referencias con casing incorrecto, contenido extra en el
  artefacto, CVs y PDFs.

## Validación

| Gate | Resultado |
|---|---|
| `npm ci` | PASS; 46 vulnerabilidades heredadas, sin `audit fix` |
| `npm run check` | PASS |
| Composición del artefacto | PASS: 74 públicas, 4 excluidas, 0 recursos |
| Igualdad de blobs source/artifact | PASS para los 74 destinos |
| Referencias textuales case-sensitive | PASS |
| `git diff --check` | PASS |
| Diff binario | Vacío |
| HTTP GET/HEAD de imágenes aprobadas | 148/148 con `200` y MIME de imagen |
| HTTP GET/HEAD de excluidas, casing legado y CV | 12/12 con `404` |
| Home desktop | PASS; fotos autorizadas presentes y CTA del CV ausente |
| Home móvil | Sin regresión del slice; persiste overflow preexistente |

La conexión de navegador integrada no estuvo disponible por la configuración
de aislamiento de la sesión. Se usó Chrome headless local como fallback. Las
capturas y perfiles temporales, que contenían imágenes personales autorizadas,
se eliminaron inmediatamente y nunca se agregaron a Git.

## Estado

El gate binario está completo en `develop`, pero no habilita la promoción a
`main`. Continúan abiertos los gates independientes de overflow móvil,
reconciliación Vite/Sass, vulnerabilidades heredadas y ausencia de CI owner.
