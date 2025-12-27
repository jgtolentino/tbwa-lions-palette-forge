# TBWA Lions Palette Forge - Audit Task Breakdown

**Generated:** December 28, 2025
**Based on:** Comprehensive Codebase Audit

---

## Immediate (Blockers / Before Production)

### 1. Security Patches (Critical Priority)

- [ ] **VULN-001**: Update `form-data` to 4.0.4+ (via axios update)
  - Command: `npm install axios@latest`
  - Severity: CRITICAL
  - Effort: ~0.5 hour

- [ ] **VULN-002**: Update `axios` to 1.12.0+
  - Command: `npm install axios@latest`
  - Severity: HIGH
  - Effort: ~0.5 hour

- [ ] **VULN-003**: Update `playwright` to latest stable (SSL bypass fix)
  - Command: `npm install playwright@latest --save-dev`
  - Severity: HIGH
  - Effort: ~0.5 hour

- [ ] **VULN-004**: Update `vite` to latest stable (dev server bypass fixes)
  - Command: `npm install vite@latest --save-dev`
  - Severity: HIGH
  - Effort: ~0.5 hour

- [ ] **VULN-005**: Apply `npm audit fix` for remaining moderate/low issues
  - Command: `npm audit fix`
  - Severity: MEDIUM
  - Effort: ~0.5 hour

### 2. Secrets & Env Hardening

- [ ] **SEC-001**: Remove any actual API keys from `VITE_*` env usage (frontend)
  - Action:
    - Ensure MCP/Claude/DB keys are **never** exposed as `VITE_*`
    - Move all secrets to backend-only env vars
  - Severity: CRITICAL
  - Effort: ~1 hour

- [ ] **SEC-002**: Verify `.env`, `.env.local`, `.env.*` are fully ignored and clean history if needed
  - Action:
    - Confirm `.gitignore` covers all env files
    - If any secrets ever committed, rotate and (optionally) purge history
  - Severity: HIGH
  - Effort: ~1 hour

### 3. Repo Cleanup (Production Guard)

- [ ] **CLEAN-001**: Remove legacy backup directories and mock-only code from main tree
  - Action: `rm -rf src.backup.*` and any unused mock folders
  - Severity: MEDIUM
  - Effort: ~0.5 hour

---

## Short-term (1-2 Sprints)

### 4. HTTP & Browser-Side Security

- [ ] **SEC-003**: Implement basic security headers (CSP, X-Frame-Options, HSTS) at the serving layer
  - Action:
    - Add CSP with script/style-src restrictions
    - Add `X-Frame-Options: DENY` or equivalent
    - Enable HSTS via host config
  - Severity: HIGH
  - Effort: ~3 hours

- [ ] **SEC-004**: Lock down CORS policy on backend
  - Action:
    - Restrict origins to production domains
    - Remove `*` wildcard if present
  - Severity: HIGH
  - Effort: ~2 hours

- [ ] **SEC-005**: Enforce WSS for WebSockets in production
  - Action:
    - Use `wss://` for `VITE_WEBSOCKET_URL` in prod
    - Add auth/ACL on WebSocket channels
  - Severity: HIGH
  - Effort: ~2 hours

- [ ] **SEC-006**: Implement server-side file size & type validation for uploads
  - Action:
    - Enforce limits consistent with `VITE_MAX_FILE_SIZE`
    - Restrict MIME types; reject unknown/binary blobs by default
  - Severity: HIGH
  - Effort: ~3 hours

### 5. API & Input Validation

- [ ] **VAL-001**: Standardize Zod (or equivalent) validation for all user input paths
  - Action:
    - Wrap all form submits and API payloads with shared schema validators
  - Severity: MEDIUM
  - Effort: ~4 hours

- [ ] **VAL-002**: Sanitize all user-facing rich content (markdown/HTML)
  - Action:
    - Use a sanitizer (e.g., DOMPurify) on any untrusted HTML/markdown
  - Severity: MEDIUM
  - Effort: ~3 hours

### 6. Error Handling & Logging

- [ ] **ERR-001**: Introduce React Error Boundaries for page-level failures
  - Severity: MEDIUM
  - Effort: ~3 hours

- [ ] **ERR-002**: Configure Sentry to scrub PII and secrets from logs
  - Action:
    - Add before-send hooks to sanitize events
  - Severity: MEDIUM
  - Effort: ~2 hours

### 7. CI / Automation

- [ ] **CI-001**: Add CI job for `npm run lint && npm run build`
  - Severity: MEDIUM
  - Effort: ~2 hours

- [ ] **CI-002**: Add CI job for `npm audit --audit-level=high` and fail on HIGH/CRITICAL
  - Severity: MEDIUM
  - Effort: ~2 hours

---

## Medium-term (3-4 Sprints)

### 8. Testing Strategy

- [ ] **TEST-001**: Introduce unit test framework (Vitest or Jest)
  - Action:
    - Add `npm test` script and initial configuration
  - Severity: MEDIUM
  - Effort: ~6 hours

- [ ] **TEST-002**: Create a critical-path smoke test suite (happy-path flows)
  - Coverage Targets: navigation, key forms, MCP invocation
  - Severity: MEDIUM
  - Effort: ~8 hours

- [ ] **TEST-003**: Add Playwright E2E tests for end-to-end UX flows
  - Severity: MEDIUM
  - Effort: ~8 hours

### 9. Architecture & State Management

- [ ] **ARCH-001**: Centralize API layer with a repository/service pattern
  - Action:
    - Move axios calls into `/src/api` or `/src/services` only
    - Use typed contracts for all requests/responses
  - Severity: MEDIUM
  - Effort: ~8 hours

- [ ] **ARCH-002**: Introduce a clear client state solution (e.g., Zustand/Redux) where needed
  - Severity: MEDIUM
  - Effort: ~6 hours

- [ ] **ARCH-003**: Document component hierarchy and routing topology
  - Severity: LOW
  - Effort: ~3 hours

### 10. Performance & Bundle Size

- [ ] **PERF-001**: Generate bundle analysis and identify heavy modules
  - Command: `npm run build` plus bundle analyzer plugin
  - Severity: MEDIUM
  - Effort: ~3 hours

- [ ] **PERF-002**: Implement route-based code splitting and lazy loading for heavy pages
  - Severity: MEDIUM
  - Effort: ~6 hours

- [ ] **PERF-003**: Extract rarely used chart/visual components into async-loaded chunks
  - Severity: LOW
  - Effort: ~4 hours

### 11. Documentation & DX

- [ ] **DOC-001**: Create a concise CONTRIBUTING.md with lint/test/audit expectations
  - Severity: LOW
  - Effort: ~3 hours

- [ ] **DOC-002**: Document backend MCP integration contracts and timeouts
  - Severity: LOW
  - Effort: ~3 hours

---

## Long-term (Ongoing / Nice-to-have)

### 12. UX, Accessibility & Observability

- [ ] **A11Y-001**: Add accessibility checks (axe, testing-library a11y assertions)
  - Severity: LOW
  - Effort: ~6 hours

- [ ] **A11Y-002**: Establish color contrast and keyboard navigation standards for all key flows
  - Severity: LOW
  - Effort: ~6 hours

- [ ] **OBS-001**: Implement front-end performance monitoring (Web Vitals, Sentry perf)
  - Severity: LOW
  - Effort: ~6 hours

- [ ] **OBS-002**: Add privacy-aware analytics (page views, feature use)
  - Severity: LOW
  - Effort: ~6 hours

### 13. Design System & Storybook

- [ ] **DS-001**: Stand up Storybook for shadcn/radix-based components
  - Severity: LOW
  - Effort: ~8 hours

- [ ] **DS-002**: Add visual regression testing for core components and layouts
  - Severity: LOW
  - Effort: ~8 hours

### 14. Product & Experimentation

- [ ] **EXP-001**: Add feature-flag framework for experiments (e.g., hero layouts, flows)
  - Severity: LOW
  - Effort: ~6 hours

- [ ] **EXP-002**: Introduce basic A/B test hooks (flag-based rendering, metric logging)
  - Severity: LOW
  - Effort: ~6 hours

---

## Effort Summary (Approximate)

| Priority | Task Count | Estimated Hours |
|----------|------------|-----------------|
| Immediate | 8 tasks | ~4 hours |
| Short-term | 11 tasks | ~30 hours |
| Medium-term | 10 tasks | ~42 hours |
| Long-term | 8 tasks | ~50 hours |
| **Total** | **37 tasks** | **~126 hours** |

---

## Quick Commands

```bash
# Fix immediate security issues
npm install axios@latest
npm install playwright@latest --save-dev
npm install vite@latest --save-dev
npm audit fix

# Remove backup directories
rm -rf src.backup.*

# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Run security audit
npm audit

# Check bundle size
npm run build && du -sh dist/assets/*
```

---

**Next Review Date:** After Sprint 2 completion
**Owner:** Development Team Lead
