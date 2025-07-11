import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { ProductSpecifications } from '../../types/entities';

export class ProductSpecificationsGetService extends BaseService {
  /**
   * Get all product specifications
   */
  async getAll(): Promise<ProductSpecifications[]> {
    this.logApiCall('GET', ApiEndpoints.ProductSpecifications.Base);
    return this.handleResponse(this.client.get<ProductSpecifications[]>(ApiEndpoints.ProductSpecifications.Base));
  }

  /**
   * Get product specifications by ID
   */
  async getById(id: number): Promise<ProductSpecifications> {
    this.logApiCall('GET', `${ApiEndpoints.ProductSpecifications.Base}/${id}`);
    return this.handleResponse(this.client.get<ProductSpecifications>(`${ApiEndpoints.ProductSpecifications.Base}/${id}`));
  }

  /**
   * Get product specifications by product ID
   */
  async getByProductId(productId: number): Promise<ProductSpecifications | null> {
    this.logApiCall('GET', `${ApiEndpoints.ProductSpecifications.Base}/product/${productId}`);
    try {
      return await this.handleResponse(this.client.get<ProductSpecifications>(`${ApiEndpoints.ProductSpecifications.Base}/product/${productId}`));
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
