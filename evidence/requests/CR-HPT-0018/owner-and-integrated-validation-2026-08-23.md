# Validación owner e integrada de CR-HPT-0018

Fecha: 2026-08-23.

## Resultado

El proxy acotado de `sst-bend` pasó las pruebas owner y la prueba integrada con
el verificador real de Phinance. El flag `PHINANCE_PROXY_ENABLED` permanece en
`false` por defecto; esta validación no activó ningún ambiente ni cambió
secretos o infraestructura persistente.

## Validación owner de SST

Sobre el worktree limpio derivado de `sst-bend origin/develop@8e2eeb3`:

- `npm run test:phinance-consumer`: PASS;
- `npm run test:phinance-proxy`: PASS;
- `npm run build`: PASS;
- `npm run check`: exit 0;
- `git diff --check`: PASS.

La suite del proxy cubrió gate apagado, token exacto, reemplazo de headers
confiables y trazas, mapping owner/member, roles inválidos, fallo de token,
timeout, 5xx, método no permitido y ausencia de filtración del detalle
upstream. El proxy no reintenta writes, rechaza redirects y limita el cuerpo de
respuesta a 5 MiB.

El smoke HTTP protegido genérico incluido en `npm run check` no recibió
`SMOKE_JWT` y reportó cobertura parcial de 1/2. El comando completo terminó con
exit 0, pero esta limitación se conserva explícitamente y no se presenta como
cobertura autenticada genérica completa.

## Validación integrada de confianza financiera

Se usó Phinance sin modificar, desde `main@c81e114`, con PostgreSQL 16 efímero
y su verificador RS256/JWKS real. El harness SST generó un JWT de servicio de QA
con el tuple contractual exacto y publicó un JWKS efímero sólo en loopback.

`npm run smoke:phinance-integrated`: PASS.

La prueba comprobó:

- creación y lectura por owner dentro de la cuenta validada;
- aislamiento de la misma identidad estable entre dos cuentas SST;
- `404` al intentar leer desde otra cuenta;
- `403 INSUFFICIENT_SCOPE` para escritura de member;
- reemplazo de un `X-SST-Account-ID` falsificado por el navegador;
- persistencia owner-local de tres perfiles, un recurso y un evento de
  auditoría durante la ejecución.

La validación de Auth fue una capa independiente y read-only sobre
`origin/develop@0be811f`: `npm run test:phinance-service-grant` pasó el tuple,
RS256/JWKS, claims, TTL y matriz negativa. El smoke de red no invocó un endpoint
live de Auth; combinó esa prueba owner del grant con el verificador HTTP real de
Phinance. Esta distinción evita atribuir una cobertura no ejecutada.

## Higiene de cierre

Los procesos SST/Phinance de QA se detuvieron, las bases PostgreSQL efímeras se
destruyeron y el contenedor SST preexistente se restauró. No quedaron procesos
Node/Python asociados a CR-HPT-0018. Los roots sucios de SST, Auth y Phinance no
se modificaron.

`npm ci` informó vulnerabilidades preexistentes tanto en SST como en Auth. No
se modificaron dependencias y este request no las reclasifica como resueltas.
