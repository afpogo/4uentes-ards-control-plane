# CR-CP-0003 - Explicacion De Recursos Vivos Y Validacion

## Resumen Corto

`feature-bugfix-state-model` no es una policy. Es un molde vivo para representar
estado documental: features, bugfixes, statuses, evidencia y links.

Una policy dice una regla.

Un living resource define una estructura reusable que un repo puede materializar
y mantener viva.

Ejemplo textual:

- Policy: "Si un repo tiene ownership HTTP, debe mantener harnesses `.http`."
- Living resource: "Un `feature_state` debe tener `kind`, `id`, `status`,
  `updated_at`, `affected_services`, referencias y evidencia."

La primera gobierna comportamiento. La segunda define una forma de datos y
documentacion viva.

## Analogias

### Policy Como Reglamento

Una policy se parece a una regla interna de una empresa.

Ejemplo:

"Toda factura mayor a cierto monto necesita aprobacion."

No describe el formulario completo de factura. Dice que regla debe cumplirse.

En ARDS/SDD:

`human-doc-language` dice que los markdown humanos van en espanol y que los IDs
tecnicos no se traducen.

### Living Resource Como Formulario Vivo

Un living resource se parece a un formulario oficial que se completa muchas
veces y se mantiene actualizado.

Ejemplo:

"Ficha de estado de proyecto" con campos:

- nombre;
- responsable;
- status;
- evidencia;
- fecha de actualizacion.

El formulario no es una regla por si mismo. Es una estructura comun para mirar
el estado real.

En ARDS/SDD:

`feature_state` y `bugfix_state` son fichas vivas. Cada archivo representa el
estado actual de una feature o bugfix.

### Template Como Formulario En Blanco

Un template es el formulario vacio.

Ejemplo:

`templates/specs/states/feature-state.template.yaml` dice que campos deberia
tener un `feature_state` nuevo.

No prueba que una feature real este bien documentada. Solo da la forma correcta
para crearla.

### Adopcion Como Acta De Uso

Una adopcion dice:

"Este repo usa este recurso vivo del core, con estos paths locales y esta forma
de validarlo."

Ejemplo:

`specs/states/state-read-model-adoption.yaml` dice que el control-plane adopta
`feature-bugfix-state-model` y lo materializa en:

- `state/00-index.yaml`;
- `state/state-machine.yaml`;
- `state/features/*.current.yaml`;
- `state/bugfixes/*.current.yaml`;
- `state/capability-links.yaml`.

## Por Que La Validacion No Era Madura Completa

Antes, `npm.cmd run check` del core probaba cosas importantes pero generales:

- archivos requeridos;
- links internos;
- sintaxis YAML;
- checks de tono y scope.

Eso sirve para saber que el repo no esta roto estructuralmente.

Pero no alcanzaba para demostrar que `feature-bugfix-state-model` estuviera
bien como living resource.

Ejemplo analogo:

Validar YAML es como revisar que un formulario este escrito en papel legible.
Validar semantica es revisar que tenga firma, fecha, responsable, monto y campos
obligatorios.

El primer check dice "se puede leer". El segundo dice "sirve para el proceso".

## Que Significa Exponer Un Check Visible

Un check visible es un comando o seccion del reporte que cualquier agente o
humano puede identificar sin leer el codigo del validator.

Hoy el core ejecuta `checkLivingResources` dentro de `npm.cmd run check`, pero
la salida de consola no muestra una seccion separada por limitaciones menores
del bloque de impresion actual.

Un estado mas claro seria:

```powershell
npm.cmd run check:living-resources
```

Y una salida asi:

```text
Living Resources
OK: feature-bugfix-state-model exists
OK: resource_class is core-profile-scoped-living-resource
OK: template bindings exist
OK: adoption template matches resource_id
Summary: 4 OK, 0 WARN, 0 FAIL
```

Eso seria mejor porque:

- permite diagnostico focalizado;
- permite evidencia mas clara;
- evita tener que leer `validate.ts` para saber si esa validacion corrio;
- hace mas facil extender el modelo a otros recursos vivos.

## Que Seria Un Validator Generico

El check actual conoce este recurso concreto:

`feature-bugfix-state-model`.

Un validator generico leeria un registry de recursos vivos y validaria todos
con la misma logica base.

Ejemplo conceptual:

```yaml
living_resources:
  - id: "feature-bugfix-state-model"
    file: "specs/states/feature-bugfix-state-model.yaml"
    required_templates:
      - "templates/specs/states/feature-state.template.yaml"
      - "templates/specs/states/bugfix-state.template.yaml"
  - id: "initiative-model"
    file: "specs/initiatives/initiative-model.yaml"
    required_templates:
      - "templates/specs/initiatives/initiative.template.yaml"
```

El validator ya no tendria que saber de antemano cada familia. Lee el registry
y aplica reglas comunes:

- existe el archivo;
- tiene `resource_class`;
- tiene `origin_repo`;
- tiene `canonical_owner`;
- tiene `adoption_mode`;
- sus templates existen;
- su manifest de adopcion corresponde al recurso.

## Futuras Familias De Recursos Vivos

Una familia de recurso vivo es un conjunto de specs/templates que modela una
clase de informacion reusable.

Ejemplos posibles en este CR/initiative:

### Initiative Model

Familia: iniciativas.

Sirve para modelar `initiative`, objetivos, CRs asociados, Jira mirror,
boundaries, evidencia y open gaps.

Analogia: carpeta de programa o roadmap, no regla de comportamiento.

Posible canon:

- `specs/initiatives/initiative-model.yaml`
- `templates/specs/initiatives/initiative.template.yaml`

### Capability State Linkage

Familia: links entre capabilities y estados.

Sirve para conectar una capability con `feature_state` o `bugfix_state`.

Analogia: mapa de trazabilidad entre contrato y trabajo activo.

Posible canon:

- `specs/states/capability-state-linkage.yaml`
- `templates/specs/states/capability-link.template.yaml`

### Control Plane Link

Familia: reconciliacion child repo <-> control-plane.

Este caso cruza con policy porque tiene regla de adopcion y un bloque reusable.
La policy dice cuando aplica. El template dice como se materializa.

Analogia: una regla de "todo repo hijo adoptado debe declarar enlace" mas un
formulario concreto para completar ese enlace.

### Policy Adoption Manifests

Familia: manifests de adopcion/excepcion de policies.

No son la policy en si. Son recursos vivos que registran como un repo adopta o
exceptua una policy.

Analogia: la norma es la policy; el acta firmada de adopcion es el manifest.

## Criterio Practico

Para decidir si algo es policy o living resource:

- Si responde "que regla debe cumplirse", probablemente es policy.
- Si responde "que estructura viva debe existir y mantenerse", probablemente es
  living resource.
- Si responde "como un repo declara que adopta o exceptua algo", probablemente
  es manifest de adopcion.
- Si aplica solo por perfil o request, no debe imponerse globalmente.

## Estado De ARDS-4

La implementacion actual es correcta para continuar:

- el canon vive en core;
- el control-plane registra adopcion local;
- no se mutaron repos hijos;
- la validacion ya tiene una parte semantica deterministica;
- queda documentado que el siguiente paso de madurez es exponer un check
  dedicado y generalizar el validator.
