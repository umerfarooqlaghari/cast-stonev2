/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiEndpoints } from '@/services/config/apiConfig';
import { BaseService, ServiceUtils } from '../../config/baseService';
// import { ApiEndpoints } from '../../config/apiConfig';
import { 
  User, 
  UserFilterRequest,
  PaginatedResponse 
} from '../../types/entities';

export class UserGetService extends BaseService {
  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    this.logApiCall('GET', ApiEndpoints.Users.Base);
    return this.handleResponse(
      this.client.get<User[]>(ApiEndpoints.Users.Base)
    );
  }

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<User> {
    this.logApiCall('GET', ApiEndpoints.Users.ById(id));
    return this.handleResponse(
      this.client.get<User>(ApiEndpoints.Users.ById(id))
    );
  }

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<User> {
    this.logApiCall('GET', ApiEndpoints.Users.ByEmail(email));
    return this.handleResponse(
      this.client.get<User>(ApiEndpoints.Users.ByEmail(email))
    );
  }

  /**
   * Get users by role
   */
  async getByRole(role: string): Promise<User[]> {
    this.logApiCall('GET', ApiEndpoints.Users.ByRole(role));
    return this.handleResponse(
      this.client.get<User[]>(ApiEndpoints.Users.ByRole(role))
    );
  }

  /**
   * Get active users
   */
  async getActive(): Promise<User[]> {
    this.logApiCall('GET', ApiEndpoints.Users.Active);
    return this.handleResponse(
      this.client.get<User[]>(ApiEndpoints.Users.Active)
    );
  }

  /**
   * Get recent users
   */
  async getRecent(count: number = 10): Promise<User[]> {
    this.logApiCall('GET', ApiEndpoints.Users.Recent, { count });
    return this.handleResponse(
      this.client.get<User[]>(ApiEndpoints.Users.Recent, { count })
    );
  }

  /**
   * Get user with orders
   */
  async getWithOrders(id: number): Promise<User> {
    this.logApiCall('GET', ApiEndpoints.Users.WithOrders(id));
    return this.handleResponse(
      this.client.get<User>(ApiEndpoints.Users.WithOrders(id))
    );
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    this.logApiCall('GET', ApiEndpoints.Users.EmailExists(email));
    return this.handleResponse(
      this.client.get<boolean>(ApiEndpoints.Users.EmailExists(email))
    );
  }

  /**
   * Get users with advanced filtering and pagination
   */
  async getFiltered(filters: UserFilterRequest): Promise<PaginatedResponse<User>> {
    const cleanFilters = ServiceUtils.cleanObject(filters);
    this.logApiCall('GET', ApiEndpoints.Users.Filter, cleanFilters);
    
    return this.handlePaginatedResponse(
      this.client.get<PaginatedResponse<User>>(
        ApiEndpoints.Users.Filter, 
        cleanFilters
      )
    );
  }

  /**
   * Get users with default pagination
   */
  async getPaginated(
    pageNumber: number = 1, 
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<User>> {
    const filters: UserFilterRequest = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    };
    
    return this.getFiltered(filters);
  }

  /**
   * Get admin users
   */
  async getAdmins(): Promise<User[]> {
    return this.getByRole('admin');
  }

  /**
   * Get customer users
   */
  async getCustomers(): Promise<User[]> {
    return this.getByRole('customer');
  }

  /**
   * Get inactive users
   */
  async getInactive(): Promise<User[]> {
    const filters: UserFilterRequest = {
      active: false,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get users by country
   */
  async getByCountry(country: string): Promise<User[]> {
    const filters: UserFilterRequest = {
      country,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get users by city
   */
  async getByCity(city: string): Promise<User[]> {
    const filters: UserFilterRequest = {
      city,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Search users by name
   */
  async searchByName(name: string): Promise<User[]> {
    const filters: UserFilterRequest = {
      name,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Search users by email pattern
   */
  async searchByEmail(emailPattern: string): Promise<User[]> {
    const filters: UserFilterRequest = {
      email: emailPattern,
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get users created within date range
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    const filters: UserFilterRequest = {
      createdAfter: ServiceUtils.formatDate(startDate),
      createdBefore: ServiceUtils.formatDate(endDate),
      pageSize: 100
    };
    
    const result = await this.getFiltered(filters);
    return result.data;
  }

  /**
   * Get user statistics
   */
  async getStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    adminUsers: number;
    customerUsers: number;
    recentSignups: number; // Last 30 days
  }> {
    try {
      const [allUsers, activeUsers, adminUsers, customerUsers] = await Promise.all([
        this.getAll(),
        this.getActive(),
        this.getAdmins(),
        this.getCustomers()
      ]);

      // Calculate recent signups (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentUsers = await this.getByDateRange(thirtyDaysAgo, new Date());

      return {
        totalUsers: allUsers.length,
        activeUsers: activeUsers.length,
        inactiveUsers: allUsers.length - activeUsers.length,
        adminUsers: adminUsers.length,
        customerUsers: customerUsers.length,
        recentSignups: recentUsers.length
      };
    } catch (error) {
      console.error('Error getting user statistics:', error);
      throw error;
    }
  }

  /**
   * Get user profile with additional data
   */
  async getProfile(id: number): Promise<{
    user: User;
    orderCount: number;
    totalSpent: number;
    lastOrderDate?: string;
  }> {
    try {
      const userWithOrders = await this.getWithOrders(id);
      
      // Calculate order statistics (this would require order data in the response)
      // For now, we'll return basic user data
      return {
        user: userWithOrders,
        orderCount: 0, // Would be calculated from orders
        totalSpent: 0, // Would be calculated from orders
        lastOrderDate: undefined // Would be from most recent order
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Validate user exists and is active
   */
  async validateUser(id: number): Promise<{
    exists: boolean;
    active: boolean;
    user?: User;
  }> {
    try {
      const user = await this.getById(id);
      return {
        exists: true,
        active: user.active,
        user
      };
    } catch (error) {
      return {
        exists: false,
        active: false
      };
    }
  }

  /**
   * Validate admin credentials
   */
  async validateAdminCredentials(email: string, password: string): Promise<User | null> {
    try {
      // First get the user by email
      const user = await this.getByEmail(email);

      // Check if user exists and is an admin
      if (!user || user.role !== 'admin' || !user.active) {
        return null;
      }

      // For now, we'll use a simple validation approach
      // In a real application, you'd want to implement proper JWT authentication
      // Since the backend doesn't have a login endpoint, we'll validate against known admin
      const isValidAdmin = email === 'mumerfarooqlaghari@gmail.com' && password === '132Trent@!';

      return isValidAdmin ? user : null;
    } catch (error) {
      console.error('Error validating admin credentials:', error);
      return null;
    }
  }
}

// Export singleton instance
export const userGetService = new UserGetService();
