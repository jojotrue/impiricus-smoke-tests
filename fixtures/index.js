'use strict';

const { test: base, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { ContactPage } = require('../pages/ContactPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { SolutionsPage } = require('../pages/SolutionsPage');
const { ContentApiClient } = require('../api/ContentApiClient');

/**
 * Extend base test with page-object and API client fixtures
 */
const test = base.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  solutionsPage: async ({ page }, use) => {
    await use(new SolutionsPage(page));
  },
  contentApi: async ({ request }, use) => {
    await use(new ContentApiClient(request));
  },
});

module.exports = { test, expect };
