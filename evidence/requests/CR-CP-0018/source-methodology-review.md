# Revisión De La Metodología De Documentación Visual

## Fuentes Revisadas

Se revisó el corpus provisto por el usuario:

- “Documentación técnica, Docs as Code e inteligencia artificial”.
- “IA para documentación técnica y diagramas como código”.
- “Agentes de IA y control de calidad en documentación técnica”.

El corpus es una referencia metodológica, no una fuente de verdad sobre la
arquitectura SST ni sobre el lifecycle ARDS/SDD.

## Principios Adoptados

- La documentación visual se versiona junto con la documentación owner.
- Mermaid es el formato local para diagramas como código.
- Cada mapa responde una pregunta explícita y mantiene un único nivel de
  abstracción.
- La salida generada o asistida por IA se verifica contra fuentes reales.
- El color aporta semántica secundaria; labels y fallback conservan el sentido.
- La documentación debe ser autocontenida y próxima a sus fuentes para RAG.
- Los cambios de arquitectura, seguridad, ownership y contratos requieren
  revisión humana.
- La automatización debe aplicar mínimo privilegio, sanitización y evidencia
  auditable.

## Adaptaciones ARDS/SDD

La metodología general se acotó al modelo de autoridad existente:

- los artefactos ARDS/SDD referenciados siguen siendo fuente de verdad;
- Mermaid es una vista derivada;
- Jira sigue siendo mirror operativo;
- un mapa no crea dependencias, estados ni ownership;
- la promoción a `4uentes-ards-core` y el rollout a repos hijos quedan fuera de
  `CR-CP-0018`;
- el enforcement ejecutable queda atomizado en `CR-CP-0019`.

## Decisión

Adoptar localmente un perfil con metadata YAML por mapa, Mermaid y fallback
textual adyacente. Esta estructura permite revisión humana ahora y parsing
determinista en el siguiente gate.
