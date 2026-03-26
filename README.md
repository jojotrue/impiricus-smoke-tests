# Impiricus Smoke Tests

Comprehensive Playwright smoke test suite for [impiricus.com](https://www.impiricus.com) — an AI-powered HCP engagement platform.

## Overview

This project provides enterprise-grade automated testing using **Playwright** with a **Page Object Model (POM)** architecture. Tests verify critical user navigation flows and feature functionality across the Impiricus web application.

## Tech Stack

- **Framework:** [Playwright](https://playwright.dev)
- **Language:** JavaScript (CommonJS, Node.js)
- **Module Format:** CommonJS (`require`/`module.exports`)
- **Browser:** Chromium
- **Architecture:** Page Object Model (POM) + API client layer

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm ci

# Install Playwright browsers (required before first run)
npx playwright install --with-deps
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run a single test file
npx playwright test tests/homepage/get-started-button.spec.js

# Run tests by name pattern
npx playwright test --grep "Get Started"

# Open Playwright UI mode (interactive test runner)
npx playwright test --ui

# View HTML report after test run
npx playwright show-report
```

## Project Structure

```
impiricus-smoke-tests/
├── .github/
│   ├── agents/                                    # AI agent configuration
│   │   ├── playwright-test-generator.agent.md    # Agent: generates new Playwright tests
│   │   ├── playwright-test-healer.agent.md       # Agent: repairs failing tests
│   │   └── playwright-test-planner.agent.md      # Agent: plans test scenarios
│   └── workflows/
│       ├── copilot-setup-steps.yml               # GitHub Copilot setup
│       └── playwright.yml                         # CI/CD pipeline for automated tests
├── .vscode/
│   └── mcp.json                                   # VS Code MCP settings
├── api/                                           # API clients and REST wrappers
│   ├── ContentApiClient.js                       # WP REST API client (pages endpoint)
│   └── apiHelper.js                              # Validation helpers: field checks, exposure checks
├── data/                                          # Test data: endpoints, field definitions, payloads
│   └── api.js                                    # API endpoint paths, required fields, sensitive fields
├── fixtures/                                      # Playwright test fixtures
│   └── index.js                                  # POM and API client fixture extensions
├── pages/                                         # Page Object Model (POM) classes
│   ├── ContactPage.js                            # Contact form page object
│   ├── HomePage.js                               # Homepage interactions & navigation
│   ├── ProductsPage.js                           # Products page object
│   └── SolutionsPage.js                          # Solutions page object
├── specs/                                         # Test plans & documentation
│   ├── impiricus-api.plan.md                     # API test plan: content validation
│   └── impiricus-navigation.plan.md              # UI test plan: navigation flows
├── tests/                                         # Test specifications
│   ├── api/
│   │   └── content-api.spec.js                   # Tests: WP REST API /pages endpoint
│   ├── homepage/
│   │   └── get-started-button.spec.js            # Test: Get Started button navigation
│   ├── products/
│   │   └── ascend-product.spec.js                # Test: Products page & Ascend product
│   ├── solutions/
│   │   └── solutions-render.spec.js              # Test: Solutions page rendering
│   └── seed.spec.js                              # Seed test: homepage load verification
├── .gitignore                                     # Git ignore patterns
├── CLAUDE.md                                      # Development guidelines & conventions
├── README.md                                      # This file
├── package-lock.json                              # Locked dependency versions
├── package.json                                   # npm dependencies & scripts
└── playwright.config.js                           # Playwright configuration

Artifacts (generated, not committed):
├── test-results/                                  # Test execution results
└── playwright-report/                             # HTML test report
```

## Test Scenarios

### 0. Seed — Homepage Load
- **File:** `tests/seed.spec.js`
- **Test Name:** `navigate to impiricus.com`
- **Description:** Sanity check that the homepage loads and the hero heading is visible. Runs first to confirm the site is reachable before other tests execute.
- **Coverage:** Page navigation, hero section render

### 1. Get Started Button Navigation
- **File:** `tests/homepage/get-started-button.spec.js`
- **Test Name:** `Get Started Button - Navigate to Contact Page`
- **Description:** Validates that clicking "Get Started" on the homepage navigates to the contact page with a fully rendered form.
- **Coverage:** Button click, page navigation, form field visibility, form inputs

### 2. Products Navigation - Ascend Product
- **File:** `tests/products/ascend-product.spec.js`
- **Test Name:** `Products Navigation - Click Ascend Product`
- **Description:** Tests Products page navigation and Ascend product selection via anchor link.
- **Coverage:** Navigation menu, product page load, product link selection

### 3. Solutions Page Rendering
- **File:** `tests/solutions/solutions-render.spec.js`
- **Test Name:** `Solutions Page Rendering`
- **Description:** Verifies Solutions page loads and displays all solution categories.
- **Coverage:** Solutions page navigation, category rendering, all 6 solution types visible

### 4. WordPress REST API — Pages Content
- **File:** `tests/api/content-api.spec.js`
- **Plan:** `specs/impiricus-api.plan.md`

#### 4.1 Endpoint returns 200 and valid JSON array
- **Description:** Confirms the `/wp-json/wp/v2/pages` endpoint is reachable, returns HTTP 200, and responds with a non-empty JSON array.
- **Coverage:** Status code, response shape, array length

#### 4.2 Each page object contains required fields with correct types
- **Description:** Iterates every page object in the response and validates required field presence, correct types, expected values (`status: publish`, `type: page`), and that `link` contains the expected domain.
- **Coverage:** Field presence, type assertions, value constraints, `title.rendered` non-empty

#### 4.3 Negative test — no sensitive fields exposed
- **Description:** Confirms that no page object in the public API response exposes sensitive fields (`password`, `email`, `phone`, `private`). Demonstrates PHI-exposure prevention validation applicable to healthcare data environments.
- **Coverage:** Sensitive field scan across all response objects

## Architecture & Best Practices

### Page Object Model (POM)

All locators are defined as class properties in POM files — never inline in tests. Each POM class extends HomePage or another POM base class, providing encapsulation of UI interactions:

```javascript
// Pages → class properties
class HomePage {
  constructor(page) {
    this.page = page;
    this.banner = page.getByRole('banner');
    this.getStartedBtn = page.getByRole('link', { name: 'Get Started' }).first();
    this.heroHeading = page.getByRole('heading', { name: /AI-Powered HCP Engagement Engine/ });
  }
  async navigate(path = '') {
    await this.page.goto(path);
  }
  async clickGetStarted() {
    await this.getStartedBtn.click();
  }
}

// Tests → use POMs via fixtures, never instantiate directly
test('test name', async ({ homePage }) => {
  await homePage.navigate('/');
  await homePage.clickGetStarted();
});
```

### Fixtures

POMs are injected via Playwright fixtures for clean test setup:

```javascript
// fixtures/index.js
const test = base.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});
```

### API Client Layer

API tests use Playwright's `APIRequestContext` (`request` fixture) — server-side HTTP that respects `baseURL` without launching a browser. Each endpoint is wrapped in a client class in `api/`, validation logic lives in `api/apiHelper.js`, and all test data (endpoint paths, field lists) is centralized in `data/api.js`:

```javascript
// api/ContentApiClient.js — wraps the endpoint call
async getPages() {
  const response = await this.request.get(endpoints.pages);
  return { status: response.status(), body: await response.json() };
}

// tests/api/content-api.spec.js — clean, declarative test body
test('Each page object contains required fields', async ({ contentApi }) => {
  const { status, body } = await contentApi.getPages();
  const errors = body.flatMap((obj, i) => validatePageObject(obj, i));
  expect(errors, errors.join('\n')).toHaveLength(0);
});
```

### Reliable Locators

- Use semantic locators: `getByRole()`, `getByLabel()`, `getByText()`
- Scope to specific regions: `getByRole('banner').getByRole('link')`
- Avoid fragile selectors: no CSS/XPath unless necessary

## CI/CD

Tests run automatically in CI with the following behavior (configured in `.github/workflows/playwright.yml`):

- **Retries:** 2 retries on CI, 0 locally
- **Workers:** Sequential (1 worker) on CI for stability, parallel locally for speed
- **Artifacts:** Screenshots and videos captured on failure
- **Report:** HTML test report generated and uploaded as artifact
- **Trigger:** Runs on push/PR to `main`/`master` branches

## Configuration

Edit `playwright.config.js` to customize:

- `baseURL` — Application URL
- `retries` — Retry failed tests
- `workers` — Parallel execution
- `screenshot` / `video` — Capture on failure
- `reporter` — HTML report

## Development

Before committing:

1. Run tests locally in headed mode: `npx playwright test --headed`
2. Ensure no `test.only()` is left in code (CI will block the build)
3. Follow CommonJS format (no ES modules)
4. Define all locators as class properties in POMs — never inline in tests
5. Use reliable role-based locators: `getByRole()`, `getByLabel()`, `getByText()`
6. Scope navigation locators to specific regions: `getByRole('banner').getByRole('link')`

**Adding New Tests:**
1. Create a new test file in `tests/{feature}/` directory
2. Create or update POM classes in `pages/`
3. Add new POM fixture to `fixtures/index.js`
4. Document test plan in `specs/` if creating a new feature area
5. Update your local test results before pushing

See [CLAUDE.md](CLAUDE.md) for complete development guidelines and conventions.

## Troubleshooting

### Tests timing out?
- Increase timeout in individual tests: `await expect(elem).toBeVisible({ timeout: 10000 })`
- Check network connectivity to `https://www.impiricus.com`

### Locator not found?
- Run `npx playwright test --headed` to see the browser
- Use `npx playwright codegen https://www.impiricus.com` to generate reliable locators
- Scope locators to specific regions (banner, main, etc.)

### Screenshot/video not captured?
- Failures automatically capture screenshots and videos
- View in HTML report: `npx playwright show-report`

## Resources

- [Playwright Documentation](https://playwright.dev) — Official framework docs
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) — Testing patterns
- [Impiricus Homepage](https://www.impiricus.com) — Application under test
- [CLAUDE.md](CLAUDE.md) — Project-specific guidelines & conventions
- [Navigation Test Plan](specs/impiricus-navigation.plan.md) — Navigation test scenarios
- [API Test Plan](specs/impiricus-api.plan.md) — API content validation scenarios


