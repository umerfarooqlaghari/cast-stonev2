using Microsoft.EntityFrameworkCore;
using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Implementations;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public async Task<IEnumerable<User>> GetByRoleAsync(string role)
    {
        return await _dbSet
            .Where(u => u.Role.ToLower() == role.ToLower())
            .OrderBy(u => u.Email)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        return await _dbSet
            .Where(u => u.Active)
            .OrderBy(u => u.Email)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetInactiveUsersAsync()
    {
        return await _dbSet
            .Where(u => !u.Active)
            .OrderBy(u => u.Email)
            .ToListAsync();
    }

    public async Task<User?> GetWithOrdersAsync(int id)
    {
        return await _dbSet
            .Include(u => u.Orders)
                .ThenInclude(o => o.Status)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public async Task<int> GetUserCountByRoleAsync(string role)
    {
        return await _dbSet.CountAsync(u => u.Role.ToLower() == role.ToLower());
    }

    public async Task<IEnumerable<User>> GetRecentUsersAsync(int count = 10)
    {
        return await _dbSet
            .OrderByDescending(u => u.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<(IEnumerable<User> Users, int TotalCount)> GetFilteredAsync(UserFilterRequest filter)
    {
        var query = _dbSet.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(filter.Email))
        {
            query = query.Where(u => u.Email.ToLower().Contains(filter.Email.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(filter.Role))
        {
            query = query.Where(u => u.Role.ToLower() == filter.Role.ToLower());
        }

        if (filter.Active.HasValue)
        {
            query = query.Where(u => u.Active == filter.Active.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Country))
        {
            query = query.Where(u => u.Country != null && u.Country.ToLower().Contains(filter.Country.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(filter.City))
        {
            query = query.Where(u => u.City != null && u.City.ToLower().Contains(filter.City.ToLower()));
        }

        if (filter.CreatedAfter.HasValue)
        {
            query = query.Where(u => u.CreatedAt >= filter.CreatedAfter.Value);
        }

        if (filter.CreatedBefore.HasValue)
        {
            query = query.Where(u => u.CreatedAt <= filter.CreatedBefore.Value);
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply sorting
        query = filter.SortBy?.ToLower() switch
        {
            "email" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(u => u.Email)
                : query.OrderByDescending(u => u.Email),
            "role" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(u => u.Role)
                : query.OrderByDescending(u => u.Role),
            "createdat" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(u => u.CreatedAt)
                : query.OrderByDescending(u => u.CreatedAt),
            _ => query.OrderByDescending(u => u.CreatedAt)
        };

        // Apply pagination
        var users = await query
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return (users, totalCount);
    }
}
