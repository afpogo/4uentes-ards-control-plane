# Descubrimiento CR-SST-0141

Fecha: 2026-07-12.

Durante la auditoría read-only de `CR-SST-0130` se comprobó que el builder Web
nativo de `sst-fend` produce `payload` ausente. SST permite el request cuando
existe URL top-level, pero sólo persiste un payload si fue enviado. Por eso el
contrato canónico de `CR-SST-0129` responde `payloadKind=unclassified`.

El defecto se separó de Text para no ampliar silenciosamente `CR-SST-0130`.
No se autoriza reclasificación histórica dentro de este CR.

Jira espejo: `SST-71`, Subtask de `SST-58`, bajo Epic `SST-57`.
