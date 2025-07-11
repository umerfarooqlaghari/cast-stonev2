import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { ProductSpecifications, UpdateProductSpecificationsRequest } from '../../types/entities';

export class ProductSpecificationsUpdateService extends BaseService {
  /**
   * Update product specifications
   */
  async update(id: number, data: UpdateProductSpecificationsRequest): Promise<ProductSpecifications> {
    this.logApiCall('PUT', `${ApiEndpoints.ProductSpecifications.Base}/${id}`, data);
    return this.handleResponse(this.client.put<ProductSpecifications>(`${ApiEndpoints.ProductSpecifications.Base}/${id}`, data));
  }

  /**
   * Delete product specifications
   */
  async delete(id: number): Promise<void> {
    this.logApiCall('DELETE', `${ApiEndpoints.ProductSpecifications.Base}/${id}`);
    return this.handleResponse(this.client.delete(`${ApiEndpoints.ProductSpecifications.Base}/${id}`));
  }
}
