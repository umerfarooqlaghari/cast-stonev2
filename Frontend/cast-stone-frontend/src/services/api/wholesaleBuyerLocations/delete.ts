import { BaseService } from '../../config/baseService';
import { ApiResponse } from '../../../types';

export class WholesaleBuyerLocationDeleteService extends BaseService {
  /**
   * Delete a wholesale buyer location
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/wholesale-buyer-locations/${id}`);
  }
}

