using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IDownloadableContentService : IBaseService<DownloadableContent, DownloadableContentResponse, CreateDownloadableContentRequest, UpdateDownloadableContentRequest>
{
    Task<DownloadableContentResponse?> GetByProductIdAsync(int productId);
    Task<bool> ExistsByProductIdAsync(int productId);
}
