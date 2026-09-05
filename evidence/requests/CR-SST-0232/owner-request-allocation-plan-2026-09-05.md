# Plan de adopcion owner para fuentes de Learning Workspace V1

- Rol primario: playbook de asignacion y gates.
- Owner: `4uentes-orchestor`.
- Estado: preparado localmente; publicacion canonica pendiente.
- Alcance: reservar y ordenar lifecycles owner-scoped; no ejecutar cambios funcionales.
- Autoridad tecnica: contrato `sst-learning-workspace-source-v1@1.0.0` y lifecycles YAML vinculados.
- Runbook: no es necesario para este gate documental. Cada owner debera publicar uno antes de su futura ejecucion.

## Resultado del preflight

La revision de `origin/main@277d62f`, el arbol canonico de requests y las ramas remotas no encontro reservas para `CR-SST-0234` a `CR-SST-0237`. Los IDs quedan asignados localmente por este lote y solo seran canonicos despues de merge y readback. Jira no fue consultado ni modificado porque este gate no autoriza un mirror operativo.

| Request | Slice | Owner | Gate posterior |
|---|---|---|---|
| `CR-SST-0234` | Resolver autorizado y snapshots inmutables | `sst-bend` | Running Bend separado |
| `CR-SST-0235` | Relay versionado del contrato | `4uentes-auth` | Running BFF despues de Bend |
| `CR-SST-0236` | Inbox de fuentes y revision de snapshot en `/learning` | `sst-fend` | Running Fend despues del BFF |
| `CR-SST-0237` | Validacion integrada y aceptacion humana | `4uentes-orchestor` + owners | QA temporal explicito |

## Mapa de dependencias

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: '1.0'
  id: 'learning-source-owner-adoption-sequence'
  type: 'dependency'
  question: 'En que orden se adopta el contrato de fuentes de Learning Workspace V1?'
  abstraction_level: 'Lifecycles owner-scoped y gates de V1.'
  source_refs:
    - 'evidence/requests/CR-SST-0232/learning-workspace-source-contract-v1.yaml'
    - 'requests/running/CR-SST-0232-define-learning-workspace-source-contract.yaml'
    - 'requests/planned/CR-SST-0234-implement-learning-source-resolver-and-snapshots.yaml'
    - 'requests/planned/CR-SST-0235-adopt-learning-source-contract-in-bff.yaml'
    - 'requests/planned/CR-SST-0236-adopt-learning-source-inbox-user-experience.yaml'
    - 'requests/planned/CR-SST-0237-validate-learning-source-flow-end-to-end.yaml'
  request_ids: ['CR-SST-0232', 'CR-SST-0234', 'CR-SST-0235', 'CR-SST-0236', 'CR-SST-0237']
  observed_at: '2026-09-05'
  authority_boundary: 'Vista derivada; los YAML vinculados conservan autoridad y ningun nodo autoriza mutacion owner o runtime.'
  textual_fallback_required: true
```

```mermaid
flowchart LR
    C232[CR-SST-0232 contrato running]
    C234[CR-SST-0234 Bend planned]
    C235[CR-SST-0235 BFF planned]
    C236[CR-SST-0236 Fend planned]
    C237[CR-SST-0237 E2E planned]
    C232 -->|prerequisite| C234
    C234 -->|prerequisite| C235
    C235 -->|prerequisite| C236
    C236 -->|prerequisite| C237
```

### Fallback textual

```text
CR-SST-0232 define el contrato. CR-SST-0234 debe publicar primero el resolver y los snapshots de Bend. Luego CR-SST-0235 adopta el relay BFF en 4uentes-auth. Con ambos disponibles, CR-SST-0236 puede adoptar la experiencia Fend. Finalmente CR-SST-0237 valida el flujo completo. Cada flecha es una dependencia, no una autorizacion de ejecucion.
```

<!-- visual-map:end -->

## Reglas de adopcion

- Cada request comienza en `planned`; no se crea ningun estado `running` en este gate.
- Antes de mutar un repo hijo se requiere merge/readback de su plan y autorizacion exacta independiente.
- Cada owner debe publicar ARDS/SDD, decisiones, mapas aplicables y un runbook con precondiciones, checks, stop conditions y rollback.
- Los secretos se representan solo por referencias opacas permitidas por un contrato futuro; V1 no captura ni persiste valores secretos.
- Crear snapshots, preparar articulos, asignar tags y proponer memoria son acciones separadas y auditables.
- Jira, deployments, migraciones, datos y runtime quedan fuera de este lote.

## Proximo gate

Publicar y leer de vuelta este lote del control plane. Despues se podra solicitar un gate separado para promover solamente `CR-SST-0234` a `running`; `CR-SST-0235`, `CR-SST-0236` y `CR-SST-0237` seguirian bloqueados por sus predecesores.
