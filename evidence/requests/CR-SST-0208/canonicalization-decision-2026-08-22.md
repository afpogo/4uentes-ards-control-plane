# CR-SST-0208 - Decisión de canonicalización

Fecha: 2026-08-22.

## Autoridad aplicada

La decisión usa esta precedencia: árbol publicado en `origin/main`, lifecycle y
evidencia commiteados en una branch, artefacto no trackeado y, por último, Jira
como mirror. La fecha ayuda a reconstruir eventos, pero no reemplaza esa
autoridad.

El usuario autorizó normalizar únicamente este control plane. No se modificaron
repositorios funcionales, entornos ni Jira.

## Namespace canónico

| ID | Intención canónica | Disposición |
| --- | --- | --- |
| `CR-SST-0016` | Tag prefix engine POC; onboarding de chatbot queda como alias histórico | Excepción congelada por cuatro rutas exactas; ningún archivo nuevo puede usar el ID. |
| `CR-SST-0199` | Socket.IO por Ingress de development | Se conserva el primer slug publicado y se retira del árbol vivo el alias compatible. La historia Git no cambia. |
| `CR-SST-0200` | Chat visible y reparación de sesión SPA | Se conserva. |
| `CR-SST-0201` | Adopción gradual raw-v2 | Se conserva con `INIT-SST-0008` como iniciativa técnica primaria. |
| `CR-SST-0202` | Contrato de retención consciente | Se conserva como `done`; el artefacto `running` residual se retira del árbol vivo. |
| `CR-SST-0203` | Reconciliación de mirrors Jira de seguridad preproductiva | Se conserva como `done`; primaria `INIT-SST-0008`. |
| `CR-SST-0204` | Persistencia/cache Bend para retención | Se conserva como child planificado de `0202`. |
| `CR-SST-0205` | Runtime Redis de chat en development | Se conserva como child planificado de `0202`. |
| `CR-SST-0206` | UX de consentimiento de retención | Se conserva como child planificado de `0202`. |
| `CR-SST-0207` | QA integrado de retención | Se conserva como child planificado de `0202`. |
| `CR-SST-0208` | Gobernanza del namespace y policy de lifecycle de worktrees | Reasignado desde el ID local no fusionado `0207`; no tiene mirror Jira. |
| `CR-SST-0209` | Sesión Auth durante registro | Reasignado desde el ID local no fusionado `0202`; no tiene mirror Jira. |
| `CR-SST-0210` | Identidad, tenant y application scope para memoria | Reservado conceptualmente; no se publica hasta reconciliar `INIT-SST-0010`. |

Los contratos de retención duplicados que existían únicamente en el PR #38 se
retiran. El mapa publicado por el PR #37 prevalece completo. El request Auth se
preserva porque representa una intención diferente y todavía no publicada.

## Regla de reserva

El primer acto de una nueva identidad será un PR mínimo con su archivo
`requests/inbox/CR-...`. Los worktrees de ejecución sólo se abren después de
fusionar esa reserva y refrescar `origin/main`. El gate de identidades es un
required check candidato para impedir que una segunda reserva concurrente se
fusione.

## Pendientes externos

- No se requiere corrección Jira: `SST-113` a `SST-117` conservan el mapa
  `0202`, `0204`, `0205`, `0206` y `0207` publicado por el PR #37.
- Publicar el branch de reconciliación como `CR-SST-0208`.
- Ejecutar `CR-SST-0209` sólo después de una aprobación owner separada.
- Publicar `INIT-SST-0010` y recién entonces crear `CR-SST-0210`.
