# ARDS/SDD Stack Audit Summary

- Run ID: `20260628-190144`
- Generated at: `2026-06-28T19:34:28.6114733-03:00`
- Scope: core standard, control plane, and known child repositories.
- Write boundary: reports are stored only in this control-plane repository under `.ards/audits/stack/`; no child repository or core files were modified.

| Profile | Target | Report |
| --- | --- | --- |
| core | 4uentes-core | [latest.md](.ards/audits/stack/20260628-190144/core/latest.md) |
| ards-sdd | sst-bend | [latest.md](.ards/audits/stack/20260628-190144/sst-bend/latest.md) |
| ards-sdd | sst-fend | [latest.md](.ards/audits/stack/20260628-190144/sst-fend/latest.md) |
| ards-sdd | 4uentes-auth | [latest.md](.ards/audits/stack/20260628-190144/4uentes-auth/latest.md) |
| ards-sdd | sst-extension | [latest.md](.ards/audits/stack/20260628-190144/sst-extension/latest.md) |
| ards-sdd | sst-chatbot | [latest.md](.ards/audits/stack/20260628-190144/sst-chatbot/latest.md) |
| ards-sdd | sst-4uentes-infra | [latest.md](.ards/audits/stack/20260628-190144/sst-4uentes-infra/latest.md) |
| control-plane | 4uentes-orchestor | [latest.md](.ards/audits/stack/20260628-190144/control-plane/latest.md) |

## Notes

- The earlier stack run `20260628-190113` is ignored because its batch summary captured runner stdout as table rows.
- This summary was regenerated from the successful run filesystem outputs to keep the audit index deterministic.
