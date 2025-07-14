using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cast_Stone_api.Repositories.Implementations;

public class DownloadableContentRepository : BaseRepository<DownloadableContent>, IDownloadableContentRepository
{
    public DownloadableContentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<DownloadableContent?> GetByProductIdAsync(int productId)
    {
        return await _dbSet
            .Include(dc => dc.Product)
            .FirstOrDefaultAsync(dc => dc.ProductId == productId);
    }

    public async Task<bool> ExistsByProductIdAsync(int productId)
    {
        return await _dbSet.AnyAsync(dc => dc.ProductId == productId);
    }
}
