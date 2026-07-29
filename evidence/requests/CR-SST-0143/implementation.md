# Implementación CR-SST-0143

Fecha: 2026-07-18.

## Corrección aplicada

Owner: `sst-fend`.

`src/pages/Dashboard/pages/Home/index.tsx` ya no usa la longitud del catálogo
como señal de carga. Un `useRef` local garantiza una solicitud de briefing por
montaje de Home; por lo tanto `items=[]` es un resultado cargado válido y no
activa un ciclo de nuevas solicitudes.

El cambio no altera endpoints, DTOs, thunks, selectors, slices, backend, BFF ni
la composición visual.

## Owner documentation

Se actualizaron las superficies owner previstas:

- `sst-fend/specs/35-home-frontend.yml`
- `sst-fend/docs/35-home-frontend.md`
- `sst-fend/docs/tasks/2026-07-18-cr-sst-0143-home-empty-catalog-request-loop.md`

La spec quedó vinculada al control plane mediante `CR-SST-0143`, estado
`article-semantic-kind` y espejo Jira `SST-83`.

## Validación ejecutada

| Comando | Resultado |
| --- | --- |
| `npm.cmd test -- Home --runInBand` | PASS: 1 suite, 1 test. Prueba que un catálogo vacío despacha una única carga incluso tras rerender. |
| `npm.cmd run build -- --output-path %TEMP%/cr-sst-0143-webpack-output` | PASS: compilación de producción. Conserva tres advertencias de tamaño de bundle. |
| `npm.cmd run check` | PASS: 30 suites y 187 tests. Mantiene 22 warnings preexistentes de hooks/deprecaciones y advertencias de tamaño de bundle, sin errores. |

## QA manual autenticado

Fecha: 2026-07-18. Stack local saludable en frontend, auth y API.

- Home autenticado verificado en `1440x900` y `390x844` solicitados.
- Sin overflow horizontal; en móvil los indicadores quedan debajo del briefing.
- Sin solapamientos ni texto cortado en las capturas.
- Consola sin errores ni warnings durante la verificación.
- La observación de red se mantuvo estable después de abrir Home: no se
  agregaron solicitudes XHR/fetch durante la ventana de QA. El catálogo tenía
  un artículo, por lo que el caso vacío queda cubierto directamente por la
  prueba de regresión focalizada.

Capturas:

- `evidence/requests/CR-SST-0143/qa-home-desktop-1440x900.png`
- `evidence/requests/CR-SST-0143/qa-home-mobile-390x844.png`

## Políticas aplicadas

- `owner-documentation-authority-policy`: owner docs actualizados en
  `sst-fend`; el cierre permanece bloqueado hasta el gate completo del control
  plane.
- `jira-cr-mirror-hierarchy-policy` y
  `work-tracker-control-plane-authority-policy`: preflight, lote enumerado,
  comentario y transición restringidos a `SST-83`; Jira conserva rol de espejo.
- `agent-task-atomization-policy`: diagnóstico, implementación, pruebas y QA
  se mantienen como unidades separadas y verificables.
