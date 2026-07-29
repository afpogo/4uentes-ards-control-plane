# Resultado de E2E autenticada: Article Semantic Kind

Fecha: 2026-07-18  
CR: `CR-SST-0144`  
Jira: `SST-84`  
Entorno: local autenticado, Chrome DevTools MCP

## Resolución 2026-07-19

El defecto documentado debajo fue corregido por `CR-SST-0145`. La revalidación
autenticada confirma que el selector `Tipo` emite `payloadKind`, Text y Web se
excluyen correctamente entre sí, el check completo de frontend pasa con 30
suites / 187 tests y mobile `390x844` no presenta overflow horizontal.

Evidencia de resolución: `evidence/requests/CR-SST-0145/implementation-validation.md`.
`CR-SST-0144 / SST-84` queda cerrado localmente y sincronizado a `Listo`.
La Épica `SST-57` continúa abierta únicamente por gates independientes, en
particular `CR-SST-0134 / SST-64`.

## Registros de prueba creados con autorización

| Intención de negocio | Título | Id | Evidencia de creación/detalle |
| --- | --- | --- | --- |
| Text | `E2E Kind Text 2026-07-18` | `21d122a4-923b-46f7-9df6-cdb426c8754a` | La creación y el detalle muestran `Text`; no tiene fuente externa y expone una URL interna SST. |
| Web | `E2E Kind Web 2026-07-18` | `b14dff93-bb37-41b9-bc2c-0643101c9b70` | La creación muestra `Web` y conserva `https://example.com/` como fuente. |

No se eliminó ningún registro. No se usaron datos personales ni secretos.

## Automatización

| Control | Resultado |
| --- | --- |
| `sst-bend`: `npm.cmd run test:article-kind-contract` | PASS. El contrato verifica que `payloadKind` se mantenga separado de `filterType`; emitió un warning de stub de preview no funcional, sin fallo. |
| `sst-fend`: `ArticleCreateFlow.test.tsx` | PASS: 1 suite, 14 tests. Cubre preservación de kind enviado cuando la respuesta de create omite metadatos. |
| `node-auth`: `npm.cmd run check` | PASS. |
| `sst-bend`: `npm.cmd run check` | PASS con smoke protegida parcial: faltó `SMOKE_JWT`; el check informó explícitamente endpoints protegidos no cubiertos. |
| `sst-fend`: `npm.cmd run check` | BLOCKED por timeout de 184 s sin salida final; no se interpreta como PASS. El test focalizado sí finalizó correctamente. |

## Resultado funcional

La creación y el detalle de ambas clases son correctos. El filtro de catálogo
no cumple la semántica de negocio:

1. Al seleccionar `TYPE = Text`, la URL pasa a `filterType=text`, pero la lista
   contiene tanto `E2E Kind Text` como `E2E Kind Web` (y el registro preexistente).
2. Al seleccionar `TYPE = Web`, la URL pasa a `filterType=web` y la lista queda
   vacía, aunque existe `E2E Kind Web`.
3. La red confirma que el cliente usa `GET /api/articulos?...&filterType=text`
   y `...&filterType=web`. El contrato backend define `filterType` separado de
   `payload.kind`, por lo que el selector visual está conectado al campo legado
   y no a la intención semántica.

Se abrió `CR-SST-0145` para corregir ese límite sin inferir ni mutar datos
históricos. Este defecto bloquea el cierre de `CR-SST-0144` y de la épica
`SST-57`.

## QA visual y consola

- Desktop solicitado: 1440x900. Capturas: `qa-filter-text-desktop-failure.png`
  y `qa-filter-web-desktop-failure.png`.
- Mobile solicitado: 390x844. La emulación reportó viewport 502x732 por la
  escala del navegador, `scrollWidth=clientWidth=502`, sin overflow horizontal.
  Captura: `qa-filter-web-mobile-390x844-failure.png`.
- Consola: sin mensajes `error` ni `warn`.
- Red: las dos altas devolvieron `201`; se observaron solicitudes de filtros
  `filterType=text` y `filterType=web`. Los `304` de recursos estáticos son
  revalidaciones de caché, no errores funcionales.

## Gate de la épica

No cerrar `SST-57`. Además del defecto `CR-SST-0145`, sigue abierto
`CR-SST-0134` / `SST-64`: 23 filas históricas ambiguas requieren revisión y
evidencia humana antes de cualquier reclasificación.
