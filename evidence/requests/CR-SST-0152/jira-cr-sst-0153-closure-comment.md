CR-SST-0153 cierre validado de la separacion entre preview y contexto aceptado.

- ARDS/SDD local: `done`; Jira es solamente el mirror operativo.
- La UI mantiene separado el contenido de preview del contexto explicitamente aceptado.
- La validacion quedo incluida en `afpogo/sst-fend#6`, merge `b5742eb709d555dd5c9bbc5d58a6bfdd90c47b8b`.
- Rollout dev validado con Argo CD `Synced/Healthy`, deployment `1/1` y smokes HTTP `200`.
- Evidencia: `evidence/requests/CR-SST-0152/closure-and-rollout-2026-08-10.md`.
- Request cerrado: `requests/done/CR-SST-0153-learning-preview-accepted-context-separation.yaml`.
- Validacion del control-plane: `npm run check` PASS.
