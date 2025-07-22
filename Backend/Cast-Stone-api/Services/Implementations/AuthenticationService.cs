using AutoMapper;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class AuthenticationService : IAuthenticationService
{
    private readonly IUserRepository _userRepository;
    private readonly IWholesaleBuyerRepository _wholesaleBuyerRepository;
    private readonly IMapper _mapper;

    public AuthenticationService(
        IUserRepository userRepository,
        IWholesaleBuyerRepository wholesaleBuyerRepository,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _wholesaleBuyerRepository = wholesaleBuyerRepository;
        _mapper = mapper;
    }

    public async Task<AuthenticationResult> ValidateCredentialsAsync(string email, string password)
    {
        try
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                return new AuthenticationResult
                {
                    IsValid = false,
                    ErrorMessage = "Invalid email or password"
                };
            }

            // Check if user is active
            if (!user.Active)
            {
                return new AuthenticationResult
                {
                    IsValid = false,
                    ErrorMessage = "Account is deactivated"
                };
            }

            // Validate password
            if (string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return new AuthenticationResult
                {
                    IsValid = false,
                    ErrorMessage = "Invalid email or password"
                };
            }

            // Check if user is a wholesale buyer and if they're approved
            bool isApprovedWholesaleBuyer = false;
            if (user.Role == "WholesaleBuyer")
            {
                if (!user.IsApproved)
                {
                    return new AuthenticationResult
                    {
                        IsValid = false,
                        ErrorMessage = "Your wholesale buyer application is pending approval"
                    };
                }
                isApprovedWholesaleBuyer = true;
            }

            return new AuthenticationResult
            {
                IsValid = true,
                User = _mapper.Map<UserResponse>(user),
                IsApprovedWholesaleBuyer = isApprovedWholesaleBuyer
            };
        }
        catch (Exception ex)
        {
            return new AuthenticationResult
            {
                IsValid = false,
                ErrorMessage = $"Authentication error: {ex.Message}"
            };
        }
    }

    public async Task<UserResponse?> GetUserByEmailAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        return user != null ? _mapper.Map<UserResponse>(user) : null;
    }

    public async Task<bool> IsUserApprovedWholesaleBuyerAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null || user.Role != "WholesaleBuyer")
        {
            return false;
        }

        return user.IsApproved;
    }

    public async Task<bool> ValidatePasswordAsync(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
        {
            return false;
        }

        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }
}
