CR-SST-0152 cierre validado del tren minimo de release SST development.

- ARDS/SDD local: `done`; el control-plane permanece como source of truth.
- Frontend PR: `afpogo/sst-fend#6`, merge `b5742eb709d555dd5c9bbc5d58a6bfdd90c47b8b`.
- Imagen validada: `ghcr.io/afpogo/sst-fend:develop-b5742eb709d5`.
- Digest: `sha256:0553e81211589d1582fa4907c8ef71d4cff1a92a75b05d5c321a1c934a06fe3a`.
- GitOps: `c54d36cf1e95300406ba3c89b0d59b18d65ce8d9`.
- Argo CD: `Synced/Healthy`; deployment `1/1`; pod ready sin reinicios.
- Smoke HTTP: `/`, `/signup`, `/learning` y bundle principal respondieron `200`.
- Evidencia: `evidence/requests/CR-SST-0152/closure-and-rollout-2026-08-10.md`.
- Validacion del control-plane: `npm run check` PASS.
