/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { User, UpdateUserRequest } from '../../types/entities';

export class UserUpdateService extends BaseService {
  /**
   * Update an existing user
   */
  async update(id: number, data: UpdateUserRequest): Promise<User> {
    this.logApiCall('PUT', ApiEndpoints.Users.ById(id), data);
    
    // Validate required fields
    this.validateUpdateRequest(data);
    
    return this.handleResponse(
      this.client.put<User>(ApiEndpoints.Users.ById(id), data)
    );
  }

  /**
   * Activate a user
   */
  async activate(id: number): Promise<boolean> {
    this.logApiCall('PATCH', ApiEndpoints.Users.Activate(id));
    
    return this.handleVoidResponse(
      this.client.patch(ApiEndpoints.Users.Activate(id))
    );
  }

  /**
   * Deactivate a user
   */
  async deactivate(id: number): Promise<boolean> {
    this.logApiCall('PATCH', ApiEndpoints.Users.Deactivate(id));
    
    return this.handleVoidResponse(
      this.client.patch(ApiEndpoints.Users.Deactivate(id))
    );
  }

  /**
   * Update user profile information
   */
  async updateProfile(
    id: number,
    name?: string,
    phoneNumber?: string,
    address?: {
      country?: string;
      city?: string;
      zipCode?: string;
    }
  ): Promise<User> {
    const currentUser = await this.getCurrentUser(id);
    
    const data: UpdateUserRequest = {
      role: currentUser.role,
      name: name ?? currentUser.name,
      phoneNumber: phoneNumber ?? currentUser.phoneNumber,
      country: address?.country ?? currentUser.country,
      city: address?.city ?? currentUser.city,
      zipCode: address?.zipCode ?? currentUser.zipCode,
      active: currentUser.active
    };

    return this.update(id, data);
  }

  /**
   * Update user contact information
   */
  async updateContact(
    id: number,
    phoneNumber?: string,
    address?: {
      country?: string;
      city?: string;
      zipCode?: string;
    }
  ): Promise<User> {
    const currentUser = await this.getCurrentUser(id);
    
    const data: UpdateUserRequest = {
      role: currentUser.role,
      name: currentUser.name,
      phoneNumber: phoneNumber ?? currentUser.phoneNumber,
      country: address?.country ?? currentUser.country,
      city: address?.city ?? currentUser.city,
      zipCode: address?.zipCode ?? currentUser.zipCode,
      active: currentUser.active
    };

    return this.update(id, data);
  }

  /**
   * Update user role
   */
  async updateRole(id: number, newRole: string): Promise<User> {
    if (!['admin', 'customer', 'guest'].includes(newRole)) {
      throw new Error('Invalid role. Must be admin, customer, or guest');
    }

    const currentUser = await this.getCurrentUser(id);
    
    const data: UpdateUserRequest = {
      role: newRole,
      name: currentUser.name,
      phoneNumber: currentUser.phoneNumber,
      country: currentUser.country,
      city: currentUser.city,
      zipCode: currentUser.zipCode,
      active: currentUser.active
    };

    return this.update(id, data);
  }

  /**
   * Update user address
   */
  async updateAddress(
    id: number,
    country?: string,
    city?: string,
    zipCode?: string
  ): Promise<User> {
    const currentUser = await this.getCurrentUser(id);
    
    const data: UpdateUserRequest = {
      role: currentUser.role,
      name: currentUser.name,
      phoneNumber: currentUser.phoneNumber,
      country: country ?? currentUser.country,
      city: city ?? currentUser.city,
      zipCode: zipCode ?? currentUser.zipCode,
      active: currentUser.active
    };

    return this.update(id, data);
  }

  /**
   * Toggle user active status
   */
  async toggleActiveStatus(id: number): Promise<User> {
    const currentUser = await this.getCurrentUser(id);
    
    if (currentUser.active) {
      await this.deactivate(id);
    } else {
      await this.activate(id);
    }

    // Return updated user
    return this.getCurrentUser(id);
  }

  /**
   * Bulk update user roles
   */
  async bulkUpdateRole(userIds: number[], newRole: string): Promise<{
    success: boolean;
    updatedCount: number;
    errors: string[];
  }> {
    this.logApiCall('PUT', 'Bulk Update User Roles', { 
      userIds, 
      newRole, 
      count: userIds.length 
    });

    const results = await Promise.allSettled(
      userIds.map(id => this.updateRole(id, newRole))
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled'
    ).length;

    const errors = results
      .filter(result => result.status === 'rejected')
      .map((result, index) => 
        `User ${userIds[index]}: ${result.status === 'rejected' ? result.reason : 'Unknown error'}`
      );

    return {
      success: successful === userIds.length,
      updatedCount: successful,
      errors
    };
  }

  /**
   * Bulk activate users
   */
  async bulkActivate(userIds: number[]): Promise<{
    success: boolean;
    activatedCount: number;
    errors: string[];
  }> {
    this.logApiCall('PATCH', 'Bulk Activate Users', { 
      userIds, 
      count: userIds.length 
    });

    const results = await Promise.allSettled(
      userIds.map(id => this.activate(id))
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    const errors = results
      .filter(result => result.status === 'rejected')
      .map((result, index) => 
        `User ${userIds[index]}: ${result.status === 'rejected' ? result.reason : 'Unknown error'}`
      );

    return {
      success: successful === userIds.length,
      activatedCount: successful,
      errors
    };
  }

  /**
   * Bulk deactivate users
   */
  async bulkDeactivate(userIds: number[]): Promise<{
    success: boolean;
    deactivatedCount: number;
    errors: string[];
  }> {
    this.logApiCall('PATCH', 'Bulk Deactivate Users', { 
      userIds, 
      count: userIds.length 
    });

    const results = await Promise.allSettled(
      userIds.map(id => this.deactivate(id))
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    const errors = results
      .filter(result => result.status === 'rejected')
      .map((result, index) => 
        `User ${userIds[index]}: ${result.status === 'rejected' ? result.reason : 'Unknown error'}`
      );

    return {
      success: successful === userIds.length,
      deactivatedCount: successful,
      errors
    };
  }

  /**
   * Promote user to admin
   */
  async promoteToAdmin(id: number): Promise<User> {
    return this.updateRole(id, 'admin');
  }

  /**
   * Demote admin to customer
   */
  async demoteToCustomer(id: number): Promise<User> {
    return this.updateRole(id, 'customer');
  }

  /**
   * Update user preferences (placeholder for future implementation)
   */
  async updatePreferences(
    id: number,
    preferences: Record<string, any>
  ): Promise<User> {
    // This would require extending the user model to include preferences
    // For now, we'll just return the current user
    console.log('User preferences update not implemented:', preferences);
    return this.getCurrentUser(id);
  }

  /**
   * Get current user data
   */
  private async getCurrentUser(id: number): Promise<User> {
    const response = await this.client.get<User>(ApiEndpoints.Users.ById(id));
    
    if (!response.success || !response.data) {
      throw new Error('User not found');
    }
    
    return response.data;
  }

  /**
   * Validate update user request
   */
  private validateUpdateRequest(data: UpdateUserRequest): void {
    if (!data.role || !['admin', 'customer', 'guest'].includes(data.role)) {
      throw new Error('Valid role is required (admin, customer, or guest)');
    }

    // Validate phone number format if provided
    if (data.phoneNumber && !this.isValidPhoneNumber(data.phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    // Validate name length if provided
    if (data.name && data.name.length > 100) {
      throw new Error('Name must be 100 characters or less');
    }

    // Validate address fields if provided
    if (data.country && data.country.length > 100) {
      throw new Error('Country must be 100 characters or less');
    }

    if (data.city && data.city.length > 100) {
      throw new Error('City must be 100 characters or less');
    }

    if (data.zipCode && data.zipCode.length > 20) {
      throw new Error('Zip code must be 20 characters or less');
    }
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
}

// Export singleton instance
export const userUpdateService = new UserUpdateService();
