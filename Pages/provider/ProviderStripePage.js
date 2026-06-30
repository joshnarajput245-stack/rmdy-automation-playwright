import BasePage from '../BasePage.js';
import { completeStripeStep } from '../../utils/stripeHelper.js';

export default class ProviderStripePage extends BasePage {
  async completeMockStripeFlow() {
    await completeStripeStep(this.page);
  }
}
