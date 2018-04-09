@statistics
Feature: Show statistics
  Background:
    Given I open spinner page
    And I click check all

  @toggle
  Scenario: Toggle spinner/statistics button
    When I toggle button
    Then I expect that statistics page will show

  Scenario: Change statistics view
    Given I toggle button
    When I select "line"
    Then I expect thaw statistics view change
