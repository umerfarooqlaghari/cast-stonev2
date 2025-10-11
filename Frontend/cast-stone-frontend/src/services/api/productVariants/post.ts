import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { 
  ProductVariant, 
  CreateProductVariantRequest
} from '../../types/entities';

export class ProductVariantPostService extends BaseService {
  /**
   * Create a new product variant
   */
  async create(request: CreateProductVariantRequest): Promise<ProductVariant> {
    this.logApiCall('POST', ApiEndpoints.ProductVariants.Base, request);
    return this.handleResponse(
      this.client.post<ProductVariant>(ApiEndpoints.ProductVariants.Base, request)
    );
  }
}

// Export singleton instance
export const productVariantPostService = new ProductVariantPostService();

