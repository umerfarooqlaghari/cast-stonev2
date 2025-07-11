using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateCollectionRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [Range(1, 3)]
    public int Level { get; set; }

    public int? ParentCollectionId { get; set; }

    public List<int>? ChildCollectionIds { get; set; }

    public List<string> Tags { get; set; } = new List<string>();

    public List<string> Images { get; set; } = new List<string>();

    public List<int>? ProductIds { get; set; }

    public bool Published { get; set; } = false;

    [Required]
    [MaxLength(100)]
    public string UpdatedBy { get; set; } = string.Empty;
}
