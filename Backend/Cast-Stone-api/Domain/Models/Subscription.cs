using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.Domain.Models;

public class Subscription
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
