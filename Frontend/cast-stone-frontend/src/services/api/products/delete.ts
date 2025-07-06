import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';

export class ProductDeleteService extends BaseService {
  /**
   * Delete a product by ID
   */
  async delete(id: number): Promise<boolean> {
    this.logApiCall('DELETE', ApiEndpoints.Products.ById(id));
    
    return this.handleVoidResponse(
      this.client.delete(ApiEndpoints.Products.ById(id))
    );
  }

  /**
   * Delete multiple products
   */
  async deleteBatch(ids: number[]): Promise<boolean[]> {
    this.logApiCall('DELETE', 'Batch Products', { count: ids.length });
    
    const promises = ids.map(id => this.delete(id));
    return Promise.all(promises);
  }

  /**
   * Soft delete - set stock to 0 instead of deleting
   */
  async softDelete(id: number): Promise<boolean> {
    this.logApiCall('PATCH', `Soft Delete Product ${id}`);
    
    try {
      // Import here to avoid circular dependency
      const { productUpdateService } = await import('./update');
      await productUpdateService.updateStock(id, 0);
      return true;
    } catch (error) {
      console.error('Failed to soft delete product:', error);
      return false;
    }
  }

  /**
   * Check if product can be safely deleted
   */
  async canDelete(id: number): Promise<{
    canDelete: boolean;
    reason?: string;
    hasOrders?: boolean;
    isInActiveOrders?: boolean;
  }> {
    try {
      // This would require checking if product is in any orders
      // For now, we'll assume it can be deleted
      // In a real implementation, you'd check:
      // 1. If product is in any pending orders
      // 2. If product is in any active shopping carts
      // 3. If product has any dependencies
      
      return {
        canDelete: true,
        hasOrders: false,
        isInActiveOrders: false
      };
    } catch (error) {
      console.error('Error checking if product can be deleted:', error);
      return {
        canDelete: false,
        reason: 'Error checking product dependencies'
      };
    }
  }

  /**
   * Safe delete - checks dependencies before deleting
   */
  async safeDelete(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const deleteCheck = await this.canDelete(id);
      
      if (!deleteCheck.canDelete) {
        return {
          success: false,
          message: deleteCheck.reason || 'Product cannot be deleted'
        };
      }

      const deleted = await this.delete(id);
      
      if (deleted) {
        return {
          success: true,
          message: 'Product deleted successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to delete product'
        };
      }
    } catch (error) {
      console.error('Error during safe delete:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Archive product (soft delete with archive flag)
   */
  async archive(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Set stock to 0 and add archive tag
      const { productUpdateService } = await import('./update');
      
      await productUpdateService.updateStock(id, 0);
      await productUpdateService.addTags(id, ['archived']);
      
      return {
        success: true,
        message: 'Product archived successfully'
      };
    } catch (error) {
      console.error('Error archiving product:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to archive product'
      };
    }
  }

  /**
   * Restore archived product
   */
  async restore(id: number, newStock: number = 1): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { productUpdateService } = await import('./update');
      
      await productUpdateService.updateStock(id, newStock);
      await productUpdateService.removeTags(id, ['archived']);
      
      return {
        success: true,
        message: 'Product restored successfully'
      };
    } catch (error) {
      console.error('Error restoring product:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to restore product'
      };
    }
  }

  /**
   * Delete all products in a collection
   */
  async deleteByCollection(collectionId: number): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    try {
      // Get all products in the collection
      const { productGetService } = await import('./get');
      const products = await productGetService.getByCollection(collectionId);
      
      if (products.length === 0) {
        return {
          success: true,
          message: 'No products found in collection',
          deletedCount: 0
        };
      }

      // Delete all products
      const productIds = products.map(p => p.id);
      const results = await this.deleteBatch(productIds);
      const deletedCount = results.filter(result => result).length;
      
      return {
        success: deletedCount === products.length,
        message: `Deleted ${deletedCount} of ${products.length} products`,
        deletedCount
      };
    } catch (error) {
      console.error('Error deleting products by collection:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete products',
        deletedCount: 0
      };
    }
  }

  /**
   * Delete out of stock products
   */
  async deleteOutOfStock(): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    try {
      const { productGetService } = await import('./get');
      const outOfStockProducts = await productGetService.getOutOfStock();
      
      if (outOfStockProducts.length === 0) {
        return {
          success: true,
          message: 'No out of stock products found',
          deletedCount: 0
        };
      }

      const productIds = outOfStockProducts.map(p => p.id);
      const results = await this.deleteBatch(productIds);
      const deletedCount = results.filter(result => result).length;
      
      return {
        success: deletedCount === outOfStockProducts.length,
        message: `Deleted ${deletedCount} out of stock products`,
        deletedCount
      };
    } catch (error) {
      console.error('Error deleting out of stock products:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete out of stock products',
        deletedCount: 0
      };
    }
  }
}

// Export singleton instance
export const productDeleteService = new ProductDeleteService();
