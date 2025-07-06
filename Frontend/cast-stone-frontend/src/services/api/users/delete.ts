import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';

export class UserDeleteService extends BaseService {
  /**
   * Delete a user by ID
   */
  async delete(id: number): Promise<boolean> {
    this.logApiCall('DELETE', ApiEndpoints.Users.ById(id));
    
    return this.handleVoidResponse(
      this.client.delete(ApiEndpoints.Users.ById(id))
    );
  }

  /**
   * Delete multiple users
   */
  async deleteBatch(ids: number[]): Promise<boolean[]> {
    this.logApiCall('DELETE', 'Batch Users', { count: ids.length });
    
    const promises = ids.map(id => this.delete(id));
    return Promise.all(promises);
  }

  /**
   * Soft delete - deactivate user instead of deleting
   */
  async softDelete(id: number): Promise<boolean> {
    this.logApiCall('PATCH', `Soft Delete User ${id}`);
    
    try {
      const { userUpdateService } = await import('./update');
      await userUpdateService.deactivate(id);
      return true;
    } catch (error) {
      console.error('Failed to soft delete user:', error);
      return false;
    }
  }

  /**
   * Check if user can be safely deleted
   */
  async canDelete(id: number): Promise<{
    canDelete: boolean;
    reason?: string;
    hasOrders?: boolean;
    isAdmin?: boolean;
  }> {
    try {
      const { userGetService } = await import('./get');
      const user = await userGetService.getById(id);

      // Check if user is admin
      const isAdmin = user.role === 'admin';
      
      // Check if user has orders (this would require order service integration)
      // For now, we'll assume users can be deleted
      const hasOrders = false; // Would check order history

      // Admins typically shouldn't be deleted
      const canDelete = !isAdmin && !hasOrders;
      
      let reason: string | undefined;
      if (!canDelete) {
        if (isAdmin) {
          reason = 'Cannot delete admin users';
        } else if (hasOrders) {
          reason = 'Cannot delete users with order history';
        }
      }

      return {
        canDelete,
        reason,
        hasOrders,
        isAdmin
      };
    } catch (error) {
      console.error('Error checking if user can be deleted:', error);
      return {
        canDelete: false,
        reason: 'Error checking user dependencies'
      };
    }
  }

  /**
   * Safe delete - checks dependencies before deleting
   */
  async safeDelete(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const deleteCheck = await this.canDelete(id);
      
      if (!deleteCheck.canDelete) {
        return {
          success: false,
          message: deleteCheck.reason || 'User cannot be deleted'
        };
      }

      const deleted = await this.delete(id);
      
      if (deleted) {
        return {
          success: true,
          message: 'User deleted successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to delete user'
        };
      }
    } catch (error) {
      console.error('Error during safe delete:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Archive user (soft delete with archive flag)
   */
  async archive(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Deactivate the user
      const { userUpdateService } = await import('./update');
      await userUpdateService.deactivate(id);
      
      return {
        success: true,
        message: 'User archived successfully'
      };
    } catch (error) {
      console.error('Error archiving user:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to archive user'
      };
    }
  }

  /**
   * Restore archived user
   */
  async restore(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { userUpdateService } = await import('./update');
      await userUpdateService.activate(id);
      
      return {
        success: true,
        message: 'User restored successfully'
      };
    } catch (error) {
      console.error('Error restoring user:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to restore user'
      };
    }
  }

  /**
   * Delete inactive users (cleanup operation)
   */
  async deleteInactiveUsers(inactiveDays: number = 365): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    try {
      const { userGetService } = await import('./get');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

      // Get inactive users
      const inactiveUsers = await userGetService.getInactive();
      
      // Filter users inactive for specified period
      const oldInactiveUsers = inactiveUsers.filter(user => 
        new Date(user.createdAt) < cutoffDate
      );

      if (oldInactiveUsers.length === 0) {
        return {
          success: true,
          message: `No inactive users older than ${inactiveDays} days found`,
          deletedCount: 0
        };
      }

      // Check which users can be safely deleted
      const deletableUsers: number[] = [];
      for (const user of oldInactiveUsers) {
        const canDelete = await this.canDelete(user.id);
        if (canDelete.canDelete) {
          deletableUsers.push(user.id);
        }
      }

      if (deletableUsers.length === 0) {
        return {
          success: false,
          message: 'No inactive users can be safely deleted',
          deletedCount: 0
        };
      }

      const results = await this.deleteBatch(deletableUsers);
      const deletedCount = results.filter(result => result).length;
      
      return {
        success: deletedCount === deletableUsers.length,
        message: `Deleted ${deletedCount} inactive users`,
        deletedCount
      };
    } catch (error) {
      console.error('Error deleting inactive users:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete inactive users',
        deletedCount: 0
      };
    }
  }

  /**
   * Delete guest users (cleanup operation)
   */
  async deleteGuestUsers(): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    try {
      const { userGetService } = await import('./get');
      const guestUsers = await userGetService.getByRole('guest');
      
      if (guestUsers.length === 0) {
        return {
          success: true,
          message: 'No guest users found',
          deletedCount: 0
        };
      }

      const userIds = guestUsers.map(user => user.id);
      const results = await this.deleteBatch(userIds);
      const deletedCount = results.filter(result => result).length;
      
      return {
        success: deletedCount === guestUsers.length,
        message: `Deleted ${deletedCount} guest users`,
        deletedCount
      };
    } catch (error) {
      console.error('Error deleting guest users:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete guest users',
        deletedCount: 0
      };
    }
  }

  /**
   * Anonymize user data (GDPR compliance)
   */
  async anonymize(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { userUpdateService } = await import('./update');
      
      // Replace personal data with anonymized values
      const anonymizedData = {
        role: 'customer',
        name: 'Anonymized User',
        phoneNumber: undefined,
        country: undefined,
        city: undefined,
        zipCode: undefined,
        active: false
      };

      await userUpdateService.update(id, anonymizedData);
      
      return {
        success: true,
        message: 'User data anonymized successfully'
      };
    } catch (error) {
      console.error('Error anonymizing user:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to anonymize user'
      };
    }
  }

  /**
   * Bulk soft delete (deactivate multiple users)
   */
  async bulkSoftDelete(ids: number[]): Promise<{
    success: boolean;
    deactivatedCount: number;
    errors: string[];
  }> {
    this.logApiCall('PATCH', 'Bulk Soft Delete Users', { count: ids.length });

    const results = await Promise.allSettled(
      ids.map(id => this.softDelete(id))
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    const errors = results
      .filter(result => result.status === 'rejected')
      .map((result, index) => 
        `User ${ids[index]}: ${result.status === 'rejected' ? result.reason : 'Unknown error'}`
      );

    return {
      success: successful === ids.length,
      deactivatedCount: successful,
      errors
    };
  }
}

// Export singleton instance
export const userDeleteService = new UserDeleteService();
