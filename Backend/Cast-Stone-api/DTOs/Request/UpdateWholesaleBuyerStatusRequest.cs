using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateWholesaleBuyerStatusRequest
{
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = string.Empty; // Approved, Rejected
    
    [MaxLength(500)]
    public string? AdminNotes { get; set; }
}
