# Politica De Evidencia E2E Para Pendientes Jira MCP API SST

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0046
- Escritura Jira ejecutada: no
- Feature states modificados: no

## Regla

Cada pendiente futuro debe tener evidencia e2e antes de sincronizarse con Jira
o modificar repos funcionales.

## Evidencia Minima

Para Jira -> MCP -> Control-Plane:

- `status-observe`;
- `status-proposals`;
- `sync-health`;
- decision local.

Para Control-Plane -> Jira:

- `dry-run`;
- `policy-check`;
- `metadata`;
- `duplicates` o `reconcile`;
- aprobacion;
- write result;
- post-write reconciliation.

Para Control-Plane -> API/SST:

- request planned;
- impact analysis;
- handoff si aplica;
- evidencia de implementacion;
- validacion;
- update candidate de feature_state;
- sync-health o writer si Jira debe reflejar el cambio.

## Prohibiciones

- No crear Jira tickets sin CR-SST planificado.
- No escribir Jira sin aprobacion.
- No mutar `feature_state` por una senal Jira.
- No modificar repos hijos sin request aprobado.
- No guardar secretos, OAuth material, cloudId, cookies o URLs privadas en Git.

