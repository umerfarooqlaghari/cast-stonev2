using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.Domain.Models;

public class Status
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string StatusName { get; set; } = string.Empty;
    
    // Navigation properties
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
