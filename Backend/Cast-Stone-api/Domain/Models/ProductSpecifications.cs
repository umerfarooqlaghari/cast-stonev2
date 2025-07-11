using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cast_Stone_api.Domain.Models;

public class ProductSpecifications
{
    [Key]
    public int Id { get; set; }
    
    [MaxLength(200)]
    public string? Material { get; set; }
    
    [MaxLength(200)]
    public string? Dimensions { get; set; }
    
    [MaxLength(200)]
    public string? TotalWeight { get; set; }
    
    [MaxLength(200)]
    public string? WeightWithWater { get; set; }
    
    [MaxLength(200)]
    public string? WaterVolume { get; set; }
    
    [Required]
    public int ProductId { get; set; }
    
    // Navigation property
    [JsonIgnore]
    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; } = null!;
}
