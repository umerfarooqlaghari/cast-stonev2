import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { Collection, UpdateCollectionRequest } from '../../types/entities';

export class CollectionUpdateService extends BaseService {
  /**
   * Update an existing collection
   */
  async update(id: number, data: UpdateCollectionRequest): Promise<Collection> {
    this.logApiCall('PUT', ApiEndpoints.Collections.ById(id), data);
    
    // Validate required fields
    this.validateUpdateRequest(data);
    
    return this.handleResponse(
      this.client.put<Collection>(ApiEndpoints.Collections.ById(id), data)
    );
  }

  /**
   * Update collection name and description
   */
  async updateBasicInfo(
    id: number,
    name: string,
    description: string,
    updatedBy: string
  ): Promise<Collection> {
    // First get the current collection to preserve other fields
    const currentCollection = await this.client.get<Collection>(
      ApiEndpoints.Collections.ById(id)
    );

    if (!currentCollection.success || !currentCollection.data) {
      throw new Error('Collection not found');
    }

    const data: UpdateCollectionRequest = {
      name,
      description,
      level: currentCollection.data.level,
      parentCollectionId: currentCollection.data.parentCollectionId,
      childCollectionId: currentCollection.data.childCollectionId,
      tags: currentCollection.data.tags,
      published: currentCollection.data.published,
      updatedBy,
      images: []
    };

    return this.update(id, data);
  }

  /**
   * Update collection tags
   */
  async updateTags(
    id: number,
    tags: string[],
    updatedBy: string
  ): Promise<Collection> {
    const currentCollection = await this.client.get<Collection>(
      ApiEndpoints.Collections.ById(id)
    );

    if (!currentCollection.success || !currentCollection.data) {
      throw new Error('Collection not found');
    }

    const data: UpdateCollectionRequest = {
      name: currentCollection.data.name,
      description: currentCollection.data.description,
      level: currentCollection.data.level,
      parentCollectionId: currentCollection.data.parentCollectionId,
      childCollectionId: currentCollection.data.childCollectionId,
      tags,
      published: currentCollection.data.published,
      updatedBy,
      images: []
    };

    return this.update(id, data);
  }

  /**
   * Publish or unpublish a collection
   */
  async updatePublishStatus(
    id: number,
    published: boolean,
    updatedBy: string
  ): Promise<Collection> {
    const currentCollection = await this.client.get<Collection>(
      ApiEndpoints.Collections.ById(id)
    );

    if (!currentCollection.success || !currentCollection.data) {
      throw new Error('Collection not found');
    }

    const data: UpdateCollectionRequest = {
      name: currentCollection.data.name,
      description: currentCollection.data.description,
      level: currentCollection.data.level,
      parentCollectionId: currentCollection.data.parentCollectionId,
      childCollectionId: currentCollection.data.childCollectionId,
      tags: currentCollection.data.tags,
      published,
      updatedBy,
      images: []
    };

    return this.update(id, data);
  }

  /**
   * Move collection to different parent (change hierarchy)
   */
  async moveToParent(
    id: number,
    newParentId: number | undefined,
    newLevel: number,
    updatedBy: string
  ): Promise<Collection> {
    const currentCollection = await this.client.get<Collection>(
      ApiEndpoints.Collections.ById(id)
    );

    if (!currentCollection.success || !currentCollection.data) {
      throw new Error('Collection not found');
    }

    const data: UpdateCollectionRequest = {
      name: currentCollection.data.name,
      description: currentCollection.data.description,
      level: newLevel,
      parentCollectionId: newParentId,
      childCollectionId: currentCollection.data.childCollectionId,
      tags: currentCollection.data.tags,
      published: currentCollection.data.published,
      updatedBy,
      images: []
    };

    return this.update(id, data);
  }

  /**
   * Add tags to existing collection
   */
  async addTags(
    id: number,
    newTags: string[],
    updatedBy: string
  ): Promise<Collection> {
    const currentCollection = await this.client.get<Collection>(
      ApiEndpoints.Collections.ById(id)
    );

    if (!currentCollection.success || !currentCollection.data) {
      throw new Error('Collection not found');
    }

    const existingTags = currentCollection.data.tags || [];
    const uniqueTags = [...new Set([...existingTags, ...newTags])];

    return this.updateTags(id, uniqueTags, updatedBy);
  }

  /**
   * Remove tags from existing collection
   */
  async removeTags(
    id: number,
    tagsToRemove: string[],
    updatedBy: string
  ): Promise<Collection> {
    const currentCollection = await this.client.get<Collection>(
      ApiEndpoints.Collections.ById(id)
    );

    if (!currentCollection.success || !currentCollection.data) {
      throw new Error('Collection not found');
    }

    const existingTags = currentCollection.data.tags || [];
    const filteredTags = existingTags.filter(tag => !tagsToRemove.includes(tag));

    return this.updateTags(id, filteredTags, updatedBy);
  }

  /**
   * Validate update collection request
   */
  private validateUpdateRequest(data: UpdateCollectionRequest): void {
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

    if (!data.updatedBy || data.updatedBy.trim().length === 0) {
      throw new Error('UpdatedBy is required');
    }

    if (data.updatedBy.length > 100) {
      throw new Error('UpdatedBy must be 100 characters or less');
    }

    if (data.description && data.description.length > 1000) {
      throw new Error('Description must be 1000 characters or less');
    }
  }
}

// Export singleton instance
export const collectionUpdateService = new CollectionUpdateService();
