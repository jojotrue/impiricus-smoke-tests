'use strict';

const { test: base, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { ContactPage } = require('../pages/ContactPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { SolutionsPage } = require('../pages/SolutionsPage');

/**
 * Extend base test with page-object fixtures
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
});

module.exports = { test, expect };
