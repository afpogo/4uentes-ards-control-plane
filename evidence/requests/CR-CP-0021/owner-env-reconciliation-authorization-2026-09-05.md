# Gate de reconciliación secret-safe de `.env`

Fecha: 2026-09-05. Request: `CR-CP-0021`. Rol primario: playbook decisional
con runbook owner requerido. Aprobación: «ok avancemos con el plan original».

## Objetivo

Convertir el `.env` estable de Automation al contrato file-backed ya fusionado,
sin mostrar valores y sin iniciar contenedores. La herramienta reproducible se
implementa primero en un worktree limpio, se valida con fixtures sintéticos, se
fusiona a `main`, se relee y sólo entonces se ejecuta desde el checkout raíz.

## Decisión de migración

La herramienta elimina de `.env` las claves `N8N_ENCRYPTION_KEY`,
`POSTGRES_PASSWORD` y `PGADMIN_DEFAULT_PASSWORD`, porque sus valores ya tienen
custodia en `.secrets`. Conserva sin imprimir todas las demás claves, incluido
el password legacy de productividad y la configuración SMTP.

Debe asegurar `LOCAL_SECRETS_DIR=.secrets`, `N8N_HOST_PORT=5678` y
`N8N_PGADMIN_HOST_PORT=5050`. Antes de reemplazar el archivo exige valores no
vacíos para `POSTGRES_USER`, `POSTGRES_DB` y `PGADMIN_DEFAULT_EMAIL`.

## Runbook y stop conditions

1. Crear un worktree owner desde `origin/main` refrescado.
2. Implementar únicamente los cuatro paths versionados autorizados.
3. Probar plan, migración, idempotencia y negativa con fixtures temporales.
4. Fusionar y releer el PR owner; retirar el worktree limpio.
5. Ejecutar el script fusionado sobre `.env` mediante reemplazo atómico.
6. Validar nombres, ausencia de las tres claves retiradas, presencia de defaults
   y requisitos no vacíos sin imprimir valores.
7. Ejecutar `scripts/check.ps1 -LocalStackOnly` y `docker compose config`.

Detener antes de reemplazar si falta un identificador, existe una clave
duplicada, no están los cuatro archivos `.secrets`, el root no está limpio o el
Compose config falla con un fixture sintético. No crear backup plaintext ni
arrancar runtime.

## Evidencia esperada

Registrar sólo estados, claves afectadas, SHAs, checks y disposición del
worktree. Los valores de `.env` y `.secrets` no forman parte de Evidence.
