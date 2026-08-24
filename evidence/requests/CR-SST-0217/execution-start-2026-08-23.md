# Inicio de ejecucion de CR-SST-0217

Fecha: 2026-08-23.

## Objetivo

Desbloquear el preflight de CR-SST-0207 mediante un cambio GitOps exclusivo de
development y la recuperacion verificable del endpoint durable local.

## Autorizacion

El operador autorizo avanzar con el lifecycle separado de infraestructura el
2026-08-23. La autorizacion permite publicar CR-SST-0217, modificar solamente
`sst-4uentes-infra`, fusionar el cambio GitOps de development y observar la
reconciliacion de Argo CD.

No permite reiniciar o recrear el cluster, aplicar manifests directamente,
modificar produccion, datastores, secretos o codigo de aplicaciones.

## Plan atomizado

| Unidad | Output | Riesgo | Definition of Done |
| --- | --- | --- | --- |
| Lifecycle | Inbox, planned y running publicados | medio | `npm run check` sin fallos |
| Jira mirror | Una Subtask nueva bajo `SST-113`, en curso | medio | Readback sin campos extra ni resolucion |
| Owner GitOps | Override development `true` y TTL `120` | alto | PR Infra fusionado y render validado |
| Owner docs | Specs, state y runbook coherentes | medio | Full check Infra PASS |
| Runtime | Argo Synced/Healthy y config live | alto | Readback no secreto |
| Ingress | localhost y ngrok recuperados | alto | smokes aprobados; cualquier reinicio usa gate nuevo |
| Handoff | CR-SST-0207 reanudable | alto | prerequisitos de matriz en PASS |

## Lote Jira exacto

Despues de fusionar este lifecycle se autoriza:

1. crear una unica `Subtask` en el proyecto `SST`, bajo `SST-113`, con summary
   `[CR-SST-0217] Habilitar runtime development para QA de retencion`;
2. transicionar solamente la nueva Subtask a `En curso`;
3. no agregar comentarios, links, assignee, labels ni editar otro issue.

El lote se consume despues del readback. Jira permanece como espejo y no es
fuente de verdad.

## Evidencia sensible

No se registraran dominios privados, credenciales, cookies, JWT, tokens,
secretos Redis ni cuerpos de conversaciones.
