// Cart Services
export { CartGetService, cartGetService } from './get';
export { CartPostService, cartPostService } from './post';
export { CartUpdateService, cartUpdateService } from './update';
export { CartDeleteService, cartDeleteService } from './delete';

// Combined Cart Service
import { cartGetService } from './get';
import { cartPostService } from './post';
import { cartUpdateService } from './update';
import { cartDeleteService } from './delete';

export class CartService {
  get = cartGetService;
  post = cartPostService;
  update = cartUpdateService;
  delete = cartDeleteService;
}

// Export singleton instance
export const cartService = new CartService();
