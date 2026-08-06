# CR-SST-0083 - Resumen de archivos cambiados

- `requests/inbox/CR-SST-0083-select-runtime-transport-for-sst-chatbot-handoff.yaml`:
  abre el lifecycle para seleccionar transporte runtime y lo ata localmente a
  `SST-7` como parent Jira esperado.
- `requests/planned/CR-SST-0083-select-runtime-transport-for-sst-chatbot-handoff.yaml`:
  registra impacto, riesgo, boundary de implementacion y el bloqueo actual para
  crear/transicionar la subtarea remota.
- `docs/cross-repo/sst-chatbot-orchestrator-handoff.md`: agrega recomendacion
  del primer transporte externo y deja queueing como concern interno del
  orchestrator.
- `state/features/sst-chatbot.current.yaml`: agrega `CR-SST-0083` como request
  relacionado y refina el gap abierto con la decision pendiente.
- `evidence/requests/CR-SST-0083/transport-decision.md`: documenta opciones,
  recomendacion y distincion entre hechos e inferencias.
- `evidence/requests/CR-SST-0083/jira-subtask-and-transition-blocker.md`:
  registra que `SST-7` es el parent observado y que la subtarea remota no pudo
  crearse por bloqueo del conector.
- `evidence/requests/CR-SST-0083/validation-results.md`: registra la validacion
  del control-plane para esta planificacion.
