# CR-4UENTES-0021 - Analisis De Proyecto Jira Para 4UENTES

## Pregunta

Conviene crear un proyecto Jira nuevo fuera de SST para el portfolio y otros
activos 4UENTES no-SST?

## Decision Recomendada

Si. Conviene crear un proyecto Jira separado para 4UENTES/Portfolio.

## Razonamiento

SST representa un producto/solucion especifica. El portfolio pertenece a
4UENTES como activo profesional y de exposicion laboral. Mezclar ambos en el
proyecto Jira SST genera estos problemas:

- El backlog SST queda contaminado con trabajo de marca personal, CV,
  publicacion y narrativa.
- Las metricas, estados y prioridades de SST dejan de representar solo el
  producto SST.
- El control plane ya separa scope global SST de scope 4UENTES; Jira deberia
  respetar la misma frontera.
- Futuras apps no-SST, como Fulbito, podrian repetir el problema si todo cae en
  SST.

## Modelo Propuesto

Proyecto Jira separado:

- Nombre sugerido: `4UENTES`
- Key sugerida: `4U`
- Alternativa si Jira no permite key corta: `FUE` o `PORT`
- Producto inicial dentro del proyecto: `Portfolio`

Epics sugeridos:

- `Portfolio Publication Readiness`
- `Portfolio CV And Professional Narrative`
- `4UENTES Control Plane`
- `Future Apps Intake`

Labels base:

- `ards-sdd`
- `control-plane`
- `4uentes`
- `portfolio`
- `non-sst`

Regla:

- `CR-SST-*` vive en proyecto SST.
- `CR-4UENTES-*` vive en proyecto 4UENTES.
- Apps futuras como Fulbito no entran a SST salvo que dependan funcionalmente de
  SST. Deben entrar como `CR-4UENTES-*` o con prefijo propio si se decide.

## Jira MCP

No se ejecuto creacion ni transicion Jira en este corte porque falta confirmar:

- cloudId o site URL operativo;
- project key definitivo;
- issue type;
- campos requeridos;
- workflow/transiciones.

Cuando esos datos existan, el control plane debe crear evidencia de discovery y
recien despues crear issues o transicionar estados.
