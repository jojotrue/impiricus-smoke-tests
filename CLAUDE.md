# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm ci

# Install Playwright browsers (required before first run)
npx playwright install --with-deps

# Run all tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run a single test file
npx playwright test tests/example.spec.js

# Run a specific test by name
npx playwright test --grep "test name here"

# Open Playwright UI mode (interactive test runner)
npx playwright test --ui

# View the HTML report after a test run
npx playwright show-report
```

## Module Format

**Always use CommonJS** (`require`/`module.exports`), never ES modules (`import`/`export`).

```js
// Correct
const { test, expect } = require('@playwright/test');

// Never use
import { test, expect } from '@playwright/test';
```

## POM and Test Structure Rules

These rules apply to every page object, test file, fixture, and command in this project:

### Locator Rules
- All locators are defined **once** as class properties or getters in the POM — never inline inside action methods.
- No `page.locator()` or hard-coded selectors inside action/assertion methods.
- Tests never define or reference selectors directly — locators live exclusively in POM files.

```js
// Correct — locator defined as class property
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByLabel('Email');
    this.submitBtn  = page.getByRole('button', { name: 'Sign In' });
  }

  async login(user) {
    await this.emailInput.fill(user.email);
    await this.submitBtn.click();
  }
}

// Never do this — selector inline in method
async login(user) {
  await this.page.getByLabel('Email').fill(user.email); // ✗
}
```

### Data Rules
- No hard-coded strings, credentials, or test values at the test level.
- All static text, users, and payloads come from `data/*.js` or `data/*.json`.
- Test files receive data through fixtures or by importing from `data/`.

### Test File Rules
- Tests import `{ test, expect }` from `fixtures/index.js`, not directly from `@playwright/test`.
- Each test receives page objects through fixtures — tests do not instantiate POM classes directly.

## Architecture

Enterprise Playwright smoke test suite targeting `https://www.impiricus.com/`.

| Folder | Purpose |
|---|---|
| `tests/` | Playwright spec files |
| `pages/` | Page Object Model classes (locators + actions) |
| `fixtures/` | Custom fixtures extending Playwright base test |
| `commands/` | Reusable low-level UI actions shared across POMs |
| `utils/` | General helpers (dates, strings, waits, logging) |
| `methods/` | Business logic and multi-step user flows |
| `api/` | API clients and REST wrappers |
| `data/` | Test users, static text, request payloads |
| `mcp/` | Prompt files and route definitions for AI tooling |

- **[playwright.config.js](playwright.config.js)** — `baseURL`, HTML reporter, retry/worker logic, Chromium project. `screenshot` and `video` retained on failure.
- **[.github/workflows/playwright.yml](.github/workflows/playwright.yml)** — CI runs on push/PR to `main`/`master`; uploads HTML report artifact (30-day retention).

### CI Behavior

`process.env.CI` controls:
- `forbidOnly: true` — build fails if `test.only` is left in code
- `retries: 2` on CI, `0` locally
- `workers: 1` on CI (sequential), unlimited locally (parallel)

## API Test Rules

These rules apply to every file in `api/`, `tests/api/`, and any fixture or data file that supports API testing.

### Request Context

- Always use Playwright's `APIRequestContext` (`request` fixture) for HTTP calls — never `page.evaluate()` with `fetch()`.
- `request` is server-side, respects `baseURL`, and returns native JS objects without browser serialization overhead.

```js
// Correct
const response = await request.get('/api/resource');
const body = await response.json();

// Never do this
const result = await page.evaluate(async () => {
  const res = await fetch('https://example.com/api/resource'); // ✗
});

API Client Layer
All endpoint calls are wrapped in a client class in api/ — never call request.get() directly inside a test.
Each client method returns a plain object with status and body so tests stay declarative.
API clients are instantiated through fixtures in fixtures/index.js, never directly in test files.

// Correct — client wraps the call
async getResource() {
  const response = await this.request.get(endpoints.resource);
  return { status: response.status(), body: await response.json() };
}
Validation Helpers
Field validation and sensitive-data checks live in api/apiHelper.js, not inline in tests.
Helper functions accept (obj, index) and return an array of error strings — empty array means pass.
Tests call helpers via flatMap and assert on the resulting array length, with the joined errors as the failure message.

// Correct
const errors = body.flatMap((obj, i) => validateObject(obj, i));
expect(errors, errors.join('\n')).toHaveLength(0);

API Test Data
All endpoint paths, required field definitions, expected values, and sensitive field lists live in data/api.js.
No hard-coded URLs, domain strings, field names, or magic values at the test or helper level.
Endpoint paths are relative strings so baseURL from playwright.config.js is always honored.

// Correct — data/api.js
const endpoints = {
  resource: '/api/resource',
};
const sensitiveFields = ['password', 'token', 'ssn'];

API Fixtures
Every API client has a corresponding fixture in fixtures/index.js using the request context.
API test files destructure the client fixture — never { page } — unless the test genuinely requires browser interaction alongside the API call.

// Correct fixture definition
myApiClient: async ({ request }, use) => {
  await use(new MyApiClient(request));
},

// Correct test signature
test('...', async ({ myApiClient }) => { ... });
