# Gate de integración owner de CR-SST-0242

Estado: preparado, pendiente de ampliar autorización. Fecha: 2026-09-09.
PR revisable: https://github.com/afpogo/sst-bend/pull/35.
Head revisado: `bc40bd3001cfc14c127977aa6f32c5f3f4ed1edb`.

La implementación y sus pruebas están publicadas en la rama owner. El lote
anterior autorizó integrar con revisión/checks, pero excluyó expresamente
infra y deployment. La lectura del workflow owner comprobó que un merge a
develop dispara publicación GHCR y actualización de
`k8s-manifests/overlays/development/kustomization.yml` en
`afpogo/sst-4uentes-infra:develop`. El flag off no evita ese efecto GitOps.

## Ampliación concreta propuesta

Integrar PR #35 tras comprobar checks del head vigente y resolver cualquier
cambio de base. Permitir los efectos existentes del workflow: publicar la
imagen y actualizar automáticamente la referencia development de infra,
incluida su propagación normal por GitOps. Leer el merge owner y los resultados
del workflow/commit infra; registrar cualquier fallo sin alterar infra manualmente.
El proceso no debe ejecutar migraciones ni habilitar onboarding. Si se necesita
alguna de esas acciones o el flag ya está habilitado, detenerse para un lote
operativo separado. Conservar el progreso y las tablas existentes.

Antes del merge, verificar de nuevo Dockerfile/entrypoint y el workflow: no
deben ejecutar migraciones automáticas. La aprobación de esta ampliación no
autoriza datos reales de prueba, cambios Auth/Fend, cierre de Jira, modificación
de prioridades/responsables, escritura manual de infra ni saltarse checks.

La alternativa requiere diseñar y aprobar un cambio separado que desacople
publicación de código y promoción de imagen. No se desactiva el workflow ni
se omite CI como atajo dentro de este lote.

## Evidencia y continuidad

Revisión especializada sin bloqueantes; pruebas HTTP, Postgres descartable y
cadena completa de migraciones aprobadas. Check owner exit 0 con smoke
protegido parcial (50%, falta JWT); no acredita QA integrada. Evidencia
detallada: `owner-implementation.md`. La base descartable ya fue retirada.

CR-SST-0242 y SST-129 permanecen En curso/running hasta reconciliar publicación
canónica y lifecycle. CR-SST-0243 no comienza mutaciones mientras no se publique
el contrato canónico y se apruebe su lote propio.
