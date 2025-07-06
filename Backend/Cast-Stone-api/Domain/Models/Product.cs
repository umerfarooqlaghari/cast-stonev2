using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast_Stone_api.Domain.Models;

public class Product
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
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
    [ForeignKey(nameof(CollectionId))]
    public virtual Collection Collection { get; set; } = null!;
    
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
