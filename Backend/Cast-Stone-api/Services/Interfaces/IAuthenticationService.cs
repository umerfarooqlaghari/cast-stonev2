using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IAuthenticationService
{
    Task<AuthenticationResult> ValidateCredentialsAsync(string email, string password);
    Task<UserResponse?> GetUserByEmailAsync(string email);
    Task<bool> IsUserApprovedWholesaleBuyerAsync(string email);
    Task<bool> ValidatePasswordAsync(string email, string password);
}

public class AuthenticationResult
{
    public bool IsValid { get; set; }
    public UserResponse? User { get; set; }
    public string? ErrorMessage { get; set; }
    public bool IsApprovedWholesaleBuyer { get; set; }
}
