#!/usr/bin/env python3
"""Generate deterministic deployment inventory from git history."""

import argparse
import sys
import os

# Add parent directory to path so we can import releasebot
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from releasebot.config import Target
from releasebot.main import run_local, write_outputs


def main():
    ap = argparse.ArgumentParser(
        description="Generate deployment inventory from git tag range"
    )
    ap.add_argument("--repo-path", help="Local path to target repo")
    ap.add_argument("--github-repo", help="owner/name (optional, future)")
    ap.add_argument("--github-token", help="token (optional, future)")
    ap.add_argument("--tag", required=True, help="Target tag (e.g., prod-20260109-2219)")
    ap.add_argument("--prev-tag", required=True, help="Previous tag to diff from")
    args = ap.parse_args()

    t = Target(
        repo_path=args.repo_path,
        github_repo=args.github_repo,
        github_token=args.github_token,
        tag=args.tag,
        prev_tag=args.prev_tag,
    )
    t.validate()

    if not t.repo_path:
        raise SystemExit("Only --repo-path mode implemented in this drop (deterministic + zero API assumptions).")

    inv = run_local(t)
    write_outputs(t.repo_path, inv)
    print(f"Wrote release docs under {t.repo_path}/docs/releases for {t.tag}")


if __name__ == "__main__":
    main()
