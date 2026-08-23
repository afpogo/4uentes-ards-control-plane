# CR-SST-0214 - Readback de publicación owner

Fecha: 2026-08-23.

El PR owner [afpogo/4uentes-auth#12](https://github.com/afpogo/4uentes-auth/pull/12)
pasó el workflow `build-publish-update` y fue fusionado a `develop` en
`0be811f`. Git confirmó que `2700ba1` es alcanzable desde la ref remota.

El readback de
`specs/capabilities/outbound/phinance-service-token-grant-v1.yaml` confirma
`request_id=CR-SST-0214`, `correlation_id=CR-SST-0214`, audience
`phinance-api` y scope `finance:invoke`.

No se modificaron SST, Phinance, infraestructura, secretos ni Jira. El issue
`HPT-6` sigue siendo un mirror histórico pendiente de un lote de escritura
enumerado y separado.
