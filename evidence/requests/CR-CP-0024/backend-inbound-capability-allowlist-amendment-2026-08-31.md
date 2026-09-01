# Enmienda de allowlist para capability inbound de Backend

## Hallazgo

La recomposición owner confirmó que el verificador de receipt intake consume
el grant publicado por Auth
`automation-receipt-intake-service-token-grant-v1`. La allowlist original
incluía el contrato API y la capability outbound de aceptación, pero no la
adopción inbound del grant productor.

## Expansión exacta

Se autorizan únicamente estos dos paths nuevos:

- `specs/capabilities/inbound/4uentes-auth--automation-receipt-intake-service-token-grant-v1.yaml`;
- `docs/capabilities/inbound/4uentes-auth--automation-receipt-intake-service-token-grant-v1.md`.

El índice existente `specs/capabilities/inbound/00-index.yaml`,
`docs/capabilities/00-overview.md` y `scripts/ards-check.js` ya pertenecen a la
allowlist original y deben enlazar la adopción.

## Autoridad y límites

La spec outbound de Auth en `origin/develop` conserva autoridad sobre el grant:
audience `sst-api`, scope exacto `finance:receipt-intake:create`, principal
`4uentes-automation-receipt-intake`, RS256 y TTL máximo de 300 segundos. SST
registra únicamente su adopción y verificación local; no redefine emisión ni
provisiona credenciales.

Esta enmienda no habilita el merge del PR owner, publicación de imagen, cambio
de Infra, despliegue, promoción a `master` ni escritura Jira.
