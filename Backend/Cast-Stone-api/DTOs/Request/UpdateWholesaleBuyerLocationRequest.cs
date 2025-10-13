using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateWholesaleBuyerLocationRequest
{
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
    public decimal? Latitude { get; set; }
    
    [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
    public decimal? Longitude { get; set; }
}

