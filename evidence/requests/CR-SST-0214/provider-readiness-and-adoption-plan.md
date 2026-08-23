# CR-SST-0214 - Preparación y plan de adopción del grant Phinance

Fecha observada: 2026-08-23.

## Decisión

Se adopta el patch owner `33a5dc8` sobre `4uentes-auth/develop@89d0009` desde
un worktree limpio. El patch publica un único grant M2M
`sst-bend -> phinance-api / finance:invoke`; no concede permisos financieros
de usuario ni activa el consumidor SST.

La branch histórica se basó en `main@6b44285`, usa el ID canónico hoy ocupado
`CR-SST-0208` y nunca tuvo PR. El runtime `client_credentials` requerido sí
existe en `develop`, por lo que se portará el patch y se corregirá solamente la
trazabilidad owner a `CR-SST-0214`. Cualquier conflicto semántico detiene la
adopción.

## Contrato preservado

| Elemento | Valor |
| --- | --- |
| Endpoint | `POST /api/auth/internal/oauth/token` |
| Firma / issuer | `RS256` / `sst-auth` |
| Caller | `sst-bend` |
| Audience | `phinance-api` |
| Scope | `finance:invoke` |
| Token use | `service` |
| TTL máximo | 300 segundos |
| Refresh token | prohibido |

El secreto permanece fuera de Git. No se permiten cambios en dependencias,
infraestructura, SST, Phinance ni Jira. El issue `HPT-6` queda como mirror
observado y no se modifica sin un lote de escritura enumerado y vigente.
