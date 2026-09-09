# Validación owner de CR-HPT-0022

Fecha: 2026-08-28

## Resultado

El grant M2M `finance:receipt-object:create` quedó implementado y validado
localmente en el worktree aislado
`worktrees/CR-HPT-0022-auth-owner`. No se modificó el worktree activo de
`4uentes-auth`, no se generaron secretos y no se desplegó runtime.

El principal `4uentes-automation-receipt-object` usa audience exacta
`sst-api`, JWT RS256 con `token_use=service`, scope único y TTL máximo de 300
segundos. El grant de intake permanece separado y ambos fallan cerrados si la
audience SST no es literalmente `sst-api`.

## QA ejecutada

```text
npm run check
PASS automation receipt-intake grant
PASS automation receipt-object grant
exit code 0
```

La matriz cubre:

- tuple positivo y claims RS256/JWKS;
- scope de intake usado con el principal de objetos;
- scopes compuesto y wildcard;
- principal y audience incorrectos;
- header Bearer sintético de usuario;
- TTL superior a 300 segundos;
- client ID configurado incorrectamente;
- reutilización de secretos entre grants;
- grant desactivado cuando el secreto está vacío;
- audience SST configurada con un valor distinto de `sst-api`.

## Revisión de seguridad

La revisión independiente detectó inicialmente que la audience provenía de
una configuración mutable sin pin explícito. Se corrigió agregando un assert
fail-closed para los dos grants de comprobantes y el negativo de configuración.
La repetición del check owner pasó completa.

No se registraron JWT, headers de autorización reales, credenciales ni datos
financieros.

