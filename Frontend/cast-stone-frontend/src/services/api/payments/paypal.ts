/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { 
  PayPalOrderRequest, 
  PayPalOrderResponse, 
  PaymentConfirmationResponse,
  PayPalButtonsComponentOptions 
} from './types';

export class PayPalPaymentService extends BaseService {
  /**
   * Create a PayPal order
   */
  async createOrder(data: PayPalOrderRequest): Promise<PayPalOrderResponse> {
    this.logApiCall('POST', `${ApiEndpoints.Payments}/paypal/create-order`, data);
    
    return this.handleResponse(
      this.client.post<PayPalOrderResponse>(`${ApiEndpoints.Payments}/paypal/create-order`, data)
    );
  }

  /**
   * Capture a PayPal order
   */
  async captureOrder(orderId: string): Promise<PaymentConfirmationResponse> {
    this.logApiCall('POST', `${ApiEndpoints.Payments}/paypal/capture/${orderId}`, {});
    
    return this.handleResponse(
      this.client.post<PaymentConfirmationResponse>(`${ApiEndpoints.Payments}/paypal/capture/${orderId}`, {})
    );
  }

  /**
   * Get PayPal order details
   */
  async getOrder(orderId: string): Promise<PayPalOrderResponse> {
    this.logApiCall('GET', `${ApiEndpoints.Payments}/paypal/order/${orderId}`, {});
    
    return this.handleResponse(
      this.client.get<PayPalOrderResponse>(`${ApiEndpoints.Payments}/paypal/order/${orderId}`)
    );
  }

  /**
   * Create PayPal order for checkout
   */
  async createCheckoutOrder(
    amount: number, 
    currency: string = 'USD',
    description?: string,
    returnUrl?: string,
    cancelUrl?: string
  ): Promise<PayPalOrderResponse> {
    const orderData: PayPalOrderRequest = {
      amount,
      currency,
      intent: 'CAPTURE',
      returnUrl,
      cancelUrl,
      purchaseUnit: {
        description: description || 'Cast Stone Purchase',
        amount: {
          currencyCode: currency,
          value: amount.toFixed(2)
        }
      }
    };

    return this.createOrder(orderData);
  }

  /**
   * Generate PayPal buttons configuration
   */
  generateButtonsConfig(
    amount: number,
    currency: string = 'USD',
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
    onCancel?: (data: any) => void,
    description?: string
  ): PayPalButtonsComponentOptions {
    return {
      createOrder: async (data, actions) => {
        try {
          const orderResponse = await this.createCheckoutOrder(
            amount,
            currency,
            description
          );

          if (!orderResponse.success || !orderResponse.orderId) {
            throw new Error(orderResponse.message || 'Failed to create PayPal order');
          }

          return orderResponse.orderId;
        } catch (error) {
          console.error('Error creating PayPal order:', error);
          throw error;
        }
      },

      onApprove: async (data, actions) => {
        try {
          const captureResponse = await this.captureOrder(data.orderID);
          
          if (captureResponse.success) {
            console.log('PayPal payment captured successfully:', captureResponse);
            onSuccess?.(captureResponse);
          } else {
            throw new Error(captureResponse.message || 'Failed to capture PayPal payment');
          }
        } catch (error) {
          console.error('Error capturing PayPal payment:', error);
          onError?.(error);
        }
      },

      onError: (err) => {
        console.error('PayPal error:', err);
        onError?.(err);
      },

      onCancel: (data) => {
        console.log('PayPal payment cancelled:', data);
        onCancel?.(data);
      },

      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        tagline: false,
        height: 40
      }
    };
  }

  /**
   * Load PayPal SDK script
   */
  async loadPayPalSDK(clientId: string, currency: string = 'USD'): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if PayPal SDK is already loaded
      if (window.paypal) {
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
      script.async = true;

      script.onload = () => {
        if (window.paypal) {
          resolve();
        } else {
          reject(new Error('PayPal SDK failed to load'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load PayPal SDK script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Render PayPal buttons
   */
  async renderPayPalButtons(
    containerId: string,
    config: PayPalButtonsComponentOptions
  ): Promise<void> {
    if (!window.paypal) {
      throw new Error('PayPal SDK not loaded');
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with ID '${containerId}' not found`);
    }

    // Clear existing content
    container.innerHTML = '';

    // Render PayPal buttons
    window.paypal.Buttons(config).render(`#${containerId}`);
  }

  /**
   * Validate PayPal order amount
   */
  validateOrderAmount(amount: number, currency: string = 'USD'): boolean {
    if (amount <= 0) {
      return false;
    }

    // PayPal minimum amounts by currency
    const minimumAmounts: Record<string, number> = {
      'USD': 0.01,
      'EUR': 0.01,
      'GBP': 0.01,
      'CAD': 0.01,
      'AUD': 0.01,
      'JPY': 1
    };

    const minimum = minimumAmounts[currency] || 0.01;
    return amount >= minimum;
  }

  /**
   * Format amount for PayPal
   */
  formatAmountForPayPal(amount: number): string {
    return amount.toFixed(2);
  }

  /**
   * Get PayPal supported currencies
   */
  getSupportedCurrencies(): string[] {
    return [
      'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 
      'CHF', 'NOK', 'SEK', 'DKK', 'PLN', 'CZK',
      'HUF', 'ILS', 'MXN', 'BRL', 'MYR', 'PHP',
      'THB', 'TWD', 'NZD', 'HKD', 'SGD', 'RUB'
    ];
  }

  /**
   * Check if currency is supported
   */
  isCurrencySupported(currency: string): boolean {
    return this.getSupportedCurrencies().includes(currency.toUpperCase());
  }
}

// Extend window interface for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}

// Export singleton instance
export const paypalPaymentService = new PayPalPaymentService();
export default paypalPaymentService;
