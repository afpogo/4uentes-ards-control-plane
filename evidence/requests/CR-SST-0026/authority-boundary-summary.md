# CR-SST-0026 - Boundary De Autoridad

Observado el: 2026-06-04

## Correccion 2026-06-05

CR-SST-0030 separa el ARDS/SDD del proyecto de la memoria interna de usuario en
SST.

Donde este artifact dice "ARDS/SDD de usuario", la lectura implementable debe
ser "memoria interna de usuario SST". La regla de autoridad sigue vigente: el
chatbot propone memoria, el backend autorizado valida y persiste, y el frontend
expone revision/visualizacion.

## Decision

El ARDS/SDD de usuario necesita una separacion explicita entre generacion,
validacion, persistencia y visualizacion.

## Responsabilidades

### `sst-fend`

- Inicia acciones visibles del usuario.
- Muestra fuentes, estado, resumenes, evidencia y entradas ARDS.
- Permite revision o aprobacion cuando el backend expone esa capacidad.
- No escribe directamente entradas finales del ARDS/SDD.
- No llama al agente como autoridad principal.

### `sst-bend`

- Gobierna la mutacion durable del ARDS/SDD de usuario.
- Valida scope `tenant_id`, `account_id` y `user_id`.
- Aplica idempotencia, autorizacion, estados y auditoria.
- Persiste fuentes, snapshots, propuestas aceptadas y knowledge entries.
- Consume resultados de `sst-chatbot` como propuestas, no como verdad final.

### `sst-chatbot`

- Produce propuestas estructuradas para el ARDS/SDD.
- Mantiene memoria operacional agentica cuando corresponda.
- Versiona prompts, provenance y agent runs.
- No tiene autoridad final para mutar el ARDS/SDD del usuario.
- No debe escribir directo en storage de producto sin contrato backend.

### `4uentes-auth`

- Provee identidad, sesion, account scope y autorizacion compartida.
- No debe convertirse en owner del dominio ARDS/SDD de SST.
- Participa porque el ARDS/SDD de usuario depende de permisos correctos.

### `4uentes-orchestor`

- Registra lifecycle, planning, evidence y boundaries cross-repo.
- No reemplaza ARDS/SDD locales de repos funcionales.
- No modifica repos hijos sin request aprobado.

## Regla De Mutacion

```text
agent output
  -> ards_proposal
  -> backend validation
  -> optional user review
  -> user ARDS/SDD mutation
```

No se acepta este flujo:

```text
agent output
  -> direct user ARDS/SDD mutation
```

## Riesgos Controlados

- El usuario conserva control sobre conocimiento visible.
- El backend conserva auditoria e idempotencia.
- El agente no confunde memoria operacional con ARDS/SDD final.
- Las futuras UI pueden mostrar propuestas sin consolidarlas automaticamente.
