import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { Collection, CreateCollectionRequest } from '../../types/entities';

export class CollectionPostService extends BaseService {
  /**
   * Create a new collection
   */
  async create(data: CreateCollectionRequest): Promise<Collection> {
    this.logApiCall('POST', ApiEndpoints.Collections.Base, data);
    
    // Validate required fields
    this.validateCreateRequest(data);
    
    return this.handleResponse(
      this.client.post<Collection>(ApiEndpoints.Collections.Base, data)
    );
  }

  /**
   * Create a root collection (Level 1)
   */
  async createRootCollection(
    name: string,
    description: string,
    tags: string[] = [],
    published: boolean = false,
    createdBy: string
  ): Promise<Collection> {
    const data: CreateCollectionRequest = {
      name,
      description,
      level: 1,
      parentCollectionId: undefined,
      childCollectionIds: undefined,
      tags,
      published,
      createdBy,
      images: []
    };

    return this.create(data);
  }

  /**
   * Create a sub-collection (Level 2 or 3)
   */
  async createSubCollection(
    name: string,
    description: string,
    level: 2 | 3,
    parentCollectionId: number,
    tags: string[] = [],
    published: boolean = false,
    createdBy: string
  ): Promise<Collection> {
    const data: CreateCollectionRequest = {
      name,
      description,
      level,
      parentCollectionId,
      childCollectionIds: undefined,
      tags,
      published,
      createdBy,
      images: []
    };

    return this.create(data);
  }

  /**
   * Create multiple collections in batch
   */
  async createBatch(collections: CreateCollectionRequest[]): Promise<Collection[]> {
    this.logApiCall('POST', 'Batch Collections', { count: collections.length });
    
    const promises = collections.map(collection => this.create(collection));
    return Promise.all(promises);
  }

  /**
   * Refresh parent-child relationships for all collections (maintenance operation)
   */
  async refreshAllRelationships(): Promise<{
    success: boolean;
    updatedCount: number;
    message: string;
  }> {
    this.logApiCall('POST', ApiEndpoints.Collections.RefreshRelationships);

    try {
      const response = await this.client.post<number>(ApiEndpoints.Collections.RefreshRelationships);

      if (response.success && response.data !== undefined) {
        return {
          success: true,
          updatedCount: response.data,
          message: response.message || `Updated ${response.data} collection relationships`
        };
      } else {
        return {
          success: false,
          updatedCount: 0,
          message: response.message || 'Failed to refresh relationships'
        };
      }
    } catch (error) {
      console.error('Error refreshing collection relationships:', error);
      return {
        success: false,
        updatedCount: 0,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Validate create collection request
   */
  private validateCreateRequest(data: CreateCollectionRequest): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Collection name is required');
    }

    if (data.name.length > 200) {
      throw new Error('Collection name must be 200 characters or less');
    }

    if (!data.level || data.level < 1 || data.level > 3) {
      throw new Error('Collection level must be 1, 2, or 3');
    }

    if (data.level === 1 && data.parentCollectionId) {
      throw new Error('Root collections (level 1) cannot have a parent');
    }

    if (data.level > 1 && !data.parentCollectionId) {
      throw new Error('Sub-collections (level 2-3) must have a parent');
    }

    if (!data.createdBy || data.createdBy.trim().length === 0) {
      throw new Error('CreatedBy is required');
    }

    if (data.createdBy.length > 100) {
      throw new Error('CreatedBy must be 100 characters or less');
    }

    if (data.description && data.description.length > 1000) {
      throw new Error('Description must be 1000 characters or less');
    }
  }
}

// Export singleton instance
export const collectionPostService = new CollectionPostService();
