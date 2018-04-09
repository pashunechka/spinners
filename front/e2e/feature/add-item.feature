@add-item
Feature: Create spinner item
  Scenario: Item image preview
    Given I open spinner page
    When I set image
    Then I expect that image will be shown

  Scenario: Successful create item
    When I fill item name field as "selenium test"
    And I choose color
    And I set image
    And I click button Submit
    Then I expect that this item to be added to the items list
    And I expect the form to be cleared

  Scenario: Error The field shouldn't be empty
    When I don`t fill item name field
    And I click button Submit
    Then I expect that error message will be display

  Scenario: Modify item
    When I click on more settings button
    And I click "modify" button
    And I change item name field as " changed"
    And I click button Submit
    Then I expect that this item to be changed in the items list
    And I expect the form to be cleared


  Scenario: Cancel delete item
    When I click on more settings button
    And I click "delete" button
    And I click "Cancel" button on the appeared pop-up
    Then I expect that confirmation pop-up will closed
    And I expect that items list don't change

  Scenario: Delete item
    When I click on more settings button
    And I click "delete" button
    And I click "Delete" button on the appeared pop-up
    Then I expect that confirmation pop-up will closed
    And I expect that this item will be removed from item list
