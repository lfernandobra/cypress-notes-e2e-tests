# Cypress Notes E2E Tests

Automated End-to-End QA suite for the **Scratch** Serverless Notes application (`https://notes-serverless-app.com`), modernized to **Cypress 16**, **Node.js 24**, **ESLint 10 (`eslint-plugin-cypress`)**, **`@cypress/grep`**, **Gherkin BDD**, **OpenAPI/Postman contracts**, and **GitHub Actions CI**.

---

## 1. Test Strategy & Coverage Architecture

| Layer | Scope | Specs / Artifacts | Requires Secrets |
| --- | --- | --- | --- |
| **Static Quality** | ESLint 10 flat config + Cypress plugin rules | [`eslint.config.mjs`](eslint.config.mjs) | No |
| **Public & Responsive UI** | Landing links, `/notes/new` & `/settings` auth redirects, Login/Signup validation, 404 route, `< 768px` tablet navbar toggle | [`cypress/e2e/publicScenarios.cy.js`](cypress/e2e/publicScenarios.cy.js) | No |
| **Authenticated Flows** | Cognito login (`cy.session()`), Note CRUD + `cy.selectFile()` upload, Stripe iframe billing (`POST **/prod/billing`), responsive logout | [`cypress/e2e/login.cy.js`](cypress/e2e/login.cy.js), [`cypress/e2e/authenticatedScenarios.cy.js`](cypress/e2e/authenticatedScenarios.cy.js) | `USER_EMAIL`, `USER_PASSWORD` |
| **Email OTP Onboarding** | End-to-end user signup and 6-digit code extraction via Mailosaur (run manually via `workflow_dispatch` with `run_mailosaur=true`) | [`cypress/e2e/signup.cy.js`](cypress/e2e/signup.cy.js) | `MAILOSAUR_*`, `USER_PASSWORD` |
| **API & QA Docs** | BDD Gherkin specs, OpenAPI 3.0 contract, Postman collection, Test Plan, Test Cases, Bug Report | [`specs/`](specs/features/), [`docs/`](docs/qa/TEST_PLAN.md) | No |

---

## 2. Project Structure

```text
├── .github/workflows/ci.yml              # ESLint + Desktop & Tablet CI workflows (cypress-io/github-action@v7)
├── cypress.config.js                     # Cypress 16 E2E config + @cypress/grep/plugin + expose breakpoint
├── cypress.env.example.json              # Credential placeholder template (copy to cypress.env.json)
├── eslint.config.mjs                     # ESLint 10 flat configuration with eslint-plugin-cypress
├── cypress/
│   ├── e2e/
│   │   ├── publicScenarios.cy.js         # Unauthenticated UI, route guards, validation & responsive toggle
│   │   ├── login.cy.js                   # Uncached login flow
│   │   ├── authenticatedScenarios.cy.js  # Note CRUD + upload, Stripe billing iframe, logout (@desktop-and-tablet)
│   │   └── signup.cy.js                  # Cognito email OTP signup with Mailosaur (@mailosaur)
│   ├── fixtures/example.json             # Sample attachment fixture for note creation/editing
│   └── support/
│       ├── commands.js                   # Custom commands using cy.env(), cy.session(), cy.selectFile(), cy.iframe()
│       ├── commands.d.ts                 # TypeScript/IDE autocomplete definitions
│       └── e2e.js                        # Support entry point (@cypress/grep, iframe, mailosaur, commands)
├── docs/
│   ├── postman/scratch-notes-api.postman_collection.json
│   ├── qa/                               # TEST_PLAN.md, TEST_CASES.md & bug-reports/BUG-001
│   └── swagger/openapi.yaml              # API contract mapped from Scratch AWS API Gateway calls
└── specs/features/                       # Gherkin BDD feature files
```

---

## 3. Technical Highlights

* **Cypress 16 Security Model (`cy.env()` & `Cypress.expose()`):** Sensitive credentials (`USER_EMAIL`, `USER_PASSWORD`, `MAILOSAUR_API_KEY`) are fetched asynchronously via `cy.env([...])` rather than deprecated `Cypress.env()`, while non-sensitive layout configuration (`viewportWidthBreakpoint: 768`) uses `Cypress.expose()`.
* **Cross-Viewport Tagging:** Responsive tests tagged `{ tags: '@desktop-and-tablet' }` execute cleanly under both `1280x720` (desktop) and `767x480` (tablet) viewports via `--expose grepTags=@desktop-and-tablet`.
* **Native File Uploads & Session Caching:** Uses built-in `cy.selectFile()` and `cy.session()`, removing obsolete third-party upload and theming packages.
* **Third-Party Iframe & Network Synchronization:** Exercises Stripe card inputs inside `.card-field iframe` via `cypress-iframe` and synchronizes UI assertions with `cy.intercept()` aliases (`@getNotes`, `@paymentRequest`).

---

## 4. Local Setup & Execution

### Prerequisites
* **Node.js 22+ or 24+** (`npm` included)

### Install Dependencies
```bash
npm ci
```

### Run Without Credentials (Public & Responsive Suites + Lint)
```bash
# Static checks
npm run lint

# Public desktop scenarios (routes, guards, form validation, 404, desktop navbar)
npm run test:public

# Responsive tablet viewport (@desktop-and-tablet tag)
npx cypress run --config viewportWidth=767,viewportHeight=480 --spec cypress/e2e/publicScenarios.cy.js --expose grepTags=@desktop-and-tablet
```

### Run Full Suite (Including Authenticated & Mailosaur Specs)
Copy [`cypress.env.example.json`](cypress.env.example.json) to `cypress.env.json` (git-ignored) and populate valid credentials:

```bash
cp cypress.env.example.json cypress.env.json

# Full headless suite
npm test

# Interactive runner (desktop / tablet)
npm run cy:open
npm run cy:open:tablet
```

---

## 5. Author

**Luis Fernando Brandão**  
QA Automation Engineer  
* [GitHub](https://github.com/lfernandobra)  
* [LinkedIn](https://linkedin.com/in/lfernandobra)
