'use strict';

const { test, expect } = require('../../fixtures/index');

test.describe('Solutions Navigation', () => {
  test('Solutions Page Rendering', async ({ solutionsPage }) => {
    // Navigate directly to the Solutions page
    await solutionsPage.navigate('/our-solutions');

    // Wait for the Solutions page to load and heading to be visible
    await expect(solutionsPage.ourSolutionsHeading).toBeVisible();

    // Verify solution categories are displayed
    await expect(solutionsPage.brandTeamsLink).toBeVisible();
    await expect(solutionsPage.salesTeamsLink).toBeVisible();
    await expect(solutionsPage.medicalAffairsLink).toBeVisible();
    await expect(solutionsPage.marketAccessLink).toBeVisible();
    await expect(solutionsPage.marketResearchLink).toBeVisible();
    await expect(solutionsPage.clinicalTrialsLink).toBeVisible();
  });
});
