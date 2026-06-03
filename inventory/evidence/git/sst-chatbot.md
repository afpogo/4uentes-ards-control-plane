# sst-chatbot Git Evidence

Observed at: 2026-05-31

## Local Binding

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\chatboot-integration\sst_chatbot
```

## Git

- Remote: `git@github.com:afpogo/sst-chatbot.git`
- Branch: `main`
- HEAD: `90a6272`
- Working tree: dirty

Observed dirty entries:

```text
 M docs/00-overview.md
 M docs/architecture/agent-core-and-orchestrator-boundary.md
 M docs/architecture/user-activity-ards-memory.md
 M docs/playbooks/05-author-and-validate-prompts.md
 M specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml
 M specs/capabilities/prompt-catalog-and-versioning.yaml
 M specs/capabilities/user-activity-ards-memory.yaml
 M src/app/memory/__init__.py
?? src/app/memory/handoff.py
?? src/app/memory/phases.py
?? src/app/memory/providers.py
?? src/app/memory/store.py
?? src/app/memory/types.py
?? src/app/memory/validation.py
?? src/app/memory/visibility.py
?? src/app/orchestrator/
?? tests/test_ards_memory_runtime.py
?? tests/test_fake_orchestrator_handoff.py
```

## ARDS/SDD Artifacts

- `AGENTS.md`
- `README.md`
- `docs/00-overview.md`
- `specs/00-index.yaml`
- `specs/capabilities/*.yaml`
- `specs/integrations/*.yaml`
- `scripts/ards_check.py`
- `scripts/check.py`

## Validation

Command:

```powershell
.\.venv\Scripts\python.exe scripts\check.py
```

Result observed on 2026-05-31:

- ARDS/SDD check passed.
- Pytest collected 59 tests.
- 59 tests passed.
