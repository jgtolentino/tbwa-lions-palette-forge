import os
import subprocess
from typing import List, Tuple


def _run(cmd: List[str], cwd: str) -> str:
    p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\n{p.stderr}")
    return p.stdout.strip()


def list_commits(repo_path: str, prev_tag: str, tag: str) -> List[str]:
    out = _run(["git", "rev-list", f"{prev_tag}..{tag}"], cwd=repo_path)
    return [x for x in out.splitlines() if x]


def diff_name_status(repo_path: str, prev_tag: str, tag: str) -> List[Tuple[str, str]]:
    out = _run(["git", "diff", "--name-status", f"{prev_tag}..{tag}"], cwd=repo_path)
    rows = []
    for line in out.splitlines():
        if not line.strip():
            continue
        parts = line.split("\t", 1)
        if len(parts) == 2:
            rows.append((parts[0], parts[1]))
    return rows


def show_commit(repo_path: str, sha: str) -> str:
    return _run(["git", "show", "-s", "--format=%H %s", sha], cwd=repo_path)


def ensure_tags_exist(repo_path: str, tag: str) -> None:
    _run(["git", "rev-parse", "--verify", tag], cwd=repo_path)


def write_file(repo_path: str, relpath: str, content: str) -> None:
    abspath = os.path.join(repo_path, relpath)
    os.makedirs(os.path.dirname(abspath), exist_ok=True)
    with open(abspath, "w", encoding="utf-8") as f:
        f.write(content)
