import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';

export class OrderDeleteService extends BaseService {
  /**
   * Delete an order by ID
   */
  async delete(id: number): Promise<boolean> {
    this.logApiCall('DELETE', ApiEndpoints.Orders.ById(id));
    
    return this.handleVoidResponse(
      this.client.delete(ApiEndpoints.Orders.ById(id))
    );
  }

  /**
   * Delete multiple orders
   */
  async deleteBatch(ids: number[]): Promise<boolean[]> {
    this.logApiCall('DELETE', 'Batch Orders', { count: ids.length });
    
    const promises = ids.map(id => this.delete(id));
    return Promise.all(promises);
  }

  /**
   * Check if order can be safely deleted
   */
  async canDelete(id: number): Promise<{
    canDelete: boolean;
    reason?: string;
    orderStatus?: string;
  }> {
    try {
      const { orderGetService } = await import('./get');
      const order = await orderGetService.getById(id);

      // Orders can typically only be deleted if they are:
      // - Pending (status 1)
      // - Cancelled (status 6)
      // - In some cases, failed payment orders
      const deletableStatuses = [1, 6, 11]; // Pending, Cancelled, Payment Failed

      const canDelete = deletableStatuses.includes(order.statusId);
      
      let reason: string | undefined;
      if (!canDelete) {
        switch (order.statusId) {
          case 2:
          case 3:
          case 4:
            reason = 'Cannot delete confirmed or processing orders';
            break;
          case 5:
            reason = 'Cannot delete delivered orders';
            break;
          case 7:
          case 8:
            reason = 'Cannot delete returned or refunded orders';
            break;
          default:
            reason = 'Order cannot be deleted in current status';
        }
      }

      return {
        canDelete,
        reason,
        orderStatus: order.status.statusName
      };
    } catch (error) {
      console.error('Error checking if order can be deleted:', error);
      return {
        canDelete: false,
        reason: 'Error checking order status'
      };
    }
  }

  /**
   * Safe delete - checks if order can be deleted first
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
          message: deleteCheck.reason || 'Order cannot be deleted'
        };
      }

      const deleted = await this.delete(id);
      
      if (deleted) {
        return {
          success: true,
          message: 'Order deleted successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to delete order'
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
   * Cancel order instead of deleting (safer option)
   */
  async cancelInsteadOfDelete(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { orderUpdateService } = await import('./update');
      const cancelled = await orderUpdateService.cancel(id);
      
      return {
        success: cancelled,
        message: cancelled 
          ? 'Order cancelled successfully' 
          : 'Failed to cancel order'
      };
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel order'
      };
    }
  }

  /**
   * Delete orders by status (bulk operation)
   */
  async deleteByStatus(statusId: number): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
    totalCount: number;
  }> {
    try {
      const { orderGetService } = await import('./get');
      const orders = await orderGetService.getByStatus(statusId);
      
      if (orders.length === 0) {
        return {
          success: true,
          message: 'No orders found with specified status',
          deletedCount: 0,
          totalCount: 0
        };
      }

      // Check if any orders can be deleted
      const deletableOrders: number[] = [];
      for (const order of orders) {
        const canDelete = await this.canDelete(order.id);
        if (canDelete.canDelete) {
          deletableOrders.push(order.id);
        }
      }

      if (deletableOrders.length === 0) {
        return {
          success: false,
          message: 'No orders can be deleted in current status',
          deletedCount: 0,
          totalCount: orders.length
        };
      }

      const results = await this.deleteBatch(deletableOrders);
      const deletedCount = results.filter(result => result).length;
      
      return {
        success: deletedCount === deletableOrders.length,
        message: `Deleted ${deletedCount} of ${deletableOrders.length} eligible orders`,
        deletedCount,
        totalCount: orders.length
      };
    } catch (error) {
      console.error('Error deleting orders by status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete orders',
        deletedCount: 0,
        totalCount: 0
      };
    }
  }

  /**
   * Delete old cancelled orders (cleanup operation)
   */
  async deleteOldCancelledOrders(olderThanDays: number = 30): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    try {
      const { orderGetService } = await import('./get');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      // Get cancelled orders
      const cancelledOrders = await orderGetService.getByStatus(6); // Status 6 = Cancelled
      
      // Filter orders older than cutoff date
      const oldOrders = cancelledOrders.filter(order => 
        new Date(order.createdAt) < cutoffDate
      );

      if (oldOrders.length === 0) {
        return {
          success: true,
          message: `No cancelled orders older than ${olderThanDays} days found`,
          deletedCount: 0
        };
      }

      const orderIds = oldOrders.map(order => order.id);
      const results = await this.deleteBatch(orderIds);
      const deletedCount = results.filter(result => result).length;
      
      return {
        success: deletedCount === oldOrders.length,
        message: `Deleted ${deletedCount} old cancelled orders`,
        deletedCount
      };
    } catch (error) {
      console.error('Error deleting old cancelled orders:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete old orders',
        deletedCount: 0
      };
    }
  }

  /**
   * Archive order instead of deleting (move to archive status)
   */
  async archive(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // This would require adding an "Archived" status to the system
      // For now, we'll use the existing status system
      const { orderUpdateService } = await import('./update');
      
      // Check if order can be archived (similar rules to deletion)
      const canDelete = await this.canDelete(id);
      if (!canDelete.canDelete) {
        return {
          success: false,
          message: canDelete.reason || 'Order cannot be archived'
        };
      }

      // In a real system, you might have a specific "Archived" status
      // For now, we'll just mark it as cancelled
      const archived = await orderUpdateService.cancel(id);
      
      return {
        success: archived,
        message: archived 
          ? 'Order archived successfully' 
          : 'Failed to archive order'
      };
    } catch (error) {
      console.error('Error archiving order:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to archive order'
      };
    }
  }
}

// Export singleton instance
export const orderDeleteService = new OrderDeleteService();
