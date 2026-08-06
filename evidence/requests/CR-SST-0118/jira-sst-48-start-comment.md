CR-SST-0118 start checkpoint.

SST-48 can move to `En curso`.

Scope:
- Validate the annotable text-entry value proposition end-to-end.
- Cover editor/text entry, local annotation, preview, accept, persistence, render/template, and read/query evidence.
- Treat this as validation-first with no planned child repo mutation.

Policies:
- Owner documentation authority policy reviewed.
- Because `child_repo_mutation_allowed=false`, owner docs are not required unless validation reveals implementation changes.
- Control-plane `npm.cmd run check` remains mandatory before local closure.

Evidence:
- `evidence/requests/CR-SST-0118/intent-summary.md`
- `evidence/requests/CR-SST-0118/policy-and-owner-enforcement-start.md`

Boundary:
- Defects found during validation should become a follow-up implementation CR unless they are trivial test/evidence corrections within the validation boundary.
