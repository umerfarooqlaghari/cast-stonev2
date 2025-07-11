using Cast_Stone_api.Domain.Models;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IProductSpecificationsRepository : IBaseRepository<ProductSpecifications>
{
    Task<ProductSpecifications?> GetByProductIdAsync(int productId);
    Task<bool> ExistsByProductIdAsync(int productId);
}
