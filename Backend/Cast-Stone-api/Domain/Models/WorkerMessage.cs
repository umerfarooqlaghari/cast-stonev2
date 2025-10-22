using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast_Stone_api.Domain.Models
{
    public class WorkerMessage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Heading { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        // Foreign Key to Collection (nullable - can be assigned to multiple collections or none)
        public int? CollectionId { get; set; }

        [ForeignKey(nameof(CollectionId))]
        public virtual Collection? Collection { get; set; }

        [Required]
        [MaxLength(100)]
        public string CreatedBy { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(100)]
        public string? UpdatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public bool IsActive { get; set; } = true;
    }
}

