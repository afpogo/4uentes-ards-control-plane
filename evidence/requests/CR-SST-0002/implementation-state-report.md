# CR-SST-0002 - Reporte De Estado De Implementacion

Observado el: 2026-05-18

## Resumen Ejecutivo

El modelo SST dictionary/tag no es solo concept intake. El backend API
(`sst-bend`) tiene documentacion ARDS, outbound capabilities, route handlers, use
cases, database models y migrations para `Dictionary Sheet`, `Dictionary Entry`,
`TagValue`, `TagOccurrence`, account scoping y secure reveal semantics.

El boundary BFF/shared auth (`4uentes-auth`, observado localmente como
`node-auth`) tiene inbound adoption implementada desde `sst-bend`, outbound
capabilities para `sst-fend` y `sst-extension`, y rutas read/write pass-through
bajo `/api/diccionario/*`.

El web frontend (`sst-fend`) tiene superficies implementadas de UI/service/state
/test para dictionary. La browser extension (`sst-extension`) tiene soporte
optional-active de dictionary mediante popup/background messaging y BFF, con un
gap documentado de account-context.

Seguridad es parcial: existen masking/reveal, restricciones owner-role,
auth/BFF routing, gobierno no-plaintext-secret y manejo manual local de secrets.
La encryption-at-rest final y la politica de offline-server no estan
implementadas y deben permanecer como future requests separados.

## Servicios Inspeccionados

| Service | ARDS kind | Modo de inspeccion | Resultado |
|---|---|---|---|
| `sst-bend` | `backend-api` | read-only docs/specs/code | Evidencia fuerte de backend implementation |
| `4uentes-auth` | `shared-auth-provider` | read-only docs/specs/code | Evidencia de BFF capability y proxy implementation |
| `sst-fend` | `frontend-web` | read-only docs/specs/code | Evidencia de frontend runtime implementation |
| `sst-extension` | `frontend-extension` | read-only docs/specs/code | Evidencia optional runtime con account-context gap |
| `sst-4uentes-infra` | `infra-gitops` | read-only docs/manifests | Evidencia de deployment/security governance, no domain owner |

## Estado Conceptual

| Concepto | Estado | Servicio primario | Confianza | Notas |
|---|---|---|---|---|
| Study Store Tag purpose | `ards-documented` | `sst-bend` | high | Purpose y dictionary scope estan documentados en ARDS/specs e intake de negocio. |
| Tags as living resources | `runtime-partial` | `sst-bend` | high | Existe runtime TagValue/TagOccurrence; TagDefinition governance queda fuera de scope. |
| tag grammar scope/key | `runtime-partial` | `sst-bend` | high | Existen gramatica dictionary scope/key y legacy parser; multi-domain grammar sigue abierta. |
| Dictionary Entry | `runtime-implemented` | `sst-bend` | high | Existen API routes, use cases, DB models, BFF, frontend y extension surfaces. |
| Dictionary Sheet | `runtime-implemented` | `sst-bend` | high | Sheets tienen API routes, use cases, DB models, frontend UI y extension UI. |
| translations | `runtime-partial` | `sst-bend` | medium | Documentado y domain artifact observado, pero sin public endpoint adoption claro. |
| aliases | `ards-documented` | `sst-bend` | medium | Semantica de aliases documentada con translations; runtime support no establecido. |
| account relation | `runtime-partial` | `sst` | high | API/BFF preservan account context; extension registra gap de account-context wiring. |
| endpoint planning | `runtime-implemented` | `sst` | high | Existen routes en backend, BFF, frontend y extension messaging surfaces. |
| security/offline/encryption | `runtime-partial` | `sst` | high | Existe security/reveal; encryption-at-rest y offline model estan diferidos. |

## Evidencia Clave

### sst-bend

- `specs/api/diccionario-sst-tag.yaml` define Study Store Tag purpose,
  dictionary scope, scope/key grammar, `DictionaryEntry`, `DictionarySheet`,
  aggregate translation/alias, account scoping, endpoints y secure semantics.
- `specs/capabilities/outbound/dictionary-domain-read-v1.yaml` y
  `dictionary-domain-management-v1.yaml` publican capabilities de read/import
  /export y management.
- `src/apps/sst/presentation/routes/diccionario.routes.js` expone `/rf`,
  `/sheets`, `/entries`, `/entries/:id/reveal`, `/tag-values`,
  `/tag-occurrences`, `/imports` y `/exports`.
- `db/models/dictionary-*.js` y migrations definen persisted dictionary sheets,
  entries, tag values, entry tags, import runs, audit events y tag occurrences.

### 4uentes-auth

- `specs/capabilities/inbound/sst-bend--dictionary-*.yaml` registra adopcion
  implementada de capabilities SST dictionary.
- `specs/capabilities/outbound/dictionary-*.yaml` publica BFF facades para
  `sst-fend` y `sst-extension`.
- `src/presentation/dictionary/routes.ts` expone rutas BFF bajo
  `/api/diccionario/*`.
- `src/presentation/dictionary/controller.ts` y
  `src/infrastructure/datasources/dictionary.datasource.impl.ts` reenvian
  headers Authorization y account-context hacia SST.

### sst-fend

- `specs/34-dictionary-frontend.yml` y `docs/34-dictionary-frontend.md` definen
  consumo frontend mediante `node-auth`, no directo a `sst-bend`.
- `src/services/dictionaryService.ts` llama superficies de sheets, entries,
  tag-values, tag-occurrences, reveal, import y export.
- `src/pages/Dictionary/index.tsx` implementa gestion de sheet/entry,
  root-sheet behavior, tag filtering, secure masking y explicit reveal.
- `src/pages/Dictionary/__tests__/Dictionary.test.tsx` incluye evidencia de
  tests para masked secure values, reveal action, create entry defaults, move y
  root delete block.

### sst-extension

- `specs/features/dictionary.yaml` define la feature optional-active dictionary
  de extension.
- `specs/integration/node-auth-extension-dictionary.yaml` y specs inbound modelan
  consumo BFF y prohiben acceso directo a `sst-bend`.
- `src/shared/extension-messages.ts` define contratos de dictionary messages.
- `src/ui/quick-save/QuickSaveSurface.tsx` renderiza sheets, entries, tag
  values, create/move/delete entry y root delete protection.
- Account context sigue como gap documentado antes de enviar
  `x-active-account-id`.

### sst-4uentes-infra

- Deployment contracts referencian `sst-bend`, `node-auth`, `sst-fend` y
  `sst-extension`.
- Security specs cubren no plaintext secrets y provision manual local de
  secrets.
- Infra no es duena de la semantica de negocio dictionary/tag.

## Limitaciones

- `bindings.local.yaml` estaba ausente, por lo que los paths locales son solo
  evidence-only desde inventory.
- No se ejecutaron checks de repos funcionales generales.
- No se llamaron endpoints runtime.
- No se modifico ningun repo fuera del control-plane.

## Recomendacion

Avanzar a Fase 4 solo como trabajo ARDS/request-controlled. La primera ejecucion
no debe cambiar product runtime code. Debe formalizar evidencia de
capability/request, luego exigir checks focalizados de dictionary routes y
comportamiento dictionary de frontend/extension antes de aprobar cualquier
cambio runtime.
