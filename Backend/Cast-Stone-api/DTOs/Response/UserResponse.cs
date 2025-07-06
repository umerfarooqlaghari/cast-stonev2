namespace Cast_Stone_api.DTOs.Response;

public class UserResponse
{
    public int Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? ZipCode { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Active { get; set; }
}

public class StatusResponse
{
    public int Id { get; set; }
    public string StatusName { get; set; } = string.Empty;
}
