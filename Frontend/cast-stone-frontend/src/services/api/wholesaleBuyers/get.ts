import { BaseService } from '../../config/baseService';
import { ApiResponse } from '../../../types';
import { WholesaleBuyer, WholesaleBuyerSummary } from '../../types/entities';

export class WholesaleBuyerGetService extends BaseService {
  /**
   * Get all wholesale buyer applications
   */
  async getAll(): Promise<ApiResponse<WholesaleBuyer[]>> {
    return this.get<WholesaleBuyer[]>('/api/wholesalebuyers');
  }

  /**
   * Get wholesale buyer application by ID
   */
  async getById(id: number): Promise<ApiResponse<WholesaleBuyer>> {
    return this.get<WholesaleBuyer>(`/api/wholesalebuyers/${id}`);
  }

  /**
   * Get wholesale buyer application by email
   */
  async getByEmail(email: string): Promise<ApiResponse<WholesaleBuyer>> {
    return this.get<WholesaleBuyer>(`/api/wholesalebuyers/email/${encodeURIComponent(email)}`);
  }

  /**
   * Get wholesale buyer applications by status
   */
  async getByStatus(status: string): Promise<ApiResponse<WholesaleBuyer[]>> {
    return this.get<WholesaleBuyer[]>(`/api/wholesalebuyers/status/${status}`);
  }

  /**
   * Get pending wholesale buyer applications
   */
  async getPending(): Promise<ApiResponse<WholesaleBuyer[]>> {
    return this.get<WholesaleBuyer[]>('/api/wholesalebuyers/pending');
  }

  /**
   * Get approved wholesale buyers
   */
  async getApproved(): Promise<ApiResponse<WholesaleBuyer[]>> {
    return this.get<WholesaleBuyer[]>('/api/wholesalebuyers/approved');
  }

  /**
   * Get recent wholesale buyer applications
   */
  async getRecent(count: number = 10): Promise<ApiResponse<WholesaleBuyerSummary[]>> {
    return this.get<WholesaleBuyerSummary[]>(`/api/wholesalebuyers/recent?count=${count}`);
  }

  /**
   * Check if user is an approved wholesale buyer
   */
  async checkApproval(email: string): Promise<ApiResponse<boolean>> {
    return this.get<boolean>(`/api/wholesalebuyers/check-approval/${encodeURIComponent(email)}`);
  }
}

// Export singleton instance
export const wholesaleBuyerGetService = new WholesaleBuyerGetService();
