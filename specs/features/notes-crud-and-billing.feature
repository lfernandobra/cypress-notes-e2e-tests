Feature: Authenticated Note CRUD, Stripe Billing Iframe, and Session Logout
  As an authenticated Scratch user
  I want to manage notes with attachments, pay for storage via Stripe iframe, and log out safely
  So that end-to-end persistence and responsive behavior work across viewports

  Background:
    Given I am authenticated via cached cy.session()
    And network calls matching "GET **/notes" are intercepted as "@getNotes"

  @auth
  Scenario: User creates, edits with file attachment, and deletes a note
    When I create a note with generated Faker text on "/notes/new"
    And I wait for "@getNotes"
    And I edit that note and attach "cypress/fixtures/example.json" via cy.selectFile()
    And I wait for "@getNotes"
    And I delete the updated note
    Then the deleted note should no longer appear in ".list-group-item"

  @auth
  Scenario: User submits billing storage purchase inside Stripe iframe
    Given "POST **/prod/billing" is intercepted as "@paymentRequest"
    When I visit "/settings" and fill storage count, cardholder name, and Stripe card iframe fields
    And I click "Purchase"
    Then "@paymentRequest" interception state should equal "Complete"

  @auth @desktop-and-tablet
  Scenario: Authenticated user logs out on desktop and tablet viewports
    Given I visit "/" after login
    And I wait for "@getNotes"
    When I click "Logout" (opening ".navbar-toggle" first if viewportWidth < 768px)
    Then the "#email" login field should become visible
