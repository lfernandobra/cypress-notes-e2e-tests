Feature: Authentication, Route Guards, and Signup Validation
  As a Scratch Notes user
  I want public entry points, route protection, form validation, and OTP signup to work reliably
  So that unauthorized users cannot access private data and valid users can onboard cleanly

  Scenario: Landing page renders core entry links
    Given I navigate to the home page "/"
    Then the title "Scratch" and subtitle "A simple note taking app" should be visible
    And navigation links to "/signup" and "/login" should be available

  Scenario Outline: Unauthenticated requests to protected routes redirect to login
    Given I am not authenticated
    When I visit "<protectedRoute>"
    Then I should be redirected to "/login" with query "?redirect=<protectedRoute>"

    Examples:
      | protectedRoute |
      | /notes/new     |
      | /settings      |

  Scenario: Login form enables submit only when credentials are provided
    Given I am on "/login"
    Then the "Login" submit button should be disabled
    When I type a valid email and password
    Then the "Login" submit button should become enabled

  Scenario: Signup form requires matching password confirmation
    Given I am on "/signup"
    When I enter mismatched values in "#password" and "#confirmPassword"
    Then the "Signup" submit button should remain disabled
    When I enter matching values in "#password" and "#confirmPassword"
    Then the "Signup" submit button should become enabled

  Scenario: Unknown routes render the 404 fallback page
    When I visit "/route-that-does-not-exist"
    Then the heading "Sorry, page not found" should be visible

  @desktop-and-tablet
  Scenario: Responsive navbar adapts below the 768px breakpoint
    Given I visit "/"
    When the viewport width is 767px
    Then the collapsed ".navbar-toggle" button should be visible and expand the "Login" link on click

  @auth
  Scenario: Valid user signs in without cached session
    Given valid Cognito credentials configured in Cypress secrets
    When I log in via "/login" with cacheSession set to false
    Then "GET **/notes" should complete and load "Your Notes"

  @mailosaur
  Scenario: New user completes email OTP verification via Mailosaur
    Given a unique Mailosaur inbox address and valid Mailosaur API credentials
    When I submit the signup form
    And I retrieve the 6-digit verification code from Mailosaur
    And I submit "#confirmationCode"
    Then "GET **/notes" should load "Your Notes"
