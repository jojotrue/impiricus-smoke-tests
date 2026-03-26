// spec: specs/impiricus-api.plan.md
// seed: tests/seed.spec.js

'use strict';

const { test, expect } = require('../../fixtures/index');
const { validatePageObject, checkForSensitiveFields } = require('../../api/apiHelper');

test.describe('Impiricus API Content Tests', () => {
  test('Endpoint returns 200 and valid JSON array', async ({ contentApi }) => {
    const { status, body } = await contentApi.getPages();

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('Each page object contains required fields with correct types', async ({ contentApi }) => {
    const { status, body } = await contentApi.getPages();

    expect(status).toBe(200);
    expect(body.length).toBeGreaterThan(0);

    const errors = body.flatMap((obj, i) => validatePageObject(obj, i));
    expect(errors, errors.join('\n')).toHaveLength(0);
  });

  test('Negative test: no sensitive fields exposed', async ({ contentApi }) => {
    const { status, body } = await contentApi.getPages();

    expect(status).toBe(200);
    expect(body.length).toBeGreaterThan(0);

    const issues = body.flatMap((obj, i) => checkForSensitiveFields(obj, i));
    expect(issues, issues.join('\n')).toHaveLength(0);
  });
});
