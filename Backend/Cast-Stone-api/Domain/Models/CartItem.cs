using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast_Stone_api.Domain.Models;

public class CartItem
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int CartId { get; set; }
    
    [Required]
    public int ProductId { get; set; }
    
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey(nameof(CartId))]
    public virtual Cart Cart { get; set; } = null!;
    
    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; } = null!;
}
