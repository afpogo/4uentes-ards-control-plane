# CR-SST-0208 - Propuesta De Canonicalización

Fecha: 2026-08-22.

Estado: propuesta histórica supersedida primero por
`canonicalization-decision-2026-08-22.md` y finalmente por
`post-pr37-canonical-readback-2026-08-22.md`. El PR #37 cambió la ref canónica
después de esta propuesta; su tabla se conserva sólo como reconstrucción
histórica y no asigna IDs vigentes.

## Reglas

1. Un ID retenido debe representar una sola intención.
2. Un duplicado compatible puede consolidarse conservando evidencia de los
   artefactos superseded.
3. Una colisión incompatible no se resuelve por orden numérico ni por tracker.
4. Jira-only es intake; el lifecycle local debe adoptarse antes de ejecutar.
5. Una corrección Jira requiere un lote posterior enumerado y autorizado.

## Mapa Propuesto

| Identidad actual | Propuesta | Motivo |
| --- | --- | --- |
| Dos variantes `CR-SST-0199` | Conservar `CR-SST-0199` para un único request consolidado del edge Socket.IO de development; marcar la variante más angosta como artefacto superseded, sin borrar historia Git. | Mismo incidente, mismo boundary Ingress y outcomes compatibles. |
| `CR-SST-0200` SPA/chat visible | Conservar. | Identidad local publicada y única. |
| `CR-SST-0201` raw-v2 | Conservar y aclarar ownership en INIT-SST-0008. | Identidad local publicada y única. |
| `CR-SST-0202` registro/sesión | Candidato a conservar. | Lifecycle local anterior a los otros usos observados. |
| `CR-SST-0202` retención de chat (`SST-113`) | Reasignar sólo después de aprobación; no se propone aún número definitivo. | Colisión incompatible y Jira no es source of truth. |
| `CR-SST-0202` reconciliación de memoria no publicada | Mantener en cuarentena y superseder por CR-SST-0208 para la parte de namespace; cualquier intención residual necesita ID propio. | Nunca fue adoptado como identidad canónica publicada. |
| `CR-SST-0203` seguridad vs. persistencia de chat | Decisión humana requerida. | Jira de chat precede por minutos al commit local de seguridad, pero el contrato exige lifecycle local antes del mirror. La precedencia temporal no resuelve la autoridad. |
| `CR-SST-0204` a `0206` Jira-only | No adoptar todavía como CRs canónicos; recuperar o crear lifecycles sólo mediante decisión explícita. | Falta source of truth local visible. |
| Prerequisito de identidad/scope de memoria | Mantener `CR-SST-TODO-IDENTITY-SCOPE`. | Su ID depende del espacio liberado y del mapa final. |

## Decisiones Que Requieren Aprobación

1. Confirmar que las dos variantes `CR-SST-0199` representan un solo request y
   autorizar su consolidación documental.
2. Confirmar que `CR-SST-0202` queda reservado para registro/sesión y que
   `SST-113` debe recibir otra identidad.
3. Elegir qué intención conserva `CR-SST-0203`.
4. Decidir si `CR-SST-0204` a `0206` se adoptan localmente con su identidad Jira
   o si el bloque completo de retención se reasigna.
5. Después de esas decisiones, reservar IDs libres para retención, memoria y
   el prerequisito de identidad/scope.
6. Autorizar o separar la implementación de un validador de unicidad: el gate
   actual procesa `CR-SST-0199` dos veces y aun así finaliza exitosamente.

## Acciones Aún Prohibidas

- editar, comentar, transicionar o reparentar `SST-86` y `SST-113` a `SST-117`;
- eliminar archivos históricos o reescribir commits;
- modificar repositorios funcionales;
- iniciar CR-SST-0194;
- asignar un número al prerequisito de identidad/scope de memoria.
