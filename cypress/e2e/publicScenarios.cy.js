/// <reference path="../support/commands.d.ts" />

describe('Public navigation, route guards, and form validation', () => {
  it('renders the landing page with signup and login entry points', () => {
    cy.visit('/')

    cy.contains('h1', 'Scratch').should('be.visible')
    cy.contains('p', 'A simple note taking app').should('be.visible')
    cy.contains('.navbar a', 'Signup').should('have.attr', 'href', '/signup')
    cy.contains('.navbar a', 'Login').should('have.attr', 'href', '/login')
  })

  it('redirects unauthenticated visitors from protected routes to login', () => {
    cy.visit('/notes/new')
    cy.location('pathname').should('eq', '/login')
    cy.location('search').should('eq', '?redirect=/notes/new')

    cy.visit('/settings')
    cy.location('pathname').should('eq', '/login')
    cy.location('search').should('eq', '?redirect=/settings')
  })

  it('enforces required fields on the login form', () => {
    cy.visit('/login')

    cy.contains('button', 'Login').should('be.disabled')
    cy.get('#email').type('qa@example.com')
    cy.contains('button', 'Login').should('be.disabled')

    cy.get('#password').type('StrongPass123!', { log: false })
    cy.contains('button', 'Login').should('be.enabled')
  })

  it('enforces matching password confirmation on the signup form', () => {
    cy.visit('/signup')

    cy.contains('button', 'Signup').should('be.disabled')
    cy.get('#email').type('qa@example.com')
    cy.get('#password').type('StrongPass123!', { log: false })
    cy.get('#confirmPassword').type('Mismatch123!', { log: false })
    cy.contains('button', 'Signup').should('be.disabled')

    cy.get('#confirmPassword').clear()
    cy.get('#confirmPassword').type('StrongPass123!', { log: false })
    cy.contains('button', 'Signup').should('be.enabled')
  })

  it('renders the 404 fallback view for unknown routes', () => {
    cy.visit('/route-that-does-not-exist')

    cy.contains('.NotFound h3', 'Sorry, page not found').should('be.visible')
  })

  it('toggles collapsed navbar menu on narrow viewports', { tags: '@desktop-and-tablet' }, () => {
    cy.visit('/')

    if (Cypress.config('viewportWidth') < Cypress.expose('viewportWidthBreakpoint')) {
      cy.get('.navbar-toggle.collapsed').should('be.visible').click()
      cy.contains('.navbar-collapse a', 'Login').should('be.visible')
    } else {
      cy.get('.navbar-toggle').should('not.be.visible')
      cy.contains('.navbar-collapse a', 'Login').should('be.visible')
    }
  })
})
