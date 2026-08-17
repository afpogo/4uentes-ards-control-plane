# Policy de documentación visual como código

## Propósito

Mejorar la legibilidad humana de ARDS/SDD mediante mapas versionables y
trazables, sin convertir el diagrama en una fuente de verdad paralela.

## Estado y autoridad

- Estado local: adoptada por el control-plane bajo `CR-CP-0018` y
  `CR-CP-0019`.
- Promoción canónica: completada mediante el PR
  <https://github.com/afpogo/4uentes-ards-core/pull/3> y verificada en
  `origin/develop@b00c4eb4d5cd73d3964d9378ae1ae2900b53b2a0`.
- Owner canónico: `4uentes-ards-core`.
- Rollout a repos hijos: coordinado por `CR-CP-0006` y ejecutado mediante un CR
  independiente por owner.

El perfil local es la implementación de enforcement del control-plane. Ningún
child repo se considera adoptante del canon hasta publicar su propio manifest
de adopción o excepción dentro de un lifecycle aprobado.

## Regla obligatoria

Esta policy no obliga a insertar un diagrama en cada documento.

Cuando una documentación humana ARDS/SDD crea o modifica de forma material un
mapa normativo de dependencias, lifecycle, secuencia o relaciones lógicas de
datos, debe cumplir el perfil
`specs/integration/visual-documentation-as-code-profile.yaml` o registrar una
excepción explícita del owner.

Todo mapa aplicable debe:

- declarar la pregunta que responde y un único nivel de abstracción;
- referenciar las specs, requests, states o evidencia que sostienen sus claims;
- declarar fecha observada y límite de autoridad;
- conservar etiquetas y dirección comprensibles sin depender del color;
- incluir un fallback textual adyacente con la misma semántica;
- omitir secretos, credenciales, datos privados y topología innecesaria;
- actualizarse cuando cambia una relación representada.

## Alcance

La clasificación propuesta para Core es `core-profile-scoped`:

- requerida para mapas normativos del perfil `control-plane`;
- adoptable de forma request-driven por backend, BFF, frontend web, extensión,
  infraestructura y otros child repos;
- no aplicable a imágenes ilustrativas, screenshots o gráficos generados cuyo
  dataset machine-readable ya es la autoridad vinculada.

## Adopción y excepción

Core publica la policy; eso no prueba adopción local. Cada owner hijo debe
publicar uno de estos artefactos dentro de un lifecycle aprobado:

- `policy_adoption_manifest`: adopta la policy y vincula implementación,
  validación y evidencia locales;
- `policy_exception_manifest`: declara motivo, owner, vencimiento y plan de
  cierre de una desviación acotada.

Los diagramas existentes no se migran en masa. La adopción es prospectiva y
puede sumar un mapa piloto elegido por el owner para demostrar el flujo.

## Validación local

El control-plane valida la estructura con:

```powershell
npm.cmd run check
```

El contrato detallado, templates y render gate están documentados en:

- `specs/integration/visual-documentation-as-code-profile.yaml`;
- `templates/visual-documentation/`;
- `scripts/verify-visual-documentation.js`;
- `docs/cross-repo/visual-documentation-as-code-profile.md`.

## Límites

- El mapa es una vista derivada; si contradice una source ref, gana la source
  ref.
- El control-plane no reemplaza documentación owner de un repo hijo.
- Jira continúa como mirror operativo y no como autoridad documental.
- Una adopción no autoriza cambios funcionales o runtime.
