# CR-SST-0207 - Decisión de canonicalización

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
| `CR-SST-0202` | Sesión Auth durante registro | Se porta el lifecycle commiteado previo al mirror de retención. |
| `CR-SST-0203` | Reconciliación de mirrors Jira de seguridad preproductiva | Se porta el lifecycle completo y su evidencia; primaria `INIT-SST-0008`. |
| `CR-SST-0204` | Runtime Redis de chat en development | Se conserva y publica localmente como child de `0208`. |
| `CR-SST-0205` | UX de consentimiento de retención | Se conserva y publica localmente como child de `0208`. |
| `CR-SST-0206` | QA integrado de retención | Se conserva y publica localmente como child de `0208`. |
| `CR-SST-0207` | Gobernanza del namespace | Se conserva como coordinador único. |
| `CR-SST-0208` | Contrato padre de retención consciente | Reasignado desde el `0202` no publicado. |
| `CR-SST-0209` | Persistencia/cache Bend para retención | Reasignado desde el `0203` no publicado. |
| `CR-SST-0210` | Identidad, tenant y application scope para memoria | Reservado conceptualmente; no se publica hasta reconciliar `INIT-SST-0010`. |

El `CR-SST-0202` no publicado de reconciliación de memoria queda absorbido por
el análisis de `CR-SST-0207`; sus YAML no se portan. Su intención funcional
residual deberá entrar por un lifecycle separado.

## Regla de reserva

El primer acto de una nueva identidad será un PR mínimo con su archivo
`requests/inbox/CR-...`. Los worktrees de ejecución sólo se abren después de
fusionar esa reserva y refrescar `origin/main`. El gate de identidades es un
required check candidato para impedir que una segunda reserva concurrente se
fusione.

## Pendientes externos

- Corregir `SST-113` de `0202` a `0208` y `SST-114` de `0203` a `0209` requiere
  un lote Jira enumerado y autorizado.
- Publicar el branch de reconciliación y luego integrar los commits de QA
  válidos sin reescribir historia.
- Publicar `INIT-SST-0010` y recién entonces crear `CR-SST-0210`.
