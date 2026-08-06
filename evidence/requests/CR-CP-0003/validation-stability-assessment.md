# CR-CP-0003 - Evaluacion De Estabilidad De Validacion

## Senal Actual

La validacion del core ahora incluye un paso semantico llamado
`checkLivingResources` para `specs/states/feature-bugfix-state-model.yaml`.

Ese paso valida:

- que exista el archivo del recurso vivo;
- campos requeridos como `resource_class`, `origin_repo`, `canonical_owner` y
  `adoption_mode`;
- que `kind` sea `core_living_resource_spec`;
- que `resource_class` sea `core-profile-scoped-living-resource`;
- statuses canonicos y terminales minimos;
- markers de bugfix minimos;
- campos comunes requeridos para estados;
- que los paths de `template_binding` existan;
- que el template de adopcion tenga `kind: state_read_model_adoption` y
  `resource_id: feature-bugfix-state-model`.

La validacion del control-plane sigue siendo mas fuerte para estados ya
materializados, porque valida referencias locales a catalogo, soluciones,
requests, evidencia, validaciones y capability links.

## Nivel De Estabilidad

La validacion es suficiente para continuar ARDS-4 porque:

- el core falla si falta o se rompe el canon del living resource;
- el control-plane falla si la materializacion local queda invalida;
- ambos checks son reproducibles con `npm.cmd run check`.

Todavia no la llamo validacion madura completa porque:

- el core no expone un comando dedicado como `npm.cmd run check:living-resources`;
- la salida de consola del core todavia no muestra una seccion visible separada
  para living resources, aunque el check participa en el resultado y exit code;
- el validator del core todavia esta escrito para este recurso concreto y no
  como un validador generico registry-driven para cualquier familia futura de
  recursos vivos.

## Que Hacer Si No Hay Validacion Estable

Cuando un nuevo recurso vivo ARDS/SDD todavia no tiene validator estable:

1. Registrar explicitamente su clasificacion: policy, living resource por
   perfil, recurso originado en repo, recurso repo-local o excepcion.
2. Agregar en core una spec/template con campos requeridos y metadata de
   adopcion.
3. Agregar al menos un check deterministico en core.
4. Mantener validacion repo-local mas fuerte donde el recurso se materializa.
5. Registrar el gap de validator como evidencia.
6. No tratar la adopcion como global.
7. Mantener rollout a repos hijos como request-driven hasta generalizar el
   validator.

## Decision

ARDS-4 puede continuar con validacion parcial pero deterministica. Para cierre
fuerte deberia agregarse un comando visible/dedicado o registrar ese faltante
como follow-up explicito.
