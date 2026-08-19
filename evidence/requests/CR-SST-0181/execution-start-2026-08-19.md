# Inicio reconciliado de CR-SST-0181

## Autoridad

`CR-SST-0181` fue publicado como `planned` y autorizado para mutar únicamente
`4uentes-auth` mediante el PR #27 del control plane. El 2026-08-19 el usuario
confirmó el merge y pidió continuar. No se autorizaron Jira, producción,
despliegue ni creación de secretos.

## Reconciliación de orden

La implementación local comenzó desde una worktree limpia de
`4uentes-auth@origin/develop` después del merge del lifecycle. El artefacto
phase 3 se registró más tarde dentro de la misma unidad de ejecución. Esta
desviación se hace explícita: el plan aprobado sí existía antes de la mutación,
pero la transición `planned → running` no había sido materializada todavía.

## Readback local sanitizado

- Branch: `agent/cr-sst-0181-auth-independent-families`.
- Base observada: `origin/develop@4249ba3`.
- Check owner completo: verde.
- Matriz determinista: familias web/extensión independientes, CAS de un ganador,
  logout por `sid`, migración legacy y negativos M2M.
- Mongo aislado: 25 rondas con dos procesos Node y una base sintética loopback.
- Cleanup: base sintética ausente y contenedor sin volumen eliminado.
- Consumidor: `sst-bend@origin/develop@8fe60f4` coincide en audience, scope,
  body y eco de identidad; pasaron `test:service-token`, `test:chat-guards` y
  `test:chat-security` en una worktree detached sin cambios.
- No se conservaron tokens, cookies, emails, IP ni valores M2M en evidencia.

La búsqueda read-only no encontró workflows ni manifests Infra que transporten
las variables M2M desde GitHub. Auth documenta los puntos esperados, pero su
creación queda bloqueada hasta que el gate Infra defina la custodia efectiva.

## Gate pendiente

La implementación Auth permanece local. Antes del cierre se debe publicar el PR
draft owner y volver a ejecutar el check completo del control plane. La
reconciliación de índices de una base existente, la creación de secretos y
cualquier rollout pertenecen a gates posteriores.
