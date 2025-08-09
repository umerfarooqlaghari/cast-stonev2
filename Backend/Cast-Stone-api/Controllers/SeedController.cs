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
            return StatusCode(500, ApiResponse.ErrorResponse("Seeding failed", new List<string> { ex.ToString() }));
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
            return StatusCode(500, ApiResponse.ErrorResponse("Status seeding failed", new List<string> { ex.ToString() }));
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
            return StatusCode(500, ApiResponse.ErrorResponse("Admin user seeding failed", new List<string> { ex.ToString() }));
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
            return StatusCode(500, ApiResponse.ErrorResponse("Collections seeding failed", new List<string> { ex.ToString() }));
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
            return StatusCode(500, ApiResponse.ErrorResponse("Products seeding failed", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Seed wholesale buyer locations with random US coordinates
    /// </summary>
    [HttpPost("wholesale-buyer-locations")]
    public async Task<ActionResult<ApiResponse>> SeedWholesaleBuyerLocations()
    {
        try
        {
            var seeder = new SeedWholesaleBuyerLocations(_context);
            await seeder.SeedLocationsAsync();
            return Ok(ApiResponse.SuccessResponse("Wholesale buyer locations seeded successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Wholesale buyer location seeding failed", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Test database connection and check for missing columns
    /// </summary>
    [HttpPost("test-database")]
    public async Task<ActionResult<ApiResponse>> TestDatabase()
    {
        try
        {
            var tester = new TestAndFixDatabase(_context);
            await tester.TestDatabaseConnectionAsync();
            return Ok(ApiResponse.SuccessResponse("Database test completed - check console output"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Database test failed", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Add missing Latitude and Longitude columns to WholesaleBuyers table
    /// </summary>
    [HttpPost("fix-database")]
    public async Task<ActionResult<ApiResponse>> FixDatabase()
    {
        try
        {
            var tester = new TestAndFixDatabase(_context);
            await tester.AddMissingColumnsAsync();
            return Ok(ApiResponse.SuccessResponse("Database columns added successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Database fix failed", new List<string> { ex.ToString() }));
        }
    }
}
