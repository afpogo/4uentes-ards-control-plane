INIT-SST-0003 start.

`SST-29` is being moved to active work as the Jira mirror for SST Extension Construction.

Intent:
- Stabilize `sst-extension` as a first-class SST browser extension surface.
- Start with `SST-30` / `CR-SST-0098`: robust tab-by-tab visual PDF capture for session items.
- Keep future work grouped here for session capture outcomes, UI progress, CredentialedWebSource boundaries, LearningWorkspace handoff, and QA hardening.

Execution boundary:
- ARDS/SDD remains the source of truth; Jira is an operational mirror.
- This epic transition does not by itself authorize broad child-repo mutation.
- Each CR must keep owner specs/docs updated in the implementing repo or record an explicit owner-documentation exception.
- No private page content, cookies, JWTs, plaintext secrets, real PDFs from private pages, or sensitive screenshots will be stored in Jira or evidence.

Current first issue:
- `SST-30` will begin with preliminary analysis and an atomized plan using bounded subagent discovery.
- Architecture, security, auth and cross-repo contract decisions stay with the main governance flow.

Evidence:
- `evidence/requests/CR-SST-0098/preliminary-analysis.md`
- `evidence/requests/CR-SST-0098/subagent-atomized-plan.md`
