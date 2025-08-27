using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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

    [Column(TypeName = "jsonb")]
    public List<int>? ChildCollectionIds { get; set; }

    [Column(TypeName = "jsonb")]
    public List<string> Tags { get; set; } = new List<string>();

    [Column(TypeName = "jsonb")]
    public List<string> Images { get; set; } = new List<string>();

    [Column(TypeName = "jsonb")]
    public List<int>? ProductIds { get; set; }

    // ===== New optional content fields =====
    // Elegant Description Section (all levels)
    public string? ElegantHeader { get; set; }
    public string? ElegantDescription { get; set; }

    // Level 3 - Section 3 (image + content)
    public string? Section3Header { get; set; }
    public string? Section3Content { get; set; }
    public string? Section3Image { get; set; }

    // Level 3 - Section 4 (image + content)
    public string? Section4Header { get; set; }
    public string? Section4Content { get; set; }
    public string? Section4Image { get; set; }

    // Level 3 - Collage images
    [Column(TypeName = "jsonb")]
    public List<string>? CollageImageSection { get; set; }

    // Level 2 (children of Parent Id = 1) - Static content block
    public string? StaticContentHeader { get; set; }
    public string? StaticContentParagraph1 { get; set; }
    public string? StaticContentParagraph2 { get; set; }
    public string? StaticContentParagraph3 { get; set; }


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

    public virtual ICollection<Collection> ChildCollections { get; set; } = new List<Collection>();

    [JsonIgnore]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
