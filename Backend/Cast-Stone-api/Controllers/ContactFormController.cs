using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactFormController : ControllerBase
{
    private readonly IContactFormSubmissionService _contactFormService;

    public ContactFormController(IContactFormSubmissionService contactFormService)
    {
        _contactFormService = contactFormService;
    }

    /// <summary>
    /// Get all contact form submissions (Admin only)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ContactFormSubmissionResponse>>>> GetAll()
    {
        try
        {
            var submissions = await _contactFormService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<ContactFormSubmissionResponse>>.SuccessResponse(submissions));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ContactFormSubmissionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get contact form submission by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ContactFormSubmissionResponse>>> GetById(int id)
    {
        try
        {
            var submission = await _contactFormService.GetByIdAsync(id);
            if (submission == null)
            {
                return NotFound(ApiResponse<ContactFormSubmissionResponse>.ErrorResponse("Contact form submission not found"));
            }
            return Ok(ApiResponse<ContactFormSubmissionResponse>.SuccessResponse(submission));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ContactFormSubmissionResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Create a new contact form submission
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ContactFormSubmissionResponse>>> Create([FromBody] CreateContactFormSubmissionRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<ContactFormSubmissionResponse>.ErrorResponse("Validation failed", errors));
            }

            var submission = await _contactFormService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = submission.Id }, ApiResponse<ContactFormSubmissionResponse>.SuccessResponse(submission, "Contact form submitted successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ContactFormSubmissionResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ContactFormSubmissionResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get recent contact form submissions
    /// </summary>
    [HttpGet("recent")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ContactFormSubmissionResponse>>>> GetRecent([FromQuery] int count = 10)
    {
        try
        {
            var submissions = await _contactFormService.GetRecentSubmissionsAsync(count);
            return Ok(ApiResponse<IEnumerable<ContactFormSubmissionResponse>>.SuccessResponse(submissions));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ContactFormSubmissionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get contact form submissions by inquiry type
    /// </summary>
    [HttpGet("inquiry/{inquiryType}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ContactFormSubmissionResponse>>>> GetByInquiryType(int inquiryType)
    {
        try
        {
            var submissions = await _contactFormService.GetSubmissionsByInquiryTypeAsync(inquiryType);
            return Ok(ApiResponse<IEnumerable<ContactFormSubmissionResponse>>.SuccessResponse(submissions));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ContactFormSubmissionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get contact form submissions by date range
    /// </summary>
    [HttpGet("date-range")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ContactFormSubmissionResponse>>>> GetByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        try
        {
            var submissions = await _contactFormService.GetSubmissionsByDateRangeAsync(startDate, endDate);
            return Ok(ApiResponse<IEnumerable<ContactFormSubmissionResponse>>.SuccessResponse(submissions));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ContactFormSubmissionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }
}
