/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, ServiceUtils } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { Order, CreateOrderRequest, CreateOrderItemRequest } from '../../types/entities';

export class OrderPostService extends BaseService {
  /**
   * Create a new order
   */
  async create(data: CreateOrderRequest): Promise<Order> {
    this.logApiCall('POST', ApiEndpoints.Orders.Base, data);
    
    // Validate required fields
    this.validateCreateRequest(data);
    
    return this.handleResponse(
      this.client.post<Order>(ApiEndpoints.Orders.Base, data)
    );
  }

  /**
   * Create a customer order (with user ID)
   */
  async createCustomerOrder(
    userId: number,
    email: string,
    orderItems: CreateOrderItemRequest[],
    shippingInfo: {
      phoneNumber?: string;
      country?: string;
      city?: string;
      zipCode?: string;
    } = {},
    paymentMethod?: string
  ): Promise<Order> {
    const data: CreateOrderRequest = {
      userId,
      email,
      phoneNumber: shippingInfo.phoneNumber,
      country: shippingInfo.country,
      city: shippingInfo.city,
      zipCode: shippingInfo.zipCode,
      paymentMethod,
      orderItems
    };

    return this.create(data);
  }

  /**
   * Create a guest order (without user ID)
   */
  async createGuestOrder(
    email: string,
    orderItems: CreateOrderItemRequest[],
    shippingInfo: {
      phoneNumber?: string;
      country?: string;
      city?: string;
      zipCode?: string;
    } = {},
    paymentMethod?: string
  ): Promise<Order> {
    const data: CreateOrderRequest = {
      userId: undefined,
      email,
      phoneNumber: shippingInfo.phoneNumber,
      country: shippingInfo.country,
      city: shippingInfo.city,
      zipCode: shippingInfo.zipCode,
      paymentMethod,
      orderItems
    };

    return this.create(data);
  }

  /**
   * Create order from shopping cart
   */
  async createFromCart(
    cartItems: Array<{
      productId: number;
      quantity: number;
    }>,
    customerInfo: {
      userId?: number;
      email: string;
      phoneNumber?: string;
      country?: string;
      city?: string;
      zipCode?: string;
    },
    paymentMethod?: string
  ): Promise<Order> {
    const orderItems: CreateOrderItemRequest[] = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    const data: CreateOrderRequest = {
      userId: customerInfo.userId,
      email: customerInfo.email,
      phoneNumber: customerInfo.phoneNumber,
      country: customerInfo.country,
      city: customerInfo.city,
      zipCode: customerInfo.zipCode,
      paymentMethod,
      orderItems
    };

    return this.create(data);
  }

  /**
   * Create single item order (quick order)
   */
  async createQuickOrder(
    productId: number,
    quantity: number,
    customerInfo: {
      userId?: number;
      email: string;
      phoneNumber?: string;
      country?: string;
      city?: string;
      zipCode?: string;
    },
    paymentMethod?: string
  ): Promise<Order> {
    const orderItems: CreateOrderItemRequest[] = [{
      productId,
      quantity
    }];

    return this.createFromCart([{ productId, quantity }], customerInfo, paymentMethod);
  }

  /**
   * Create bulk order (multiple products with quantities)
   */
  async createBulkOrder(
    products: Array<{
      productId: number;
      quantity: number;
    }>,
    customerInfo: {
      userId?: number;
      email: string;
      phoneNumber?: string;
      country?: string;
      city?: string;
      zipCode?: string;
    },
    paymentMethod?: string
  ): Promise<Order> {
    return this.createFromCart(products, customerInfo, paymentMethod);
  }

  /**
   * Create repeat order (duplicate previous order)
   */
  async createRepeatOrder(
    originalOrderId: number,
    customerInfo: {
      userId?: number;
      email: string;
      phoneNumber?: string;
      country?: string;
      city?: string;
      zipCode?: string;
    },
    paymentMethod?: string
  ): Promise<Order> {
    try {
      // Get the original order details
      const { orderGetService } = await import('./get');
      const originalOrder = await orderGetService.getDetails(originalOrderId);

      // Create new order items from original order
      const orderItems: CreateOrderItemRequest[] = originalOrder.orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const data: CreateOrderRequest = {
        userId: customerInfo.userId,
        email: customerInfo.email,
        phoneNumber: customerInfo.phoneNumber,
        country: customerInfo.country,
        city: customerInfo.city,
        zipCode: customerInfo.zipCode,
        paymentMethod,
        orderItems
      };

      return this.create(data);
    } catch (error) {
      console.error('Error creating repeat order:', error);
      throw new Error('Failed to create repeat order');
    }
  }

  /**
   * Create order with validation and stock check
   */
  async createWithValidation(data: CreateOrderRequest): Promise<{
    success: boolean;
    order?: Order;
    errors?: string[];
  }> {
    try {
      // Validate stock availability (this would require product service)
      const stockValidation = await this.validateStock(data.orderItems);
      
      if (!stockValidation.valid) {
        return {
          success: false,
          errors: stockValidation.errors
        };
      }

      const order = await this.create(data);
      
      return {
        success: true,
        order
      };
    } catch (error) {
      console.error('Error creating order with validation:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  }

  /**
   * Validate stock availability for order items
   */
  private async validateStock(orderItems: CreateOrderItemRequest[]): Promise<{
    valid: boolean;
    errors?: string[];
  }> {
    try {
      // This would require product service to check stock
      // For now, we'll assume stock is valid
      // In a real implementation, you'd check each product's stock
      
      const errors: string[] = [];
      
      for (const item of orderItems) {
        if (item.quantity <= 0) {
          errors.push(`Invalid quantity for product ${item.productId}`);
        }
      }

      return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Error validating stock:', error);
      return {
        valid: false,
        errors: ['Error validating stock availability']
      };
    }
  }

  /**
   * Validate create order request
   */
  private validateCreateRequest(data: CreateOrderRequest): void {
    if (!data.email || !ServiceUtils.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    if (!data.orderItems || data.orderItems.length === 0) {
      throw new Error('At least one order item is required');
    }

    // Validate order items
    for (const item of data.orderItems) {
      if (!item.productId || item.productId <= 0) {
        throw new Error('Valid product ID is required for all order items');
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Quantity must be greater than 0 for all order items');
      }
    }

    // Validate phone number format if provided
    if (data.phoneNumber && !this.isValidPhoneNumber(data.phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    // Validate zip code format if provided
    if (data.zipCode && data.zipCode.length > 20) {
      throw new Error('Zip code must be 20 characters or less');
    }
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Basic phone number validation (can be enhanced)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
}

// Export singleton instance
export const orderPostService = new OrderPostService();
