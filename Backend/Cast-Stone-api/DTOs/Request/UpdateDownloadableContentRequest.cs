using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateDownloadableContentRequest
{
    [MaxLength(500)]
    public string? Care { get; set; }
    
    [MaxLength(500)]
    public string? ProductInstructions { get; set; }
    
    [MaxLength(500)]
    public string? CAD { get; set; }
}
