# CR-SST-0002 - Implementation State Report

Observed at: 2026-05-18

## Executive Summary

The SST dictionary/tag model is not just concept intake. The backend API (`sst-bend`) has ARDS documentation, outbound capabilities, route handlers, use cases, database models, and migrations for Dictionary Sheet, Dictionary Entry, TagValue, TagOccurrence, account scoping, and secure reveal semantics.

The BFF/shared auth boundary (`4uentes-auth`, observed locally as `node-auth`) has implemented inbound adoption from `sst-bend` and outbound capabilities for `sst-fend` and `sst-extension`, plus read/write pass-through routes under `/api/diccionario/*`.

The web frontend (`sst-fend`) has implemented dictionary UI/service/state/test surfaces. The browser extension (`sst-extension`) has optional-active dictionary support through popup/background messaging and the BFF, with a documented account-context gap.

Security is partial: masking/reveal, owner-role constraints, auth/BFF routing, no-plaintext-secret governance, and manual local secret handling exist. Final encryption-at-rest and offline-server policy are not implemented and should remain separate future requests.

## Services Inspected

| Service | ARDS kind | Inspection mode | Result |
|---|---|---|---|
| `sst-bend` | `backend-api` | read-only docs/specs/code | Strong backend implementation evidence |
| `4uentes-auth` | `shared-auth-provider` | read-only docs/specs/code | BFF capability and proxy implementation evidence |
| `sst-fend` | `frontend-web` | read-only docs/specs/code | Frontend runtime implementation evidence |
| `sst-extension` | `frontend-extension` | read-only docs/specs/code | Optional runtime implementation evidence with account-context gap |
| `sst-4uentes-infra` | `infra-gitops` | read-only docs/manifests | Deployment/security governance evidence, not domain owner |

## Concept Status

| Concept | Status | Primary service | Confidence | Notes |
|---|---|---|---|---|
| Study Store Tag purpose | `ards-documented` | `sst-bend` | high | Purpose and dictionary scope are documented in ARDS/specs and business intake. |
| Tags as living resources | `runtime-partial` | `sst-bend` | high | TagValue/TagOccurrence runtime exists; TagDefinition governance remains out of scope. |
| tag grammar scope/key | `runtime-partial` | `sst-bend` | high | Dictionary scope/key grammar and legacy parser exist; multi-domain grammar remains open. |
| Dictionary Entry | `runtime-implemented` | `sst-bend` | high | API routes, use cases, DB models, BFF, frontend and extension surfaces exist. |
| Dictionary Sheet | `runtime-implemented` | `sst-bend` | high | Sheets have API routes, use cases, DB models, frontend UI and extension UI. |
| translations | `runtime-partial` | `sst-bend` | medium | Documented and domain artifact observed, but no clear public endpoint adoption found. |
| aliases | `ards-documented` | `sst-bend` | medium | Alias semantics are documented with translations; runtime support is not established. |
| account relation | `runtime-partial` | `sst` | high | API/BFF preserve account context; extension records account-context wiring gap. |
| endpoint planning | `runtime-implemented` | `sst` | high | Routes exist across backend, BFF, frontend and extension messaging surfaces. |
| security/offline/encryption | `runtime-partial` | `sst` | high | Security/reveal exists; encryption-at-rest and offline model are deferred. |

## Key Evidence

### sst-bend

- `specs/api/diccionario-sst-tag.yaml` defines Study Store Tag purpose, dictionary scope, scope/key grammar, DictionaryEntry, DictionarySheet, translation/alias aggregate, account scoping, endpoints, and secure semantics.
- `specs/capabilities/outbound/dictionary-domain-read-v1.yaml` and `dictionary-domain-management-v1.yaml` publish read/import/export and management capabilities.
- `src/apps/sst/presentation/routes/diccionario.routes.js` exposes `/rf`, `/sheets`, `/entries`, `/entries/:id/reveal`, `/tag-values`, `/tag-occurrences`, `/imports`, and `/exports`.
- `db/models/dictionary-*.js` and migrations define persisted dictionary sheets, entries, tag values, entry tags, import runs, audit events, and tag occurrences.

### 4uentes-auth

- `specs/capabilities/inbound/sst-bend--dictionary-*.yaml` records implemented adoption of SST dictionary capabilities.
- `specs/capabilities/outbound/dictionary-*.yaml` publishes BFF facades for `sst-fend` and `sst-extension`.
- `src/presentation/dictionary/routes.ts` exposes BFF routes under `/api/diccionario/*`.
- `src/presentation/dictionary/controller.ts` and `src/infrastructure/datasources/dictionary.datasource.impl.ts` forward Authorization and account-context headers to SST.

### sst-fend

- `specs/34-dictionary-frontend.yml` and `docs/34-dictionary-frontend.md` define frontend consumption through `node-auth`, not direct `sst-bend`.
- `src/services/dictionaryService.ts` calls sheets, entries, tag-values, tag-occurrences, reveal, import and export surfaces.
- `src/pages/Dictionary/index.tsx` implements sheet/entry management, root-sheet behavior, tag filtering, secure masking and explicit reveal.
- `src/pages/Dictionary/__tests__/Dictionary.test.tsx` includes test evidence for masked secure values, reveal action, create entry defaults, move, and root delete block.

### sst-extension

- `specs/features/dictionary.yaml` defines the optional-active extension dictionary feature.
- `specs/integration/node-auth-extension-dictionary.yaml` and inbound specs model BFF consumption and forbid direct `sst-bend` access.
- `src/shared/extension-messages.ts` defines dictionary message contracts.
- `src/ui/quick-save/QuickSaveSurface.tsx` renders sheets, entries, tag values, create/move/delete entry and root delete protection.
- Account context remains a documented gap before sending `x-active-account-id`.

### sst-4uentes-infra

- Deployment contracts reference `sst-bend`, `node-auth`, `sst-fend`, and `sst-extension`.
- Security specs cover no plaintext secrets and manual local secret provisioning.
- Infra does not own dictionary/tag business semantics.

## Limitations

- `bindings.local.yaml` was absent, so local paths are evidence-only from inventory.
- Functional repo checks were not executed.
- No runtime endpoints were called.
- No repository outside the control-plane was modified.

## Recommendation

Proceed to Fase 4 only as ARDS/request-controlled work. The first execution should not change product runtime code. It should formalize capability/request evidence, then require targeted checks for dictionary routes and frontend/extension dictionary behavior before any runtime change is approved.
