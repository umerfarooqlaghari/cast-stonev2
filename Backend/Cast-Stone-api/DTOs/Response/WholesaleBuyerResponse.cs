namespace Cast_Stone_api.DTOs.Response;

public class WholesaleBuyerResponse
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    
    // Personal & Business Information
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string BusinessType { get; set; } = string.Empty;
    public string? OtherBusinessType { get; set; }
    public string? TaxNumber { get; set; }
    
    // Business Address
    public string BusinessAddress { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    
    // How did you hear about us
    public List<string> HowDidYouHear { get; set; } = new List<string>();
    public string? OtherHowDidYouHear { get; set; }
    public string? Comments { get; set; }
    
    // Application Status
    public string Status { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
    public int? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public UserResponse? User { get; set; }
    public UserResponse? ApprovedByUser { get; set; }
}

public class WholesaleBuyerSummaryResponse
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
}
