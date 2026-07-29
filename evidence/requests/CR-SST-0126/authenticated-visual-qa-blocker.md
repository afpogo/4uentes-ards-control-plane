# CR-SST-0126 - Bloqueo De QA Visual Autenticado

Fecha: 2026-07-10

> Estado: supersedido. El usuario autentico una sesion real y el QA se reanudo.
> El resultado vigente esta en
> `evidence/requests/CR-SST-0126/authenticated-visual-qa-2026-07-10.md`.

## Resultado

El QA autenticado requerido no pudo ejecutarse. Al navegar a
`http://localhost:4090/artsst`, el frontend sirvio la ruta pero `AuthGate`
redirigio a la portada publica `http://localhost:4090/` porque la sesion del
navegador no estaba autenticada.

No se intentaron extraer, inventar ni reutilizar credenciales. Por lo tanto no
se validaron todavia:

- desktop `1440x900`;
- mobile `390x844`;
- `/artsst?view=edit&detail=<id>`;
- creacion de articulo `text`;
- `Workspace SST` embebido;
- `/learning` standalone;
- orden del rail en mobile;
- ausencia de overflow, solapamientos o texto cortado en superficies privadas.

## Evidencia

- Captura: `evidence/requests/CR-SST-0126/qa-auth-blocker-public-cover.png`.
- Navegacion: `GET /artsst` respondio `200` y la aplicacion termino en `/`.
- Auth bootstrap observado: `GET /api/auth/csrf` respondio `404` y
  `POST /api/auth/logout` respondio `401` en esta sesion no autenticada.
- Consola publica: warnings React/StrictMode preexistentes y errores de recursos
  asociados a auth sin sesion; no constituyen QA de la capability protegida.

## Decision

- Mantener el feature state en `validated-local`.
- Mantener `CR-SST-0126` en `planned` y Jira `SST-54` en `En curso`.
- No elevar a `ready-for-release` ni mover el request a `done`.
- Reanudar con una sesion autenticada real. Si el QA revela un defecto que exige
  codigo, abrir un bugfix CR separado.
