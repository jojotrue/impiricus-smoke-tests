'use strict';

const { test, expect } = require('../../fixtures/index');

test.describe('Products Navigation', () => {
  test('Products Navigation - Click Ascend Product', async ({ homePage, productsPage }) => {
    // Navigate to the Impiricus homepage
    await homePage.navigate('/');

    // Click the 'Products' link in the main navigation menu
    await homePage.clickProducts();

    // Verify page navigates to the Products page
    await expect(productsPage.ourProductsHeading).toBeVisible();

    // Locate and click the 'Ascend' product link
    await productsPage.clickAscend();

    // Verify the URL hash updated to #ascend, confirming the anchor link fired
    await productsPage.verifyAscendSelected();
  });
});
