/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { ProductDetails } from '../../types/entities';

export class ProductDetailsGetService extends BaseService {
  /**
   * Get all product details
   */
  async getAll(): Promise<ProductDetails[]> {
    this.logApiCall('GET', ApiEndpoints.ProductDetails.Base);
    return this.handleResponse(this.client.get<ProductDetails[]>(ApiEndpoints.ProductDetails.Base));
  }

  /**
   * Get product details by ID
   */
  async getById(id: number): Promise<ProductDetails> {
    this.logApiCall('GET', `${ApiEndpoints.ProductDetails.Base}/${id}`);
    return this.handleResponse(this.client.get<ProductDetails>(`${ApiEndpoints.ProductDetails.Base}/${id}`));
  }

  /**
   * Get product details by product ID
   */
  async getByProductId(productId: number): Promise<ProductDetails | null> {
    this.logApiCall('GET', `${ApiEndpoints.ProductDetails.Base}/product/${productId}`);
    try {
      return await this.handleResponse(this.client.get<ProductDetails>(`${ApiEndpoints.ProductDetails.Base}/product/${productId}`));
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
