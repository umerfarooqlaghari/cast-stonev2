using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/wholesale-buyer-locations")]
public class WholesaleBuyerLocationsController : ControllerBase
{
    private readonly IWholesaleBuyerLocationService _locationService;

    public WholesaleBuyerLocationsController(IWholesaleBuyerLocationService locationService)
    {
        _locationService = locationService;
    }

    /// <summary>
    /// Get all wholesale buyer locations
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<BuyerLocationResponse>>>> GetAll([FromQuery] int? wholesaleBuyerId)
    {
        try
        {
            IEnumerable<BuyerLocationResponse> locations;

            if (wholesaleBuyerId.HasValue)
            {
                locations = await _locationService.GetByWholesaleBuyerIdAsync(wholesaleBuyerId.Value);
            }
            else
            {
                locations = await _locationService.GetAllAsync();
            }

            return Ok(ApiResponse<IEnumerable<BuyerLocationResponse>>.SuccessResponse(
                locations, 
                "Locations retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<BuyerLocationResponse>>.ErrorResponse(
                $"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get a specific wholesale buyer location by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<BuyerLocationResponse>>> GetById(int id)
    {
        try
        {
            var location = await _locationService.GetByIdAsync(id);
            if (location == null)
            {
                return NotFound(ApiResponse<BuyerLocationResponse>.ErrorResponse(
                    "Location not found"));
            }

            return Ok(ApiResponse<BuyerLocationResponse>.SuccessResponse(
                location, 
                "Location retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<BuyerLocationResponse>.ErrorResponse(
                $"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Create a new wholesale buyer location
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<BuyerLocationResponse>>> Create([FromBody] CreateWholesaleBuyerLocationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<BuyerLocationResponse>.ErrorResponse(
                    "Validation failed", 
                    errors));
            }

            var location = await _locationService.CreateAsync(request);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = location.Id }, 
                ApiResponse<BuyerLocationResponse>.SuccessResponse(
                    location, 
                    "Location created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<BuyerLocationResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<BuyerLocationResponse>.ErrorResponse(
                $"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Update an existing wholesale buyer location
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<BuyerLocationResponse>>> Update(
        int id, 
        [FromBody] UpdateWholesaleBuyerLocationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<BuyerLocationResponse>.ErrorResponse(
                    "Validation failed", 
                    errors));
            }

            var location = await _locationService.UpdateAsync(id, request);
            if (location == null)
            {
                return NotFound(ApiResponse<BuyerLocationResponse>.ErrorResponse(
                    "Location not found"));
            }

            return Ok(ApiResponse<BuyerLocationResponse>.SuccessResponse(
                location, 
                "Location updated successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<BuyerLocationResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<BuyerLocationResponse>.ErrorResponse(
                $"Internal server error: {ex.Message}"));
        }
    }

    /// <summary>
    /// Delete a wholesale buyer location
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var result = await _locationService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(ApiResponse<object>.ErrorResponse(
                    "Location not found"));
            }

            return Ok(ApiResponse<object>.SuccessResponse(
                null, 
                "Location deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse(
                $"Internal server error: {ex.Message}"));
        }
    }
}

