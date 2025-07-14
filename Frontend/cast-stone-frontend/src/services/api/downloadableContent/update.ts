import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { DownloadableContent, UpdateDownloadableContentRequest } from '../../types/entities';

export class DownloadableContentUpdateService extends BaseService {
  /**
   * Update downloadable content
   */
  async update(id: number, data: UpdateDownloadableContentRequest): Promise<DownloadableContent> {
    this.logApiCall('PUT', `${ApiEndpoints.DownloadableContent.Base}/${id}`, data);
    return this.handleResponse(this.client.put<DownloadableContent>(`${ApiEndpoints.DownloadableContent.Base}/${id}`, data));
  }

  /**
   * Delete downloadable content
   */
  async delete(id: number): Promise<void> {
    this.logApiCall('DELETE', `${ApiEndpoints.DownloadableContent.Base}/${id}`);
    return this.handleResponse(this.client.delete(`${ApiEndpoints.DownloadableContent.Base}/${id}`));
  }
}
