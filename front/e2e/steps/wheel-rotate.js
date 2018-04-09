const {Given, When, Then, After, AfterAll, Before, BeforeAll} = require('cucumber');
const {expect, driver, By, until, host} = require('../../e2e.conf');

When('I click button {string}', function (butName) {
  return driver.wait(driver.findElement(By.xpath(`//*[@id='check-all']/mat-checkbox/label/div/input`)).then(el => {
    el.getAttribute('aria-checked').then(val => {
      if(val === 'true') {
       return driver.findElement(By.xpath(`//button[contains(., '${butName}')]`)).click();
      }
    });
  }));
});

Then('I expect that wheel start rotate', function () {
  return driver.wait(until.elementLocated(By.xpath(`/html/body/app-root/div/div/app-spinner/div[2]`)), 5000).then(() => {
    return driver.findElement(By.id(`wheel`)).getAttribute('style').then(style => {
      console.log('style:',style);
      return expect(style).to.not.equal('');
    })
  });
});

Then('I expect that after the rotation there will be a pop up containing an item dropped on the spinner', function () {
  return driver.wait(until.elementLocated(By.xpath(`/html/body/app-root/div/div/app-spinner/div[2]`)), 5000).isDisplayed();
});
