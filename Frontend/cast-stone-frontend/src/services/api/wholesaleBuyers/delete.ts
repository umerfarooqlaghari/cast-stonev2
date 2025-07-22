import { BaseService } from '../../config/baseService';
import { ApiResponse } from '../../../types';

export class WholesaleBuyerDeleteService extends BaseService {
  /**
   * Delete a wholesale buyer application
   */
  async deleteApplication(id: number): Promise<ApiResponse<boolean>> {
    return this.client.delete<boolean>(`/wholesalebuyers/${id}`);
  }
}

// Export singleton instance
export const wholesaleBuyerDeleteService = new WholesaleBuyerDeleteService();
