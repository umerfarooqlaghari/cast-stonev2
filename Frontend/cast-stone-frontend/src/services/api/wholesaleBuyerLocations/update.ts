import { BaseService } from '../../config/baseService';
import { ApiResponse } from '../../../types';
import { WholesaleBuyerLocation, UpdateWholesaleBuyerLocationRequest } from '../../types/entities';

export class WholesaleBuyerLocationUpdateService extends BaseService {
  /**
   * Update an existing wholesale buyer location
   */
  async update(id: number, request: UpdateWholesaleBuyerLocationRequest): Promise<ApiResponse<WholesaleBuyerLocation>> {
    return this.client.put<WholesaleBuyerLocation>(`/wholesale-buyer-locations/${id}`, request);
  }
}

