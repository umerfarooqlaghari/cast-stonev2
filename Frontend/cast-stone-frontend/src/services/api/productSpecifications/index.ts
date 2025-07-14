import { ProductSpecificationsGetService } from './get';
import { ProductSpecificationsPostService } from './post';
import { ProductSpecificationsUpdateService } from './update';

export class ProductSpecificationsService {
  public get = new ProductSpecificationsGetService();
  public post = new ProductSpecificationsPostService();
  public update = new ProductSpecificationsUpdateService();
}

export const productSpecificationsService = new ProductSpecificationsService();
