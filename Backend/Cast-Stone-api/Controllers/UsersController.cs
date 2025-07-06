using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserResponse>>>> GetAll()
    {
        try
        {
            var users = await _userService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<UserResponse>>.SuccessResponse(users));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<UserResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetById(int id)
    {
        try
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound(ApiResponse<UserResponse>.ErrorResponse("User not found"));

            return Ok(ApiResponse<UserResponse>.SuccessResponse(user));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserResponse>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserResponse>>> Create([FromBody] CreateUserRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<UserResponse>.ErrorResponse("Validation failed", errors));
            }

            var user = await _userService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, ApiResponse<UserResponse>.SuccessResponse(user, "User created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<UserResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserResponse>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> Update(int id, [FromBody] UpdateUserRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<UserResponse>.ErrorResponse("Validation failed", errors));
            }

            var user = await _userService.UpdateAsync(id, request);
            if (user == null)
                return NotFound(ApiResponse<UserResponse>.ErrorResponse("User not found"));

            return Ok(ApiResponse<UserResponse>.SuccessResponse(user, "User updated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserResponse>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Delete a user
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(int id)
    {
        try
        {
            var result = await _userService.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse.ErrorResponse("User not found"));

            return Ok(ApiResponse.SuccessResponse("User deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get user by email
    /// </summary>
    [HttpGet("email/{email}")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetByEmail(string email)
    {
        try
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null)
                return NotFound(ApiResponse<UserResponse>.ErrorResponse("User not found"));

            return Ok(ApiResponse<UserResponse>.SuccessResponse(user));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserResponse>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get users by role
    /// </summary>
    [HttpGet("role/{role}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserResponse>>>> GetByRole(string role)
    {
        try
        {
            var users = await _userService.GetByRoleAsync(role);
            return Ok(ApiResponse<IEnumerable<UserResponse>>.SuccessResponse(users));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<UserResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get active users
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserResponse>>>> GetActive()
    {
        try
        {
            var users = await _userService.GetActiveUsersAsync();
            return Ok(ApiResponse<IEnumerable<UserResponse>>.SuccessResponse(users));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<UserResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get recent users
    /// </summary>
    [HttpGet("recent")]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserResponse>>>> GetRecent([FromQuery] int count = 10)
    {
        try
        {
            var users = await _userService.GetRecentUsersAsync(count);
            return Ok(ApiResponse<IEnumerable<UserResponse>>.SuccessResponse(users));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<UserResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Deactivate a user
    /// </summary>
    [HttpPatch("{id}/deactivate")]
    public async Task<ActionResult<ApiResponse>> Deactivate(int id)
    {
        try
        {
            var result = await _userService.DeactivateUserAsync(id);
            if (!result)
                return NotFound(ApiResponse.ErrorResponse("User not found"));

            return Ok(ApiResponse.SuccessResponse("User deactivated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Activate a user
    /// </summary>
    [HttpPatch("{id}/activate")]
    public async Task<ActionResult<ApiResponse>> Activate(int id)
    {
        try
        {
            var result = await _userService.ActivateUserAsync(id);
            if (!result)
                return NotFound(ApiResponse.ErrorResponse("User not found"));

            return Ok(ApiResponse.SuccessResponse("User activated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get user with orders
    /// </summary>
    [HttpGet("{id}/orders")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetWithOrders(int id)
    {
        try
        {
            var user = await _userService.GetWithOrdersAsync(id);
            if (user == null)
                return NotFound(ApiResponse<UserResponse>.ErrorResponse("User not found"));

            return Ok(ApiResponse<UserResponse>.SuccessResponse(user));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserResponse>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Check if email exists
    /// </summary>
    [HttpGet("email-exists/{email}")]
    public async Task<ActionResult<ApiResponse<bool>>> EmailExists(string email)
    {
        try
        {
            var exists = await _userService.EmailExistsAsync(email);
            return Ok(ApiResponse<bool>.SuccessResponse(exists));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get users with advanced filtering and pagination
    /// </summary>
    [HttpGet("filter")]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<UserResponse>>>> GetFiltered([FromQuery] UserFilterRequest filter)
    {
        try
        {
            var result = await _userService.GetFilteredAsync(filter);
            return Ok(ApiResponse<PaginatedResponse<UserResponse>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<PaginatedResponse<UserResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }
}
