/// <reference path="../support/commands.d.ts" />

describe('Authentication', { tags: '@auth' }, () => {
  it('successfully logs in without cached session', () => {
    cy.intercept('GET', '**/notes').as('getNotes')

    cy.env(['USER_EMAIL', 'USER_PASSWORD']).then(({ USER_EMAIL, USER_PASSWORD }) => {
      if (!USER_EMAIL || !USER_PASSWORD) {
        throw new Error(
          'USER_EMAIL and USER_PASSWORD must be configured via CYPRESS_USER_EMAIL / CYPRESS_USER_PASSWORD'
        )
      }

      cy.login(USER_EMAIL, USER_PASSWORD, { cacheSession: false })
      cy.wait('@getNotes')
    })
  })
})
