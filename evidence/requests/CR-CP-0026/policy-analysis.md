# Análisis de la policy de conocimiento a ejecución

Fecha: 2026-09-05

## Conclusión

La fórmula `Aprendizaje -> Playbook -> Runbook -> Specs/manifests` es válida
como recorrido cognitivo, pero incompleta como regla de gobierno. La policy
local agrega relaciones tipadas de restricción, autorización externa y
feedback gobernado.

Es una policy durable nueva: `origin-repo-policy` en el control plane y
candidata futura a `core-profile-scoped`. No es un overlay, porque define el
invariante base y el canon vigente no publica kind, schema ni resolver de
`policy_overlay`.

## Evidencia observada

- El patrón owner de `CR-HPT-0024` separó fundamentos, decisiones, ejecución y
  autoridad técnica en `sst-4uentes-infra`.
- El commit owner `67c4874b2404235d70dc56ce143343954f5c707e` fue integrado
  mediante `4ab3e7e9f0869c7c035d75a85149977994aa0af9`.
- La aclaración `83bac64d5a7323276af4b691b666890c9cda81fe` está preservada
  aparte y no se adopta sin su propio gate.
- `requests/running/CR-HPT-0024-deploy-private-receipt-object-platform.yaml`
  demuestra que documentación y manifests validados no equivalen a
  autorización de deployment, Secrets, licencia o runtime.
- `owner-documentation-authority-policy` conserva autoridad en el owner y evita
  que evidencia central reemplace contratos o docs owner.
- `CR-CP-0025` publicó arquitectura de overlays, no un contrato ejecutable.

## Decisiones

1. Registrar `4uentes-orchestor` como origin repo de la policy y conservar
   `sst-4uentes-infra` / `CR-HPT-0024` como procedencia del patrón.
2. Tratar como autoridad técnica sólo specs/manifests owner, activos,
   aplicables, canónicos y versionados; el tipo de archivo no basta.
3. Separar `informs`, `recommends/selects`, `authorizes`, `operationalizes`,
   `constrains` y `validates/feeds_back`.
4. Aplicar la policy prospectivamente a artefactos nuevos o materialmente
   modificados; legacy se gestiona como gap, backlog o excepción.
5. Permitir snippets de Learning claramente ilustrativos; impedir que sean la
   única guía operacional reutilizable.
6. Exigir rollback/compensación en runbooks o una razón explícita de no
   aplicabilidad.
7. Mantener enforcement inicial por revisión operacional; un futuro validator
   debe consumir declaraciones estructuradas y no clasificar Markdown libre.

## Revisiones delegadas

Se realizaron auditorías read-only paralelas sobre:

- canon Core, refs remotas e identidad candidata;
- lifecycle de promoción, publicación y policy viva de worktrees;
- duplicados y solapamiento semántico con policies existentes;
- forma mínima de reserva y plan/running;
- port selectivo del borrador dirty;
- semántica, authority boundaries y clasificación no-overlay.

El agente principal verificó las fuentes, resolvió las diferencias y conserva
la autoridad de integración. El runtime no expuso un control de temperatura;
por eso el valor `0.5` solicitado no se declara como aplicado.

## Gaps separados

- La promoción a Core requiere otro request y un workflow situado en el repo
  owner correspondiente.
- La adopción por repos hijos requiere manifests y lifecycle por owner.
- El schema/resolver de overlays continúa bajo trabajo futuro de `CR-CP-0025`.
- Un manifest declarativo de cadena y su validator estructural requieren otro
  incremento.
