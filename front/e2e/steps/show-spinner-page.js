const {When, Then} = require('cucumber');
const {driver, By, until } = require('../../e2e.conf');

When('I click on spinner {string}', async function (name) {
  this.spinnerName = name;
  return driver.findElement(By.xpath(`//*[@id="cont"]/div/div/div[contains(.,'${name}')]`)).click();
});

Then('I expect that will shown authorization pop-up', async function () {
  return driver.wait(until.elementIsVisible(driver.findElement(By.id('authForm')))).then(() => {
   return driver.findElement(By.id('authForm')).isDisplayed();
  });
});

Then('I enter password as {string}', async function (password) {
    return driver.findElement(By.name('password')).sendKeys(password);
});

Then('I click button Log in', async function () {
    return driver.findElement(By.id('auth-but')).click();
});
