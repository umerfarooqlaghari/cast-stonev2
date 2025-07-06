import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { Cart, AddToCartRequest } from '../../types/entities';

export class CartPostService extends BaseService {
  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    const endpoint = ApiEndpoints.Cart.Add;
    this.logApiCall('POST', endpoint);
    return this.handleResponse(
      this.client.post<Cart>(endpoint, request)
    );
  }
}

// Export singleton instance
export const cartPostService = new CartPostService();
