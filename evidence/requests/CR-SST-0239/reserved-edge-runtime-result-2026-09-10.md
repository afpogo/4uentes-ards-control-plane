# CR-SST-0239: resultado runtime del edge reservado

## Resultado

La sesión interactiva del operador allowlisted completó OAuth y alcanzó SST a
través del origin público reservado. La corrida creó exactamente una identidad
SST sintética y ejecutó el subconjunto HTTP que no requiere un segundo
principal. El resultado es `PARTIAL PASS`: el transporte por el edge quedó
probado, pero el gate completo todavía necesita aislamiento cross-principal y
las filas browser/realtime bajo identidad sintética.

La evidencia conserva sólo estados, resultados y cantidades. No registra el
dominio privado, identidad del operador, email sintético, passwords, bearer,
cookies, headers, identificadores de conversación ni contenido.

## Matriz ejecutada

| Fila | Resultado | Evidencia sanitizada |
| --- | --- | --- |
| Límite Auth | PASS | La fachada sin bearer respondió `401`. |
| Temporal multi-sesión | PASS | Dos sesiones activas del mismo principal enumeraron la misma conversación temporal. |
| Guardado durable | PASS parcial | La promoción fue idempotente y una sesión futura listó y leyó la conversación; no se provocó eviction. |
| Eliminar de SST | PASS | El delete respondió `204`; tres sesiones posteriores recibieron `404` y el listado no resucitó el recurso. |
| Finalizar temporal | PASS parcial | El finish respondió `204` y el historial dejó de ser legible; no se midió el evento realtime. |
| TTL temporal | PASS | Tras `120` segundos más la gracia del harness, historial y listado dejaron de recuperar la conversación. |
| Cross-principal | NO EJECUTADA | Requiere una segunda identidad sintética, fuera de la autorización de una identidad. |
| Browser clear-local y realtime | NO EJECUTADAS | La sesión sintética se descartó luego del cleanup HTTP; requieren un gate explícito de continuación. |

## Cleanup y residuos

Todas las conversaciones sintéticas creadas por la corrida fueron eliminadas,
finalizadas o expiraron mediante `/api/chat`; no hubo acceso directo a Redis,
PostgreSQL ni al identity store. Permanece una identidad SST sintética porque
no existe contrato de producto para eliminarla.

Al entrar inicialmente al chat con la identidad real del operador, la UI creó
automáticamente una conversación temporal vacía. Se la finalizó por el
contrato del producto con respuesta `204`; la UI creó inmediatamente otra
conversación temporal vacía. No se repitió el ciclo y se dejó actuar el TTL
configurado. Esa referencia no fue copiada ni reconsultada.

## Límites preservados

No se modificó ni reinició ngrok, no se cambió OAuth o su allowlist y no se
tocaron repos hijos, Jira, deployment, cluster, producción, datastores ni
secretos. CR-SST-0239 y CR-SST-0207 permanecen `running`; el resultado no
autoriza nuevas escrituras runtime.
