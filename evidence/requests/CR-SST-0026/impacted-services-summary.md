# CR-SST-0026 - Servicios Impactados

Observado el: 2026-06-04

## Alcance De Producto

CR-SST-0026 impacta el diseno de producto y contratos futuros de:

| Servicio | Rol En El Modelo |
|---|---|
| `sst-fend` | Experiencia visible para fuentes, resumenes, revision y navegacion del ARDS/SDD. |
| `sst-bend` | Owner recomendado de validacion, persistencia, idempotencia y mutacion del ARDS/SDD de usuario. |
| `sst-chatbot` | Productor de propuestas ARDS, provenance, prompts y memoria operacional agentica. |
| `4uentes-auth` | Scope de usuario/account, sesion y autorizacion compartida. |

## Alcance De Ejecucion

Solo se modifico `4uentes-orchestor`.

No se modificaron:

- `sst-fend`;
- `sst-bend`;
- `sst-chatbot`;
- `4uentes-auth`;
- `sst-extension`;
- `sst-4uentes-infra`;
- `4uentes-ards-core`.

## Relacion Con La Secuencia

CR-SST-0026 define el modelo de producto. CR-SST-0027 debe definir el derivador
secuencial por parrafos sobre este modelo. CR-SST-0028 debe definir la UI y la
persistencia visible despues de los dos requests anteriores.
