import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { ProductDetails, UpdateProductDetailsRequest } from '../../types/entities';

export class ProductDetailsUpdateService extends BaseService {
  /**
   * Update product details
   */
  async update(id: number, data: UpdateProductDetailsRequest): Promise<ProductDetails> {
    this.logApiCall('PUT', `${ApiEndpoints.ProductDetails.Base}/${id}`, data);
    return this.handleResponse(this.client.put<ProductDetails>(`${ApiEndpoints.ProductDetails.Base}/${id}`, data));
  }

  /**
   * Delete product details
   */
  async delete(id: number): Promise<void> {
    this.logApiCall('DELETE', `${ApiEndpoints.ProductDetails.Base}/${id}`);
    return this.handleResponse(this.client.delete(`${ApiEndpoints.ProductDetails.Base}/${id}`));
  }
}
