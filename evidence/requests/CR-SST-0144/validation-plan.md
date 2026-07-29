# Plan de validación integral de Article Kind

Fecha: 2026-07-18  
CR: `CR-SST-0144`  
Iniciativa: `INIT-SST-0005`  
Espejo Jira previsto: tarea bajo `SST-57`

## Objetivo

Comprobar que la creación nativa autenticada conserva una intención de negocio
explícita: un artículo `Text` persiste, se consulta y se presenta como `text`;
un artículo `Web` hace lo mismo como `web`. La prueba no deduce el tipo desde
URL, filtro legado, transporte o nodo.

## Alcance y método

1. Ejecutar el contrato de `payload.kind` en SST API y los checks ARDS/SDD de
   SST API, BF, frontend y control plane.
2. Usar una sesión autenticada local para crear un registro de prueba `Text` y
   otro `Web`, únicamente después de confirmación del usuario en el formulario.
3. Verificar las vistas filtradas, detalle/representación y consola/red en
   desktop y mobile mediante Chrome DevTools.
4. Registrar resultados sin secretos, tokens, cuentas, URLs privadas ni datos
   personales.

## Gate de cierre de la épica

Esta validación puede cerrar su propio CR si todos los checks pasan. No puede
cerrar por sí sola `SST-57`: `CR-SST-0134` / `SST-64` mantiene 23 registros
históricos ambiguos, con cero clasificaciones automáticas seguras. Cualquier
mutación necesita addendum revisado, evidencia por fila, backup, dry-run,
rollback y aprobación humana.
