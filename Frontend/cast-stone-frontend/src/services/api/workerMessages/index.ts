// WorkerMessage Services
export { WorkerMessageGetService, workerMessageGetService } from './get';
export { WorkerMessagePostService, workerMessagePostService } from './post';
export { WorkerMessageUpdateService, workerMessageUpdateService } from './update';
export { WorkerMessageDeleteService, workerMessageDeleteService } from './delete';

// Combined WorkerMessage Service
import { workerMessageGetService } from './get';
import { workerMessagePostService } from './post';
import { workerMessageUpdateService } from './update';
import { workerMessageDeleteService } from './delete';

export class WorkerMessageService {
  get = workerMessageGetService;
  post = workerMessagePostService;
  update = workerMessageUpdateService;
  delete = workerMessageDeleteService;
}

export const workerMessageService = new WorkerMessageService();

