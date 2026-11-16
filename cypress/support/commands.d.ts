/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * **Logs into the Scratch Notes App with optional `cy.session` caching.**
     *
     * @param username string - The email of the user to sign in with
     * @param password string - The password of the user to sign in with
     * @param options object - Options object supporting `{ cacheSession?: boolean }` (default `true`)
     *
     * @example cy.login() // Uses USER_EMAIL and USER_PASSWORD from cy.env() and caches session
     * @example cy.login('user@email.com', 'S3cRe7P@ssW0rd') // Logs in with explicit credentials and caches session
     * @example cy.env(['USER_EMAIL', 'USER_PASSWORD']).then(({ USER_EMAIL, USER_PASSWORD }) => cy.login(USER_EMAIL, USER_PASSWORD, { cacheSession: false }))
     */
    login(username?: string, password?: string, options?: { cacheSession?: boolean }): Cypress.Chainable<any> | void

    /**
     * **Creates a new note with optional `example.json` fixture attachment.**
     *
     * @param note string - Note body content
     * @param attachFile boolean - Whether to attach `cypress/fixtures/example.json` (default `false`)
     */
    createNote(note: string, attachFile?: boolean): Cypress.Chainable<any> | void

    /**
     * **Edits an existing note and optionally updates its attachment.**
     *
     * @param note string - Existing note text to select
     * @param newValue string - Updated note text
     * @param attachFile boolean - Whether to attach `cypress/fixtures/example.json` (default `false`)
     */
    editNote(note: string, newValue: string, attachFile?: boolean): Cypress.Chainable<any> | void

    /**
     * **Deletes an existing note.**
     *
     * @param note string - Existing note text to delete
     */
    deleteNote(note: string): Cypress.Chainable<any> | void

    /**
     * **Fills out the Stripe billing settings form and submits it.**
     */
    fillSettingsFormAndSubmit(): Cypress.Chainable<any> | void

    /**
     * **Fills out the signup form and submits it with the provided credentials.**
     *
     * @param email string - Unregistered email address
     * @param password string - Password meeting Cognito requirements
     */
    fillSignupFormAndSubmit(email: string, password: string): Cypress.Chainable<any> | void
  }
}
