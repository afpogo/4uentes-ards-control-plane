# Implementación CR-SST-0132

Fecha: 2026-07-12.

- Quick-save de `sst-extension` envía la misma URL canónica trimmeada en el
  campo top-level y en `payload:{kind:web,data:{url}}`.
- `/api/extension/articles` de `node-auth` usa un DTO específico que exige Web
  explícito, valida ambas URLs y su igualdad, y reutiliza create/idempotencia.
- `sst-bend` ya persistía correctamente el payload Web explícito y rechaza un
  payload Web sin `data.url`; no requirió heurística ni endpoint adicional.

Sesiones, Text, cola histórica y registros persistidos quedaron fuera.

