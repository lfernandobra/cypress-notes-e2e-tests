# Test Cases — Scratch Serverless Notes E2E

| ID | Spec | Tag(s) | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- | --- |
| TC-01 | `publicScenarios.cy.js` | — | None | Visit `/` | Displays `"Scratch"`, `"A simple note taking app"`, `/signup` and `/login` links |
| TC-02 | `publicScenarios.cy.js` | — | Unauthenticated | Visit `/notes/new` and `/settings` | Redirects to `/login?redirect=/notes/new` and `/login?redirect=/settings` |
| TC-03 | `publicScenarios.cy.js` | — | None | Visit `/login`, fill email only, then fill password | `Login` button stays disabled until both fields are non-empty |
| TC-04 | `publicScenarios.cy.js` | — | None | Visit `/signup`, fill mismatched then matching confirmation | `Signup` button enables only when `password === confirmPassword` |
| TC-05 | `publicScenarios.cy.js` | — | None | Visit `/route-that-does-not-exist` | Displays `.NotFound h3` containing `"Sorry, page not found"` |
| TC-06 | `publicScenarios.cy.js` | `@desktop-and-tablet` | Viewport `767x480` or `1280x720` | Visit `/` and check `.navbar-toggle` | Toggle button expands `"Login"` link below `768px`; link visible directly on desktop |
| TC-07 | `login.cy.js` | `@auth` | `USER_EMAIL` + `USER_PASSWORD` | Submit `/login` with `cacheSession: false` | Redirects to `/` and waits for `GET **/notes` |
| TC-08 | `authenticatedScenarios.cy.js` | `@auth` | Cached session | Create note, edit with `example.json` attachment, delete note | Each state transition reflects in `.list-group-item` after `GET **/notes` |
| TC-09 | `authenticatedScenarios.cy.js` | `@auth` | Cached session | Fill `/settings` storage + name + Stripe iframe card, submit | `POST **/prod/billing` interception completes (`state: 'Complete'`) |
| TC-10 | `authenticatedScenarios.cy.js` | `@auth`, `@desktop-and-tablet` | Cached session | Click `Logout` (after opening `.navbar-toggle` on tablet) | `#email` input on `/login` becomes visible |
| TC-11 | `signup.cy.js` | `@mailosaur` | `MAILOSAUR_*` + `USER_PASSWORD` | Submit signup form, fetch 6-digit OTP email, submit code | `GET **/notes` completes and `"Your Notes"` heading is visible |
