/**
 * Usage Examples for Cast Stone API Services
 * 
 * This file demonstrates how to use the API services in your React components
 * or other parts of your application.
 */

import { 
  apiService, 
  collectionService, 
  productService, 
  orderService, 
  userService,
  seedService,
  ServiceUtils 
} from '../index';

// Example: Using Collections Service
export const collectionExamples = {
  // Get all collections
  async getAllCollections() {
    try {
      const collections = await collectionService.get.getAll();
      console.log('All collections:', collections);
      return collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },

  // Get collections with filtering and pagination
  async getFilteredCollections() {
    try {
      const result = await collectionService.get.getFiltered({
        level: 1,
        published: true,
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'name',
        sortDirection: 'asc'
      });
      
      console.log('Filtered collections:', result);
      return result;
    } catch (error) {
      console.error('Error fetching filtered collections:', error);
      throw error;
    }
  },

  // Create a new collection
  async createCollection() {
    try {
      const newCollection = await collectionService.post.create({
        name: 'New Stone Collection',
        description: 'A beautiful collection of natural stones',
        level: 1,
        tags: ['natural', 'premium'],
        published: true,
        createdBy: 'admin'
      });
      
      console.log('Created collection:', newCollection);
      return newCollection;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  // Update a collection
  async updateCollection(id: number) {
    try {
      const updatedCollection = await collectionService.update.update(id, {
        name: 'Updated Collection Name',
        description: 'Updated description',
        level: 1,
        tags: ['natural', 'premium', 'updated'],
        published: true,
        updatedBy: 'admin'
      });
      
      console.log('Updated collection:', updatedCollection);
      return updatedCollection;
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  }
};

// Example: Using Products Service
export const productExamples = {
  // Get products with filtering
  async getFilteredProducts() {
    try {
      const result = await productService.get.getFiltered({
        collectionId: 1,
        minPrice: 50,
        maxPrice: 200,
        inStock: true,
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'price',
        sortDirection: 'asc'
      });
      
      console.log('Filtered products:', result);
      return result;
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  },

  // Create a new product
  async createProduct() {
    try {
      const newProduct = await productService.post.create({
        name: 'Premium Marble Slab',
        description: 'High-quality marble slab for countertops',
        price: 129.99,
        stock: 15,
        collectionId: 1,
        images: ['marble-1.jpg', 'marble-2.jpg'],
        tags: ['marble', 'premium', 'countertop']
      });
      
      console.log('Created product:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product stock
  async updateProductStock(productId: number, newStock: number) {
    try {
      const success = await productService.update.updateStock(productId, newStock);
      console.log('Stock updated:', success);
      return success;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
};

// Example: Using Orders Service
export const orderExamples = {
  // Create a customer order
  async createCustomerOrder() {
    try {
      const newOrder = await orderService.post.createCustomerOrder(
        1, // userId
        'customer@example.com',
        [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ],
        {
          phoneNumber: '+1234567890',
          country: 'USA',
          city: 'New York',
          zipCode: '10001'
        },
        'Credit Card'
      );
      
      console.log('Created order:', newOrder);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Create a guest order
  async createGuestOrder() {
    try {
      const guestOrder = await orderService.post.createGuestOrder(
        'guest@example.com',
        [{ productId: 1, quantity: 1 }],
        {
          phoneNumber: '+1234567890',
          country: 'USA',
          city: 'Los Angeles',
          zipCode: '90210'
        },
        'PayPal'
      );
      
      console.log('Created guest order:', guestOrder);
      return guestOrder;
    } catch (error) {
      console.error('Error creating guest order:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: number, statusId: number) {
    try {
      const success = await orderService.update.updateStatus(orderId, statusId);
      console.log('Order status updated:', success);
      return success;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Get filtered orders
  async getFilteredOrders() {
    try {
      const result = await orderService.get.getFiltered({
        statusId: 1, // Pending orders
        minAmount: 100,
        country: 'USA',
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
      
      console.log('Filtered orders:', result);
      return result;
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
      throw error;
    }
  }
};

// Example: Using Users Service
export const userExamples = {
  // Create a new customer
  async createCustomer() {
    try {
      const newCustomer = await userService.post.createCustomer(
        'newcustomer@example.com',
        'SecurePassword123!',
        'John Doe',
        '+1234567890',
        {
          country: 'USA',
          city: 'Chicago',
          zipCode: '60601'
        }
      );
      
      console.log('Created customer:', newCustomer);
      return newCustomer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Get filtered users
  async getFilteredUsers() {
    try {
      const result = await userService.get.getFiltered({
        role: 'customer',
        active: true,
        country: 'USA',
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
      
      console.log('Filtered users:', result);
      return result;
    } catch (error) {
      console.error('Error fetching filtered users:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId: number) {
    try {
      const updatedUser = await userService.update.updateProfile(
        userId,
        'Updated Name',
        '+1987654321',
        {
          country: 'Canada',
          city: 'Toronto',
          zipCode: 'M5V 3A8'
        }
      );
      
      console.log('Updated user:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Example: Using Seed Service
export const seedExamples = {
  // Initialize database
  async initializeDatabase() {
    try {
      const result = await seedService.initializeDatabase();
      console.log('Database initialization result:', result);
      return result;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  },

  // Seed all data
  async seedAllData() {
    try {
      const result = await seedService.seedAll();
      console.log('Seed all result:', result);
      return result;
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  }
};

// Example: Using Combined API Service
export const combinedApiExamples = {
  // Get dashboard data
  async getDashboardData() {
    try {
      const [
        collections,
        featuredProducts,
        recentOrders,
        userStats
      ] = await Promise.all([
        apiService.collections.get.getPublished(),
        apiService.products.get.getFeatured(5),
        apiService.orders.get.getRecent(10),
        apiService.users.get.getStatistics()
      ]);

      return {
        collections,
        featuredProducts,
        recentOrders,
        userStats
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};

// Example: Using Service Utils
export const utilityExamples = {
  // Format currency
  formatPrice(amount: number) {
    return ServiceUtils.formatCurrency(amount);
  },

  // Validate email
  validateEmail(email: string) {
    return ServiceUtils.isValidEmail(email);
  },

  // Clean object for API params
  cleanFilters(filters: any) {
    return ServiceUtils.cleanObject(filters);
  },

  // Debounced search function
  createDebouncedSearch() {
    return ServiceUtils.debounce(async (query: string) => {
      if (query.length > 2) {
        const products = await productService.get.search(query);
        console.log('Search results:', products);
        return products;
      }
    }, 300);
  }
};
