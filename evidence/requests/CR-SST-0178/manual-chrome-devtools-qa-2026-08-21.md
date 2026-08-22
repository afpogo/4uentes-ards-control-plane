# QA manual con Chrome DevTools - 2026-08-21

## Alcance y limites

La prueba se ejecuto en `http://localhost:8088` con Chrome DevTools MCP y un
perfil de automatizacion aislado. La identidad y la conversacion sinteticas se
crearon exclusivamente desde la UI. No se consulto la base de datos, no se
ejecutaron seeders y no se conservaron passwords, cookies, CSRF, JWT ni valores
de storage.

El dominio ngrok reservado se abrio sin headers de bypass y mostro la pagina
antiabuso `ERR_NGROK_6024` antes del OAuth. No se acepto esa advertencia ni se
automatizaron credenciales GitHub en este corte.

## Resultados aprobados

- El registro sintetico llego al backend con `POST /api/auth/register` `200`.
- El login posterior con la misma identidad devolvio `200`.
- Una recarga dura mantuvo la sesion mediante `POST /api/auth/refresh` `200`.
- El acceso `Chat` fue visible en header y dashboard solo durante la sesion.
- `/chat` conservo `AuthGuard` y mostro estado `online`.
- El campo de mensaje expuso `id=sst-chat-message`, `name=message`,
  `aria-label=Mensaje`, label asociado y estado habilitado correcto.
- La UI creo una conversacion (`201`), envio el mensaje sintetico y mostro la
  respuesta completa `SST recibio`.
- La recarga dura de `/chat` recupero el mensaje y la respuesta desde historial
  (`GET .../messages?afterSequence=0` `200`).
- La revalidacion previa del mismo historial devolvio `304` sin body, semantica
  HTTP esperada y no perdida de mensajes.
- El logout se emitio una sola vez.

## Fallos de aceptacion reproducidos

1. La pantalla de signup muestra `Between 8 to 12 characters`; el contrato de
   esta adopcion exige 15-128 caracteres, sin reglas de composicion ni
   truncamiento. El formulario acepto una password sintetica de mas de 15
   caracteres, por lo que tambien existe inconsistencia visible entre ayuda y
   validacion.
2. Tras `register 200`, la navegacion termino como invitado. La secuencia de red
   fue `GET /api/auth/csrf` `404`, `POST /api/auth/refresh` `401` y
   `POST /api/auth/logout` `401`. Por ello no pasa registro -> hard navigation
   -> refresh -> `/chat`.
3. El logout iniciado desde una sesion valida emitio exactamente un
   `POST /api/auth/logout`, pero respondio `401`. Despues se ejecuto
   `GET /api/articulos?...` y respondio `401`, incumpliendo la barrera que debe
   impedir cargas autenticadas posteriores al inicio del logout.

## Decision de lifecycle

`CR-SST-0200` permanece `running` por los tres fallos anteriores y
`CR-SST-0178` permanece `running` como coordinador. El chat realtime, la
recuperacion de historial y la sesion posterior a login estan operativos, pero
no compensan los gates de registro y teardown. No se realizaron mutaciones en
repos hijos, cluster o Jira durante este QA.
