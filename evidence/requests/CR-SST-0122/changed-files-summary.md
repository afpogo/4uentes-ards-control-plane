# CR-SST-0122 Changed Files Summary

## Estado

- Fecha: 2026-07-05
- Request: `CR-SST-0122`
- Repositorio mutado: `sst-bend`
- Motivo: corregir el fallo runtime detectado por `CR-SST-0118` al aceptar previews de LearningWorkspace con `annotationIds` basados en `serverAnnotationId`.

## Cambios en runtime

- `src/apps/sst/infrastructure/db/postgres/learning-workspaces/sequelize-learning-workspace.repository.js`
  - Se agrego `isUuid(value)` para distinguir UUID internos de identificadores externos.
  - Se agrego `buildAnnotationIdFilter(annotationIds)` para construir filtros Sequelize seguros.
  - El filtro ahora compara todos los valores contra `serverAnnotationId`.
  - El filtro contra columna `id` solo recibe valores con formato UUID.
  - Los flujos `accept` y `reject` usan el helper comun.

## Cambios en pruebas

- `scripts/test-learning-workspace.js`
  - Se agrego regresion para `serverAnnotationId` de 64 caracteres.
  - Se verifica que el filtro `id IN (...)` no reciba hashes no UUID.
  - Se verifica que UUID internos sigan siendo aceptados.

## Limites

- No se cambiaron migraciones.
- No se cambio el contrato BFF/API de `node-auth`.
- No se cambio la UX frontend.
- No se persistieron JWTs, secretos, cookies ni contenido privado en evidencia.
