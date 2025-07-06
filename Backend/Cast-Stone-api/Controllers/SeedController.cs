using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.Data;
using Cast_Stone_api.Scripts;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SeedController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Seed all data (statuses, admin user, sample collections and products)
    /// </summary>
    [HttpPost("all")]
    public async Task<ActionResult<ApiResponse>> SeedAll()
    {
        try
        {
            await SeedData.SeedAllDataAsync(_context);
            return Ok(ApiResponse.SuccessResponse("All data seeded successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Seeding failed", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Seed only status data
    /// </summary>
    [HttpPost("statuses")]
    public async Task<ActionResult<ApiResponse>> SeedStatuses()
    {
        try
        {
            await SeedData.SeedStatusesAsync(_context);
            return Ok(ApiResponse.SuccessResponse("Status data seeded successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Status seeding failed", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Seed only admin user
    /// </summary>
    [HttpPost("admin-user")]
    public async Task<ActionResult<ApiResponse>> SeedAdminUser()
    {
        try
        {
            await SeedData.SeedAdminUserAsync(_context);
            return Ok(ApiResponse.SuccessResponse("Admin user seeded successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Admin user seeding failed", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Seed sample collections
    /// </summary>
    [HttpPost("collections")]
    public async Task<ActionResult<ApiResponse>> SeedCollections()
    {
        try
        {
            await SeedData.SeedSampleCollectionsAsync(_context);
            return Ok(ApiResponse.SuccessResponse("Sample collections seeded successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Collections seeding failed", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Seed sample products
    /// </summary>
    [HttpPost("products")]
    public async Task<ActionResult<ApiResponse>> SeedProducts()
    {
        try
        {
            await SeedData.SeedSampleProductsAsync(_context);
            return Ok(ApiResponse.SuccessResponse("Sample products seeded successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Products seeding failed", new List<string> { ex.Message }));
        }
    }
}
