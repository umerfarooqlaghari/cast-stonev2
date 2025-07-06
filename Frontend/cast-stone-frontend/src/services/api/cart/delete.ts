import { BaseService } from '../../config/baseService';

export class CartDeleteService extends BaseService {
  /**
   * Remove item from cart
   */
  async removeFromCart(cartId: number, productId: number): Promise<boolean> {
    this.logApiCall('DELETE', `/api/cart/${cartId}/items/${productId}`);
    return this.handleResponse(
      this.client.delete<boolean>(`/api/cart/${cartId}/items/${productId}`)
    );
  }

  /**
   * Remove cart item by ID
   */
  async removeCartItem(cartItemId: number): Promise<boolean> {
    this.logApiCall('DELETE', `/api/cart/items/${cartItemId}`);
    return this.handleResponse(
      this.client.delete<boolean>(`/api/cart/items/${cartItemId}`)
    );
  }

  /**
   * Clear entire cart
   */
  async clearCart(cartId: number): Promise<boolean> {
    this.logApiCall('DELETE', `/api/cart/${cartId}/clear`);
    return this.handleResponse(
      this.client.delete<boolean>(`/api/cart/${cartId}/clear`)
    );
  }

  /**
   * Clear cart by user ID
   */
  async clearCartByUserId(userId: number): Promise<boolean> {
    this.logApiCall('DELETE', `/api/cart/user/${userId}/clear`);
    return this.handleResponse(
      this.client.delete<boolean>(`/api/cart/user/${userId}/clear`)
    );
  }

  /**
   * Clear cart by session ID
   */
  async clearCartBySessionId(sessionId: string): Promise<boolean> {
    this.logApiCall('DELETE', `/api/cart/session/${sessionId}/clear`);
    return this.handleResponse(
      this.client.delete<boolean>(`/api/cart/session/${sessionId}/clear`)
    );
  }
}

// Export singleton instance
export const cartDeleteService = new CartDeleteService();
