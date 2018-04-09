@wheel
Feature: Rotate wheel
  Background:
    Given I open spinner page
    And I click check all

  Scenario: Click to rotate
    When I click button "Spin"
    Then I expect that wheel start rotate
    And I expect that after the rotation there will be a pop up containing an item dropped on the spinner
