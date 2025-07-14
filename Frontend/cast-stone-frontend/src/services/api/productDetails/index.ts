import { ProductDetailsGetService } from './get';
import { ProductDetailsPostService } from './post';
import { ProductDetailsUpdateService } from './update';

export class ProductDetailsService {
  public get = new ProductDetailsGetService();
  public post = new ProductDetailsPostService();
  public update = new ProductDetailsUpdateService();
}

export const productDetailsService = new ProductDetailsService();
