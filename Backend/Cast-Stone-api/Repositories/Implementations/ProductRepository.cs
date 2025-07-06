using Microsoft.EntityFrameworkCore;
using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Implementations;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Product?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Collection)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public override async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _dbSet
            .Include(p => p.Collection)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByCollectionIdAsync(int collectionId)
    {
        return await _dbSet
            .Include(p => p.Collection)
            .Where(p => p.CollectionId == collectionId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetInStockAsync()
    {
        return await _dbSet
            .Include(p => p.Collection)
            .Where(p => p.Stock > 0)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetOutOfStockAsync()
    {
        return await _dbSet
            .Include(p => p.Collection)
            .Where(p => p.Stock == 0)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        return await _dbSet
            .Include(p => p.Collection)
            .Where(p => p.Price >= minPrice && p.Price <= maxPrice)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchByNameAsync(string name)
    {
        return await _dbSet
            .Include(p => p.Collection)
            .Where(p => p.Name.ToLower().Contains(name.ToLower()) || 
                       p.Description!.ToLower().Contains(name.ToLower()))
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByTagAsync(string tag)
    {
        return await _dbSet
            .Include(p => p.Collection)
            .Where(p => p.Tags.Contains(tag))
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetFeaturedAsync(int count = 10)
    {
        return await _dbSet
            .Include(p => p.Collection)
            .Where(p => p.Stock > 0)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetLatestAsync(int count = 10)
    {
        return await _dbSet
            .Include(p => p.Collection)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<bool> IsInStockAsync(int id, int quantity = 1)
    {
        var product = await _dbSet.FindAsync(id);
        return product != null && product.Stock >= quantity;
    }

    public async Task UpdateStockAsync(int id, int newStock)
    {
        var product = await _dbSet.FindAsync(id);
        if (product != null)
        {
            product.Stock = newStock;
            product.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Product?> GetWithCollectionAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Collection)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<(IEnumerable<Product> Products, int TotalCount)> GetFilteredAsync(ProductFilterRequest filter)
    {
        var query = _dbSet
            .Include(p => p.Collection)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            query = query.Where(p => p.Name.ToLower().Contains(filter.Name.ToLower()) ||
                                   (p.Description != null && p.Description.ToLower().Contains(filter.Name.ToLower())));
        }

        if (filter.CollectionId.HasValue)
        {
            query = query.Where(p => p.CollectionId == filter.CollectionId.Value);
        }

        if (filter.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= filter.MinPrice.Value);
        }

        if (filter.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);
        }

        if (filter.MinStock.HasValue)
        {
            query = query.Where(p => p.Stock >= filter.MinStock.Value);
        }

        if (filter.MaxStock.HasValue)
        {
            query = query.Where(p => p.Stock <= filter.MaxStock.Value);
        }

        if (filter.InStock.HasValue)
        {
            if (filter.InStock.Value)
            {
                query = query.Where(p => p.Stock > 0);
            }
            else
            {
                query = query.Where(p => p.Stock == 0);
            }
        }

        if (filter.CreatedAfter.HasValue)
        {
            query = query.Where(p => p.CreatedAt >= filter.CreatedAfter.Value);
        }

        if (filter.CreatedBefore.HasValue)
        {
            query = query.Where(p => p.CreatedAt <= filter.CreatedBefore.Value);
        }

        if (filter.UpdatedAfter.HasValue)
        {
            query = query.Where(p => p.UpdatedAt >= filter.UpdatedAfter.Value);
        }

        if (filter.UpdatedBefore.HasValue)
        {
            query = query.Where(p => p.UpdatedAt <= filter.UpdatedBefore.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Tag))
        {
            query = query.Where(p => p.Tags.Contains(filter.Tag));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply sorting
        query = filter.SortBy?.ToLower() switch
        {
            "name" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(p => p.Name)
                : query.OrderByDescending(p => p.Name),
            "price" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(p => p.Price)
                : query.OrderByDescending(p => p.Price),
            "stock" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(p => p.Stock)
                : query.OrderByDescending(p => p.Stock),
            "createdat" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(p => p.CreatedAt)
                : query.OrderByDescending(p => p.CreatedAt),
            "updatedat" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(p => p.UpdatedAt)
                : query.OrderByDescending(p => p.UpdatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        // Apply pagination
        var products = await query
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return (products, totalCount);
    }
}
