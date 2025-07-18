using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateProductSpecificationsRequest
{
    [MaxLength(200)]
    public string? Material { get; set; }
    
    [MaxLength(200)]
    public string? Dimensions { get; set; }
    
    [MaxLength(200)]
    public string? TotalWeight { get; set; }
    
    [MaxLength(200)]
    public string? WeightWithWater { get; set; }
    
    [MaxLength(200)]
    public string? WaterVolume { get; set; }
}
