# Publicación e inicio del espejo Jira

Fecha local: 2026-09-08 (los timestamps UTC posteriores a medianoche corresponden
al 2026-09-09). Owner: `4uentes-orchestor`. Rol: evidencia de ejecución del lote.

| Gate | Publicación y readback |
| --- | --- |
| Precondiciones | PR #283, merge `619fbaa`; navegación CR-SST-0238 y Compose CR-SST-0241 |
| Iniciativa y plan | PR #284, merge `d2a892b`; inbox/planned y feature planned |
| Contrato e inicio | PR #285, merge `bc558e3`; coordinador running e iniciativa active |

Cada merge se verificó después de refrescar origin/main y leer el artefacto
canónico. Se ejecutó `npm.cmd run check` completo en cada etapa. El contrato
y running pasaron con 49 documentos, 63 mapas y 0 FAIL, incluyendo owner docs.
No se ejecutaron pruebas runtime ni se modificaron repos funcionales.

| Identidad | Issue | Tipo | Padre | Estado | Comentarios |
| --- | --- | --- | --- | --- | --- |
| INIT-SST-0011 | SST-127 | Epic | Ninguno | En curso | Inicial 10428; avance 10429 |
| CR-SST-0240 | SST-128 | Tarea | SST-127 | En curso | Inicial 10430; avance 10431 |

Se leyeron metadata, tipos y duplicados antes de crear. Cada descripción
incluye objetivo, alcance, dependencias, referencias ARDS/SDD y autoridad del
control plane. Después de escribir se verificaron tipo, summary, proyecto,
padre, estado y comentarios. Los comentarios mantienen orden cronológico.
JQL final confirmó exactamente una Epic y una Tarea primaria. Para Tarea se
usó el ID de tipo observado `10008`: la consulta por nombre localizado devolvía
vacío, mientras la lectura directa y la consulta por ID confirmaron SST-128.
El ledger sanitizado `jira-batch-readback.json` conserva claves, resultados
JQL, timestamps y cuerpos de los comentarios, sin datos de cuentas o conexión.

La primera lectura de comentarios devolvió corchetes escapados en Markdown.
Se corrigió la normalización y se reanudó desde la clave ya guardada, sin
recrear la Epic ni duplicar comentarios. Ambos issues tienen dos comentarios.
El lote quedó consumido; no se hicieron asignaciones, cambios de prioridad,
borrados, cierres ni reparentados de issues existentes.

El coordinador sigue running y la feature planned. Los próximos CRs owner
requieren nuevo preflight y planes aprobados. Quedan pendientes los bindings
Articles/readiness y las decisiones de retención indicadas como TODO en el
contrato; ninguna se presenta como implementada o validada en runtime.

La dependencia operativa correcta es CR-SST-0241. CR-SST-0239 corresponde al
plan de retención de PR #282 y no se modifica por este lote.
Los worktrees previos permanecen preservados. El worktree del coordinador se
mantiene para continuidad mientras el CR siga running; no se retira trabajo
activo ni se declara cierre terminal.

El check completo final, con claves y evidencia Jira, también pasó con exit 0:
49 documentos, 63 mapas, 0 FAIL. Sólo permanecen los avisos de baseline
CR-SST-0016 y bindings locales opcionales ausentes.
