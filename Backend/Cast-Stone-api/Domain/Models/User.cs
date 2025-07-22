using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.Domain.Models;

public class User
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = "guest"; // admin, customer, guest, WholesaleBuyer
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? PhoneNumber { get; set; }
    
    [MaxLength(255)]
    public string? PasswordHash { get; set; } // nullable for guests

    [MaxLength(100)]
    public string? Country { get; set; }
    
    [MaxLength(100)]
    public string? City { get; set; }
    
    [MaxLength(20)]
    public string? ZipCode { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public bool Active { get; set; } = true;

    // Wholesale buyer approval status (only relevant for WholesaleBuyer role)
    public bool IsApproved { get; set; } = false;

    // Navigation properties
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual WholesaleBuyer? WholesaleBuyer { get; set; }
}
