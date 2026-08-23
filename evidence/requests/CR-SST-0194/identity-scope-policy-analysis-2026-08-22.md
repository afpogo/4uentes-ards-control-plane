# CR-SST-0194 - Preflight De Identidad Y Scope De Memoria

Fecha: 2026-08-22.

## Objetivo

Revisar el siguiente paso despuÃ©s del QA de CR-SST-0193 aplicando las policies
vivas del control plane, sin modificar repositorios hijos ni escribir Jira.

## Fuentes Revisadas

- `AGENTS.md` y `specs/integration/policies.yaml`;
- policies de architecture boundary, atomizaciÃ³n, contexto, selecciÃ³n de
  modelo, owner documentation y Jira/work-tracker;
- contrato aprobado `sst-personal-memory-governance-v1`;
- runtime y owner docs observados de `sst-bend`, `4uentes-auth` y
  `sst-chatbot`;
- requests CR-SST-0193, CR-SST-0194 y CR-SST-0202;
- readback Jira read-only de SST-107 y SST-108.

## ClasificaciÃ³n Operativa

- task weight: `complex-high-risk-task`;
- drivers: autenticaciÃ³n, autorizaciÃ³n, scope multi-tenant, contrato
  cross-repo y memoria privada;
- provider: `codex`;
- resource level/source: `normal/default`;
- profile requerido por policy: `gpt-5.6-sol`, reasoning `max`;
- delegaciÃ³n: no utilizada; la decisiÃ³n sensible permanece en el agente
  principal y el runtime actual no autoriza delegaciÃ³n proactiva.

## Hechos Observados

1. CR-SST-0193 fue autorizada para mutar sÃ³lo `sst-bend`. Ampliarla hacia
   `4uentes-auth` violarÃ­a el boundary aprobado.
2. El access token real desplegado contiene `token_use=access`, `sid` y
   audience `sst-api`, pero no `tenant_id` ni identidad de aplicaciÃ³n. El
   middleware de memoria responde 403 y falla cerrado.
3. `Account` y `AccountMembership` viven y se resuelven actualmente en
   `sst-bend`; `4uentes-auth` no posee ese modelo de membership.
4. El contrato de CR-SST-0192 dice que `4uentes-auth` conserva identity,
   session y membership. Esa frase no coincide con el runtime owner observado.
   La evidencia histÃ³rica no se reescribe: requiere un addendum versionado.
5. `accounts` no contiene una relaciÃ³n de tenant. Chat usa actualmente un
   fallback `tenantId=default` y LearningWorkspace usa `legacy`; ambos estÃ¡n
   prohibidos para memoria personal.
6. El middleware de memoria usa `azp/client_id` como `application_id`. Eso
   mezcla dos conceptos distintos: cliente OAuth/servicio llamador y scope de
   aplicaciÃ³n del dato. `sst-fend` y `sst-chatbot` terminarÃ­an en memory spaces
   diferentes aunque participen de la misma experiencia SST.
7. `sst-chatbot` ya tiene `PrincipalContext`, pero su `PrincipalScope` no
   incluye `account_id`, requerido por el contrato de memoria.
8. `sst-chatbot` documenta que `PrincipalContext` es afirmado por
   `sst_backend`; el chatbot no autentica ni calcula entitlements.
9. El gate completo del control plane pasa fuera del sandbox con cuatro
   warnings no bloqueantes de forma de remote. El `null !== 1` observado dentro
   del sandbox es consecuencia de un `spawnSync EPERM`, no una falla HPT ni del
   repositorio.
10. SST-107 y SST-108 siguen en `Tareas por hacer`, bajo SST-105 y sin
    resoluciÃ³n. Jira no contradice el lifecycle local y no fue modificado.

## ColisiÃ³n De Identificadores Detectada

La bÃºsqueda estructurada ampliada en Jira encontrÃ³ que el namespace posterior a
`CR-SST-0198` ya estÃ¡ ocupado por trabajo de `INIT-SST-0007`:

| Jira | Identidad observada |
| --- | --- |
| `SST-113` | `CR-SST-0202`, retenciÃ³n consciente del chat SST |
| `SST-114` | `CR-SST-0203` |
| `SST-115` | `CR-SST-0204` |
| `SST-116` | `CR-SST-0205` |
| `SST-117` | `CR-SST-0206` |

La descripciÃ³n de la Epic `SST-86` tambiÃ©n referencia `CR-SST-0199`,
`CR-SST-0200` y `CR-SST-0201`. Esas identidades todavÃ­a no tienen lifecycle
local visible en este checkout. AdemÃ¡s, el control plane creÃ³ localmente un
segundo `CR-SST-0202` para reconciliar `INIT-SST-0010`; por lo tanto ese
artefacto queda en cuarentena y su preview Jira no puede ejecutarse.

La policy de autoridad del work tracker exige bloquear y reconciliar ante una
coincidencia de identidad. No corresponde renumerar requests, reinterpretar
issues ni asignar el siguiente nÃºmero de forma automÃ¡tica.

## DecisiÃ³n De Boundary

La correcciÃ³n de identidad, tenant y application scope necesita una request
cross-repo separada. Incluirla dentro de CR-SST-0194 producirÃ­a una dependencia
circular: CR-SST-0193 necesita esa fundaciÃ³n para cerrar, mientras CR-SST-0194
depende del cierre de CR-SST-0193.

La request predecesora queda como candidata `CR-SST-TODO-IDENTITY-SCOPE` hasta
reconciliar el namespace global. Debe:

- versionar el addendum de autoridad y `PrincipalContext`;
- implementar el tenant durable y el scope derivado de membership;
- separar `application_id` de `azp/client_id` y `producer_service`;
- probar sesiÃ³n revocada y aislamiento tenant/account/user/application;
- actualizar las owner docs de cada repo que finalmente sea autorizado.

CR-SST-0194 puede continuar en anÃ¡lisis, pero no puede pasar a ejecuciÃ³n hasta
que:

1. el namespace de CRs haya sido reconciliado sin sobrescribir identidades;
2. la request predecesora reciba un ID libre, plan y aprobaciÃ³n cross-repo;
3. esa request cierre y permita completar el flujo normal de CR-SST-0193;
4. CR-SST-0193 cierre localmente;
5. exista aprobaciÃ³n humana explÃ­cita para ejecutar CR-SST-0194.

## Autoridad Recomendada

| Dato o decisiÃ³n | Autoridad recomendada |
| --- | --- |
| `sub`, `sid`, `token_use`, audience, scopes y cliente OAuth | `4uentes-auth` |
| vigencia/revocaciÃ³n de sesiÃ³n | `4uentes-auth` mediante introspecciÃ³n |
| usuario consolidado, account y membership SST | `sst-bend` |
| tenant de negocio asociado al account | `sst-bend` |
| `application_id` de la memoria | contexto de producto validado por `sst-bend` |
| `azp/client_id` y `producer_service` | identidad del caller, separada de `application_id` |
| `PrincipalContext` final | afirmado exclusivamente por `sst-bend` |
| autorizaciÃ³n y persistencia canÃ³nica de memoria | `sst-bend` |
| selecciÃ³n/minimizaciÃ³n de contexto para proveedor | `sst-chatbot`, subordinado al contexto aprobado |

`4uentes-auth` no debe emitir account, tenant o membership que no administra.
`sst-bend` tampoco debe aceptar esas dimensiones desde texto, body o headers no
confiables.

## Addendum Que Debe Decidir La Request Predecesora

### Tenant

Para V1 local/dev se recomienda persistir un `tenant_id` explÃ­cito junto al
account y resolverlo desde membership. El aprovisionamiento puede consumir una
configuraciÃ³n SST obligatoria y no vacÃ­a, pero no puede usar `default`,
`legacy` ni otro fallback implÃ­cito. Una entidad `tenants` completa puede quedar
para una evoluciÃ³n posterior si el modelo multi-organizaciÃ³n aÃºn no estÃ¡
definido.

### AplicaciÃ³n Y Caller

`application_id` debe representar el contexto de producto al que pertenece la
memoria. No debe copiar automÃ¡ticamente `azp` ni `client_id`. El identificador
canÃ³nico exacto queda `TODO` hasta decidir si V1 usa el producto SST completo o
un connector/module id estable.

El caller se registra por separado:

- usuario web: `azp=sst-fend`;
- servicio: `client_id/azp=sst-chatbot`;
- propuesta: `producer_service` derivado por backend.

### PrincipalContext

El contrato del chatbot debe incorporar `account_id` y distinguir:

- sujeto autenticado;
- usuario consolidado SST;
- tenant/account/application de negocio;
- caller/producer;
- audiencia, entitlements, policy version y referencia de autenticaciÃ³n.

Los campos de identidad y autorizaciÃ³n no cruzan al proveedor LLM.

### Superficies HTTP

- Las operaciones del usuario â€”listar, revisar, corregir y borrarâ€” usan access
  token, sesiÃ³n vigente y membership resuelto por `sst-bend`.
- Las operaciones del chatbot â€”proponer y solicitar recallâ€” usan M2M con scopes
  mÃ­nimos y una referencia de conversaciÃ³n/correlaciÃ³n que `sst-bend` resuelve
  contra su propio estado durable.
- `sst-bend` no debe confiar como autoridad en un `PrincipalContext` reenviado
  libremente por el chatbot; debe reconstruir o revalidar el scope.
- Las rutas internas y de usuario no deben debilitarse para compartir el mismo
  middleware por conveniencia.

## AtomizaciÃ³n Recomendada

### Request predecesora de identidad y scope

1. **Addendum de contrato y owner docs**
   Output: autoridad, campos, superficies y cÃ³digos de error versionados.
   Riesgo: alto. DoD: revisiÃ³n cross-repo antes de cÃ³digo.
2. **FundaciÃ³n de identidad SST**
   Output: tenant durable, membership-derived scope, client identity de login y
   `PrincipalContext` con account.
   Riesgo: alto. DoD: tests negativos cross-tenant/account/user/application y
   sesiÃ³n revocada.
### CR-SST-0194

1. **Puertos internos de memoria**
   Output: M2M proposal/recall sin aceptaciÃ³n canÃ³nica desde chatbot.
   Riesgo: alto. DoD: scopes mÃ­nimos, idempotencia y revalidaciÃ³n backend.
2. **Adapters y composiciÃ³n en chatbot**
   Output: `GovernedMemorySourcePort`, proposal port y contexto acotado.
   Riesgo: alto. DoD: provider fake, citas y cancelaciÃ³n.
3. **QA integrado y evidencia**
   Output: login real -> chat -> proposal -> review -> nueva conversaciÃ³n ->
   recall citado.
   Riesgo: alto. DoD: owner checks de los tres repos y `npm run check` completo
   del control plane.

## Estado Y PrÃ³ximo Gate

El runtime aislado de CR-SST-0193 estÃ¡ implementado y probado, y el gate
completo del control plane estÃ¡ recuperado. CR-SST-0193 permanece abierta por
el flujo normal de identidad/scope, no por HPT.

Hasta resolver ese boundary no corresponde cerrar SST-107 ni iniciar la
ejecuciÃ³n de SST-108. El anÃ¡lisis queda como evidencia del gate de CR-SST-0194,
pero no bajo la autoridad del `CR-SST-0202` local porque ese identificador estÃ¡
colisionado. No se realizÃ³ ninguna escritura Jira ni mutaciÃ³n de repos hijos.

## ValidaciÃ³n

- `npm.cmd run check`: PASS fuera del sandbox; `41 OK / 4 WARN / 0 FAIL` en
  bindings y cero fallas en los demÃ¡s validadores.
- scan focalizado de whitespace: PASS para los artefactos de esta pasada.
- Los cuatro warnings de bindings son drift de forma HTTPS/SSH y no bloquean
  esta decisiÃ³n.
