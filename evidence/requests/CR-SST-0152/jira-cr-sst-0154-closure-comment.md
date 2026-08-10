CR-SST-0154 cierre validado de la clasificacion de presentacion de fuentes de aprendizaje.

- ARDS/SDD local: `done`; Jira es solamente el mirror operativo.
- La presentacion distingue los tipos de fuente previstos sin mezclar identidad logica y evidencia local.
- La validacion quedo incluida en `afpogo/sst-fend#6`, merge `b5742eb709d555dd5c9bbc5d58a6bfdd90c47b8b`.
- Rollout dev validado con Argo CD `Synced/Healthy`, deployment `1/1` y smokes HTTP `200`.
- Evidencia: `evidence/requests/CR-SST-0152/closure-and-rollout-2026-08-10.md`.
- Request cerrado: `requests/done/CR-SST-0154-learning-source-presentation-classification.yaml`.
- Validacion del control-plane: `npm run check` PASS.
