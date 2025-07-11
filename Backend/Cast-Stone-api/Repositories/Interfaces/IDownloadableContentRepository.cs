using Cast_Stone_api.Domain.Models;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IDownloadableContentRepository : IBaseRepository<DownloadableContent>
{
    Task<DownloadableContent?> GetByProductIdAsync(int productId);
    Task<bool> ExistsByProductIdAsync(int productId);
}
