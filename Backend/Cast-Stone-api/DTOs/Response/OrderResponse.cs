namespace Cast_Stone_api.DTOs.Response;

public class OrderResponse
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? ZipCode { get; set; }
    public decimal TotalAmount { get; set; }
    public int StatusId { get; set; }
    public string? PaymentMethod { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navigation properties
    public UserResponse? User { get; set; }
    public StatusResponse Status { get; set; } = null!;
    public List<OrderItemResponse> OrderItems { get; set; } = new List<OrderItemResponse>();
}

public class OrderSummaryResponse
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int ItemCount { get; set; }
}

public class OrderItemResponse
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal PriceAtPurchaseTime { get; set; }
    public int OrderId { get; set; }
    
    // Navigation properties
    public ProductResponse? Product { get; set; }
}
