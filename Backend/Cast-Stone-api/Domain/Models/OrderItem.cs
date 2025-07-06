using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast_Stone_api.Domain.Models;

public class OrderItem
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int ProductId { get; set; }
    
    [Required]
    public int Quantity { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal PriceAtPurchaseTime { get; set; }
    
    [Required]
    public int OrderId { get; set; }
    
    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; } = null!;
    
    [ForeignKey(nameof(OrderId))]
    public virtual Order Order { get; set; } = null!;
}
