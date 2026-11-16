/// <reference path="../support/commands.d.ts" />
import { faker } from '@faker-js/faker'

describe('User signup with email OTP verification', { tags: '@mailosaur' }, () => {
  it('successfully signs up using confirmation code sent via email', () => {
    cy.env(['MAILOSAUR_SERVER_ID', 'USER_PASSWORD']).then(({ MAILOSAUR_SERVER_ID, USER_PASSWORD }) => {
      if (!MAILOSAUR_SERVER_ID || !USER_PASSWORD) {
        throw new Error(
          'MAILOSAUR_SERVER_ID and USER_PASSWORD must be configured to run signup OTP verification'
        )
      }

      const emailAddress = `${faker.string.uuid()}@${MAILOSAUR_SERVER_ID}.mailosaur.net`
      cy.intercept('GET', '**/notes').as('getNotes')

      cy.fillSignupFormAndSubmit(emailAddress, USER_PASSWORD)

      cy.mailosaurGetMessage(MAILOSAUR_SERVER_ID, {
        sentTo: emailAddress,
      }).then((message) => {
        const confirmationCode = message.html.body.match(/\d{6}/)[0]
        cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)

        cy.wait('@getNotes')
        cy.contains('h1', 'Your Notes').should('be.visible')
      })
    })
  })
})
