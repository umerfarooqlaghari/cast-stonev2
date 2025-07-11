using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICollectionRepository _collectionRepository;
    private readonly IMapper _mapper;

    public ProductService(IProductRepository productRepository, ICollectionRepository collectionRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _collectionRepository = collectionRepository;
        _mapper = mapper;
    }

    public async Task<ProductResponse?> GetByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product != null ? _mapper.Map<ProductResponse>(product) : null;
    }

    public async Task<IEnumerable<ProductResponse>> GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<ProductResponse> CreateAsync(CreateProductRequest request)
    {
        // Validate collection exists
        if (!await _collectionRepository.ExistsAsync(request.CollectionId))
        {
            throw new ArgumentException("Collection does not exist");
        }

        var product = _mapper.Map<Product>(request);
        product.CreatedAt = DateTime.UtcNow;

        var createdProduct = await _productRepository.AddAsync(product);

        // Update collection's ProductIds
        await UpdateCollectionProductIds(request.CollectionId);

        return _mapper.Map<ProductResponse>(createdProduct);
    }

    public async Task<ProductResponse?> UpdateAsync(int id, UpdateProductRequest request)
    {
        var existingProduct = await _productRepository.GetByIdAsync(id);
        if (existingProduct == null)
            return null;

        var oldCollectionId = existingProduct.CollectionId;

        // Validate collection exists
        if (!await _collectionRepository.ExistsAsync(request.CollectionId))
        {
            throw new ArgumentException("Collection does not exist");
        }

        _mapper.Map(request, existingProduct);
        existingProduct.UpdatedAt = DateTime.UtcNow;

        var updatedProduct = await _productRepository.UpdateAsync(existingProduct);

        // Update collection ProductIds if collection changed
        if (oldCollectionId != request.CollectionId)
        {
            await UpdateCollectionProductIds(oldCollectionId);
            await UpdateCollectionProductIds(request.CollectionId);
        }
        else
        {
            await UpdateCollectionProductIds(request.CollectionId);
        }

        return _mapper.Map<ProductResponse>(updatedProduct);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            return false;

        var collectionId = product.CollectionId;
        await _productRepository.DeleteAsync(id);

        // Update collection's ProductIds after deletion
        await UpdateCollectionProductIds(collectionId);

        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _productRepository.ExistsAsync(id);
    }

    public async Task<IEnumerable<ProductResponse>> GetByCollectionIdAsync(int collectionId)
    {
        var products = await _productRepository.GetByCollectionIdAsync(collectionId);
        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<IEnumerable<ProductResponse>> GetInStockAsync()
    {
        var products = await _productRepository.GetInStockAsync();
        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<IEnumerable<ProductResponse>> GetOutOfStockAsync()
    {
        var products = await _productRepository.GetOutOfStockAsync();
        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<IEnumerable<ProductResponse>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        var products = await _productRepository.GetByPriceRangeAsync(minPrice, maxPrice);
        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<IEnumerable<ProductResponse>> SearchByNameAsync(string name)
    {
        var products = await _productRepository.SearchByNameAsync(name);
        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<IEnumerable<ProductResponse>> GetByTagAsync(string tag)
    {
        var products = await _productRepository.GetByTagAsync(tag);
        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<IEnumerable<ProductSummaryResponse>> GetFeaturedAsync(int count = 10)
    {
        var products = await _productRepository.GetFeaturedAsync(count);
        return _mapper.Map<IEnumerable<ProductSummaryResponse>>(products);
    }

    public async Task<IEnumerable<ProductSummaryResponse>> GetLatestAsync(int count = 10)
    {
        var products = await _productRepository.GetLatestAsync(count);
        return _mapper.Map<IEnumerable<ProductSummaryResponse>>(products);
    }

    public async Task<bool> IsInStockAsync(int id, int quantity = 1)
    {
        return await _productRepository.IsInStockAsync(id, quantity);
    }

    public async Task<bool> UpdateStockAsync(int id, int newStock)
    {
        if (newStock < 0)
            return false;

        await _productRepository.UpdateStockAsync(id, newStock);
        return true;
    }

    public async Task<bool> ReserveStockAsync(int id, int quantity)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null || product.Stock < quantity)
            return false;

        await _productRepository.UpdateStockAsync(id, product.Stock - quantity);
        return true;
    }

    public async Task<bool> ReleaseStockAsync(int id, int quantity)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            return false;

        await _productRepository.UpdateStockAsync(id, product.Stock + quantity);
        return true;
    }

    public async Task<PaginatedResponse<ProductResponse>> GetFilteredAsync(ProductFilterRequest filter)
    {
        var (products, totalCount) = await _productRepository.GetFilteredAsync(filter);
        var productResponses = _mapper.Map<IEnumerable<ProductResponse>>(products);

        var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

        return new PaginatedResponse<ProductResponse>
        {
            Data = productResponses,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalRecords = totalCount,
            TotalPages = totalPages,
            HasNextPage = filter.PageNumber < totalPages,
            HasPreviousPage = filter.PageNumber > 1
        };
    }

    /// <summary>
    /// Update the ProductIds array in a collection based on its actual products
    /// </summary>
    private async Task UpdateCollectionProductIds(int collectionId)
    {
        var collection = await _collectionRepository.GetByIdAsync(collectionId);
        if (collection == null) return;

        var products = await _productRepository.GetByCollectionIdAsync(collectionId);
        var productIds = products.Select(p => p.Id).ToList();

        collection.ProductIds = productIds.Any() ? productIds : null;
        await _collectionRepository.UpdateAsync(collection);
    }
}
