# Autorización de generación persistente de secretos locales

Fecha: 2026-09-05. Request: `CR-CP-0021`. Aprobación textual: «ok
avancemos».

## Decisión de ubicación

El checkout raíz de `4uentes-automation` está limpio, pero su branch
`docs/1-trunk-based-agent-flow` diverge de `origin/main` uno a uno. No se
autoriza cambiar, fusionar o reescribir ese checkout para esta corrida.

Los secretos se crearán en `.secrets` dentro del worktree owner
`cr-cp-0021-local-secrets-ports`, que contiene el Compose y playbook ya
fusionados y validados. Ese worktree queda retenido: no puede retirarse mientras
sea la única ubicación de custodia.

## Corrida autorizada

Se autoriza ejecutar primero `-Mode Plan` y luego una única corrida
`-Mode Generate`. Los targets exclusivos son:

- `.secrets/n8n_encryption_key`;
- `.secrets/postgres_password`;
- `.secrets/pgadmin_default_password`;
- `.secrets/productivity_db_password`.

La verificación posterior se limita a presencia, longitud, ACL y confirmación
de que Git ignora los archivos. No puede leer ni imprimir contenido, calcular o
publicar fingerprints, abrir `.env`, arrancar Docker o inspeccionar datos y
workflows.

## Fallo y rollback

El preflight debe confirmar que los cuatro targets están ausentes. Si la
corrida falla, el propio playbook puede retirar solamente los archivos creados
por esa corrida. Si tiene éxito, no se autoriza eliminación automática: borrar,
copiar, respaldar, trasladar o rotar los secretos requiere un nuevo gate y una
verificación explícita del path absoluto.

## Límites posteriores

Esta autorización no habilita runtime, migración del password de productividad,
Kubernetes, GitHub Actions, ngrok, Jira, capabilities, M2M ni infraestructura.
