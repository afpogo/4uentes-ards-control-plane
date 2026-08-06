CR-SST-0123 / SST-52 cierre validado.

QA autenticado ejecutado con Chrome DevTools MCP en:

- `http://localhost:4090/learning`

Resultado:

- `/learning` abre con sesion autenticada.
- `Generar preview` envia `annotations[]` no vacio.
- `POST /api/learning-workspaces/sources/preview`: 200.
- `Aceptar` completa correctamente.
- `POST /api/learning-workspaces/sources/{previewId}/accept`: 201.
- `GET /api/learning-workspaces/context`: 200.
- El template renderizado muestra la anotacion aceptada:
  `**clase** (clase): # Clase inicial`.
- El contexto aceptado contiene `annotations[]` no vacio.
- El contexto aceptado contiene documento `annotated-text-context` con
  `contentBlocks[]` no vacio.
- Consola sin errores JavaScript; solo logs i18n/auth y warning conocido de
  React Router future flag.

Evidencia control-plane:

- `evidence/requests/CR-SST-0123/chrome-authenticated-e2e-pass-2026-07-10.md`
- `evidence/requests/CR-SST-0123/chrome-learning-authenticated-e2e-pass-2026-07-10.png`
- `evidence/requests/CR-SST-0123/validation-results.md`

No se registran tokens, cookies, credenciales ni headers sensibles.

Decision: transicionar `SST-52` a `Listo`.

