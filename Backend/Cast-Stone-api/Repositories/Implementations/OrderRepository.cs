using Microsoft.EntityFrameworkCore;
using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Implementations;

public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Order?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public override async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByStatusIdAsync(int statusId)
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .Where(o => o.StatusId == statusId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByEmailAsync(string email)
    {
        return await _dbSet
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.Email.ToLower() == email.ToLower())
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Collection)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<Order>> GetRecentOrdersAsync(int count = 10)
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _dbSet
            .Where(o => o.StatusId == 2) // Assuming StatusId 2 is "Paid"
            .SumAsync(o => o.TotalAmount);
    }

    public async Task<decimal> GetTotalRevenueByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(o => o.StatusId == 2 && o.CreatedAt >= startDate && o.CreatedAt <= endDate)
            .SumAsync(o => o.TotalAmount);
    }

    public async Task<int> GetOrderCountByStatusAsync(int statusId)
    {
        return await _dbSet.CountAsync(o => o.StatusId == statusId);
    }

    public async Task<IEnumerable<Order>> GetPendingOrdersAsync()
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .Where(o => o.StatusId == 1) // Assuming StatusId 1 is "Pending"
            .OrderBy(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Order> Orders, int TotalCount)> GetFilteredAsync(OrderFilterRequest filter)
    {
        var query = _dbSet
            .Include(o => o.User)
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .AsQueryable();

        // Apply filters
        if (filter.UserId.HasValue)
        {
            query = query.Where(o => o.UserId == filter.UserId.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Email))
        {
            query = query.Where(o => o.Email.ToLower().Contains(filter.Email.ToLower()));
        }

        if (filter.StatusId.HasValue)
        {
            query = query.Where(o => o.StatusId == filter.StatusId.Value);
        }

        if (filter.MinAmount.HasValue)
        {
            query = query.Where(o => o.TotalAmount >= filter.MinAmount.Value);
        }

        if (filter.MaxAmount.HasValue)
        {
            query = query.Where(o => o.TotalAmount <= filter.MaxAmount.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.PaymentMethod))
        {
            query = query.Where(o => o.PaymentMethod != null && o.PaymentMethod.ToLower().Contains(filter.PaymentMethod.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(filter.Country))
        {
            query = query.Where(o => o.Country != null && o.Country.ToLower().Contains(filter.Country.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(filter.City))
        {
            query = query.Where(o => o.City != null && o.City.ToLower().Contains(filter.City.ToLower()));
        }

        if (filter.CreatedAfter.HasValue)
        {
            query = query.Where(o => o.CreatedAt >= filter.CreatedAfter.Value);
        }

        if (filter.CreatedBefore.HasValue)
        {
            query = query.Where(o => o.CreatedAt <= filter.CreatedBefore.Value);
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply sorting
        query = filter.SortBy?.ToLower() switch
        {
            "email" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(o => o.Email)
                : query.OrderByDescending(o => o.Email),
            "totalamount" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(o => o.TotalAmount)
                : query.OrderByDescending(o => o.TotalAmount),
            "createdat" => filter.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(o => o.CreatedAt)
                : query.OrderByDescending(o => o.CreatedAt),
            _ => query.OrderByDescending(o => o.CreatedAt)
        };

        // Apply pagination
        var orders = await query
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return (orders, totalCount);
    }
}
