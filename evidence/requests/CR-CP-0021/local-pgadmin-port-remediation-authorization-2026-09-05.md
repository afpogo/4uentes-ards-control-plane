# Gate local de remediación del puerto pgAdmin de Automation

Fecha: 2026-09-05. Request: `CR-CP-0021`. Rol primario: playbook decisional
compuesto con runbook operativo. Owner: `4uentes-ards-control-plane`.
Autoridad técnica: `afpogo/4uentes-automation@5c2a24eeaaf957de1728ea601da668f78d19f63f`,
`docker-compose.yml`, `specs/system/local-stack.yaml` y
`docs/operations/local-stack.md`.

Aprobación: «ok, no, mejor hagamos por ahora para no mezclar, que este pgadmin
de n8n lo maneje en otro puerto 5060».

## Decisión

Mantener las dos instancias actuales aisladas. SST conserva su pgAdmin en
`5050`; el pgAdmin local de Automation se publica únicamente en
`127.0.0.1:5060`. No se modifica Compose versionado: el contrato vigente ya
parametriza el binding mediante `N8N_PGADMIN_HOST_PORT`.

## Runbook

1. Verificar que `5060` no tenga listener ni dueño Docker.
2. Confirmar que `.env` tenga exactamente una clave
   `N8N_PGADMIN_HOST_PORT` con valor previo `5050`.
3. Crear en el mismo directorio un candidato temporal, cambiar sólo esa línea y
   sustituir `.env` atómicamente, sin backup plaintext.
4. Comprobar mediante huellas internas que ninguna otra línea cambió; no
   imprimir valores del archivo.
5. Ejecutar `scripts/check.ps1 -LocalStackOnly`.
6. Ejecutar únicamente `docker compose up -d`, consultar estados y ejecutar
   `scripts/check.ps1 -Runtime`.

Detener si la clave falta o está duplicada, el valor previo no es `5050`, el
puerto deja de estar libre, cambia otra línea o falla una validación. Si falla
la sustitución, restaurar atómicamente el puerto previo. Si falla el runtime,
ejecutar `docker compose down` sin `-v`. Nunca borrar datos, `.env` o
`.secrets`.

## Evidencia esperada

Registrar únicamente estados, puertos no sensibles, checks, SHAs y rollback.
No registrar contenido de `.env`, secretos, workflows ni filas de bases.
