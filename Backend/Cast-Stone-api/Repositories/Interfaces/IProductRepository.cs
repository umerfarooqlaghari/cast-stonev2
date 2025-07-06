using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IProductRepository : IBaseRepository<Product>
{
    Task<IEnumerable<Product>> GetByCollectionIdAsync(int collectionId);
    Task<IEnumerable<Product>> GetInStockAsync();
    Task<IEnumerable<Product>> GetOutOfStockAsync();
    Task<IEnumerable<Product>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice);
    Task<IEnumerable<Product>> SearchByNameAsync(string name);
    Task<IEnumerable<Product>> GetByTagAsync(string tag);
    Task<IEnumerable<Product>> GetFeaturedAsync(int count = 10);
    Task<IEnumerable<Product>> GetLatestAsync(int count = 10);
    Task<bool> IsInStockAsync(int id, int quantity = 1);
    Task UpdateStockAsync(int id, int newStock);
    Task<Product?> GetWithCollectionAsync(int id);
    Task<(IEnumerable<Product> Products, int TotalCount)> GetFilteredAsync(ProductFilterRequest filter);
}
