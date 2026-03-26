'use strict';

const { pageRequiredFields, pageExpectedValues, sensitiveFields } = require('../data/api');

/**
 * Validates that a page object from the WP REST API contains all required fields
 * with correct types and expected values.
 *
 * @param {Object} obj   - A single page object from the API response
 * @param {number} index - Array index used in error messages
 * @returns {string[]}   - Array of error messages; empty if all validations pass
 */
function validatePageObject(obj, index) {
  const errors = [];
  const prefix = `Item ${index} (slug: "${obj.slug ?? 'unknown'}")`;

  for (const { field, type } of pageRequiredFields) {
    if (!(field in obj)) {
      errors.push(`${prefix}: missing required field "${field}"`);
    } else if (typeof obj[field] !== type) {
      errors.push(`${prefix}: "${field}" should be ${type}, got ${typeof obj[field]}`);
    }
  }

  if (obj.status !== pageExpectedValues.status) {
    errors.push(`${prefix}: status should be "${pageExpectedValues.status}", got "${obj.status}"`);
  }

  if (obj.type !== pageExpectedValues.type) {
    errors.push(`${prefix}: type should be "${pageExpectedValues.type}", got "${obj.type}"`);
  }

  if (typeof obj.link === 'string' && !obj.link.includes(pageExpectedValues.linkDomain)) {
    errors.push(`${prefix}: link should contain "${pageExpectedValues.linkDomain}", got "${obj.link}"`);
  }

  if (!obj.title?.rendered || typeof obj.title.rendered !== 'string' || !obj.title.rendered.trim()) {
    errors.push(`${prefix}: title.rendered should be a non-empty string`);
  }

  if (typeof obj.slug === 'string' && !obj.slug.trim()) {
    errors.push(`${prefix}: slug should be a non-empty string`);
  }

  return errors;
}

/**
 * Checks a page object for exposed sensitive fields.
 *
 * @param {Object} obj   - A single page object from the API response
 * @param {number} index - Array index used in error messages
 * @returns {string[]}   - Array of issue messages; empty if no sensitive fields found
 */
function checkForSensitiveFields(obj, index) {
  const prefix = `Item ${index} (slug: "${obj.slug ?? 'unknown'}")`;
  const exposed = sensitiveFields.filter(
    (field) => field in obj && obj[field] !== null && obj[field] !== undefined,
  );

  if (exposed.length === 0) return [];
  return [`${prefix}: exposes sensitive field(s): ${exposed.join(', ')}`];
}

module.exports = { validatePageObject, checkForSensitiveFields };
