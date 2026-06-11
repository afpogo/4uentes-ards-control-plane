# Evidencia De Politica De Tickets Jira

## Estado

- Fecha: 2026-06-05
- Request: CR-SST-0033
- Politica: `docs/requests/jira-feature-ticket-policy.md`
- Resultado: `PASS`
- Escritura Jira: no

## Decision

Antes de publicar los 9 tickets de funcionalidades no cerradas, el
control-plane incorpora una politica local para generacion y mantenimiento de
tickets Jira.

La politica confirma que Jira opera como tablero y espejo operativo. La fuente
de verdad del estado sigue siendo `state/features/*.current.yaml`.

## Template Aprobado Para El Batch

El template minimo exige:

- project key `SST`;
- tablero `SST-Team`;
- issue type `Tarea`;
- summary con prefijo `[SST][feature-state]`;
- labels base `ards-sdd`, `control-plane`, `feature-state`, `not-done`;
- label adicional con el `status` literal;
- descripcion con estado actual, objetivo, gaps abiertos, `state_id`, servicios,
  requests, fuente control-plane, evidence refs, validation refs y criterio de
  cierre.

## Boundary De Escritura

La aprobacion del batch cubre solo creacion inicial de issues para las 9
funcionalidades no cerradas.

No cubre:

- ediciones futuras;
- comentarios;
- transiciones;
- cierres;
- worklogs;
- links entre issues.

Esas acciones requieren request, evidencia y aprobacion humana separada.

## Implicacion Para CR-SST-0033

CR-SST-0033 puede continuar a creacion externa solo si mantiene:

- metadata Jira observada;
- busqueda de duplicados;
- dry-run alineado al template;
- resumen de tickets creados o bloqueados;
- resultado de `npm run check`.
