import { BaseService } from '../../config/baseService';
import { WorkerMessage, UpdateWorkerMessageRequest } from '../../types/entities';

export class WorkerMessageUpdateService extends BaseService {
  /**
   * Update an existing worker message
   */
  async update(id: number, data: UpdateWorkerMessageRequest): Promise<WorkerMessage> {
    this.logApiCall('PUT', `/workermessages/${id}`, data);
    
    if (!data.heading || !data.description || !data.imageUrl || !data.updatedBy) {
      throw new Error('Missing required fields: heading, description, imageUrl, updatedBy');
    }
    
    return this.handleResponse(
      this.client.put<WorkerMessage>(`/workermessages/${id}`, data)
    );
  }
}

export const workerMessageUpdateService = new WorkerMessageUpdateService();

