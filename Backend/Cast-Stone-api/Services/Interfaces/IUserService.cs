using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IUserService : IBaseService<Domain.Models.User, UserResponse, CreateUserRequest, UpdateUserRequest>
{
    Task<UserResponse?> GetByEmailAsync(string email);
    Task<IEnumerable<UserResponse>> GetByRoleAsync(string role);
    Task<IEnumerable<UserResponse>> GetActiveUsersAsync();
    Task<IEnumerable<UserResponse>> GetInactiveUsersAsync();
    Task<UserResponse?> GetWithOrdersAsync(int id);
    Task<bool> EmailExistsAsync(string email);
    Task<int> GetUserCountByRoleAsync(string role);
    Task<IEnumerable<UserResponse>> GetRecentUsersAsync(int count = 10);
    Task<bool> ValidatePasswordAsync(string email, string password);
    Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    Task<bool> DeactivateUserAsync(int id);
    Task<bool> ActivateUserAsync(int id);
    Task<PaginatedResponse<UserResponse>> GetFilteredAsync(UserFilterRequest filter);
}
