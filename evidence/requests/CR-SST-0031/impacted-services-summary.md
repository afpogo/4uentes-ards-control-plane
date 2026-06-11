# CR-SST-0031 - Servicios Impactados

Observado el: 2026-06-05

## Alcance De Producto

| Servicio | Rol En El Slice |
|---|---|
| `sst-bend` | Owner recomendado de validacion, idempotencia y persistencia de memoria. |
| `sst-chatbot` | Productor de propuestas y consumidor de recall. |
| `4uentes-auth` | Scope de identidad, cuenta y autorizacion. |
| `sst-fend` | Superficie futura para eventos visibles, revision y recall. |

## Alcance De Ejecucion

Solo se modifico `4uentes-orchestor`.

No se modificaron:

- `sst-bend`;
- `sst-chatbot`;
- `4uentes-auth`;
- `sst-fend`;
- `sst-extension`;
- `sst-4uentes-infra`;
- `4uentes-ards-core`.

## Siguiente Paso

El siguiente request debe autorizar implementacion en repos funcionales,
empezando por backend/chatbot y dejando UI avanzada para un request posterior.
