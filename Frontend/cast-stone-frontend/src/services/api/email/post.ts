/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService } from '../../config/baseService';

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

export class EmailPostService extends BaseService {
  /**
   * Send a basic email
   */
  async send(data: EmailRequest): Promise<EmailResponse> {
    this.logApiCall('POST', '/email/send', data);
    
    // Validate required fields
    this.validateEmailRequest(data);
    
    return this.handleResponse(
      this.client.post<EmailResponse>('/api/email/send', data)
    );
  }

  /**
   * Send contact form auto-reply email
   */
  async sendContactFormAutoReply(data: ContactFormAutoReplyRequest): Promise<EmailResponse> {
    this.logApiCall('POST', '/email/contact-form-reply', data);
    
    // Validate required fields
    this.validateContactFormAutoReplyRequest(data);
    
    return this.handleResponse(
      this.client.post<EmailResponse>('/api/email/contact-form-reply', data)
    );
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(data: OrderConfirmationRequest): Promise<EmailResponse> {
    this.logApiCall('POST', '/email/order-confirmation', data);
    
    // Validate required fields
    this.validateOrderConfirmationRequest(data);
    
    return this.handleResponse(
      this.client.post<EmailResponse>('/api/email/order-confirmation', data)
    );
  }

  /**
   * Validate email request
   */
  private validateEmailRequest(data: EmailRequest): void {
    if (!data.subject || data.subject.trim().length === 0) {
      throw new Error('Subject is required');
    }

    if (!data.message || data.message.trim().length === 0) {
      throw new Error('Message is required');
    }

    if (data.subject.length > 200) {
      throw new Error('Subject must be 200 characters or less');
    }

    if (data.message.length > 5000) {
      throw new Error('Message must be 5000 characters or less');
    }
  }

  /**
   * Validate contact form auto-reply request
   */
  private validateContactFormAutoReplyRequest(data: ContactFormAutoReplyRequest): void {
    if (!data.userEmail || data.userEmail.trim().length === 0) {
      throw new Error('User email is required');
    }

    if (!data.userName || data.userName.trim().length === 0) {
      throw new Error('User name is required');
    }

    if (!data.inquiryType || data.inquiryType.trim().length === 0) {
      throw new Error('Inquiry type is required');
    }

    if (!data.message || data.message.trim().length === 0) {
      throw new Error('Message is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.userEmail)) {
      throw new Error('Invalid email format');
    }
  }

  /**
   * Validate order confirmation request
   */
  private validateOrderConfirmationRequest(data: OrderConfirmationRequest): void {
    if (!data.customerEmail || data.customerEmail.trim().length === 0) {
      throw new Error('Customer email is required');
    }

    if (!data.customerName || data.customerName.trim().length === 0) {
      throw new Error('Customer name is required');
    }

    if (!data.orderId || data.orderId <= 0) {
      throw new Error('Valid order ID is required');
    }

    if (!data.totalAmount || data.totalAmount <= 0) {
      throw new Error('Valid total amount is required');
    }

    if (!data.orderItems || data.orderItems.length === 0) {
      throw new Error('Order items are required');
    }

    if (!data.paymentMethod || data.paymentMethod.trim().length === 0) {
      throw new Error('Payment method is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customerEmail)) {
      throw new Error('Invalid email format');
    }

    // Validate order items
    for (const item of data.orderItems) {
      if (!item.productName || item.productName.trim().length === 0) {
        throw new Error('Product name is required for all order items');
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Valid quantity is required for all order items');
      }

      if (!item.price || item.price <= 0) {
        throw new Error('Valid price is required for all order items');
      }

      if (!item.total || item.total <= 0) {
        throw new Error('Valid total is required for all order items');
      }
    }
  }
}

// Export singleton instance
export const emailPostService = new EmailPostService();
