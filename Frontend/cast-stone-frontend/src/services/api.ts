// API Configuration
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7069/api';
const API_BASE_URL = 'https://gracious-acceptance-production.up.railway.app';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Entity types will be added here as needed

// Generic API Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // API methods will be added here as needed
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Service functions will be added here as needed
