from typing import List

from .config import Target
from .git_range import ensure_tags_exist, list_commits, diff_name_status, show_commit, write_file
from .inventory import Inventory, bucketize
from .render import render_md, render_json, render_manifest_md


def run_local(target: Target) -> Inventory:
    assert target.repo_path
    ensure_tags_exist(target.repo_path, target.tag)
    ensure_tags_exist(target.repo_path, target.prev_tag)

    shas = list_commits(target.repo_path, target.prev_tag, target.tag)
    commits = [show_commit(target.repo_path, s) for s in shas[:200]]  # cap for sanity
    changed = diff_name_status(target.repo_path, target.prev_tag, target.tag)
    buckets = bucketize(changed)

    verification = {
        "Git diff parsed": "PASS" if changed is not None else "FAIL",
        "Odoo changes detected": "YES" if buckets["Odoo changes (addons/)"] else "NO",
        "Supabase changes detected": "YES" if buckets["Supabase changes (supabase/)"] else "NO",
    }

    notes: List[str] = []
    inv = Inventory(
        tag=target.tag,
        prev_tag=target.prev_tag,
        commit_count=len(shas),
        commits=commits,
        changed_files=changed,
        buckets=buckets,
        verification=verification,
        notes=notes,
    )
    return inv


def write_outputs(repo_path: str, inv: Inventory) -> None:
    base = "docs/releases"
    write_file(repo_path, f"{base}/WHAT_DEPLOYED_{inv.tag}.md", render_md(inv))
    write_file(repo_path, f"{base}/WHAT_DEPLOYED_{inv.tag}.json", render_json(inv))
    write_file(repo_path, f"{base}/GO_LIVE_MANIFEST_{inv.tag}.md", render_manifest_md(inv))
    write_file(repo_path, f"{base}/DEPLOYMENT_PROOFS/{inv.tag}/README.md",
               "# Deployment Proofs\n\n- Evidence links go here (CI run URL, release URL, image digest, etc.)\n")
