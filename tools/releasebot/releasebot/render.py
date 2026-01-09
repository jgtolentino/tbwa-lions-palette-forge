import json
from typing import List

from .inventory import Inventory


def render_md(inv: Inventory) -> str:
    lines: List[str] = []
    lines.append(f"# What Deployed - {inv.tag}")
    lines.append("")
    lines.append("## Summary")
    lines.append(f"- Previous tag: `{inv.prev_tag}`")
    lines.append(f"- Commit count: **{inv.commit_count}**")
    lines.append("")
    lines.append("## Verification Results")
    for k, v in inv.verification.items():
        lines.append(f"- {k}: **{v}**")
    lines.append("")
    lines.append("## Changes Shipped (by bucket)")
    for bucket, items in inv.buckets.items():
        lines.append(f"### {bucket}")
        if not items:
            lines.append("- None")
        else:
            for it in items:
                lines.append(f"- {it}")
        lines.append("")
    lines.append("## Commits")
    for c in inv.commits:
        lines.append(f"- {c}")
    lines.append("")
    if inv.notes:
        lines.append("## Notes")
        for n in inv.notes:
            lines.append(f"- {n}")
        lines.append("")
    return "\n".join(lines)


def render_manifest_md(inv: Inventory) -> str:
    lines: List[str] = []
    lines.append(f"# GO-LIVE MANIFEST - {inv.tag}")
    lines.append("")
    lines.append("## Checklist")
    lines.append("- [ ] Deployment artifacts verified (CI logs / release assets)")
    lines.append("- [ ] Supabase migrations applied (if any)")
    lines.append("- [ ] Odoo addons updated and module list verified (if any)")
    lines.append("- [ ] Health checks passing")
    lines.append("- [ ] Smoke tests completed")
    lines.append("")
    lines.append("## Quick Facts")
    lines.append(f"- Prev: `{inv.prev_tag}`")
    lines.append(f"- Commits: **{inv.commit_count}**")
    lines.append("")
    return "\n".join(lines)


def render_json(inv: Inventory) -> str:
    return json.dumps(inv.__dict__, indent=2, default=str) + "\n"
