const COOKIE_CONSENT_KEY = 'COOKIE_CONSENT_STATUS';
const COOKIE_PREFS_KEY = 'COOKIE_CONSENT_PREFERENCES';

/**
 * Pre-seed localStorage so the cookie banner does not block interactions.
 */
export async function dismissCookieConsent(page) {
  await page.addInitScript(
    ({ statusKey, prefsKey }) => {
      localStorage.setItem(statusKey, 'declined');
      localStorage.setItem(
        prefsKey,
        JSON.stringify({
          necessary: true,
          analytics: false,
          marketing: false,
          preferences: false,
        }),
      );
    },
    { statusKey: COOKIE_CONSENT_KEY, prefsKey: COOKIE_PREFS_KEY },
  );
}

/**
 * Click through the cookie dialog if it is still visible.
 */
export async function acceptCookiesIfVisible(page) {
  const declineButton = page.getByRole('button', { name: 'Decline' });
  if (await declineButton.isVisible().catch(() => false)) {
    await declineButton.click();
  }
}
