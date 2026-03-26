'use strict';

const endpoints = {
  pages: '/wp-json/wp/v2/pages',
};

const pageRequiredFields = [
  { field: 'id',     type: 'number' },
  { field: 'slug',   type: 'string' },
  { field: 'status', type: 'string' },
  { field: 'type',   type: 'string' },
  { field: 'link',   type: 'string' },
  { field: 'title',  type: 'object' },
];

const pageExpectedValues = {
  status:    'publish',
  type:      'page',
  linkDomain: 'impiricus.com',
};

const sensitiveFields = ['password', 'email', 'phone', 'private'];

module.exports = { endpoints, pageRequiredFields, pageExpectedValues, sensitiveFields };
