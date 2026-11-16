/// <reference path="../support/commands.d.ts" />
import { faker } from '@faker-js/faker'

describe('Scenarios where authentication is a pre-requirement', { tags: '@auth' }, () => {
  beforeEach(() => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.login()
  })

  it('CRUDs a note', () => {
    const noteDescription = faker.lorem.words(4)

    cy.createNote(noteDescription)
    cy.wait('@getNotes')

    const updatedNoteDescription = faker.lorem.words(4)
    const attachFile = true

    cy.editNote(noteDescription, updatedNoteDescription, attachFile)
    cy.wait('@getNotes')

    cy.deleteNote(updatedNoteDescription)
    cy.wait('@getNotes')
  })

  it('successfully submits the billing settings form', () => {
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')

    cy.fillSettingsFormAndSubmit()

    cy.wait('@getNotes')
    cy.wait('@paymentRequest').then((interception) => {
      expect(interception.state).to.equal('Complete')
    })
  })

  it('logs out', { tags: '@desktop-and-tablet' }, () => {
    cy.visit('/')
    cy.wait('@getNotes')

    if (Cypress.config('viewportWidth') < Cypress.expose('viewportWidthBreakpoint')) {
      cy.get('.navbar-toggle.collapsed')
        .should('be.visible')
        .click()
    }

    cy.contains('.nav a', 'Logout').click()
    cy.get('#email').should('be.visible')
  })
})
