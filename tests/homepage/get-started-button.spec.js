'use strict';

const { test, expect } = require('../../fixtures/index');

test.describe('Homepage Navigation', () => {
  test('Get Started Button - Navigate to Contact Page', async ({ homePage, contactPage }) => {
    // Navigate to the Impiricus homepage
    await homePage.navigate('/');

    // Click the 'Get Started' button in the hero section
    await homePage.clickGetStarted();

    // Verify contact page loads with heading visible
    await expect(contactPage.getInTouchHeading).toBeVisible();

    // Verify contact form is present with required fields
    await expect(contactPage.firstNameInput).toBeVisible();
    await expect(contactPage.lastNameInput).toBeVisible();
    await expect(contactPage.emailInput).toBeVisible();
    await expect(contactPage.messageInput).toBeVisible();

    // Verify submit button is visible
    await expect(contactPage.submitBtn).toBeVisible();
  });
});
