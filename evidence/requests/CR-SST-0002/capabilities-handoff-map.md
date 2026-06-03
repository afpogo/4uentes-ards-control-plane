# CR-SST-0002 - Mapa De Handoff De Capabilities Cross-Repo

Observado el: 2026-05-18

## Flow Canonico

```text
sst-bend backend-api
  outbound dictionary capability
    -> 4uentes-auth shared-auth-provider/BFF
      inbound from sst-bend
      outbound BFF facade
        -> sst-fend frontend-web inbound
        -> sst-extension frontend-extension inbound optional
```

La identidad canonica de servicio es `4uentes-auth`. El label local/legacy de
productor o repo `node-auth` aparece en artefactos de capability de repos hijos
por compatibilidad y no debe convertirse en identidad canonica dentro del
catalogo del control-plane.

## Familias De Capability

| Capability | Productor | Artefacto productor | Adopcion BFF | Facade BFF | Consumidores |
|---|---|---|---|---|---|
| `dictionary-legacy-read` | `sst-bend` | `sst-bend:specs/capabilities/outbound/dictionary-legacy-read.yaml` | `4uentes-auth:specs/capabilities/inbound/sst-bend--dictionary-legacy-read.yaml` | `4uentes-auth:specs/capabilities/outbound/dictionary-legacy-read.yaml` | `sst-fend` implemented; `sst-extension` draft/no functional wiring |
| `dictionary-domain-read-v1` | `sst-bend` | `sst-bend:specs/capabilities/outbound/dictionary-domain-read-v1.yaml` | `4uentes-auth:specs/capabilities/inbound/sst-bend--dictionary-domain-read-v1.yaml` | `4uentes-auth:specs/capabilities/outbound/dictionary-domain-read-v1.yaml` | `sst-fend` implemented; `sst-extension` cubierto por subset dictionary management donde aplica |
| `dictionary-domain-management-v1` | `sst-bend` | `sst-bend:specs/capabilities/outbound/dictionary-domain-management-v1.yaml` | `4uentes-auth:specs/capabilities/inbound/sst-bend--dictionary-domain-management-v1.yaml` | `4uentes-auth:specs/capabilities/outbound/dictionary-domain-management-v1.yaml` | `sst-fend` implemented; `sst-extension` implemented optional-active |
| `dictionary-domain-v1` | `sst-bend` | `sst-bend:specs/capabilities/outbound/dictionary-domain-v1.yaml` | Conceptual/seed capability | No es facade primaria actual | Usada como target-state/context, no como execution gate |
| `article-tags` | `sst-bend` | `sst-bend:specs/capabilities/outbound/article-tags.yaml` | TODO/no forma parte de validacion CR-SST-0002 | TODO | Capability adyacente de tags; no promovida como evidencia de completion de CR-SST-0002 |

## Artefactos Consumidores

### sst-fend

- `sst-fend:specs/capabilities/inbound/node-auth--dictionary-legacy-read.yaml`
- `sst-fend:specs/capabilities/inbound/node-auth--dictionary-domain-read-v1.yaml`
- `sst-fend:specs/capabilities/inbound/node-auth--dictionary-domain-management-v1.yaml`
- `sst-fend:docs/capabilities/inbound/node-auth--dictionary-legacy-read.md`
- `sst-fend:docs/capabilities/inbound/node-auth--dictionary-domain-read-v1.md`
- `sst-fend:docs/capabilities/inbound/node-auth--dictionary-domain-management-v1.md`

### sst-extension

- `sst-extension:specs/integration/inbound/node-auth--dictionary-domain-management-v1.yaml`
- `sst-extension:docs/integration/inbound/node-auth--dictionary-domain-management-v1.md`
- `sst-extension:specs/integration/inbound/node-auth--dictionary-legacy-read.yaml`
- `sst-extension:docs/integration/inbound/node-auth--dictionary-legacy-read.md`

## Estado De Adopcion Actual

| Edge | Estado | Evidencia |
|---|---|---|
| `sst-bend -> 4uentes-auth` dictionary legacy read | implemented | Existen BFF inbound capability y route proxy. |
| `sst-bend -> 4uentes-auth` dictionary domain read | implemented | Existen BFF inbound capability y route proxy. |
| `sst-bend -> 4uentes-auth` dictionary management | implemented | Existen BFF inbound capability y route proxy. |
| `4uentes-auth -> sst-fend` dictionary legacy/domain/management | implemented | Existen frontend inbound capabilities, service layer, Redux y UI tests. |
| `4uentes-auth -> sst-extension` dictionary management | implemented optional-active | Feature/integration specs, messages, gateway y tests/build de extension pasaron. |
| `4uentes-auth -> sst-extension` dictionary legacy | draft/no functional wiring | Documentado como no cableado funcionalmente. |
| `sst-4uentes-infra -> SST services` deployment governance | partial/blocked | Existen deployment contracts, pero checks locales kube/GitOps estan bloqueados por acceso de ambiente. |

## Conclusion Gate 4 Para Capabilities

El handoff de dictionary esta modelado y validado localmente para el camino
principal:

```text
sst-bend -> 4uentes-auth -> sst-fend
```

El camino opcional de extension tambien esta modelado y validado para dictionary
management:

```text
sst-bend -> 4uentes-auth -> sst-extension
```

No cerrar `article-tags`, translations/aliases, final encryption-at-rest,
offline mode ni extension account-context wiring como completados por este
request. Requieren requests separados.
