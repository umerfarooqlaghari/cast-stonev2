import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { DownloadableContent, CreateDownloadableContentRequest } from '../../types/entities';

export class DownloadableContentPostService extends BaseService {
  /**
   * Create new downloadable content
   */
  async create(data: CreateDownloadableContentRequest): Promise<DownloadableContent> {
    this.logApiCall('POST', ApiEndpoints.DownloadableContent.Base, data);
    return this.handleResponse(this.client.post<DownloadableContent>(ApiEndpoints.DownloadableContent.Base, data));
  }
}
