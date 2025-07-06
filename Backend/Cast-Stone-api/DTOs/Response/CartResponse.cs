namespace Cast_Stone_api.DTOs.Response;

public class CartResponse
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string? SessionId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<CartItemResponse> CartItems { get; set; } = new List<CartItemResponse>();
    public decimal TotalAmount { get; set; }
    public int TotalItems { get; set; }
}

public class CartItemResponse
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Product information
    public ProductResponse? Product { get; set; }
    public decimal ItemTotal { get; set; }
}

public class CartSummaryResponse
{
    public int Id { get; set; }
    public int TotalItems { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime UpdatedAt { get; set; }
}
