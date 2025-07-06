using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateUserRequest
{
    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = "customer";

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(100)]
    public string? Country { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [MaxLength(20)]
    public string? ZipCode { get; set; }

    public bool Active { get; set; } = true;
}
