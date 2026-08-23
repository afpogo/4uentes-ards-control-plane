# CR-SST-0193 - DecisiÃ³n Del Boundary De Consentimiento

Fecha: 2026-08-20.

## Duda Revisada

La primera implementaciÃ³n aceptaba `needsUserReview=false` en
`POST /proposals` y persistÃ­a la propuesta como `validated`. Aunque ese estado
no creaba directamente un record, permitÃ­a que un campo no confiable del body
seleccionara una etapa del lifecycle.

## Autoridad Consultada

CR-SST-0192 establece que:

- la propuesta es validada por `sst-bend`;
- una inferencia sin aceptaciÃ³n queda en `needs_user_review`;
- V1 exige aceptaciÃ³n explÃ­cita y registrada antes de crear memoria durable;
- ninguna autorizaciÃ³n puede originarse en prompt, salida LLM o datos no
  confiables del consumidor.

## DecisiÃ³n

- `validated` se conserva como concepto interno de validaciÃ³n backend.
- El endpoint pÃºblico no acepta `status`, `needsUserReview`, `reviewedAt` ni
  `reviewReason`.
- Toda propuesta creada por HTTP persiste como `needs_user_review`.
- SÃ³lo `POST /proposals/{id}/review` con `decision=accept` crea un record.
- Los futuros consumidores `sst-chatbot` y `sst-fend` no reciben autoridad para
  asignar lifecycle mediante el payload.

## ImplementaciÃ³n Owner

- `src/apps/sst/presentation/schemas/user-memory.dto.js` rechaza campos de
  control desconocidos.
- `src/apps/sst/application/user-memory/user-memory.service.js` asigna siempre
  `needs_user_review` con defensa en profundidad.
- `specs/api/user-memory.yaml` y la capability outbound publican el boundary.
- `httpPruebas/sst.user-memory.http` contiene casos negativos reproducibles.
- `scripts/test-user-memory-consent-boundary.js` prueba DTO y servicio.

## Efecto En La AdopciÃ³n

CR-SST-0194 puede integrar proposals y recall sin una excepciÃ³n de aceptaciÃ³n
automÃ¡tica. Cualquier futura automatizaciÃ³n de acceptance requerirÃ¡ una decisiÃ³n
contractual nueva; no queda implÃ­citamente autorizada por esta implementaciÃ³n.
