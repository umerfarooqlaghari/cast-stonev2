import { BaseService } from '../../config/baseService';
import { Cart, UpdateCartItemRequest } from '../../types/entities';

export class CartUpdateService extends BaseService {
  /**
   * Update cart item quantity
   */
  async updateCartItem(cartId: number, productId: number, request: UpdateCartItemRequest): Promise<Cart> {
    this.logApiCall('PUT', `/api/cart/${cartId}/items/${productId}`);
    return this.handleResponse(
      this.client.put<Cart>(`/api/cart/${cartId}/items/${productId}`, request)
    );
  }
}

// Export singleton instance
export const cartUpdateService = new CartUpdateService();
