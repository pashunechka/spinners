@item-list
  Feature: Checked items
    Background:
      Given I open spinner page

    Scenario: Checked all items
      When I click check all
      Then I expect that items will "checked"
      And I expect that items will add to the wheel

    Scenario: Unchecked all items
      Given All items are checked
      When I click check all
      Then I expect that items will "unchecked"
      And I expect that items will removed from the wheel

    Scenario: Checked item
      Given I create item with name "check me"
      When I check this item
      Then I expect that item will "checked"
      And I expect that item will add to the wheel
    @uncheck
    Scenario: Unchecked item
      Given Item is checked
      When I check this item
      Then I expect that item will "uncheck"
      And I expect that item will removed from the wheel
