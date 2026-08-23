# Inicio de ejecución CR-SST-0211

## Autorización

El usuario autorizó el 2026-08-23:

> Ejecutar CR-SST-0211 exclusivamente en 4uentes-auth, desde un worktree
> limpio basado en origin/develop, sin Jira, Fend, deployment ni producción.

## Gates previos

- `CR-SST-0204` está `done` en control plane.
- El contrato Bend `chat-retention-v1` está `active` y su capability
  `ready-for-consumer` en `sst-bend/develop@f58e0a9`.
- La reserva de `CR-SST-0211` ya estaba publicada como planned.
- El checkout canónico de `4uentes-auth` está sucio y se preservará intacto.
- No existe autorización Jira, Fend, deployment o producción.

## Aislamiento requerido

- Owner: `4uentes-auth`.
- Base: último `origin/develop` observado después de fetch.
- Branch: `feat/CR-SST-0211/chat-retention-facade`.
- Worktree: `4uentes-orchestor/worktrees/CR-SST-0211-auth-owner`.

Antes de mutar el owner se publicará este lifecycle `running`. Luego se leerán
completamente `AGENTS.md`, las policies owner y el contrato Bend publicado.
