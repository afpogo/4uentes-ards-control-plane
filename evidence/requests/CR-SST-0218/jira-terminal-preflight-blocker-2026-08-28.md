# Bloqueo del preflight Jira terminal de CR-SST-0218

Fecha observada: 2026-08-27 en `America/Buenos_Aires` / 2026-08-28 UTC.

## Gate previo satisfecho

El PR [control-plane #148](https://github.com/afpogo/4uentes-ards-control-plane/pull/148)
fue fusionado en `dc0f25f6803abbcf420c04e1c4c285eb32960025`.
El head QA `252817a7d05ccb78452868046f281124440094e4` es alcanzable desde
`origin/main`, que apuntaba exactamente al merge durante el readback.

Las filas terminales y de carrera de `CR-SST-0218` están publicadas y en PASS.
Este checkpoint intentó únicamente habilitar el preflight read-only requerido
antes del lote terminal de Jira.

## Resultado de conexión

Se observaron tres fallos concordantes, sin escritura externa:

1. El conector Atlassian administrado rechazó el refresh OAuth con
   `unauthorized_client` porque el refresh token es inválido.
2. El fallback adoptado por el playbook inició un único callback local sobre
   `mcp.atlassian.com/v1/mcp`, abrió el navegador y esperó 120 segundos; no
   recibió autorización antes del timeout.
3. Un segundo intento aislado amplió la ventana a 300 segundos y terminó con el
   mismo resultado. No se inició un autenticador concurrente ni se cambió el
   puerto como workaround.

La evidencia generada en `jira-mcp-project-verification.md` informa:

- resultado `BLOCKED`;
- cero recursos Atlassian resueltos;
- cero herramientas descubiertas;
- proyecto SST no verificado;
- operaciones de escritura: no.

No se persistieron tokens, cookies, authorization codes ni client secrets. El
proceso OAuth remanente fue detenido después de escribir la evidencia bloqueada.

## Lote candidato todavía no autorizable

El scope permanece limitado a un único candidato:

| Secuencia | Issue | Operación | Precondición | Transición |
| --- | --- | --- | --- | --- |
| 1 | `SST-121` | transition-only | Subtask de `SST-113`, estado esperado `En curso` | `TODO`: resolver por readback una transición directa a categoría `Done` |

Quedan prohibidos comentarios, links, assignee, labels, ediciones de campos y
cualquier escritura sobre otro issue. No se solicita autorización mientras el
transition ID y el estado actual no puedan verificarse read-only.

## Próximo gate

El operador debe reconectar Atlassian o completar el OAuth cuando se abra la
ventana de autorización. Después corresponde:

1. leer `SST-121`, parent y status;
2. leer sus transiciones disponibles;
3. completar el transition ID exacto del único candidato;
4. publicar el preflight y solicitar autorización terminal explícita;
5. sólo entonces transicionar, hacer readback y preparar el lifecycle `done`.

`CR-SST-0218` permanece `running`; no se reporta cierre canónico ni se retiran
worktrees.
