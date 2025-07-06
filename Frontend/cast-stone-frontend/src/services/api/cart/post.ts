import { BaseService } from '../../config/baseService';
import { Cart, AddToCartRequest } from '../../types/entities';

export class CartPostService extends BaseService {
  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    this.logApiCall('POST', '/api/cart/add');
    return this.handleResponse(
      this.client.post<Cart>('/api/cart/add', request)
    );
  }
}

// Export singleton instance
export const cartPostService = new CartPostService();
