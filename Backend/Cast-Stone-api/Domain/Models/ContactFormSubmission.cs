using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.Domain.Models;

public enum InquiryType
{
    ProductInquiry = 1,
    RequestDesignConsultation = 2,
    CustomOrders = 3,
    TradePartnerships = 4,
    InstallationSupport = 5,
    ShippingAndLeadTimes = 6,
    RequestCatalogPriceList = 7,
    MediaPressInquiry = 8,
    GeneralQuestions = 9
}

public class ContactFormSubmission
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Company { get; set; }

    [Required]
    [MaxLength(100)]
    public string State { get; set; } = string.Empty;

    [Required]
    public InquiryType Inquiry { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
