// Wholesale Buyer Services
export { WholesaleBuyerGetService, wholesaleBuyerGetService } from './get';
export { WholesaleBuyerPostService, wholesaleBuyerPostService } from './post';
export { WholesaleBuyerDeleteService, wholesaleBuyerDeleteService } from './delete';

// Combined Wholesale Buyer Service
import { wholesaleBuyerGetService } from './get';
import { wholesaleBuyerPostService } from './post';
import { wholesaleBuyerDeleteService } from './delete';

export class WholesaleBuyerService {
  get = wholesaleBuyerGetService;
  post = wholesaleBuyerPostService;
  delete = wholesaleBuyerDeleteService;
}

// Export singleton instance
export const wholesaleBuyerService = new WholesaleBuyerService();
