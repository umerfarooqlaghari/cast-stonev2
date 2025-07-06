import { BaseService, ServiceUtils } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { 
  Product, 
  ProductSummary, 
  ProductFilterRequest,
  PaginatedResponse 
} from '../../types/entities';

export class ProductGetService extends BaseService {
  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    this.logApiCall('GET', ApiEndpoints.Products.Base);
    return this.handleResponse(
      this.client.get<Product[]>(ApiEndpoints.Products.Base)
    );
  }

  /**
   * Get product by ID
   */
  async getById(id: number): Promise<Product> {
    this.logApiCall('GET', ApiEndpoints.Products.ById(id));
    return this.handleResponse(
      this.client.get<Product>(ApiEndpoints.Products.ById(id))
    );
  }

  /**
   * Get products by collection ID
   */
  async getByCollection(collectionId: number): Promise<Product[]> {
    this.logApiCall('GET', ApiEndpoints.Products.ByCollection(collectionId));
    return this.handleResponse(
      this.client.get<Product[]>(ApiEndpoints.Products.ByCollection(collectionId))
    );
  }

  /**
   * Get products in stock
   */
  async getInStock(): Promise<Product[]> {
    this.logApiCall('GET', ApiEndpoints.Products.InStock);
    return this.handleResponse(
      this.client.get<Product[]>(ApiEndpoints.Products.InStock)
    );
  }

  /**
   * Get featured products
   */
  async getFeatured(count: number = 10): Promise<ProductSummary[]> {
    this.logApiCall('GET', ApiEndpoints.Products.Featured, { count });
    return this.handleResponse(
      this.client.get<ProductSummary[]>(ApiEndpoints.Products.Featured, { count })
    );
  }

  /**
   * Get latest products
   */
  async getLatest(count: number = 10): Promise<ProductSummary[]> {
    this.logApiCall('GET', ApiEndpoints.Products.Latest, { count });
    return this.handleResponse(
      this.client.get<ProductSummary[]>(ApiEndpoints.Products.Latest, { count })
    );
  }

  /**
   * Search products by name
   */
  async search(name: string): Promise<Product[]> {
    this.logApiCall('GET', ApiEndpoints.Products.Search, { name });
    return this.handleResponse(
      this.client.get<Product[]>(ApiEndpoints.Products.Search, { name })
    );
  }

  /**
   * Get products by price range
   */
  async getByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    this.logApiCall('GET', ApiEndpoints.Products.PriceRange, { minPrice, maxPrice });
    return this.handleResponse(
      this.client.get<Product[]>(ApiEndpoints.Products.PriceRange, { minPrice, maxPrice })
    );
  }

  /**
   * Get products with advanced filtering and pagination
   */
  async getFiltered(filters: ProductFilterRequest): Promise<PaginatedResponse<Product>> {
    const cleanFilters = ServiceUtils.cleanObject(filters);
    this.logApiCall('GET', ApiEndpoints.Products.Filter, cleanFilters);
    
    return this.handlePaginatedResponse(
      this.client.get<PaginatedResponse<Product>>(
        ApiEndpoints.Products.Filter, 
        cleanFilters
      )
    );
  }

  /**
   * Get products with default pagination
   */
  async getPaginated(
    pageNumber: number = 1, 
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<Product>> {
    const filters: ProductFilterRequest = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    };
    
    return this.getFiltered(filters);
  }

  /**
   * Get products by tag
   */
  async getByTag(tag: string): Promise<Product[]> {
    const filters: ProductFilterRequest = {
      tag,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get low stock products
   */
  async getLowStock(threshold: number = 10): Promise<Product[]> {
    const filters: ProductFilterRequest = {
      minStock: 1,
      maxStock: threshold,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get out of stock products
   */
  async getOutOfStock(): Promise<Product[]> {
    const filters: ProductFilterRequest = {
      inStock: false,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get products in price range with pagination
   */
  async getByPriceRangePaginated(
    minPrice: number, 
    maxPrice: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Product>> {
    const filters: ProductFilterRequest = {
      minPrice,
      maxPrice,
      pageNumber,
      pageSize,
      sortBy: 'price',
      sortDirection: 'asc'
    };
    
    return this.getFiltered(filters);
  }

  /**
   * Get products created within date range
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<Product[]> {
    const filters: ProductFilterRequest = {
      createdAfter: ServiceUtils.formatDate(startDate),
      createdBefore: ServiceUtils.formatDate(endDate),
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get product recommendations based on collection
   */
  async getRecommendations(productId: number, count: number = 5): Promise<Product[]> {
    try {
      const product = await this.getById(productId);
      const relatedProducts = await this.getByCollection(product.collectionId);
      
      // Filter out the current product and return limited results
      return relatedProducts
        .filter(p => p.id !== productId)
        .slice(0, count);
    } catch (error) {
      console.error('Error getting product recommendations:', error);
      return [];
    }
  }
}

// Export singleton instance
export const productGetService = new ProductGetService();
