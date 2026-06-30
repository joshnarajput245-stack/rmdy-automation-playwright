import BasePage from './BasePage.js';

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Log in', { exact: true });
    this.mobileInput = page.getByPlaceholder('Enter Mobile Number*');
    this.emailInput = page.getByPlaceholder('Enter Email Address*');
    this.passwordInput = page.getByPlaceholder('Enter Password*');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.toggleEmailLogin = page.getByText('Login with Email Address');
    this.toggleMobileLogin = page.getByText('Login with Mobile Number');
    this.forgotPasswordLink = page.getByText('Forgot Password ?');
    this.patientSignupLink = page.getByRole('link', { name: 'Signup for patient' });
    this.providerSignupLink = page.getByRole('link', { name: 'Signup for Provider' });
    this.guestLoginButton = page.getByRole('button', { name: 'Patient Guest' });
  }

  async open() {
    await this.goto('/login');
    await this.heading.waitFor({ state: 'visible', timeout: 30000 });
  }

  async switchToEmailLogin() {
    await this.toggleEmailLogin.click();
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async switchToMobileLogin() {
    await this.toggleMobileLogin.click();
    await this.mobileInput.waitFor({ state: 'visible' });
  }

  async loginWithEmail({ email, password }) {
    await this.switchToEmailLogin();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    const responsePromise = this.waitForBackendResponse('/backend/auth/login/email-password');
    await this.loginButton.click();
    await responsePromise;
  }

  async requestMobileOtp(mobile) {
    await this.mobileInput.fill(mobile);
    const navigationPromise = this.waitForNavigation(/\/login-otp-verification/);
    await this.loginButton.click();
    await navigationPromise;
  }

  async loginAsGuest() {
    const responsePromise = this.waitForBackendResponse('/backend/auth/guest');
    await this.guestLoginButton.click();
    await responsePromise;
  }

  async goToForgotPassword() {
    await this.switchToEmailLogin();
    await this.forgotPasswordLink.click();
  }

  async goToPatientSignup() {
    await this.patientSignupLink.click();
  }

  async goToProviderSignup() {
    await this.providerSignupLink.click();
  }
}
