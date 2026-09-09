# Revisión del contrato e inicio controlado

Fecha: 2026-09-08. Owner: control plane. Rol: evidencia de revisión.
El PR #284 integró inbox/planned y feature en `origin/main@d2a892b`;
se verificó el request canónico mediante fetch y lectura.

El contrato `onboarding-v1-contract.yaml` y el documento
`docs/projects/sst/onboarding-evolutivo-v1.md` materializan el alcance aprobado.
Se contrastaron entrada nueva/existente, transiciones, estado durable,
API y relay, resultados verificados, privacidad, readiness y rollback.
La activación V1 concreta el resultado Articles como guardado exitoso;
su binding exacto al recurso owner queda como TODO bloqueante del slice Bend.

Casos revisados: visita sin resultado no completa; resultado ajeno o fallido
se rechaza; replay devuelve el recibo original; mismo key con payload distinto
se rechaza; revisión vieja exige refetch; reapertura conserva historia y
requiere un resultado nuevo; flag/API no disponibles llevan a Home.
Esta revisión es documental, no ejecución de pruebas HTTP/browser.

El planned publicado pasó el check completo. La primera validación detectó
que el enforcement de publicación exige un estado de ejecución además de
planned. Se registró el compromiso en planned y se activa ahora el marker
en planned y running, sin debilitar el validador ni anticipar ejecución.

La iniciativa pasa a active y el coordinador a running. La feature permanece
planned. Owners, runtime y Jira todavía no fueron modificados.
El check del contrato/running pasó: 49 documentos, 63 mapas, 0 FAIL.
El PR #285 se integró en `bc558e3` y se leyó running desde `origin/main`.
El resultado posterior de Jira está en `jira-and-canonical-readback.md`.
