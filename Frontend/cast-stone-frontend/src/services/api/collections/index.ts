// Collection Services
export { CollectionGetService, collectionGetService } from './get';
export { CollectionPostService, collectionPostService } from './post';
export { CollectionUpdateService, collectionUpdateService } from './update';
export { CollectionDeleteService, collectionDeleteService } from './delete';

// Combined Collection Service
import { collectionGetService } from './get';
import { collectionPostService } from './post';
import { collectionUpdateService } from './update';
import { collectionDeleteService } from './delete';

export class CollectionService {
  get = collectionGetService;
  post = collectionPostService;
  update = collectionUpdateService;
  delete = collectionDeleteService;
}

// Export singleton instance
export const collectionService = new CollectionService();
