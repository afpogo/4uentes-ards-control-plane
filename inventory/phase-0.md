# Fase 0 - Inventario ARDS/SDD

Observado el: 2026-05-17

## Resumen

- Repos relevantes catalogados: `5`
- Servicios logicos SST catalogados: `4`
- Infraestructura SST catalogada: `1`
- Servicio compartido detectado: `4uentes-auth`
- Alias legacy principal: `node-auth`
- Runtime adicional opcional confirmado: `sst-extension`

## Repos Detectados Relevantes

| Repo detectado | Path local observado | Remote Git | Branch | Working tree | Package name | Identidad canonica | Alias legacy | Observaciones |
|---|---|---|---|---|---|---|---|---|
| `node-auth` | `C:\Users\andre\Desktop\4uentes\apps\node-auth` | `git@github.com:afpogo/4uentes-auth.git` | `main` | clean | `4uentes-auth` | `4uentes-auth` | `node-auth` | Auth/BFF compartido |
| `sst-fend` | `C:\Users\andre\Desktop\4uentes\apps\sst-fend` | `git@github.com:afpogo/sst-fend.git` | `develop` | dirty `258` | `sst-fend` | `sst-fend` | `AGENTS.ms` | Frontend SPA SST con ARDS/SDD ready |
| `sst-bend` | `C:\Users\andre\Desktop\4uentes\apps\4uentes-sstbend\sst-bend` | `git@github.com:afpogo/sst-bend.git` | `develop` | dirty `42`, stash `1` | `sst` | `sst-bend` | package `sst` | API SST y scrapper observado |
| `sst-extension` | `C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\sst-extension` | `git@github.com:afpogo/sst-extension.git` | `main` | bootstrap/no commits | `sst-extension` | `sst-extension` | TODO | Runtime Manifest V3 real con ARDS/SDD ready |
| `sst-4uentes-infra` | `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra` | `git@github.com:afpogo/sst-4uentes-infra.git` | `develop` | dirty `25` | TODO | `sst-4uentes-infra` | TODO | GitOps/Kubernetes SST |

## ARDS/SDD Readiness

| Repo | AGENTS.md | specs/00-index.yaml | docs/00-overview.md | docs/ai/policy.md | Check command | Estado ARDS | Accion sugerida |
|---|---|---|---|---|---|---|---|
| `4uentes-auth` | si | si | si | si | `npm run check` | ready | Catalogar como shared auth |
| `sst-fend` | si | si | si | si | `npm run check` | ready | Catalogar como frontend SST |
| `sst-bend` | si | si | si | si | `npm run check` | ready | Catalogar como API SST |
| `sst-extension` | si | si | si | si | `pnpm run check` | ready | Catalogar como browser extension SST |
| `sst-4uentes-infra` | si | si | si | si | TODO | ready | Catalogar como infraestructura SST |

## Servicios Logicos Inferidos

| Service ID | Repo canonico | Tipo | Compartido | Soluciones consumidoras | Alias legacy | Runtime esperado | Estado |
|---|---|---|---|---|---|---|---|
| `4uentes-auth` | `4uentes-auth` | `shared-auth-provider` | si | `sst`, `fulbito` | `node-auth` | service | active |
| `sst-fend` | `sst-fend` | `frontend-spa` | no | `sst` | `AGENTS.ms` | web-app | active |
| `sst-bend` | `sst-bend` | `api` | no | `sst` | package `sst` | service | active |
| `sst-extension` | `sst-extension` | `browser-extension` | no | `sst` | TODO | Manifest V3 app | optional-active |
| `sst-4uentes-infra` | `sst-4uentes-infra` | `gitops-infrastructure` | no | `sst` | TODO | Kubernetes/GitOps | active |

## Solucion Logica SST

| Solution ID | Nombre | Servicios incluidos | Servicios compartidos | Infraestructura | Estado |
|---|---|---|---|---|---|
| `sst` | `SST` | `sst-fend`, `sst-bend`; optional: `sst-extension` | `4uentes-auth` | `sst-4uentes-infra` | active |

## Decisiones Recomendadas

1. Mantener `4uentes-auth` como identidad canonica y `node-auth` como alias
   legacy/local.
2. Incluir `sst-fend` en el manifest porque existe repo remoto, ARDS/SDD
   completo y runtime frontend activo.
3. Incluir `sst-extension` en el manifest como `optional-active` porque existe
   runtime Manifest V3 real y ARDS/SDD completo, pero no debe ser obligatorio
   por defecto.
4. No crear `sst-solution` en Fase 0; modelar SST como solucion logica.
5. No crear `node-auth` como repo nuevo.

## Riesgos

| Riesgo | Descripcion | Mitigacion |
|---|---|---|
| Identidad vs path local | `4uentes-auth` vive localmente como `node-auth` | Usar `service_id=4uentes-auth` y `legacy_alias=node-auth` |
| Dirty working trees | `sst-fend`, `sst-bend` e infra tienen cambios locales | Guardar como evidencia observada, no como baseline estable |
| Repo sin commits | `sst-extension` no tiene HEAD valido | Catalogar como runtime real con riesgo de bootstrap Git |
| Dependencia de jerarquia local | `4uentes-sst` parece agrupador local | No derivar identidad canonica desde carpetas contenedoras |

## Proximos Pasos

1. Agregar verifier `verify-catalog` para parsear YAML y validar referencias.
2. Agregar verifier `verify-local-bindings` para revisar paths observados sin
   hacerlos canonicos.
3. Completar catalogo con `fulbito` solo despues de resolver identidad
   `fulbito` vs `fulvito`.
