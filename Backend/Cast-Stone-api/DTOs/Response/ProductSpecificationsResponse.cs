namespace Cast_Stone_api.DTOs.Response;

public class ProductSpecificationsResponse
{
    public int Id { get; set; }
    public string? Material { get; set; }
    public string? Dimensions { get; set; }
    public string? Base_Dimensions { get; set; }
    public string? Photographed_In { get; set; }
    public string? Pieces { get; set; }
    public string? TotalWeight { get; set; }
    public string? WeightWithWater { get; set; }
    public string? WaterVolume { get; set; }
    public int ProductId { get; set; }
}
