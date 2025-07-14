using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cast_Stone_api.Repositories.Implementations;

public class ProductDetailsRepository : BaseRepository<ProductDetails>, IProductDetailsRepository
{
    public ProductDetailsRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ProductDetails?> GetByProductIdAsync(int productId)
    {
        return await _dbSet
            .Include(pd => pd.Product)
            .FirstOrDefaultAsync(pd => pd.ProductId == productId);
    }

    public async Task<bool> ExistsByProductIdAsync(int productId)
    {
        return await _dbSet.AnyAsync(pd => pd.ProductId == productId);
    }
}
