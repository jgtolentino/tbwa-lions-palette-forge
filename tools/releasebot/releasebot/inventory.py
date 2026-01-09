from dataclasses import dataclass, asdict
from typing import Dict, List, Tuple


@dataclass
class Inventory:
    tag: str
    prev_tag: str
    commit_count: int
    commits: List[str]
    changed_files: List[Tuple[str, str]]
    buckets: Dict[str, List[str]]
    verification: Dict[str, str]
    notes: List[str]


def bucketize(changed_files: List[Tuple[str, str]]) -> Dict[str, List[str]]:
    buckets = {
        "Odoo changes (addons/)": [],
        "Supabase changes (supabase/)": [],
        "Frontend changes (apps/)": [],
        "CI/Infra changes (.github/, ops/, scripts/)": [],
        "Docs/Other": [],
    }
    for status, path in changed_files:
        if path.startswith("addons/"):
            buckets["Odoo changes (addons/)"].append(f"{status}\t{path}")
        elif path.startswith("supabase/"):
            buckets["Supabase changes (supabase/)"].append(f"{status}\t{path}")
        elif path.startswith("apps/"):
            buckets["Frontend changes (apps/)"].append(f"{status}\t{path}")
        elif path.startswith(".github/") or path.startswith("ops/") or path.startswith("scripts/"):
            buckets["CI/Infra changes (.github/, ops/, scripts/)"].append(f"{status}\t{path}")
        else:
            buckets["Docs/Other"].append(f"{status}\t{path}")
    return buckets


def as_json(inv: Inventory) -> dict:
    return asdict(inv)
