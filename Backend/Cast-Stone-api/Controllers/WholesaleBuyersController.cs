using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WholesaleBuyersController : ControllerBase
{
    private readonly IWholesaleBuyerService _wholesaleBuyerService;

    public WholesaleBuyersController(IWholesaleBuyerService wholesaleBuyerService)
    {
        _wholesaleBuyerService = wholesaleBuyerService;
    }

    /// <summary>
    /// Get all wholesale buyer applications
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<WholesaleBuyerResponse>>>> GetAll()
    {
        try
        {
            var wholesaleBuyers = await _wholesaleBuyerService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<WholesaleBuyerResponse>>.SuccessResponse(wholesaleBuyers, "Wholesale buyers retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<WholesaleBuyerResponse>>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get wholesale buyer application by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<WholesaleBuyerResponse>>> GetById(int id)
    {
        try
        {
            var wholesaleBuyer = await _wholesaleBuyerService.GetByIdAsync(id);
            if (wholesaleBuyer == null)
            {
                return NotFound(ApiResponse<WholesaleBuyerResponse>.ErrorResponse("Wholesale buyer not found"));
            }

            return Ok(ApiResponse<WholesaleBuyerResponse>.SuccessResponse(wholesaleBuyer, "Wholesale buyer retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<WholesaleBuyerResponse>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get wholesale buyer application by email
    /// </summary>
    [HttpGet("email/{email}")]
    public async Task<ActionResult<ApiResponse<WholesaleBuyerResponse>>> GetByEmail(string email)
    {
        try
        {
            var wholesaleBuyer = await _wholesaleBuyerService.GetByEmailAsync(email);
            if (wholesaleBuyer == null)
            {
                return NotFound(ApiResponse<WholesaleBuyerResponse>.ErrorResponse("Wholesale buyer not found"));
            }

            return Ok(ApiResponse<WholesaleBuyerResponse>.SuccessResponse(wholesaleBuyer, "Wholesale buyer retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<WholesaleBuyerResponse>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get wholesale buyer applications by status
    /// </summary>
    [HttpGet("status/{status}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WholesaleBuyerResponse>>>> GetByStatus(string status)
    {
        try
        {
            var wholesaleBuyers = await _wholesaleBuyerService.GetByStatusAsync(status);
            return Ok(ApiResponse<IEnumerable<WholesaleBuyerResponse>>.SuccessResponse(wholesaleBuyers, $"Wholesale buyers with status '{status}' retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<WholesaleBuyerResponse>>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get pending wholesale buyer applications
    /// </summary>
    [HttpGet("pending")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WholesaleBuyerResponse>>>> GetPending()
    {
        try
        {
            var applications = await _wholesaleBuyerService.GetPendingApplicationsAsync();
            return Ok(ApiResponse<IEnumerable<WholesaleBuyerResponse>>.SuccessResponse(applications, "Pending applications retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<WholesaleBuyerResponse>>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get approved wholesale buyers
    /// </summary>
    [HttpGet("approved")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WholesaleBuyerResponse>>>> GetApproved()
    {
        try
        {
            var buyers = await _wholesaleBuyerService.GetApprovedBuyersAsync();
            return Ok(ApiResponse<IEnumerable<WholesaleBuyerResponse>>.SuccessResponse(buyers, "Approved wholesale buyers retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<WholesaleBuyerResponse>>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get recent wholesale buyer applications
    /// </summary>
    [HttpGet("recent")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WholesaleBuyerSummaryResponse>>>> GetRecent([FromQuery] int count = 10)
    {
        try
        {
            var applications = await _wholesaleBuyerService.GetRecentApplicationsAsync(count);
            return Ok(ApiResponse<IEnumerable<WholesaleBuyerSummaryResponse>>.SuccessResponse(applications, "Recent applications retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<WholesaleBuyerSummaryResponse>>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Submit a new wholesale buyer application
    /// </summary>
    [HttpPost("apply")]
    public async Task<ActionResult<ApiResponse<WholesaleBuyerResponse>>> SubmitApplication([FromBody] CreateWholesaleBuyerRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<WholesaleBuyerResponse>.ErrorResponse("Validation failed", errors));
            }

            var wholesaleBuyer = await _wholesaleBuyerService.SubmitApplicationAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = wholesaleBuyer.Id }, 
                ApiResponse<WholesaleBuyerResponse>.SuccessResponse(wholesaleBuyer, "Application submitted successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<WholesaleBuyerResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<WholesaleBuyerResponse>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Approve a wholesale buyer application
    /// </summary>
    [HttpPut("{id}/approve")]
    public async Task<ActionResult<ApiResponse<WholesaleBuyerResponse>>> ApproveApplication(int id, [FromBody] ApproveRejectRequest request)
    {
        try
        {
            var wholesaleBuyer = await _wholesaleBuyerService.ApproveApplicationAsync(id, request.AdminUserId, request.AdminNotes);
            if (wholesaleBuyer == null)
            {
                return NotFound(ApiResponse<WholesaleBuyerResponse>.ErrorResponse("Wholesale buyer application not found"));
            }

            return Ok(ApiResponse<WholesaleBuyerResponse>.SuccessResponse(wholesaleBuyer, "Application approved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<WholesaleBuyerResponse>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Reject a wholesale buyer application
    /// </summary>
    [HttpPut("{id}/reject")]
    public async Task<ActionResult<ApiResponse<WholesaleBuyerResponse>>> RejectApplication(int id, [FromBody] ApproveRejectRequest request)
    {
        try
        {
            var wholesaleBuyer = await _wholesaleBuyerService.RejectApplicationAsync(id, request.AdminUserId, request.AdminNotes);
            if (wholesaleBuyer == null)
            {
                return NotFound(ApiResponse<WholesaleBuyerResponse>.ErrorResponse("Wholesale buyer application not found"));
            }

            return Ok(ApiResponse<WholesaleBuyerResponse>.SuccessResponse(wholesaleBuyer, "Application rejected successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<WholesaleBuyerResponse>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Check if user is an approved wholesale buyer
    /// </summary>
    [HttpGet("check-approval/{email}")]
    public async Task<ActionResult<ApiResponse<bool>>> CheckApproval(string email)
    {
        try
        {
            var isApproved = await _wholesaleBuyerService.IsUserApprovedWholesaleBuyerAsync(email);
            return Ok(ApiResponse<bool>.SuccessResponse(isApproved, "Approval status checked successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Delete a wholesale buyer application
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            var result = await _wholesaleBuyerService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("Wholesale buyer application not found"));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Application deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get approved wholesale buyer locations for map display
    /// </summary>
    [HttpGet("locations")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WholesaleBuyerLocationResponse>>>> GetLocations()
    {
        try
        {
            var locations = await _wholesaleBuyerService.GetApprovedBuyerLocationsAsync();
            return Ok(ApiResponse<IEnumerable<WholesaleBuyerLocationResponse>>.SuccessResponse(locations, "Wholesale buyer locations retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<WholesaleBuyerLocationResponse>>.ErrorResponse($"Internal server error: {ex.Message}"));
        }
    }
}

public class ApproveRejectRequest
{
    public int AdminUserId { get; set; }
    public string? AdminNotes { get; set; }
}
