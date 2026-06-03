# CR-SST-0020 - Resultado Operativo Del Edge Ngrok

Observado el: 2026-06-02

## Resumen

La etapa operativa no destructiva quedo validada desde `sst-4uentes-infra` para
el public origin:

- `https://leilani-gymnastic-amphiboly.ngrok-free.dev`

El edge publico usa `ngrok` con OAuth GitHub, single-origin, upstream local
`http://127.0.0.1:8088` y host rewrite hacia `localhost` para matchear el
Ingress actual.

## Evidencia Recibida De Infra

El agente de infra informo:

- Configuracion `ngrok` valida.
- `ngrok` reiniciado.
- Tunnel activo en `https://leilani-gymnastic-amphiboly.ngrok-free.dev`.
- Sin sesion OAuth, `/`, `/.well-known/jwks.json` y
  `/api/auth/extension/session` redirigen a `idp.ngrok.com`.
- OAuth manual con usuario GitHub `afpogo` validado.
- `/.well-known/jwks.json` protegido por OAuth en esta fase.
- `/api/auth/extension/session` esperado como `401 No token provided` cuando
  llega a `node-auth` sin bearer; no debe ser `403` de OAuth ni `404` de
  Ingress.
- `sst-bend` no quedo expuesto por endpoint publico separado.

## Cambios Registrados En Infra

Infra dejo ARDS/SDD alineado con `CR-SST-0020`:

- `specs/states/prepare-public-development-url.yaml`: `validated-live`.
- `specs/states/implement-durable-ngrok-edge.yaml`: `runtime-partial`.
- `specs/capabilities/outbound/platform-public-development-url.yaml`:
  `ready-for-consumer`.
- `specs/infra/security/network-exposure.yaml`: policy actualizada para
  single-origin, OAuth GitHub, `read:user`, no `read:org`, no exposicion directa
  de `sst-bend`.
- `docs/runbooks/ngrok-durable-development.md`: runbook ajustado para Vault
  macros y config local.
- `docs/reference-sources.md`: fuente runtime `2026-06-02` agregada sin
  secretos.

## Restricciones Respetadas

Infra reporto:

- No se aplicaron manifests reales.
- No se modifico Kubernetes.
- No se modificaron Secrets.
- No se cambiaron imagenes, tags ni digests.
- No se modificaron repos hijos.
- No se registraron cookies, tokens, JWTs, authtokens, passwords ni secretos
  OAuth.

## Pendientes Explicitamente Diferidos

- Persistencia create/read/delete queda diferida para una fase posterior con
  credenciales fuera de Git.
- Login web de aplicacion queda diferido.
- Validacion de extension con bearer real queda diferida.
- Instalacion/reconciliacion de `ngrok` como servicio Windows queda como paso
  de durabilidad posterior.
- Hasta dos usuarios GitHub adicionales pueden agregarse a la allowlist si el
  operador lo aprueba.
- `orchestrator_link.state_id` en infra sigue pendiente de reconciliacion desde
  el orquestador.

## Decision De Cierre

La etapa `CR-SST-0020` queda cerrada en el orquestador como publicacion
development operativa validada, no como release productivo ni como durabilidad
completa. El siguiente trabajo debe abrir un request nuevo o una fase posterior
explicita para persistencia, extension end-to-end, servicio Windows de `ngrok`
o promocion de imagenes por tag/digest inmutable.
