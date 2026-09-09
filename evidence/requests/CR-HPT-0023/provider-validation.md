# Validación owner de CR-HPT-0023

Fecha: 2026-08-28

## Resultado

El aprovisionamiento de bindings quedó implementado y validado localmente en
`worktrees/CR-HPT-0023-sst-owner`. El resultado se basa en la copia mecánica
preservada de `CR-HPT-0019`; no modifica el worktree activo de `sst-bend` y aún
no está integrado ni desplegado.

Las cuatro rutas aplican `verifyJWT`, `resolveAccountContext` y rol de cuenta
`owner`. El body sólo admite `reviewer_membership_ids`; las referencias se
resuelven contra memberships activas de la cuenta. Un lock transaccional y un
índice parcial garantizan un binding activo por cuenta, con rotación atómica,
identificador opaco de 128 bits y vencimiento a 90 días.

## QA ejecutada

```text
npm run check
PASS receipt intake
receipt binding provisioning tests: ok
[ARDS CHECK] OK
exit code 0
```

La matriz automatizada cubre owner positivo, ausencia de fallback a claims,
duplicado `409`, reviewer cross-account, campos de autoridad prohibidos,
rotación y rollback, revocación, expiración, aislamiento entre cuentas y
entropía del identificador. Los smokes protegidos que requieren JWT/runtime
promovido quedaron explícitamente omitidos por el check owner.

No se registraron JWT, headers de autorización, credenciales ni datos reales.
