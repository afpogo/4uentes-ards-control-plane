# CR-SST-0085 - Resumen de adopcion Initiative

Validado conceptualmente el 2026-06-27.

## Decision

Se adopta `Initiative` como modelo local del control-plane para agrupar
resultados amplios que pueden requerir varios `CR`.

El primer caso es:

- `INIT-CP-0001`: evolucionar el control-plane desde lifecycle documentado
  hacia lifecycle verificable.

## Fuente

La fuente de diagnostico y handoff es:

- `.ards/audits/control-plane/latest.md`

El informe se adopta como evidencia de planificacion. No se convierte en canon
del Core automaticamente.

## Boundaries

- No se modifican repos hijos.
- No se escribe en Jira.
- No se promueve runtime.
- No se cambia `request_lifecycle.documented_only`.
- No se modifica `4uentes-ards-core`.

## Resultado Esperado

La Initiative permite ordenar CRs posteriores:

- reconciliacion de State sin evidencia;
- freshness de read models;
- validacion de capability links;
- schema ejecutable para handoff agentico;
- eventual Epic Jira mirror;
- eventual promocion del modelo al Core.
