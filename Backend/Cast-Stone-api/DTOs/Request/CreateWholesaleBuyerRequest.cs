using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class CreateWholesaleBuyerRequest
{
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    // Personal & Business Information
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string BusinessType { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? OtherBusinessType { get; set; }
    
    [MaxLength(50)]
    public string? TaxNumber { get; set; }
    
    // Business Address
    [Required]
    [MaxLength(500)]
    public string BusinessAddress { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string State { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string City { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string ZipCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Country { get; set; } = string.Empty;
    
    // How did you hear about us
    public List<string> HowDidYouHear { get; set; } = new List<string>();
    
    [MaxLength(500)]
    public string? OtherHowDidYouHear { get; set; }
    
    [MaxLength(1000)]
    public string? Comments { get; set; }
    
    // Account Credentials (for creating user account)
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
}
