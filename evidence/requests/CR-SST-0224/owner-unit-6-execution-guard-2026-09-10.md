# CR-SST-0224 — Unidad 6: control de ejecución

Rol: evidencia local del control-plane. Estado: implementado y validado con
fakes; no es cierre del CR, publicación owner ni aceptación canónica.

## Resultado owner

- Commit local `sst-chatbot`: `3114cbc42e0660d0bac8129779d7f18ee8f535a1`.
- Rama: `agent/cr-sst-0224-article-pipeline`, tres commits por delante de
  `origin/develop`; no se ejecutó push ni se creó PR.
- Nuevo `src/app/article_processing/execution.py` con puertos obligatorios de
  lifecycle y conteo de tokens, límites versionados y fallas cerradas.
- Las llamadas al proveedor verifican estado `running` antes y después; una
  respuesta pierde elegibilidad si el run cambia mientras está en vuelo.
- El presupuesto verifica entrada y reserva la salida máxima dentro de la
  ventana de contexto antes de invocar al proveedor.
- Los límites de ejecución forman parte del binding del checkpoint para impedir
  reanudaciones silenciosas con otra política.

## Autoridad y pendientes

El fake prueba el contrato, no el conteo exacto de un modelo real. Continúan
pendientes el adaptador de proveedor, el contador específico del modelo, el
lector durable de estado Bend y la interrupción del transporte en vuelo.
`FinalCandidate` sigue sin ser `FINAL_DERIVATION` ni memoria adoptada; Bend debe
revalidar estado e idempotencia al aceptar atómicamente.

No hubo proveedor real, secretos, datastore, deployment, migración, entorno
compartido ni escritura Jira. SST-126 conserva el último readback `En curso`;
la autorización previa de comentario y transición ya estaba consumida.

## Validación

- `scripts/check.py` owner: PASS, 272 tests y tres smokes deterministas.
- Pruebas nuevas: estados previo/posterior, cambio concurrente, fallas saneadas,
  límites de entrada/ventana, reserva de salida y binding de política.
- Tres mapas owner renderizados con Mermaid CLI `11.12.0`: PASS.
- `git diff --check` owner: PASS.
- `origin/main` se integró limpiamente en el worktree del control plane antes de
  registrar esta evidencia, preservando los avances independientes.
- `npm.cmd run check` control-plane: PASS, 824 lifecycles y 71 mapas; sólo las
  advertencias conocidas del histórico CR-SST-0016 y bindings locales opcionales.

El QA de usuario permanece reservado a MCP Chrome DevTools cuando exista una
superficie integrada, con datos creados desde la interfaz y sin seeders ni
scripts de base de datos.
