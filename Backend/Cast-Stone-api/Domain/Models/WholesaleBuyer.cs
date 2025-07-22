using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast_Stone_api.Domain.Models;

public class WholesaleBuyer
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty; // Reference to User email
    
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
    
    // How did you hear about us
    [Column(TypeName = "jsonb")]
    public List<string> HowDidYouHear { get; set; } = new List<string>();
    
    [MaxLength(500)]
    public string? OtherHowDidYouHear { get; set; }
    
    [MaxLength(1000)]
    public string? Comments { get; set; }
    
    // Application Status
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    
    [MaxLength(500)]
    public string? AdminNotes { get; set; }
    
    public int? ApprovedBy { get; set; } // Admin user ID who approved/rejected
    
    public DateTime? ApprovedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual User? User { get; set; }
    public virtual User? ApprovedByUser { get; set; }
}
