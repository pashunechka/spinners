const {Given, When, Then, AfterAll, BeforeAll} = require('cucumber');
const { expect, driver, By, until, host} = require('../../e2e.conf');

BeforeAll(async function () {
  driver.get(host);
});

Given('I on the home page', async function () {
});

When('I enter {string} in name field', async function (name) {
  return driver.findElement(By.name('spinnerName')).sendKeys(name);
});

When('I check Set password checkbox', async function () {
  return driver.findElement(By.id('checkBox')).click();
});

When('I fill the password field {string}', async function (password) {
  return driver.findElement(By.id('password-field')).sendKeys(password);
});

When('I click on the button Add a spinner', async function () {
  return driver.findElement(By.className('add-spinner')).click();
});

Then('I expect that a spinner will appears in spinner list with name {string}', async function (name) {
  this.spinnerName = name;
  return driver.findElements(By.className('spinner-list-name')).then(values => {
    return driver.wait(
      until.elementLocated(By.xpath(`//*[@id="list-spinners"]/div[position() = ${values.length + 1}]/button[1]`)), 5000).then(value => {
        return value.getText(t => {
          return expect(t).to.equal(name);
        })
    });
  });

});

Then('I expect that I will navigate to this spinner page', async function () {
  return driver.findElement(By.xpath(`//*[@id="cont"]/div/div/div[contains(., '${this.spinnerName}')]/button[1]`))
    .getAttribute('id').then(id => {
      return driver.wait(until.urlMatches(new RegExp(`${host}${id}`)), 5000);
    });
});

Then("I expect the spinner's style will changed in the spinners list", async function () {
  return driver.findElement(By.xpath(`//*[@id="cont"]/div/div/div[contains(., '${this.spinnerName}')]/button[1]`))
    .getCssValue('color').then(style => {
      return expect(style).to.equal('rgba(255, 255, 255, 1)');
    });
});

Then('I expect that the name field error message will shown', async function () {
  return driver.findElement(By.xpath('//*[@id="cont"]/div/form/mat-form-field/div/div/div/mat-error')).isDisplayed();
});

Then('I expect that the password field error message will shown', async function () {
  return driver.findElement(By.xpath('//*[@id="cont"]/div/form/span/mat-form-field/div/div/div/mat-error')).isDisplayed();
});

AfterAll(async function () {
  driver.quit();
});
