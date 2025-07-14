/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { DownloadableContent } from '../../types/entities';

export class DownloadableContentGetService extends BaseService {
  /**
   * Get all downloadable content
   */
  async getAll(): Promise<DownloadableContent[]> {
    this.logApiCall('GET', ApiEndpoints.DownloadableContent.Base);
    return this.handleResponse(this.client.get<DownloadableContent[]>(ApiEndpoints.DownloadableContent.Base));
  }

  /**
   * Get downloadable content by ID
   */
  async getById(id: number): Promise<DownloadableContent> {
    this.logApiCall('GET', `${ApiEndpoints.DownloadableContent.Base}/${id}`);
    return this.handleResponse(this.client.get<DownloadableContent>(`${ApiEndpoints.DownloadableContent.Base}/${id}`));
  }

  /**
   * Get downloadable content by product ID
   */
  async getByProductId(productId: number): Promise<DownloadableContent | null> {
    this.logApiCall('GET', `${ApiEndpoints.DownloadableContent.Base}/product/${productId}`);
    try {
      return await this.handleResponse(this.client.get<DownloadableContent>(`${ApiEndpoints.DownloadableContent.Base}/product/${productId}`));
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
