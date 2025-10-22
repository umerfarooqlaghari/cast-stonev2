import { BaseService } from '../../config/baseService';
import { WorkerMessage, CreateWorkerMessageRequest } from '../../types/entities';

export class WorkerMessagePostService extends BaseService {
  /**
   * Create a new worker message
   */
  async create(data: CreateWorkerMessageRequest): Promise<WorkerMessage> {
    this.logApiCall('POST', '/workermessages', data);
    
    if (!data.heading || !data.description || !data.imageUrl || !data.createdBy) {
      throw new Error('Missing required fields: heading, description, imageUrl, createdBy');
    }
    
    return this.handleResponse(
      this.client.post<WorkerMessage>('/workermessages', data)
    );
  }
}

export const workerMessagePostService = new WorkerMessagePostService();

