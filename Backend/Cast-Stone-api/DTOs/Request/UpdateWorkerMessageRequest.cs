using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateWorkerMessageRequest
{
    [Required]
    [MaxLength(200)]
    public string Heading { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    // Multiple collection IDs
    public List<int>? CollectionIds { get; set; }

    public bool IsActive { get; set; } = true;

    [Required]
    [MaxLength(100)]
    public string UpdatedBy { get; set; } = string.Empty;
}

