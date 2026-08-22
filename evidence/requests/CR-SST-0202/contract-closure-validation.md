# Validación de cierre del contrato CR-SST-0202

Fecha: 2026-08-22.

## Resultado

`CR-SST-0202` queda aprobado como decisión transversal del control plane. El
request no implementa endpoints, modelos, UI ni infraestructura; esos cambios
permanecen separados en `CR-SST-0204` a `CR-SST-0206`, con QA integrado en
`CR-SST-0207`.

## Matriz de aceptación

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Una conversación temporal no se escribe en PostgreSQL | PASS | El estado temporal declara Redis/memoria volátil con TTL y prohíbe persistencia durable implícita |
| Guardar en SST exige consentimiento explícito | PASS | La promoción durable nace únicamente de la acción `Guardar en SST` |
| PostgreSQL conserva autoridad durable | PASS | Redis está definido como cache-aside y una escritura confirma PostgreSQL primero |
| Lecturas y mutaciones quedan ligadas al principal autenticado | PASS | El contrato exige ownership para read, promotion, finish y delete |
| Limpieza local, finalización temporal y eliminación durable no se confunden | PASS | Cada acción tiene alcance y consecuencia independientes |
| La sincronización de navegador no depende de gRPC | PASS | Socket.IO conserva el boundary browser; Redis pub/sub puede coordinar réplicas |
| Cada owner tiene un lifecycle independiente | PASS | Bend `0204`, Infra `0205`, Fend `0206`, QA `0207` |
| Jira mantiene jerarquía y dependencias sin asumir autoridad | PASS | `SST-113` bajo `SST-86`; `SST-114` a `SST-117` como Subtasks y links `Blocks` |

## Boundaries confirmados

- `sst-bend` será autoridad para el contrato runtime, ownership, PostgreSQL y cache.
- `sst-4uentes-infra` será autoridad para Redis y su operación en development.
- `sst-fend` será autoridad para UX, accesibilidad y consentimiento visible.
- El control plane conserva lifecycle, dependencias, decisión y evidencia.
- No se modificó ningún repositorio funcional, clúster ni dato de usuario.

## Riesgos residuales transferidos

- La elección de TTL exacto y la política de degradación requieren decisión owner en `CR-SST-0204`.
- La topología, recursos y secreto de Redis pertenecen a `CR-SST-0205`.
- El copy final y la interacción de confirmación pertenecen a `CR-SST-0206`.
- Las carreras de promoción/borrado y el aislamiento cross-user deben probarse en `CR-SST-0207`.

## Gates

- Revisión de arquitectura y privacidad: PASS.
- Atomización por owner: PASS.
- Owner-documentation gate: no aplica a este CR sin mutación hija; está planificado en cada CR owner.
- Jira transition: no ejecutada; el contrato de conexión vigente la prohíbe.
- Control-plane `npm run check`: se registra en el artefacto done después de su ejecución final.
