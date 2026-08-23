# CR-HPT-0014 - Readback de publicación owner

Fecha: 2026-08-23.

El PR owner [mena28/finanzas-personales#2](https://github.com/mena28/finanzas-personales/pull/2)
fue fusionado a `main` en `9f781e7`. El commit publicado `ef0d82f` es alcanzable
desde esa ref remota y contiene el vínculo owner a `CR-HPT-0014` en
`backend/specs/integration/control-plane-link.yaml`.

El commit histórico `daa66e5` no se fusionó con su ancestry obsoleto: su patch
de 26 archivos se aplicó sobre `b68c960`, el `main` owner que ya contenía la
publicación de `CR-HPT-0013`. No hubo conflictos y no se incluyó la modificación
dirty preexistente del documento de brainstorming.

No se modificaron SST, Auth, infraestructura, secretos ni Jira. El transporte
positivo sigue pendiente de los lifecycles provider, verifier e integración.
