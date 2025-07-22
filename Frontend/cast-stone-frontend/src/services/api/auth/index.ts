import { BaseService } from '../../config/baseService';
import { ApiResponse } from '../../../types';
import { AuthenticationResult, LoginRequest, User } from '../../types/entities';

export class AuthService extends BaseService {
  /**
   * Validate user credentials for login
   */
  async login(request: LoginRequest): Promise<ApiResponse<AuthenticationResult>> {
    return this.client.post<AuthenticationResult>('/auth/login', request);
  }

  /**
   * Check if user is an approved wholesale buyer
   */
  async checkWholesaleStatus(email: string): Promise<ApiResponse<boolean>> {
    return this.client.get<boolean>(`/auth/check-wholesale-status/${encodeURIComponent(email)}`);
  }

  /**
   * Get user information by email
   */
  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    return this.client.get<User>(`/auth/user/${encodeURIComponent(email)}`);
  }
}

// Export singleton instance
export const authService = new AuthService();
