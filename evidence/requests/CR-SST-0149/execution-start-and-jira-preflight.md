# Inicio de ejecución y preflight Jira

Fecha: 2026-08-04

`CR-SST-0149` conserva su response en `requests/planned/` y publica un snapshot
de ejecución en `requests/running/` antes de sincronizar su espejo operativo.
El alcance continúa limitado a reparar la estructura responsive de signup en
`sst-fend`; todavía no se modificó el repositorio owner.

## Correlación ARDS/SDD

- Initiative: `INIT-SST-0006`.
- Epic primaria: `SST-72`.
- CR: `CR-SST-0149`.
- Issue primario existente: `SST-74`.
- Source of truth: `4uentes-orchestor`; Jira permanece como mirror.

## Preflight live

- Proyecto: `SST`.
- Parent observado: `SST-72`.
- Tipo observado: `Error`.
- Estado inicial observado: `Tareas por hacer`.
- Responsable: sin asignar.
- Transición objetivo disponible: `En curso`.
- Usuario Jira conectado: resoluble y asignable; no se conserva su identificador
  privado en evidencia.

El issue histórico conserva su key, tipo y parent en este lote. La policy evita
crear un duplicado; una eventual conversión de `Error` a `Tarea` necesita una
autorización de reconciliación independiente.

## Lote autorizado

- Request: `CR-SST-0149`.
- Provider/proyecto: Jira / `SST`.
- Issue: `SST-74`.
- Operaciones: reemplazar la descripción por el resumen gobernado, asignar al
  usuario Jira conectado y transicionar a `En curso`.
- Parent/tipo esperados: `SST-72` / `Error`.
- Ventana: turno actual de inicio del lifecycle de `SST-74`.

No se autorizaron cambios de summary, tipo, parent, prioridad, labels, links ni
otros tickets.

## Continuidad owner

La implementación futura debe actualizar en `sst-fend`:

- `specs/31-auth-frontend.yml`;
- `docs/31-auth-frontend.md`;
- `specs/15-ui-framework.yml`;
- una evidencia de tarea owner para la corrección y su QA responsive.

El cierre requerirá los checks de `sst-fend`, pruebas Chrome DevTools en la
matriz acordada y `npm.cmd run check` completo en el control-plane.
