namespace Cast_Stone_api.DTOs.Response;

public class ProductResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ProductCode { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int CollectionId { get; set; }
    public List<string> Images { get; set; } = new List<string>();
    public List<string> Tags { get; set; } = new List<string>();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public CollectionResponse? Collection { get; set; }

    // Related entities
    public ProductSpecificationsResponse? ProductSpecifications { get; set; }
    public ProductDetailsResponse? ProductDetails { get; set; }
    public DownloadableContentResponse? DownloadableContent { get; set; }
}

public class ProductSummaryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string? MainImage { get; set; }
    public string CollectionName { get; set; } = string.Empty;
    public bool InStock => Stock > 0;
}
