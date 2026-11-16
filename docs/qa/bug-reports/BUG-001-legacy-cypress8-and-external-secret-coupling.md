# BUG-001 — Legacy Cypress 8 Pipeline Breaks on Modern Runners and Removed `Cypress.env` API

| Field | Details |
| --- | --- |
| **ID** | BUG-001 |
| **Severity** | High |
| **Component** | CI Workflow (`.github/workflows/ci.yml`), Cypress Config, Support Commands |
| **Environment** | GitHub Actions `ubuntu-latest` / Node.js 24 / Cypress 16.3.0 |
| **Status** | Resolved |

## Summary
The legacy 2022 configuration pinned `cypress ^8.2.0`, `actions/checkout@v2`, `cypress-io/github-action@v2`, and a `node12.18.3` browser container while coupling `npm test` to `--record` and synchronous `Cypress.env()` calls. In modern GitHub Actions runners and Cypress 16+, Node 12 container actions fail to execute, `Cypress.env()` is removed, and external SaaS keys (`CYPRESS_RECORD_KEY`, trial Mailosaur) prevent standalone CI verification.

## Impact
1. **CI Pipeline Failure:** Outdated Node 12 container and `@v2` actions break workflow execution on modern runners.
2. **Fork / Contributor Lockout:** Coupling `npm test` to `--record` (`projectId: "o13fg9"`) and external secrets fails whenever contributors clone the repository without dashboard or Mailosaur credentials.
3. **Unsafe Command Chaining:** `cy.get('#content').clear().type(...)` triggered `cypress/unsafe-to-chain-command` under modern ESLint static checks.

## Resolution
1. Upgraded to **Cypress 16.3.0**, **Node.js 24**, **`cypress-io/github-action@v7`**, **`@cypress/grep@7.0.0`**, and **ESLint 10** flat config (`eslint.config.mjs`).
2. Migrated synchronous `Cypress.env()` reads to asynchronous `cy.env([...])` for secrets and `Cypress.expose()` / `--expose` for `viewportWidthBreakpoint` and grep tags; replaced `cypress-file-upload` and `cypress-dark` with native `cy.selectFile()`.
3. Decoupled `npm test` from `--record` (keeping `npm run test:record` optional) and added standalone [`publicScenarios.cy.js`](../../../cypress/e2e/publicScenarios.cy.js) coverage alongside authenticated and Mailosaur suites.
4. Split unsafe `.clear().type(...)` chains in [`commands.js`](../../../cypress/support/commands.js) so `npm run lint` passes with zero warnings/errors.
