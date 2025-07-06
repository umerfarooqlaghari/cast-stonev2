/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from './httpClient';
import { ApiResponse, PaginatedResponse } from './apiConfig';

export abstract class BaseService {
  protected client = httpClient;

  /**
   * Handle API response and extract data
   */
  protected async handleResponse<T>(
    apiCall: Promise<ApiResponse<T>>
  ): Promise<T> {
    try {
      const response = await apiCall;
      if (response.success && response.data !== undefined) {
        return response.data;
      }
      throw new Error(response.message || 'API call failed');
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Handle paginated API response
   */
  protected async handlePaginatedResponse<T>(
    apiCall: Promise<ApiResponse<PaginatedResponse<T>>>
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await apiCall;
      if (response.success && response.data !== undefined) {
        return response.data;
      }
      throw new Error(response.message || 'API call failed');
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Handle API response without data extraction (for operations like delete)
   */
  protected async handleVoidResponse(
    apiCall: Promise<ApiResponse<any>>
  ): Promise<boolean> {
    try {
      const response = await apiCall;
      return response.success;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Log API calls in development
   */
  protected logApiCall(method: string, endpoint: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 API ${method}:`, endpoint, data ? { data } : '');
    }
  }
}

// Utility functions for common operations
export class ServiceUtils {
  /**
   * Format date for API calls
   */
  static formatDate(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parse API date string to Date object
   */
  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Debounce function for search inputs
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Clean undefined values from objects (useful for API params)
   */
  static cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
    const cleaned: Partial<T> = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key as keyof T] = value;
      }
    });
    return cleaned;
  }
}
