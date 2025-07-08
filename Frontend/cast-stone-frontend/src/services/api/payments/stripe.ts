/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';

// Extend the Window interface to include ApplePaySession
declare global {
  interface Window {
    ApplePaySession?: any;
  }
}
import { 
  StripePaymentRequest, 
  PaymentResponse, 
  PaymentConfirmationRequest,
  PaymentConfirmationResponse 
} from './types';

export class StripePaymentService extends BaseService {
  /**
   * Create a Stripe payment intent with specific payment method
   */
  async createPaymentIntent(data: StripePaymentRequest): Promise<PaymentResponse> {
    this.logApiCall('POST', `${ApiEndpoints.Payments}/stripe/create-intent`, data);
    
    return this.handleResponse(
      this.client.post<PaymentResponse>(`${ApiEndpoints.Payments}/stripe/create-intent`, data)
    );
  }

  /**
   * Create a legacy Stripe payment intent (backward compatibility)
   */
  async createLegacyIntent(amount: number, currency: string = 'usd'): Promise<{ clientSecret: string }> {
    this.logApiCall('POST', `${ApiEndpoints.Payments}/create-intent`, { amount, currency });
    
    return this.handleResponse(
      this.client.post<{ clientSecret: string }>(`${ApiEndpoints.Payments}/create-intent`, {
        amount,
        currency
      })
    );
  }

  /**
   * Confirm a Stripe payment
   */
  async confirmPayment(data: PaymentConfirmationRequest): Promise<PaymentConfirmationResponse> {
    this.logApiCall('POST', `${ApiEndpoints.Payments}/stripe/confirm`, data);
    
    return this.handleResponse(
      this.client.post<PaymentConfirmationResponse>(`${ApiEndpoints.Payments}/stripe/confirm`, data)
    );
  }

  /**
   * Create Affirm payment intent
   */
  async createAffirmIntent(amount: number, currency: string = 'usd', metadata?: Record<string, any>): Promise<PaymentResponse> {
    const data: StripePaymentRequest = {
      amount,
      currency,
      paymentMethodType: 'affirm',
      confirmationMethod: false,
      metadata
    };

    return this.createPaymentIntent(data);
  }

  /**
   * Create Apple Pay payment intent
   */
  async createApplePayIntent(amount: number, currency: string = 'usd', metadata?: Record<string, any>): Promise<PaymentResponse> {
    const data: StripePaymentRequest = {
      amount,
      currency,
      paymentMethodType: 'apple_pay',
      confirmationMethod: false,
      metadata
    };

    return this.createPaymentIntent(data);
  }

  /**
   * Create Apple Pay session
   */
  async createApplePaySession(domainName: string): Promise<PaymentResponse> {
    this.logApiCall('POST', `${ApiEndpoints.Payments}/apple-pay/session`, domainName);
    
    return this.handleResponse(
      this.client.post<PaymentResponse>(`${ApiEndpoints.Payments}/apple-pay/session`, domainName)
    );
  }

  /**
   * Validate Apple Pay merchant
   */
  async validateApplePayMerchant(validationURL: string, domainName: string): Promise<any> {
    // This would typically be handled by your backend
    // For now, we'll create a session through our API
    return this.createApplePaySession(domainName);
  }

  /**
   * Process Apple Pay payment
   */
  async processApplePayPayment(
    paymentData: any,
    amount: number,
    currency: string = 'usd'
  ): Promise<PaymentConfirmationResponse> {
    // Create payment intent for Apple Pay
    const intentResponse = await this.createApplePayIntent(amount, currency, {
      apple_pay_payment: paymentData
    });

    if (!intentResponse.success || !intentResponse.paymentIntentId) {
      throw new Error(intentResponse.message || 'Failed to create Apple Pay payment intent');
    }

    // Confirm the payment
    return this.confirmPayment({
      paymentIntentId: intentResponse.paymentIntentId,
      paymentMethod: 'apple_pay',
      orderId: 0 // This should be set by the calling code
    });
  }

  /**
   * Process Affirm payment
   */
  async processAffirmPayment(
    amount: number,
    currency: string = 'usd',
    orderId: number,
    metadata?: Record<string, any>
  ): Promise<PaymentResponse> {
    return this.createAffirmIntent(amount, currency, {
      ...metadata,
      order_id: orderId
    });
  }

  /**
   * Handle Stripe webhook events (if needed on frontend)
   */
  async handleWebhookEvent(event: any): Promise<void> {
    // Log the webhook event for debugging
    console.log('Stripe webhook event received:', event);
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }
  }

  /**
   * Get payment method capabilities
   */
  getPaymentMethodCapabilities(): {
    card: boolean;
    affirm: boolean;
    applePay: boolean;
  } {
    return {
      card: true,
      affirm: true,
      applePay: this.isApplePayAvailable()
    };
  }

  /**
   * Check if Apple Pay is available
   */
  private isApplePayAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    
    return (
      window.ApplePaySession &&
      window.ApplePaySession.canMakePayments &&
      window.ApplePaySession.canMakePayments()
    );
  }

  /**
   * Format amount for Stripe (convert to cents)
   */
  formatAmountForStripe(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Format amount from Stripe (convert from cents)
   */
  formatAmountFromStripe(amount: number): number {
    return amount / 100;
  }
}

// Export singleton instance
export const stripePaymentService = new StripePaymentService();
export default stripePaymentService;
