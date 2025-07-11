using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cast_Stone_api.Domain.Models;

public class DownloadableContent
{
    [Key]
    public int Id { get; set; }
    
    [MaxLength(500)]
    public string? Care { get; set; }
    
    [MaxLength(500)]
    public string? ProductInstructions { get; set; }
    
    [MaxLength(500)]
    public string? CAD { get; set; }
    
    [Required]
    public int ProductId { get; set; }
    
    // Navigation property
    [JsonIgnore]
    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; } = null!;
}
