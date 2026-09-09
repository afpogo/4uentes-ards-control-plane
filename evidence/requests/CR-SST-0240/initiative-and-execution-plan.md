# Onboarding evolutivo: decisión e inicio de coordinación

Fecha: 2026-09-08. Owner: `4uentes-orchestor`. Rol primario: plan de
coordinación. Estado: aprobado para documentación y espejo operativo.
Fuentes: request inbox/planned de CR-SST-0240, INIT-SST-0011 y
[recomendación revisada](../CR-SST-0238/evolutionary-onboarding-recommendation-2026-09-07.md).
No requiere runbook runtime en este lote: no hay ejecución funcional autorizada.

La iniciativa es independiente de QA, memoria y autenticación. El usuario
aprobó el plan de onboarding V1: hub `/onboard` protegido y reanudable,
entrada automática para registros nuevos, invitación reabrible en Home para
usuarios existentes sin estado y activación por un resultado real asociado a
un único objetivo elegido. Visitar una ruta no completa el onboarding.

Bend mantiene estado durable/versionado y resultados verificados; Auth sólo
expone el relay BFF. Articles es el primer objetivo verificable. Learning y
Chat esperan readiness publicada. Chatbot ofrece L1 opcional de sólo lectura.
La guía usa temperatura `0.3` si el adaptador lo admite; una degradación debe
quedar documentada, sin simular soporte ni atribuirle garantías de seguridad.

## Preflight y publicación de precondiciones

No se observaron INIT-SST-0011 ni CR-SST-0240 en main, refs locales/remotas,
requests/iniciativas de worktrees ni PRs. JQL devolvió listas vacías completas
para ambos IDs. La búsqueda se completó antes de crear estos artefactos.
Los checkouts previos se preservaron.

El [PR #283](https://github.com/afpogo/4uentes-ards-control-plane/pull/283)
integró las precondiciones en `619fbaa` y se verificó por `git fetch` y
lectura de los archivos de `origin/main`.
`CR-SST-0238` conserva navegación/React; Compose fue renumerado a
`CR-SST-0241` porque `CR-SST-0239` ya identifica retención en el PR #282.
La [evidencia de reconciliación](../CR-SST-0241/identity-reconciliation-2026-09-08.md)
explica la precedencia aplicada. El nuevo worktree nace de ese merge.

## Orden y límites

1. Publicar inbox/planned, iniciativa y feature planificada; check completo y readback.
2. Materializar contrato V1, mapa derivado y matriz de capabilities.
3. Publicar el coordinador `running`, manteniendo la feature `planned` hasta implementar owners.
4. Crear Epic y Tarea Jira, mover ambas a En curso y leer tipo, padre, estado y comentarios.
5. Derivar posteriormente CRs de Bend, Auth, Fend y QA tras nuevo preflight, sin reservar IDs ahora.

El trabajo preparatorio no exige cerrar los fixes previamente; habilitar la
entrada requiere CR-SST-0238 y aceptar QA Compose requiere CR-SST-0241.
Los repos owner conservarán sus specs, docs, capabilities y pruebas mediante
sus propios CRs. Core sigue siendo autoridad ARDS/SDD; no se modifica.

## Lote Jira autorizado

Provider Jira, proyecto SST, request CR-SST-0240. Ventana: esta ejecución,
desde el readback canónico de `running` hasta completar el readback del lote.
Candidatos exactos:

- Epic `[SST][INIT-SST-0011] Evolutionary onboarding and first-value activation`, sin padre.
- Tarea `[SST][INIT-SST-0011][CR-SST-0240] Define and coordinate evolutionary onboarding V1`, bajo esa Epic.

Operaciones: preflight JQL/metadata; crear cada candidato una sola vez;
completar descripción; transición a En curso; comentario inicial y comentario
de avance cronológico en cada issue; readback final. Registrar las claves
devueltas antes de cualquier operación posterior. Ante timeout de creación,
reconciliar con JQL antes de reintentar. No asignar, cambiar prioridad, borrar,
cerrar ni reparentar issues existentes. Jira es espejo; ARDS/SDD es autoridad.

## Validación y continuidad

El gate completo de precondiciones pasó. Cada publicación siguiente requiere
`npm.cmd run check`, incluyendo owner docs y mapas. Las pruebas runtime,
HTTP/browser, privacidad, accesibilidad y rollout pertenecen a los slices
posteriores; este lote sólo valida coordinación y contrato.
TODO: registrar merge del plan, del inicio y claves/readback Jira.
