# Plan De Implementacion Del Cliente Jira MCP

## Estado

- Fecha: 2026-06-05
- Request: CR-SST-0029
- Clasificacion: complex-high-risk-task
- Alcance: solo control-plane
- Target board: `SST-Team`
- Target project key: `SST`
- Issue type inicial asumido: `Task`

## Objetivo

Implementar una capacidad chica y auditable de cliente Jira MCP en
`4uentes-orchestor` para que el control-plane pueda verificar metadata Jira,
buscar duplicados y crear tickets para feature states no `done` despues de
aprobacion humana explicita.

Esto no es un MCP server. Es una capacidad operativa client-side que consume
Atlassian Rovo MCP Server.

## Non-Goals

- No crear un MCP server custom.
- No modificar repos funcionales.
- No guardar OAuth tokens, API tokens, cookies, URLs privadas ni secretos en
  Git.
- No crear Jira issues antes de duplicate search y aprobacion humana.
- No automatizar creacion de proyecto o board Jira en esta fase.

## Archivos Propuestos

```text
environments/local/jira-mcp.local.example.yaml
scripts/jira-mcp/generate-dry-run.js
scripts/jira-mcp/verify-project.js
scripts/jira-mcp/read-metadata.js
scripts/jira-mcp/search-duplicates.js
scripts/jira-mcp/create-issues.js
scripts/jira-mcp/lib/config.js
scripts/jira-mcp/lib/feature-state-reader.js
scripts/jira-mcp/lib/jira-payloads.js
scripts/jira-mcp/lib/evidence.js
scripts/jira-mcp/lib/mcp-client.js
```

Archivo local opcional:

```text
environments/local/jira-mcp.local.yaml
```

El archivo local opcional debe permanecer ignorado por Git si guarda settings
host-specific o cercanos a autenticacion.

## Config

Crear un ejemplo sin secretos:

```yaml
schema_version: "1.0"
kind: "jira_mcp_local_config_example"

server:
  url: "https://mcp.atlassian.com/v1/mcp/authv2"

jira:
  board_name: "SST-Team"
  project_key: "SST"
  issue_type: "Task"

auth:
  method: "oauth"
  token_storage: "external"

evidence:
  request_id: "CR-SST-0029"
  output_dir: "evidence/requests/CR-SST-0029"
```

## Package Scripts

Agregar comandos a `package.json`:

```json
{
  "jira:mcp:dry-run": "node scripts/jira-mcp/generate-dry-run.js",
  "jira:mcp:verify": "node scripts/jira-mcp/verify-project.js",
  "jira:mcp:metadata": "node scripts/jira-mcp/read-metadata.js",
  "jira:mcp:duplicates": "node scripts/jira-mcp/search-duplicates.js",
  "jira:mcp:create": "node scripts/jira-mcp/create-issues.js"
}
```

El comando de creacion debe exigir aprobacion explicita:

```bash
npm run jira:mcp:create -- --approved
```

Sin `--approved`, el comando debe salir sin escribir en Jira.

## Fase 1: Config Y Parsing Del Read-Model

Objetivo:

- crear config local ejemplo;
- leer `state/features/*.current.yaml`;
- filtrar feature states cuyo status no es `done`;
- preservar un orden operativo repetible para los nueve pendientes.

Implementacion:

- `lib/config.js`: lee `environments/local/jira-mcp.local.yaml` si existe; si
  no existe, usa defaults seguros desde la forma ejemplo.
- `lib/feature-state-reader.js`: parsea feature state documents con un parser
  deterministico alineado al YAML actual.
- `lib/jira-payloads.js`: convierte feature states a payloads Jira.
- `generate-dry-run.js`: escribe `ticket-payload-dry-run.md`.

Evidencia:

- `ticket-payload-dry-run.md`

Acceptance:

- el comando lista los nueve features no `done` sin contactar Jira;
- `npm run check` pasa.

## Fase 2: Verificacion De Conectividad MCP

Objetivo:

- conectar con Atlassian Rovo MCP Server;
- verificar recursos Jira visibles;
- confirmar project key `SST`;
- registrar evidencia sin secretos.

Implementacion:

- `lib/mcp-client.js`: inicializa el cliente MCP para
  `https://mcp.atlassian.com/v1/mcp/authv2`.
- `verify-project.js`: invoca tools de descubrimiento de recursos/proyectos
  Jira disponibles.

Evidencia:

- `jira-mcp-project-verification.md`

Acceptance:

- `SST` queda confirmado como visible para el usuario autenticado;
- la evidencia registra el resultado sin tokens ni datos privados innecesarios;
- no ocurre escritura Jira.

## Fase 3: Metadata De Issue Type Y Campos Requeridos

Objetivo:

- confirmar que `Task` existe para project `SST`;
- leer campos requeridos;
- determinar si el dry-run tiene payload completo.

Implementacion:

- `read-metadata.js`: invoca metadata de issue types y campos.
- Si `Task` no existe, falla en modo read-only y reporta issue types
  disponibles.
- Si faltan campos requeridos, registra `TODO` en evidencia en vez de adivinar.

Evidencia:

- `jira-required-fields-summary.md`

Acceptance:

- issue type confirmado o mismatch bloqueante registrado;
- campos requeridos listados;
- no ocurre escritura Jira.

## Fase 4: Duplicate Search

Objetivo:

- buscar duplicados en Jira antes de crear issues;
- prevenir tickets duplicados para el mismo `state_id`.

Implementacion:

- `search-duplicates.js`: ejecuta JQL por cada ticket del dry-run.
- Buscar por labels, summary, request ids y texto `state_id`.
- Escribir candidatos duplicados en evidencia.

JQL sugerido:

```text
project = SST
AND labels in ("feature-state", "not-done", "control-plane")
AND text ~ "<state_id>"
```

Evidencia:

- `duplicate-search-summary.md`

Acceptance:

- cada ticket del dry-run tiene resultado de duplicate search;
- duplicados reportados antes de crear;
- no ocurre escritura Jira.

## Fase 5: Creacion Aprobada De Issues

Objetivo:

- crear tickets Jira para items no duplicados solo despues de aprobacion.

Implementacion:

- `create-issues.js`: exige `--approved`.
- Re-ejecuta duplicate search o exige evidencia fresca de duplicate search.
- Invoca la tool de creacion de Jira issue para cada payload aprobado.
- Frena ante el primer error duro salvo configuracion explicita.
- Registra issue keys creadas.

Evidencia:

- `created-ticket-summary.md`

Acceptance:

- Jira issues creados solo con aprobacion explicita;
- issue keys creadas registradas;
- duplicados omitidos registrados;
- no se registran secretos.

## Fase 6: Review Events Opcionales

Objetivo:

- permitir que el orquestador revise o actualice Jira issues mas adelante sin
  perder gobernanza del control-plane.

Comandos candidatos:

```bash
npm run jira:mcp:review
npm run jira:mcp:comment -- --issue SST-123 --approved
npm run jira:mcp:transition -- --issue SST-123 --status "In Progress" --approved
```

Reglas:

- lecturas pueden ejecutarse sin aprobacion;
- comentarios, edits y transitions requieren aprobacion;
- toda escritura genera evidencia.

Esta fase debe implementarse solo despues de estabilizar la creacion de
tickets.

## Opciones De Dependencia

Preferida:

- SDK oficial MCP TypeScript/JavaScript cuando sea compatible con el flujo
  OAuth de Atlassian remote MCP.

Fallback:

- `mcp-remote` bridge cuando el runtime necesite un proxy compatible con
  `stdio` hacia el endpoint MCP remoto.

La primera implementacion debe evitar cambios amplios de dependencias hasta
probar el camino de conectividad MCP.

## Safety Gates

- Gate 1: project verification antes de metadata.
- Gate 2: metadata antes de duplicate search.
- Gate 3: duplicate search antes de issue creation.
- Gate 4: `--approved` antes de cada escritura Jira.
- Gate 5: evidencia despues de cada operacion externa.

## Validacion

Ejecutar despues de cada fase:

```bash
npm run check
```

Cuando existan scripts, ejecutar tambien el comando read-only relevante:

```bash
npm run jira:mcp:dry-run
npm run jira:mcp:verify
npm run jira:mcp:metadata
npm run jira:mcp:duplicates
```

Ejecutar creacion solo despues de aprobacion explicita:

```bash
npm run jira:mcp:create -- --approved
```

## Preguntas Abiertas

- Que camino de cliente MCP funciona mejor en este runtime Windows/PowerShell:
  SDK directo o `mcp-remote` bridge?
- Atlassian MCP expone todas las Jira tools requeridas para el usuario
  autenticado?
- Project `SST` requiere campos adicionales ademas de summary, description,
  labels, priority e issue type?
- Las issue keys deben quedar solo en evidencia o conviene introducir un
  `state/jira-links.yaml` despues de la primera creacion exitosa?

## Siguiente Paso Recomendado

Completar Fase 1 y Fase 2 primero. Eso le da al orquestador un camino
read-only y verifica `SST` antes de habilitar cualquier comportamiento de
escritura.
