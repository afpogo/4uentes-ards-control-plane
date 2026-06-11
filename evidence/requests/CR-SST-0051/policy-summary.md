# Policy Summary

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0051
- Resultado: politica definida
- Escritura Jira ejecutada: no
- Repos funcionales modificados: no

## Nombre Del Tipo

El tipo operativo queda definido como:

```text
Jira Backlog Mirror Ticket
```

## Significado

Un `Jira Backlog Mirror Ticket` es un ticket Jira que refleja un backlog item
diferido del control-plane.

No es:

- un request `CR-SST-****`;
- una reserva de numero CR-SST;
- una autorizacion automatica de implementacion.

Si es:

- visibilidad Jira para backlog diferido;
- punto de priorizacion y discusion operativa;
- enlace entre Jira y `state/jira-backlog-registry.yaml`.

## Regla Operativa

Cuando haya pasos aceptados pero diferidos y Jira sea el tablero operativo, el
control-plane debe:

1. registrar el backlog item;
2. generar dry-run;
3. crear o mantener su `Jira Backlog Mirror Ticket`;
4. registrar `jira_issue_key`;
5. mantener `assigned_cr_sst: null` hasta que el item sea seleccionado.

## Estado Actual

Los 6 backlog items existentes ya tienen mirror Jira:

| Backlog ID | Jira Issue |
|---|---|
| `SST-BL-JIRA-001` | `SST-13` |
| `SST-BL-JIRA-002` | `SST-14` |
| `SST-BL-JIRA-003` | `SST-15` |
| `SST-BL-JIRA-004` | `SST-16` |
| `SST-BL-JIRA-005` | `SST-17` |
| `SST-BL-JIRA-006` | `SST-18` |
