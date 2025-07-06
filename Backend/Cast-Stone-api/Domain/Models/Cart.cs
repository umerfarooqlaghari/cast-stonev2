using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast_Stone_api.Domain.Models;

public class Cart
{
    [Key]
    public int Id { get; set; }
    
    public int? UserId { get; set; } // nullable for guest carts
    
    [MaxLength(255)]
    public string? SessionId { get; set; } // for guest cart identification
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User? User { get; set; }
    
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
