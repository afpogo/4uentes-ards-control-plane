# Reconciliación de colisión de namespace posterior a PR #36

Fecha: 2026-08-22.

## Hallazgo

Después de abrir el PR #37, `main` incorporó mediante PR #36 un
`CR-SST-0203` canónico y cerrado para reconciliar mirrors Jira de seguridad de
preproducción. Nuestro `CR-SST-0203` de Bend todavía no estaba publicado en
`main`, por lo que conservar ambos IDs habría violado la identidad estable y la
correlación uno-a-uno entre CR e issue primario.

## Decisión

Se preserva sin cambios el `CR-SST-0203` ya canónico de `main`. Los cuatro
lifecycles de retención aún no publicados se renumeran en bloque:

| Owner/unidad | ID anterior | ID canónico nuevo | Jira |
| --- | --- | --- | --- |
| Bend | `CR-SST-0203` | `CR-SST-0204` | `SST-114` |
| Infra Redis | `CR-SST-0204` | `CR-SST-0205` | `SST-115` |
| Fend consentimiento | `CR-SST-0205` | `CR-SST-0206` | `SST-116` |
| QA integrado | `CR-SST-0206` | `CR-SST-0207` | `SST-117` |

Los artefactos de preflight y escritura Jira originales se conservan como
evidencia histórica exacta. Las referencias canónicas vigentes, los lifecycle
files y el read-model usan los IDs nuevos. Jira se reconcilia mediante un lote
separado y sanitizado.

## Límites

- Sin cambio de scope, owner, parent, dependencias, assignee o estado.
- Sin transición Jira, borrado, mutación de repos funcionales o clúster.
- `CR-SST-0202` y su Tarea `SST-113` conservan su identidad.
- La autorización de ejecución owner sigue pendiente para `CR-SST-0204`.
