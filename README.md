# Impiricus Smoke Tests

Comprehensive Playwright smoke test suite for [impiricus.com](https://www.impiricus.com) — an AI-powered HCP engagement platform.

## Overview

This project provides enterprise-grade automated testing using **Playwright** with a **Page Object Model (POM)** architecture. Tests verify critical user navigation flows and feature functionality across the Impiricus web application.

## Tech Stack

- **Framework:** [Playwright](https://playwright.dev)
- **Language:** JavaScript (CommonJS, Node.js)
- **Module Format:** CommonJS (`require`/`module.exports`)
- **Browser:** Chromium
- **Architecture:** Page Object Model (POM)

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
│   ├── agents/                           # AI agent configuration
│   └── workflows/
│       ├── copilot-setup-steps.yml      # GitHub Copilot setup
│       └── playwright.yml                # CI/CD pipeline for automated tests
├── .vscode/
│   └── mcp.json                          # VS Code settings & extensions
├── pages/                                # Page Object Model (POM) classes
│   ├── HomePage.js                      # Homepage interactions & navigation
│   ├── ContactPage.js                   # Contact form page object
│   ├── ProductsPage.js                  # Products page object
│   └── SolutionsPage.js                 # Solutions page object
├── tests/                                # Test specifications
│   ├── seed.spec.js                     # Seed test (homepage load verification)
│   ├── homepage/
│   │   └── get-started-button.spec.js   # Test: Get Started button navigation
│   ├── products/
│   │   └── ascend-product.spec.js       # Test: Products page & Ascend product
│   └── solutions/
│       └── solutions-render.spec.js     # Test: Solutions page rendering
├── fixtures/                            # Playwright test fixtures
│   └── index.js                         # POM fixture extensions
├── specs/                               # Test plans & documentation
│   └── impiricus-navigation.plan.md    # Test plan for navigation flows
├── .gitignore                           # Git ignore patterns
├── CLAUDE.md                            # Development guidelines & conventions
├── README.md                            # This file
├── playwright.config.js                 # Playwright configuration
├── package.json                         # npm dependencies & scripts
└── package-lock.json                    # Locked dependency versions

Artifacts (generated, not committed):
├── test-results/                        # Test execution results
└── playwright-report/                   # HTML test report
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

## Contributing

### Adding a New Feature Test

1. **Plan the test** — Document scenarios in a new markdown file under `specs/`
2. **Create page objects** — Define new POM classes in `pages/` for any new pages
3. **Create test files** — Add test specs in `tests/{feature-name}/`
4. **Add fixtures** — Register new POMs in `fixtures/index.js`
5. **Test locally** — Run tests with `npx playwright test --headed`
6. **Follow conventions** — Adhere to CLAUDE.md POM and CommonJS standards

### Code Review Checklist

- [ ] All locators defined in POM classes (not inline in tests)
- [ ] Tests use fixtures to receive POMs (not `page` directly)
- [ ] CommonJS format used (`require`/`module.exports`)
- [ ] Reliable semantic locators (`getByRole()`, etc.)
- [ ] No `test.only()` left in code
- [ ] All tests pass locally before pushing
- [ ] README updated if adding new pages/features

## Resources

- [Playwright Documentation](https://playwright.dev) — Official framework docs
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) — Testing patterns
- [Impiricus Homepage](https://www.impiricus.com) — Application under test
- [CLAUDE.md](CLAUDE.md) — Project-specific guidelines & conventions
- [Test Plan](specs/impiricus-navigation.plan.md) — Navigation test scenarios

## License

© 2026 Impiricus. Internal testing suite.
