import BasePage from './BasePage.js';

export default class SignupPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('paragraph').filter({ hasText: /^Create Account$/ });
    this.mobileInput = page.getByPlaceholder('Enter Mobile Number');
    this.emailInput = page.getByPlaceholder('Enter Email Address');
    this.passwordInput = page.getByPlaceholder('Create Password');
    this.termsCheckbox = page.getByRole('checkbox');
    this.submitButton = page.getByRole('button', { name: 'Create Account' });
    this.toggleEmailSignup = page.getByText('Create Using Email Address');
    this.toggleMobileSignup = page.getByText('Create Using Mobile Number');
  }

  async open(role = 'patient') {
    const path = role === 'provider' ? '/signup/provider' : '/signup';
    await this.goto(path);
    await this.heading.waitFor({ state: 'visible', timeout: 30000 });
  }

  async switchToEmailSignup() {
    await this.toggleEmailSignup.click();
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async switchToMobileSignup() {
    await this.toggleMobileSignup.click();
    await this.mobileInput.waitFor({ state: 'visible' });
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async signupWithMobile(mobile) {
    await this.mobileInput.fill(mobile);
    await this.acceptTerms();
    const navigationPromise = this.waitForNavigation(/\/otp-verification/);
    await this.submitButton.click();
    await navigationPromise;
  }

  async signupWithEmail({ email, password }) {
    await this.switchToEmailSignup();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.acceptTerms();
    const navigationPromise = this.waitForNavigation(/\/otp-verification/);
    await this.submitButton.click();
    await navigationPromise;
  }

  async submitWithoutTerms() {
    await this.submitButton.click();
  }
}
