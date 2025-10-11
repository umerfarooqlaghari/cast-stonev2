using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cast_Stone_api.Domain.Models;

public class ProductVariant
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int ProductId { get; set; }
    
    [MaxLength(50)]
    public string? ProductCode { get; set; }
    
    [MaxLength(200)]
    public string? VariantName { get; set; }
    
    [MaxLength(100)]
    public string? VariantIdentity { get; set; }
    
    [MaxLength(1024)]
    public string? VariantDescription { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal VariantPrice { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal? VariantWholesalePrice { get; set; }
    
    [Column(TypeName = "jsonb")]
    public List<string>? VariantTags { get; set; } = new List<string>();

    [Column(TypeName = "jsonb")]
    public List<string>? VariantImages { get; set; } = new List<string>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
    
    // Navigation property
    [JsonIgnore]
    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; } = null!;
}

