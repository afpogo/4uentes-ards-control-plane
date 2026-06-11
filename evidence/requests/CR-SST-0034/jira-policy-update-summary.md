# Resumen De Actualizacion De Politica Jira

## Estado

- Fecha: 2026-06-06
- Request: CR-SST-0034
- Resultado: `PASS`
- Escritura Jira: no

## Cambios

La politica `docs/requests/jira-feature-ticket-policy.md` fue extendida para
soportar sincronizacion de backlog gobernada por procesos `CR-SST-****`.

## Campos Obligatorios Corregidos

Cada ticket generado o mantenido por el control-plane debe incluir:

```text
Proceso de sincronizacion:
- CR-SST-****

Procesos origen:
- <request_ids del feature_state o ninguno>
```

`Proceso de sincronizacion` identifica el proceso que genero, actualizo o
reconcilio el ticket Jira.

`Procesos origen` conserva los requests historicos o funcionales del
feature_state.

## Diferencia Entre Procesos

- `Proceso de sincronizacion`: proceso operativo actual que dispara la sync.
- `Procesos origen`: requests historicos o funcionales declarados por el
  feature state.
- `Request ids relacionados`: seccion humana de compatibilidad mientras existan
  tickets/evidencia con ese formato.

## Impacto En Scripts

`scripts/jira-mcp/lib/jira-payloads.js` ahora agrega `Proceso de
sincronizacion` usando `config.evidence.requestId` y `Procesos origen` usando
`state.requestIds`.

`scripts/jira-mcp/policy-check.js` ahora falla si la descripcion no contiene el
proceso de sincronizacion activo, si no contiene `Procesos origen`, o si usa el
campo ambiguo obsoleto `Proceso control-plane`.

`scripts/jira-mcp/search-duplicates.js` y `scripts/jira-mcp/create-issues.js`
aceptan `--request-id` y `--output-dir` para que la evidencia y los payloads
apunten al request correcto.
