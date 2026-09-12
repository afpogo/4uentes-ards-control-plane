# CR-SST-0225 — Autorización del lifecycle running y plan

Rol documental primario: evidencia de decisión. Owner:
`4uentes-ards-control-plane`. Estado: autorización consumida para preparación
local. Observado: 2026-09-12.

## Decisión humana

4uentes autorizó ampliar el alcance owner de `CR-SST-0225` para incluir
`4uentes-auth` exclusivamente en estos grants:

- `article-processing:execute`;
- `article-processing:read`;
- `article-processing:write`.

También autorizó crear, desde
`origin/main@6cf950d081ea6122bb83152c9f25479d5d8fe415`, el lifecycle `running` y
el plan de implementación de `sst-bend`, `sst-chatbot` y `4uentes-auth`.

## Límites de la autorización

Este gate permite modificar solamente el control plane. No permite:

- modificar, publicar o crear worktrees en repositorios hijos;
- escribir en Jira;
- cambiar runtime, datos, migraciones, infraestructura o despliegues;
- crear identidades o secretos;
- reutilizar o ampliar `chat:process`, `agent-handoff:submit`,
  `user-memory:recall` o `user-memory:propose`;
- publicar esta preparación local sin una autorización Git posterior.

La ejecución owner requerirá que el lifecycle y el plan sean fusionados y
leídos desde `main`, seguida de una autorización humana independiente y exacta.
