/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { WorkerMessage } from '../../types/entities';

export class WorkerMessageGetService extends BaseService {
  /**
   * Get all worker messages
   */
  async getAll(): Promise<WorkerMessage[]> {
    this.logApiCall('GET', '/workermessages');
    return this.handleResponse(
      this.client.get<WorkerMessage[]>('/workermessages')
    );
  }

  /**
   * Get worker message by ID
   */
  async getById(id: number): Promise<WorkerMessage> {
    this.logApiCall('GET', `/workermessages/${id}`);
    return this.handleResponse(
      this.client.get<WorkerMessage>(`/workermessages/${id}`)
    );
  }

  /**
   * Get worker message by collection ID
   */
  async getByCollectionId(collectionId: number): Promise<WorkerMessage> {
    this.logApiCall('GET', `/workermessages/collection/${collectionId}`);
    return this.handleResponse(
      this.client.get<WorkerMessage>(`/workermessages/collection/${collectionId}`)
    );
  }

  /**
   * Get all active worker messages
   */
  async getActive(): Promise<WorkerMessage[]> {
    this.logApiCall('GET', '/workermessages/active/all');
    return this.handleResponse(
      this.client.get<WorkerMessage[]>('/workermessages/active/all')
    );
  }
}

export const workerMessageGetService = new WorkerMessageGetService();

