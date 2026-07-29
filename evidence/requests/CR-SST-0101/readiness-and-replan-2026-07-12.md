# CR-SST-0101 / SST-33 - Readiness Y Replan

## Resultado

SST-33 sigue siendo necesario, pero ya no debe planificarse como una futura
integracion runtime amplia. El slice correcto es definir en `sst-extension` el
contrato owner `CredentialedWebSource v1` como una proyeccion semantica del flujo
de captura de sesion que ya existe.

La implementacion de previews privadas de `CR-SST-0139 / SST-69` cubre un
artefacto opcional de esa fuente. No define la identidad completa de la fuente,
sus artefactos, provenance, limites ni relacion con `DictionarySecret` y
`LearningWorkspace`; por eso no reemplaza SST-33.

## Evidencia Revisada

Control plane:

- `CR-SST-0093` definio el boundary conceptual y priorizo `browser-session`.
- `CR-SST-0098`, `CR-SST-0099`, `CR-SST-0100` y `CR-SST-0119` estabilizaron la
  captura, outcomes, progreso y modos de sesion.
- `CR-SST-0139` agrego `previewCandidate` privado, opcional y consentido.
- `CR-SST-0121` conserva hardening de retencion, lifecycle y limites.
- `CR-SST-0102` conserva el handoff y gate de aceptacion de LearningWorkspace.
- `CR-SST-0103` conserva QA autenticada final con fixtures sanitizadas.

Repos owner y consumidores, en lectura:

- `sst-extension` tiene `SessionQueueItem`, snapshots `visual-pdf` o
  `textual-pdf`, metadata `articleKind/captureMode`, y una candidata de preview
  `browser-session` opcional.
- `sst-extension` no tiene todavia
  `specs/features/credentialed-web-source.yaml` ni su documento humano owner.
- `node-auth` publica `browser-extension-session-ingestion` y
  `article-preview-resolution-v1` como passthrough; no persiste este dominio.
- `sst-bend` es owner de la ingesta/persistencia de sesiones, articulos y preview
  canonica; no publica un agregado `CredentialedWebSource` separado.

Jira se consulto read-only el 2026-07-12. `SST-33` permanece en
`Tareas por hacer`, sin resolucion y sin assignee. Evidencia:
`evidence/requests/CR-SST-0101/jira-issue-SST-33-observation.md`.

## Matriz De Cobertura

| Elemento | Estado observado | Disposicion SST-33 |
| --- | --- | --- |
| Captura explicita del usuario | Implementada | Referenciar, no duplicar |
| Sesion multi-tab y artifacts PDF | Implementados | Mapear como inputs existentes |
| `captureMode` visual/textual | Implementado | Incorporar al contrato owner |
| Preview privada consentida | Implementada en SST-69 | Tratar como artefacto opcional |
| `CredentialedWebSource` owner spec | Ausente | Crear en `sst-extension` |
| Provenance sanitizada de fuente | Parcial/distribuida | Consolidar documentalmente |
| DictionarySecret plaintext en cliente | No implementado | Mantener prohibido |
| Backend `SecretRef` acquisition | No implementado | Excluir de v1 |
| `rawHtml` | No implementado | No declararlo implementado |
| Gate LearningWorkspace | No implementado aqui | Mantener en SST-34 |
| QA privada final | Pendiente | Mantener en SST-35 |

## Contrato Recomendado

`CredentialedWebSource v1` debe declarar:

- `sourceType: credentialed-web`;
- `captureMode: browser-session`;
- `producer: sst-extension`;
- accion explicita del usuario;
- una o mas tabs con snapshot visual o textual y degradaciones tipadas;
- candidata de preview privada opcional, solo con consentimiento por sesion;
- provenance runtime acotada y evidencia siempre sanitizada;
- `secretRef: null` y ausencia total de plaintext de `DictionarySecret`.

El contrato es una vista semantica sobre datos existentes. No agrega por si solo
campos HTTP ni una nueva entidad persistida. La URL completa puede ser necesaria
dentro del flujo runtime autenticado actual, pero no debe copiarse a Jira,
evidence, logs o ejemplos owner.

## Replan Atomizado

1. Crear la spec feature owner y registrarla en los indices de `sst-extension`.
2. Crear el documento humano owner en espanol.
3. Referenciar el contrato desde la spec de ingesta de sesiones existente,
   separando claramente source semantics de transport semantics.
4. Verificar que cada campo declarado como implementado existe en el runtime
   actual; dejar futuros campos como `future` o fuera de alcance.
5. Ejecutar `pnpm check` en `sst-extension`.
6. Registrar evidencia central sanitizada y ejecutar `npm.cmd run check` en el
   control plane.

## Limite De Mutacion

La ejecucion aprobada de SST-33 se limita a owner specs/docs en
`sst-extension`. Si durante la verificacion aparece la necesidad de cambiar
tipos, payloads, storage, BFF o backend, se debe detener la implementacion y
replanificar el owner correspondiente. SST-33 no autoriza mutaciones en
`node-auth`, `sst-bend` ni `sst-fend`.
