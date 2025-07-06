import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { Product, UpdateProductRequest } from '../../types/entities';

export class ProductUpdateService extends BaseService {
  /**
   * Update an existing product
   */
  async update(id: number, data: UpdateProductRequest): Promise<Product> {
    this.logApiCall('PUT', ApiEndpoints.Products.ById(id), data);
    
    // Validate required fields
    this.validateUpdateRequest(data);
    
    return this.handleResponse(
      this.client.put<Product>(ApiEndpoints.Products.ById(id), data)
    );
  }

  /**
   * Update product stock
   */
  async updateStock(id: number, newStock: number): Promise<boolean> {
    this.logApiCall('PATCH', ApiEndpoints.Products.UpdateStock(id), { stock: newStock });
    
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    
    return this.handleVoidResponse(
      this.client.patch(ApiEndpoints.Products.UpdateStock(id), newStock)
    );
  }

  /**
   * Update product price
   */
  async updatePrice(id: number, newPrice: number): Promise<Product> {
    if (newPrice <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const currentProduct = await this.getCurrentProduct(id);
    
    const data: UpdateProductRequest = {
      ...this.mapProductToUpdateRequest(currentProduct),
      price: newPrice
    };

    return this.update(id, data);
  }

  /**
   * Update product basic information
   */
  async updateBasicInfo(
    id: number,
    name: string,
    description: string
  ): Promise<Product> {
    const currentProduct = await this.getCurrentProduct(id);
    
    const data: UpdateProductRequest = {
      ...this.mapProductToUpdateRequest(currentProduct),
      name,
      description
    };

    return this.update(id, data);
  }

  /**
   * Update product images
   */
  async updateImages(id: number, images: string[]): Promise<Product> {
    const currentProduct = await this.getCurrentProduct(id);
    
    const data: UpdateProductRequest = {
      ...this.mapProductToUpdateRequest(currentProduct),
      images
    };

    return this.update(id, data);
  }

  /**
   * Add images to product
   */
  async addImages(id: number, newImages: string[]): Promise<Product> {
    const currentProduct = await this.getCurrentProduct(id);
    const existingImages = currentProduct.images || [];
    const allImages = [...existingImages, ...newImages];

    return this.updateImages(id, allImages);
  }

  /**
   * Remove images from product
   */
  async removeImages(id: number, imagesToRemove: string[]): Promise<Product> {
    const currentProduct = await this.getCurrentProduct(id);
    const existingImages = currentProduct.images || [];
    const filteredImages = existingImages.filter(img => !imagesToRemove.includes(img));

    return this.updateImages(id, filteredImages);
  }

  /**
   * Update product tags
   */
  async updateTags(id: number, tags: string[]): Promise<Product> {
    const currentProduct = await this.getCurrentProduct(id);
    
    const data: UpdateProductRequest = {
      ...this.mapProductToUpdateRequest(currentProduct),
      tags
    };

    return this.update(id, data);
  }

  /**
   * Add tags to product
   */
  async addTags(id: number, newTags: string[]): Promise<Product> {
    const currentProduct = await this.getCurrentProduct(id);
    const existingTags = currentProduct.tags || [];
    const uniqueTags = [...new Set([...existingTags, ...newTags])];

    return this.updateTags(id, uniqueTags);
  }

  /**
   * Remove tags from product
   */
  async removeTags(id: number, tagsToRemove: string[]): Promise<Product> {
    const currentProduct = await this.getCurrentProduct(id);
    const existingTags = currentProduct.tags || [];
    const filteredTags = existingTags.filter(tag => !tagsToRemove.includes(tag));

    return this.updateTags(id, filteredTags);
  }

  /**
   * Move product to different collection
   */
  async moveToCollection(id: number, newCollectionId: number): Promise<Product> {
    const currentProduct = await this.getCurrentProduct(id);
    
    const data: UpdateProductRequest = {
      ...this.mapProductToUpdateRequest(currentProduct),
      collectionId: newCollectionId
    };

    return this.update(id, data);
  }

  /**
   * Adjust stock (add or subtract)
   */
  async adjustStock(id: number, adjustment: number): Promise<boolean> {
    const currentProduct = await this.getCurrentProduct(id);
    const newStock = currentProduct.stock + adjustment;
    
    if (newStock < 0) {
      throw new Error('Stock adjustment would result in negative stock');
    }

    return this.updateStock(id, newStock);
  }

  /**
   * Increase stock
   */
  async increaseStock(id: number, amount: number): Promise<boolean> {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    return this.adjustStock(id, amount);
  }

  /**
   * Decrease stock
   */
  async decreaseStock(id: number, amount: number): Promise<boolean> {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    return this.adjustStock(id, -amount);
  }

  /**
   * Apply discount to product price
   */
  async applyDiscount(
    id: number, 
    discountPercentage: number
  ): Promise<Product> {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }

    const currentProduct = await this.getCurrentProduct(id);
    const discountedPrice = currentProduct.price * (1 - discountPercentage / 100);
    
    return this.updatePrice(id, Math.round(discountedPrice * 100) / 100);
  }

  /**
   * Get current product data
   */
  private async getCurrentProduct(id: number): Promise<Product> {
    const response = await this.client.get<Product>(ApiEndpoints.Products.ById(id));
    
    if (!response.success || !response.data) {
      throw new Error('Product not found');
    }
    
    return response.data;
  }

  /**
   * Map Product to UpdateProductRequest
   */
  private mapProductToUpdateRequest(product: Product): UpdateProductRequest {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      collectionId: product.collectionId,
      images: product.images,
      tags: product.tags
    };
  }

  /**
   * Validate update product request
   */
  private validateUpdateRequest(data: UpdateProductRequest): void {
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
  }
}

// Export singleton instance
export const productUpdateService = new ProductUpdateService();
