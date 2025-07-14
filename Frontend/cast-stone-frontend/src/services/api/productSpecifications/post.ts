import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { ProductSpecifications, CreateProductSpecificationsRequest } from '../../types/entities';

export class ProductSpecificationsPostService extends BaseService {
  /**
   * Create new product specifications
   */
  async create(data: CreateProductSpecificationsRequest): Promise<ProductSpecifications> {
    this.logApiCall('POST', ApiEndpoints.ProductSpecifications.Base, data);
    return this.handleResponse(this.client.post<ProductSpecifications>(ApiEndpoints.ProductSpecifications.Base, data));
  }
}
