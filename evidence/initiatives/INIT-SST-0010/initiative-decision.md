# INIT-SST-0010 - DecisiÃ³n De Iniciativa

Fecha: 2026-08-17

## DecisiÃ³n

Se crea `INIT-SST-0010` para materializar la intenciÃ³n original de SST como
base de conocimiento personal gobernada por tags y asistida por agentes.

La iniciativa adopta una separaciÃ³n explÃ­cita:

```text
memoria canÃ³nica estructurada en SST
  -> Ã­ndices y vistas autorizadas
  -> proyecciÃ³n portable inspirada en ARDS
  -> rÃ©plica de dispositivo opcional en una fase posterior
```

La proyecciÃ³n fÃ­sica no es un clon del ARDS/SDD del proyecto. El ARDS/SDD del
control plane gobierna el desarrollo; la memoria interna de usuario es un
modelo runtime privado de SST.

## Resultado Esperado

El primer resultado visible serÃ¡ el circuito:

```text
"recordame que quiero estudiar Spring Security"
  -> evento durable
  -> propuesta estructurada
  -> validaciÃ³n backend
  -> intenciÃ³n aceptada
  -> nueva conversaciÃ³n
  -> recall con provenance
```

## Decisiones De Storage

- `sst-bend` serÃ¡ la autoridad de memoria canÃ³nica.
- Postgres almacenarÃ¡ identidad, scope, estados, tags y relaciones.
- Sources o artifacts grandes podrÃ¡n usar object storage mediante un request
  posterior.
- Desktop podrÃ¡ materializar un Ã¡rbol portable.
- Mobile usarÃ¡ almacenamiento privado cifrado y exportaciÃ³n explÃ­cita; una
  rÃ©plica offline completa queda fuera del MVP canÃ³nico.

## Jira

Jira serÃ¡ un espejo operativo. La iniciativa local y sus CRs existen antes de
la creaciÃ³n de la Epic y las tareas.
