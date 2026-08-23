# Plan de identidad y scope de memoria personal SST

## Resultado propuesto

`CR-SST-0210` corrige el desacople entre el contrato histórico y el runtime
observado. `4uentes-auth` seguirá siendo autoridad del sujeto autenticado y de
la sesión. `sst-bend`, que ya posee usuarios, accounts y memberships SST,
resolverá el tenant de negocio, el account activo, el usuario consolidado, el
scope de producto y el `memory_space_id`.

Para V1, `application_id` tendrá el valor estable `sst`. No se copiará desde
`azp`, `client_id` ni `producer_service`: esos valores identifican al caller,
no al dominio al que pertenece la memoria. Así, el usuario web y el chatbot
pueden participar de la misma experiencia SST sin crear espacios de memoria
distintos por accidente.

Este plan no modifica repositorios hijos ni Jira. La ejecución en `sst-bend`
permanece pendiente de aprobación humana explícita.

## Mapa de autoridad y resolución

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "cr-sst-0210-memory-identity-scope-authority"
  type: "dependency"
  question: "¿Qué componente afirma cada dimensión antes de permitir una operación de memoria personal?"
  abstraction_level: "cross-repo contract"
  source_refs:
    - "evidence/requests/CR-SST-0192/personal-memory-governance-v1.yaml"
    - "evidence/requests/CR-SST-0194/identity-scope-policy-analysis-2026-08-22.md"
    - "evidence/requests/CR-SST-0210/identity-scope-contract-v1.yaml"
  observed_at: "2026-08-23"
  authority_boundary: "Vista derivada del contrato propuesto; sst-bend conserva la autoridad owner y debe adoptarlo localmente antes de implementar runtime."
  textual_fallback_required: true
  request_ids: []
  initiative_ids: []
```

```mermaid
flowchart LR
    A[4uentes-auth<br/>sub + sid + sesión + caller]
    B[sst-bend<br/>usuario + membership + account + tenant]
    P[PrincipalContext<br/>application_id = sst]
    M[MemorySpace<br/>scope canónico]
    C[sst-chatbot<br/>proposal / recall]
    L[Proveedor LLM<br/>contenido minimizado]
    A -->|identidad autenticada [confirmed]| B
    B -->|construye y revalida [proposed]| P
    P -->|resuelve tuple completa [proposed]| M
    C -->|caller y correlation ref [proposed]| B
    B -->|contexto autorizado acotado [proposed]| C
    C -->|sin campos de identidad [proposed]| L
```

### Fallback textual del mapa

```text
1. 4uentes-auth valida el sujeto, la sesión y la identidad del caller.
2. sst-bend mapea el sujeto a su usuario SST y resuelve un membership activo.
3. sst-bend obtiene del account un tenant explícito y asigna application_id=sst.
4. sst-bend crea o recupera el memory_space_id de la tuple completa.
5. sst-chatbot sólo propone o solicita recall usando caller y referencias opacas.
6. sst-bend reconstruye el scope; no confía en un PrincipalContext reenviado.
7. El proveedor LLM recibe contenido autorizado y minimizado, nunca identidad o permisos.
```

<!-- visual-map:end -->

## Decisiones del contrato

### Identidad y sesión

`4uentes-auth` afirma `sub`, `sid`, audiencia, tipo de token y cliente OAuth.
No emitirá membership, tenant o account que no administra. Para V1 no hace
falta rediseñar el token si esos datos permiten que `sst-bend` resuelva su
propio estado y verifique una sesión vigente.

### Tenant y account

Cada account habilitado para memoria tendrá un `tenant_id` durable, explícito
y no vacío. El aprovisionamiento puede recibirlo desde configuración aprobada,
pero la lectura nunca utilizará `default`, `legacy` o un valor implícito. Una
cuenta histórica sin tenant reconciliado queda sin memoria habilitada.

El account se selecciona exclusivamente mediante un membership activo del
usuario consolidado. IDs aportados en body, query o headers no confiables no
pueden fijar ni ampliar el scope.

### Aplicación, caller y productor

`application_id=sst` representa el límite de producto de la memoria V1. El
caller se registra aparte con `caller_type` y `caller_id`; cuando corresponda,
`producer_service=sst-chatbot`. Esta separación evita que `sst-fend` y
`sst-chatbot` creen memorias incompatibles para el mismo usuario.

### Memory space y consentimiento

`sst-bend` mantiene un identificador opaco y durable, único para
`tenant/account/user/application`. Cada operación vuelve a autorizar esa tuple.
Una derivación secuencial o salida del chatbot genera una propuesta: no cambia
el estado canónico hasta superar validación backend y aceptación explícita.

## Flujo de ejecución controlada

1. Publicar este plan y obtener aprobación explícita para mutar `sst-bend`.
2. Refrescar `origin/develop` del owner y crear un único worktree limpio.
3. Publicar primero el addendum en specs/docs owner y definir códigos de error.
4. Implementar tenant durable y backfill explícito, sin promover fallbacks.
5. Implementar el resolver de membership y el `PrincipalContext` final.
6. Implementar lookup idempotente del `memory_space_id` y revalidación por operación.
7. Ejecutar migración smoke, tests positivos y matriz negativa de aislamiento.
8. Repetir el QA normal de `CR-SST-0193` y registrar evidencia sintética.
9. Ejecutar checks owner y `npm run check` del control plane antes del cierre.

## Matriz mínima de validación

| Escenario | Resultado obligatorio |
| --- | --- |
| Sesión vigente y membership activo | Resuelve una tuple completa y estable. |
| Sesión revocada | `session_inactive`, sin consultar ni revelar memoria. |
| Membership ausente o inactivo | `membership_missing`, fail-closed. |
| Account sin tenant reconciliado | `tenant_unresolved`, memoria deshabilitada. |
| Body intenta cambiar tenant/account/user | `scope_spoofing_denied`. |
| Mismo usuario y account desde web/chatbot | Mismo `application_id=sst` y mismo memory space. |
| Otro tenant/account/user/application | `scope_mismatch`, sin revelar existencia. |
| Payload hacia proveedor | No contiene identidad, scope, sesión ni entitlements. |
| Derivación terminada sin aceptación | Permanece propuesta y no participa de recall canónico. |

## Gates y dependencias

- `CR-SST-0193` puede cerrar cuando su flujo autenticado normal pase usando el
  resolver canónico, sin relajar el comportamiento fail-closed.
- `CR-SST-0194` no inicia ejecución hasta que `CR-SST-0210` cierre y
  `CR-SST-0193` complete el readback normal.
- La adopción account-aware del chatbot ocurre bajo `CR-SST-0194`; este request
  no adelanta sus adapters de propuesta o recall.
- La UX de revisión permanece bajo `CR-SST-0196`.
- Cualquier escritura Jira requiere un lote enumerado y autorizado aparte.

## Estado del gate

El contrato está propuesto y la ejecución owner permanece bloqueada. El
siguiente paso permitido es publicar esta planificación y solicitar aprobación
explícita para el worktree de `sst-bend`.
