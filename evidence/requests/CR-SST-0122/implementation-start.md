# CR-SST-0122 - Inicio de implementacion

## Contexto

- Fecha: 2026-07-05
- INIT/Epic: `INIT-SST-0001` / `SST-27`
- Parent activo: `SST-6`
- Defecto origen: `CR-SST-0118` / `SST-48`

## Defecto

`POST /api/learning-workspaces/sources/:previewId/accept` falla cuando recibe
`annotationIds` con `serverAnnotationId`.

La causa observada en logs de `sst-bend` es que el filtro compara el hash
`server_annotation_id` contra la columna UUID `id`, provocando:

`invalid input syntax for type uuid`

## Politicas aplicadas

- `owner-documentation-authority-policy`: este CR permite mutar `sst-bend`, por
  lo que exige docs/specs owner y `npm.cmd run check` del control-plane antes de
  cierre.
- `agent-architecture-boundary-policy`: no se cambia auth, RBAC, contrato BFF ni
  frontend.
- `human-doc-language`: evidencia humana en espanol.

## Alcance

Permitido:

- Corregir filtrado de `annotationIds` en `sst-bend`.
- Agregar prueba enfocada para aceptar por `serverAnnotationId`.
- Actualizar ARDS/SDD owner de `sst-bend`.

Fuera de alcance:

- Cambios en `sst-fend`.
- Cambios funcionales en `node-auth`.
- Migraciones.
- Redefinir el contrato de LearningWorkspace.
