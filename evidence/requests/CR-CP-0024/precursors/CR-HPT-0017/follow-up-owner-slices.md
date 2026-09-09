# Slices owner requeridos antes de activar

Fecha: 2026-08-27

El siguiente request mínimo recomendado es el candidato `CR-HPT-0019`:
“Implement the governed SST receipt-intake acceptance boundary”. Debe pertenecer
a `sst-bend` y crear un worktree aislado porque su árbol activo tiene cambios
ajenos.

Su alcance mínimo debe incluir verificación JWT M2M exacta, validación del body,
resolución de `receipt_binding_id`, idempotencia durable, límites, rate limit y
persistencia exclusiva de `REVIEW_PENDING`. Debe mantener Phinance fuera del
flujo y publicar la capability outbound necesaria para Automation.

Después se requieren slices separados:

- adopción del workflow Automation, inicialmente inactivo y sin credential IDs
  versionados;
- promoción coordinada de artefactos y custodia de la credencial;
- QA protegida sintética seguida de activación explícita.

`CR-HPT-0018` ya estaba asignado al proxy SST→Phinance y espejado como `HPT-7`;
no puede reutilizarse. `CR-HPT-0019` todavía no fue creado ni espejado en Jira;
este documento sólo identifica el próximo límite owner y evita mezclar runtime
SST con custodia o activación n8n.
