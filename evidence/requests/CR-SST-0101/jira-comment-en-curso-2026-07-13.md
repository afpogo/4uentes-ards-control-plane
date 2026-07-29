Reconciliacion de inicio para `CR-SST-0101 / SST-33`.

ARDS/SDD es la fuente de verdad y Jira es el mirror operativo. El trabajo fue
ejecutado localmente antes de esta sincronizacion; esta transicion registra el
paso por `En curso` sin alterar el alcance aprobado.

Alcance ejecutado:

- adopcion owner de `CredentialedWebSource v1` en `sst-extension`;
- proyeccion semantica sobre captura `browser-session` existente;
- sin nuevos campos HTTP, endpoints, storage ni codigo runtime;
- sin plaintext o `SecretRef` de `DictionarySecret` en el cliente.

Evidencia de plan y readiness:

- `evidence/requests/CR-SST-0101/readiness-and-replan-2026-07-12.md`

