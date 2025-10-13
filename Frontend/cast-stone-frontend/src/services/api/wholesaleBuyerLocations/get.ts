import { BaseService } from '../../config/baseService';
import { ApiResponse } from '../../../types';
import { WholesaleBuyerLocation } from '../../types/entities';

export class WholesaleBuyerLocationGetService extends BaseService {
  /**
   * Get all wholesale buyer locations or filter by wholesaleBuyerId
   */
  async getAll(wholesaleBuyerId?: number): Promise<ApiResponse<WholesaleBuyerLocation[]>> {
    const url = wholesaleBuyerId 
      ? `/wholesale-buyer-locations?wholesaleBuyerId=${wholesaleBuyerId}`
      : '/wholesale-buyer-locations';
    return this.client.get<WholesaleBuyerLocation[]>(url);
  }

  /**
   * Get a specific wholesale buyer location by ID
   */
  async getById(id: number): Promise<ApiResponse<WholesaleBuyerLocation>> {
    return this.client.get<WholesaleBuyerLocation>(`/wholesale-buyer-locations/${id}`);
  }
}

