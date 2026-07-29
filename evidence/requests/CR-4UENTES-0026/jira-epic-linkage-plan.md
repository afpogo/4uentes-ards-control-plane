# CR-4UENTES-0026 - Jira Epic Linkage Plan

## Decision

`CR-4UENTES-0026` debe colgar de una Epic del proyecto Jira
`4uentes-portfolio`, no del proyecto SST. `4uentes` es la empresa/organizacion;
`Portfolio` es el producto operativo inicial dentro de esa empresa.

## Epic Propuesta

- Company: `4uentes`
- Project: `4uentes-portfolio`
- Key: `PORT`
- Issue type: `Epic`
- Summary: `[4UENTES][Portfolio] Portfolio Publication Readiness`
- Rol: agrupar trabajo de publicacion del producto Portfolio.

## Task Propuesta

- Issue type: `Task`
- Parent/Epic: `[4UENTES][Portfolio] Portfolio Publication Readiness`
- Summary: `[4UENTES][Portfolio][CR-4UENTES-0026] Mobile publication QA readiness`
- Priority: `High`
- Labels:
  - `ards-sdd`
  - `control-plane`
  - `4uentes`
  - `portfolio`
  - `mobile`
  - `publication-readiness`
  - `non-sst`

## Estado MCP/Jira

No se crea ni transiciona Jira en este corte porque faltan datos operativos o
capacidad MCP:

- proyecto Jira `4uentes-portfolio` con key `PORT`;
- Epic issue key;
- issue type y campos requeridos del proyecto;
- workflow y transiciones disponibles.

## Regla

Cuando exista la Epic, el control plane puede crear el ticket espejo y registrar
la evidencia. Jira sigue siendo mirror operativo; ARDS/SDD local sigue siendo la
fuente de verdad.
