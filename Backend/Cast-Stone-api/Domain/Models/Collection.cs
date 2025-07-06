using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast_Stone_api.Domain.Models;

public class Collection
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [Range(1, 3)]
    public int Level { get; set; }
    
    public int? ParentCollectionId { get; set; }
    
    public int? ChildCollectionId { get; set; }
    
    [Column(TypeName = "jsonb")]
    public List<string> Tags { get; set; } = new List<string>();
    
    public bool Published { get; set; } = false;
    
    [Required]
    [MaxLength(100)]
    public string CreatedBy { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [MaxLength(100)]
    public string? UpdatedBy { get; set; }
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(ParentCollectionId))]
    public virtual Collection? ParentCollection { get; set; }
    
    [ForeignKey(nameof(ChildCollectionId))]
    public virtual Collection? ChildCollection { get; set; }
    
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
