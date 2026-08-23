# CR-SST-0213 — autorización de JIRA-SEC-PREPROD-03

Fecha: 2026-08-23.

## Autorización explícita

El usuario autorizó textualmente `JIRA-SEC-PREPROD-03` después de recibir el
allowlist completo.

## Operaciones autorizadas

- `SST-86`: reemplazar únicamente la línea final de sincronización de la
  descripción y agregar el comentario exacto aprobado.
- `SST-89`: las mismas dos operaciones.
- `SST-92`: las mismas dos operaciones.

Reemplazo exacto:

```text
Antes:  Proceso de sincronización: `CR-SST-0204`.
Después: Proceso de sincronización: `CR-SST-0213`.
```

Los comentarios exactos están publicados en
`jira-identity-correction-proposed-payloads.md`.

## Límites

No se autoriza crear, borrar, transicionar, reparentar, asignar, editar
comentarios históricos ni cambiar status, priority, labels, parent, summary o
cualquier otro issue.

La autorización se consume al ejecutar una vez las seis operaciones y exige
readback sanitizado posterior.
