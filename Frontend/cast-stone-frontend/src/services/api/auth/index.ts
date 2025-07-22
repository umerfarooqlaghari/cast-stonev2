import { BaseService } from '../../config/baseService';
import { ApiResponse } from '../../../types';
import { AuthenticationResult, LoginRequest, User } from '../../types/entities';

export class AuthService extends BaseService {
  /**
   * Validate user credentials for login
   */
  async login(request: LoginRequest): Promise<ApiResponse<AuthenticationResult>> {
    return this.post<AuthenticationResult>('/api/auth/login', request);
  }

  /**
   * Check if user is an approved wholesale buyer
   */
  async checkWholesaleStatus(email: string): Promise<ApiResponse<boolean>> {
    return this.get<boolean>(`/api/auth/check-wholesale-status/${encodeURIComponent(email)}`);
  }

  /**
   * Get user information by email
   */
  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/api/auth/user/${encodeURIComponent(email)}`);
  }
}

// Export singleton instance
export const authService = new AuthService();
