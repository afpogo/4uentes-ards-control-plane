# Proyecto SST

## Alcance

Contenedor para documentacion de la solucion `sst` y sus repos relacionados.

Incluye:

- `sst-fend`
- `sst-bend`
- `sst-extension`
- `sst-chatbot`
- `sst-4uentes-infra`
- servicios compartidos consumidos por SST, como `4uentes-auth`

## Artefactos Canonicos

- Solucion: [../../../solutions/sst.yaml](../../../solutions/sst.yaml)
- Service catalog: [../../apps/service-catalog.md](../../apps/service-catalog.md)
- SST architecture analysis: [../../cross-repo/sst-analisis-arquitectonico-ards-sdd-2026-06-13.md](../../cross-repo/sst-analisis-arquitectonico-ards-sdd-2026-06-13.md)
- Cluster dependency map: [../../cross-repo/sst-cluster-dependency-map.md](../../cross-repo/sst-cluster-dependency-map.md)
- Promotion path allowlist: [../../cross-repo/release-allowlists.md](../../cross-repo/release-allowlists.md)
- Chatbot handoff: [../../cross-repo/sst-chatbot-orchestrator-handoff.md](../../cross-repo/sst-chatbot-orchestrator-handoff.md)

## Documentos Por App

- [sst-fend](../../apps/sst-fend.md)
- [sst-bend](../../apps/sst-bend.md)
- [sst-extension](../../apps/sst-extension.md)
- [sst-chatbot](../../apps/sst-chatbot.md)
- [sst-4uentes-infra](../../apps/sst-4uentes-infra.md)
- [4uentes-auth](../../apps/4uentes-auth.md)

## Iniciativas

- [INIT-SST-0001](../../../initiatives/INIT-SST-0001-tags-governance-continuity.yaml)
- [INIT-SST-0002](../../../initiatives/INIT-SST-0002-dictionary-management.yaml)
- [INIT-SST-0003](../../../initiatives/INIT-SST-0003-sst-extension-construction.yaml)
- [INIT-SST-0004](../../../initiatives/INIT-SST-0004-infrastructure-production-readiness.yaml)

## Limite Operativo

SST no es el scope global del control-plane. Es una solucion logica dentro de
`4uentes-orchestor`.

Trabajo no-SST debe entrar por su propio contenedor de proyecto y por requests
con prefijo no-SST cuando corresponda.
