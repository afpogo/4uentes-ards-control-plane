# CR-SST-0024 - Modelo Unificado De Policies ARDS/SDD

Observado el: 2026-06-02

## Boundary

Este documento define el modelo de trabajo para el orquestador. No convierte
nuevas reglas en canon universal de `4uentes-core`.

`4uentes-orchestor` puede declarar requirements propios para repos gobernados,
pero las policies universales deben quedar como `core-required` solo despues de
adopcion en `4uentes-core` con source validation o decision interna explicita.

No se modificaron repos hijos ni `4uentes-core` en esta fase.

Nota de lifecycle: el plan original nombro `CR-SST-0023`, pero ese id ya estaba
ocupado por artifacts de investigacion local de infra/auth/scraper. Este modelo
se registro como `CR-SST-0024` para evitar duplicidad de request ids.

## Identidad Del Core

El orquestador documenta `4uentes-ards-core` como fuente de estandar, mientras
que el repo local observado para las reglas base aparece como `4uentes-core`.

Modelo para esta fase:

- `4uentes-core`: alias observado del repo local usado para validar las reglas
  base leidas en esta ejecucion.
- `4uentes-ards-core`: identidad esperada por el control-plane para la fuente
  canonica de ARDS/SDD.
- Estado: pendiente de reconciliacion por handoff hacia el repo de core.

Hasta que el core cierre esa reconciliacion, los artifacts del orquestador deben
referenciar la fuente conceptual sin promover un nombre nuevo a canon final.

## Modelo De Herencia

```text
core-required
        |
        v
orchestrator-required
        |
        v
profile-required
        |
        v
repo-local
        |
        v
exception
```

### `core-required`

Policies universales para cualquier repo ARDS/SDD. La fuente canonica futura es
`4uentes-core` / `4uentes-ards-core`.

Regla de validacion: una policy `core-required` no es canonica final hasta que
el core declare fuente, alcance, fecha de validacion, estado y owner segun
`4uentes-core/governance/source-validation.md`.

### `orchestrator-required`

Policies obligatorias para repos gobernados por `4uentes-orchestor`.

Ejemplos: `orchestrator-link`, `capability-state-linkage` y boundary de no
modificar repos hijos sin request/plan aprobado.

### `profile-required`

Policies derivadas del kind o perfil ARDS del repo: frontend, backend, BFF,
infra, extension, shared auth o agent runtime.

La fuente esperada de perfiles estables es el core. El orquestador solo puede
registrar adopcion o gaps observados.

### `repo-local`

Policies propias de un repo hijo. Son validas si no contradicen policies
heredadas. Deben vivir en artifacts locales del repo hijo y ser enlazables desde
el orquestador cuando gobiernen trabajo cross-repo.

### `exception`

Excepcion documentada contra una policy heredada.

Debe declarar:

- owner;
- motivo;
- policy afectada;
- alcance;
- expiracion o `TODO`;
- evidencia o decision;
- plan de cierre si aplica.

## Contrato De Adopcion

Cada repo gobernado debe poder declarar adopcion de policies sin ambiguedad:

```yaml
policy_adoption:
  - policy_id: "repo-minimum-contract"
    policy_class: "core-required"
    source_repo: "4uentes-core"
    source_path: "governance/repo-minimum-contract.md"
    source_version: "TODO"
    adoption_status: "adopted"
    local_implementation_path: "AGENTS.md"
    validation_ref: "TODO"
    exception:
      status: "not-applicable"
      owner: "TODO"
      reason: "TODO"
      expires_at: "TODO"
```

Campos obligatorios:

- `policy_id`: id estable en ingles.
- `policy_class`: `core-required`, `orchestrator-required`,
  `profile-required`, `repo-local` o `exception`.
- `source_repo`: repo que publica la policy.
- `source_path`: path relativo al repo fuente.
- `source_version`: tag, commit, version de documento o `TODO`.
- `adoption_status`: `adopted`, `partial`, `gap`, `exception`,
  `not-applicable` o `TODO`.
- `local_implementation_path`: path relativo al repo adoptante o `TODO`.
- `validation_ref`: comando, evidence o `TODO`.
- `exception`: bloque requerido solo cuando hay gap o excepcion.

## Policies Iniciales

| Policy id | Clase propuesta | Fuente actual | Estado de canon | Regla |
|---|---|---|---|---|
| `repo-minimum-contract` | `core-required` | `4uentes-core/governance/repo-minimum-contract.md` | core base observado | Repos ARDS/SDD deben exponer `AGENTS.md`, `specs/00-index.yaml`, `docs/00-overview.md` y validacion/check o `TODO`. |
| `ai-guardrails` | `core-required` | `4uentes-core/governance/ai-guardrails.md` | core base observado | No secretos, leer docs/specs antes de modificar, validacion reproducible o limitacion explicita, revision humana para alto impacto. |
| `source-validation` | `core-required` | `4uentes-core/governance/source-validation.md` | core base observado | Contenido canonico requiere fuente validada, decision interna explicita o `TODO`; propuestas pueden quedar `needs-review`. |
| `model-selection` | `orchestrator-required` | `docs/ai/model-selection-policy.md` | canon local del orquestador | Requests planificados deben registrar `task_weight`, `model_selection` y `subagent_deployment_plan`. |
| `orchestrator-link` | `orchestrator-required` | `docs/cross-repo/child-repo-orchestrator-link-rule.md` | canon local del orquestador | Trabajo nacido fuera del orquestador debe dejar metadata `orchestrator_link`. |
| `capability-state-linkage` | `orchestrator-required` | `docs/requests/capability-state-linkage.md` | canon local del orquestador | Capabilities gobernadas deben ser enlazables con `feature_state` o `bugfix_state`. |
| `human-doc-language` | `orchestrator-required` | `docs/idioma-markdown.md` | canon local del orquestador | El orquestador define la regla canonica local; el repo hijo genera evidencia humana en espanol y conserva IDs, YAML tecnico, paths y contratos estables en ingles cuando aplique. |
| `child-repo-boundary` | `orchestrator-required` | `AGENTS.md` | canon local del orquestador | Repos hijos no deben modificarse sin request/plan aprobado; desviaciones deben registrarse retroactivamente. |

## Gaps Observados Por Repo Catalogado

| Repo | Estado observado | Gaps para este modelo |
|---|---|---|
| `4uentes-auth` | ARDS listo, `docs_ai_policy: true`, `orchestrator_link` adoptado, check `npm run check`. | Falta manifest explicito de `policy_adoption` con source version. |
| `sst-fend` | ARDS listo, `docs_ai_policy: true`, `orchestrator_link` adoptado, check `npm run check`. | Falta manifest explicito de `policy_adoption` con source version. |
| `sst-bend` | ARDS listo, `docs_ai_policy: true`, `orchestrator_link` adoptado, check `npm run check`. | Falta manifest explicito de `policy_adoption` con source version. |
| `sst-extension` | ARDS listo, `docs_ai_policy: true`, `orchestrator_link` adoptado, check `pnpm run check`. | Falta manifest explicito de `policy_adoption` con source version. |
| `sst-chatbot` | ARDS listo, check local declarado, `orchestrator_link` pendiente de adopcion. | `docs_ai_policy: false`; falta manifest de `policy_adoption`; falta cerrar adopcion de `orchestrator_link`. |
| `sst-4uentes-infra` | ARDS listo, `docs_ai_policy: true`, `orchestrator_link` adoptado. | `validation.check_command: TODO`; falta manifest explicito de `policy_adoption` con source version. |

Estos gaps son observaciones de planificacion. No autorizan modificar repos
hijos en esta fase.

## Estrategia De Adopcion Gradual

1. Handoff a core: registrar el modelo de taxonomia y contrato de adopcion en
   `4uentes-core`, junto con source validation para las policies universales.
2. Reconciliar identidad: decidir si el nombre canonico del repo fuente sera
   `4uentes-core`, `4uentes-ards-core` u otro alias estable.
3. Orquestador: agregar templates o checks solo despues de que el core adopte
   el contrato universal o de que el orquestador apruebe una policy local.
4. Repos hijos: crear requests especificos por adopcion, empezando por gaps
   visibles (`sst-chatbot` e `sst-4uentes-infra`) y luego manifests de adopcion
   para los demas.
5. Validacion: cada adopcion debe quedar vinculada a request, evidence,
   validation result y, si aplica, `orchestrator_link`.
6. Idioma humano: tratar `human-doc-language` como policy canonica definida por
   el orquestador; cada repo hijo debe generar su documentacion humana segun esa
   regla mientras conserva la capa tecnica estable en ingles.

## Handoff Recomendado A `4uentes-core`

Crear un request en el repo de core para:

- definir el tipo `policy_adoption`;
- declarar el enum de clases de policy;
- canonizar `repo-minimum-contract`, `ai-guardrails` y `source-validation`;
- incorporar `human-doc-language` como policy originada en el orquestador y
  subida al core para reutilizacion cross-repo;
- decidir el formato de `source_version`;
- resolver identidad `4uentes-core` vs `4uentes-ards-core`;
- publicar templates para exceptions y manifests de adopcion;
- mantener `orchestrator-required` como extension del control-plane, no como
  canon universal.

Nota: `human-doc-language` es la excepcion de este handoff porque su fuente
canonica local ya existe en `docs/idioma-markdown.md`; el core debe adoptarla o
referenciarla como policy reusable sin borrar su origen operacional en el
orquestador.

## Revision De No Contradiccion

El modelo respeta:

- `AGENTS.md`: no redefine core, no modifica repos hijos, usa request lifecycle
  antes de cambios cross-repo.
- `docs/ai/model-selection-policy.md`: registra classification, model selection
  y subagent deployment plan.
- `docs/cross-repo/child-repo-orchestrator-link-rule.md`: mantiene
  `orchestrator_link` como metadata obligatoria para trabajo iniciado en repos
  hijos.
- `docs/requests/capability-state-linkage.md`: conserva el enlace capability a
  feature/bugfix state.
- `4uentes-core/governance/repo-minimum-contract.md`: no cambia el contrato
  minimo; lo modela como `core-required`.
- `4uentes-core/governance/ai-guardrails.md`: preserva no secretos,
  validacion, fuente y revision humana.
- `4uentes-core/standard/ARDS_CORE_STANDARD_BASE_v1.md`: mantiene el core como
  fuente de estandar y el orquestador como consumidor.
