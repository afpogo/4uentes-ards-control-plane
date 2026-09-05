# Plan De Promoción De La Policy De Conocimiento A Ejecución

Fecha: 2026-09-05. Request: `CR-CP-0028`.

## Resultado Buscado

Entregar a `4uentes-ards-core` un contrato owner-ready para evaluar y publicar
`knowledge-to-execution-documentation-policy` como `core-profile-scoped`.

El control plane conserva la procedencia y propone el contrato. Core conserva
la decisión final, la implementación del canon y su publicación. Hasta que ese
readback exista, la policy local continúa siendo `origin-repo-policy`.

## Traducción Del Patrón A Contrato Compartido

La expresión `Aprendizaje → Playbook → Runbook → Specs/manifests` es útil como
ruta de navegación, pero no debe promoverse como cronología universal ni como
cadena de autoridad. El contrato compartido debe usar relaciones tipadas:

- Learning explica propósito, contexto y conceptos; `informs` al Playbook.
- Playbook compara opciones y recomienda o selecciona una decisión; no autoriza
  por sí solo una mutación.
- Una decisión, request y gates aplicables autorizan la ejecución.
- Runbook operacionaliza la intención autorizada; no redefine el contrato.
- Specs/manifests activos del owner restringen guidance y ejecución dentro de
  su scope; no necesitan ser el último artefacto creado cronológicamente.
- Evidencia valida resultados y retroalimenta conocimiento sólo mediante un
  lifecycle gobernado por el owner.

La promoción debe conservar tres separaciones:

1. explicación no equivale a autoridad técnica;
2. instrucciones ejecutables no equivalen a autorización;
3. evidencia observada no modifica silenciosamente specs ni guidance.

## Clasificación

`core-profile-scoped` es la clase correcta porque la policy aplica a perfiles
que producen guidance humano conectado con autoridad técnica. No se impone a
todo repo de Core como `core-general`.

No se usa overlay: no existe un delta contextual sobre una policy base. Se
promueve un contrato durable completo. El diseño futuro de overlays bajo
`CR-CP-0025` no tiene kind, schema ni resolver activos que este request deba
anticipar.

## Paquete Del Control Plane

Después del merge y readback de este plan se crearán:

- un capability outbound específico en estado `draft`;
- su registro en el índice outbound;
- vínculos derivados desde `state/policy-links.yaml`;
- actualización del feature state con `CR-CP-0028` y la evidencia del handoff.

El handoff incluirá policy ID, clase, perfiles, relaciones tipadas, boundaries,
fuentes, artefactos Core esperados y criterios de aceptación. No incluirá paths
locales absolutos, Jira keys, detalles del proveedor ni adopciones implícitas.

## Boundary De Core

Este workflow no toca `4uentes-ards-core`. El siguiente workflow debe situarse
en Core, releer sus instrucciones owner, refrescar `origin/develop`, comprobar
identidad y trabajo concurrente, crear un worktree limpio y validar con el gate
completo de Core.

La publicación en Core deberá tener readback de PR, merge commit, archivos
canónicos y checks. Sólo entonces el control plane podrá cambiar el owner/class
local a adopción desde Core y cerrar `CR-CP-0028`.

## Trabajo Concurrente Y Orden De Adopción

`CR-CP-0027` sigue siendo una adopción Infra separada. No forma parte de este
diff ni debe fusionarse para facilitar la promoción.

Que Infra esté adelantada al canon compartido no transfiere autoridad a Infra:
su adopción conserva la fuente local versionada y su manifest. Una futura
publicación Core requiere reconciliación explícita; no prueba adopción
retroactiva ni autoriza reemplazo silencioso.

## Gates

1. Publicar y releer plan + running.
2. Materializar handoff + vínculos derivados.
3. Ejecutar `npm.cmd run check`, `git diff --check` y revisión exacta.
4. Publicar y releer el handoff en `main`.
5. Retirar el worktree limpio después de probar integración.
6. Continuar sólo desde un workflow owner de Core.

## Degradación Registrada

Los subagentes solicitados no produjeron resultados utilizables por
incompatibilidad del modelo heredado y luego límite de cuenta. La revisión se
degradó a ejecución secuencial del agente principal conforme a las policies
locales; no se transfirió autoridad y no se inventó output paralelo.

El runtime tampoco permite fijar temperatura, por lo que `0.5` se registra como
solicitado y no como aplicado.
