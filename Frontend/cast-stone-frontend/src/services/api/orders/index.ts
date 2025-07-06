// Order Services
export { OrderGetService, orderGetService } from './get';
export { OrderPostService, orderPostService } from './post';
export { OrderUpdateService, orderUpdateService } from './update';
export { OrderDeleteService, orderDeleteService } from './delete';

// Combined Order Service
import { orderGetService } from './get';
import { orderPostService } from './post';
import { orderUpdateService } from './update';
import { orderDeleteService } from './delete';

export class OrderService {
  get = orderGetService;
  post = orderPostService;
  update = orderUpdateService;
  delete = orderDeleteService;
}

// Export singleton instance
export const orderService = new OrderService();
