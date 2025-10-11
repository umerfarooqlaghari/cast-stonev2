namespace Cast_Stone_api.DTOs.Response;

public class ProductVariantResponse
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string? ProductCode { get; set; }
    public string? VariantName { get; set; }
    public string? VariantIdentity { get; set; }
    public string? VariantDescription { get; set; }
    public decimal VariantPrice { get; set; }
    public decimal? VariantWholesalePrice { get; set; }
    public List<string>? VariantTags { get; set; } = new List<string>();
    public List<string>? VariantImages { get; set; } = new List<string>();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public ProductResponse? Product { get; set; }
}

