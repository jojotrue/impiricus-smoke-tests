'use strict';

const { test, expect } = require('../../fixtures/index');

test.describe('Solutions Navigation', () => {
  test('Solutions Page Rendering', async ({ homePage, solutionsPage }) => {
    // Navigate to the Impiricus homepage
    await homePage.navigate('/');

    // Click the 'Solutions' link in the main navigation menu
    await homePage.clickSolutions();

    // Wait for the Solutions page to load and heading to be visible
    await expect(solutionsPage.ourSolutionsHeading).toBeVisible({ timeout: 10000 });

    // Verify solution categories are displayed
    await expect(solutionsPage.brandTeamsLink).toBeVisible();
    await expect(solutionsPage.salesTeamsLink).toBeVisible();
    await expect(solutionsPage.medicalAffairsLink).toBeVisible();
    await expect(solutionsPage.marketAccessLink).toBeVisible();
    await expect(solutionsPage.marketResearchLink).toBeVisible();
    await expect(solutionsPage.clinicalTrialsLink).toBeVisible();
  });
});
