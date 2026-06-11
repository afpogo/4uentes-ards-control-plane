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
work. The user asked to execute the CR in each repository, not to delegate to
sub-agents.

## Fallback

The main agent performed the required reviews sequentially and recorded this
fallback instead of silently skipping the policy requirement.

## Sequential Review Coverage

- Architecture review: confirmed the path `sst-fend -> 4uentes-auth ->
  sst-bend` exists for `agent-jobs`.
- Security/contract review: confirmed JWT, account context, owner role, and
  idempotency gates exist, while authenticated E2E proof is still missing.
- Cross-repo impact review: confirmed no functional repo files were modified.
- Validation review: ran checks/smokes per repo and recorded blockers.
