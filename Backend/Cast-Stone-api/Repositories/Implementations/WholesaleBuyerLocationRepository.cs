using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cast_Stone_api.Repositories.Implementations;

public class WholesaleBuyerLocationRepository : BaseRepository<WholesaleBuyerLocation>, IWholesaleBuyerLocationRepository
{
    public WholesaleBuyerLocationRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<WholesaleBuyerLocation?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(wbl => wbl.WholesaleBuyer)
            .FirstOrDefaultAsync(wbl => wbl.Id == id);
    }

    public override async Task<IEnumerable<WholesaleBuyerLocation>> GetAllAsync()
    {
        return await _dbSet
            .Include(wbl => wbl.WholesaleBuyer)
            .OrderByDescending(wbl => wbl.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<WholesaleBuyerLocation>> GetByWholesaleBuyerIdAsync(int wholesaleBuyerId)
    {
        return await _dbSet
            .Where(wbl => wbl.WholesaleBuyerId == wholesaleBuyerId)
            .OrderByDescending(wbl => wbl.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> WholesaleBuyerExistsAsync(int wholesaleBuyerId)
    {
        return await _context.WholesaleBuyers.AnyAsync(wb => wb.Id == wholesaleBuyerId);
    }
}

