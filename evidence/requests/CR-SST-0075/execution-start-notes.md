# CR-SST-0075 Execution Start Notes

## Estado

- Fecha: 2026-06-21
- Request: CR-SST-0075
- Scope: `sst-fend` frontend governed selector or autocomplete for article tags

## Estado Upstream Confirmado

Dependencias ya cerradas y verificadas:

- `CR-SST-0073` / `SST-21`: `Finalizada`
- `CR-SST-0074` / `SST-22`: `Finalizada`

Estado operativo de este slice:

- `CR-SST-0075` / `SST-23`: `En curso`
- `CR-SST-0076` / `SST-24`: queda pendiente para adopcion en Diccionario y
  cierre integral de `SST-4`

## Objetivo Del Corte

Reemplazar el input de tags separado por coma en Articulos por una UX gobernada
que:

- consulte valores existentes antes de crear;
- soporte selector o autocomplete con debounce;
- mantenga la creacion de nuevos `TagValue` como accion explicita;
- preserve el payload estructurado de tags gobernados en create y update;
- soporte `tags: []` como detach total sin volver a `string[]`.

## Boundary Explicito

Este arranque queda acotado a `sst-fend`.

No entra en este corte:

- crear endpoints nuevos en `sst-bend`;
- crear rutas nuevas en `4uentes-auth`;
- reconciliar Diccionario;
- cerrar `SST-4`.

## Primeras Unidades De Implementacion

1. Identificar el formulario y el flujo actual de Articulos que todavia usa
   input libre por coma.
2. Identificar el cliente BFF disponible para `GET /api/tags/definitions`,
   `GET /api/tags/values`, `POST /api/tags/values` y el bind por recurso.
3. Diseñar la migracion de estado frontend para tags estructurados reutilizando
   el contrato ya validado por `SST-21` y `SST-22`.
4. Validar impacto en create, update, dedup y empty state.

## Evidencia De Arranque

- `evidence/requests/CR-SST-0075/jira-parent-SST-4-observation.md`
- `evidence/requests/CR-SST-0075/jira-issue-SST-23-observation.md`
- `evidence/requests/CR-SST-0075/jira-sst-23-start-transition-summary.md`
