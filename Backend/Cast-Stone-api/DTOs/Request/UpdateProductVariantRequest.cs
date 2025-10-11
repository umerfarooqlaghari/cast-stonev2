using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateProductVariantRequest
{
    [MaxLength(50)]
    public string? ProductCode { get; set; }
    
    [MaxLength(200)]
    public string? VariantName { get; set; }
    
    [MaxLength(100)]
    public string? VariantIdentity { get; set; }
    
    [MaxLength(1024)]
    public string? VariantDescription { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Variant price must be greater than 0")]
    public decimal VariantPrice { get; set; }
    
    [Range(0.01, double.MaxValue, ErrorMessage = "Variant wholesale price must be greater than 0")]
    public decimal? VariantWholesalePrice { get; set; }

    public List<string>? VariantTags { get; set; } = new List<string>();

    public List<string>? VariantImages { get; set; } = new List<string>();
}

