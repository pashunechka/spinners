exports.config = {
  directConnect: true,
  baseURL: 'http://localhost:4200/',

  capabilities: {
    browserName:'chrome'
  },

  framework: 'custom',

  frameworkPath: require.resolve('protractor-cucumber-framework'),

  specs: [
    './e2e/feature/*.feature'
  ],

  cucumberOpts: {
    require: ['./e2e/steps/*.js'],
    tags: [],
    strict: true,
    format: [],
    'dry-run': false,
    compiler: []
  },

  onPrepare: function () {
    browser.manage().window().maximize();
    browser.baseUrl = 'http://localhost:4200/';
  }
};
