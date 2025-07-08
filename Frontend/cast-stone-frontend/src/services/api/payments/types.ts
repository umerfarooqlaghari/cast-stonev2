/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Payment-related TypeScript types for frontend

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'paypal' | 'apple_pay' | 'affirm';
  returnUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}

export interface StripePaymentRequest {
  amount: number;
  currency: string;
  paymentMethodType: 'card' | 'affirm' | 'apple_pay';
  confirmationMethod: boolean;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface PayPalOrderRequest {
  amount: number;
  currency: string;
  intent: 'CAPTURE' | 'AUTHORIZE';
  returnUrl?: string;
  cancelUrl?: string;
  purchaseUnit: PayPalPurchaseUnit;
}

export interface PayPalPurchaseUnit {
  referenceId?: string;
  description?: string;
  amount: PayPalAmount;
}

export interface PayPalAmount {
  currencyCode: string;
  value: string;
}

export interface PaymentConfirmationRequest {
  paymentIntentId: string;
  paymentMethod: string;
  orderId: number;
}

// Response types
export interface PaymentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  paymentMethod?: string;
  status?: string;
  message?: string;
  metadata?: Record<string, any>;
}

export interface PayPalOrderResponse {
  success: boolean;
  orderId?: string;
  status?: string;
  approvalUrl?: string;
  message?: string;
  orderDetails?: PayPalOrderDetails;
}

export interface PayPalOrderDetails {
  id: string;
  status: string;
  intent: string;
  links: PayPalLink[];
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PaymentConfirmationResponse {
  success: boolean;
  transactionId?: string;
  status?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  processedAt: string;
  message?: string;
}

export interface EmailNotificationResponse {
  success: boolean;
  message?: string;
  sentAt: string;
  recipientEmail?: string;
}

export interface PaymentConfirmationWithNotificationResponse {
  payment: PaymentConfirmationResponse;
  emailNotification: EmailNotificationResponse;
}

// Stripe-specific types
export interface StripeElements {
  create(type: string, options?: any): StripeElement;
  getElement(type: string): StripeElement | null;
}

export interface StripeElement {
  mount(domElement: string | HTMLElement): void;
  unmount(): void;
  destroy(): void;
  on(event: string, handler: (event: any) => void): void;
  update(options: any): void;
}

export interface StripeCardElement extends StripeElement {
  // Card-specific methods
}

export interface StripePaymentElement extends StripeElement {
  // Payment Element specific methods
}

// PayPal-specific types
export interface PayPalButtonsComponentOptions {
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
  onError?: (err: any) => void;
  onCancel?: (data: any) => void;
  style?: {
    layout?: 'vertical' | 'horizontal';
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
    shape?: 'rect' | 'pill';
    label?: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment';
    tagline?: boolean;
    height?: number;
  };
}

// Apple Pay types
export interface ApplePaySession {
  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: any): void;
  completePayment(result: ApplePayPaymentAuthorizationResult): void;
}

export interface ApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  supportedNetworks: string[];
  merchantCapabilities: string[];
  total: ApplePayLineItem;
  lineItems?: ApplePayLineItem[];
}

export interface ApplePayLineItem {
  label: string;
  amount: string;
  type?: 'final' | 'pending';
}

export interface ApplePayPaymentAuthorizationResult {
  status: number;
  errors?: ApplePayError[];
}

export interface ApplePayError {
  code: string;
  message: string;
  contactField?: string;
}
