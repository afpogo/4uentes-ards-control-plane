SST-28 closure mirror for CR-SST-0092.

The control-plane now records CR-SST-0092 and CR-SST-0097 as closed-local / validated-local.

Validation summary:

* sst-bend `npm.cmd run test:learning-workspace`: PASS, 9/9.
* sst-bend `npm.cmd run test:tag-engine`: PASS, 7/7.
* sst-bend `npm.cmd run check`: PASS with accepted protected-smoke warning because SMOKE_JWT/SMOKE_JWT_OWNER were not present.
* control-plane `npm.cmd run check:owner-docs`: PASS, 8 OK, 0 WARN, 0 FAIL.
* control-plane `npm.cmd run check`: PASS, 0 FAIL.

Owner documentation:

* Producer owner repo: sst-bend.
* Owner docs/capability refs were updated for `learning-workspace-context`.
* Control-plane owner-documentation gate validates CR-SST-0092 and CR-SST-0097.

Boundary:

* This closes the SST-28 backend/documentation slice.
* SST-6 remains active for the remaining learning-content-tags frontend/rendering and parser/import follow-up work.
