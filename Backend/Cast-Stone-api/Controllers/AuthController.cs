using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthenticationService _authenticationService;

    public AuthController(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    /// <summary>
    /// Validate user credentials for login
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthenticationResult>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<AuthenticationResult>.ErrorResponse("Validation failed", errors));
            }

            var result = await _authenticationService.ValidateCredentialsAsync(request.Email, request.Password);
            
            if (!result.IsValid)
            {
                return Unauthorized(ApiResponse<AuthenticationResult>.ErrorResponse(result.ErrorMessage ?? "Invalid credentials"));
            }

            return Ok(ApiResponse<AuthenticationResult>.SuccessResponse(result, "Login successful"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<AuthenticationResult>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Check if user is an approved wholesale buyer
    /// </summary>
    [HttpGet("check-wholesale-status/{email}")]
    public async Task<ActionResult<ApiResponse<bool>>> CheckWholesaleStatus(string email)
    {
        try
        {
            var isApproved = await _authenticationService.IsUserApprovedWholesaleBuyerAsync(email);
            return Ok(ApiResponse<bool>.SuccessResponse(isApproved, "Wholesale status checked successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get user information by email
    /// </summary>
    [HttpGet("user/{email}")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetUserByEmail(string email)
    {
        try
        {
            var user = await _authenticationService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound(ApiResponse<UserResponse>.ErrorResponse("User not found"));
            }

            return Ok(ApiResponse<UserResponse>.SuccessResponse(user, "User retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserResponse>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }
}

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}
