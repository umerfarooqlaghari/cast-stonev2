using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast_Stone_api.Domain.Models;

public class Order
{
    [Key]
    public int Id { get; set; }
    
    public int? UserId { get; set; } // nullable for guest orders
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? PhoneNumber { get; set; }
    
    [MaxLength(100)]
    public string? Country { get; set; }
    
    [MaxLength(100)]
    public string? City { get; set; }
    
    [MaxLength(20)]
    public string? ZipCode { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }
    
    [Required]
    public int StatusId { get; set; } // FK to Status table
    
    [MaxLength(50)]
    public string? PaymentMethod { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User? User { get; set; }
    
    [ForeignKey(nameof(StatusId))]
    public virtual Status Status { get; set; } = null!;
    
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
