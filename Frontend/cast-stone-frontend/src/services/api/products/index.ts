// Product Services
export { ProductGetService, productGetService } from './get';
export { ProductPostService, productPostService } from './post';
export { ProductUpdateService, productUpdateService } from './update';
export { ProductDeleteService, productDeleteService } from './delete';

// Combined Product Service
import { productGetService } from './get';
import { productPostService } from './post';
import { productUpdateService } from './update';
import { productDeleteService } from './delete';

export class ProductService {
  get = productGetService;
  post = productPostService;
  update = productUpdateService;
  delete = productDeleteService;
}

// Export singleton instance
export const productService = new ProductService();
