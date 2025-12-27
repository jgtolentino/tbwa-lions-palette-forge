# TBWA Lions Palette Forge - Audit Task Breakdown

**Generated:** December 28, 2025
**Based on:** Comprehensive Codebase Audit

---

## Immediate (Blockers / Before Production)

### Security Patches (Critical Priority)
- [ ] **VULN-001**: Update `form-data` to 4.0.4+ (via axios update)
  - Command: `npm install axios@latest`
  - Severity: CRITICAL
  - Effort: 30 minutes

- [ ] **VULN-002**: Update `axios` to 1.12.0+
  - Command: `npm install axios@latest`
  - Severity: HIGH
  - Effort: 30 minutes (includes testing)

- [ ] **VULN-003**: Update `glob` to 10.5.0+
  - Command: `npm update glob`
  - Severity: HIGH
  - Effort: 15 minutes

- [ ] **VULN-004**: Update `playwright` to 1.55.1+
  - Command: `npm install playwright@latest --save-dev`
  - Severity: HIGH
  - Effort: 30 minutes (verify e2e tests)

### Build & Deploy Safety
- [ ] **VULN-005**: Update `vite` to latest stable
  - Command: `npm install vite@latest --save-dev`
  - Severity: MODERATE
  - Effort: 1 hour (check for breaking changes)

- [ ] Run `npm audit fix` to auto-fix remaining vulnerabilities
  - Effort: 15 minutes

### Repository Cleanup
- [ ] **CQ-004**: Remove backup directories
  - Files: `src.backup.20250710_130329/`, `src.backup.pre-strip.20250710_130700/`
  - Command: `rm -rf src.backup.*`
  - Effort: 5 minutes

---

## Short-term (1-2 Sprints)

### Testing Infrastructure (High Priority)
- [ ] **CQ-003**: Configure Vitest testing framework
  - Install: `npm install -D vitest @testing-library/react @testing-library/jest-dom`
  - Configure: Create `vitest.config.ts`
  - Add test script to `package.json`
  - Effort: 2 hours

- [ ] Write unit tests for API services
  - Files: `src/api/ces-backend.ts`, `src/api/extraction.ts`
  - Target: 80% coverage
  - Effort: 4 hours

- [ ] Write unit tests for business logic services
  - Files: `src/services/askCesApi.ts`, `src/services/mcp-service-adapter.ts`
  - Target: 80% coverage
  - Effort: 6 hours

- [ ] Write component tests for critical UI
  - Files: `CampaignAnalysisViewer.tsx`, `VideoAnalysis.tsx`
  - Target: Key interaction flows
  - Effort: 6 hours

### CI/CD Improvements
- [ ] Add npm audit to GitHub Actions workflow
  - File: `.github/workflows/backend-verification.yml`
  - Fail on HIGH/CRITICAL vulnerabilities
  - Effort: 1 hour

- [ ] Add test execution to CI pipeline
  - Trigger on PR and push to main
  - Report coverage
  - Effort: 2 hours

### Code Quality
- [ ] **CQ-001**: Re-enable unused variable detection
  - File: `eslint.config.js`
  - Change `"@typescript-eslint/no-unused-vars": "off"` to `"warn"`
  - Fix resulting warnings
  - Effort: 2 hours

- [ ] Fix ESLint `no-explicit-any` violations in active source
  - Files: Various in `src/`
  - Add proper TypeScript types
  - Effort: 4 hours

### Security Headers
- [ ] **SEC-003**: Add security headers
  - Option A: Add meta tags to `index.html`
  - Option B: Configure via Vercel/hosting headers
  - Include: CSP, X-Frame-Options, X-Content-Type-Options
  - Effort: 2 hours

---

## Medium-term (3-4 Sprints)

### Performance Optimization
- [ ] **CQ-002**: Implement route-based code splitting
  - Use `React.lazy()` for page components
  - Add `Suspense` boundaries
  - Target: Main bundle < 500KB
  - Effort: 4 hours

- [ ] Lazy load heavy dependencies
  - Files: recharts, framer-motion imports
  - Use dynamic imports where applicable
  - Effort: 3 hours

- [ ] Add bundle size monitoring to CI
  - Tools: `@bundle-analyzer/webpack-plugin` or `vite-bundle-analyzer`
  - Set size budgets
  - Effort: 2 hours

### Architecture Improvements
- [ ] **ARCH-001**: Remove mock responses from components
  - File: `src/components/CampaignAnalysisViewer.tsx`
  - Route through actual API or feature flag
  - Effort: 4 hours

- [ ] **CQ-005**: Decompose large components
  - Target: `VideoAnalysis.tsx` (30KB), `CampaignDashboard.tsx` (22KB)
  - Extract into sub-components
  - Effort: 8 hours

- [ ] Add error boundaries throughout application
  - Wrap route components
  - Add fallback UI
  - Log errors to Sentry (already configured)
  - Effort: 4 hours

### Testing Expansion
- [ ] Implement E2E tests with Playwright
  - Cover: Login, Video Upload, Campaign Analysis
  - File: Create `e2e/` directory
  - Effort: 8 hours

- [ ] Achieve 60%+ code coverage
  - Current: 0%
  - Focus on critical paths
  - Effort: Ongoing

### Security Hardening
- [ ] **SEC-001**: Move API keys to backend proxy
  - Create backend endpoints for sensitive API calls
  - Remove `VITE_` prefixed secrets
  - Effort: 8 hours (requires backend work)

- [ ] **SEC-002**: Enforce WSS protocol in production
  - File: `src/config/mcp-integration.ts`
  - Add production check for secure WebSocket
  - Effort: 1 hour

---

## Long-term (Sprint 5+)

### Documentation
- [ ] Create OpenAPI/Swagger documentation for backend APIs
  - Document all endpoints in `MCP_ENDPOINTS`
  - Include request/response schemas
  - Effort: 8 hours

- [ ] Set up Storybook for component library
  - Document UI components
  - Add visual regression tests
  - Effort: 16 hours

- [ ] Create deployment runbook
  - Document rollback procedures
  - Environment setup guide
  - Effort: 4 hours

### Infrastructure
- [ ] Upgrade Render.com to paid tier
  - Eliminate cold start delays
  - Add uptime monitoring
  - Effort: 2 hours + cost

- [ ] Implement health checks
  - Backend health endpoint
  - Frontend connectivity check
  - Effort: 4 hours

### Advanced Quality
- [ ] **ARCH-002**: Implement client state management
  - Evaluate: Zustand, Jotai, or Redux Toolkit
  - Migrate complex client state
  - Effort: 8 hours

- [ ] Add accessibility testing
  - Tools: axe-core, pa11y
  - Integrate with CI
  - Effort: 4 hours

- [ ] Implement performance monitoring
  - Tools: Web Vitals, Lighthouse CI
  - Set performance budgets
  - Effort: 4 hours

---

## Summary

| Priority | Task Count | Estimated Hours |
|----------|------------|-----------------|
| Immediate | 8 | ~4 hours |
| Short-term | 11 | ~30 hours |
| Medium-term | 10 | ~42 hours |
| Long-term | 8 | ~50 hours |
| **Total** | **37** | **~126 hours** |

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
