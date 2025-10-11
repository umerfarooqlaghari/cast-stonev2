using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class AddToCartRequest
{
    [Required]
    public int ProductId { get; set; }

    // Optional: Product Variant ID (nullable - only set if a variant is selected)
    public int? ProductVariantId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }

    public int? UserId { get; set; } // nullable for guest carts

    [MaxLength(255)]
    public string? SessionId { get; set; } // for guest cart identification
}
