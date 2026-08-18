# QA manual con Chrome DevTools de CR-SST-0160

Fecha: `2026-08-13`

Superficie: `http://localhost:4090/dictionary`, tab `Secretos`
Resultado: `pass-with-frontend-gap`

## Alcance y restricciones

La prueba se realizo exclusivamente desde la interfaz SST mediante Chrome
DevTools MCP. Se uso la credencial local documentada sin copiarla a evidence.
No se consultaron ni modificaron bases de datos directamente, no se ejecutaron
seeders y no se crearon usuarios.

El BF local respondia inicialmente `404` para
`GET /api/diccionario/secrets`. La ruta existe en el codigo local, pero el
contenedor ejecutaba una copia anterior. Se reconstruyo y recreo solamente el
servicio `fuentes`; Mongo permanecio levantado e intacto. Luego la lista
respondio `200`.

## Flujo probado

Se creo desde la UI un unico secreto sintetico temporal. No se registra en este
documento su plaintext, identificador runtime, token, cookie ni cuenta.

| Escenario | Resultado |
| --- | --- |
| Login local documentado en `localhost:4090` | PASS |
| Lista de secretos | PASS, HTTP `200` |
| Create desde formulario UI | PASS, HTTP `201` |
| Valor enmascarado por defecto | PASS |
| Reveal explicito con motivo | PASS, HTTP `200` |
| Ocultar nuevamente | PASS |
| Copy auditado | PASS, HTTP `200`, confirmacion visual |
| Revoke con confirmacion | PASS, HTTP `200` |
| Estado persistente tras nuevo login | PASS, `revoked` |
| Reveal/copy/revoke deshabilitados luego de revoke | PASS |
| Logout al finalizar | PASS |

El registro sintetico queda revocado y visible como evidencia auditable porque
la operacion DELETE del contrato implementa revocacion logica, no borrado
fisico. No se uso acceso directo a datos para eliminarlo.

## Hallazgos

1. La tarjeta de secreto activo no ofrece accion de `rotate`, aunque el
   contrato frontend y el endpoint BF declaran esa capacidad. Rotate no pudo
   validarse manualmente desde la UI.
2. Chrome reporta dos campos de formulario sin label asociado.
3. Existe un warning no bloqueante de migracion futura de React Router v7.
4. El entrypoint de cluster `http://localhost:8088` rechazo con `401` la
   credencial historica documentada; el QA funcional se completo en el
   entrypoint frontend local `http://localhost:4090`.

No hubo errores de consola del flujo de secretos luego de actualizar el BF. No
se inspeccionaron request headers ni response bodies durante la validacion
final para evitar exponer credenciales o plaintext.

## Decision

La superficie manual de create, masked-by-default, reveal, copy y revoke queda
validada localmente. El gap de rotate es de frontend y no invalida el cierre
backend de SST-93, pero debe resolverse antes de afirmar cobertura UI completa
de `dictionary-secret-management-v1`.
