# CLAUDE.md - Operating Contract

## Repo Rules

## OCA-Style Workflow (Canonical)

### Purpose
Keep this repo aligned with **OCA tooling + conventions** while preserving the existing layered architecture:
- **Odoo CE runtime**
- **OCA addons** (managed via `oca.lock.json`, not tracked)
- **IPAI addons** (tracked, ship-ready)

### Non-Negotiables
- **Do NOT run** `copier` in the repo root (it will overwrite structure).
- Use `/tmp/oca-template/` to generate templates and **selectively port** only the needed files.
- New custom modules live under: `addons/ipai/<module_name>/`
- OCA repos cloned under: `addons/oca/*/` are **NOT tracked** (only keep base marker files per `.gitignore`).
- Changes must remain deterministic and CI-friendly (no "works on my machine" steps).

---

## Standard Tooling (Must Stay Green)

### Pre-commit
Install + run:
```bash
pip install -r requirements.txt
pre-commit install
pre-commit run -a
```

### Local verification (mirror CI)

Run:

```bash
./scripts/verify_local.sh
```

If `scripts/verify_local.sh` is missing, create it with:

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "== pre-commit =="
pre-commit run -a

echo "== deterministic data-model =="
python scripts/generate_odoo_dbml.py
git diff --exit-code docs/data-model/ || {
  echo "ERROR: docs/data-model drift detected. Regenerate and commit."
  exit 1
}

echo "== seed drift checks (if present) =="
if [ -f scripts/seed_finance_close_from_xlsx.py ]; then
  python scripts/seed_finance_close_from_xlsx.py
  git diff --exit-code addons/ipai_finance_close_seed/ || {
    echo "ERROR: seed drift detected. Regenerate and commit."
    exit 1
  }
fi

echo "OK"
```

---

## Using OCA Template Safely (Selective Port Only)

### Generate OCA template in a temp directory

```bash
rm -rf /tmp/oca-template && mkdir -p /tmp/oca-template
cd /tmp/oca-template
pipx install copier || true
copier copy https://github.com/OCA/oca-addons-repo-template.git/ repo --trust
```

### Allowed files to port (only if beneficial)

* `.pre-commit-config.yaml` (rules/tools)
* `pyproject.toml` (lint/format defaults)
* targeted `.github/workflows/*` patterns (lint/test hygiene)

### Forbidden

* Overwriting repo layout
* Introducing a second "root" structure
* Moving existing directories to match the template

---

## Fast Module Scaffolding (mrbob)

### Install

```bash
pipx install mrbob
pipx inject mrbob bobtemplates.odoo
```

### Create addon (then move under addons/ipai/)

```bash
mrbob bobtemplates.odoo:addon
# move generated module into addons/ipai/<module_name>/
```

### Create model scaffolding inside addon

```bash
mrbob bobtemplates.odoo:model
```

---

## Commit Rules (OCA-style)

* Use conventional commits: `chore(oca): ...`, `feat(ipai_*): ...`, `fix(ci): ...`
* One feature = one commit whenever possible.
* Always include proof commands (logs/status) after changes that affect runtime or CI.

Example:

```bash
git add -A
git commit -m "chore(oca): align tooling with OCA template patterns"
git push -u origin <branch>
```

---

## Frontend ↔ Odoo Backend Integration (Canonical)

### Repos + Responsibilities
- **tbwa-agency-databank** (Frontend + product shell)
  - Scout Dashboard (Next.js)
  - CES JamPacked (Vite+React)
  - Supabase (semantic + AI data layer, RLS)
- **jgtolentino/odoo-ce** (Backend runtime + source-of-truth ERP)
  - Odoo CE runtime
  - OCA addons (untracked clones, governed by lockfile / deterministic fetch)
  - IPAI custom addons (tracked, shipped)

### Data Flow (Truth Sources)
1) **Odoo is system-of-record** for ERP objects (partners, products, orders, POS, inventory).
2) **Supabase is analytics + semantic contract + AI layer** (gold/platinum views, contracts, artifacts).
3) Frontends read primarily from **Supabase** for dashboards + AI UX.
4) Frontends call **Odoo** for transactional actions (write paths) via a thin API gateway (preferred) or direct Odoo endpoints when explicitly allowed.

### Required Integration Surfaces
#### A) Odoo → Supabase (sync / ELT)
- Mechanism: scheduled extractor (Edge Function / worker) + incremental checkpoints
- Targets:
  - `scout.bronze_*` (raw ingests)
  - `scout.silver_*` (validated)
  - `scout.gold_*` (dashboard-ready)
  - `ces.*` (creative effectiveness layer; jobs/runs/artifacts)
- Non-negotiable: all dashboard metrics must map to semantic contracts:
  - `docs/scout/semantic_contract.yaml`
  - `docs/ces/semantic_contract.yaml` (when present)

#### B) Frontend → Supabase (read path)
- Frontends must use:
  - RPC/view access only (Gold/Platinum)
  - RLS enforced by `org_id` / `tenant_id`
  - Central DAL:
    - `apps/*/src/data/*.ts` (single source of truth)
    - typed hooks with React Query
- No direct table reads outside the DAL.

#### C) Frontend → Odoo (write path)
Preferred pattern: **API gateway** (Edge Function) that:
- authenticates user/session
- validates payload
- calls Odoo JSON-RPC/XML-RPC
- writes audit + event to Supabase

Write actions that may go to Odoo:
- create/update campaigns (metadata)
- upload assets (register in Odoo + store in object storage)
- trigger Odoo workflows (tasks/approvals)

### Environment Variables (Expected)
- Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only)
- Odoo (server only):
  - `ODOO_BASE_URL`
  - `ODOO_DB`
  - `ODOO_USERNAME`
  - `ODOO_PASSWORD`
  - `ODOO_JSONRPC_PATH` (default `/jsonrpc`)
- Release/Inventory tooling:
  - `GITHUB_TOKEN` (read-only OK)
  - `ODOO_CE_REPO=jgtolentino/odoo-ce`

### Release Discipline
- All production deploys must have a deterministic report:
  - `docs/releases/WHAT_DEPLOYED_<tag>.md`
  - `docs/releases/WHAT_DEPLOYED_<tag>.json`
  - `docs/releases/GO_LIVE_MANIFEST_<tag>.md`
- If evidence cannot be proven from repo/actions artifacts, mark **UNVERIFIED**.
