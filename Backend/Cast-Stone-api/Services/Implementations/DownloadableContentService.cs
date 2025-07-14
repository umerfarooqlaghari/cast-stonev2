using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class DownloadableContentService : IDownloadableContentService
{
    private readonly IDownloadableContentRepository _repository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public DownloadableContentService(IDownloadableContentRepository repository, IProductRepository productRepository, IMapper mapper)
    {
        _repository = repository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<DownloadableContentResponse?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity != null ? _mapper.Map<DownloadableContentResponse>(entity) : null;
    }

    public async Task<IEnumerable<DownloadableContentResponse>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<DownloadableContentResponse>>(entities);
    }

    public async Task<DownloadableContentResponse> CreateAsync(CreateDownloadableContentRequest request)
    {
        // Validate product exists
        if (!await _productRepository.ExistsAsync(request.ProductId))
        {
            throw new ArgumentException("Product does not exist");
        }

        // Check if downloadable content already exists for this product
        if (await _repository.ExistsByProductIdAsync(request.ProductId))
        {
            throw new ArgumentException("Downloadable content already exists for this product");
        }

        var entity = _mapper.Map<DownloadableContent>(request);
        var createdEntity = await _repository.AddAsync(entity);
        return _mapper.Map<DownloadableContentResponse>(createdEntity);
    }

    public async Task<DownloadableContentResponse?> UpdateAsync(int id, UpdateDownloadableContentRequest request)
    {
        var existingEntity = await _repository.GetByIdAsync(id);
        if (existingEntity == null)
            return null;

        _mapper.Map(request, existingEntity);
        var updatedEntity = await _repository.UpdateAsync(existingEntity);
        return _mapper.Map<DownloadableContentResponse>(updatedEntity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return false;

        await _repository.DeleteAsync(id);
        return true;
    }

    public async Task<DownloadableContentResponse?> GetByProductIdAsync(int productId)
    {
        var entity = await _repository.GetByProductIdAsync(productId);
        return entity != null ? _mapper.Map<DownloadableContentResponse>(entity) : null;
    }

    public async Task<bool> ExistsByProductIdAsync(int productId)
    {
        return await _repository.ExistsByProductIdAsync(productId);
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _repository.ExistsAsync(id);
    }
}
