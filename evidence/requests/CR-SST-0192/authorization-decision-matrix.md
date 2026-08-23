# CR-SST-0192 - Matriz De Decisiones

Fecha: 2026-08-17

| Caso | DecisiÃ³n | CÃ³digo esperado | Efecto |
|---|---|---|---|
| Scope completo, propuesta aceptada y activa | Permitir | `allowed` | Puede entrar a recall segÃºn clasificaciÃ³n y entitlement. |
| Falta tenant, account, user, application o memory space | Denegar | `incomplete_scope` | No leer, escribir ni revelar existencia. |
| Membership o sesiÃ³n revocada | Denegar | `inactive_principal` | Cancelar operaciÃ³n y reautenticar. |
| Texto normal de chat sin intenciÃ³n de recordar | No capturar contenido | `not_memory_requested` | Conservar sÃ³lo el chat segÃºn su contrato propio. |
| Inferencia Ãºtil sin aceptaciÃ³n | Proponer | `needs_user_review` | Excluir de recall, robots, Ã­ndices y exports. |
| Usuario acepta propuesta validada | Permitir escritura | `memory_accepted` | Crear hecho, intenciÃ³n o relaciÃ³n con provenance. |
| Propuesta duplicada con mismo payload | Responder idempotente | `duplicate_same_payload` | Devolver el objeto canÃ³nico existente. |
| Misma idempotency key con payload distinto | Denegar | `idempotency_conflict` | No reemplazar el objeto previo. |
| Contenido parecido a credencial | Denegar | `secret_like_content` | No persistir contenido ni enviarlo al proveedor. |
| ClasificaciÃ³n desconocida | Denegar | `unknown_classification` | Requiere correcciÃ³n de datos/policy. |
| Record `restricted` o `secret` | Denegar provider/index/export | `prohibited_classification` | Mantener fuera de RAG y proyecciones; V1 no captura su contenido. |
| Record rechazado, expirado o superseded | Denegar | `lifecycle_not_eligible` | No llega al retriever. |
| Record deleted/deletion_pending | Denegar | `memory_deleted` | Excluir inmediatamente de recall e invalidar derivados. |
| Record de otro tenant/account/user | Denegar | `scope_mismatch` | Respuesta sanitizada sin confirmar existencia. |
| Robot sin `memory.read` | Denegar | `missing_robot_capability` | No consultar source ni retriever. |
| Prompt pide ignorar permisos | Denegar escalamiento | `scope_escalation_denied` | Mantener scope original. |
| Provider cita un chunk no recuperado | Denegar salida | `unknown_citation` | No exponer respuesta parcial. |
| Export contiene path absoluto o traversal | Denegar | `unsafe_export_path` | No generar ZIP o directorio. |
| CorrecciÃ³n de memoria aceptada | Permitir revisiÃ³n | `memory_superseded` | Nueva versiÃ³n; la anterior conserva provenance y deja de ser elegible. |
| Borrado autorizado | Permitir | `deletion_accepted` | ExclusiÃ³n inmediata, purge de contenido, Ã­ndice/export invalidado y tombstone. |

## Invariantes Para ImplementaciÃ³n

- `sst-bend` toma la decisiÃ³n final aunque el chatbot o frontend hayan hecho
  validaciones previas.
- NingÃºn `allow` puede originarse en texto del prompt o en la salida del LLM.
- Un error interno se transforma en cÃ³digo estable y nunca devuelve contenido
  de otro scope.
- Los tests negativos deben comprobar que source, retriever y provider no son
  invocados cuando una etapa anterior deniega.
