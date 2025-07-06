import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';

export class CollectionDeleteService extends BaseService {
  /**
   * Delete a collection by ID
   */
  async delete(id: number): Promise<boolean> {
    this.logApiCall('DELETE', ApiEndpoints.Collections.ById(id));
    
    return this.handleVoidResponse(
      this.client.delete(ApiEndpoints.Collections.ById(id))
    );
  }

  /**
   * Delete multiple collections
   */
  async deleteBatch(ids: number[]): Promise<boolean[]> {
    this.logApiCall('DELETE', 'Batch Collections', { count: ids.length });
    
    const promises = ids.map(id => this.delete(id));
    return Promise.all(promises);
  }

  /**
   * Soft delete - unpublish collection instead of deleting
   */
  async unpublish(id: number, updatedBy: string): Promise<boolean> {
    this.logApiCall('PATCH', `Unpublish Collection ${id}`);
    
    try {
      // Import here to avoid circular dependency
      const { collectionUpdateService } = await import('./update');
      await collectionUpdateService.updatePublishStatus(id, false, updatedBy);
      return true;
    } catch (error) {
      console.error('Failed to unpublish collection:', error);
      return false;
    }
  }

  /**
   * Check if collection can be safely deleted
   */
  async canDelete(id: number): Promise<{
    canDelete: boolean;
    reason?: string;
    hasChildren?: boolean;
    hasProducts?: boolean;
  }> {
    try {
      // Import here to avoid circular dependency
      const { collectionGetService } = await import('./get');
      
      // Check if collection has children
      const children = await collectionGetService.getChildren(id);
      const hasChildren = children.length > 0;

      // Get collection with products to check if it has products
      const collection = await collectionGetService.getById(id);
      const hasProducts = collection.products && collection.products.length > 0;

      const canDelete = !hasChildren && !hasProducts;
      
      let reason: string | undefined;
      if (!canDelete) {
        if (hasChildren && hasProducts) {
          reason = 'Collection has both child collections and products';
        } else if (hasChildren) {
          reason = 'Collection has child collections';
        } else if (hasProducts) {
          reason = 'Collection has products';
        }
      }

      return {
        canDelete,
        reason,
        hasChildren,
        hasProducts
      };
    } catch (error) {
      console.error('Error checking if collection can be deleted:', error);
      return {
        canDelete: false,
        reason: 'Error checking collection dependencies'
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
          message: deleteCheck.reason || 'Collection cannot be deleted'
        };
      }

      const deleted = await this.delete(id);
      
      if (deleted) {
        return {
          success: true,
          message: 'Collection deleted successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to delete collection'
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
   * Force delete with cascade (delete children and move products)
   * Note: This should be used with extreme caution
   */
  async forceDelete(
    id: number, 
    moveProductsToCollectionId?: number
  ): Promise<{
    success: boolean;
    message: string;
    deletedCollections?: number[];
    movedProducts?: number;
  }> {
    try {
      const { collectionGetService } = await import('./get');
      const deletedCollections: number[] = [];
      let movedProducts = 0;

      // Get collection details
      const collection = await collectionGetService.getById(id);
      
      // Move products to another collection if specified
      if (moveProductsToCollectionId && collection.products.length > 0) {
        // This would require product service - placeholder for now
        movedProducts = collection.products.length;
        console.warn('Product moving not implemented - would move', movedProducts, 'products');
      }

      // Delete children recursively
      const children = await collectionGetService.getChildren(id);
      for (const child of children) {
        const childResult = await this.forceDelete(child.id, moveProductsToCollectionId);
        if (childResult.success && childResult.deletedCollections) {
          deletedCollections.push(...childResult.deletedCollections);
        }
      }

      // Delete the collection itself
      const deleted = await this.delete(id);
      if (deleted) {
        deletedCollections.push(id);
      }

      return {
        success: deleted,
        message: deleted 
          ? `Successfully deleted collection and ${deletedCollections.length - 1} child collections`
          : 'Failed to delete collection',
        deletedCollections,
        movedProducts
      };
    } catch (error) {
      console.error('Error during force delete:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const collectionDeleteService = new CollectionDeleteService();
