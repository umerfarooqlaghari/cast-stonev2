import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';

export class CartDeleteService extends BaseService {
  /**
   * Remove item from cart
   */
  async removeFromCart(cartId: number, productId: number): Promise<boolean> {
    const endpoint = ApiEndpoints.Cart.RemoveItem(cartId, productId);
    this.logApiCall('DELETE', endpoint);
    return this.handleResponse(
      this.client.delete<boolean>(endpoint)
    );
  }

  /**
   * Remove cart item by ID
   */
  async removeCartItem(cartItemId: number): Promise<boolean> {
    const endpoint = ApiEndpoints.Cart.RemoveCartItem(cartItemId);
    this.logApiCall('DELETE', endpoint);
    return this.handleResponse(
      this.client.delete<boolean>(endpoint)
    );
  }

  /**
   * Clear entire cart
   */
  async clearCart(cartId: number): Promise<boolean> {
    const endpoint = ApiEndpoints.Cart.Clear(cartId);
    this.logApiCall('DELETE', endpoint);
    return this.handleResponse(
      this.client.delete<boolean>(endpoint)
    );
  }

  /**
   * Clear cart by user ID
   */
  async clearCartByUserId(userId: number): Promise<boolean> {
    const endpoint = ApiEndpoints.Cart.ClearByUserId(userId);
    this.logApiCall('DELETE', endpoint);
    return this.handleResponse(
      this.client.delete<boolean>(endpoint)
    );
  }

  /**
   * Clear cart by session ID
   */
  async clearCartBySessionId(sessionId: string): Promise<boolean> {
    const endpoint = ApiEndpoints.Cart.ClearBySessionId(sessionId);
    this.logApiCall('DELETE', endpoint);
    return this.handleResponse(
      this.client.delete<boolean>(endpoint)
    );
  }
}

// Export singleton instance
export const cartDeleteService = new CartDeleteService();
