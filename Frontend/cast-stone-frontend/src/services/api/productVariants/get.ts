import { BaseService, ServiceUtils } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { 
  ProductVariant, 
  ProductVariantFilterRequest
} from '../../types/entities';

export class ProductVariantGetService extends BaseService {
  /**
   * Get all product variants
   */
  async getAll(filters?: ProductVariantFilterRequest): Promise<ProductVariant[]> {
    const cleanFilters = filters ? ServiceUtils.cleanObject(filters) : {};
    this.logApiCall('GET', ApiEndpoints.ProductVariants.Base, cleanFilters);
    return this.handleResponse(
      this.client.get<ProductVariant[]>(ApiEndpoints.ProductVariants.Base, cleanFilters)
    );
  }

  /**
   * Get product variant by ID
   */
  async getById(id: number): Promise<ProductVariant> {
    this.logApiCall('GET', ApiEndpoints.ProductVariants.ById(id));
    return this.handleResponse(
      this.client.get<ProductVariant>(ApiEndpoints.ProductVariants.ById(id))
    );
  }

  /**
   * Get all variants for a specific product
   */
  async getByProductId(productId: number): Promise<ProductVariant[]> {
    this.logApiCall('GET', ApiEndpoints.ProductVariants.ByProduct(productId));
    return this.handleResponse(
      this.client.get<ProductVariant[]>(ApiEndpoints.ProductVariants.ByProduct(productId))
    );
  }

  /**
   * Get variants by name (partial match)
   */
  async getByName(variantName: string): Promise<ProductVariant[]> {
    const filters: ProductVariantFilterRequest = { variantName };
    return this.getAll(filters);
  }

  /**
   * Get variants by tag
   */
  async getByTag(variantTag: string): Promise<ProductVariant[]> {
    const filters: ProductVariantFilterRequest = { variantTag };
    return this.getAll(filters);
  }

  /**
   * Get variants by price range
   */
  async getByPriceRange(minPrice: number, maxPrice: number): Promise<ProductVariant[]> {
    const filters: ProductVariantFilterRequest = { minPrice, maxPrice };
    return this.getAll(filters);
  }
}

// Export singleton instance
export const productVariantGetService = new ProductVariantGetService();

