# Modelo De Ejecucion

## Del Catalogo Al Request

El control-plane parte del catalogo estable y de los mapas de soluciones. Un
request futuro registra un cambio deseado y nombra la solucion o los servicios
iniciales.

Los artefactos de request y response deben mantenerse separados:

- el input de request vive en `requests/inbox/`
- la response del planner vive en `requests/planned/`
- el estado de ejecucion vive en `requests/queued/`, `requests/running/`,
  `requests/done/`, `requests/rejected/`
- la evidencia vive en `evidence/requests/<request-id>/`

La regla general de secciones documentales esta definida en:

- [documentation-information-architecture.md](../documentation-information-architecture.md)

## Request Lifecycle

La Fase 2 introduce el request lifecycle:

```text
inbox -> planned -> queued -> running -> done
                         `-> rejected
```

- `inbox`: request recibido pero no expandido.
- `planned`: impacto calculado por el planner.
- `queued`: aprobado para ejecucion posterior.
- `running`: ejecucion en curso.
- `done`: completado con evidencia.
- `rejected`: no aceptado para ejecucion.

`planned` no significa aprobado. Significa que el control-plane calculo
impacto, contexto requerido, checks requeridos y riesgo inicial.

`planned` es una response del orchestrator, no la ejecucion en si.

## Regla Orchestrator-First

Para trabajo cross-repo, el orden operativo esperado es:

1. crear o actualizar el request en `requests/inbox/`
2. generar la response planificada en `requests/planned/`
3. aprobar o mover la ejecucion a `queued`/`running` segun corresponda
4. ejecutar cambios en repos hijos solo si el request lo habilita
5. cerrar en `requests/done/` con evidencia en `evidence/requests/<request-id>/`

Si por flujo de descubrimiento o urgencia se hicieron cambios en repos hijos
antes de registrar el lifecycle, el control-plane debe crear una normalizacion
retroactiva. Esa normalizacion no debe ocultar el desvio: debe declarar que la
evidencia fue registrada despues de la ejecucion y debe dejar trazabilidad de
servicios afectados, validaciones y riesgos residuales.

## Regla experimental de publicación y cierre

Los requests que adopten explícitamente
`execution-publication-and-tracker-closure-rule` también deben publicar y
releer el plan, la implementación aplicable, el mirror del tracker o su
no-aplicabilidad, y el cierre terminal antes del cleanup.

El contrato completo y su semántica de cierre finito están en
[execution-publication-rule.md](execution-publication-rule.md). Durante
`CR-CP-0022` esta regla es un trial local y no una policy canónica.

## Deteccion De Impacto

El analisis de impacto lee:

- `catalog/services/*.yaml`
- `solutions/*.yaml`
- local bindings cuando estan disponibles
- artefactos ARDS locales cuando un request esta aprobado para inspeccion

La salida debe listar servicios afectados, ARDS kinds, contexto local requerido,
riesgos y checks requeridos.

## Peso De Tarea Y Subagentes

Cada response en `requests/planned/*.yaml` debe incluir una evaluacion de peso
de tarea y un plan de deployment agentico:

- `task_weight`: clasificacion, nivel de riesgo y drivers
- `model_selection`: perfil primario elegido y referencia a la politica
- `subagent_deployment_plan`: si se requieren subagentes, roles esperados y
  fallback si el runtime no los puede crear

La politica fuente vive en:

- [docs/ai/model-selection-policy.md](../ai/model-selection-policy.md)

Regla operativa:

- `short-defined-task`: subagentes opcionales, normalmente no requeridos
- `long-context-task`: subagentes requeridos si hay subtareas paralelizables
- `complex-high-risk-task`: subagentes requeridos salvo excepcion explicita del
  usuario o falta de soporte del runtime

Si se usan subagentes, la evidencia debe registrar que roles se desplegaron y
que resultado aporto cada uno. Si no se usan aunque el plan los recomiende, la
evidencia debe registrar el fallback.

## Planner

`scripts/plan-change.js` lee un request desde `requests/inbox/`, valida la
solucion y los servicios declarados, expande los servicios afectados desde
`solutions/*.yaml` y escribe una copia planificada en `requests/planned/`.

El planner:

- lee `catalog/services/*.yaml`;
- lee `solutions/*.yaml`;
- resuelve `ards.kind` por servicio afectado;
- agrega `required_context`;
- agrega `required_checks`;
- clasifica riesgo;
- calcula `task_weight`, `model_selection` y `subagent_deployment_plan`;
- nunca modifica repos funcionales;
- nunca ejecuta checks de repos funcionales.

## Validacion

La validacion empieza con:

```bash
npm run check
```

Esto verifica el catalogo del control-plane y los local bindings opcionales. Los
checks de repos funcionales no se ejecutan en Fase 1B ni desde el planner de
Fase 2.

## Evidencia

El estado observado pertenece a `inventory/` o a carpetas futuras de
`evidence/`. La evidencia puede incluir salida de comandos, resumenes de
archivos cambiados, resumenes de servicios afectados y resultados de validacion.

La evidencia no debe convertirse en configuracion estable salvo que una fase
posterior la promueva explicitamente.
