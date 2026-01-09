# ReleaseBot (Deterministic What Deployed / What Shipped)

## Purpose

Generate deterministic deployment inventories from:
- git history (commit range)
- GitHub Releases + Actions metadata (optional evidence)
- repo tree changes

Outputs (written under target repo):
- `docs/releases/WHAT_DEPLOYED_<tag>.md`
- `docs/releases/WHAT_DEPLOYED_<tag>.json`
- `docs/releases/GO_LIVE_MANIFEST_<tag>.md`
- `docs/releases/DEPLOYMENT_PROOFS/<tag>/README.md`

## Installation

Python 3.11+.

```bash
pip install -r requirements.txt
```

## Run (local or CI)

### Against a local checkout of the target repo

```bash
python tools/releasebot/scripts/whats_deployed.py \
  --repo-path ../odoo-ce \
  --tag prod-YYYYMMDD-HHMM \
  --prev-tag prod-YYYYMMDD-HHMM
```

### Against GitHub (no local clone) - Future

```bash
python tools/releasebot/scripts/whats_deployed.py \
  --github-repo jgtolentino/odoo-ce \
  --tag prod-YYYYMMDD-HHMM \
  --prev-tag prod-YYYYMMDD-HHMM \
  --github-token $GITHUB_TOKEN
```

## Portable Usage

This tooling is designed to be **portable** - you can copy the entire `tools/releasebot/` directory to any repo (e.g., `jgtolentino/odoo-ce`) and use it there.

## Architecture

```
tools/releasebot/
  README.md              # This file
  requirements.txt       # Python dependencies
  releasebot/
    __init__.py
    config.py            # Target configuration dataclass
    git_range.py         # Git operations (rev-list, diff, show)
    inventory.py         # Inventory dataclass and bucketization
    render.py            # Markdown and JSON renderers
    main.py              # Orchestration (run_local, write_outputs)
  scripts/
    whats_deployed.py    # CLI entry point
```

## Output Example

Running against a tag range produces:

```
docs/releases/
  WHAT_DEPLOYED_prod-20260109-2219.md      # Human-readable report
  WHAT_DEPLOYED_prod-20260109-2219.json    # Machine-readable report
  GO_LIVE_MANIFEST_prod-20260109-2219.md   # Release checklist
  DEPLOYMENT_PROOFS/
    prod-20260109-2219/
      README.md                             # Evidence links placeholder
```

## Buckets

Changes are categorized into:
- **Odoo changes (addons/)** - Odoo addon modifications
- **Supabase changes (supabase/)** - Database/function changes
- **Frontend changes (apps/)** - UI/application changes
- **CI/Infra changes (.github/, ops/, scripts/)** - DevOps changes
- **Docs/Other** - Everything else

## Future Enhancements

- GitHub API evidence enrichment (release URLs, workflow run URLs, artifacts)
- Slack/Teams notification integration
- Semantic versioning validation
- Automated changelog generation
