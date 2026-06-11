# Correccion De Semantica De Procesos Jira

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0034
- Resultado: `PASS`
- Escritura Jira: no

## Decision

CR-SST-0034 queda definido como proceso de sincronizacion, no como feature ni
como ticket Jira funcional propio.

La descripcion Jira ya no debe usar el campo ambiguo:

```text
Proceso control-plane:
- CR-SST-0034
```

El template corregido separa:

```text
Proceso de sincronizacion:
- CR-SST-0034

Procesos origen:
- <request_ids del feature_state o ninguno>
```

## Impacto

- `Proceso de sincronizacion` identifica el CR que ejecuta la reconciliacion o
  mantenimiento del ticket.
- `Procesos origen` conserva los CR historicos o funcionales del feature state.
- `State id` sigue siendo la identidad estable del trabajo representado.
- CR-SST-0034 no crea por si solo un issue Jira nuevo.

## Resultado Read-Only Jira

La reconciliacion posterior a la correccion encontro:

- 8 issues con match exacto por summary;
- 1 feature state ambiguo: `sst-tag-prefix-engine`;
- 8 issues con campo legacy `Proceso control-plane`;
- 0 issues con `Proceso de sincronizacion`;
- 0 issues con `Procesos origen`.

La correccion de esos issues queda preparada para una etapa posterior de
escritura Jira, despues de validar el nuevo template.
