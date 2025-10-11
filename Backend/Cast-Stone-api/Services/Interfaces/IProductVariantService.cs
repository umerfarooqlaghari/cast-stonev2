using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IProductVariantService : IBaseService<ProductVariant, ProductVariantResponse, CreateProductVariantRequest, UpdateProductVariantRequest>
{
    Task<IEnumerable<ProductVariantResponse>> GetByProductIdAsync(int productId);
    Task<IEnumerable<ProductVariantResponse>> GetByVariantNameAsync(string variantName);
    Task<IEnumerable<ProductVariantResponse>> GetByVariantTagAsync(string tag);
    Task<IEnumerable<ProductVariantResponse>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice);
    Task<IEnumerable<ProductVariantResponse>> GetFilteredAsync(ProductVariantFilterRequest filter);
}

