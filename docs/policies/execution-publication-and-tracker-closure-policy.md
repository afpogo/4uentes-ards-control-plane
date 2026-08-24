# Adopción de la policy de publicación y cierre

## Autoridad

La definición canónica vive en `4uentes-ards-core`:

- policy ID: `execution-publication-and-tracker-closure-policy`;
- documento owner:
  `docs/policies/execution-publication-and-tracker-closure-policy.md`;
- publicación: PR Core `#4`, merge
  `ded8c466dc3c02a02f7b24642ce99de6cebcc91c` sobre `develop`.

Este documento describe la adopción del control plane. No redefine el texto
normativo de Core.

## Implementación local

El control plane aplica la policy mediante:

- contrato local de enforcement:
  `specs/requests/execution-publication-rule.yaml`;
- validator: `scripts/verify-execution-publication-rule.js`;
- gate completo: `npm run check`;
- lifecycle opt-in mediante `execution_publication_rule`;
- evidencia y exact-batch authorization dentro de cada request aplicable.

El ID experimental `execution-publication-and-tracker-closure-rule` se conserva
como identificador de la implementación local para no reescribir lifecycles ya
publicados. Mapea a la policy canónica y no crea una policy paralela.

## Alcance

La adopción es requerida para lifecycles del control plane que gobiernan
mutaciones externas, publicación cross-repo o sincronización de trackers. Los
pasos no aplicables deben declarar su motivo.

Jira continúa como mirror operativo. La implementación local exige lote exacto
autorizado y readback, mientras Core permanece provider-agnostic.

## Rollout

La publicación en Core y esta adopción no modifican repos hijos. Cualquier
rollout posterior requiere un lifecycle aprobado y un
`policy_adoption_manifest` o `policy_exception_manifest` del owner afectado.
