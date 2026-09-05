# Gate de rotación del password del rol PostgreSQL de n8n

Fecha: 2026-09-05. Request: `CR-CP-0021`. Rol primario: playbook decisional
compuesto con runbook operativo de alto riesgo. Owner:
`4uentes-ards-control-plane`. Autoridad técnica:
`afpogo/4uentes-automation@5c2a24eeaaf957de1728ea601da668f78d19f63f`,
`docker-compose.yml`, `specs/system/local-stack.yaml` y
`docs/operations/local-stack.md`.

Aprobación: «ok autorizo los pasos recomendados».

## Decisión y alcance

Rotar únicamente el password del rol PostgreSQL configurado para n8n al valor
ya custodiado en `.secrets/postgres_password`. La operación usa el socket Unix
interno del contenedor PostgreSQL y hace que el servidor lea directamente
`/run/secrets/postgres_password`.

El valor no se envía como argumento de proceso, no se devuelve al host y no se
registra. No se consultan schemas, tablas, filas, otros roles ni hashes.

## Runbook

1. Confirmar Automation detenido y ejecutar `scripts/check.ps1 -LocalStackOnly`.
2. Iniciar solamente `postgres` mediante Compose y esperar estado saludable.
3. Enviar por stdin una sentencia fija que construya y ejecute exactamente
   `ALTER ROLE` para `current_user`, con el password leído por PostgreSQL desde
   `/run/secrets/postgres_password`.
4. Suprimir la salida cruda y publicar sólo éxito o fallo.
5. Iniciar el Compose base completo, sin override de túnel.
6. Ejecutar `scripts/check.ps1 -Runtime` y registrar estados sanitizados.

## Stop conditions y compensación

Detener si PostgreSQL no está saludable, no puede leer el secreto montado o
falla la sentencia exacta. El password histórico no puede recuperarse desde
`postgres_data`, por lo que la rotación no es reversible a ese valor. La
compensación es mantener rol y secreto file-backed alineados.

Si falla una validación posterior, ejecutar `docker compose down` sin `-v` y
preservar datos, `.env`, `.secrets` y rollback. No inspeccionar ni modificar
contenido funcional de la base.

## Evidencia esperada

Registrar únicamente salud del servicio, resultado de la sentencia, readiness,
SHAs y disposición. No registrar valores, argumentos sensibles ni contenido de
base o workflows.
