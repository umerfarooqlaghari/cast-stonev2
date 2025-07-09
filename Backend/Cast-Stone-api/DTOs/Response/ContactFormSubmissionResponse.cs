using Cast_Stone_api.Domain.Models;

namespace Cast_Stone_api.DTOs.Response;

public class ContactFormSubmissionResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string State { get; set; } = string.Empty;
    public InquiryType Inquiry { get; set; }
    public string InquiryDisplayName { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
