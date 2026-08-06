# CR-SST-0083 - Bloqueo para subtarea y transicion Jira

## Objetivo operativo

Representar `CR-SST-0083` en Jira como subtarea bajo `SST-7` y mover esa
subtarea a `En curso`.

## Parent observado

- Jira feature-state parent: `SST-7`
- Summary observado: `[SST][feature-state] Seleccionar transporte runtime para handoff SST Chatbot`
- Status observado: `Tareas por hacer`
- Evidencia local: `evidence/requests/CR-SST-0008/jira-sync-health-results.json`

## Subtarea deseada

- Parent Jira: `SST-7`
- Summary propuesto:
  `[SST-7][CR-SST-0083] Select runtime transport for sst-chatbot handoff`
- Status objetivo inicial: `En curso`

## Resultado del intento

- Lectura local del control-plane: `PASS`
- Escritura remota Jira: `BLOCKED`

## Bloqueo observado

El conector de Atlassian disponible en este entorno devolvio `403` con el
mensaje de que la app no esta instalada en la instancia objetivo. Por eso no se
pudo:

- crear la subtarea real;
- enlazarla remotamente con `SST-7`;
- transicionarla a `En curso`.

## Consecuencia

`CR-SST-0083` queda atado localmente a `SST-7` como parent Jira esperado, pero
la materializacion remota de la subtarea sigue pendiente de restaurar acceso de
escritura al conector.
