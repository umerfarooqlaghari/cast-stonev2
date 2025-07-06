import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { UpdateOrderStatusRequest } from '../../types/entities';

export class OrderUpdateService extends BaseService {
  /**
   * Update order status
   */
  async updateStatus(id: number, statusId: number): Promise<boolean> {
    this.logApiCall('PATCH', ApiEndpoints.Orders.UpdateStatus(id), { statusId });
    
    const data: UpdateOrderStatusRequest = { statusId };
    
    return this.handleVoidResponse(
      this.client.patch(ApiEndpoints.Orders.UpdateStatus(id), data)
    );
  }

  /**
   * Cancel an order
   */
  async cancel(id: number): Promise<boolean> {
    this.logApiCall('PATCH', ApiEndpoints.Orders.Cancel(id));
    
    return this.handleVoidResponse(
      this.client.patch(ApiEndpoints.Orders.Cancel(id))
    );
  }

  /**
   * Mark order as confirmed
   */
  async confirm(id: number): Promise<boolean> {
    return this.updateStatus(id, 2); // Status ID 2 = Confirmed
  }

  /**
   * Mark order as processing
   */
  async markAsProcessing(id: number): Promise<boolean> {
    return this.updateStatus(id, 3); // Status ID 3 = Processing
  }

  /**
   * Mark order as shipped
   */
  async markAsShipped(id: number): Promise<boolean> {
    return this.updateStatus(id, 4); // Status ID 4 = Shipped
  }

  /**
   * Mark order as delivered
   */
  async markAsDelivered(id: number): Promise<boolean> {
    return this.updateStatus(id, 5); // Status ID 5 = Delivered
  }

  /**
   * Mark order as returned
   */
  async markAsReturned(id: number): Promise<boolean> {
    return this.updateStatus(id, 7); // Status ID 7 = Returned
  }

  /**
   * Mark order as refunded
   */
  async markAsRefunded(id: number): Promise<boolean> {
    return this.updateStatus(id, 8); // Status ID 8 = Refunded
  }

  /**
   * Update payment status to completed
   */
  async markPaymentCompleted(id: number): Promise<boolean> {
    return this.updateStatus(id, 10); // Status ID 10 = Payment Completed
  }

  /**
   * Update payment status to failed
   */
  async markPaymentFailed(id: number): Promise<boolean> {
    return this.updateStatus(id, 11); // Status ID 11 = Payment Failed
  }

  /**
   * Update payment status to refunded
   */
  async markPaymentRefunded(id: number): Promise<boolean> {
    return this.updateStatus(id, 12); // Status ID 12 = Payment Refunded
  }

  /**
   * Bulk update order statuses
   */
  async bulkUpdateStatus(orderIds: number[], statusId: number): Promise<{
    success: boolean;
    updatedCount: number;
    errors: string[];
  }> {
    this.logApiCall('PATCH', 'Bulk Update Order Status', { 
      orderIds, 
      statusId, 
      count: orderIds.length 
    });

    const results = await Promise.allSettled(
      orderIds.map(id => this.updateStatus(id, statusId))
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    const errors = results
      .filter(result => result.status === 'rejected')
      .map((result, index) => 
        `Order ${orderIds[index]}: ${result.status === 'rejected' ? result.reason : 'Unknown error'}`
      );

    return {
      success: successful === orderIds.length,
      updatedCount: successful,
      errors
    };
  }

  /**
   * Process order through workflow (pending -> confirmed -> processing)
   */
  async processOrder(id: number): Promise<{
    success: boolean;
    currentStatus: string;
    message: string;
  }> {
    try {
      // Get current order status
      const { orderGetService } = await import('./get');
      const order = await orderGetService.getById(id);

      switch (order.statusId) {
        case 1: // Pending
          await this.confirm(id);
          return {
            success: true,
            currentStatus: 'Confirmed',
            message: 'Order confirmed successfully'
          };

        case 2: // Confirmed
          await this.markAsProcessing(id);
          return {
            success: true,
            currentStatus: 'Processing',
            message: 'Order moved to processing'
          };

        case 3: // Processing
          await this.markAsShipped(id);
          return {
            success: true,
            currentStatus: 'Shipped',
            message: 'Order marked as shipped'
          };

        case 4: // Shipped
          await this.markAsDelivered(id);
          return {
            success: true,
            currentStatus: 'Delivered',
            message: 'Order marked as delivered'
          };

        default:
          return {
            success: false,
            currentStatus: order.status.statusName,
            message: 'Order cannot be processed further'
          };
      }
    } catch (error) {
      console.error('Error processing order:', error);
      return {
        success: false,
        currentStatus: 'Unknown',
        message: error instanceof Error ? error.message : 'Failed to process order'
      };
    }
  }

  /**
   * Reverse order status (for corrections)
   */
  async reverseStatus(id: number): Promise<{
    success: boolean;
    previousStatus: string;
    message: string;
  }> {
    try {
      const { orderGetService } = await import('./get');
      const order = await orderGetService.getById(id);

      let newStatusId: number;
      let statusName: string;

      switch (order.statusId) {
        case 5: // Delivered -> Shipped
          newStatusId = 4;
          statusName = 'Shipped';
          break;

        case 4: // Shipped -> Processing
          newStatusId = 3;
          statusName = 'Processing';
          break;

        case 3: // Processing -> Confirmed
          newStatusId = 2;
          statusName = 'Confirmed';
          break;

        case 2: // Confirmed -> Pending
          newStatusId = 1;
          statusName = 'Pending';
          break;

        default:
          return {
            success: false,
            previousStatus: order.status.statusName,
            message: 'Order status cannot be reversed'
          };
      }

      await this.updateStatus(id, newStatusId);

      return {
        success: true,
        previousStatus: statusName,
        message: `Order status reversed to ${statusName}`
      };
    } catch (error) {
      console.error('Error reversing order status:', error);
      return {
        success: false,
        previousStatus: 'Unknown',
        message: error instanceof Error ? error.message : 'Failed to reverse order status'
      };
    }
  }

  /**
   * Check if status update is valid
   */
  async canUpdateStatus(id: number, newStatusId: number): Promise<{
    canUpdate: boolean;
    reason?: string;
    currentStatus?: string;
  }> {
    try {
      const { orderGetService } = await import('./get');
      const order = await orderGetService.getById(id);

      // Define valid status transitions
      const validTransitions: Record<number, number[]> = {
        1: [2, 6], // Pending -> Confirmed, Cancelled
        2: [3, 6], // Confirmed -> Processing, Cancelled
        3: [4, 6], // Processing -> Shipped, Cancelled
        4: [5, 7], // Shipped -> Delivered, Returned
        5: [7],    // Delivered -> Returned
        6: [],     // Cancelled (final)
        7: [8],    // Returned -> Refunded
        8: []      // Refunded (final)
      };

      const allowedStatuses = validTransitions[order.statusId] || [];
      const canUpdate = allowedStatuses.includes(newStatusId);

      return {
        canUpdate,
        currentStatus: order.status.statusName,
        reason: canUpdate ? undefined : 'Invalid status transition'
      };
    } catch (error) {
      console.error('Error checking status update validity:', error);
      return {
        canUpdate: false,
        reason: 'Error checking order status'
      };
    }
  }

  /**
   * Safe status update with validation
   */
  async safeUpdateStatus(id: number, statusId: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const validation = await this.canUpdateStatus(id, statusId);

      if (!validation.canUpdate) {
        return {
          success: false,
          message: validation.reason || 'Status update not allowed'
        };
      }

      const updated = await this.updateStatus(id, statusId);

      return {
        success: updated,
        message: updated ? 'Order status updated successfully' : 'Failed to update order status'
      };
    } catch (error) {
      console.error('Error in safe status update:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const orderUpdateService = new OrderUpdateService();
