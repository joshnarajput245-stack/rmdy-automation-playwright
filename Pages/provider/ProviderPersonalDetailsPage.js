import { expect } from '@playwright/test';
import BasePage from '../BasePage.js';
import { uploadFileInput, TEST_AVATAR_PATH } from '../../utils/fileUploadHelper.js';
import { fillDatePicker, selectByLabel, selectFirstMultiSelectOption } from '../../utils/muiHelpers.js';
import { verifyOtpAndWait } from '../../utils/otpHelper.js';
import { scrollIntoCenter } from '../../utils/scrollHelper.js';
import { testConfig } from '../../utils/testConfig.js';

export default class ProviderPersonalDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Personal Details', { exact: true });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.password = testConfig.providerPassword;
  }

  async waitForPage() {
    await this.heading.waitFor({ state: 'visible', timeout: 60000 });
  }

  async uploadProfilePhoto(filePath = TEST_AVATAR_PATH) {
    await uploadFileInput(this.page, '#raised-button-file', filePath);
    await this.page.locator('img[src^="blob:"], img[src^="data:"]').first().waitFor({
      state: 'visible',
      timeout: 30000,
    });
  }

  async fillRequiredFields({ name, aboutMe }) {
    await this.page.getByPlaceholder('Enter Name').fill(name);
    await this.page.getByRole('textbox', { name: /About Me/i }).fill(aboutMe);
    await fillDatePicker(this.page, 'Date of Birth', '01/15/1990');
    await selectByLabel(this.page, 'Gender', 'Male');
  }

  async selectSpeciality() {
    await selectFirstMultiSelectOption(this.page, 'Speciality');
    const emailField = this.page.getByPlaceholder('Enter Email Address');
    await scrollIntoCenter(emailField);
  }

  getContactRow(placeholder) {
    const field = this.page.getByPlaceholder(placeholder);
    return this.page
      .locator('.MuiGrid-root')
      .filter({ has: field })
      .filter({ hasNot: this.page.getByRole('button', { name: 'Next' }) })
      .last();
  }

  async assertEmailVerified() {
    const emailField = this.page.getByPlaceholder('Enter Email Address');
    await scrollIntoCenter(emailField);
    await expect(emailField).toBeVisible();

    const emailContainer = this.getContactRow('Enter Email Address');
    await expect(emailContainer.getByText('Verified', { exact: true })).toBeVisible({ timeout: 30000 });
  }

  async assertMobileVerified() {
    const mobileField = this.page.getByPlaceholder('Enter Mobile Number');
    await scrollIntoCenter(mobileField);
    await expect(mobileField).toBeVisible();

    const mobileContainer = this.getContactRow('Enter Mobile Number');
    await expect(mobileContainer.getByText('Verified', { exact: true })).toBeVisible({ timeout: 30000 });
  }

  async verifyMobileIfNeeded(mobile, otp) {
    const mobileField = this.page.getByPlaceholder('Enter Mobile Number');
    await scrollIntoCenter(mobileField);
    await expect(mobileField).toBeVisible({ timeout: 30000 });

    const mobileContainer = this.getContactRow('Enter Mobile Number');
    const verifiedBadge = mobileContainer.getByText('Verified', { exact: true });

    if (await verifiedBadge.isVisible().catch(() => false)) {
      return;
    }

    await mobileField.fill(mobile);
    const verifyButton = mobileContainer.getByRole('button', { name: 'Verify' });
    await scrollIntoCenter(verifyButton);
    await verifyButton.click();
    await this.page.waitForURL(/\/otp-verification/, { timeout: 30000 });
    await verifyOtpAndWait(this.page, otp, /\/personal-details/);
    await this.waitForPage();
    await expect(verifiedBadge).toBeVisible({ timeout: 30000 });
  }

  async fillPasswordIfRequired() {
    const createPassword = this.page.getByLabel('Create Password');
    await scrollIntoCenter(createPassword).catch(() => {});
    if (!(await createPassword.isVisible().catch(() => false))) {
      return;
    }

    await createPassword.fill(this.password);
    const confirmPassword = this.page.getByRole('textbox', { name: 'Confirm Password' });
    await scrollIntoCenter(confirmPassword);
    await confirmPassword.fill(this.password);
  }

  async verifyEmailIfNeeded(email, otp) {
    const emailField = this.page.getByPlaceholder('Enter Email Address');
    await scrollIntoCenter(emailField);
    await expect(emailField).toBeVisible({ timeout: 30000 });

    const emailContainer = this.getContactRow('Enter Email Address');
    const verifiedBadge = emailContainer.getByText('Verified', { exact: true });

    if (await verifiedBadge.isVisible().catch(() => false)) {
      return;
    }

    await emailField.fill(email);
    const verifyButton = emailContainer.getByRole('button', { name: 'Verify' });
    await scrollIntoCenter(verifyButton);
    await verifyButton.click();
    await this.page.waitForURL(/\/otp-verification/, { timeout: 30000 });
    await verifyOtpAndWait(this.page, otp, /\/personal-details/);
    await this.waitForPage();
    await expect(verifiedBadge).toBeVisible({ timeout: 30000 });
    await this.fillPasswordIfRequired();
  }

  async submit() {
    await scrollIntoCenter(this.nextButton);
    await expect(this.nextButton).toBeEnabled({ timeout: 30000 });

    const navigationPromise = this.waitForNavigation(/\/provider-clinic-visit/, 120000);
    await this.nextButton.click();
    await navigationPromise;
  }

  async complete({
    name,
    aboutMe,
    email,
    mobile,
    otp,
    verifyEmail = false,
    verifyMobile = false,
  }) {
    await this.waitForPage();
    await this.uploadProfilePhoto();
    await this.fillRequiredFields({ name, aboutMe });
    await this.selectSpeciality();

    if (verifyEmail && email && otp) {
      await this.verifyEmailIfNeeded(email, otp);
      await this.assertEmailVerified();
    } else {
      await this.assertEmailVerified();
    }

    if (verifyMobile && mobile && otp) {
      await this.verifyMobileIfNeeded(mobile, otp);
      await this.assertMobileVerified();
    } else {
      await this.assertMobileVerified();
    }

    await this.fillPasswordIfRequired();
    await this.submit();
  }
}
