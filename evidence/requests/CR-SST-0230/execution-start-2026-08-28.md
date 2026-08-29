# Inicio autorizado de CR-SST-0230

Fecha: 2026-08-28.

## Autorización recibida

El operador autorizó explícitamente:

> Autorizo publicar running de CR-SST-0230 y modificar sst-bend y
> 4uentes-auth en worktrees aislados, comenzando por Bend. No autorizo todavía
> Jira, deployment ni producción.

La autorización habilita la publicación de este lifecycle y, solamente después
de su merge y readback, la mutación secuencial de los dos owners. Bend debe
publicar primero el contrato productor; Auth sólo puede adoptar ese contrato
después del readback de Bend.

## Readback del plan

El PR de planificación `#174` quedó fusionado el 2026-08-28:

- head: `5443ffcea6870b2ee6a5af3ef777dbb1e444a1c6`;
- merge: `c498620ce5746deeef4add8929cf83f3f9b2a827`;
- rama canónica: `origin/main`;
- lifecycle: `requests/planned/CR-SST-0230-product-safe-chat-cache-qa.yaml`;
- plan: `evidence/requests/CR-SST-0230/implementation-plan-2026-08-28.md`.

El readback confirmó el contrato
`X-SST-Chat-History-Cache: hit|miss|bypass`, la precedencia
`bypass > miss > hit`, el cálculo request-scoped y la prohibición de cambiar
body, status, autoridad PostgreSQL o fail-open Redis.

## Lote de ejecución autorizado

1. Publicar y releer `running` en el control-plane.
2. Refrescar `sst-bend origin/develop` y crear un worktree limpio.
3. Implementar, documentar, validar y publicar el productor Bend.
4. Releer Bend canónico.
5. Refrescar `4uentes-auth origin/develop` y crear otro worktree limpio.
6. Implementar, documentar, validar y publicar el forwarder Auth.
7. Releer Auth canónico y completar evidencia de owners.

Los roots locales observados de Bend y Auth contienen trabajo ajeno y no son
elegibles para mutación. No se retirará ningún worktree antes del readback
terminal de esta CR.

## Límites vigentes

- Jira permanece read-only; no se autoriza crear, transicionar, editar,
  comentar, enlazar, asignar ni etiquetar issues.
- No se autoriza deployment, GitOps directo, cluster ni producción.
- No se autoriza mutar Redis, PostgreSQL, MongoDB, schemas, secretos o keys.
- No se autoriza un endpoint administrativo de eviction ni comandos Redis
  desde QA.
- No se modifica Fend, Chatbot, Infra ni Core.
- Toda evidencia debe omitir tokens, cookies, credenciales, contenido,
  principals, conversation IDs, Redis keys y URLs privadas.

## Gate inmediato

Este commit sólo publica `running`. La ejecución de Bend permanece bloqueada
hasta que el PR de este lifecycle sea fusionado y releído desde `origin/main`.
