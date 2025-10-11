using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IProductVariantRepository : IBaseRepository<ProductVariant>
{
    Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId);
    Task<IEnumerable<ProductVariant>> GetByVariantNameAsync(string variantName);
    Task<IEnumerable<ProductVariant>> GetByVariantTagAsync(string tag);
    Task<IEnumerable<ProductVariant>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice);
    Task<IEnumerable<ProductVariant>> GetFilteredAsync(ProductVariantFilterRequest filter);
}

