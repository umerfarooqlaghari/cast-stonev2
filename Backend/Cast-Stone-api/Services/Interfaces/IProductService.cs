using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IProductService : IBaseService<Domain.Models.Product, ProductResponse, CreateProductRequest, UpdateProductRequest>
{
    Task<IEnumerable<ProductResponse>> GetByCollectionIdAsync(int collectionId);
    Task<IEnumerable<ProductResponse>> GetInStockAsync();
    Task<IEnumerable<ProductResponse>> GetOutOfStockAsync();
    Task<IEnumerable<ProductResponse>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice);
    Task<IEnumerable<ProductResponse>> SearchByNameAsync(string name);
    Task<IEnumerable<ProductResponse>> GetByTagAsync(string tag);
    Task<IEnumerable<ProductSummaryResponse>> GetFeaturedAsync(int count = 10);
    Task<IEnumerable<ProductSummaryResponse>> GetLatestAsync(int count = 10);
    Task<bool> IsInStockAsync(int id, int quantity = 1);
    Task<bool> UpdateStockAsync(int id, int newStock);
    Task<bool> ReserveStockAsync(int id, int quantity);
    Task<bool> ReleaseStockAsync(int id, int quantity);
    Task<PaginatedResponse<ProductResponse>> GetFilteredAsync(ProductFilterRequest filter);

    // Wholesale pricing methods
    Task<ProductResponse?> GetByIdWithPricingAsync(int id, string? userEmail = null);
    Task<IEnumerable<ProductResponse>> GetAllWithPricingAsync(string? userEmail = null);
    Task<IEnumerable<ProductResponse>> GetByCollectionIdWithPricingAsync(int collectionId, string? userEmail = null);
    Task<IEnumerable<ProductSummaryResponse>> GetFeaturedWithPricingAsync(int count = 10, string? userEmail = null);
    Task<IEnumerable<ProductSummaryResponse>> GetLatestWithPricingAsync(int count = 10, string? userEmail = null);
}
