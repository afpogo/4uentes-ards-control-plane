# Validación local del provider grant

Fecha: 2026-08-27

## Resultado

El grant dedicado quedó registrado y validado localmente con la tuple exacta:

- issuer: `sst-auth`;
- client y subject: `4uentes-automation-receipt-intake`;
- audience: `sst-api`;
- scope: `finance:receipt-intake:create`;
- `token_use`: `service`;
- firma: RS256 y verificación mediante JWKS;
- TTL máximo: 300 segundos;
- refresh token: ausente.

La matriz negativa rechazó client, secreto, audience, scope compuesto, scope
comodín y `grant_type` incorrectos. También verificó que el token no incluya
identidad de usuario, cuenta, tenant, membresía ni entitlements financieros;
que un secreto vacío desactive el grant; y que no se reutilicen las
credenciales de SST, chatbot o del grant inverso hacia Automation.

## Comandos y evidencia

- `npm run build`: PASS.
- `node scripts/test-automation-receipt-intake-service-grant.js`: PASS.
- `npm run check` en el worktree aislado de Auth: PASS, incluyendo ARDS check,
  TypeScript build y todas las suites contractuales existentes.
- `npm run check` en `4uentes-orchestor`: PASS; catálogo, bindings, estado (55
  capability links), 22 iniciativas, 126 gates de documentación owner y 15
  mapas visuales validados. Persisten cuatro warnings preexistentes por remotes
  de repositorios distintos del catálogo.
- `git diff --check`: PASS.

El worktree no contenía dependencias instaladas. Para ejecutar las pruebas se
montó temporalmente un junction local hacia el `node_modules` ya existente del
baseline `cr-cp-0021`; no se instaló ni cambió ninguna dependencia. El junction
se eliminó al terminar y no forma parte del delta versionable.

Este resultado no prueba provisionamiento, despliegue, red ni tráfico protegido
integrado. Esas acciones siguen fuera del alcance de `CR-HPT-0016`.
