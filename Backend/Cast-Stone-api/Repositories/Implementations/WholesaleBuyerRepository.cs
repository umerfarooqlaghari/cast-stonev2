using Microsoft.EntityFrameworkCore;
using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;

namespace Cast_Stone_api.Repositories.Implementations;

public class WholesaleBuyerRepository : BaseRepository<WholesaleBuyer>, IWholesaleBuyerRepository
{
    public WholesaleBuyerRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<WholesaleBuyer?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(wb => wb.User)
            .Include(wb => wb.ApprovedByUser)
            .FirstOrDefaultAsync(wb => wb.Id == id);
    }

    public override async Task<IEnumerable<WholesaleBuyer>> GetAllAsync()
    {
        return await _dbSet
            .Include(wb => wb.User)
            .Include(wb => wb.ApprovedByUser)
            .OrderByDescending(wb => wb.CreatedAt)
            .ToListAsync();
    }

    public async Task<WholesaleBuyer?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .Include(wb => wb.User)
            .Include(wb => wb.ApprovedByUser)
            .FirstOrDefaultAsync(wb => wb.Email.ToLower() == email.ToLower());
    }

    public async Task<IEnumerable<WholesaleBuyer>> GetByStatusAsync(string status)
    {
        return await _dbSet
            .Include(wb => wb.User)
            .Include(wb => wb.ApprovedByUser)
            .Where(wb => wb.Status.ToLower() == status.ToLower())
            .OrderByDescending(wb => wb.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<WholesaleBuyer>> GetPendingApplicationsAsync()
    {
        return await GetByStatusAsync("Pending");
    }

    public async Task<IEnumerable<WholesaleBuyer>> GetApprovedBuyersAsync()
    {
        return await GetByStatusAsync("Approved");
    }

    public async Task<IEnumerable<WholesaleBuyer>> GetRejectedApplicationsAsync()
    {
        return await GetByStatusAsync("Rejected");
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbSet.AnyAsync(wb => wb.Email.ToLower() == email.ToLower());
    }

    public async Task<int> GetApplicationCountByStatusAsync(string status)
    {
        return await _dbSet.CountAsync(wb => wb.Status.ToLower() == status.ToLower());
    }

    public async Task<IEnumerable<WholesaleBuyer>> GetRecentApplicationsAsync(int count = 10)
    {
        return await _dbSet
            .Include(wb => wb.User)
            .Include(wb => wb.ApprovedByUser)
            .OrderByDescending(wb => wb.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<WholesaleBuyer?> GetWithUserAsync(int id)
    {
        return await _dbSet
            .Include(wb => wb.User)
            .Include(wb => wb.ApprovedByUser)
            .FirstOrDefaultAsync(wb => wb.Id == id);
    }

    public async Task<WholesaleBuyer?> GetByEmailWithUserAsync(string email)
    {
        return await _dbSet
            .Include(wb => wb.User)
            .Include(wb => wb.ApprovedByUser)
            .FirstOrDefaultAsync(wb => wb.Email.ToLower() == email.ToLower());
    }
}
