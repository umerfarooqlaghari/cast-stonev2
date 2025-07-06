import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { Product, CreateProductRequest } from '../../types/entities';

export class ProductPostService extends BaseService {
  /**
   * Create a new product
   */
  async create(data: CreateProductRequest): Promise<Product> {
    this.logApiCall('POST', ApiEndpoints.Products.Base, data);
    
    // Validate required fields
    this.validateCreateRequest(data);
    
    return this.handleResponse(
      this.client.post<Product>(ApiEndpoints.Products.Base, data)
    );
  }

  /**
   * Create a simple product with minimal data
   */
  async createSimple(
    name: string,
    description: string,
    price: number,
    stock: number,
    collectionId: number,
    images: string[] = [],
    tags: string[] = []
  ): Promise<Product> {
    const data: CreateProductRequest = {
      name,
      description,
      price,
      stock,
      collectionId,
      images,
      tags
    };

    return this.create(data);
  }

  /**
   * Create multiple products in batch
   */
  async createBatch(products: CreateProductRequest[]): Promise<Product[]> {
    this.logApiCall('POST', 'Batch Products', { count: products.length });
    
    const promises = products.map(product => this.create(product));
    return Promise.all(promises);
  }

  /**
   * Create product with image upload
   */
  async createWithImages(
    productData: Omit<CreateProductRequest, 'images'>,
    imageFiles: File[]
  ): Promise<Product> {
    try {
      // First upload images (this would need an image upload service)
      const imageUrls = await this.uploadImages(imageFiles);
      
      // Then create product with image URLs
      const data: CreateProductRequest = {
        ...productData,
        images: imageUrls
      };

      return this.create(data);
    } catch (error) {
      console.error('Error creating product with images:', error);
      throw error;
    }
  }

  /**
   * Duplicate an existing product
   */
  async duplicate(
    originalProductId: number,
    newName: string,
    modifications: Partial<CreateProductRequest> = {}
  ): Promise<Product> {
    try {
      // Get the original product
      const originalResponse = await this.client.get<Product>(
        ApiEndpoints.Products.ById(originalProductId)
      );

      if (!originalResponse.success || !originalResponse.data) {
        throw new Error('Original product not found');
      }

      const original = originalResponse.data;

      // Create new product data based on original
      const data: CreateProductRequest = {
        name: newName,
        description: original.description,
        price: original.price,
        stock: 0, // Start with 0 stock for duplicated products
        collectionId: original.collectionId,
        images: [...original.images], // Copy images array
        tags: [...original.tags], // Copy tags array
        ...modifications // Apply any modifications
      };

      return this.create(data);
    } catch (error) {
      console.error('Error duplicating product:', error);
      throw error;
    }
  }

  /**
   * Create product variant (similar product with different attributes)
   */
  async createVariant(
    baseProductId: number,
    variantName: string,
    priceAdjustment: number = 0,
    modifications: Partial<CreateProductRequest> = {}
  ): Promise<Product> {
    try {
      const baseResponse = await this.client.get<Product>(
        ApiEndpoints.Products.ById(baseProductId)
      );

      if (!baseResponse.success || !baseResponse.data) {
        throw new Error('Base product not found');
      }

      const base = baseResponse.data;

      const data: CreateProductRequest = {
        name: `${base.name} - ${variantName}`,
        description: base.description,
        price: base.price + priceAdjustment,
        stock: 0,
        collectionId: base.collectionId,
        images: [...base.images],
        tags: [...base.tags, 'variant'],
        ...modifications
      };

      return this.create(data);
    } catch (error) {
      console.error('Error creating product variant:', error);
      throw error;
    }
  }

  /**
   * Upload product images (placeholder - would need actual image upload service)
   */
  private async uploadImages(files: File[]): Promise<string[]> {
    // This is a placeholder implementation
    // In a real application, you would upload to a cloud storage service
    const imageUrls: string[] = [];
    
    for (const file of files) {
      // Simulate upload process
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        // This would be your actual image upload endpoint
        // const response = await this.client.upload('/upload/image', formData);
        // imageUrls.push(response.data.url);
        
        // For now, just create a placeholder URL
        imageUrls.push(`/images/products/${Date.now()}-${file.name}`);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Failed to upload image: ${file.name}`);
      }
    }
    
    return imageUrls;
  }

  /**
   * Validate create product request
   */
  private validateCreateRequest(data: CreateProductRequest): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (data.name.length > 200) {
      throw new Error('Product name must be 200 characters or less');
    }

    if (data.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    if (data.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    if (!data.collectionId) {
      throw new Error('Collection ID is required');
    }

    if (data.description && data.description.length > 1000) {
      throw new Error('Description must be 1000 characters or less');
    }

    // Validate image URLs
    if (data.images && data.images.length > 0) {
      for (const image of data.images) {
        if (!this.isValidImageUrl(image)) {
          throw new Error(`Invalid image URL: ${image}`);
        }
      }
    }
  }

  /**
   * Validate image URL format
   */
  private isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      // If not a valid URL, check if it's a relative path
      return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
    }
  }
}

// Export singleton instance
export const productPostService = new ProductPostService();
