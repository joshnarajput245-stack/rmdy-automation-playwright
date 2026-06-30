import { dismissCookieConsent } from '../utils/cookieHelper.js';

export default class BasePage {
  constructor(page) {
    this.page = page;
  }

  async preparePage() {
    await dismissCookieConsent(this.page);
  }

  async goto(path = '/') {
    await this.preparePage();
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForBackendResponse(pathFragment) {
    const fragment = pathFragment.replace(/^\/backend/, '');
    return this.page.waitForResponse(
      (response) =>
        response.request().method() !== 'OPTIONS' && response.url().includes(fragment),
      { timeout: 60000 },
    );
  }

  async waitForNavigation(urlPattern, timeout = 90000) {
    return this.page.waitForURL(urlPattern, { timeout });
  }
}
