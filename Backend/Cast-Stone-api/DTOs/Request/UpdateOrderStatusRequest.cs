using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateOrderStatusRequest
{
    [Required]
    public int StatusId { get; set; }
}
