using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateProductRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
    public int Stock { get; set; }

    [Required]
    public int CollectionId { get; set; }

    public List<string> Images { get; set; } = new List<string>();

    public List<string> Tags { get; set; } = new List<string>();
}
