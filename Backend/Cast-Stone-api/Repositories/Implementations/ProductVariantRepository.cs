using Microsoft.EntityFrameworkCore;
using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Implementations;

public class ProductVariantRepository : BaseRepository<ProductVariant>, IProductVariantRepository
{
    public ProductVariantRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<ProductVariant?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(pv => pv.Product)
            .FirstOrDefaultAsync(pv => pv.Id == id);
    }

    public override async Task<IEnumerable<ProductVariant>> GetAllAsync()
    {
        return await _dbSet
            .Include(pv => pv.Product)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId)
    {
        return await _dbSet
            .Include(pv => pv.Product)
            .Where(pv => pv.ProductId == productId)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProductVariant>> GetByVariantNameAsync(string variantName)
    {
        return await _dbSet
            .Include(pv => pv.Product)
            .Where(pv => pv.VariantName != null && pv.VariantName.ToLower().Contains(variantName.ToLower()))
            .ToListAsync();
    }

    public async Task<IEnumerable<ProductVariant>> GetByVariantTagAsync(string tag)
    {
        return await _dbSet
            .Include(pv => pv.Product)
            .Where(pv => pv.VariantTags.Contains(tag))
            .ToListAsync();
    }

    public async Task<IEnumerable<ProductVariant>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        return await _dbSet
            .Include(pv => pv.Product)
            .Where(pv => pv.VariantPrice >= minPrice && pv.VariantPrice <= maxPrice)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProductVariant>> GetFilteredAsync(ProductVariantFilterRequest filter)
    {
        var query = _dbSet
            .Include(pv => pv.Product)
            .AsQueryable();

        // Apply filters
        if (filter.ProductId.HasValue)
        {
            query = query.Where(pv => pv.ProductId == filter.ProductId.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.VariantName))
        {
            query = query.Where(pv => pv.VariantName != null && 
                                     pv.VariantName.ToLower().Contains(filter.VariantName.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(filter.VariantTag))
        {
            query = query.Where(pv => pv.VariantTags.Contains(filter.VariantTag));
        }

        if (filter.MinPrice.HasValue)
        {
            query = query.Where(pv => pv.VariantPrice >= filter.MinPrice.Value);
        }

        if (filter.MaxPrice.HasValue)
        {
            query = query.Where(pv => pv.VariantPrice <= filter.MaxPrice.Value);
        }

        return await query.ToListAsync();
    }
}

