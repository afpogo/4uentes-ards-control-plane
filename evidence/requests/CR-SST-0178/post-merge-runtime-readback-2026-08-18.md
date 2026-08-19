# Readback post-merge de CR-SST-0178

## Resultado

La publicación interna del chatbot en development está operativa y quedó
representada por GitOps con una imagen inmutable. `CR-SST-0178` permanece en
`running` porque todavía falta el E2E de navegador con el perfil Chrome DevTools
aislado; este documento no declara el cierre del CR.

## Publicaciones confirmadas

| Owner | PR | Resultado |
| --- | --- | --- |
| `sst-chatbot` | [#9](https://github.com/afpogo/sst-chatbot/pull/9) | Fusionado; merge `976837af3c066feefc4c64ef194fa7fdb3f600bb`. |
| `sst-4uentes-infra` | [#7](https://github.com/afpogo/sst-4uentes-infra/pull/7) | Fusionado; merge `86d244de73777988696b65528cedbc7bb3b137dc`. |
| `sst-4uentes-infra` | [#8](https://github.com/afpogo/sst-4uentes-infra/pull/8) | Hotfix del tag inmutable fusionado; merge `d6deb1bfdf5a83367d27a5acbc856f6c41a6633f`. |
| Control-plane | [#24](https://github.com/afpogo/4uentes-ards-control-plane/pull/24) | Fusionado; merge `3f69bd5132c7df0b7148f2425ea80025d6442d0b`. |

La imagen publicada y observada es
`ghcr.io/afpogo/sst-chatbot:develop-976837af3c06`, con digest
`sha256:e56167937f03cba366f0100b403fae837a5c5eccc64c8182477002f73b0bbada`.

## Reconciliación del merge anticipado de Infra

El PR Infra #7 fue fusionado mientras aún referenciaba el tag mutable
`develop`. En la primera reconciliación, el pod nuevo reutilizó una imagen
histórica en caché cuyo `/healthz` respondía `404`. Kubernetes conservó el pod
anterior Ready, por lo que no se observó indisponibilidad del servicio.

El PR Infra #8 corrigió el desired state para fijar el tag inmutable publicado.
No se reintentó mediante un cambio directo en el clúster: la corrección llegó
por Git y Argo CD.

## Readback del clúster

Observación sanitizada posterior a los merges:

- contexto exacto: `kind-sst-cluster-dev`;
- aplicación Argo CD `sst-app`: `Synced/Healthy`;
- revisión observada por Argo CD:
  `ac63160b2f7358528fe9290f4a171c9cd54c6324`;
- Deployment `sst-chatbot`: `1/1` réplicas Ready;
- pod observado: cero reinicios;
- image ID del contenedor: coincide con el digest inmutable aprobado;
- health interno: `200`;
- grant real `sst-bend -> 4uentes-auth` para `client_credentials`: `200`;
- turno autenticado `sst-bend -> sst-chatbot`: `200` con secuencia NDJSON
  `delta, delta, delta, delta, delta, delta, completed`;
- no existe Ingress público directo para `sst-chatbot`;
- el Secret M2M conserva exactamente las keys requeridas; sus valores no se
  leyeron ni se imprimieron.

La revisión Argo CD es evidencia del desired state efectivamente sincronizado;
no se interpreta como el merge SHA de un PR específico.

## Gate de navegador aislado

El runtime interno pasó, pero el E2E Socket.IO desde navegador continúa
pendiente. El servidor Chrome DevTools dedicado estaba configurado con un
`userDataDir` persistente ya bloqueado por otra instancia. La configuración
local se corrigió para usar `--isolated=true` y eliminar ese path persistente.

El proceso MCP ya iniciado no recarga su configuración en caliente. Por eso el
gate debe ejecutarse en una nueva sesión Codex/MCP. Hasta entonces:

- no se declara E2E browser PASS;
- no se mueve el request a `done`;
- no se autoriza otra mutación de repos hijos, clúster o Jira;
- el próximo paso es sólo readback del navegador y, si pasa, evidencia de
  cierre bajo un lote independiente.

## Límites

- Ambiente: sólo development.
- Sin datos productivos.
- Sin secretos, tokens ni cookies en Git o evidencia.
- Sin escritura Jira.
- Sin acceso público nuevo al chatbot.
