# Baseline Y Diseño Del Verifier De CR-HPT-0017

Fecha: 2026-08-23.

`finanzas-personales origin/main@9f781e7` contiene el contrato
`TrustedSstPrincipal`, el resolver owner-local de `finance_profile_id` y tests
de aislamiento, pero `trusted_sst_principal()` continúa devolviendo 503 y
readiness declara el provider no configurado. El root owner tiene un cambio
ajeno y queda preservado.

El verifier aceptará exclusivamente JWT RS256 con issuer `sst-auth`, audience
`phinance-api`, caller `sst-bend`, `token_use=service` y scope
`finance:invoke`. Sólo después leerá headers internos acotados para producir
el principal. `finance_profile_id` continúa siendo generado por Phinance.

La dependencia autorizada es `PyJWT[crypto]>=2.13,<3.0`. PyPI registra 2.13.0
como release estable compatible con Python 3.13; su `PyJWKClient` ofrece cache,
lifespan y timeout configurables. No se autoriza ninguna otra dependencia.

