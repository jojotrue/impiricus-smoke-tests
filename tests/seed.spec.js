'use strict';

const { test, expect } = require('../fixtures/index');

test.describe('Seed', () => {
  test('navigate to impiricus.com', async ({ homePage }) => {
    await homePage.navigate('/');
    await expect(homePage.heroHeading).toBeVisible();
  });
});
