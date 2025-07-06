import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';

export class SeedService extends BaseService {
  /**
   * Seed all data (statuses, admin user, sample collections and products)
   */
  async seedAll(): Promise<{
    success: boolean;
    message: string;
  }> {
    this.logApiCall('POST', ApiEndpoints.Seed.All);
    
    try {
      const response = await this.client.post(ApiEndpoints.Seed.All);
      return {
        success: response.success,
        message: response.message || 'All data seeded successfully'
      };
    } catch (error) {
      console.error('Error seeding all data:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to seed data'
      };
    }
  }

  /**
   * Seed status data
   */
  async seedStatuses(): Promise<{
    success: boolean;
    message: string;
  }> {
    this.logApiCall('POST', ApiEndpoints.Seed.Statuses);
    
    try {
      const response = await this.client.post(ApiEndpoints.Seed.Statuses);
      return {
        success: response.success,
        message: response.message || 'Status data seeded successfully'
      };
    } catch (error) {
      console.error('Error seeding statuses:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to seed statuses'
      };
    }
  }

  /**
   * Seed admin user
   */
  async seedAdminUser(): Promise<{
    success: boolean;
    message: string;
  }> {
    this.logApiCall('POST', ApiEndpoints.Seed.AdminUser);
    
    try {
      const response = await this.client.post(ApiEndpoints.Seed.AdminUser);
      return {
        success: response.success,
        message: response.message || 'Admin user seeded successfully'
      };
    } catch (error) {
      console.error('Error seeding admin user:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to seed admin user'
      };
    }
  }

  /**
   * Seed sample collections
   */
  async seedCollections(): Promise<{
    success: boolean;
    message: string;
  }> {
    this.logApiCall('POST', ApiEndpoints.Seed.Collections);
    
    try {
      const response = await this.client.post(ApiEndpoints.Seed.Collections);
      return {
        success: response.success,
        message: response.message || 'Sample collections seeded successfully'
      };
    } catch (error) {
      console.error('Error seeding collections:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to seed collections'
      };
    }
  }

  /**
   * Seed sample products
   */
  async seedProducts(): Promise<{
    success: boolean;
    message: string;
  }> {
    this.logApiCall('POST', ApiEndpoints.Seed.Products);
    
    try {
      const response = await this.client.post(ApiEndpoints.Seed.Products);
      return {
        success: response.success,
        message: response.message || 'Sample products seeded successfully'
      };
    } catch (error) {
      console.error('Error seeding products:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to seed products'
      };
    }
  }

  /**
   * Initialize database with all required data
   */
  async initializeDatabase(): Promise<{
    success: boolean;
    message: string;
    steps: Array<{
      step: string;
      success: boolean;
      message: string;
    }>;
  }> {
    const steps: Array<{
      step: string;
      success: boolean;
      message: string;
    }> = [];

    try {
      // Step 1: Seed statuses
      const statusResult = await this.seedStatuses();
      steps.push({
        step: 'Seed Statuses',
        success: statusResult.success,
        message: statusResult.message
      });

      // Step 2: Seed admin user
      const adminResult = await this.seedAdminUser();
      steps.push({
        step: 'Seed Admin User',
        success: adminResult.success,
        message: adminResult.message
      });

      // Step 3: Seed collections
      const collectionsResult = await this.seedCollections();
      steps.push({
        step: 'Seed Collections',
        success: collectionsResult.success,
        message: collectionsResult.message
      });

      // Step 4: Seed products
      const productsResult = await this.seedProducts();
      steps.push({
        step: 'Seed Products',
        success: productsResult.success,
        message: productsResult.message
      });

      const allSuccessful = steps.every(step => step.success);

      return {
        success: allSuccessful,
        message: allSuccessful 
          ? 'Database initialized successfully' 
          : 'Database initialization completed with some errors',
        steps
      };
    } catch (error) {
      console.error('Error initializing database:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to initialize database',
        steps
      };
    }
  }

  /**
   * Check if database needs seeding
   */
  async checkSeedingStatus(): Promise<{
    needsSeeding: boolean;
    missingData: string[];
  }> {
    try {
      // This would require additional endpoints to check data existence
      // For now, we'll return a placeholder response
      return {
        needsSeeding: false,
        missingData: []
      };
    } catch (error) {
      console.error('Error checking seeding status:', error);
      return {
        needsSeeding: true,
        missingData: ['Unable to check status']
      };
    }
  }

  /**
   * Reset and reseed database (development only)
   */
  async resetAndReseed(): Promise<{
    success: boolean;
    message: string;
  }> {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        message: 'Reset and reseed is not allowed in production'
      };
    }

    try {
      // This would require additional endpoints to clear data
      // For now, we'll just seed all data
      return await this.seedAll();
    } catch (error) {
      console.error('Error resetting and reseeding:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset and reseed'
      };
    }
  }
}

// Export singleton instance
export const seedService = new SeedService();
