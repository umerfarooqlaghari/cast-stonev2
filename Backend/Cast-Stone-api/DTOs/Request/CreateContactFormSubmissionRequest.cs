using System.ComponentModel.DataAnnotations;
using Cast_Stone_api.Domain.Models;

namespace Cast_Stone_api.DTOs.Request;

public class CreateContactFormSubmissionRequest
{
    [Required(ErrorMessage = "Name is required")]
    [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Email is required")]
    [MaxLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address")]
    public string Email { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Phone number is required")]
    [MaxLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
    [Phone(ErrorMessage = "Please enter a valid phone number")]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [MaxLength(200, ErrorMessage = "Company name cannot exceed 200 characters")]
    public string? Company { get; set; }
    
    [Required(ErrorMessage = "State is required")]
    [MaxLength(100, ErrorMessage = "State cannot exceed 100 characters")]
    public string State { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Inquiry type is required")]
    public InquiryType Inquiry { get; set; }
    
    [Required(ErrorMessage = "Message is required")]
    [MaxLength(2000, ErrorMessage = "Message cannot exceed 2000 characters")]
    [MinLength(10, ErrorMessage = "Message must be at least 10 characters")]
    public string Message { get; set; } = string.Empty;
}
