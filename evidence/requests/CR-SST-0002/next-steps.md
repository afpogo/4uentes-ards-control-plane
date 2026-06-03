# CR-SST-0002 - Proximos Pasos

## Fase Siguiente Recomendada

Fase 4 debe seguir request-controlled y ARDS/evidence-first. No modificar
product runtime hasta que el control-plane pueda registrar servicios afectados,
artefactos previstos, comandos de validacion y decision de aprobacion exactos.

## Antes De Fase 4

1. Crear localmente `environments/local/bindings.local.yaml`, ignorado por Git,
   para que futuras ejecuciones no dependan de paths de inventario.
2. Decidir si `translations` y `aliases` forman parte de dictionary runtime v1 o
   de un target-state diferido.
3. Separar `security/offline/encryption` en requests independientes:
   - secure masking/reveal y comportamiento owner-role;
   - politica de encryption-at-rest;
   - modelo offline/server isolation.
4. Decidir si extension account context esta dentro del scope antes de habilitar
   `x-active-account-id` desde `sst-extension`.

## Targets De Validacion Sugeridos Para Fase 4

- `sst-bend`: tests focalizados Stage 2/Stage 3 de dictionary si es seguro en el
  ambiente local.
- `4uentes-auth`: checks de BFF dictionary pass-through.
- `sst-fend`: tests de dictionary action/slice/page.
- `sst-extension`: tests de dictionary gateway/service/message.
- `sst-4uentes-infra`: revision manual o check command futuro de infra, porque
  el catalogo actualmente tiene `check_command: TODO`.

## Warnings Aceptados

- Falta `environments/local/bindings.local.yaml`.
- Se observaron dirty working trees en Fase 0 para `sst-bend`, `sst-fend`,
  `sst-extension` y `sst-4uentes-infra`.
- `sst-extension` es optional-active y esta en estado bootstrap Git.
- `sst-4uentes-infra` no tiene check command en el catalogo.
- Este dry-run no valido endpoints live.

## No Hacer Todavia

- No mover CR-SST-0002 a `done`.
- No crear specs en repos funcionales desde este dry-run.
- No refactorizar dictionary runtime.
- No inferir implementacion de encryption/offline desde documentacion de
  seguridad.
