# Impiricus Core Navigation Tests

## Application Overview

Test plan for core user navigation flows on www.impiricus.com, including homepage CTAs and main navigation paths to Products and Solutions pages.

## Test Scenarios

### 1. Homepage Navigation

**Seed:** `tests/seed.spec.js`

#### 1.1. Get Started Button - Navigate to Contact Page

**File:** `tests/homepage/get-started-button.spec.js`

**Steps:**
  1. Navigate to the Impiricus homepage at https://www.impiricus.com
    - expect: Homepage loads successfully
    - expect: Hero section with 'Get Started' button is visible
  2. Click the 'Get Started' button in the hero section
    - expect: Page navigates to the contact page (/contact-us)
    - expect: Contact page title 'Don't just engage. Deliver care.' or 'Get In Touch' is visible
  3. Verify the contact form is displayed
    - expect: Contact form is present
    - expect: Form contains fields: First name, Last name, Email, Message
    - expect: Submit button is visible

#### 1.2. Products Navigation - Click Ascend Product

**File:** `tests/products/ascend-product.spec.js`

**Steps:**
  1. Navigate to the Impiricus homepage at https://www.impiricus.com
    - expect: Homepage loads successfully
    - expect: Navigation menu is visible
  2. Click the 'Products' link in the main navigation menu
    - expect: Page navigates to the Products page
    - expect: Products page loads and content renders
  3. Locate and click the 'Ascend' product link/card
    - expect: Page navigates to the Ascend product detail page
    - expect: Ascend product page title or heading is visible

#### 1.3. Solutions Page Rendering

**File:** `tests/solutions/solutions-render.spec.js`

**Steps:**
  1. Navigate to the Impiricus homepage at https://www.impiricus.com
    - expect: Homepage loads successfully
    - expect: Navigation menu is visible
  2. Click the 'Solutions' link in the main navigation menu
    - expect: Page navigates to the Solutions page
    - expect: Page URL is https://www.impiricus.com/our-solutions/
  3. Verify solutions content is rendered on the page
    - expect: Solutions page header/title is visible
    - expect: Solution categories are displayed (Brand Teams, Sales Teams, Medical Affairs, Market Access, Market Research, Clinical Trials)
