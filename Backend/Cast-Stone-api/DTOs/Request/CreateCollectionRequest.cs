using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class CreateCollectionRequest
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

    public int? ChildCollectionId { get; set; }

    public List<string> Tags { get; set; } = new List<string>();

    public bool Published { get; set; } = false;

    [Required]
    [MaxLength(100)]
    public string CreatedBy { get; set; } = string.Empty;
}
