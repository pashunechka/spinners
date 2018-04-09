const {Given, When, Then, After, AfterAll, Before, BeforeAll} = require('cucumber');
const {expect, driver, By, until, host} = require('../../e2e.conf');

When('I toggle button', function () {
  return driver.findElement(By.tagName(`mat-slide-toggle`)).click();
});

Then('I expect that statistics page will shown', function () {
  return driver.wait(until.elementTextContains(
    driver.findElement(By.xpath(`/html/body/app-root/div/div/app-spinner/div/div[1]/mat-card/app-statistics/div/p`)), 'Statistics'
  ), 5000);
});

When('I select {string}', function (string) {
  return driver.wait(until.elementLocated(By.xpath(`/html/body/app-root/div/div/app-spinner/div/div[1]/mat-card/app-statistics`)), 5000).then(() => {
    return driver.findElement(
      By.xpath(`/html/body/app-root/div/div/app-spinner/div/div[1]/mat-card/app-statistics/div/p/span/mat-form-field/div/div[1]`)).click().then(() => {
        return driver.wait(until.elementLocated(By.xpath(`//*[@id="cdk-overlay-0"]/div/div[contains(., '${string}')]`))).click();
    });
  });
});

Then('I expect that statistics view will changed', function () {
  return driver.findElement(By.xpath(`//*[@id="mat-option-1"]/span`)).getText().then(t => {
    return expect(t).to.equal('line');
  });
});

After({tags: '@toggle'}, function () {
  return driver.findElement(By.tagName(`mat-slide-toggle`)).click();
});
