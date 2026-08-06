# CR-CP-0003 - Revision De Audit Runtime Aplicado A Policies

## Fuentes Revisadas

Repositorio externo de referencia:

- `C:\Users\andre\Desktop\4uentes\apps\ARDS-SDD\standar\control_plane-core\v1\RFC-ARDS-Audit-Runtime-v0.1.md`
- `C:\Users\andre\Desktop\4uentes\apps\ARDS-SDD\standar\control_plane-core\v1\documento-1-arquitectura-referencia-ards-sdd-control-plane.md`

Repositorio actual:

- `AGENTS.md`
- `specs/integration/policies.yaml`
- `specs/policies/ards-sdd-policy-component-model.yaml`
- `docs/policies/human-doc-language-policy.md`
- `docs/policies/owner-documentation-authority-policy.md`
- `scripts/verify-owner-documentation.js`
- `package.json`
- `evidence/requests/CR-CP-0003/policy-enforcement-gap-analysis.md`

## Resultado Corto

La intencion del repo actual y la intencion del RFC coinciden.

El repo actual ya funciona parcialmente como Control Plane:

- mantiene catalogo, Solutions, requests, iniciativas, State y Evidence;
- tiene registry de policies en `specs/integration/policies.yaml`;
- distingue core canonico, adopcion local y rollout request-driven;
- tiene al menos una policy con enforcement real:
  `owner-documentation-authority-policy`;
- ejecuta un gate consolidado con `npm.cmd run check`.

Pero todavia no implementa el modelo completo del RFC como Audit Runtime.

El RFC describe la pieza faltante: un runtime que resuelve packs, ejecuta
probes, aplica gate policies, genera Audit Capsules y consolida hallazgos en el
Control Plane.

## Comparacion Contra El RFC

| RFC Audit Runtime | Estado en este repo | Brecha |
| --- | --- | --- |
| `Audit Runtime` unico | No existe como runtime formal | Hoy hay scripts sueltos y `npm.cmd run check` |
| `Audit Packs` | No existen como carpeta o manifest | Las policies estan en registry, pero no compiladas como packs |
| `controls.yaml` | Parcial en docs/policies y `policies.yaml` | No hay controles MUST/SHOULD/MAY ejecutables |
| `probes.yaml` | Parcial en scripts existentes | No hay catalogo de probes permitidos |
| `gate-policy.yaml` | Parcial en validators individuales | No hay policy de gate uniforme por severidad |
| `AuditBinding` local | No existe | El repo no declara que pack adopta para auditoria |
| `Audit Capsule` | No existe como estructura formal | Evidence existe, pero no normalizada por corrida de auditoria |
| Agente auditor semantico | Manual/ad hoc | No hay separacion formal auditor-constructor |
| Modo read-only | Parcial por practica | No hay runtime que lo fuerce |

## Donde Si Estamos Alineados

### Core Define, Control Plane Aplica, Services Implementan

El documento de arquitectura dice:

- Core define canon.
- Control Plane aplica y gobierna.
- Services implementan localmente.

El repo actual sigue esa direccion:

- `specs/integration/policies.yaml` consume canon core-owned.
- `4uentes-orchestor` registra adopcion local y rollout.
- Los repos hijos no deberian mutarse sin request.
- `owner-documentation-authority-policy` impide que evidencia central reemplace
  docs owner del repo hijo.

### Evidence-Based Progress

El repo ya trabaja con:

- `evidence/requests/...`;
- `state/features/*.current.yaml`;
- `requests/planned`, `requests/running`, `requests/done`;
- validaciones reproducibles.

Esto coincide con el RFC.

### Governance Before Autonomy

El repo no deberia ejecutar cambios cross-repo sin request y plan. Eso coincide
con el principio del RFC.

## Donde No Estamos Todavia Alineados

### Falta Binding De Auditoria

El RFC propone:

```text
specs/ards/audit-binding.yaml
```

Este repo no tiene ese binding. Por eso no hay una declaracion local tipo:

```yaml
audit_pack:
  id: "ARDS-CONTROL-PLANE-AUDIT"
  version: "0.1.0"
  source: "4uentes-ards-core"
triggers:
  - "manual"
  - "cr_completion"
  - "core_contract_changed"
```

Sin ese binding, el agente no tiene una fuente machine-readable que diga que
auditoria ejecutar para cada interaccion, CR o cierre.

### Falta Compilar Policies En Controles

Hoy una policy tiene texto y metadata. El Audit Runtime necesita controles.

Ejemplo:

Policy:

`human-doc-language`

Control executable:

```yaml
id: "human-doc-language.markdown-human-spanish"
severity: "MUST"
applies_to:
  - "docs/**/*.md"
  - "evidence/**/*.md"
  - "knowledge/**/*.md"
probe: "detect-human-markdown-language"
gate: "fail_on_violation_without_exception"
```

Sin ese paso, la policy queda humana/declarativa.

### Falta Separar Auditor Y Constructor

El RFC dice que el auditor informa y propone; otro flujo implementa el cambio.

Hoy el mismo agente suele:

1. leer policy;
2. editar;
3. validar;
4. corregir si falla.

Eso funciona para tareas chicas, pero no es enforcement fuerte. Para policies
criticas deberia existir al menos una corrida read-only de auditoria antes de
cierre.

### Falta Audit Capsule

Hoy guardamos evidence, pero no una capsula uniforme por auditoria.

El RFC propone:

```text
evidence/audits/<audit-run-id>/
  run-manifest.json
  deterministic-evidence.json
  audit-result.json
  audit-report.md
  proposed-state-update.yaml
  proposed-cr.yaml
```

Eso permitiria distinguir:

- evidencia de implementacion;
- evidencia de auditoria;
- propuesta de remediacion;
- decision humana.

## Puede Aplicarse A Policies?

Si. El RFC encaja especialmente bien para hacer cumplir policies.

La aplicacion natural seria crear un `Policy Enforcement Audit Pack`.

Nombre conceptual:

```text
ARDS-POLICY-ENFORCEMENT-AUDIT
```

Ese pack auditaria:

- adoption de policies;
- exceptions;
- lenguaje humano;
- owner documentation;
- architecture boundary;
- agent delegation;
- evidencia requerida por CR;
- drift entre core canon, manifest local y comportamiento observado.

## Como Se Aplicaria En Cada Interaccion

No todas las interacciones necesitan el mismo peso.

### Interaccion De Lectura O Analisis

Modo sugerido: `advisory`.

El runtime deberia:

- resolver policies aplicables;
- producir una lista de constraints;
- no bloquear salvo riesgo critico.

Ejemplo:

```text
Policies aplicables:
- human-doc-language si se va a crear evidencia humana;
- agent-context-management-policy para lectura selectiva;
- agent-architecture-boundary-policy si se propone cambiar canon.
```

### Interaccion Con Edicion De Archivos

Modo sugerido: `targeted` o `delta`.

El runtime deberia:

- mirar archivos modificados;
- seleccionar controles aplicables por path;
- ejecutar probes antes del cierre.

Ejemplo:

Si se edita `evidence/**/*.md`, ejecutar control de `human-doc-language`.

Si se edita `requests/**/*.yaml`, ejecutar controles de lifecycle y owner docs.

Si se edita `specs/integration/policies.yaml`, ejecutar controles de policy
registry.

### Interaccion Humana

El humano no necesita ser bloqueado por el runtime al escribir intencion, pero
si esa intencion se convierte en CR o cambio, el Control Plane deberia resolver:

- riesgo;
- policies aplicables;
- Evidence minima;
- aprobaciones;
- validators.

### Interaccion De Script

El script deberia emitir evidencia estructurada.

Ejemplo:

```json
{
  "actor": "script",
  "command": "npm.cmd run check:owner-docs",
  "policy_ids": ["owner-documentation-authority-policy"],
  "result": "PASS"
}
```

Sin evidencia estructurada, el Control Plane no puede diferenciar cumplimiento
real de afirmacion textual.

## Propuesta De Adaptacion Por Fases

### Fase 0 - Sin Runtime Nuevo

Objetivo: usar lo que ya existe.

Acciones:

- agregar `check:human-doc-language`;
- agregar `check:policy-registry`;
- agregar `check:policy-adoption`;
- incluirlos en `npm.cmd run check`;
- registrar gaps con evidencia.

Esto corrige el agujero mas urgente sin crear plataforma.

### Fase 1 - Binding Local

Agregar:

```text
specs/ards/audit-binding.yaml
```

Con:

- pack adoptado;
- triggers;
- modo inicial `advisory`;
- sandbox `read_only`;
- paths de Evidence.

### Fase 2 - Audit Pack Local

Crear una primera version local:

```text
specs/audits/packs/ARDS-POLICY-ENFORCEMENT-AUDIT/v0.1/
  manifest.yaml
  controls.yaml
  probes.yaml
  gate-policy.yaml
  output.schema.json
```

En una etapa posterior, promover al core.

### Fase 3 - Audit Capsule

Crear estructura:

```text
evidence/audits/<audit-run-id>/
```

Y registrar:

- manifest de corrida;
- comandos ejecutados;
- findings;
- severidad;
- proposed CR si corresponde.

### Fase 4 - Gate En Cierre De CR

Para CRs con cambios documentales o policy changes:

- `npm.cmd run audit:policy -- --mode gate --request-id <id>`;
- si falla un MUST sin excepcion, no cerrar.

## Primer Pack Recomendado

El primer pack deberia enfocarse en policies que ya duelen:

### Control: human-doc-language

Debe detectar markdown humano nuevo o modificado en ingles sin excepcion.

Paths:

- `docs/**/*.md`
- `evidence/**/*.md`
- `knowledge/**/*.md`
- `inventory/**/*.md`

Excepciones:

- `AGENTS.md`;
- `docs/ai/**`;
- payloads externos capturados;
- bloques de codigo;
- IDs, paths, comandos, JSON, YAML.

### Control: owner-documentation-authority-policy

Ya existe validator. El pack lo puede envolver como probe.

Probe:

```text
npm.cmd run check:owner-docs
```

### Control: policy-adoption-manifest

Si una policy core-owned se marca como adoptada para un repo hijo, debe existir
manifest o excepcion.

### Control: policy-enforcement-fields

Toda policy activa debe declarar:

- `policy_class`;
- `origin_repo`;
- `canonical_owner`;
- `applicability`;
- `adoption_mode`;
- `enforcement.mode`;
- `enforcement.failure_behavior`;
- `gaps`.

### Control: evidence-policy-application

Toda evidencia de CR que modifique docs, policies o core canon debe declarar
policies aplicadas o referenciar una auditoria.

## Decision Recomendada

Aplicar el RFC a policies es correcto, pero no conviene saltar directo a una
plataforma completa.

La mejor secuencia es:

1. convertir las policies criticas en controles ejecutables;
2. agregar binding local de auditoria;
3. crear un primer Audit Pack local;
4. guardar Audit Capsules;
5. despues promover el modelo al core.

## Respuesta A La Pregunta Central

El runtime descrito por `RFC-ARDS-Audit-Runtime-v0.1` puede usarse para hacer
cumplir policies en interacciones de agente, humano y script.

La clave es tratar cada policy como control auditable:

```text
Policy -> Control -> Probe -> Gate -> Evidence -> State/CR
```

Mientras una policy no tenga esa cadena, seguira dependiendo de memoria del
agente o revision humana. Con Audit Runtime, la policy deja de ser solo texto y
pasa a ser una condicion observable de cierre.
