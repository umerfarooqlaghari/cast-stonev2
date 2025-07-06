using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.Domain.Models;

public class ContactFormSubmission
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
