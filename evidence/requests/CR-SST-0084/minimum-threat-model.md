# CR-SST-0084 - Threat model minimo

## Activos protegidos

- Valores de passwords, API keys, tokens, connection strings, llaves privadas y
  secretos equivalentes del usuario.
- Metadata de conexion que puede ser sensible aunque no sea un secreto directo.
- Eventos de auditoria de acciones `reveal` y `copy`.

## Riesgos principales

- Exposicion accidental de valores en listas, busquedas, logs, errores o
  evidencia.
- Bypass de owner/account scope al revelar o copiar.
- Persistencia accidental en plaintext.
- Indexacion full-text de valores secretos.
- Export o prompt accidental con valores reales.
- UI que deja valores visibles mas tiempo del necesario.

## Controles v1 requeridos

- Cifrado antes de persistir.
- Endpoints separados para `reveal` y `copy`.
- Auditoria obligatoria para `create`, `update`, `delete`, `reveal`, `copy`,
  `rotate` y `revoke`.
- Responses metadata-only por defecto.
- No logging de payloads con valores secretos.
- No full-text index sobre valores.
- Auto-hide en UI despues de una revelacion temporal.
- Bloqueo de `seed_phrase` y equivalentes.

## Gaps aceptados

- No se modela vault empresarial completo.
- No se implementa integracion `sst-extension` en v1.
- La rotacion automatica por proveedor queda fuera; v1 registra nueva version y
  reemplazo manual.
