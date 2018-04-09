const {Given, When, Then, After, AfterAll, Before, BeforeAll} = require('cucumber');
const {expect, driver, By, until, host} = require('../../e2e.conf');

let defaultSrc;

Given('I open spinner page', function () {
  return driver.wait(until.elementLocated(By.xpath('//*[@id="cont"]/div/div/div[last()]/button[1]')), 5000).then(() => {
    return driver.findElement(By.xpath('//*[@id="cont"]/div/div/div[last()]/button[1]')).click();
  });
});

When('I fill/change item name field as {string}', function (string) {
  this.itemName = string;
  return driver.wait(until.elementLocated(By.id('title')), 5000).then(() => {
    return driver.findElement(By.id('title')).sendKeys(string);
  });
});

When('I don`t fill item name field', function () {
});

When('I choose color', function () {
  return driver.wait(until.elementLocated(By.id('color')), 5000).then(() => {
    return driver.findElement(By.name('color')).sendKeys('#5924ff');
  });
});

When('I set image', function () {
  return driver.wait(until.elementLocated(By.id('image')), 5000).then(() => {
    driver.findElement(By.id('imageCont')).getAttribute('src').then(src => defaultSrc = src);
    return driver.findElement(By.id('image')).sendKeys('/home/ITRANSITION.CORP/p.fits/WebstormProjects/spinner/front/src/assets/download.png');
  });
});

When('I click button Submit', function () {
  return driver.findElement(By.className('but-submit')).click();
});


Then('I expect that this item to be added/changed to/in the items list', function () {
  return driver.wait(
    until.elementLocated(
      By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option[contains(., '${this.itemName}')]`)), 5000);
});

Then('I expect add form to be cleared', function () {
  return driver.wait(until.elementTextIs(driver.findElement(By.id('title')), '')).then(() => {
    return driver.wait(driver.findElement(By.id('imageCont')).getAttribute('src').then(src => {
      return src === defaultSrc;
    }));
  });
});

Then('I expect that image will be shown', function () {
  return driver.findElement(By.id('imageCont')).getAttribute('src').then(src => {
    return expect(src).to.not.equal(defaultSrc);
  });
});

Then('I expect that error message will be display', function () {
  return driver.wait(until.elementLocated(By.xpath(`//*[@id='add-form-title']/div/div/div/mat-error[1]`)), 5000).then(() => {
    return driver.findElement(By.xpath(`//*[@id='add-form-title']/div/div/div/mat-error[1]`)).isDisplayed();
  });
});

When('I click on more settings button', function () {
  return driver.wait(until.elementLocated(By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option[last()]`)), 5000).then(() => {
    return driver.executeScript("document.getElementById('list-cont').scrollTo(0, document.getElementById('list-cont').scrollHeight)").then(() => {
      return driver.findElement(By.xpath(`//*[@id='list-cont']/mat-selection-list/div[last()]/button[1]`)).click();
    });
  });
});

When('I click {string} button', function (butName) {
  return driver.wait(until.elementLocated(By.xpath(`//*[@id="cdk-overlay-0"]`)), 5000).then(() => {
    return driver.executeScript(`document.getElementsByClassName('${butName}-item')[0].click()`);
  });
});

When('I click {string} button on the shown pop-up', function (butName) {
  return driver.wait(until.elementLocated(
    By.xpath(`/html/body/app-root/div/div/app-spinner/div/div[2]/app-item-list/div[3]/mat-card/mat-card-actions/button[contains(., '${butName}')]`)), 5000).click();
});

Then('I expect that confirmation pop-up closed', function () {
  return driver.wait(until.elementIsNotVisible(driver.findElement(By.className(`pop-up`))), 5000);
});

Then('I expect that this item will be removed from item list', function () {
  return driver.wait(driver.findElements(By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option/div`)).then(elements => {
    let res = true;
    elements.forEach(el => {
      el.getText().then(t => {
        if(t === 'selenium test changed') {
          res = false;
        }
      })
    });
    return res;
  }));
});

Then("I expect that items list don't change", function () {
  return driver.wait(until.elementIsNotVisible(driver.findElement(By.className(`pop-up`))), 5000).then(() => {
    return driver.findElement(By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option[contains(., 'selenium test changed')]`))
  });
});
