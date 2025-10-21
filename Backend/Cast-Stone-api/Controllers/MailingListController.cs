using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MailingListController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MailingListController> _logger;

    public MailingListController(ApplicationDbContext context, ILogger<MailingListController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all mailing list subscribers
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<MailingList>>>> GetAll()
    {
        try
        {
            var subscribers = await _context.MailingLists
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
            
            return Ok(ApiResponse<IEnumerable<MailingList>>.SuccessResponse(subscribers));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving mailing list subscribers");
            return StatusCode(500, ApiResponse<IEnumerable<MailingList>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Subscribe to mailing list
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<MailingList>>> Subscribe([FromBody] MailingListSubscribeRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<MailingList>.ErrorResponse("Validation failed", errors));
            }

            // Check if email already exists
            var existingSubscriber = await _context.MailingLists
                .FirstOrDefaultAsync(m => m.Email.ToLower() == request.Email.ToLower());

            if (existingSubscriber != null)
            {
                return BadRequest(ApiResponse<MailingList>.ErrorResponse("This email is already subscribed to our mailing list"));
            }

            var subscriber = new MailingList
            {
                FullName = request.FullName,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow
            };

            _context.MailingLists.Add(subscriber);
            await _context.SaveChangesAsync();

            _logger.LogInformation("New mailing list subscriber: {Email}", request.Email);

            return Ok(ApiResponse<MailingList>.SuccessResponse(subscriber, "Successfully subscribed to our mailing list!"));
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("duplicate key") == true)
        {
            return BadRequest(ApiResponse<MailingList>.ErrorResponse("This email is already subscribed to our mailing list"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error subscribing to mailing list");
            return StatusCode(500, ApiResponse<MailingList>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Delete a mailing list subscriber
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var subscriber = await _context.MailingLists.FindAsync(id);
            
            if (subscriber == null)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Subscriber not found"));
            }

            _context.MailingLists.Remove(subscriber);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted mailing list subscriber: {Email}", subscriber.Email);

            return Ok(ApiResponse<object>.SuccessResponse(null, "Subscriber deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting mailing list subscriber");
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }
}

public class MailingListSubscribeRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

