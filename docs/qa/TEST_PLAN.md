# Test Plan — Scratch Serverless Notes E2E (`cypress-notes-e2e-tests`)

## 1. Objective
Validate end-to-end user journeys, responsive layout behavior, route guards, form validation, and third-party integrations (AWS Cognito, S3 file uploads, Stripe iframe, Mailosaur email OTP) on the **Scratch** Serverless Notes web application (`https://notes-serverless-app.com`).

## 2. Scope

### In Scope
* **Public & Unauthenticated Journeys ([`publicScenarios.cy.js`](../../cypress/e2e/publicScenarios.cy.js)):**
  * Landing page entry links (`/signup`, `/login`)
  * Route-guard redirects from `/notes/new` and `/settings` to `/login?redirect=...`
  * Client-side form validation on Login (non-empty credentials) and Signup (password matching)
  * Unknown route 404 fallback (`.NotFound`)
  * Responsive navbar collapse toggle at tablet viewport (`767x480`, below `768px` breakpoint)
* **Authenticated Journeys ([`login.cy.js`](../../cypress/e2e/login.cy.js), [`authenticatedScenarios.cy.js`](../../cypress/e2e/authenticatedScenarios.cy.js)):**
  * Authentication via AWS Cognito with cached `cy.session()` and uncached login verification
  * Full Note CRUD (Create, Edit with `cy.selectFile()` attachment upload, Delete) synchronized with `GET **/notes` intercepts
  * Stripe billing iframe integration inside `/settings` verified via `POST **/prod/billing` network intercept
  * Responsive logout flow across desktop (`1280x720`) and tablet (`767x480`) viewports using `@cypress/grep`
* **Email OTP Onboarding ([`signup.cy.js`](../../cypress/e2e/signup.cy.js)):**
  * Account signup and 6-digit Cognito verification code retrieval via Mailosaur API

### Out of Scope
* AWS Lambda unit internals and Cognito infrastructure provisioning
* Live Stripe financial settlement outside test card tokens (`4242...`)

## 3. Environment & Security Design
* **Runner / Runtime:** Cypress `16.3.0`, Node.js 24, ESLint 10 (`eslint-plugin-cypress@7`)
* **Secret Isolation:** Uses Cypress 16's `cy.env(['USER_EMAIL', 'USER_PASSWORD', ...])` for sensitive credentials instead of deprecated `Cypress.env()`, keeping secrets isolated from browser exposure, while public configuration (`viewportWidthBreakpoint`) uses `Cypress.expose()`.
* **Tag Strategy (`@cypress/grep`):**
  * `@desktop-and-tablet`: executed in both `1280x720` and `767x480` viewports via `--expose grepTags=@desktop-and-tablet`
  * `@auth`: requires valid Scratch user credentials
  * `@mailosaur`: requires Mailosaur API credentials

## 4. Exit Criteria
* `npm run lint` completes with `0` errors and `0` warnings.
* Public desktop (`publicScenarios.cy.js`) and tablet responsive (`@desktop-and-tablet`) specs pass without external paid dependencies.
* Authenticated and Mailosaur suites are verified in CI whenever valid credentials are configured.
