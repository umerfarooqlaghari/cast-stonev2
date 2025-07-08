/* eslint-disable @typescript-eslint/no-explicit-any */
// Payment Services Export
export * from './types';
export * from './stripe';
export * from './paypal';
export * from './unified';

// Import services
import { stripePaymentService } from './stripe';
import { paypalPaymentService } from './paypal';
import { unifiedPaymentService } from './unified';

// Combined payment service class
export class PaymentService {
  stripe = stripePaymentService;
  paypal = paypalPaymentService;
  unified = unifiedPaymentService;

  // Convenience methods that delegate to unified service
  async processPayment(
    paymentMethod: 'stripe' | 'paypal' | 'apple_pay' | 'affirm',
    amount: number,
    currency: string = 'USD',
    orderId: number,
    additionalData?: any
  ) {
    return this.unified.processPayment(paymentMethod, amount, currency, orderId, additionalData);
  }

  async completePayment(
    paymentMethod: 'stripe' | 'paypal' | 'apple_pay' | 'affirm',
    paymentIntentId: string,
    orderId: number
  ) {
    return this.unified.completePayment(paymentMethod, paymentIntentId, orderId);
  }

  getAvailablePaymentMethods() {
    return this.unified.getAvailablePaymentMethods();
  }

  validatePaymentAmount(amount: number, currency: string = 'USD') {
    return this.unified.validatePaymentAmount(amount, currency);
  }

  formatCurrency(amount: number, currency: string = 'USD') {
    return this.unified.formatCurrency(amount, currency);
  }

  getPaymentMethodConfig(method: string) {
    return this.unified.getPaymentMethodConfig(method);
  }

  handlePaymentError(error: any, paymentMethod: string) {
    return this.unified.handlePaymentError(error, paymentMethod);
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

// Default export
export default paymentService;
