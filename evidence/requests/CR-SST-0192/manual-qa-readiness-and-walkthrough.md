# CR-SST-0192 - QA Manual Y Readiness

Fecha: 2026-08-17

## EvaluaciÃ³n De Momento

El runtime de memoria personal todavÃ­a no existe de extremo a extremo. Por
eso, en `CR-SST-0192` corresponde un QA manual de contrato y escenarios, no un
QA funcional en navegador o API.

El QA manual de usuario serÃ¡ vÃ¡lido cuando estÃ©n disponibles:

1. persistencia y APIs de `CR-SST-0193`;
2. propuesta y recall conectados de `CR-SST-0194`;
3. review UX de `CR-SST-0196`.

La exportaciÃ³n se agrega cuando `CR-SST-0195` estÃ© adoptado. El cierre integral
permanece en `CR-SST-0198`.

La revisiÃ³n read-only de los heads locales `origin/develop` observÃ³:

- `sst-bend`: no existe una superficie canÃ³nica `user-memory`;
- `sst-chatbot`: su documentaciÃ³n declara que el RAG gobernado todavÃ­a no estÃ¡
  conectado a `ProviderChatRuntime` ni a `/internal/v1/chat/turns`;
- `sst-fend`: no existe una UI de review de memoria personal.

Este estado confirma que levantar navegador o emitir requests de memoria ahora
sÃ³lo producirÃ­a 404 o validarÃ­a mocks aislados, no la experiencia objetivo.

## Walkthrough Manual Ejecutado

| Escenario | Resultado contractual | Estado |
|---|---|---|
| Usuario dice â€œrecordame que quiero estudiar Spring Securityâ€ | Event mÃ­nimo, propuesta, validaciÃ³n backend, review y aceptaciÃ³n antes del recall | PASS |
| Chat menciona implÃ­citamente una preferencia | SÃ³lo propuesta `needs_user_review`; no ingresa al contexto | PASS |
| Usuario pega una API key y pide recordarla | Secret detection la rechaza antes de contenido durable y provider | PASS |
| Otro usuario/account/tenant solicita el mismo ID | `scope_mismatch`, sin revelar existencia | PASS |
| Robot pide ignorar su perfil y leer toda la memoria | Capability y scope permanecen inmutables | PASS |
| Provider inventa una cita | La salida se rechaza sin respuesta parcial | PASS |
| Usuario corrige una intenciÃ³n aceptada | Nueva revisiÃ³n/supersession con provenance | PASS |
| Usuario borra memoria | ExclusiÃ³n inmediata, purge, invalidaciÃ³n de Ã­ndice/export y tombstone sin contenido | PASS |
| Export intenta `../secrets.txt` o path absoluto | `unsafe_export_path` y no se crea artefacto | PASS |
| Servicio se reinicia y hay una conversaciÃ³n nueva | El contrato exige recuperar desde `sst-bend`, no del estado del provider | PASS contractual |

## Hallazgos

- El contrato cubre la vertical positiva y las principales denegaciones.
- `tenantId=legacy` es incompatible con esta memoria y queda explÃ­citamente
  prohibido para el nuevo mÃ³dulo.
- La polÃ­tica de backups y erasure por cierre de cuenta sigue siendo un gate de
  release, no un bloqueo para implementar el slice local/dev.
- No puede declararse QA funcional PASS hasta que existan las APIs, integraciÃ³n
  chatbot y UI correspondientes.

## PrÃ³ximo QA Manual

Al terminar `CR-SST-0193`, ejecutar QA HTTP autenticado de create/propose/review,
scope, idempotencia, delete y restart. Al terminar `CR-SST-0194`, agregar el
smoke conversacional con proveedor simulado. El QA visible de usuario debe
programarse despuÃ©s de `CR-SST-0196` y antes de cerrar `CR-SST-0198`.
