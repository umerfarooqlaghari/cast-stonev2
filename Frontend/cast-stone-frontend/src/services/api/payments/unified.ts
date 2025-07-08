/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { stripePaymentService } from './stripe';
import { paypalPaymentService } from './paypal';
import { 
  PaymentConfirmationRequest,
  PaymentConfirmationWithNotificationResponse,
  PaymentResponse,
  PaymentConfirmationResponse
} from './types';

export class UnifiedPaymentService extends BaseService {
  private stripe = stripePaymentService;
  private paypal = paypalPaymentService;

  /**
   * Confirm payment and send email notification
   */
  async confirmPaymentAndNotify(data: PaymentConfirmationRequest): Promise<PaymentConfirmationWithNotificationResponse> {
    this.logApiCall('POST', `${ApiEndpoints.Payments}/confirm-and-notify`, data);
    
    return this.handleResponse(
      this.client.post<PaymentConfirmationWithNotificationResponse>(`${ApiEndpoints.Payments}/confirm-and-notify`, data)
    );
  }

  /**
   * Process payment based on method type
   */
  async processPayment(
    paymentMethod: 'stripe' | 'paypal' | 'apple_pay' | 'affirm',
    amount: number,
    currency: string = 'USD',
    orderId: number,
    additionalData?: any
  ): Promise<PaymentResponse | PaymentConfirmationResponse> {
    switch (paymentMethod) {
      case 'stripe':
        return this.stripe.createPaymentIntent({
          amount: this.stripe.formatAmountForStripe(amount),
          currency: currency.toLowerCase(),
          paymentMethodType: 'card',
          confirmationMethod: false,
          metadata: { order_id: orderId, ...additionalData }
        });

      case 'affirm':
        return this.stripe.createAffirmIntent(
          this.stripe.formatAmountForStripe(amount),
          currency.toLowerCase(),
          { order_id: orderId, ...additionalData }
        );

      case 'apple_pay':
        return this.stripe.createApplePayIntent(
          this.stripe.formatAmountForStripe(amount),
          currency.toLowerCase(),
          { order_id: orderId, ...additionalData }
        );

      case 'paypal':
        return this.paypal.createCheckoutOrder(
          amount,
          currency.toUpperCase(),
          additionalData?.description || 'Cast Stone Purchase',
          additionalData?.returnUrl,
          additionalData?.cancelUrl
        );

      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }

  /**
   * Complete payment process with email notification
   */
  async completePayment(
    paymentMethod: 'stripe' | 'paypal' | 'apple_pay' | 'affirm',
    paymentIntentId: string,
    orderId: number
  ): Promise<PaymentConfirmationWithNotificationResponse> {
    const confirmationData: PaymentConfirmationRequest = {
      paymentIntentId,
      paymentMethod,
      orderId
    };

    return this.confirmPaymentAndNotify(confirmationData);
  }

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods(): {
    method: string;
    name: string;
    description: string;
    available: boolean;
    icon: string;
  }[] {
    const stripeCapabilities = this.stripe.getPaymentMethodCapabilities();

    return [
      {
        method: 'stripe',
        name: 'Credit Card',
        description: 'Visa, Mastercard, American Express',
        available: stripeCapabilities.card,
        icon: '💳'
      },
      {
        method: 'paypal',
        name: 'PayPal',
        description: 'Pay securely with your PayPal account',
        available: true,
        icon: '🅿️'
      },
      {
        method: 'affirm',
        name: 'Affirm',
        description: 'Buy now, pay later with Affirm',
        available: stripeCapabilities.affirm,
        icon: '📅'
      },
      {
        method: 'apple_pay',
        name: 'Apple Pay',
        description: 'Pay with Touch ID or Face ID',
        available: stripeCapabilities.applePay,
        icon: '🍎'
      }
    ];
  }

  /**
   * Validate payment amount for all methods
   */
  validatePaymentAmount(amount: number, currency: string = 'USD'): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (amount <= 0) {
      errors.push('Amount must be greater than zero');
    }

    // Check PayPal minimum
    if (!this.paypal.validateOrderAmount(amount, currency)) {
      errors.push(`Amount is below minimum for ${currency}`);
    }

    // Check Stripe minimum (usually $0.50 USD)
    const stripeMinimum = currency.toLowerCase() === 'usd' ? 0.50 : 0.50;
    if (amount < stripeMinimum) {
      errors.push(`Amount is below Stripe minimum of ${stripeMinimum} ${currency}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }

  /**
   * Get payment method configuration
   */
  getPaymentMethodConfig(method: string): any {
    switch (method) {
      case 'stripe':
      case 'affirm':
      case 'apple_pay':
        return {
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#1e3a8a', // Navy blue theme
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#dc2626',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '6px'
            }
          }
        };

      case 'paypal':
        return {
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: 'USD',
          intent: 'capture',
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            tagline: false,
            height: 40
          }
        };

      default:
        return {};
    }
  }

  /**
   * Handle payment errors
   */
  handlePaymentError(error: any, paymentMethod: string): {
    userMessage: string;
    technicalMessage: string;
    shouldRetry: boolean;
  } {
    console.error(`Payment error (${paymentMethod}):`, error);

    // Common error patterns
    if (error.message?.includes('insufficient_funds')) {
      return {
        userMessage: 'Your payment method has insufficient funds. Please try a different payment method.',
        technicalMessage: error.message,
        shouldRetry: true
      };
    }

    if (error.message?.includes('card_declined')) {
      return {
        userMessage: 'Your card was declined. Please check your card details or try a different payment method.',
        technicalMessage: error.message,
        shouldRetry: true
      };
    }

    if (error.message?.includes('network')) {
      return {
        userMessage: 'Network error. Please check your connection and try again.',
        technicalMessage: error.message,
        shouldRetry: true
      };
    }

    // Default error handling
    return {
      userMessage: 'An error occurred while processing your payment. Please try again.',
      technicalMessage: error.message || 'Unknown payment error',
      shouldRetry: true
    };
  }

  /**
   * Get Stripe service instance
   */
  get stripeService() {
    return this.stripe;
  }

  /**
   * Get PayPal service instance
   */
  get paypalService() {
    return this.paypal;
  }
}

// Export singleton instance
export const unifiedPaymentService = new UnifiedPaymentService();
export default unifiedPaymentService;
