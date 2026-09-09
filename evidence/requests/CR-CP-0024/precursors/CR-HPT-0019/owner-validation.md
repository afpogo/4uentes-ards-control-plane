# Validación local del límite de aceptación de recibos en SST

Fecha: 2026-08-27

## Resultado

El owner `sst-bend` implementa localmente
`POST /4uentes/v1/automation/receipt-intakes` con una frontera cerrada para el
principal de servicio aprobado. La verificación exige issuer `sst-auth`, una
única audience `sst-api`, client y subject
`4uentes-automation-receipt-intake`, scope exacto
`finance:receipt-intake:create`, `token_use=service`, RS256 y TTL máximo de 300
segundos.

La aceptación valida el payload cerrado, límites de tamaño y cardinalidad,
media types permitidos, referencias de objeto previamente registradas como
limpias y vigentes, binding activo, idempotencia durable y cuotas por cliente y
binding. El único estado creado es `REVIEW_PENDING`; no se invoca Phinance ni se
materializan datos financieros.

La migración reversible y los modelos para bindings, objetos y candidatos se
validaron estructuralmente. La migración no se aplicó sobre la base compartida.

## Validaciones

- `node scripts/test-receipt-intake.js`: PASS.
- `npm run build`: PASS en la validación previa del mismo delta.
- `npm run check`: PASS, incluidas las suites existentes, build, smoke público y
  ARDS check.
- `npm run check` en `4uentes-orchestor`: PASS; 60 checks de estado, 56 links de
  capability, 22 checks de iniciativas, 127 gates de documentación owner y 15
  mapas visuales válidos.
- `git diff --check`: PASS.
- Montaje de la ruta: PASS.

El endpoint se agregó al registro de cobertura protegida con
`auth_kind=service_jwt`. El smoke protegido vivo queda reportado explícitamente
como diferido: necesita runtime promovido, fixtures sintéticos de binding y
objeto, y `RECEIPT_INTAKE_SMOKE_JWT`. No se leyó `.env`, no se emitió un token y
no se capturaron credenciales.

Los servicios locales `postgres`, `sst` y `scrapper` se iniciaron sólo para el
check y quedaron detenidos; `docker compose ps` finalizó sin servicios activos.
El check del control plane conserva cuatro warnings preexistentes por remotes
locales distintos del catálogo.
