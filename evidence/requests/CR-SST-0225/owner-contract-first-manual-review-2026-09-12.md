# CR-SST-0225 — Revisión manual del contrato de tres owners

Rol documental primario: reporte de revisión arquitectónica y contractual.
Owner: `4uentes-ards-control-plane`. Fecha: 2026-09-12. Resultado:
`passed-with-runtime-gates-pending`.

## Decisión

Los contratos draft de Bend, Chatbot y Auth son compatibles y están listos
para solicitar un gate separado de publicación. Esta decisión aprueba sólo la
calidad contract-first; no autoriza push, PR, grants ejecutables, endpoints,
clientes M2M, runtime, datos, migraciones, infraestructura, despliegues o Jira.

Commits revisados:

- `sst-bend@7360976a31d397ebbe0a3272f2718227a451c89b`;
- `sst-chatbot@02b7c4a1b8a7e3109f73bc7d95c7600359ab95b2`;
- `4uentes-auth@54207530efe6cc85ae82dd0f299066f2185f3aff`;
- control-plane `66bdd659454b20ef311e1595d4f0d5836dfe85ba`, más este readback local.

## Hallazgo corregido durante la revisión

La primera versión declaraba `attempt_id` como dato que debía coincidir, pero
el readback de Bend no lo exponía explícitamente. También mezclaba
`context_version`, que pertenece al estado durable, con los campos inmutables
del comando.

La corrección:

- agrega `attempt_id` al readback Bend;
- separa en Chatbot los campos que deben coincidir con el comando de los que
  Bend entrega como autoridad durable;
- establece que `context_version`, párrafos confirmados y estado de candidata
  final se adoptan desde Bend;
- exige validar el grant `article-processing:execute` antes de resolver los
  snapshots privados.

## Matriz de revisión

| Dimensión | Resultado | Evidencia |
| --- | --- | --- |
| protocolo y versión | PASS | los tres owners declaran `sst-article-processing-handoff-v1@1.0.0` |
| endpoint execute | PASS | Bend y Chatbot coinciden en `POST /internal/v1/article-processing/executions` |
| callbacks Bend | PASS | métodos, paths y scopes read/write coinciden exactamente |
| grants | PASS | los tres tuples caller–audience–scope coinciden con Auth |
| autoridad | PASS | Bend persiste y acepta; Chatbot deriva; Auth emite grants |
| reanudación | PASS contractual | attempt, lease, hashes, CAS y readback separan estado confirmado de salida candidata |
| privacidad | PASS | contenido y prompts son privados; logs y trazas quedan limitados a metadata |
| memoria | PASS | candidata, resumen y adopción siguen siendo decisiones separadas |
| documentación | PASS | specs indexadas, documentación derivada y mapas con fallback |
| límite del slice | PASS | todos los artefactos permanecen draft/contract-only |

La comprobación cruzada machine-readable pasó para protocolo, endpoint execute,
tuples, callbacks, fence de readback y estados `contract-only`.

## Validación posterior a la corrección

- Chatbot: `python scripts/check.py`, PASS con 272 tests.
- Auth: `npm run check`, PASS completo.
- Bend: parse YAML y `node scripts/test-article-agent-processing.js`, PASS.
- Los tres owners: `git diff --check`, PASS y worktrees Git-clean después de
  actualizar los commits locales.
- Control plane: debe volver a ejecutar `npm run check` al cerrar este reporte.

## Residuales que no bloquean publicar el draft

- El check integral de Bend termina en su preflight HTTP cuando SST no está
  iniciado. Levantar runtime sigue fuera de este gate.
- Límites definitivos por modelo, compactación por tokens y tamaños máximos de
  campos wire deben cerrarse antes de implementar el runtime.
- La matriz integrada de reinicios, pérdida de acknowledgement, scopes erróneos
  y aceptación efectiva una sola vez pertenece a unidades posteriores de
  CR-SST-0225.

## Próximo gate recomendado

Autorizar de forma exacta la publicación de las ramas contract-first de los
tres owners y del readback de control plane, creando PRs hacia sus ramas owner
correspondientes. La autorización de runtime debe permanecer separada.
