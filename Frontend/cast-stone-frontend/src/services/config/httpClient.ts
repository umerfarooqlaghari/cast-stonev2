/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  BaseApiUrl, 
  ApiResponse, 
  HttpMethod, 
  RequestConfig, 
  ApiError, 
  defaultHeaders,
  buildQueryString 
} from './apiConfig';

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = BaseApiUrl) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod = HttpMethod.GET,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, ...requestConfig } = config;
    
    // Build URL with query parameters for GET requests
    let url = `${this.baseUrl}${endpoint}`;
    if (method === HttpMethod.GET && params) {
      url += buildQueryString(params);
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...defaultHeaders,
        ...requestConfig.headers,
      },
      ...requestConfig,
    };

    // Add body for non-GET requests
    if (method !== HttpMethod.GET && requestConfig.body) {
      if (typeof requestConfig.body === 'object') {
        requestOptions.body = JSON.stringify(requestConfig.body);
      }
    }

    try {
      const response = await fetch(url, requestOptions);
      
      // Handle different response types
      let responseData: ApiResponse<T>;
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        responseData = {
          success: response.ok,
          message: response.ok ? 'Success' : 'Error',
          data: text as any,
        };
      }

      if (!response.ok) {
        throw new ApiError(
          responseData.message || `HTTP error! status: ${response.status}`,
          response.status,
          responseData.errors
        );
      }

      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('API request failed:', error);
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, HttpMethod.GET, { params });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, HttpMethod.POST, {
      ...config,
      body: data,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, HttpMethod.PUT, {
      ...config,
      body: data,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, HttpMethod.PATCH, {
      ...config,
      body: data,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, HttpMethod.DELETE, config);
  }

  // Upload file (multipart/form-data)
  async upload<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<ApiResponse<T>> {
    const uploadConfig = {
      ...config,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...config?.headers,
      },
      body: formData,
    };
    
    // Remove Content-Type header for file uploads
    if (uploadConfig.headers && 'Content-Type' in uploadConfig.headers) {
      delete uploadConfig.headers['Content-Type'];
    }

    return this.request<T>(endpoint, HttpMethod.POST, uploadConfig);
  }
}

// Export singleton instance
export const httpClient = new HttpClient();

// Export class for custom instances if needed
export { HttpClient };
