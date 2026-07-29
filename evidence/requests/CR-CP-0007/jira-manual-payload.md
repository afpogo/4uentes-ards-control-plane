# Payload Manual Jira CR-CP-0007

## Estado

- Fecha: 2026-07-10
- Escritura Jira ejecutada: si
- Modo ejecutado: Atlassian MCP
- Proyecto: `ARDS`
- Epic/parent operativo: `ARDS-1`
- Issue creado: `ARDS-14`

## Issue Propuesto

- Project key: `ARDS`
- Issue type: `Tarea`
- Summary: `[ARDS][CR-CP-0007] Promote Jira control-plane authority policy`
- Parent/Epic link: `ARDS-1`
- Labels:
  - `ards-sdd`
  - `control-plane`
  - `core`
  - `init-cp-0002`
  - `cr-cp-0007`
  - `jira-policy`
  - `external-write-gating`

## Description

```text
CR: CR-CP-0007
Initiative: INIT-CP-0002
Epic mirror: ARDS-1
Related Epic: SST-36

Purpose:

Formalize Jira control-plane authority as a first-class ARDS/SDD policy before expanding toward full Jira control.

Context:

The control-plane already has Jira/MCP endpoint rules, OAuth playbooks, write connection contracts, feature ticket policy, backlog registry policy, and status signal contracts. Those resources are currently distributed under docs/requests and must be consolidated into a registered policy under docs/policies plus specs/integration/policies.yaml.

Definition of Done:

* Create docs/policies/jira-control-plane-authority-policy.md.
* Register the policy in specs/integration/policies.yaml.
* Add the policy to docs/policies/README.md.
* Link the policy from state/policy-links.yaml.
* Preserve ARDS/SDD as source of truth and Jira as operational mirror.
* Define read-only, write-gated, delegated-writer, manual-operator, and blocked-write behavior.
* Forbid secrets, tokens, cookies, cloudId, private Jira URLs, JWTs, private page content, and auth headers in Jira/evidence.
* Keep child repo adoption request-driven; do not make this globally mandatory for functional repos.
* Run 4uentes-orchestor npm.cmd run check.
* Run 4uentes-ards-core npm.cmd run check if core repo is mutated.

Evidence:

* requests/planned/CR-CP-0007-jira-control-plane-authority-policy.yaml
* evidence/requests/CR-CP-0007/routing-decision.md
* evidence/requests/CR-CP-0007/jira-issue-ARDS-1-observation.md
* evidence/requests/CR-CP-0007/jira-manual-payload.md

Boundary:

* Jira is an operational mirror; ARDS/SDD remains the source of truth.
* This task does not authorize direct child repository mutation.
* This task does not authorize Jira writes without explicit approval and sanitized evidence.
```

## Uso

El payload fue ejecutado el 2026-07-10 y creo `ARDS-14` como tarea hija de
`ARDS-1`. La revision JQL previa no encontro otro issue con `CR-CP-0007`, un
summary Jira equivalente ni una tarea duplicada bajo `ARDS-1`.

Este payload puede ser usado por:

- un operador humano en Jira;
- un writer/gateway autorizado;
- un script MCP aprobado con `--connect --approved`, si el entorno de ejecucion
  permite escritura externa hacia Jira.
