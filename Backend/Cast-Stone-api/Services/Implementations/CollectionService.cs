using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class CollectionService : ICollectionService
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly IMapper _mapper;

    public CollectionService(ICollectionRepository collectionRepository, IMapper mapper)
    {
        _collectionRepository = collectionRepository;
        _mapper = mapper;
    }

    public async Task<CollectionResponse?> GetByIdAsync(int id)
    {
        var collection = await _collectionRepository.GetByIdAsync(id);
        return collection != null ? _mapper.Map<CollectionResponse>(collection) : null;
    }

    public async Task<IEnumerable<CollectionResponse>> GetAllAsync()
    {
        var collections = await _collectionRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<CollectionResponse>>(collections);
    }

    public async Task<CollectionResponse> CreateAsync(CreateCollectionRequest request)
    {
        // Validate hierarchy
        if (!await ValidateHierarchyAsync(request.ParentCollectionId, request.ChildCollectionId, request.Level))
        {
            throw new ArgumentException("Invalid collection hierarchy");
        }

        var collection = _mapper.Map<Collection>(request);
        collection.CreatedAt = DateTime.UtcNow;

        var createdCollection = await _collectionRepository.AddAsync(collection);

        // Update parent-child relationships automatically
        await UpdateParentChildRelationshipsAsync(createdCollection);

        return _mapper.Map<CollectionResponse>(createdCollection);
    }

    public async Task<CollectionResponse?> UpdateAsync(int id, UpdateCollectionRequest request)
    {
        var existingCollection = await _collectionRepository.GetByIdAsync(id);
        if (existingCollection == null)
            return null;

        // Validate hierarchy
        if (!await ValidateHierarchyAsync(request.ParentCollectionId, request.ChildCollectionId, request.Level))
        {
            throw new ArgumentException("Invalid collection hierarchy");
        }

        _mapper.Map(request, existingCollection);
        existingCollection.UpdatedAt = DateTime.UtcNow;

        var updatedCollection = await _collectionRepository.UpdateAsync(existingCollection);
        return _mapper.Map<CollectionResponse>(updatedCollection);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (!await CanDeleteAsync(id))
            return false;

        await _collectionRepository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _collectionRepository.ExistsAsync(id);
    }

    public async Task<IEnumerable<CollectionResponse>> GetByLevelAsync(int level)
    {
        var collections = await _collectionRepository.GetByLevelAsync(level);
        return _mapper.Map<IEnumerable<CollectionResponse>>(collections);
    }

    public async Task<IEnumerable<CollectionResponse>> GetChildrenAsync(int parentId)
    {
        var collections = await _collectionRepository.GetChildrenAsync(parentId);
        return _mapper.Map<IEnumerable<CollectionResponse>>(collections);
    }

    public async Task<CollectionResponse?> GetWithProductsAsync(int id)
    {
        var collection = await _collectionRepository.GetWithProductsAsync(id);
        return collection != null ? _mapper.Map<CollectionResponse>(collection) : null;
    }

    public async Task<IEnumerable<CollectionResponse>> GetPublishedAsync()
    {
        var collections = await _collectionRepository.GetPublishedAsync();
        return _mapper.Map<IEnumerable<CollectionResponse>>(collections);
    }

    public async Task<IEnumerable<CollectionHierarchyResponse>> GetHierarchyAsync()
    {
        var collections = await _collectionRepository.GetHierarchyAsync();
        var collectionList = collections.ToList();
        
        // Build hierarchy tree
        var rootCollections = collectionList.Where(c => c.ParentCollectionId == null).ToList();
        var hierarchyResponse = new List<CollectionHierarchyResponse>();

        foreach (var root in rootCollections)
        {
            var hierarchyItem = BuildHierarchy(root, collectionList);
            hierarchyResponse.Add(hierarchyItem);
        }

        return hierarchyResponse;
    }

    private CollectionHierarchyResponse BuildHierarchy(Collection collection, List<Collection> allCollections)
    {
        var response = _mapper.Map<CollectionHierarchyResponse>(collection);
        response.ProductCount = collection.Products?.Count ?? 0;
        
        var children = allCollections.Where(c => c.ParentCollectionId == collection.Id).ToList();
        foreach (var child in children)
        {
            response.Children.Add(BuildHierarchy(child, allCollections));
        }

        return response;
    }

    public async Task<IEnumerable<CollectionResponse>> GetRootCollectionsAsync()
    {
        var collections = await _collectionRepository.GetRootCollectionsAsync();
        return _mapper.Map<IEnumerable<CollectionResponse>>(collections);
    }

    public async Task<bool> HasChildrenAsync(int id)
    {
        return await _collectionRepository.HasChildrenAsync(id);
    }

    public async Task<bool> HasProductsAsync(int id)
    {
        return await _collectionRepository.HasProductsAsync(id);
    }

    public async Task<IEnumerable<CollectionResponse>> SearchByNameAsync(string name)
    {
        var collections = await _collectionRepository.SearchByNameAsync(name);
        return _mapper.Map<IEnumerable<CollectionResponse>>(collections);
    }

    public async Task<IEnumerable<CollectionResponse>> GetByTagAsync(string tag)
    {
        var collections = await _collectionRepository.GetByTagAsync(tag);
        return _mapper.Map<IEnumerable<CollectionResponse>>(collections);
    }

    public async Task<bool> CanDeleteAsync(int id)
    {
        // Cannot delete if it has children or products
        return !await HasChildrenAsync(id) && !await HasProductsAsync(id);
    }

    public async Task<bool> ValidateHierarchyAsync(int? parentId, int? childId, int level)
    {
        // Level 1 collections should not have parents
        if (level == 1 && parentId.HasValue)
            return false;

        // Level 2 and 3 collections should have parents
        if (level > 1 && !parentId.HasValue)
            return false;

        // Level 3 is the maximum
        if (level > 3)
            return false;

        // If parent is specified, validate it exists and has correct level
        if (parentId.HasValue)
        {
            var parent = await _collectionRepository.GetByIdAsync(parentId.Value);
            if (parent == null || parent.Level != level - 1)
                return false;
        }

        // Child collection validation (if specified)
        if (childId.HasValue)
        {
            var child = await _collectionRepository.GetByIdAsync(childId.Value);
            if (child == null || child.Level != level + 1)
                return false;
        }

        return true;
    }

    public async Task<PaginatedResponse<CollectionResponse>> GetFilteredAsync(CollectionFilterRequest filter)
    {
        var (collections, totalCount) = await _collectionRepository.GetFilteredAsync(filter);
        var collectionResponses = _mapper.Map<IEnumerable<CollectionResponse>>(collections);

        var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

        return new PaginatedResponse<CollectionResponse>
        {
            Data = collectionResponses,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalRecords = totalCount,
            TotalPages = totalPages,
            HasNextPage = filter.PageNumber < totalPages,
            HasPreviousPage = filter.PageNumber > 1
        };
    }

    /// <summary>
    /// Automatically update parent-child relationships when a collection is created or updated
    /// </summary>
    private async Task UpdateParentChildRelationshipsAsync(Collection collection)
    {
        // If this collection has a parent, update the parent's childCollectionId if not already set
        if (collection.ParentCollectionId.HasValue)
        {
            var parent = await _collectionRepository.GetByIdAsync(collection.ParentCollectionId.Value);
            if (parent != null && !parent.ChildCollectionId.HasValue)
            {
                parent.ChildCollectionId = collection.Id;
                await _collectionRepository.UpdateAsync(parent);
            }
        }

        // If this is a level 1 or 2 collection, check for existing children and update childCollectionId
        if (collection.Level < 3)
        {
            var children = await _collectionRepository.GetChildrenAsync(collection.Id);
            var firstChild = children.FirstOrDefault();

            if (firstChild != null && !collection.ChildCollectionId.HasValue)
            {
                collection.ChildCollectionId = firstChild.Id;
                await _collectionRepository.UpdateAsync(collection);
            }
        }
    }

    /// <summary>
    /// Update parent-child relationships for all collections (maintenance operation)
    /// </summary>
    public async Task<int> RefreshAllParentChildRelationshipsAsync()
    {
        var allCollections = await _collectionRepository.GetAllAsync();
        int updatedCount = 0;

        foreach (var collection in allCollections)
        {
            var originalChildId = collection.ChildCollectionId;

            // Find the first child for this collection
            var children = await _collectionRepository.GetChildrenAsync(collection.Id);
            var firstChild = children.FirstOrDefault();

            // Update childCollectionId if needed
            if (firstChild != null && collection.ChildCollectionId != firstChild.Id)
            {
                collection.ChildCollectionId = firstChild.Id;
                await _collectionRepository.UpdateAsync(collection);
                updatedCount++;
            }
            else if (firstChild == null && collection.ChildCollectionId.HasValue)
            {
                // Clear childCollectionId if no children exist
                collection.ChildCollectionId = null;
                await _collectionRepository.UpdateAsync(collection);
                updatedCount++;
            }
        }

        return updatedCount;
    }
}
