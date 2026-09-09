# CR-SST-0239: preflight documental de ejecución

## Resultado

El plan de CR-SST-0239 fue fusionado mediante el PR `#282`, merge
`5a0ea3509e3d6f2fc7dbca67da5e32f41449e987`, y releído desde `origin/main`.
Este checkpoint inicia `running` únicamente para documentar el futuro acceso
QA al edge; no ejecuta ese acceso.

## Autoridad y camino aprobado

`sst-4uentes-infra` conserva la autoridad sobre el dominio reservado, Traffic
Policy OAuth, allowlist y operación de ngrok. Sus runbooks ya establecen el
camino preferido:

1. mantener el redirect OAuth para solicitudes no autenticadas;
2. reutilizar un operador incluido en la allowlist individual;
3. completar GitHub OAuth de forma interactiva en el navegador;
4. llegar a SST por el mismo origin público, sin rutas directas a servicios;
5. no registrar URL privada, cookies, tokens, credenciales ni headers.

No se inspeccionó la configuración local real de ngrok ni material de sesión.
Tampoco se verificó que la sesión del operador esté actualmente aceptada; esa
comprobación pertenece al gate runtime posterior.

## Gate runtime propuesto

Una autorización posterior debe permitir de forma explícita una sola sesión
de navegador OAuth y la creación de una identidad SST sintética. La identidad
puede quedar como residuo porque hoy no existe contrato de producto para
eliminarla; las conversaciones sí deben limpiarse por contratos del producto
en un bloque de cierre incluso si una fila falla.

Si el operador no está allowlisted, el agente debe detenerse. Este lifecycle
no autoriza cambiar la allowlist, leer o escribir la config privada ni
reiniciar ngrok.

## Operaciones no realizadas

No hubo navegador OAuth, identidad o datos sintéticos, escritura Jira, cambio
de configuración o reinicio ngrok, modificación de repos hijos, deployment,
cluster, datastore, secretos ni producción.
