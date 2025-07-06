import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { Cart, CartSummary } from '../../types/entities';

export class CartGetService extends BaseService {
  /**
   * Get cart by user ID
   */
  async getByUserId(userId: number): Promise<Cart | null> {
    this.logApiCall('GET', `/api/cart/user/${userId}`);
    try {
      return this.handleResponse(
        this.client.get<Cart>(`/api/cart/user/${userId}`)
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get cart by session ID
   */
  async getBySessionId(sessionId: string): Promise<Cart | null> {
    this.logApiCall('GET', `/api/cart/session/${sessionId}`);
    try {
      return this.handleResponse(
        this.client.get<Cart>(`/api/cart/session/${sessionId}`)
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get cart summary by user ID
   */
  async getSummaryByUserId(userId: number): Promise<CartSummary | null> {
    this.logApiCall('GET', `/api/cart/summary/user/${userId}`);
    try {
      return this.handleResponse(
        this.client.get<CartSummary>(`/api/cart/summary/user/${userId}`)
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get cart summary by session ID
   */
  async getSummaryBySessionId(sessionId: string): Promise<CartSummary | null> {
    this.logApiCall('GET', `/api/cart/summary/session/${sessionId}`);
    try {
      return this.handleResponse(
        this.client.get<CartSummary>(`/api/cart/summary/session/${sessionId}`)
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get or create cart
   */
  async getOrCreate(userId?: number, sessionId?: string): Promise<Cart> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId.toString());
    if (sessionId) params.append('sessionId', sessionId);
    
    const url = `/api/cart/get-or-create?${params.toString()}`;
    this.logApiCall('POST', url);
    return this.handleResponse(
      this.client.post<Cart>(url)
    );
  }
}

// Export singleton instance
export const cartGetService = new CartGetService();
