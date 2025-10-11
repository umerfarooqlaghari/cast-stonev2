import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { 
  ProductVariant, 
  UpdateProductVariantRequest
} from '../../types/entities';

export class ProductVariantUpdateService extends BaseService {
  /**
   * Update an existing product variant
   */
  async update(id: number, request: UpdateProductVariantRequest): Promise<ProductVariant> {
    this.logApiCall('PUT', ApiEndpoints.ProductVariants.ById(id), request);
    return this.handleResponse(
      this.client.put<ProductVariant>(ApiEndpoints.ProductVariants.ById(id), request)
    );
  }
}

// Export singleton instance
export const productVariantUpdateService = new ProductVariantUpdateService();

