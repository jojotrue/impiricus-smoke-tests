'use strict';

const { HomePage } = require('./HomePage');

class SolutionsPage extends HomePage {
  constructor(page) {
    super(page);
    
    // Solutions page locators
    this.ourSolutionsHeading = page.getByRole('heading', { name: /Our Solutions/ });
    this.brandTeamsLink = page.getByRole('link', { name: 'Brand Teams' }).first();
    this.salesTeamsLink = page.getByRole('link', { name: 'Sales Teams' }).first();
    this.medicalAffairsLink = page.getByRole('link', { name: 'Medical Affairs' }).first();
    this.marketAccessLink = page.getByRole('link', { name: 'Market Access' }).first();
    this.marketResearchLink = page.getByRole('link', { name: 'Market Research' }).first();
    this.clinicalTrialsLink = page.getByRole('link', { name: 'Clinical Trials' }).first();
  }


}

module.exports = { SolutionsPage };
