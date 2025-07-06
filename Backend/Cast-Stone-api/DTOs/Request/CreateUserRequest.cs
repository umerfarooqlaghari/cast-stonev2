using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class CreateUserRequest
{
    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = "customer"; // admin, customer, guest

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

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
