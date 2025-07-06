using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetByRoleAsync(string role);
    Task<IEnumerable<User>> GetActiveUsersAsync();
    Task<IEnumerable<User>> GetInactiveUsersAsync();
    Task<User?> GetWithOrdersAsync(int id);
    Task<bool> EmailExistsAsync(string email);
    Task<int> GetUserCountByRoleAsync(string role);
    Task<IEnumerable<User>> GetRecentUsersAsync(int count = 10);
    Task<(IEnumerable<User> Users, int TotalCount)> GetFilteredAsync(UserFilterRequest filter);
}
