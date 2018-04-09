const chai  = require('chai');
const {By, Builder, until} = require('selenium-webdriver');
const host = 'http://localhost:4200/';

driver = new Builder().forBrowser('chrome').build();
driver.manage().window().maximize();

exports.By = By;
exports.driver = driver;
exports.until = until;
exports.expect = chai.expect;
exports.host = host;


