# Model and Subagent Selection Policy

## Proposito

Este anexo operativo complementa el ARDS/SDD existente del control-plane. No
redefine perfiles, specs, playbooks, working agreements ni decisiones vigentes.

Su objetivo es que los agentes puedan elegir modelo o subagente segun el tipo
de tarea sin que el usuario tenga que repetir esta politica en cada prompt.

## Clasificacion previa

Antes de planificar o ejecutar una tarea, el agente debe clasificarla como una
de estas categorias:

- `short-defined-task`
- `long-context-task`
- `complex-high-risk-task`

La clasificacion no reemplaza el criterio del usuario durante procesos de
descubrimiento funcional, tecnico o documental. El agente debe adaptarse al
flujo que marque el usuario y no intentar cerrar, rigidizar o redisenar el
proceso por su cuenta.

## Analisis de peso de tarea

La clasificacion debe surgir de un analisis explicito del peso de la feature,
bugfix o investigacion. Para requests del control-plane, ese analisis debe
quedar registrado en `requests/planned/*.yaml`.

El analisis minimo debe considerar:

- cantidad de servicios o repos afectados
- cantidad de capas, modulos o dominios atravesados
- impacto sobre seguridad, autenticacion, autorizacion, datos o contratos
- incertidumbre documental o tecnica
- estado del working tree observado
- criticidad de validaciones requeridas
- riesgo de drift cross-repo

La salida esperada es:

- `task_weight.classification`
- `task_weight.risk_level`
- `task_weight.drivers`
- `model_selection.primary_profile`
- `subagent_deployment_plan.required`
- `subagent_deployment_plan.roles`
- `subagent_deployment_plan.fallback`

## Politica de seleccion

### `short-defined-task`

Usar el perfil/modelo:

- `gpt-5.3-spark`

Aplica para:

- cambios pequenos
- correcciones simples
- ajustes de nombres
- mensajes de commit o PR
- refactors menores
- documentacion menor
- tareas mecanicas o repetitivas
- implementaciones puntuales con instrucciones claras

Deployment esperado:

- `subagent_deployment_plan.required: false`
- el agente principal puede ejecutar localmente
- usar subagente solo si el usuario lo pide o si hay una tarea paralela
  claramente independiente

### `long-context-task`

Usar subagentes con el perfil/modelo:

- `gpt-5.4-fast-high`

Aplica para:

- analisis de multiples archivos
- lectura de documentacion existente
- revision de arquitectura
- relevamiento de estado observable del repo
- preparacion de planes de implementacion
- validacion contra ARDS/SDD
- cambios que atraviesan varias capas, modulos o dominios

Deployment esperado:

- `subagent_deployment_plan.required: true` cuando existan subtareas
  paralelizables
- roles sugeridos:
  - `repo-context-explorer`
  - `ards-sdd-validator`
  - `implementation-planner`
- si no hay herramienta de subagentes disponible, registrar fallback y ejecutar
  de forma secuencial con el mismo perfil de razonamiento

### `complex-high-risk-task`

Usar subagentes con el perfil/modelo:

- `gpt-5.5`

Aplica para:

- decisiones arquitectonicas
- seguridad
- autenticacion
- autorizacion
- RBAC
- datos sensibles
- contratos API
- contratos cross-repo
- debugging complejo
- incidentes
- migraciones criticas
- decisiones con trade-offs tecnicos relevantes

Deployment esperado:

- `subagent_deployment_plan.required: true`
- usar subagentes para separar analisis de arquitectura, seguridad, contratos,
  validacion o repos afectados cuando el runtime lo permita
- roles sugeridos:
  - `architecture-reviewer`
  - `security-contract-reviewer`
  - `cross-repo-impact-reviewer`
  - `validation-reviewer`
- si no hay herramienta de subagentes disponible, registrar fallback explicito y
  mantener el perfil de mayor razonamiento en el agente principal

## Reglas operativas

- No basta con nombrar la categoria; en trabajo planificado debe quedar
  documentado si se desplegaran subagentes, con que roles y con que fallback.
- No asumir que el ARDS/SDD esta incompleto solo porque se agrega este anexo.
- No redisenar la estructura documental salvo pedido explicito del usuario.
- No crear carpetas top-level nuevas para aplicar esta politica.
- No modificar codigo funcional por efecto de esta politica.
- No duplicar reglas existentes; si existe una regla similar, extenderla en vez
  de reemplazarla.
- Integrar referencias a este anexo solo donde ayuden a descubrimiento y
  navegacion.
- Si hay duda entre perfiles, elegir el modelo de mayor razonamiento cuando el
  riesgo tecnico sea alto.
- Tratar los nombres de modelos como aliases o configuracion del entorno. Si el
  runtime no reconoce un alias exacto, usar el perfil disponible mas cercano sin
  bloquear la ejecucion.
- Si el usuario pide no usar subagentes, registrar la excepcion en el plan y
  continuar con el perfil/modelo correspondiente en el agente principal.

## Boundary con ARDS/SDD

Esta politica decide como ejecutar trabajo agentico; no autoriza cambios que el
ARDS/SDD vigente no permita. Para trabajo cross-repo, requests, handoffs,
capabilities, specs y validaciones siguen gobernados por los documentos
existentes del repo.
