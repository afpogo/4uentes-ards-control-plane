# CR-SST-0180 - Plan de integracion

## Decision

CR-SST-0180 integra los controles ya validados por CR-SST-0159, porta de forma
selectiva los contratos seguros de chat usados por CR-SST-0178 y reemplaza la
decision multi-sesion de CR-SST-0179 por una sola familia activa por cuenta.

No se importa el flujo historico `validate -> delete -> create` de refresh. La
rotacion conserva `sid` y usa CAS sobre la generacion vigente. El logout deja la
familia `userId + sid` terminalmente revocada y un login posterior reemplaza la
familia anterior.

## Limites

- Datos sinteticos solamente; no se permiten datos productivos.
- No hay escrituras Jira.
- No se reutilizan ni alteran checkouts sucios.
- Auth, sesiones y seguridad permanecen bajo el agente principal.
- El rollout y rollback de development se realizan por Git/Argo.
- Produccion, multi-device, RBAC nuevo, rotacion de secretos y tombstones de
  reuse quedan fuera de alcance.

## Perfil operativo

- Clasificacion: `complex-high-risk-task`.
- Provider: `codex`.
- Recursos: `normal`, fuente `default`.
- Perfil: `gpt-5.6-sol`.
- Razonamiento: `max`.
- Fallback: `gpt-5.5 high`, sin degradacion silenciosa de seguridad.

## Desviacion de base del control plane

El remoto de `4uentes-orchestor` no publica `develop`. La consulta remota del
2026-08-15 mostro `origin/main` como unica base canonica, por lo que su worktree
se creo desde `origin/main`. Los repos funcionales conservan `origin/develop`
como base requerida.

