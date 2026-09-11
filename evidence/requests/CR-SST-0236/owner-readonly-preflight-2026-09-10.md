# Preflight owner de la bandeja de fuentes Learning

Owner documental: `4uentes-orchestor`. Rol primario: evidencia de discovery y
playbook de decisión para CR-SST-0236. La especificación y documentación que
describan comportamiento frontend deberán publicarse en `sst-fend`; este
documento no reemplaza esa autoridad.

## Baseline y custodia

GitHub confirmó que el gate `running` PR #301 fue fusionado como
`148cb887ab62ea50db8fed3df67b2d61cad46c96`. Luego se refrescó
`afpogo/sst-fend` de sólo lectura: `origin/develop` apunta a
`bd9b8d2aa52aab2346b7bf94b0db05ed188c09a3`, fechado
`2026-08-27T20:59:22-03:00`.

El checkout principal está dirty sobre una branch de CR-SST-0086 y contiene
cambios ajenos; se preserva íntegramente. Existen otros worktrees owner, pero no
una branch o worktree CR-SST-0236. La búsqueda GitHub no encontró PR abierto ni
histórico con ese ID. Una futura ejecución deberá partir de `origin/develop`
refrescado en un worktree limpio y exclusivo.

No se editaron archivos de Fend, no se ejecutaron tests owner y no hubo
runtime, datos, Jira, preview, accept, reject ni secretos.

## Estado observado y brecha contractual

El baseline ya tiene una hoja funcional para texto manual, selección local,
preview y accept/reject explícitos. También conserva separados crear un artículo
y aceptar contexto Learning. Esa base se reutiliza.

La adopción inbound owner sigue en `learning-workspace-context@1.0.0`, mientras
Auth publicó `1.2.0` bajo CR-SST-0235. El tipo de request actual exige
`sourceText`; no hay matches para `sourceDescriptor`, `article_document`,
`agent_output` o `learning_source_snapshot_id`. La UI siempre construye preview
como `manual_text`, `article_draft` o el adaptador transicional `article` y, en
este último caso, todavía envía el cuerpo aportado por el caller.

`LearningWorkspaceSheet.tsx` tiene 1323 líneas y reúne edición, selección,
anotaciones, transporte, preview y decisión. El cambio debe extraer la bandeja
de fuentes sin reescribir la hoja completa ni trasladar ownership de
autorización al navegador.

| Superficie | Estado actual | Objetivo del lote owner |
| --- | --- | --- |
| Texto manual | `sourceText` directo | Adaptador compatible hacia descriptor `manual_text` |
| Artículo | ID más body transicional | `article_id`; el body owner se resuelve sólo en Bend |
| Documento | No existe como fuente Learning | `article_id` + `document_id` |
| Salida de agente | No existe como fuente Learning | `article_id` + `article_processing_result_id` |
| Snapshot | Respuesta sin tipo de procedencia | Identidad, versión/hash, captura, owner refs y frescura visibles |
| Tags | Anotaciones locales ya separadas de ArticleTag | Mantener separación y no crear TagDefinition |
| Memoria | No existe acción explícita | Mostrar sólo boundary/propuesta futura; aceptar Learning no acepta memoria |
| Secrets | Sin flujo soportado | Continuar excluidos de V1; una futura `SecretRef` exige request de seguridad |

## Alcance candidato para autorización owner

La primera ejecución propuesta actualiza las superficies owner existentes:

- `specs/38-learning-workspace-frontend.yml` y su documento derivado;
- capability inbound YAML/Markdown de `node-auth--learning-workspace-context`;
- `src/services/types/learningWorkspace.ts` y
  `src/services/learningWorkspaceService.ts`;
- `LearningWorkspaceSheet` más un componente de bandeja dentro de
  `src/pages/LearningWorkspace/components/`;
- estilos y tests focalizados de la feature;
- playbook UX y runbook QA dentro de las carpetas owner ya existentes.

El lote debe conservar el adapter de texto manual y los flujos embebidos de
Articles. Para fuentes persistidas enviará sólo referencias declaradas; mostrará
el snapshot retornado y estados `resolving`, `previewed`, `failed`, `stale` y
terminales de forma comprensible. Preparar/publicar artículo, clasificar tags y
proponer memoria serán acciones y mensajes separados.

## Policies y stop conditions

Fend adopta `owner-documentation-authority-policy` y
`visual-documentation-as-code-policy`. No adopta actualmente
`knowledge-to-execution-documentation-policy`; CR-SST-0236 utilizará playbook y
runbook porque su request los exige, pero no afirmará adopción local ni editará
el registry sin un lifecycle separado. `http-qa-harness-policy` figura bajo
excepción en el baseline canónico, por lo que la validación automática se apoya
en tests y `npm run check`; la QA manual futura sigue reservada a Chrome
DevTools MCP independiente.

Detener ante drift de `1.2.0`, necesidad de credenciales, enumeración de fuentes
privadas, necesidad de llamar Bend directamente, imposibilidad de separar tags
de memoria o cambios ajenos en el futuro worktree. Los valores secretos no
entran al navegador: el pedido original de «incluir secretos» requiere una
extensión futura de `SecretRef` opaco y un request de seguridad propio.

El siguiente gate es publicar esta evidencia, leer su merge y solicitar
autorización explícita para crear el worktree owner y ejecutar únicamente el
lote descrito. No aplica rollback runtime a este preflight documental; una
publicación se compensa mediante revert gobernado.
