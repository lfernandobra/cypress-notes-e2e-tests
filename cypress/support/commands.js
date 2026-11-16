const attachFixtureFile = () => {
  cy.get('#file').selectFile('cypress/fixtures/example.json')
}

function submitLoginForm(email, password) {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.contains('button', 'Login').click()
  cy.contains('h1', 'Your Notes').should('be.visible')
}

Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false })
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
})

Cypress.Commands.add('login', (username, password, { cacheSession = true } = {}) => {
  const performLogin = (email, secret) => {
    if (cacheSession) {
      cy.session([email, secret], () => submitLoginForm(email, secret))
    } else {
      submitLoginForm(email, secret)
    }
  }

  if (username && password) {
    performLogin(username, password)
    return
  }

  cy.env(['USER_EMAIL', 'USER_PASSWORD']).then(({ USER_EMAIL, USER_PASSWORD }) => {
    if (!USER_EMAIL || !USER_PASSWORD) {
      throw new Error(
        'USER_EMAIL and USER_PASSWORD must be configured via CYPRESS_USER_EMAIL / CYPRESS_USER_PASSWORD or cypress.env.json'
      )
    }
    performLogin(USER_EMAIL, USER_PASSWORD)
  })
})

Cypress.Commands.add('createNote', (note, attachFile = false) => {
  cy.visit('/notes/new')
  cy.get('#content').type(note)

  if (attachFile) {
    attachFixtureFile()
  }

  cy.contains('button', 'Create').click()
  cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (note, newValue, attachFile = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')

  cy.contains('.list-group-item', note).click()
  cy.wait('@getNote')

  cy.get('#content').clear()
  cy.get('#content').type(newValue)

  if (attachFile) {
    attachFixtureFile()
  }

  cy.contains('button', 'Save').click()

  cy.contains('.list-group-item', note).should('not.exist')
  cy.contains('.list-group-item', newValue).should('be.visible')
})

Cypress.Commands.add('deleteNote', (note) => {
  cy.contains('.list-group-item', note).click()
  cy.contains('button', 'Delete').click()

  cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})
