# CR-SST-0192 - Plan De Handoff A Repos Owner

Fecha: 2026-08-17

## Regla

Este contrato no modifica repos funcionales. Cada adopciÃ³n requiere el CR ya
planificado, un worktree limpio por repositorio y actualizaciÃ³n del contrato
owner. La evidencia del control plane no reemplaza esas specs.

## `CR-SST-0193` - `sst-bend`

Debe adoptar:

- `user_memory_space`, events, proposals, facts, intentions, threads y recall
  audit;
- scope completo sin tenant fallback;
- idempotencia y lifecycle;
- clasificaciÃ³n, secret detection, retention y deletion propagation;
- APIs autenticadas/internas y tests negativos.

Gate owner: migraciÃ³n reversible, tests de repositorio, harness HTTP y
`npm run check`.

## `CR-SST-0194` - `sst-chatbot`, `sst-bend`, `4uentes-auth`

Debe adoptar:

- source y proposal ports contra `sst-bend`;
- `PrincipalContext` validado y JWT M2M acotado;
- RAG sobre memoria aceptada;
- contexto mÃ­nimo, citas y output disclosure;
- cancelaciÃ³n y smoke con provider simulado.

Gate owner: tests fake-backed, cobertura del paquete gobernado, smoke NDJSON y
checks de cada repo modificado.

## `CR-SST-0195` - `sst-bend`, `sst-chatbot`

Debe adoptar:

- manifest versionado;
- paths relativos y rechazo de traversal;
- modos logical/physical/hybrid;
- exclusiÃ³n de secretos, propuestas, borrados y chat crudo;
- ZIP determinista y expiraciÃ³n del artefacto.

## `CR-SST-0196` - `sst-fend`, `4uentes-auth`, `sst-bend`

Debe adoptar:

- revisiÃ³n, aceptaciÃ³n y rechazo;
- provenance, correcciÃ³n, archive y delete;
- solicitud y descarga de export;
- rutas protegidas y estados de error/offline;
- prohibiciÃ³n de persistir tokens o contenido de memoria en Redux Persist.

## `CR-SST-0197` - Auth, backend y chatbot

Debe adoptar:

- separaciÃ³n entre roles humanos y perfiles de robot;
- capabilities `memory.read`, `memory.propose`, `memory.handoff`;
- vistas filtradas y auditorÃ­a de IDs consumidos;
- denegaciÃ³n de escalamiento por prompt.

## `CR-SST-0198` - Cierre E2E

Debe probar la vertical completa, incluyendo reinicio, nueva conversaciÃ³n,
recall con citas, export, borrado, idempotencia y aislamiento. El QA manual de
usuario corresponde aquÃ­, una vez implementadas las superficies anteriores.

## Secuencia Recomendada

```text
CR-SST-0192 contrato
  -> CR-SST-0193 backend canÃ³nico
  -> CR-SST-0194 propuesta + recall
  -> CR-SST-0195 proyecciÃ³n
  -> CR-SST-0196 controles de usuario
  -> CR-SST-0197 robots
  -> CR-SST-0198 E2E y cierre
```

`CR-SST-0195` puede avanzar en paralelo con la parte tardÃ­a de `CR-SST-0194`
despuÃ©s de estabilizar las APIs de `CR-SST-0193`. El QA manual visible no debe
adelantarse a `CR-SST-0196`.
