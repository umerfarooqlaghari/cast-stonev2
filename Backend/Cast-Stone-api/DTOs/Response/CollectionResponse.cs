namespace Cast_Stone_api.DTOs.Response;

public class CollectionResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Level { get; set; }
    public int? ParentCollectionId { get; set; }
    public int? ChildCollectionId { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public List<string> Images { get; set; } = new List<string>();
    public bool Published { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public CollectionResponse? ParentCollection { get; set; }
    public CollectionResponse? ChildCollection { get; set; }
    //public List<ProductResponse> Products { get; set; } = new List<ProductResponse>();
}

public class CollectionHierarchyResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Level { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public bool Published { get; set; }
    public List<CollectionHierarchyResponse> Children { get; set; } = new List<CollectionHierarchyResponse>();
    public int ProductCount { get; set; }
}
