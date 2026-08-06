# CR-4UENTES-0026 - Preparacion De Creacion Jira Project/Tickets

Fecha: 2026-07-04

Modo: `mcp-read-only` con intencion de escritura aprobada por el usuario.

## Intencion Solicitada

Crear en Jira:

- empresa/contexto: `4uentes`;
- proyecto: `4uentes-portfolio`;
- project key: `PORT`;
- Epic: `[4UENTES][Portfolio] Portfolio Publication Readiness`;
- primeros tickets de Portfolio bajo esa Epic.

## Politica Aplicada

- Jira es mirror operativo; el control-plane sigue siendo la fuente canonica.
- No se debe crear trabajo de `Portfolio` dentro del proyecto `SST`.
- Las escrituras Jira requieren aprobacion humana explicita por accion.
- No se deben persistir `cloudId`, URL privada, tokens, cookies ni OAuth
  material.

## Resultado MCP

Lecturas ejecutadas:

- busqueda de proyectos visibles con capacidad `create` para `PORT`;
- busqueda de proyectos visibles con capacidad `create` para `4uentes-portfolio`;
- busqueda de proyectos visibles con capacidad `create` para `SST`.

Hallazgos:

- `SST` existe y es visible.
- `4uentes-portfolio`/`PORT` fue creado por el operador despues del bloqueo
  inicial.
- El MCP Atlassian disponible en esta sesion no expone una tool para crear
  proyectos Jira.
- Las tools disponibles permiten crear issues, comentar, transicionar, crear
  worklogs y links, pero requieren que el proyecto Jira ya exista.

## Decision

No se creo ningun issue en `SST` porque eso mezclaria scope SST con scope
Portfolio/4uentes.

El proyecto `4uentes-portfolio` con key `PORT` debe verificarse por MCP antes
de crear la Epic y los tickets.

## Payload Pendiente

Cuando exista el proyecto Jira `4uentes-portfolio` con key `PORT`, crear:

1. Epic:
   - Project key: `PORT`
   - Issue type: `Epic`
   - Summary: `[4UENTES][Portfolio] Portfolio Publication Readiness`
   - Labels: `ards-sdd`, `control-plane`, `4uentes`, `portfolio`,
     `publication-readiness`, `non-sst`

2. Task:
   - Project key: `PORT`
   - Issue type: `Tarea`
   - Parent/Epic: Epic anterior
   - Summary: `[4UENTES][Portfolio][CR-4UENTES-0026] Mobile publication QA readiness`
   - Priority: `High`
   - Labels: `ards-sdd`, `control-plane`, `4uentes`, `portfolio`, `mobile`,
     `publication-readiness`, `non-sst`

3. Task:
   - Project key: `PORT`
   - Issue type: `Tarea`
   - Parent/Epic: Epic anterior
   - Summary: `[4UENTES][Portfolio][CR-4UENTES-0027] Mobile linear layout implementation`
   - Priority: `High`
   - Labels: `ards-sdd`, `control-plane`, `4uentes`, `portfolio`, `mobile`,
     `publication-readiness`, `urgent`, `non-sst`

4. Tasks I18N urgentes:
   - `[4UENTES][Portfolio][CR-4UENTES-0022] Experience company cards I18N migration`
   - `[4UENTES][Portfolio][CR-4UENTES-0023] Experience initiatives I18N migration`
   - `[4UENTES][Portfolio][CR-4UENTES-0024] Bilingual ES/EN QA`
   - `[4UENTES][Portfolio][CR-4UENTES-0025] Bilingual narrative as sanitized CV source`

## Proximo Paso Operativo

Crear manualmente o via admin/API el proyecto Jira:

- Name: `4uentes-portfolio`
- Key: `PORT`
- Company/Category/Label: `4uentes`
- Template recomendado: software/team-managed o equivalente simple.

Despues de confirmar visibilidad MCP del proyecto `PORT`, ejecutar la creacion
de Epic y tickets por MCP con evidencia post-write sanitizada.
