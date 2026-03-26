# Impiricus API Content Tests

## Application Overview

API test layer for Impiricus WordPress REST API endpoints. Tests validate public content endpoints for correct HTTP status codes, JSON structure integrity, required field presence, and sensitive data exposure prevention. This pattern demonstrates how API validation would be applied to healthcare data endpoints in regulated environments—ensuring no Protected Health Information (PHI) leaks through public endpoints.

## Test Scenarios

### 1. WordPress REST API — Pages Content

**Seed:** `tests/seed.spec.js`

#### 1.1. Endpoint returns 200 and valid JSON array

**File:** `tests/api/content-api.spec.js`

**Steps:**
  1. Make GET request to /wp-json/wp/v2/pages endpoint
    - expect: HTTP response status is 200
    - expect: Response body is valid JSON
    - expect: Response body is an array (not object or string)
    - expect: Array length is greater than zero

#### 1.2. Each page object contains required fields with correct types

**File:** `tests/api/content-api.spec.js`

**Steps:**
  1. Make GET request to /wp-json/wp/v2/pages endpoint
    - expect: HTTP response status is 200
    - expect: Response body is a non-empty array
  2. For each page object in the response array, validate the following required fields using apiHelper.validatePageObject():
    - expect: id field exists and is a number
    - expect: slug field exists and is a non-empty string
    - expect: status field exists and equals exactly 'publish'
    - expect: type field exists and equals exactly 'page'
    - expect: link field exists, is a string, and contains 'impiricus.com'
    - expect: title field exists and is an object
    - expect: title.rendered field exists and is a non-empty string
    - expect: All validation passes for every page object in the array

#### 1.3. Negative test: no sensitive fields exposed publicly

**File:** `tests/api/content-api.spec.js`

**Steps:**
  1. Make GET request to /wp-json/wp/v2/pages endpoint
    - expect: HTTP response status is 200
    - expect: Response body is a non-empty array
  2. For each page object in the response array, check for sensitive field exposure using apiHelper.checkForSensitiveFields():
    - expect: No page object contains a 'password' field
    - expect: No page object contains an 'email' field
    - expect: No page object contains a 'phone' field
    - expect: No page object contains a 'private' field
    - expect: Sensitive field check passes for every object (validates that public API does not expose sensitive data)
