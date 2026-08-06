# Revision De Seguridad

## Limites Confirmados

- Toda escritura requiere un lote explicito con request, provider, proyecto,
  issues o candidatos, operaciones, parent/status esperado y ventana.
- El lote se consume o vence al completarse.
- Se rechazan borrados, wildcards, bulk no acotado y operaciones no enumeradas.
- La ejecucion desde repos hijos queda prohibida.
- Secretos, credenciales, tokens, cookies, auth headers, JWT, URLs privadas e
  identificadores privados de conexion bloquean publicacion y evidencia.
- La busqueda de duplicados y la identidad estable preceden toda creacion.

## Resultado

La policy conserva la autoridad ARDS/SDD y limita el tracker a espejo operativo
e intake read-only. No se detecto autorizacion implicita para ampliar escrituras.

