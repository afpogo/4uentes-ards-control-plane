# Checkpoint owner de contrato CR-SST-0204

## Resultado

La adopción comenzó en un worktree limpio de `sst-bend` creado desde
`origin/develop@6ee18b3`. El checkout canónico sucio fue preservado.

- Branch: `feat/CR-SST-0204/chat-retention-contract`.
- Commit local: `852f25f`.
- Publicación remota: no realizada.
- Jira, deployment y producción: no modificados.

## Superficies owner agregadas

- `specs/api/chat-retention-v1.yaml`.
- `docs/api/chat-retention.md`.
- `specs/capabilities/outbound/chat-retention-v1.yaml`.
- `docs/capabilities/outbound/chat-retention-v1.md`.
- Índices API/capability y task report con `orchestrator_link`.

La capability permanece `draft`: todavía faltan runtime, migración,
almacenamiento temporal TTL, promoción transaccional, cache-aside y pruebas de
carreras antes de habilitar `CR-SST-0211`.

## Validación

- Parse de YAML: PASS.
- `npm run build`: PASS mediante junction local a las dependencias ya
  instaladas del mismo repo; no se instalaron ni cambiaron paquetes.
- `npm run check`: BLOCKED por preflight de SST en
  `http://localhost:3005/4uentes/v1/public/gallery`; no había servicios
  levantados.
- Protected smoke: no ejecutado y no presentado como cobertura aprobada.

El check owner completo queda como gate obligatorio antes de publicar o cerrar
la implementación Bend.
