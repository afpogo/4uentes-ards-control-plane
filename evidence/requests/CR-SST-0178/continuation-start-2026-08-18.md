# Continuación gobernada de CR-SST-0178

## Objetivo

Retomar el deployment de `sst-chatbot` desde los heads remotos vigentes de cada
owner, sin reutilizar las ramas o worktrees históricos del 13 de agosto.

## Autorización

La instrucción del usuario del 18 de agosto autoriza continuar el scope de
development de `CR-SST-0178`. Se permiten cambios acotados en `sst-chatbot`,
`sst-4uentes-infra` y `4uentes-auth`; `sst-bend` sólo puede cambiar si el audit
del head vigente demuestra que su contrato de configuración es insuficiente.
`sst-fend` se usa únicamente para validación.

No se autoriza producción, datos productivos, Jira, un Ingress público para el
chatbot ni secretos en Git o evidencia.

## Orden de ejecución

1. Actualizar refs remotas y leer policies owner.
2. Auditar los contratos actuales antes de crear cambios.
3. Crear un worktree limpio por owner desde su ref remota vigente.
4. Implementar solamente gaps observados y mantener docs/specs owner.
5. Ejecutar checks owner y el check completo del control-plane.
6. Renderizar y revisar GitOps antes del rollout de development.
7. Validar health, M2M, NDJSON, Socket.IO y navegador aislado.
8. Registrar evidencia sanitizada y decidir si `CR-SST-0178` puede cerrar.

## Estado inicial

- El PR #22 del control-plane está fusionado en `main`.
- Los working copies históricos de Auth, Bend, Infra y Fend contienen cambios
  ajenos; no se modificarán.
- `sst-chatbot` local está detrás de `origin/develop`; tampoco se reutilizará.
- El fetch SSH de Infra falló por autenticación local. Se refrescó
  `origin/develop` mediante HTTPS sin modificar el remote configurado.

## Heads owner auditados

| Owner | Baseline vigente | Decisión |
| --- | --- | --- |
| `sst-chatbot` | `origin/develop@4fdd4165e320` | Mutación acotada: packaging, health y publicación de imagen. |
| `sst-4uentes-infra` | `origin/develop@7f3b544` | Mutación acotada: desired state interno, M2M por referencias y flag realtime. |
| `4uentes-auth` | `origin/develop@4249ba3bd949` | Validación: ya contiene M2M, JWKS y la autoridad de sesiones CR-SST-0180. |
| `sst-bend` | `origin/develop@a73acedbd13e` | Validación: ya contiene Socket.IO, introspección y cliente NDJSON/M2M configurables. |
| `sst-fend` | `origin/develop@4e32823ca3c1` | Validación: ya contiene `/chat` y el cliente Socket.IO; sin mutación. |

No se reutilizó ni alteró ninguna working copy owner con cambios preexistentes.
Los worktrees nuevos parten exclusivamente de los refs anteriores.

## Implementación owner local

`sst-chatbot`:

- imagen Python slim con runtime no privilegiado `10001:10001`;
- dependencias runtime separadas de tooling/notebooks;
- `GET /healthz` mínimo y sin configuración;
- tests de health y ruta desconocida;
- workflow de build/publicación de tags development;
- contrato y documentación owner actualizados con `CR-SST-0178`.

`sst-4uentes-infra`:

- Deployment, Service y ConfigMap de `sst-chatbot` sin Ingress público;
- probes HTTP, filesystem de sólo lectura y capabilities eliminadas;
- wiring de `sst-bend` a `sst-chatbot-service:8091` y flag realtime activo;
- M2M inyectado sólo desde `sst-chat-m2m-secret`, nunca versionado;
- deployment contract y runbook owner;
- validación CI explícita de la presencia del workload y ausencia de ruta Ingress.

## Validación local completada

- Chatbot focused: `7 passed`.
- Chatbot full owner gate: `167 passed`, ARDS/SDD y tres smokes PASS.
- Infra: `npm.cmd run check` PASS, incluyendo render Kustomize y dry-run client.
- Imagen `sst-chatbot:cr-sst-0178`: build PASS.
- Contenedor temporal aislado: `health=ok`, user `10001:10001` y turno sin
  credencial `401`; fue detenido y no contenía secretos.

## Gates aún abiertos

- publicar el tag owner inmutable y reflejarlo en GitOps;
- comprobar/provisionar fuera de Git las dos keys de `sst-chat-m2m-secret`;
- fusionar el desired state y obtener readback persistente de Argo CD;
- validar grant M2M, NDJSON, Socket.IO y Chrome DevTools aislado;
- ejecutar checks finales ligados a los commits publicados y decidir cierre.

## Publicación owner

- Chatbot: commit `775a7a2`, PR draft
  [afpogo/sst-chatbot#9](https://github.com/afpogo/sst-chatbot/pull/9).
- Infra: commit `33aa4c7`, PR draft
  [afpogo/sst-4uentes-infra#7](https://github.com/afpogo/sst-4uentes-infra/pull/7).

Infra pasó sus cuatro checks remotos. Los checks de Chatbot quedaron en curso al
registrar este snapshot. Ambos PRs apuntan a `develop` y son mergeables; Infra
permanece draft y no debe fusionarse con el tag mutable.

## Preflight del cluster development

Readback no mutante y sanitizado:

- contexto exacto `kind-sst-cluster-dev`;
- Argo CD `sst-app`: `Synced/Healthy` en revisión `7f3b544`;
- existe un Deployment/Service histórico `sst-chatbot` con imagen mutable
  `ghcr.io/afpogo/sst-chatbot:develop`;
- el Deployment histórico tiene user `10001:10001`, filesystem de sólo lectura
  y referencia a `sst-chat-m2m-secret`;
- el Secret existe y contiene exactamente las dos keys requeridas; sus valores
  no se leyeron ni imprimieron;
- el runtime histórico devuelve `404` en `/healthz`;
- el ConfigMap histórico de Bend no contiene aún el flag realtime ni el DNS del
  chatbot.

Conclusión: los recursos existentes son la ejecución transitoria anterior, no
una validación del nuevo artefacto. No se aplicó ni reinició ningún workload. El
orden seguro sigue siendo publicar la imagen nueva, fijar su tag inmutable en el
PR Infra y recién entonces permitir reconciliación GitOps.
