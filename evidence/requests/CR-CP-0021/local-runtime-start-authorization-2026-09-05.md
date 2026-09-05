# Gate de arranque local base de Automation

Fecha: 2026-09-05. Request: `CR-CP-0021`. Aprobación textual: «ok avancemos
con el proximo gate; continuemos».

## Objetivo y límite

Iniciar y validar únicamente el Compose base del owner desde el checkout raíz
estable en `main`: `postgres`, `n8n` y `pgadmin`. El contrato ya validado fija
n8n y pgAdmin a loopback y no publica PostgreSQL. El override
`docker-compose.tunnel.yml` no participa.

No autoriza leer o modificar workflows, ejecuciones, filas de bases, secretos,
SMTP, productividad, capacidades, M2M, Jira, Kubernetes, GitOps ni
infraestructura.

## Playbook operativo

1. Confirmar checkout estable limpio, Docker accesible y puertos de loopback
   disponibles; detener antes de iniciar si alguna condición falla.
2. Ejecutar únicamente `docker compose up -d` desde el root owner.
3. Consultar `docker compose ps` y ejecutar `scripts/check.ps1 -Runtime`.
4. Si una comprobación falla, capturar como máximo logs sanitizados de los
   servicios afectados. Si este gate inició un stack fallido, ejecutar
   `docker compose down` sin `-v`; no borrar bind mounts ni volúmenes.
5. Registrar estados, checks, SHA y disposición. Nunca incluir valores o
   payloads en Evidence.

## Criterio de cierre

Los tres servicios deben estar en estado esperado, PostgreSQL saludable y las
dos comprobaciones HTTP de loopback deben responder. El resultado no habilita
un túnel ni ninguna operación funcional posterior.
