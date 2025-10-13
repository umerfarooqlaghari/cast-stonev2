using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast_Stone_api.Domain.Models;

public class WholesaleBuyerLocation
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int WholesaleBuyerId { get; set; }
    
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,7)")]
    public decimal Latitude { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,7)")]
    public decimal Longitude { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation property
    public virtual WholesaleBuyer? WholesaleBuyer { get; set; }
}

