# CR-SST-0193 - ImplementaciÃ³n Y ValidaciÃ³n Local

Fecha: 2026-08-18

## ImplementaciÃ³n

Worktree: `worktrees/CR-SST-0193-bend`.

Branch: `feat/SST-107/CR-SST-0193/canonical-user-memory`.

Base inicial: `origin/develop@a73aced`.

Base de promociÃ³n despuÃ©s de rebase limpio: `origin/develop@8fe60f4`.

Se implementÃ³ en `sst-bend`:

- cinco tablas canÃ³nicas de memoria con migraciÃ³n reversible;
- scope estricto tenant/account/user/application sin fallback legacy;
- eventos minimizados e idempotentes;
- propuestas fact/intention/thread con aceptaciÃ³n explÃ­cita;
- records, revisiones, supersession, archive y tombstones;
- auditorÃ­a de recall metadata-only;
- rechazo de raw chat, credenciales y clasificaciones restricted/secret;
- retenciÃ³n de eventos/propuestas, tombstones y recalls;
- API feature-flagged bajo `/4uentes/v1/user-memory`;
- specs, owner docs y harness HTTP sin credenciales reales.

## Pruebas

`npm run test:user-memory`: PASS.

- raw chat rechazado;
- idempotencia y conflicto por reutilizaciÃ³n;
- review explÃ­cito y creaciÃ³n de record;
- correcciÃ³n/supersession;
- delete con contenido removido;
- recall sin query/prompt/respuesta;
- secretos, tags y classification negativos;
- scope legacy/missing fail-closed;
- migraciÃ³n crea tablas/Ã­ndices y rollback inverso.
- aceptaciÃ³n repetida/concurrente crea exactamente un record;
- decisiÃ³n de review contradictoria devuelve conflicto;
- retenciÃ³n configurable afecta expiraciÃ³n y tombstone.

`node --check` sobre los nuevos mÃ³dulos: PASS.

`git diff --check`: PASS.

La arquitectura derivada quedÃ³ publicada como seis mapas Mermaid versionados
en `sst-bend/docs/architecture/user-memory-v1.md`. El test estructural owner
forma parte de `npm run test:user-memory`. Ver
`evidence/requests/CR-SST-0193/user-memory-architecture-maps.md`.

El 2026-08-20 se agregÃ³ la regresiÃ³n del boundary de consentimiento: el cliente
no puede enviar `needsUserReview=false` ni seleccionar `status`; el servicio
persiste siempre `needs_user_review`. Ver
`evidence/requests/CR-SST-0193/proposal-consent-boundary-decision.md`.

La reevaluaciÃ³n de QA live del 2026-08-20 encontrÃ³ la superficie todavÃ­a no
adoptada por el runtime compartido (404 directo y vÃ­a frontend/BFF) y sin JWT
scoped disponible. No se reiniciÃ³ ni reemplazÃ³ ese entorno. Ver
`evidence/requests/CR-SST-0193/live-http-qa-readiness-2026-08-20.md`.

`sst-bend npm run check`: termina con cÃ³digo 0. El check heredado informa
cobertura protegida parcial (50%) porque no se proporcionÃ³ `SMOKE_JWT`; sus
smokes autenticados permanecen skipped y no se consideran cobertura de memoria.

`4uentes-orchestor npm run check`: PASS, 0 FAIL.

## MigraciÃ³n Real

El ciclo local Postgres `up -> down -> up` fue completado posteriormente. Ver
`evidence/requests/CR-SST-0193/postgres-migration-smoke.md`.

El 2026-08-20 se aplicÃ³ ademÃ¡s una migration forward incremental con unicidad
por `proposal_id` y se ejecutÃ³ el smoke Postgres concurrente con cleanup total.

## ValidaciÃ³n Pendiente

- iniciar runtime con `USER_MEMORY_ENABLED=true`;
- obtener JWT con `tenant_id`, application/azp y membership vÃ¡lidos;
- ejecutar el harness HTTP positivo y negativos cross-account;
- medir cobertura HTTP autenticada de las rutas nuevas.

Por estas pendientes CR-SST-0193 no estÃ¡ cerrado. Jira SST-107 no fue
modificado.

## PromociÃ³n Posterior

El branch fue promovido posteriormente mediante commit `f296c7a` y PR draft
`sst-bend#17`; sus tres checks GitHub pasaron. CR-SST-0193 continÃºa abierto por
el QA runtime indicado arriba. Ver
`evidence/requests/CR-SST-0193/github-promotion-2026-08-20.md`.

## RevisiÃ³n De Trazabilidad Del 2026-08-21

Antes de fusionar el PR se incorporÃ³ trazabilidad neutral de eventos,
propuestas, records y recalls, junto con rechazo explÃ­cito de prompts,
mensajes LangChain y respuestas del proveedor. Las pruebas focalizadas, build,
migraciÃ³n aislada, rollback/reapply y smoke concurrente pasaron. El check mÃ¡s
reciente del control plane quedÃ³ bloqueado por una regresiÃ³n ajena en
`scripts/test-verify-local-bindings.js`; no se aplicÃ³ ningÃºn bypass. Ver
`evidence/requests/CR-SST-0193/neutral-traceability-validation-2026-08-21.md`.
