'use strict';

const { expect } = require('@playwright/test');
const { HomePage } = require('./HomePage');

class ProductsPage extends HomePage {
  constructor(page) {
    super(page);

    // Products page locators
    this.ourProductsHeading = page.getByRole('heading', { name: /Our Products/ });
    this.pulseLink = page.getByRole('link', { name: 'Pulse' });
    this.sparkLink = page.getByRole('link', { name: 'Spark' });
    this.ascendLink = page.getByRole('link', { name: 'Ascend' });
  }

  async clickAscend() {
    await this.ascendLink.click();
  }

  async verifyAscendSelected() {
    await expect(this.page).toHaveURL(/#ascend/);
  }
}

module.exports = { ProductsPage };
