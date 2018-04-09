const {When, Then} = require('cucumber');
const {driver, By} = require('../../e2e.conf');

When('I click on {string} delete button', async function (name) {
  this.name = name;
  return driver.findElements(By.className(`spinner-list-name`)).then(values => {
    this.spinnersAmount = values.length;
    return driver.findElement(By.xpath(`//*[@id="cont"]/div/div/div[contains(., '${name}')]/button[2]`)).click();
  });
});

Then('I expect that this spinner will be removed', async function () {
  return driver.wait(() => {
    return driver.findElements(By.className('spinner-list-name')).then(values => {
        return values.length < this.spinnersAmount;
    });
  });
});
