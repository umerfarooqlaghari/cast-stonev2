/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/sendEmail.ts (frontend)
import { BaseApiUrl } from '../services/config/apiConfig';

export interface EmailRequest {
  subject: string;
  message: string;
  toEmail?: string;
  toName?: string;
}

export interface ContactFormAutoReplyRequest {
  userEmail: string;
  userName: string;
  inquiryType: string;
  message: string;
  company?: string;
  state?: string;
  phoneNumber?: string;
}

export interface OrderConfirmationRequest {
  customerEmail: string;
  customerName: string;
  orderId: number;
  totalAmount: number;
  orderItems: OrderItemDetail[];
  paymentMethod: string;
  shippingAddress?: string;
  orderDate?: Date;
}

export interface OrderItemDetail {
  productName: string;
  quantity: number;
  price: number;
  total: number;
  productImage?: string;
  productDescription?: string;
}

export interface EmailResponse {
  status: string;
  message?: string;
}

/**
 * Send a basic email
 */
export async function sendEmail(subject: string, message: string, toEmail?: string, toName?: string): Promise<EmailResponse> {
  const res = await fetch(`${BaseApiUrl}/email/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      subject, 
      message,
      toEmail,
      toName
    } as EmailRequest),
  });

  const data = await res.json();
  return data;
}

/**
 * Send contact form auto-reply email
 */
export async function sendContactFormAutoReply(request: ContactFormAutoReplyRequest): Promise<EmailResponse> {
  const res = await fetch(`${BaseApiUrl}/email/contact-form-reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json();
  return data;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(request: OrderConfirmationRequest): Promise<EmailResponse> {
  const res = await fetch(`${BaseApiUrl}/email/order-confirmation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json();
  return data;
}

/**
 * Email utility class for organized email operations
 */
export class EmailService {
  /**
   * Send a basic email
   */
  static async send(subject: string, message: string, toEmail?: string, toName?: string): Promise<EmailResponse> {
    return sendEmail(subject, message, toEmail, toName);
  }

  /**
   * Send contact form auto-reply
   */
  static async sendContactFormAutoReply(request: ContactFormAutoReplyRequest): Promise<EmailResponse> {
    return sendContactFormAutoReply(request);
  }

  /**
   * Send order confirmation
   */
  static async sendOrderConfirmation(request: OrderConfirmationRequest): Promise<EmailResponse> {
    return sendOrderConfirmation(request);
  }

  /**
   * Handle email errors gracefully
   */
  static handleEmailError(error: any): string {
    if (error?.message) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An error occurred while sending email';
  }

  /**
   * Validate email request before sending
   */
  static validateEmailRequest(subject: string, message: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!subject || subject.trim().length === 0) {
      errors.push('Subject is required');
    }

    if (!message || message.trim().length === 0) {
      errors.push('Message is required');
    }

    if (subject && subject.length > 200) {
      errors.push('Subject must be 200 characters or less');
    }

    if (message && message.length > 5000) {
      errors.push('Message must be 5000 characters or less');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate contact form auto-reply request
   */
  static validateContactFormAutoReplyRequest(request: ContactFormAutoReplyRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.userEmail || request.userEmail.trim().length === 0) {
      errors.push('User email is required');
    }

    if (!request.userName || request.userName.trim().length === 0) {
      errors.push('User name is required');
    }

    if (!request.inquiryType || request.inquiryType.trim().length === 0) {
      errors.push('Inquiry type is required');
    }

    if (!request.message || request.message.trim().length === 0) {
      errors.push('Message is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (request.userEmail && !emailRegex.test(request.userEmail)) {
      errors.push('Invalid email format');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate order confirmation request
   */
  static validateOrderConfirmationRequest(request: OrderConfirmationRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.customerEmail || request.customerEmail.trim().length === 0) {
      errors.push('Customer email is required');
    }

    if (!request.customerName || request.customerName.trim().length === 0) {
      errors.push('Customer name is required');
    }

    if (!request.orderId || request.orderId <= 0) {
      errors.push('Valid order ID is required');
    }

    if (!request.totalAmount || request.totalAmount <= 0) {
      errors.push('Valid total amount is required');
    }

    if (!request.orderItems || request.orderItems.length === 0) {
      errors.push('Order items are required');
    }

    if (!request.paymentMethod || request.paymentMethod.trim().length === 0) {
      errors.push('Payment method is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (request.customerEmail && !emailRegex.test(request.customerEmail)) {
      errors.push('Invalid email format');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();
