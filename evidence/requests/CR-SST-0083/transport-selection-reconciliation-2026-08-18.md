# Reconciliación de la selección de transporte de CR-SST-0083

La recomendación inicial de `CR-SST-0083` era un ingreso HTTP gobernado. El
diseño se refinó antes de implementar el corte conectado y quedó cerrado como
una frontera híbrida:

- `sst-fend` usa Socket.IO solamente contra `sst-bend`;
- `sst-bend` conserva conversación, orden, persistencia y replay;
- `sst-bend` invoca `sst-chatbot` mediante HTTP NDJSON interno;
- `sst-chatbot` procesa el turno y emite resultados estructurados;
- los handoffs privilegiados siguen siendo propuestas gobernadas y no conceden
  ejecución autónoma al chatbot.

`CR-SST-0083` tomó la decisión; `CR-SST-0165` a `CR-SST-0172` aportaron la
implementación y validación histórica local del feature conectado. La
capability inbound del control-plane permanece `draft` porque no existe aquí un
runtime de aceptación de operation intents. `CR-SST-0178` mantiene abierto el
deployment persistente de development.

Este registro es retroactivo. No autoriza cambios de runtime, cluster o Jira y
no afirma que el cluster actual conserve el estado observado en agosto.
