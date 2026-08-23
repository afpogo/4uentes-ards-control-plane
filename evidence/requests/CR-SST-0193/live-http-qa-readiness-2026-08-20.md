# CR-SST-0193 - Readiness De QA HTTP Live

Fecha: 2026-08-20.

## Estado Observado

- El proyecto Compose del worktree `CR-SST-0193-bend` no tiene servicios
  iniciados.
- El stack compartido de desarrollo sÃ­ tiene `sst-bend`, Postgres,
  `4uentes-auth`, `sst-fend` y `sst-chatbot` activos.
- `GET http://localhost:3005/4uentes/v1/user-memory/space` respondiÃ³ 404.
- `GET http://localhost:4090/api/user-memory/space` respondiÃ³ 404.
- No se proporcionÃ³ un access JWT con tenant, application y membership vÃ¡lidos
  para esta ejecuciÃ³n.

El 404 confirma que el runtime compartido todavÃ­a no sirve la superficie del
worktree con `USER_MEMORY_ENABLED=true`. No demuestra un fallo del contrato ni
de la implementaciÃ³n local.

## DecisiÃ³n De QA

No ejecutar todavÃ­a el QA manual positivo ni sustituir/reiniciar de forma
automÃ¡tica el stack compartido. Primero debe adoptarse el branch en un runtime
de prueba y habilitarse explÃ­citamente la feature.

## Precondiciones Para Ejecutarlo

1. Construir o iniciar `sst-bend` desde el commit de CR-SST-0193.
2. Aplicar la migration de memoria en la base del entorno objetivo.
3. Configurar `USER_MEMORY_ENABLED=true`.
4. Confirmar JWKS, issuer/audience y membership de cuenta.
5. Inyectar un JWT scoped sÃ³lo en memoria o en el cliente HTTP, nunca en Git ni
   en evidence.
6. Ejecutar `httpPruebas/sst.user-memory.http`.

El harness incluye ahora dos regresiones live esperadas en HTTP 400:

- intento de enviar `needsUserReview=false`;
- intento de enviar `status=accepted`.

La revisiÃ³n del 2026-08-21 agregÃ³ al harness:

- captura previa de un evento minimizado con referencia opaca;
- propuesta enlazada mediante `sourceEventIds` y `correlationId`;
- confianza y resumen de validaciÃ³n neutrales;
- rechazo HTTP 400 de metadata que intente incluir un prompt renderizado.

DespuÃ©s deben ejecutarse el happy path proposal -> review accept -> record y
los negativos cross-account. La evidencia debe registrar Ãºnicamente status
codes, IDs sanitizados y conteos; no JWT ni contenido personal real.
