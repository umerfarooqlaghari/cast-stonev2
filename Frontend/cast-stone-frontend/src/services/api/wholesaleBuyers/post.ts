import { BaseService } from '../../config/baseService';
import { ApiResponse } from '../../../types';
import { WholesaleBuyer, CreateWholesaleBuyerRequest, ApproveRejectRequest } from '../../types/entities';

export class WholesaleBuyerPostService extends BaseService {
  /**
   * Submit a new wholesale buyer application
   */
  async submitApplication(request: CreateWholesaleBuyerRequest): Promise<ApiResponse<WholesaleBuyer>> {
    return this.client.post<WholesaleBuyer>('/wholesalebuyers/apply', request);
  }

  /**
   * Approve a wholesale buyer application
   */
  async approveApplication(id: number, request: ApproveRejectRequest): Promise<ApiResponse<WholesaleBuyer>> {
    return this.client.put<WholesaleBuyer>(`/wholesalebuyers/${id}/approve`, request);
  }

  /**
   * Reject a wholesale buyer application
   */
  async rejectApplication(id: number, request: ApproveRejectRequest): Promise<ApiResponse<WholesaleBuyer>> {
    return this.client.put<WholesaleBuyer>(`/wholesalebuyers/${id}/reject`, request);
  }
}

// Export singleton instance
export const wholesaleBuyerPostService = new WholesaleBuyerPostService();
