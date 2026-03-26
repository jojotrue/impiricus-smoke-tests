'use strict';

const { endpoints } = require('../data/api');

/**
 * Client for the Impiricus WordPress REST API content endpoints.
 * Uses Playwright's APIRequestContext so requests run server-side
 * and respect the configured baseURL.
 */
class ContentApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * Fetches all published pages from the WP REST API.
   *
   * @returns {Promise<{ status: number, body: Object[] }>}
   */
  async getPages() {
    const response = await this.request.get(endpoints.pages);
    const body = await response.json();
    return { status: response.status(), body };
  }
}

module.exports = { ContentApiClient };
