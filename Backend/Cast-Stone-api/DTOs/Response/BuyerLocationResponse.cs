namespace Cast_Stone_api.DTOs.Response;

public class BuyerLocationResponse
{
    public int Id { get; set; }
    public int WholesaleBuyerId { get; set; }
    public string? Address { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

