using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cast_Stone_api.Repositories.Implementations;

public class ProductSpecificationsRepository : BaseRepository<ProductSpecifications>, IProductSpecificationsRepository
{
    public ProductSpecificationsRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ProductSpecifications?> GetByProductIdAsync(int productId)
    {
        return await _dbSet
            .Include(ps => ps.Product)
            .FirstOrDefaultAsync(ps => ps.ProductId == productId);
    }

    public async Task<bool> ExistsByProductIdAsync(int productId)
    {
        return await _dbSet.AnyAsync(ps => ps.ProductId == productId);
    }
}
