import { BaseService } from '../../config/baseService';

export class WorkerMessageDeleteService extends BaseService {
  /**
   * Delete a worker message by ID
   */
  async delete(id: number): Promise<boolean> {
    this.logApiCall('DELETE', `/api/workermessages/${id}`);
    
    return this.handleVoidResponse(
      this.client.delete(`/api/workermessages/${id}`)
    );
  }
}

export const workerMessageDeleteService = new WorkerMessageDeleteService();

