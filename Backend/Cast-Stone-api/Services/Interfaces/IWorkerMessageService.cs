using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IWorkerMessageService : IBaseService<WorkerMessage, WorkerMessageResponse, CreateWorkerMessageRequest, UpdateWorkerMessageRequest>
{
    Task<WorkerMessageResponse?> GetByCollectionIdAsync(int collectionId);
    Task<IEnumerable<WorkerMessageResponse>> GetActiveAsync();
    Task<IEnumerable<WorkerMessageResponse>> GetByCollectionIdAllAsync(int collectionId);
}

