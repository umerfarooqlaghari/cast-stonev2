import { WholesaleBuyerLocationGetService } from './get';
import { WholesaleBuyerLocationPostService } from './post';
import { WholesaleBuyerLocationUpdateService } from './update';
import { WholesaleBuyerLocationDeleteService } from './delete';

class WholesaleBuyerLocationService {
  get = new WholesaleBuyerLocationGetService();
  post = new WholesaleBuyerLocationPostService();
  update = new WholesaleBuyerLocationUpdateService();
  delete = new WholesaleBuyerLocationDeleteService();
}

export const wholesaleBuyerLocationService = new WholesaleBuyerLocationService();
export * from './get';
export * from './post';
export * from './update';
export * from './delete';

