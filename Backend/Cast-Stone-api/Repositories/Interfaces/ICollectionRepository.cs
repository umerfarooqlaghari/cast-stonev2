using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface ICollectionRepository : IBaseRepository<Collection>
{
    Task<IEnumerable<Collection>> GetByLevelAsync(int level);
    Task<IEnumerable<Collection>> GetChildrenAsync(int parentId);
    Task<Collection?> GetWithProductsAsync(int id);
    Task<IEnumerable<Collection>> GetPublishedAsync();
    Task<IEnumerable<Collection>> GetHierarchyAsync();
    Task<IEnumerable<Collection>> GetRootCollectionsAsync();
    Task<bool> HasChildrenAsync(int id);
    Task<bool> HasProductsAsync(int id);
    Task<IEnumerable<Collection>> SearchByNameAsync(string name);
    Task<IEnumerable<Collection>> GetByTagAsync(string tag);
    Task<(IEnumerable<Collection> Collections, int TotalCount)> GetFilteredAsync(CollectionFilterRequest filter);
}
