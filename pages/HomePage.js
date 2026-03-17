'use strict';

class HomePage {
  constructor(page) {
    this.page = page;
    
    // Navigation locators - scoped to banner for reliability
    this.banner = page.getByRole('banner');
    this.solutionsLink = this.banner.getByRole('link', { name: 'Solutions' });
    this.productsLink = this.banner.getByRole('link', { name: 'Products' });
    this.companyLink = this.banner.getByRole('link', { name: 'Company' });
    this.insightsLink = this.banner.getByRole('link', { name: 'Insights' });
    this.pressLink = this.banner.getByRole('link', { name: 'Press' });
    this.contactUsBtn = this.banner.getByRole('link', { name: 'Contact Us' });
    
    // Hero section locators
    this.getStartedBtn = page.getByRole('link', { name: 'Get Started' }).first();
    this.heroHeading = page.getByRole('heading', { name: /AI-Powered HCP Engagement Engine/ });
  }

  async navigate(path = '') {
    await this.page.goto(path);
  }

  async getPageTitle() {
    return this.page.title();
  }

  async getPageUrl() {
    return this.page.url();
  }

  async clickGetStarted() {
    await this.getStartedBtn.click();
  }

  async clickProducts() {
    await this.productsLink.click();
  }

  async clickSolutions() {
    await this.solutionsLink.click();
  }

}

module.exports = { HomePage };
