using AutoMapper;
using BCrypt.Net;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<UserResponse?> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user != null ? _mapper.Map<UserResponse>(user) : null;
    }

    public async Task<IEnumerable<UserResponse>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<UserResponse>>(users);
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request)
    {
        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(request.Email))
        {
            throw new ArgumentException("Email already exists");
        }

        var user = _mapper.Map<User>(request);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        user.CreatedAt = DateTime.UtcNow;

        var createdUser = await _userRepository.AddAsync(user);
        return _mapper.Map<UserResponse>(createdUser);
    }

    public async Task<UserResponse?> UpdateAsync(int id, UpdateUserRequest request)
    {
        var existingUser = await _userRepository.GetByIdAsync(id);
        if (existingUser == null)
            return null;

        _mapper.Map(request, existingUser);
        var updatedUser = await _userRepository.UpdateAsync(existingUser);
        return _mapper.Map<UserResponse>(updatedUser);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return false;

        await _userRepository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _userRepository.ExistsAsync(id);
    }

    public async Task<UserResponse?> GetByEmailAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        return user != null ? _mapper.Map<UserResponse>(user) : null;
    }

    public async Task<IEnumerable<UserResponse>> GetByRoleAsync(string role)
    {
        var users = await _userRepository.GetByRoleAsync(role);
        return _mapper.Map<IEnumerable<UserResponse>>(users);
    }

    public async Task<IEnumerable<UserResponse>> GetActiveUsersAsync()
    {
        var users = await _userRepository.GetActiveUsersAsync();
        return _mapper.Map<IEnumerable<UserResponse>>(users);
    }

    public async Task<IEnumerable<UserResponse>> GetInactiveUsersAsync()
    {
        var users = await _userRepository.GetInactiveUsersAsync();
        return _mapper.Map<IEnumerable<UserResponse>>(users);
    }

    public async Task<UserResponse?> GetWithOrdersAsync(int id)
    {
        var user = await _userRepository.GetWithOrdersAsync(id);
        return user != null ? _mapper.Map<UserResponse>(user) : null;
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _userRepository.EmailExistsAsync(email);
    }

    public async Task<int> GetUserCountByRoleAsync(string role)
    {
        return await _userRepository.GetUserCountByRoleAsync(role);
    }

    public async Task<IEnumerable<UserResponse>> GetRecentUsersAsync(int count = 10)
    {
        var users = await _userRepository.GetRecentUsersAsync(count);
        return _mapper.Map<IEnumerable<UserResponse>>(users);
    }

    public async Task<bool> ValidatePasswordAsync(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            return false;

        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }

    public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            return false;

        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<bool> DeactivateUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return false;

        user.Active = false;
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<bool> ActivateUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return false;

        user.Active = true;
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<PaginatedResponse<UserResponse>> GetFilteredAsync(UserFilterRequest filter)
    {
        var (users, totalCount) = await _userRepository.GetFilteredAsync(filter);
        var userResponses = _mapper.Map<IEnumerable<UserResponse>>(users);

        var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

        return new PaginatedResponse<UserResponse>
        {
            Data = userResponses,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalRecords = totalCount,
            TotalPages = totalPages,
            HasNextPage = filter.PageNumber < totalPages,
            HasPreviousPage = filter.PageNumber > 1
        };
    }
}
