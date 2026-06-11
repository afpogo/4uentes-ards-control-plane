# CR-SST-0031 - Boundary De Autoridad Y Privacidad

Observado el: 2026-06-05

## Decision

La memoria interna de usuario es informacion privada y accionable. Por eso el
chatbot puede proponer y recuperar, pero el backend autorizado gobierna
persistencia, permisos e idempotencia.

## Responsabilidades

### `sst-bend`

- Owner recomendado de escritura durable.
- Valida `tenant_id`, `account_id`, `user_id`.
- Controla idempotencia.
- Persiste eventos, hechos, intenciones y recalls.
- Expone APIs para chatbot y frontend.

### `sst-chatbot`

- Propone hechos e intenciones.
- Solicita recall.
- Resume memoria recuperada.
- No saltea validacion backend.
- No persiste memoria durable por fuera del contrato.

### `4uentes-auth`

- Provee identidad, sesion y account scope.
- Debe impedir recall o escritura cross-user.

### `sst-fend`

- Puede disparar eventos visibles.
- Puede mostrar memoria y revision en fases posteriores.
- No es authority de persistencia.

## Reglas De Privacidad

- Ningun recall puede cruzar `tenant_id`, `account_id` o `user_id`.
- El payload de evento debe ser minimo suficiente; no guardar datos no
  necesarios.
- La memoria inferida debe marcar confidence y source events.
- El usuario debe poder revisar memoria visible cuando se implemente UI.

## Boundary Con ARDS/SDD

El proyecto documenta este modelo mediante ARDS/SDD.

La memoria interna de usuario no es un ARDS/SDD por usuario.
