# Implementación Bend y validación de CR-SST-0242

Fecha: 2026-09-09. Owner runtime: `sst-bend`; coordinación: control plane.
Running aprobado fue publicado por PR #291 antes de crear el worktree owner.
Base inicial fdc753f, reconciliada sin conflicto con develop e425355.

Superficies owner:

- `specs/api/onboarding.yaml`, `docs/api/onboarding.md` y sus índices.
- `specs/capabilities/outbound/onboarding-v1.yaml` y doc de handoff.
- `docs/tasks/CR-SST-0242-onboarding.md` y extensión de article-text-ingestion.
- `src/apps/sst/application/onboarding/onboarding.service.js`.
- `src/apps/sst/infrastructure/db/postgres/onboarding/onboarding.repository.js`.
- `src/apps/sst/presentation/routes/onboarding.routes.js` y wiring de rutas.
- Create controller/use case/DTO de artículos: metadata opcional y recibo atómico.
- `db/migrations/20260909000000-create-onboarding.js`.
- `scripts/test-onboarding.js`, `scripts/test-onboarding-postgres.js`,
  `scripts/purge-onboarding.js` y check owner.

Estado durable por usuario consolidado; recibos ligados a actor/cuenta/intento
y artículo. Transacciones y lock de actor serializan start, skip/reopen,
creación y verificación. El acceso activo se revalida bajo lock de membership.
Idempotencia 24 h, recibos pendientes 30 días y cascade de eliminación.
El flag permanece apagado por defecto; no hay migración automática ni deployment.

## Evidencia de pruebas

- DTO y HTTP: cuerpo estricto, scope ausente, guard de sesión, indisponibilidad,
  flag apagado y cache privado; PASS.
- Postgres 16 descartable: migración, create sin metadata, rollback sin recibo
  huérfano, actor distinto, otra cuenta, recurso ausente, completion concurrente,
  replay con nueva instancia, conflicto de payload, expiración exacta, purga,
  borrado de artículo/identidad, revocación de membership y serialización con
  skip; PASS.
- Cadena completa owner: fresh up, upgrade histórico, down/up, preservación
  de datos y paridad de schema; PASS.
- `npm run check` owner: exit 0. El smoke live existente reporta cobertura
  protegida parcial (50%) porque falta JWT. No se presenta ese check como QA
  integrada de los consumidores ni del runtime publicado.
- `npm run check` completo del control plane: exit 0, owner documentation
  incluido; 53 documentos, 67 mapas visuales y 0 FAIL.
- CI del head `bc40bd3`: Node 18/20 y build de imagen de PR aprobados;
  readback final 2026-09-09. La ejecución PR no publica imagen ni modifica infra.
  Runs: `34312511655` (Node) y `34312511661` (imagen).

Postgres de prueba: contenedor exclusivo etiquetado CR-SST-0242, loopback y
base descartable `onboarding_test`; no se usó base compartida ni datos reales.
Contenedor exclusivo y volumen anónimo retirados tras verificar nombre y etiqueta.
La revisión especializada confirmó ausencia de bloqueantes después de corregir
flag temprano, revisión estable en no-op y revalidación transaccional del rol
owner. Las regresiones HTTP y Postgres pasaron con esos ajustes.

## Publicación owner y gate de integración

PR owner: https://github.com/afpogo/sst-bend/pull/35, abierta y lista para revisión.
Head leído: `bc40bd3001cfc14c127977aa6f32c5f3f4ed1edb`.
No se integró a develop. El workflow owner
`.github/workflows/build-publish-development.yml` ejecuta, ante push a develop,
publicación de imagen GHCR y commit/push de la nueva referencia en
`sst-4uentes-infra:develop`. Es un efecto explícito fuera del lote aprobado,
que excluye infra y deployment. No se deshabilitó CI ni se omitieron checks.

La capability está preparada como ready-for-consumer en la PR; su adopción
desde la rama canónica requiere merge y readback. CR-SST-0242 permanece running.
Gate concreto: `integration-gate.md`. No se afirma backend desplegado ni
onboarding terminado; Auth, Fend y QA integrada conservan sus slices separados.

## Jira y continuidad

Subtask `SST-129` bajo `SST-128`, Epic `SST-127`, En curso. Preflight, tipo,
padre, estado y comentario inicial fueron leídos de vuelta. Ledger:
`jira-readback.json`. El comentario de avance identifica la PR y el gate de merge.
No se autorizó cerrar el issue ni escribir en padres.

La política owner exigió un reviewer gpt-5.5/high para riesgo alto; se desplegó
una revisión read-only de seguridad/concurrencia/retención y el agente principal
integra sus hallazgos. No se modificaron Auth, Fend, infra ni el core.
