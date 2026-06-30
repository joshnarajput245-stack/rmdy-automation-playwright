/**
 * Fill 4-digit OTP inputs (auto-submits on completion).
 */
export async function enterOtp(page, otp) {
  const digits = otp.replace(/\D/g, '').split('');
  await page.getByText('OTP Verification', { exact: true }).waitFor({ state: 'visible', timeout: 30000 });

  const inputs = page.locator('input[maxlength="1"]');
  await inputs.first().waitFor({ state: 'visible', timeout: 30000 });
  const count = await inputs.count();

  if (count < digits.length) {
    throw new Error(`Expected at least ${digits.length} OTP inputs, found ${count}`);
  }

  for (let i = 0; i < digits.length; i += 1) {
    await inputs.nth(i).click();
    await inputs.nth(i).pressSequentially(digits[i], { delay: 50 });
  }
}

export async function verifyOtpAndWait(page, otp, urlPattern) {
  const navigationPromise = page.waitForURL(urlPattern, { timeout: 90000 });
  await enterOtp(page, otp);
  await navigationPromise;
}
