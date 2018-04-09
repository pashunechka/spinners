@spinner-list
Feature: Show selected spinner

  Scenario: Select public spinner
    When I click on spinner "public spinner name"
    Then I expect that I will navigate to this spinner page
    And I expect the spinner's style will changed in the spinners list

  Scenario: Select private spinner
   When I click on spinner "private spinner name"
    Then I expect that will shown authorization pop-up
    And I enter password as "12345"
    And  I click button Log in
    And I expect that I will navigate to this spinner page
    And I expect the spinner's style will changed in the spinners list
