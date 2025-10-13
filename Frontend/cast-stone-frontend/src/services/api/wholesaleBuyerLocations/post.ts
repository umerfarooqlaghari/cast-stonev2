import { BaseService } from '../../config/baseService';
import { ApiResponse } from '../../../types';
import { WholesaleBuyerLocation, CreateWholesaleBuyerLocationRequest } from '../../types/entities';

export class WholesaleBuyerLocationPostService extends BaseService {
  /**
   * Create a new wholesale buyer location
   */
  async create(request: CreateWholesaleBuyerLocationRequest): Promise<ApiResponse<WholesaleBuyerLocation>> {
    return this.client.post<WholesaleBuyerLocation>('/wholesale-buyer-locations', request);
  }
}

