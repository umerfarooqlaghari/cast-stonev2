import { BaseService, ServiceUtils } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { 
  Collection, 
  CollectionHierarchy, 
  CollectionFilterRequest,
  PaginatedResponse 
} from '../../types/entities';

export class CollectionGetService extends BaseService {
  /**
   * Get all collections
   */
  async getAll(): Promise<Collection[]> {
    this.logApiCall('GET', ApiEndpoints.Collections.Base);
    return this.handleResponse(
      this.client.get<Collection[]>(ApiEndpoints.Collections.Base)
    );
  }

  /**
   * Get collection by ID
   */
  async getById(id: number): Promise<Collection> {
    this.logApiCall('GET', ApiEndpoints.Collections.ById(id));
    return this.handleResponse(
      this.client.get<Collection>(ApiEndpoints.Collections.ById(id))
    );
  }

  /**
   * Get collections by level
   */
  async getByLevel(level: number): Promise<Collection[]> {
    this.logApiCall('GET', ApiEndpoints.Collections.ByLevel(level));
    return this.handleResponse(
      this.client.get<Collection[]>(ApiEndpoints.Collections.ByLevel(level))
    );
  }

  /**
   * Get children of a collection
   */
  async getChildren(parentId: number): Promise<Collection[]> {
    this.logApiCall('GET', ApiEndpoints.Collections.Children(parentId));
    return this.handleResponse(
      this.client.get<Collection[]>(ApiEndpoints.Collections.Children(parentId))
    );
  }

  /**
   * Get collection hierarchy
   */
  async getHierarchy(): Promise<CollectionHierarchy[]> {
    this.logApiCall('GET', ApiEndpoints.Collections.Hierarchy);
    return this.handleResponse(
      this.client.get<CollectionHierarchy[]>(ApiEndpoints.Collections.Hierarchy)
    );
  }

  /**
   * Get published collections
   */
  async getPublished(): Promise<Collection[]> {
    this.logApiCall('GET', ApiEndpoints.Collections.Published);
    return this.handleResponse(
      this.client.get<Collection[]>(ApiEndpoints.Collections.Published)
    );
  }

  /**
   * Search collections by name
   */
  async search(name: string): Promise<Collection[]> {
    this.logApiCall('GET', ApiEndpoints.Collections.Search, { name });
    return this.handleResponse(
      this.client.get<Collection[]>(ApiEndpoints.Collections.Search, { name })
    );
  }

  /**
   * Get collections with advanced filtering and pagination
   */
  async getFiltered(filters: CollectionFilterRequest): Promise<PaginatedResponse<Collection>> {
    const cleanFilters = ServiceUtils.cleanObject(filters);
    this.logApiCall('GET', ApiEndpoints.Collections.Filter, cleanFilters);
    
    return this.handlePaginatedResponse(
      this.client.get<PaginatedResponse<Collection>>(
        ApiEndpoints.Collections.Filter, 
        cleanFilters
      )
    );
  }

  /**
   * Get collections with default pagination
   */
  async getPaginated(
    pageNumber: number = 1, 
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<Collection>> {
    const filters: CollectionFilterRequest = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    };
    
    return this.getFiltered(filters);
  }

  /**
   * Get root collections (level 1)
   */
  async getRootCollections(): Promise<Collection[]> {
    return this.getByLevel(1);
  }

  /**
   * Get collections by tag
   */
  async getByTag(tag: string): Promise<Collection[]> {
    const filters: CollectionFilterRequest = {
      tag,
      pageSize: 100 // Get all matching collections
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get collections created by specific user
   */
  async getByCreatedBy(createdBy: string): Promise<Collection[]> {
    const filters: CollectionFilterRequest = {
      createdBy,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get collections created within date range
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<Collection[]> {
    const filters: CollectionFilterRequest = {
      createdAfter: ServiceUtils.formatDate(startDate),
      createdBefore: ServiceUtils.formatDate(endDate),
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }
}

// Export singleton instance
export const collectionGetService = new CollectionGetService();
