# QA aislado de navegador para CR-SST-0178

## Resultado

El QA se ejecutó con el Chrome DevTools MCP dedicado y un contexto aislado
vacío. La autenticación, el refresh y el logout funcionaron, pero el E2E de
Socket.IO falló por una ruta ausente en el Ingress de development. El CR debe
permanecer en `running`.

## Alcance y seguridad

- Origen probado: `http://localhost:8088`.
- Contexto aislado: `cr-sst-0178-qa-20260819`.
- Cuenta: identidad sintética con dominio reservado `example.invalid`.
- No se registraron password, access token, refresh token, CSRF ni valores de
  cookies.
- Se inspeccionaron únicamente nombres de storage/cookies y estados HTTP.
- No hubo mutaciones en repos hijos, GitOps, clúster ni Jira.

La cuenta sintética permanece en la base de development. Su eliminación no
forma parte de este lote porque sería una acción destructiva independiente.

## Casos ejecutados

| Caso | Resultado | Evidencia observada |
| --- | --- | --- |
| Portada pública | PASS | Documento `200`, sin errores ni warnings de consola. |
| Login inválido | PASS | Una request `401`, mensaje genérico y sin reflexión del password. |
| Registro sintético | PASS con gap | `POST /api/auth/register` `200` y workspace autenticado. |
| Persistencia posterior al registro | FAIL | No apareció `auth.profile`; una navegación completa a `/chat` volvió a la portada sin intentar refresh. |
| Login sintético | PASS | `POST /api/auth/login` `200`; se guardó `auth.profile`. |
| Higiene del navegador | PASS | Sin password en DOM; `sessionStorage` vacío; sólo `csrf_token` visible, compatible con refresh HttpOnly no legible. |
| Refresh en navegación directa | PASS | `POST /api/auth/refresh` `200` al abrir `/chat`. |
| Render de `/chat` | PASS | Se mostró `Chat SST` con estado `offline`. |
| Socket.IO | FAIL | Polling repetido `200 text/html`; no hubo upgrade WebSocket. |
| Retry visible | FAIL esperado | Permaneció `offline`; input y botón Enviar siguieron deshabilitados. |
| Logout | PASS con gap | Primer logout `204`, perfil/cookies visibles limpiados; luego se observaron un fetch de artículos `401` y un segundo logout redundante `401`. |

## Causa raíz del blocker

El cliente solicita:

`/4uentes/realtime/socket.io/?EIO=4&transport=polling`

La respuesta real es el `index.html` de `sst-fend`, con `content-type:
text/html`. El readback del Ingress `sst-ingress` muestra rutas para
`/.well-known/jwks.json`, `/api` y el catch-all `/`, pero ninguna ruta para
`/4uentes/realtime/socket.io` o `/4uentes/realtime` hacia
`sst-bend-service:3005`.

Por lo tanto, el catch-all `/` captura el handshake y lo envía al frontend. El
runtime interno de Bend y Chatbot puede estar sano al mismo tiempo que el
navegador permanece offline; los smokes internos anteriores no cubrían este
salto de Ingress.

## Hallazgos adicionales

1. El registro crea una sesión válida en memoria, pero no persiste el perfil
   mínimo que el bootstrap exige antes de intentar refresh. El login normal sí
   lo persiste. Debe agregarse una regresión registro -> hard navigation.
2. No existe un acceso visible al chat en el workspace; la ruta sólo fue
   alcanzable escribiendo `/chat` directamente.
3. El frontend desplegado todavía envía el protocolo password legacy y la UI de
   registro conserva la política de 8 a 12 caracteres con composición. Esto se
   registra como observación de la adopción pendiente de `CR-SST-0159`, no como
   causa del fallo Socket.IO.
4. El textbox del chat carece de `id` o `name`, reportado por DevTools como
   issue de formulario/accesibilidad.
5. Logout limpia la sesión, pero dispara trabajo autenticado posterior y un
   segundo logout `401`; conviene corregir el orden de teardown.

## Gate de corrección requerido

Antes de repetir QA:

1. aprobar un nuevo lote owner para `sst-4uentes-infra`;
2. agregar una ruta Ingress específica para Socket.IO hacia `sst-bend-service`
   antes del catch-all frontend, incluyendo upgrade WebSocket;
3. renderizar Kustomize y ejecutar dry-run/check owner;
4. fusionar y reconciliar únicamente mediante Git/Argo CD;
5. verificar que el handshake responda Engine.IO, ascienda a WebSocket y el
   estado cambie a `online`;
6. enviar un mensaje sintético, comprobar eventos hasta `completed`, refresh,
   recovery y logout;
7. corregir o atomizar los gaps de registro, navegación y teardown sin
   mezclarlos silenciosamente con el fix Infra.

Hasta completar ese lote, no se declara Socket.IO browser PASS ni cierre de
`CR-SST-0178`.
