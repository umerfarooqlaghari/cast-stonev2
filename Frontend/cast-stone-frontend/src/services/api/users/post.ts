import { BaseService, ServiceUtils } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { User, CreateUserRequest } from '../../types/entities';

export class UserPostService extends BaseService {
  /**
   * Create a new user
   */
  async create(data: CreateUserRequest): Promise<User> {
    this.logApiCall('POST', ApiEndpoints.Users.Base, { ...data, password: '[HIDDEN]' });
    
    // Validate required fields
    this.validateCreateRequest(data);
    
    return this.handleResponse(
      this.client.post<User>(ApiEndpoints.Users.Base, data)
    );
  }

  /**
   * Create a customer user
   */
  async createCustomer(
    email: string,
    password: string,
    name?: string,
    phoneNumber?: string,
    address?: {
      country?: string;
      city?: string;
      zipCode?: string;
    }
  ): Promise<User> {
    const data: CreateUserRequest = {
      role: 'customer',
      email,
      password,
      name,
      phoneNumber,
      country: address?.country,
      city: address?.city,
      zipCode: address?.zipCode,
      active: true
    };

    return this.create(data);
  }

  /**
   * Create an admin user
   */
  async createAdmin(
    email: string,
    password: string,
    name?: string,
    phoneNumber?: string
  ): Promise<User> {
    const data: CreateUserRequest = {
      role: 'admin',
      email,
      password,
      name,
      phoneNumber,
      active: true
    };

    return this.create(data);
  }

  /**
   * Register a new customer (public registration)
   */
  async register(
    email: string,
    password: string,
    name?: string,
    phoneNumber?: string
  ): Promise<User> {
    // Check if email already exists
    const { userGetService } = await import('./get');
    const emailExists = await userGetService.emailExists(email);
    
    if (emailExists) {
      throw new Error('Email already exists');
    }

    return this.createCustomer(email, password, name, phoneNumber);
  }

  /**
   * Create guest user (for guest checkout)
   */
  async createGuest(email: string): Promise<User> {
    const data: CreateUserRequest = {
      role: 'guest',
      email,
      password: this.generateRandomPassword(), // Generate temporary password
      active: true
    };

    return this.create(data);
  }

  /**
   * Create multiple users in batch
   */
  async createBatch(users: CreateUserRequest[]): Promise<User[]> {
    this.logApiCall('POST', 'Batch Users', { count: users.length });
    
    const promises = users.map(user => this.create(user));
    return Promise.all(promises);
  }

  /**
   * Import users from CSV data
   */
  async importFromCsv(csvData: Array<{
    email: string;
    name?: string;
    role?: string;
    phoneNumber?: string;
    country?: string;
    city?: string;
    zipCode?: string;
  }>): Promise<{
    success: boolean;
    imported: number;
    failed: number;
    errors: string[];
  }> {
    const results = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const [index, userData] of csvData.entries()) {
      try {
        const createData: CreateUserRequest = {
          role: userData.role || 'customer',
          email: userData.email,
          password: this.generateRandomPassword(),
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          country: userData.country,
          city: userData.city,
          zipCode: userData.zipCode,
          active: true
        };

        await this.create(createData);
        results.imported++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    results.success = results.failed === 0;
    return results;
  }

  /**
   * Create user with email verification
   */
  async createWithVerification(data: CreateUserRequest): Promise<{
    user: User;
    verificationRequired: boolean;
    verificationToken?: string;
  }> {
    try {
      const user = await this.create(data);
      
      // In a real application, you would:
      // 1. Generate a verification token
      // 2. Send verification email
      // 3. Set user as inactive until verified
      
      return {
        user,
        verificationRequired: true,
        verificationToken: this.generateVerificationToken()
      };
    } catch (error) {
      console.error('Error creating user with verification:', error);
      throw error;
    }
  }

  /**
   * Create user with social login data
   */
  async createFromSocialLogin(
    provider: 'google' | 'facebook' | 'apple',
    socialId: string,
    email: string,
    name?: string
  ): Promise<User> {
    const data: CreateUserRequest = {
      role: 'customer',
      email,
      password: this.generateRandomPassword(), // Social users don't need password
      name,
      active: true
    };

    // In a real application, you would also store the social provider info
    return this.create(data);
  }

  /**
   * Generate random password for system-created users
   */
  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Generate verification token
   */
  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate create user request
   */
  private validateCreateRequest(data: CreateUserRequest): void {
    if (!data.email || !ServiceUtils.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

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

    // Password strength validation
    if (!this.isStrongPassword(data.password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Check password strength
   */
  private isStrongPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers;
  }
}

// Export singleton instance
export const userPostService = new UserPostService();
