// Configuration and Base Services
export * from './config/apiConfig';
export * from './config/httpClient';
export * from './config/baseService';

// Type Definitions
export * from './types/entities';

// Individual Service Exports
export * from './api/collections';
export * from './api/products';
export * from './api/orders';
export * from './api/users';
export * from './api/cart';
export * from './api/payments';
export * from './api/seed';
export * from './api/contactForm';

// Combined API Service
import { collectionService } from './api/collections';
import { productService } from './api/products';
import { orderService } from './api/orders';
import { userService } from './api/users';
import { cartService } from './api/cart';
import { paymentService } from './api/payments';
import { seedService } from './api/seed';
import { contactFormService } from './api/contactForm';

export class ApiService {
  collections = collectionService;
  products = productService;
  orders = orderService;
  users = userService;
  cart = cartService;
  payments = paymentService;
  seed = seedService;
  contactForm = contactFormService;
}

// Export singleton instance
export const apiService = new ApiService();

// Default export for convenience
export default apiService;

// Re-export commonly used services for direct access
export {
  collectionService,
  productService,
  orderService,
  userService,
  cartService,
  paymentService,
  seedService,
  contactFormService
};

// Utility exports
export { ServiceUtils } from './config/baseService';
export { buildQueryString, ApiError } from './config/apiConfig';
