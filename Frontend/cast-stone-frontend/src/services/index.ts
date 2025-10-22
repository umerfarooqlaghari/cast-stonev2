// Configuration and Base Services
export * from './config/apiConfig';
export * from './config/httpClient';
export * from './config/baseService';

// Type Definitions
export * from './types/entities';

// Individual Service Exports
export * from './api/collections';
export * from './api/products';
export * from './api/productSpecifications';
export * from './api/productDetails';
export * from './api/downloadableContent';
export * from './api/productVariants';
export * from './api/orders';
export * from './api/users';
export * from './api/cart';
export * from './api/payments';
export * from './api/seed';
export * from './api/contactForm';
export * from './api/wholesaleBuyers';
export * from './api/wholesaleBuyerLocations';
export * from './api/workerMessages';
export * from './api/auth';

// Combined API Service
import { collectionService } from './api/collections';
import { productService } from './api/products';
import { productSpecificationsService } from './api/productSpecifications';
import { productDetailsService } from './api/productDetails';
import { downloadableContentService } from './api/downloadableContent';
import { productVariantService } from './api/productVariants';
import { orderService } from './api/orders';
import { userService } from './api/users';
import { cartService } from './api/cart';
import { paymentService } from './api/payments';
import { seedService } from './api/seed';
import { contactFormService } from './api/contactForm';
import { wholesaleBuyerService } from './api/wholesaleBuyers';
import { wholesaleBuyerLocationService } from './api/wholesaleBuyerLocations';
import { workerMessageService } from './api/workerMessages';
import { authService } from './api/auth';

export class ApiService {
  collections = collectionService;
  products = productService;
  productSpecifications = productSpecificationsService;
  productDetails = productDetailsService;
  downloadableContent = downloadableContentService;
  productVariants = productVariantService;
  orders = orderService;
  users = userService;
  cart = cartService;
  payments = paymentService;
  seed = seedService;
  contactForm = contactFormService;
  wholesaleBuyers = wholesaleBuyerService;
  wholesaleBuyerLocations = wholesaleBuyerLocationService;
  workerMessages = workerMessageService;
  auth = authService;
}

// Export singleton instance
export const apiService = new ApiService();

// Default export for convenience
export default apiService;

// Re-export commonly used services for direct access
export {
  collectionService,
  productService,
  productVariantService,
  orderService,
  userService,
  cartService,
  paymentService,
  seedService,
  contactFormService,
  wholesaleBuyerService,
  wholesaleBuyerLocationService,
  workerMessageService,
  authService
};

// Utility exports
export { ServiceUtils } from './config/baseService';
export { buildQueryString, ApiError } from './config/apiConfig';
