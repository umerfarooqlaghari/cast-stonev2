namespace Cast_Stone_api.DTOs.Request;

public class ProductVariantFilterRequest
{
    public int? ProductId { get; set; }
    public string? VariantName { get; set; }
    public string? VariantTag { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}

