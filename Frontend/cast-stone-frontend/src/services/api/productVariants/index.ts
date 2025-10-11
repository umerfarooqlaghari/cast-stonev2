import { productVariantGetService } from './get';
import { productVariantPostService } from './post';
import { productVariantUpdateService } from './update';
import { productVariantDeleteService } from './delete';

export const productVariantService = {
  get: productVariantGetService,
  create: productVariantPostService,
  update: productVariantUpdateService,
  delete: productVariantDeleteService
};

export * from './get';
export * from './post';
export * from './update';
export * from './delete';

