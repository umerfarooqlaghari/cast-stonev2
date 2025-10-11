using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class ProductVariantService : IProductVariantService
{
    private readonly IProductVariantRepository _productVariantRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public ProductVariantService(
        IProductVariantRepository productVariantRepository,
        IProductRepository productRepository,
        IMapper mapper)
    {
        _productVariantRepository = productVariantRepository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ProductVariantResponse?> GetByIdAsync(int id)
    {
        var entity = await _productVariantRepository.GetByIdAsync(id);
        return entity != null ? _mapper.Map<ProductVariantResponse>(entity) : null;
    }

    public async Task<IEnumerable<ProductVariantResponse>> GetAllAsync()
    {
        var entities = await _productVariantRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<ProductVariantResponse>>(entities);
    }

    public async Task<ProductVariantResponse> CreateAsync(CreateProductVariantRequest request)
    {
        // Validate product exists
        if (!await _productRepository.ExistsAsync(request.ProductId))
        {
            throw new ArgumentException("Product does not exist");
        }

        var entity = _mapper.Map<ProductVariant>(request);
        entity.CreatedAt = DateTime.UtcNow;

        var createdEntity = await _productVariantRepository.AddAsync(entity);
        return _mapper.Map<ProductVariantResponse>(createdEntity);
    }

    public async Task<ProductVariantResponse?> UpdateAsync(int id, UpdateProductVariantRequest request)
    {
        var existingEntity = await _productVariantRepository.GetByIdAsync(id);
        if (existingEntity == null)
            return null;

        // Map the updated fields
        _mapper.Map(request, existingEntity);
        existingEntity.UpdatedAt = DateTime.UtcNow;

        var updatedEntity = await _productVariantRepository.UpdateAsync(existingEntity);
        return _mapper.Map<ProductVariantResponse>(updatedEntity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (!await _productVariantRepository.ExistsAsync(id))
            return false;

        await _productVariantRepository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _productVariantRepository.ExistsAsync(id);
    }

    public async Task<IEnumerable<ProductVariantResponse>> GetByProductIdAsync(int productId)
    {
        var entities = await _productVariantRepository.GetByProductIdAsync(productId);
        return _mapper.Map<IEnumerable<ProductVariantResponse>>(entities);
    }

    public async Task<IEnumerable<ProductVariantResponse>> GetByVariantNameAsync(string variantName)
    {
        var entities = await _productVariantRepository.GetByVariantNameAsync(variantName);
        return _mapper.Map<IEnumerable<ProductVariantResponse>>(entities);
    }

    public async Task<IEnumerable<ProductVariantResponse>> GetByVariantTagAsync(string tag)
    {
        var entities = await _productVariantRepository.GetByVariantTagAsync(tag);
        return _mapper.Map<IEnumerable<ProductVariantResponse>>(entities);
    }

    public async Task<IEnumerable<ProductVariantResponse>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        var entities = await _productVariantRepository.GetByPriceRangeAsync(minPrice, maxPrice);
        return _mapper.Map<IEnumerable<ProductVariantResponse>>(entities);
    }

    public async Task<IEnumerable<ProductVariantResponse>> GetFilteredAsync(ProductVariantFilterRequest filter)
    {
        var entities = await _productVariantRepository.GetFilteredAsync(filter);
        return _mapper.Map<IEnumerable<ProductVariantResponse>>(entities);
    }
}

