using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface ICollectionService : IBaseService<Domain.Models.Collection, CollectionResponse, CreateCollectionRequest, UpdateCollectionRequest>
{
    Task<IEnumerable<CollectionResponse>> GetByLevelAsync(int level);
    Task<IEnumerable<CollectionResponse>> GetChildrenAsync(int parentId);
    Task<CollectionResponse?> GetWithProductsAsync(int id);
    Task<IEnumerable<CollectionResponse>> GetPublishedAsync();
    Task<IEnumerable<CollectionHierarchyResponse>> GetHierarchyAsync();
    Task<IEnumerable<CollectionResponse>> GetRootCollectionsAsync();
    Task<bool> HasChildrenAsync(int id);
    Task<bool> HasProductsAsync(int id);
    Task<IEnumerable<CollectionResponse>> SearchByNameAsync(string name);
    Task<IEnumerable<CollectionResponse>> GetByTagAsync(string tag);
    Task<bool> CanDeleteAsync(int id);
    Task<bool> ValidateHierarchyAsync(int? parentId, List<int>? childIds, int level);
    Task<PaginatedResponse<CollectionResponse>> GetFilteredAsync(CollectionFilterRequest filter);
    Task<int> RefreshAllParentChildRelationshipsAsync();
    Task<int> RefreshAllProductIdsAsync();
}
