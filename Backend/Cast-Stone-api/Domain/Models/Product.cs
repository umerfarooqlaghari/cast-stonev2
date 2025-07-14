using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cast_Stone_api.Domain.Models;

public class Product
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? ProductCode { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Required]
    public int Stock { get; set; }

    [Required]
    public int CollectionId { get; set; }

    [Column(TypeName = "jsonb")]
    public List<string> Images { get; set; } = new List<string>();

    [Column(TypeName = "jsonb")]
    public List<string> Tags { get; set; } = new List<string>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    [JsonIgnore]
    [ForeignKey(nameof(CollectionId))]
    public virtual Collection Collection { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    // New related entities (nullable)
    [JsonIgnore]
    public virtual ProductSpecifications? ProductSpecifications { get; set; }

    [JsonIgnore]
    public virtual ProductDetails? ProductDetails { get; set; }

    [JsonIgnore]
    public virtual DownloadableContent? DownloadableContent { get; set; }
}
