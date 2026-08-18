# Validación operativa histórica de INIT-SST-0007

> Resumen sanitizado de la ejecución del 2026-08-10. No constituye un readback
> actual y debe leerse junto con
> `canonical-reconciliation-2026-08-18.md`.

## Alcance observado

La ejecución local/dev conectó cuatro owners en worktrees aislados:

- `4uentes-auth` emitió identidad de usuario y credenciales M2M acotadas;
- `sst-bend` mantuvo la conversación canónica y el boundary Socket.IO;
- `sst-chatbot` procesó turnos mediante HTTP NDJSON interno;
- `sst-fend` consumió el realtime protegido.

El recorrido sintético cubrió login, creación de conversación, aceptación del
mensaje, deltas, finalización, persistencia, replay, receipt durable y
revocación secuencial. También se observó recuperación después de reiniciar los
procesos locales y un proveedor OpenAI-compatible simulado.

## Validaciones registradas entonces

- Checks owner de los cuatro repositorios: `PASS`.
- Pruebas de audiences/scopes M2M y rechazo negativo: `PASS`.
- Persist-before-emit, idempotencia y replay local: `PASS`.
- Error parcial de streaming sin volcar credenciales: `PASS`.
- Reconnect/logout del frontend en el escenario secuencial: `PASS`.

No se publican URLs privadas, credenciales, tokens, cookies, identificadores de
ejecución ni payloads de usuario en este resumen canónico.

## Calificación posterior

La prueba de sesión fue funcional y secuencial; no demostró atomicidad ante
refresh concurrente ni precedencia de logout. Esas garantías quedaron bajo el
contrato vigente de `CR-SST-0180`. Tampoco demuestra que un deployment de
cluster siga activo ni que exista wiring GitOps persistente.

## Residuales históricos

- Proveedor externo real y custodia productiva de secretos: fuera de alcance.
- Escalado multi-instancia: fuera de alcance.
- Deployment persistente de development: abierto en `CR-SST-0178`.
- Estado actual de los repos owner: no revalidado en el gate documental del
  2026-08-18.
