# CR-SST-0125 - Resultados De Validacion

## Estado

- Fecha: 2026-08-10
- Resultado local: PASS
- CI GitHub: PASS

## Validaciones SST Bend

- `npm.cmd run test:learning-workspace`: PASS despues del rebase.
  - Conserva anotaciones previewed/accepted.
  - Normaliza manifests CourseSource y HTML suministrado.
  - Excluye generados y emite warnings esperados.
  - Rechaza WebArticleSource con URL pero sin contenido suministrado.
- `npm.cmd run test:tag-engine`: PASS, 7/7.
- `npm.cmd run check`: PASS, exit code 0 y `[ARDS CHECK] OK`.
- `git diff --check`: PASS.
- GitHub Actions `Node.js CI / sst (18.x)`: PASS.
- GitHub Actions `Node.js CI / sst (20.x)`: PASS.
- GitHub Actions `Build and Publish Development Image / build-publish-update`: PASS.

## Observacion Del Harness

El check ARDS informa cobertura protegida parcial porque no se entregaron
`SMOKE_JWT` ni `SMOKE_JWT_OWNER`. Los smokes autenticados fueron omitidos por
esa condicion y el comando finalizo correctamente. No se guardaron tokens ni
datos de usuario como evidencia.

## Verificacion BFF

La inspeccion read-only de `4uentes-auth` confirmo que
`LearningWorkspacesController` elimina solo campos internos de auth y reenvia el
resto del body. El datasource axios tambien transporta el body sin mapper de
campos, por lo que el nuevo DTO compatible no queda bloqueado.

## Pendiente

- Fusionar a `develop`.
- Ejecutar reconciliacion post-merge antes del cierre local/Jira.
