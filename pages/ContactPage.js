'use strict';

const { HomePage } = require('./HomePage');

class ContactPage extends HomePage {
  constructor(page) {
    super(page);
    
    // Contact form locators
    this.getInTouchHeading = page.getByRole('heading', { name: 'Get In Touch' });
    this.firstNameInput = page.getByLabel('First name');
    this.lastNameInput = page.getByLabel('Last name');
    this.emailInput = page.getByLabel('Email');
    this.messageInput = page.getByLabel('Message');
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
  }


}

module.exports = { ContactPage };
