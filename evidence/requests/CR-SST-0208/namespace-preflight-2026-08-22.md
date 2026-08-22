# CR-SST-0208 - Preflight Del Namespace SST

Fecha: 2026-08-22.

Estado: preflight histórico anterior al merge del PR #37. La reserva vigente
de `CR-SST-0208` y la reasignación de Auth a `CR-SST-0209` se verifican en
`post-pr37-canonical-readback-2026-08-22.md`.

## Alcance

Se aplicaron `work-tracker-control-plane-authority-policy`,
`jira-cr-mirror-hierarchy-policy`, `agent-architecture-boundary-policy`,
`agent-task-atomization-policy` y `owner-documentation-authority-policy`.

La revisión fue read-only sobre Jira y Git. No se modificaron repositorios
funcionales, ambientes ni issues.

## Reserva De CR-SST-0208

`CR-SST-0208` no apareció en:

- el working tree publicado desde `origin/main`;
- ninguna ref local ni remote-tracking disponible;
- la historia Git alcanzable por esas refs;
- búsquedas Jira de summary y texto para `CR-SST-0208`;
- el bloque adicional `CR-SST-0208` a `CR-SST-0220` consultado como margen.

Por eso `CR-SST-0208` se reserva exclusivamente para gobernar esta
reconciliación. No se asigna todavía un ID numérico al prerequisito de memoria.

## Matriz De Colisiones

| ID | Intenciones observadas | Estado de autoridad |
| --- | --- | --- |
| `CR-SST-0199` | `Route realtime Socket.IO through development Ingress` y `Expose the protected development realtime edge` | Ambos lifecycles están publicados en `origin/main`; parecen compatibles y solapados, pero deben consolidarse mediante decisión explícita. Jira sólo los referencia en la descripción de `SST-86`; no existe issue primario con ese ID. |
| `CR-SST-0200` | `Make chat visible and repair SPA session teardown` | Lifecycle publicado en `origin/main`; Jira lo referencia en `SST-86`, sin issue primario propio observado. |
| `CR-SST-0201` | `Adopt raw-v2 gradually in development` | Lifecycle publicado en `origin/main`; pertenece técnicamente a INIT-SST-0008 y es referenciado por `SST-86`, sin issue primario propio observado. |
| `CR-SST-0202` | Registro web establece sesión; retención consciente del chat; reconciliación local de memoria | Colisión incompatible entre una ref Git anterior, Jira `SST-113` y un working tree local no publicado. |
| `CR-SST-0203` | Reconciliación de mirrors de seguridad; persistencia Bend/Redis de chat | Colisión incompatible entre la ref `docs/system-feature-studies` y Jira `SST-114`. |
| `CR-SST-0204` | Runtime Redis para chat | Sólo Jira `SST-115`; no se encontró lifecycle local en las refs revisadas. |
| `CR-SST-0205` | UX de consentimiento de retención | Sólo Jira `SST-116`; no se encontró lifecycle local en las refs revisadas. |
| `CR-SST-0206` | QA integrado de retención | Sólo Jira `SST-117`; no se encontró lifecycle local en las refs revisadas. |

## Cronología Relevante

- La variante Ingress de `CR-SST-0199` entró en Git el 2026-08-21 a las
  01:02:11 -03:00.
- La variante protected-edge del mismo ID entró a las 03:12:48 -03:00.
- `CR-SST-0202` de registro/sesión entró en una ref Git el 2026-08-21 a las
  20:12:40 -03:00.
- Jira `SST-113` a `SST-117` se creó el 2026-08-22 entre las 13:05:26 y
  13:05:49 -03:00.
- `CR-SST-0203` de reconciliación de seguridad entró en Git el 2026-08-22 a
  las 13:08:29 -03:00, después de `SST-114`.

La cronología ayuda a revisar precedencia, pero no reemplaza la autoridad
ARDS/SDD ni autoriza una renumeración automática.

## Gaps De Jerarquía Jira

- `CR-SST-0199`, `0200` y `0201` aparecen en la descripción de `SST-86`, pero
  no tienen un issue Jira primario observado.
- `SST-113` es una Tarea bajo `SST-86` y usa `CR-SST-0202`.
- `SST-114` a `SST-117` son Subtasks de `SST-113` y usan `CR-SST-0203` a
  `CR-SST-0206`.
- Las identidades `0204` a `0206` fueron publicadas en Jira sin lifecycle
  local visible en las refs revisadas.

Estas señales bloquean creación, transición o corrección Jira hasta que exista
un mapa local aprobado y un lote enumerado separado.

## Protección De Datos

La evidencia conserva únicamente IDs de CR, issue keys, nombres técnicos,
fechas y refs Git. No conserva URLs Jira, cloud IDs, account IDs, correos,
tokens, cookies, claims, secretos ni datos de usuario.

## Addendum posterior al inventario paralelo

El scan global requerido por el nuevo gate detectó también la colisión
histórica `CR-SST-0016`, anterior a este bloque numérico. Se documentó como
excepción congelada por rutas exactas en
`specs/integration/request-identity-exceptions.json`; no habilita reutilización.

La revalidación Jira en vivo confirmó que `SST-113` a `SST-117` permanecen
`Tareas por hacer` y mantienen la jerarquía Task/Subtask observada. El resultado
sanitizado vive en `jira-live-readback-2026-08-22.md`.
