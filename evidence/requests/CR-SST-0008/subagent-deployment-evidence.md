# Subagent Deployment Evidence

## Required By Policy

- Task classification: `complex-high-risk-task`
- Policy ref: `docs/ai/model-selection-policy.md`
- Required roles:
  - `architecture-reviewer`
  - `security-contract-reviewer`
  - `cross-repo-impact-reviewer`
  - `validation-reviewer`

## Runtime Execution

The runtime exposes multi-agent tools, but the tool contract allows spawning
only when the user explicitly asks for sub-agents, delegation, or parallel agent
work. The user did not explicitly request sub-agents for this turn.

## Fallback

The main agent performed the required reviews sequentially and recorded this
fallback instead of silently skipping the policy requirement.

## Sequential Review Coverage

- Architecture review: confirmed Jira is an operational mirror and the
  control-plane remains authoritative.
- Security/contract review: confirmed the contract requires tenant, user,
  idempotency, correlation, and audit metadata.
- Cross-repo impact review: confirmed no functional repo changes were made.
- Validation review: required `npm.cmd run check` after state and evidence
  updates.
