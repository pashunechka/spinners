@spinner-list
Feature: Delete Spinner
  Scenario: Delete public spinner
    When I click on "public spinner name" delete button
    Then I expect that this spinner will be removed

  Scenario: Delete private spinner
    When I click on "private spinner name" delete button
    And I expect that will shown authorization pop-up
    And I enter password as "12345"
    And  I click button Log in
    Then I expect that this spinner will be removed
