# Owner Documentation Authority Policy

## Proposito

Definir quien es autoridad documental cuando el control-plane orquesta cambios
en repos hijos, contratos tecnicos, capabilities cross-repo y evidencia general.

Esta policy evita que una implementacion quede documentada solo en el
control-plane cuando el comportamiento real pertenece a un repo hijo.

## Principio

La documentacion principal vive donde vive la responsabilidad tecnica.

El control-plane registra decision, plan, evidencia, scope, Jira mirror y
orquestacion. No reemplaza el ARDS/SDD owner del repo que implementa o expone el
contrato.

## Autoridades

### Repo hijo owner

El repo hijo es autoridad para:

- comportamiento runtime que implementa;
- modelos, migraciones, endpoints, workers, UI o extension code propios;
- specs tecnicas del repo;
- docs tecnicas del repo;
- pruebas y validacion local;
- capabilities que produce hacia otros repos.

Cuando una CR modifica un repo hijo, ese repo debe recibir la actualizacion
ARDS/SDD owner correspondiente dentro del mismo lifecycle, salvo excepcion
explicita.

### Productor de capability

El repo que produce una capability es autoridad para:

- contrato outbound;
- versionado del contrato;
- compatibilidad y breaking changes;
- evidencia de validacion del productor.

### Consumidor de capability

El repo que consume una capability es autoridad para:

- contrato inbound o adopcion local;
- supuestos de integracion;
- degradacion y fallback local;
- evidencia de validacion del consumidor.

### Control-plane

El control-plane es autoridad para:

- request lifecycle;
- iniciativa y backlog gobernado;
- evidencia de ejecucion y decision;
- ownership cross-repo observado;
- catalogo logico de servicios y soluciones;
- planes de orquestacion;
- Jira como mirror, no source of truth.

La evidencia central puede probar que un cambio ocurrio, pero no sustituye las
specs, docs o contracts del repo owner.

### Core canonico

`4uentes-ards-core` sigue siendo autoridad para estandares ARDS/SDD compartidos,
kinds, profiles, templates, schemas y handoff rules.

El control-plane puede registrar adopcion local, pero no redefinir el canon del
core.

## Reglas Obligatorias

- Si una CR modifica runtime o contratos de un repo hijo, debe actualizar la
  documentacion ARDS/SDD owner del repo hijo.
- Toda CR que permita mutacion de repo hijo desde el control-plane debe ejecutar
  el gate de owner documentation del control-plane antes del cierre. El camino
  normal es `npm.cmd run check`, que incluye
  `node scripts/verify-owner-documentation.js`; `npm.cmd run check:owner-docs`
  puede usarse como diagnostico focalizado, pero no reemplaza el `check`
  completo de cierre.
- El gate no debe excluirse por haber ejecutado solamente checks del repo hijo.
  La validacion del repo hijo prueba comportamiento local; el gate del
  control-plane prueba ownership documental, scope y evidencia.
- Si el gate no puede ejecutarse, la CR no debe cerrarse como completa; debe
  registrar blocker verificable o excepcion aprobada.
- Si no existe superficie documental estable en el repo hijo, la CR debe crear
  una excepcion documentada con motivo, owner, deuda y follow-up.
- La evidencia del control-plane debe listar las rutas owner actualizadas o la
  excepcion aprobada.
- Una CR no debe cerrarse como completa solo con evidencia central si el repo
  owner quedo desactualizado.
- Las capabilities cross-repo deben identificar productor, consumidor y rol del
  control-plane.
- Jira no es autoridad documental; solo refleja estado o plan cuando se use como
  mirror.
- No se debe usar el control-plane para esconder deuda tecnica documental de un
  repo hijo.

## Mapa De Ownership

| Cambio | Autoridad primaria | Evidencia esperada |
| --- | --- | --- |
| Endpoint, modelo, migracion o service runtime | Repo hijo implementador | Specs/docs/tests del repo hijo y evidencia central |
| UI o extension behavior | Repo hijo frontend/extension | Specs/docs/tests del repo hijo y evidencia central |
| Capability outbound | Repo productor | `specs/capabilities/outbound/` o superficie equivalente |
| Capability inbound | Repo consumidor | `specs/capabilities/inbound/` o superficie equivalente |
| Decision cross-repo, scope, plan, Jira mirror | Control-plane | Request, initiative, evidence |
| Canon ARDS/SDD compartido | `4uentes-ards-core` | Core specs/templates/policies |

## Checklist Para CRs Con Repos Hijos

Antes de modificar:

- Identificar repo owner y superficies ARDS/SDD afectadas.
- Identificar producer/consumer si hay capability cross-repo.
- Registrar plan de archivos owner o excepcion prevista.

Durante implementacion:

- Actualizar codigo y documentacion owner en el mismo lifecycle.
- Mantener evidencia central con rutas exactas.
- No cerrar gaps documentales como si fueran validacion exitosa.

Antes de cierre:

- Validar repo hijo con comandos locales relevantes.
- Ejecutar `npm.cmd run check` en el control-plane cuando la CR haya permitido
  o realizado mutacion de repo hijo, aunque no se hayan tocado archivos del
  control-plane durante la implementacion funcional.
- Confirmar que `scripts/verify-owner-documentation.js` paso dentro de
  `npm.cmd run check` o registrar blocker.
- Confirmar que la evidencia central referencia owner docs actualizados o una
  excepcion documentada.

## Excepciones

Una excepcion solo es valida si incluye:

- repo afectado;
- owner responsable;
- razon por la que no se actualizo documentacion owner;
- riesgo;
- follow-up CR o TODO verificable;
- evidencia de que el control-plane no esta sustituyendo la autoridad owner.

## Caso Actual Detectado

`CR-SST-0092` implemento `LearningWorkspace` en `sst-bend` y dejo evidencia
central completa de implementacion y validacion. Sin embargo, la documentacion
ARDS/SDD owner de `sst-bend` para el nuevo contrato runtime no quedo completa.

Eso debe tratarse como deuda de documentacion owner y requiere follow-up antes
de considerar totalmente cerrado el modelo documental de esa implementacion.

## Definition of Done

- La autoridad documental queda identificada antes de mutar repos hijos.
- El repo owner conserva specs/docs/capabilities actualizados.
- El control-plane conserva evidencia de orquestacion y rutas owner.
- Las excepciones quedan explicitas y trazables.
- `npm.cmd run check` del control-plane pasa o queda bloqueado con evidencia
  explicita antes de cualquier cierre local.
