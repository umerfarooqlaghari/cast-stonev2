using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class CreateOrderRequest
{
    public int? UserId { get; set; } // nullable for guest orders

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(100)]
    public string? Country { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [MaxLength(20)]
    public string? ZipCode { get; set; }

    [MaxLength(50)]
    public string? PaymentMethod { get; set; }

    [Required]
    public List<CreateOrderItemRequest> OrderItems { get; set; } = new List<CreateOrderItemRequest>();
}

public class CreateOrderItemRequest
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }
}
