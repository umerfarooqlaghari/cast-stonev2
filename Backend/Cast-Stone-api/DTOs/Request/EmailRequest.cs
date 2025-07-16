using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class EmailRequest
{
    [Required]
    public string Subject { get; set; } = string.Empty;
    
    [Required]
    public string Message { get; set; } = string.Empty;
    
    public string? ToEmail { get; set; }
    public string? ToName { get; set; }
}

public class ContactFormAutoReplyRequest
{
    [Required]
    [EmailAddress]
    public string UserEmail { get; set; } = string.Empty;
    
    [Required]
    public string UserName { get; set; } = string.Empty;
    
    [Required]
    public string InquiryType { get; set; } = string.Empty;
    
    [Required]
    public string Message { get; set; } = string.Empty;
    
    public string? Company { get; set; }
    public string? State { get; set; }
    public string? PhoneNumber { get; set; }
}

public class OrderConfirmationRequest
{
    [Required]
    [EmailAddress]
    public string CustomerEmail { get; set; } = string.Empty;
    
    [Required]
    public string CustomerName { get; set; } = string.Empty;
    
    [Required]
    public int OrderId { get; set; }
    
    [Required]
    public decimal TotalAmount { get; set; }
    
    [Required]
    public List<OrderItemDetail> OrderItems { get; set; } = new();
    
    [Required]
    public string PaymentMethod { get; set; } = string.Empty;
    
    public string? ShippingAddress { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
}

public class OrderItemDetail
{
    [Required]
    public string ProductName { get; set; } = string.Empty;
    
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Total { get; set; }
    
    public string? ProductImage { get; set; }
    public string? ProductDescription { get; set; }
}
