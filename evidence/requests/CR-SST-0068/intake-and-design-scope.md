# CR-SST-0068 Alcance De Intake Y Diseno

## Decision

CR-SST-0068 es un request de diseno para el primer runtime administrativo de observabilidad ARDS/SDD del sistema. No implementa el runtime completo y no autoriza escrituras automaticas en repositorios hijos.

## Alcance

La primera fase cubre la solucion completa `sst` desde `solutions/sst.yaml`:

- Core: `sst-fend`, `sst-bend`
- Shared: `4uentes-auth`
- Optional: `sst-extension`, `sst-chatbot`
- Infrastructure: `sst-4uentes-infra`

Los participantes optional e infrastructure quedan incluidos en la visibilidad, pero su estado debe ponderarse por severidad. No deben bloquear el estado core de SST salvo que expongan un conflicto explicito de contrato.

## Limite De Runtime

El runtime operativo es solo lectura. Observa bindings locales, registros de catalogo, membresia de solucion, evidencia existente de sync de hijos y estado de archivos de repositorios hijos cuando una implementacion futura aprobada agregue los comandos de lectura.

Este request no permite cambiar repositorios hijos. Este request no autoriza cambios en `4uentes-ards-core`.

## Salida De Primera Fase

La primera fase de implementacion deberia producir:

- Estado de sync ARDS/SDD por repositorio.
- Estado de la solucion `sst` agrupado por servicios core, shared, optional e infrastructure.
- Estado global agregado para la vista local del control-plane.
- Artefactos de read model en YAML y JSON.
- Dashboard administrativo HTML estatico local.

## Semantica De Refresh

"Tiempo real" en esta fase significa refresh on-demand por comando explicito. Watchers, polling, daemons en background y despliegue productivo del admin quedan fuera de alcance.

## Clasificacion De Tarea

Segun `docs/ai/model-selection-policy.md`, este request se clasifica como `complex-high-risk-task` porque define un limite de contrato/read-model cross-repo atravesando auth, frontend, backend, agent, extension e infrastructure.

La politica requiere subagentes para la ejecucion planificada posterior. Si el runtime no puede crear subagentes o si el operador no los autorizo explicitamente, el fallback es ejecucion secuencial por el agente principal, dejando registrados los mismos roles de revision en evidencia.
