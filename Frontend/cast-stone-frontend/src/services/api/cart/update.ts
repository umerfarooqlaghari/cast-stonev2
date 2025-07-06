import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { Cart, UpdateCartItemRequest } from '../../types/entities';

export class CartUpdateService extends BaseService {
  /**
   * Update cart item quantity
   */
  async updateCartItem(cartId: number, productId: number, request: UpdateCartItemRequest): Promise<Cart> {
    const endpoint = ApiEndpoints.Cart.UpdateItem(cartId, productId);
    this.logApiCall('PUT', endpoint);
    return this.handleResponse(
      this.client.put<Cart>(endpoint, request)
    );
  }
}

// Export singleton instance
export const cartUpdateService = new CartUpdateService();
