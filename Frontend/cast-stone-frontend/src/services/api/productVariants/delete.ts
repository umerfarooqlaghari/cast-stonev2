import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';

export class ProductVariantDeleteService extends BaseService {
  /**
   * Delete a product variant
   */
  async delete(id: number): Promise<void> {
    this.logApiCall('DELETE', ApiEndpoints.ProductVariants.ById(id));
    return this.handleResponse(
      this.client.delete<void>(ApiEndpoints.ProductVariants.ById(id))
    );
  }
}

// Export singleton instance
export const productVariantDeleteService = new ProductVariantDeleteService();

