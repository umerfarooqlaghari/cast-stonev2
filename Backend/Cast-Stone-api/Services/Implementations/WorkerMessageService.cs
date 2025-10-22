using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class WorkerMessageService : IWorkerMessageService
{
    private readonly IBaseRepository<WorkerMessage> _repository;
    private readonly IMapper _mapper;

    public WorkerMessageService(IBaseRepository<WorkerMessage> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<WorkerMessageResponse?> GetByIdAsync(int id)
    {
        var workerMessage = await _repository.GetByIdAsync(id);
        return workerMessage != null ? _mapper.Map<WorkerMessageResponse>(workerMessage) : null;
    }

    public async Task<IEnumerable<WorkerMessageResponse>> GetAllAsync()
    {
        var workerMessages = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<WorkerMessageResponse>>(workerMessages);
    }

    public async Task<WorkerMessageResponse> CreateAsync(CreateWorkerMessageRequest request)
    {
        var workerMessage = _mapper.Map<WorkerMessage>(request);
        workerMessage.CreatedAt = DateTime.UtcNow;
        workerMessage.IsActive = true;

        var createdMessage = await _repository.AddAsync(workerMessage);
        return _mapper.Map<WorkerMessageResponse>(createdMessage);
    }

    public async Task<WorkerMessageResponse?> UpdateAsync(int id, UpdateWorkerMessageRequest request)
    {
        var workerMessage = await _repository.GetByIdAsync(id);
        if (workerMessage == null)
            return null;

        _mapper.Map(request, workerMessage);
        workerMessage.UpdatedAt = DateTime.UtcNow;

        var updatedMessage = await _repository.UpdateAsync(workerMessage);
        return _mapper.Map<WorkerMessageResponse>(updatedMessage);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var workerMessage = await _repository.GetByIdAsync(id);
        if (workerMessage == null)
            return false;

        await _repository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _repository.ExistsAsync(id);
    }

    public async Task<WorkerMessageResponse?> GetByCollectionIdAsync(int collectionId)
    {
        var workerMessage = await _repository.FirstOrDefaultAsync(wm => wm.CollectionId == collectionId && wm.IsActive);
        return workerMessage != null ? _mapper.Map<WorkerMessageResponse>(workerMessage) : null;
    }

    public async Task<IEnumerable<WorkerMessageResponse>> GetActiveAsync()
    {
        var workerMessages = await _repository.FindAsync(wm => wm.IsActive);
        return _mapper.Map<IEnumerable<WorkerMessageResponse>>(workerMessages);
    }

    public async Task<IEnumerable<WorkerMessageResponse>> GetByCollectionIdAllAsync(int collectionId)
    {
        var workerMessages = await _repository.FindAsync(wm => wm.CollectionId == collectionId);
        return _mapper.Map<IEnumerable<WorkerMessageResponse>>(workerMessages);
    }
}

