"""Read-only Git inventory; write metadata only under inventory/ (no file contents)."""
import argparse
import datetime
import json
import pathlib
import re
import subprocess


def git(root, *args):
    result = subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True, encoding="utf-8", errors="replace")
    return result.stdout.strip() if result.returncode == 0 else None


parser = argparse.ArgumentParser()
parser.add_argument("--bindings", required=True)
args = parser.parse_args()
cp = pathlib.Path(__file__).resolve().parents[1]
bindings = pathlib.Path(args.bindings).read_text(encoding="utf-8-sig")
repos = [("4uentes-ards-control-plane", str(pathlib.Path(args.bindings).resolve().parents[2]))]
repos += [(m[0], json.loads('"' + m[1] + '"')) for m in re.findall(r'- id: "([^"]+)"\s+env: "[^"]+"\s+path: "([^"]+)"', bindings)]
output = {"request_id": "CR-CP-0024", "observed_at": datetime.datetime.now(datetime.timezone.utc).isoformat(), "method": "Metadata only; no credentials, documents or generated contents read. Registered trees plus immediate .worktrees/worktrees directories of each bound repository.", "repositories": []}
for identity, root in repos:
    record = {"repository": identity, "root": root, "worktrees": [], "unregistered_directories": []}
    canonical = "origin/main" if identity in ("4uentes-ards-control-plane", "finanzas-personales-backend", "4uentes-automation") else "origin/develop"
    record["canonical_ref"] = canonical
    record["canonical_sha"] = git(root, "rev-parse", "--verify", canonical)
    raw = git(root, "worktree", "list", "--porcelain")
    for block in (raw or "").split("\n\n"):
        values = dict(line.split(" ", 1) if " " in line else (line, True) for line in block.splitlines())
        if "worktree" not in values:
            continue
        path = values["worktree"]
        status = git(path, "status", "--porcelain=v1", "--untracked-files=normal")
        scoped = identity in ("4uentes-auth", "sst-bend", "sst-4uentes-infra", "4uentes-ards-control-plane", "4uentes-automation") and bool(re.search(r'cr-(hpt-00(16|17|19|20|21|22|23|24|25|26)|cp-00(21|24))', path, re.I))
        tree = {"path": path, "branch": values.get("branch", "detached"), "head": values.get("HEAD"), "status_entries": status.splitlines() if status else [], "status_readable": status is not None, "scope": "custody-or-precursor" if scoped else "global-inventory-only", "historical_labels": sorted(set(re.findall(r'CR-(?:CP|HPT)-\d{4}', path.upper()))), "canonical_request": "CR-HPT-0024" if scoped and identity == "sst-4uentes-infra" else "CR-CP-0024" if scoped else None, "preservation_ref": values.get("branch", values.get("HEAD")), "disposition": "preserve-dirty" if status else "preserve-pending-content-and-process-review", "removal_authorized": False}
        if scoped:
            tree["base"] = git(path, "merge-base", "HEAD", canonical)
            tree["ahead_behind"] = git(path, "rev-list", "--left-right", "--count", canonical + "...HEAD")
            tree["changed_paths_against_canonical"] = (git(path, "diff", "--name-only", canonical, "HEAD") or "").splitlines()
        record["worktrees"].append(tree)
    registered = {str(pathlib.Path(t["path"]).resolve()).lower() for t in record["worktrees"]}
    for folder in (".worktrees", "worktrees"):
        parent = pathlib.Path(root) / folder
        if parent.is_dir():
            for child in parent.iterdir():
                if child.is_dir() and str(child.resolve()).lower() not in registered:
                    record["unregistered_directories"].append(str(child))
    output["repositories"].append(record)
destination = cp / "inventory/custody-worktree-recovery-2026-09-08.json"
destination.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
print(json.dumps({"repositories": len(output["repositories"]), "worktrees": sum(len(r["worktrees"]) for r in output["repositories"]), "output": str(destination)}))
