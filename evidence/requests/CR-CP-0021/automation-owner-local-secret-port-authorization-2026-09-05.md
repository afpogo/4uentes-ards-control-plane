# Autorización B4: secretos y puertos locales de Automation

Fecha: 2026-09-05. Request: `CR-CP-0021`. Owner:
`afpogo/4uentes-automation`.

## Objetivo autorizado

La aprobación del owner permite crear un playbook reproducible y fail-closed
para generar cuatro secretos locales mediante un CSPRNG, almacenarlos como
archivos ignorados por Git y consumirlos con secretos de Docker Compose. El
mismo slice parametriza en loopback los puertos host de n8n y pgAdmin.

La aprobación textual fue: «ok avancemos con la recomendacion, necesito el
playbook para generar los secretos».

Este gate autoriza implementar y validar la herramienta, pero no ejecutarla
contra la ubicación persistente `.secrets`. Las pruebas sólo pueden usar datos
sintéticos efímeros en un directorio temporal aislado.

## Contrato del playbook

El comando owner `scripts/bootstrap-local-secrets.ps1` debe:

- generar `n8n_encryption_key`, `postgres_password`,
  `pgadmin_default_password` y `productivity_db_password` con un generador
  criptográficamente seguro;
- no imprimir valores, ni siquiera en modo diagnóstico;
- comprobar todos los destinos antes de escribir y abortar si alguno existe;
- escribir sin salto de línea final y restringir permisos al usuario local;
- limpiar sólo artefactos creados por la corrida si ocurre un error;
- aceptar un directorio alternativo para pruebas aisladas;
- separar una vista previa sin mutación de la generación efectiva.

Los archivos no son secretos de GitHub Actions ni de ngrok. Son material local
de desarrollo que Docker Compose monta sólo en los servicios declarados. Una
promoción futura a Kubernetes tendrá otro mecanismo de custodia y otro gate.

## Consumo y límites

PostgreSQL consume `POSTGRES_PASSWORD_FILE`; n8n consume la contraseña de base
mediante `DB_POSTGRESDB_PASSWORD_FILE`. Como n8n no documenta
`N8N_ENCRYPTION_KEY_FILE`, un adaptador owner controlado lee exclusivamente ese
archivo dentro del contenedor, exporta la variable requerida al proceso y
delega al entrypoint oficial.

`PRODUCTIVITY_DB_PASSWORD` se genera para el contrato local futuro, pero no se
inyecta a un servicio sin consumidor owner vigente. `N8N_SMTP_PASS` queda fuera
de alcance y no debe leerse, copiarse ni rotarse.

Los bindings host quedan parametrizados como `N8N_HOST_PORT` con default `5678`
y `N8N_PGADMIN_HOST_PORT` con default `5050`. Ambos continúan limitados a
`127.0.0.1`.

## Superficie exacta

Sólo se autorizan estos paths owner:

- `.gitignore`;
- `.env.example`;
- `docker-compose.yml`;
- `scripts/bootstrap-local-secrets.ps1`;
- `scripts/n8n-secret-entrypoint.sh`;
- `scripts/check.ps1`;
- `specs/system/local-stack.yaml`;
- `docs/operations/local-stack.md`;
- `docs/tasks/2026-09-05-cr-cp-0021-local-secrets-and-ports.md`.

## Validación autorizada

Se permite revisar archivos públicos del owner, ejecutar el bootstrap contra un
directorio temporal, validar la negativa a sobrescribir, ejecutar
`docker compose config` con configuración y secretos sintéticos, ejecutar el
check owner si su contenido inspeccionado sigue siendo estático y realizar
revisiones Git y de patrones sensibles.

No se permite abrir `.env`, `.secrets`, exports de workflows, identificadores
de credenciales o directorios persistentes; tampoco iniciar contenedores,
conectar bases, modificar runtime, escribir Jira o mutar Kubernetes, GitOps o
infraestructura.

## Secuencia y rollback

1. Publicar y releer este gate desde `origin/main`.
2. Crear un worktree owner limpio desde `origin/main` refrescado.
3. Implementar únicamente la superficie exacta.
4. Validar sólo con material sintético temporal y conservar resultados sin
   valores secretos.
5. Publicar y releer el cambio owner.

Antes del merge owner, el rollback consiste en descartar la rama aislada. El
playbook no sobreescribe archivos, por lo que una corrida persistente futura se
revierte eliminando exclusivamente los cuatro archivos recién creados, tras
verificar su path absoluto y antes de cualquier arranque. Esa corrida requiere
una autorización posterior.
