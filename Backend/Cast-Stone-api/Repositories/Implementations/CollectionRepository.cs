using Microsoft.EntityFrameworkCore;
using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Implementations;

public class CollectionRepository : BaseRepository<Collection>, ICollectionRepository
{
    public CollectionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Collection?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(c => c.ParentCollection)
            .Include(c => c.ChildCollection)
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public override async Task<IEnumerable<Collection>> GetAllAsync()
    {
        return await _dbSet
            .Include(c => c.ParentCollection)
            .Include(c => c.ChildCollection)
            .Include(c => c.Products)
            .ToListAsync();
    }

    public async Task<IEnumerable<Collection>> GetByLevelAsync(int level)
    {
        return await _dbSet
            .Include(c => c.ParentCollection)
            .Include(c => c.ChildCollection)
            .Where(c => c.Level == level)
            .ToListAsync();
    }

    public async Task<IEnumerable<Collection>> GetChildrenAsync(int parentId)
    {
        return await _dbSet
            .Include(c => c.Products)
            .Where(c => c.ParentCollectionId == parentId)
            .ToListAsync();
    }

    public async Task<Collection?> GetWithProductsAsync(int id)
    {
        return await _dbSet
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Collection>> GetPublishedAsync()
    {
        return await _dbSet
            .Include(c => c.Products)
            .Where(c => c.Published)
            .ToListAsync();
    }

    public async Task<IEnumerable<Collection>> GetHierarchyAsync()
    {
        return await _dbSet
            .Include(c => c.ParentCollection)
            .Include(c => c.ChildCollection)
            .Include(c => c.Products)
            .OrderBy(c => c.Level)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Collection>> GetRootCollectionsAsync()
    {
        return await _dbSet
            .Include(c => c.Products)
            .Where(c => c.ParentCollectionId == null && c.Level == 1)
            .ToListAsync();
    }

    public async Task<bool> HasChildrenAsync(int id)
    {
        return await _dbSet.AnyAsync(c => c.ParentCollectionId == id);
    }

    public async Task<bool> HasProductsAsync(int id)
    {
        return await _context.Products.AnyAsync(p => p.CollectionId == id);
    }

    public async Task<IEnumerable<Collection>> SearchByNameAsync(string name)
    {
        return await _dbSet
            .Include(c => c.Products)
            .Where(c => c.Name.ToLower().Contains(name.ToLower()))
            .ToListAsync();
    }

    public async Task<IEnumerable<Collection>> GetByTagAsync(string tag)
    {
        return await _dbSet
            .Include(c => c.Products)
            .Where(c => c.Tags.Contains(tag))
            .ToListAsync();
    }

    public async Task<(IEnumerable<Collection> Collections, int TotalCount)> GetFilteredAsync(CollectionFilterRequest filter)
    {
        var query = _dbSet
            .Include(c => c.ParentCollection)
            .Include(c => c.ChildCollection)
            .Include(c => c.Products)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            query = query.Where(c => c.Name.ToLower().Contains(filter.Name.ToLower()));
        }

        if (filter.Level.HasValue)
        {
            query = query.Where(c => c.Level == filter.Level.Value);
        }

        if (filter.ParentCollectionId.HasValue)
        {
            query = query.Where(c => c.ParentCollectionId == filter.ParentCollectionId.Value);
        }

        if (filter.Published.HasValue)
        {
            query = query.Where(c => c.Published == filter.Published.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.CreatedBy))
        {
            query = query.Where(c => c.CreatedBy.ToLower().Contains(filter.CreatedBy.ToLower()));
        }

        if (filter.CreatedAfter.HasValue)
        {
            query = query.Where(c => c.CreatedAt >= filter.CreatedAfter.Value);
        }

        if (filter.CreatedBefore.HasValue)
        {
            query = query.Where(c => c.CreatedAt <= filter.CreatedBefore.Value);
        }

        if (filter.UpdatedAfter.HasValue)
        {
            query = query.Where(c => c.UpdatedAt >= filter.UpdatedAfter.Value);
        }

        if (filter.UpdatedBefore.HasValue)
        {
            query = query.Where(c => c.UpdatedAt <= filter.UpdatedBefore.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Tag))
        {
            query = query.Where(c => c.Tags.Contains(filter.Tag));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply sorting
        query = filter.SortBy?.ToLower() switch
        {
            "name" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(c => c.Name)
                : query.OrderByDescending(c => c.Name),
            "level" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(c => c.Level)
                : query.OrderByDescending(c => c.Level),
            "createdat" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(c => c.CreatedAt)
                : query.OrderByDescending(c => c.CreatedAt),
            "updatedat" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(c => c.UpdatedAt)
                : query.OrderByDescending(c => c.UpdatedAt),
            _ => query.OrderByDescending(c => c.CreatedAt)
        };

        // Apply pagination
        var collections = await query
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return (collections, totalCount);
    }
}
