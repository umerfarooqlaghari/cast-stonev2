// API Configuration
export const BaseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5090/api';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// HTTP Methods
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

// API Endpoints
export const ApiEndpoints = {
  // Collections
  Collections: {
    Base: '/collections',
    ById: (id: number) => `/collections/${id}`,
    ByLevel: (level: number) => `/collections/level/${level}`,
    Children: (id: number) => `/collections/${id}/children`,
    Hierarchy: '/collections/hierarchy',
    Published: '/collections/published',
    Search: '/collections/search',
    Filter: '/collections/filter',
    RefreshRelationships: '/collections/refresh-relationships'
  },
  
  // Products
  Products: {
    Base: '/products',
    ById: (id: number) => `/products/${id}`,
    ByCollection: (collectionId: number) => `/products/collection/${collectionId}`,
    InStock: '/products/in-stock',
    Featured: '/products/featured',
    Latest: '/products/latest',
    Search: '/products/search',
    PriceRange: '/products/price-range',
    UpdateStock: (id: number) => `/products/${id}/stock`,
    Filter: '/products/filter'
  },
  
  // Orders
  Orders: {
    Base: '/orders',
    ById: (id: number) => `/orders/${id}`,
    ByUser: (userId: number) => `/orders/user/${userId}`,
    ByEmail: (email: string) => `/orders/email/${email}`,
    ByStatus: (statusId: number) => `/orders/status/${statusId}`,
    UpdateStatus: (id: number) => `/orders/${id}/status`,
    Cancel: (id: number) => `/orders/${id}/cancel`,
    Pending: '/orders/pending',
    Recent: '/orders/recent',
    Details: (id: number) => `/orders/${id}/details`,
    Revenue: {
      Total: '/orders/revenue/total',
      Range: '/orders/revenue/range'
    },
    Filter: '/orders/filter'
  },
  
  // Users
  Users: {
    Base: '/users',
    ById: (id: number) => `/users/${id}`,
    ByEmail: (email: string) => `/users/email/${email}`,
    ByRole: (role: string) => `/users/role/${role}`,
    Active: '/users/active',
    Recent: '/users/recent',
    Deactivate: (id: number) => `/users/${id}/deactivate`,
    Activate: (id: number) => `/users/${id}/activate`,
    WithOrders: (id: number) => `/users/${id}/orders`,
    EmailExists: (email: string) => `/users/email-exists/${email}`,
    Filter: '/users/filter'
  },
  
  // Seeding
  Seed: {
    All: '/seed/all',
    Statuses: '/seed/statuses',
    AdminUser: '/seed/admin-user',
    Collections: '/seed/collections',
    Products: '/seed/products'
  }
} as const;

// Request Configuration
export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility function to build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Default headers
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
