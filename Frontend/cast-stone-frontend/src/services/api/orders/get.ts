import { BaseService, ServiceUtils } from '../../config/baseService';
import { ApiEndpoints, PaginatedResponse } from '../../config/apiConfig';
import { 
  Order, 
  OrderSummary, 
  OrderFilterRequest,
   
} from '../../types/entities';

export class OrderGetService extends BaseService {
  /**
   * Get all orders (summary)
   */
  async getAll(): Promise<OrderSummary[]> {
    this.logApiCall('GET', ApiEndpoints.Orders.Base);
    return this.handleResponse(
      this.client.get<OrderSummary[]>(ApiEndpoints.Orders.Base)
    );
  }

  /**
   * Get order by ID
   */
  async getById(id: number): Promise<Order> {
    this.logApiCall('GET', ApiEndpoints.Orders.ById(id));
    return this.handleResponse(
      this.client.get<Order>(ApiEndpoints.Orders.ById(id))
    );
  }

  /**
   * Get order with full details
   */
  async getDetails(id: number): Promise<Order> {
    this.logApiCall('GET', ApiEndpoints.Orders.Details(id));
    return this.handleResponse(
      this.client.get<Order>(ApiEndpoints.Orders.Details(id))
    );
  }

  /**
   * Get orders by user ID
   */
  async getByUser(userId: number): Promise<Order[]> {
    this.logApiCall('GET', ApiEndpoints.Orders.ByUser(userId));
    return this.handleResponse(
      this.client.get<Order[]>(ApiEndpoints.Orders.ByUser(userId))
    );
  }

  /**
   * Get orders by email
   */
  async getByEmail(email: string): Promise<Order[]> {
    this.logApiCall('GET', ApiEndpoints.Orders.ByEmail(email));
    return this.handleResponse(
      this.client.get<Order[]>(ApiEndpoints.Orders.ByEmail(email))
    );
  }

  /**
   * Get orders by status
   */
  async getByStatus(statusId: number): Promise<Order[]> {
    this.logApiCall('GET', ApiEndpoints.Orders.ByStatus(statusId));
    return this.handleResponse(
      this.client.get<Order[]>(ApiEndpoints.Orders.ByStatus(statusId))
    );
  }

  /**
   * Get pending orders
   */
  async getPending(): Promise<Order[]> {
    this.logApiCall('GET', ApiEndpoints.Orders.Pending);
    return this.handleResponse(
      this.client.get<Order[]>(ApiEndpoints.Orders.Pending)
    );
  }

  /**
   * Get recent orders
   */
  async getRecent(count: number = 10): Promise<OrderSummary[]> {
    this.logApiCall('GET', ApiEndpoints.Orders.Recent, { count });
    return this.handleResponse(
      this.client.get<OrderSummary[]>(ApiEndpoints.Orders.Recent, { count })
    );
  }

  /**
   * Get total revenue
   */
  async getTotalRevenue(): Promise<number> {
    this.logApiCall('GET', ApiEndpoints.Orders.Revenue.Total);
    return this.handleResponse(
      this.client.get<number>(ApiEndpoints.Orders.Revenue.Total)
    );
  }

  /**
   * Get revenue by date range
   */
  async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const params = {
      startDate: ServiceUtils.formatDate(startDate),
      endDate: ServiceUtils.formatDate(endDate)
    };
    
    this.logApiCall('GET', ApiEndpoints.Orders.Revenue.Range, params);
    return this.handleResponse(
      this.client.get<number>(ApiEndpoints.Orders.Revenue.Range, params)
    );
  }

  /**
   * Get orders with advanced filtering and pagination
   */
  async getFiltered(filters: OrderFilterRequest): Promise<PaginatedResponse<Order>> {
    const cleanFilters = ServiceUtils.cleanObject(filters);
    this.logApiCall('GET', ApiEndpoints.Orders.Filter, cleanFilters);
    
    return this.handlePaginatedResponse(
      this.client.get<PaginatedResponse<Order>>(
        ApiEndpoints.Orders.Filter, 
        cleanFilters
      )
    );
  }

  /**
   * Get orders with default pagination
   */
  async getPaginated(
    pageNumber: number = 1, 
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<Order>> {
    const filters: OrderFilterRequest = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    };
    
    return this.getFiltered(filters);
  }

  /**
   * Get orders by amount range
   */
  async getByAmountRange(minAmount: number, maxAmount: number): Promise<Order[]> {
    const filters: OrderFilterRequest = {
      minAmount,
      maxAmount,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get orders by payment method
   */
  async getByPaymentMethod(paymentMethod: string): Promise<Order[]> {
    const filters: OrderFilterRequest = {
      paymentMethod,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get orders by country
   */
  async getByCountry(country: string): Promise<Order[]> {
    const filters: OrderFilterRequest = {
      country,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get orders by city
   */
  async getByCity(city: string): Promise<Order[]> {
    const filters: OrderFilterRequest = {
      city,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get orders created within date range
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const filters: OrderFilterRequest = {
      createdAfter: ServiceUtils.formatDate(startDate),
      createdBefore: ServiceUtils.formatDate(endDate),
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get orders by multiple statuses
   */
  async getByStatuses(statusIds: number[]): Promise<Order[]> {
    const promises = statusIds.map(statusId => this.getByStatus(statusId));
    const results = await Promise.all(promises);
    
    // Flatten and remove duplicates
    const allOrders = results.flat();
    const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex(o => o.id === order.id)
    );
    
    return uniqueOrders;
  }

  /**
   * Get user's order history with pagination
   */
  async getUserOrderHistory(
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Order>> {
    const filters: OrderFilterRequest = {
      userId,
      pageNumber,
      pageSize,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    };
    
    return this.getFiltered(filters);
  }

  /**
   * Get guest orders by email with pagination
   */
  async getGuestOrderHistory(
    email: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Order>> {
    const filters: OrderFilterRequest = {
      email,
      pageNumber,
      pageSize,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    };
    
    return this.getFiltered(filters);
  }

  /**
   * Get order statistics
   */
  async getStatistics(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    try {
      const [totalRevenue, pendingOrders, allOrders] = await Promise.all([
        this.getTotalRevenue(),
        this.getPending(),
        this.getAll()
      ]);

      const totalOrders = allOrders.length;
      const completedOrders = allOrders.filter(order => 
        order.statusName.toLowerCase().includes('delivered') || 
        order.statusName.toLowerCase().includes('completed')
      ).length;

      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        pendingOrders: pendingOrders.length,
        completedOrders
      };
    } catch (error) {
      console.error('Error getting order statistics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const orderGetService = new OrderGetService();
