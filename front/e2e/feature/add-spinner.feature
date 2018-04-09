@spinner-list
Feature: Add spinner

  Scenario Outline: Successful create  public spinner
    Given I on the home page
    When I enter <name> in name field
    And I click on the button Add a spinner
    Then I expect that a spinner will appears in spinner list with name <name>
    And I expect that I will navigate to this spinner page
    And I expect the spinner's style will changed in the spinners list
  Examples:
  |                name   |
  | 'public spinner name' |


  Scenario: Failure create  public spinner
    When I click on the button Add a spinner
    Then I expect that the name field error message will shown


  Scenario Outline: Successful create private spinner
   Given I on the home page
    When I enter <name> in name field
    And I check Set password checkbox
    And I fill the password field <password>
    And I click on the button Add a spinner
    Then I expect that a spinner will appears in spinner list with name <name>
    And I expect that I will navigate to this spinner page
  Examples:
  |                 name   | password |
  | 'private spinner name' |  '12345' |


  Scenario: Failure create private spinner
    When I check Set password checkbox
    And I fill the password field "1234"
    And I click on the button Add a spinner
    Then I expect that the name field error message will shown
    And I expect that the password field error message will shown
