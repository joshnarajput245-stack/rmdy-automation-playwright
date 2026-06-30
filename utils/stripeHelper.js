/**
 * Bypass external Stripe Connect redirect by navigating directly to the success page.
 */
export async function completeStripeStep(page) {
  await page.goto('/provider-stripe-account-success', { waitUntil: 'domcontentloaded' });
  await page.getByText('Account setup successful').waitFor({ state: 'visible', timeout: 30000 });

  const navigationPromise = page.waitForURL(/\/provider-pending-approval/, { timeout: 90000 });
  await page.getByRole('button', { name: 'Next' }).click();
  await navigationPromise;
}
