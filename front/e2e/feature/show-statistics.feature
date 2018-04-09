@statistics
Feature: Show statistics
  Background:
    Given I open spinner page
    And I click check all

  @toggle
  Scenario: Toggle spinner/statistics button
    When I toggle button
    Then I expect that statistics page will shown

  Scenario: Change statistics view
    Given I toggle button
    When I select "line"
    Then I expect that statistics view will changed
