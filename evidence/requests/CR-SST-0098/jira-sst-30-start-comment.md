CR-SST-0098 / SST-30 start.

This issue is moving into active analysis/planning for the first implementation slice under `INIT-SST-0003`.

Preliminary finding:
- Current session capture already iterates tabs and attempts visual PDF with text fallback.
- The risky gap is robustness: original tab focus is not explicitly restored after a multi-tab capture, readiness uses a fixed short paint wait, scroll restoration is not guaranteed, and some partial/degraded outcomes are not yet explicit enough.

Planned approach:
- Update `sst-extension` owner specs/docs first, especially session capture behavior and QA evidence.
- Implement original active-tab restoration for capture batches.
- Add governed per-tab wait strategy: activation, ready/settle check and timeout.
- Preserve initial scroll best-effort where browser APIs allow it.
- Keep partial failure handling explicit without storing private page content in Jira/evidence.
- Add focused tests for focus restoration, timeout/ready behavior and degraded capture paths.
- Validate with `pnpm test`, `pnpm build`, `pnpm check`, and control-plane `npm.cmd run check`.

Subagent policy:
- Bounded subagents were used only for read-only discovery of code paths and owner docs.
- Architecture, auth, security and cross-repo contract decisions remain with the main governance flow.

Evidence:
- `evidence/requests/CR-SST-0098/preliminary-analysis.md`
- `evidence/requests/CR-SST-0098/subagent-atomized-plan.md`
