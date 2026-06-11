# CR-SST-0027 - Servicios Impactados

Observado el: 2026-06-04

## Alcance De Producto

| Servicio | Rol En El Contrato |
|---|---|
| `sst-chatbot` | Productor de derivaciones secuenciales, contexto acumulado, provenance y propuestas ARDS. |
| `sst-bend` | Consumidor/validador de propuestas, owner recomendado de persistencia e idempotencia del ARDS/SDD de usuario. |

## Alcance De Ejecucion

Solo se modifico `4uentes-orchestor`.

No se modificaron:

- `sst-chatbot`;
- `sst-bend`;
- `sst-fend`;
- `4uentes-auth`;
- `sst-extension`;
- `sst-4uentes-infra`;
- `4uentes-ards-core`.

## Relacion Con La Secuencia

CR-SST-0026 definio el modelo del ARDS/SDD de usuario.

CR-SST-0027 define como un agente produce propuestas para ese modelo.

CR-SST-0028 debe definir como SST muestra, persiste, revisa y consolida esas
propuestas en producto.
