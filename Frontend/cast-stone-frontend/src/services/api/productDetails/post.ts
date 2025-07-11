import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { ProductDetails, CreateProductDetailsRequest } from '../../types/entities';

export class ProductDetailsPostService extends BaseService {
  /**
   * Create new product details
   */
  async create(data: CreateProductDetailsRequest): Promise<ProductDetails> {
    this.logApiCall('POST', ApiEndpoints.ProductDetails.Base, data);
    return this.handleResponse(this.client.post<ProductDetails>(ApiEndpoints.ProductDetails.Base, data));
  }
}
