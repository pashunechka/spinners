const {Given, When, Then, After, AfterAll, Before, BeforeAll} = require('cucumber');
const {expect, driver, By, until, host} = require('../../e2e.conf');

let itemName;
let itemsLength;

Given('All items are checked', function () {
  return driver.wait(until.elementLocated(By.xpath(`//*[@id='list-cont']/mat-selection-list/div`)), 5000).then(() => {
    return driver.findElement(By.xpath(`//*[@id='check-all']/mat-checkbox`)).click();
  });
});

Given('Item is checked', function () {
  return driver.wait(until.elementLocated(By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option[contains(., '${itemName}')]`)), 5000).then(() => {
    return driver.executeScript("document.getElementById('list-cont').scrollTo(0, document.getElementById('list-cont').scrollHeight)").then(() => {
      return driver.findElement(
        By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option[contains(., '${itemName}')]`)).click();
    });
  });
});

Given('I create item with name {string}', function (name) {
  itemName = name;
  return driver.findElement(By.id('title')).sendKeys(name).then(() => {
    return driver.findElement(By.className('but-submit')).click();
  });
});

When('I click check all', function () {
  return driver.wait(until.elementLocated(By.xpath(`//*[@id='list-cont']/mat-selection-list/div`)), 5000).then(() => {
    return driver.findElements(By.xpath(`//*[@id='list-cont']/mat-selection-list/div`)).then(vals => {
      itemsLength = vals.length;
      return driver.findElement(By.xpath(`//*[@id='check-all']/mat-checkbox`)).click();
    });
  });
});

When('I check this item', function () {
  return driver.wait(until.elementLocated(
    By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option[contains(., '${itemName}')]`)), 5000).then(() => {
    return driver.executeScript("document.getElementById('list-cont').scrollTo(0, document.getElementById('list-cont').scrollHeight)").then(() => {
      return driver.findElement(
        By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option[contains(., '${itemName}')]`)).click();
    });
  });
});

Then('I expect that item(s) will {string}', function (status) {
  let flag = status !== 'checked';
  if(itemName) {
    return driver.findElement(
      By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option[contains(., '${itemName}')]`)).getAttribute('aria-selected').then(value => {
        return expect(value).to.equal('true');
      });
  } else {
    return driver.findElements(By.xpath(`//*[@id='list-cont']/mat-selection-list/div`)).then(values => {
      values.forEach(el => {
        let res = true;
        el.getAttribute('aria-selected').then(value => {
          if(value === flag) { res = false; }
        });
        return res;
      });
    })
  }
});

Then('I expect that item(s) will add to the wheel', function () {
  if(itemName) {
    return driver.findElement(By.xpath(`//*[@id='spinner-parts'][contains(., '${itemName}')]`));
  } else {
    return driver.findElements(By.className(`spinner-part`)).then(vals => {
      return expect(vals.length).to.equal(itemsLength);
    });
  }
});

Then('I expect that item(s) will removed from the wheel', function () {
  return driver.wait(until.elementLocated(By.xpath(`//*[@id='spinner-parts'][contains(., '')]`)), 5000).then(() => {
    return driver.findElement(By.xpath(`//*[@id='spinner-parts'][contains(., '')]`));
  });
});

After({tags: '@uncheck'}, function () {
  return driver.wait(until.elementLocated(By.xpath(`//*[@id='list-cont']/mat-selection-list/div/mat-list-option[last()]`)), 5000).then(() => {
    return driver.executeScript("document.getElementById('list-cont').scrollTo(0, document.getElementById('list-cont').scrollHeight)").then(() => {
      return driver.findElement(By.xpath(`//*[@id='list-cont']/mat-selection-list/div[last()]/button[1]`)).click().then(() => {
        return driver.wait(until.elementLocated(By.xpath(`//*[@id="cdk-overlay-0"]`)), 5000).then(() => {
          return driver.executeScript(`document.getElementsByClassName('delete-item')[0].click()`).then(() => {
            return driver.wait(until.elementLocated(
              By.xpath(`/html/body/app-root/div/div/app-spinner/div/div[2]/app-item-list/div[3]/mat-card/mat-card-actions/button[contains(., 'Delete')]`)), 5000).click();
          });
        });
      });
    });
  });
});
