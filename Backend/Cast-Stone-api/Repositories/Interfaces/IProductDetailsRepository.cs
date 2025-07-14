using Cast_Stone_api.Domain.Models;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IProductDetailsRepository : IBaseRepository<ProductDetails>
{
    Task<ProductDetails?> GetByProductIdAsync(int productId);
    Task<bool> ExistsByProductIdAsync(int productId);
}
