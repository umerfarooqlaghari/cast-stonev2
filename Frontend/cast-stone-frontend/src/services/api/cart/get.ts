/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { Cart, CartSummary } from '../../types/entities';

export class CartGetService extends BaseService {
  /**
   * Get cart by user ID
   */
  async getByUserId(userId: number): Promise<Cart | null> {
    const endpoint = ApiEndpoints.Cart.ByUserId(userId);
    this.logApiCall('GET', endpoint);
    try {
      return this.handleResponse(
        this.client.get<Cart>(endpoint)
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
    const endpoint = ApiEndpoints.Cart.BySessionId(sessionId);
    this.logApiCall('GET', endpoint);
    try {
      return this.handleResponse(
        this.client.get<Cart>(endpoint)
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
    const endpoint = ApiEndpoints.Cart.SummaryByUserId(userId);
    this.logApiCall('GET', endpoint);
    try {
      return this.handleResponse(
        this.client.get<CartSummary>(endpoint)
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
    const endpoint = ApiEndpoints.Cart.SummaryBySessionId(sessionId);
    this.logApiCall('GET', endpoint);
    try {
      return this.handleResponse(
        this.client.get<CartSummary>(endpoint)
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
    const params: Record<string, any> = {};
    if (userId) params.userId = userId;
    if (sessionId) params.sessionId = sessionId;

    const endpoint = ApiEndpoints.Cart.GetOrCreate;
    this.logApiCall('POST', endpoint, params);
    return this.handleResponse(
      this.client.post<Cart>(endpoint, null, { params })
    );
  }
}

// Export singleton instance
export const cartGetService = new CartGetService();
