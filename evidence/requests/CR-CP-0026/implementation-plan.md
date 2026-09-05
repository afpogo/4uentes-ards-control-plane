# Plan de implementacion de la policy de conocimiento a ejecucion

## Resultado y alcance

`CR-CP-0026` define una policy durable y local del control plane para explicar
como se relacionan Learning, Playbook, Runbook y Specs/manifests. Este gate
publica el plan y el estado `running`; todavia no publica la implementacion ni
autoriza cambios en Core, repositorios hijos, Jira, infraestructura o runtime.

La reserva fue fusionada mediante el commit
`5b4fdb16c89b40e6e9a30e6cd69eac74d3f4a405`. La auditoria previa se preserva
en `promotion-readiness-audit-2026-09-05.md`.

## Procedencia y autoridad

El patron nacio en `sst-4uentes-infra` bajo `CR-HPT-0024`. Esa procedencia no
convierte a Infra en owner de la policy general. La primera definicion reusable
se incuba en `4uentes-orchestor`, cuyo control plane conserva la autoridad
sobre el lifecycle local. Una promocion futura a `4uentes-ards-core` sera otro
request y otro handoff.

Las decisiones normativas del plan son:

- la ruta Learning -> Playbook -> Runbook -> Specs/manifests es una ruta de
  lectura y refinamiento, no una escala total de autoridad cronologica;
- Specs y manifests son autoridad tecnica tipada dentro de su dominio;
- requests, aprobaciones y policies aplicables autorizan la ejecucion;
- la evidencia de runtime retroalimenta el conocimiento solamente mediante un
  lifecycle aprobado por el owner;
- la regla es durable y nueva, no un overlay contextual;
- `policy_overlay` continua como arquitectura propuesta bajo `CR-CP-0025`, sin
  kind, schema ni resolver activo que deba inventarse aqui.

## Mapa del lifecycle

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "cr-cp-0026-policy-publication-lifecycle"
  type: "lifecycle"
  question: "Que gates separan la procedencia, la policy local y una futura promocion a Core?"
  abstraction_level: "Lifecycle de definicion y publicacion de policy."
  source_refs:
    - "requests/inbox/CR-CP-0026-define-knowledge-to-execution-documentation-policy.yaml"
    - "requests/planned/CR-CP-0026-define-knowledge-to-execution-documentation-policy.yaml"
    - "requests/running/CR-CP-0026-define-knowledge-to-execution-documentation-policy.yaml"
    - "evidence/requests/CR-CP-0026/promotion-readiness-audit-2026-09-05.md"
  request_ids: ["CR-CP-0026", "CR-HPT-0024"]
  observed_at: "2026-09-05"
  authority_boundary: "Vista derivada; el lifecycle CR-CP-0026 conserva autoridad sobre la policy local y una promocion a Core requiere otro request."
  textual_fallback_required: true
```

```mermaid
flowchart LR
    A["Patron owner CR-HPT-0024"] --> B["Reserva canonica CR-CP-0026"]
    B --> C["Plan y running publicados"]
    C --> D["Port selectivo de la policy"]
    D --> E["Registry, discovery y estado"]
    E --> F["Checks y revision de autoridad"]
    F --> G["Merge y readback de implementacion"]
    G --> H["Cierre terminal separado"]
    H -. "request futuro" .-> I["Candidato core-profile-scoped"]
```

### Fallback textual

```text
El patron de CR-HPT-0024 aporta procedencia. CR-CP-0026 reserva la identidad,
publica plan y running, porta solamente sus artefactos a un arbol limpio,
integra discovery y estado, valida, publica la implementacion y finalmente
publica un cierre separado. La promocion core-profile-scoped queda fuera y
necesita un request futuro.
```

<!-- visual-map:end -->

## Allowlist de port selectivo

Despues del readback de este plan se revisaran y portaran solamente:

- `docs/policies/knowledge-to-execution-documentation-policy.md`;
- las entradas correspondientes en `docs/policies/README.md`, `AGENTS.md` y
  `specs/integration/policies.yaml`;
- las entradas correspondientes en `state/policy-links.yaml` y en el estado
  existente `state/features/ards-sdd-policy-unification.current.yaml`;
- evidencia CR-CP-0026 todavia pertinente.

La revision preimplementacion descarto el feature state SST inicialmente
previsto y su entrada en `state/00-index.yaml`: habrian confundido la
procedencia del patron en Infra con una adopcion child. Esta sustitucion
mantiene el enlace en el estado existente de unificacion de policies del
control plane.

Se descartan como fuente el `done` prematuro y cualquier delta no relacionado
del worktree raiz. El arbol dirty queda preservado; no se fusiona, rebasa,
limpia ni retira como parte de este lifecycle.

## Gates atomizados

1. Publicar y releer `planned`, `running` y este plan.
2. Actualizar el worktree por fast-forward a la ref canonica releida.
3. Portar la allowlist y revisar cada delta contra `origin/main`.
4. Ejecutar `git diff --check`, `npm.cmd run check` y revision manual de
   autoridad, autorizacion, feedback y clasificacion no-overlay.
5. Publicar la implementacion y releer su merge.
6. Preparar `done` y evidencia terminal en un PR separado, fusionarlos y hacer
   readback antes de retirar el worktree.

## Criterios de aceptacion

- Cada tipo documental responde una pregunta distinta y tiene limites claros.
- Los documentos humanos no reemplazan specs/manifests ni autorizaciones.
- La policy registra su procedencia sin trasladar ownership a Infra.
- No se declara adopcion Core ni de repos hijos.
- No se crea un overlay sin contrato tecnico vigente.
- El gate completo del control plane termina con cero fallos.

## Proximo gate

Fusionar y releer este plan. Solamente despues se habilita el port selectivo de
la implementacion local.
