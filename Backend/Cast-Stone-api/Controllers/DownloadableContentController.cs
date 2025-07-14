using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DownloadableContentController : ControllerBase
{
    private readonly IDownloadableContentService _service;

    public DownloadableContentController(IDownloadableContentService service)
    {
        _service = service;
    }

    /// <summary>
    /// Get all downloadable content
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<DownloadableContentResponse>>>> GetAll()
    {
        try
        {
            var content = await _service.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<DownloadableContentResponse>>.SuccessResponse(content));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<DownloadableContentResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get downloadable content by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<DownloadableContentResponse>>> GetById(int id)
    {
        try
        {
            var content = await _service.GetByIdAsync(id);
            if (content == null)
                return NotFound(ApiResponse<DownloadableContentResponse>.ErrorResponse("Downloadable content not found"));

            return Ok(ApiResponse<DownloadableContentResponse>.SuccessResponse(content));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<DownloadableContentResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get downloadable content by product ID
    /// </summary>
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<ApiResponse<DownloadableContentResponse>>> GetByProductId(int productId)
    {
        try
        {
            var content = await _service.GetByProductIdAsync(productId);
            if (content == null)
                return NotFound(ApiResponse<DownloadableContentResponse>.ErrorResponse("Downloadable content not found"));

            return Ok(ApiResponse<DownloadableContentResponse>.SuccessResponse(content));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<DownloadableContentResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Create new downloadable content
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<DownloadableContentResponse>>> Create([FromBody] CreateDownloadableContentRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<DownloadableContentResponse>.ErrorResponse("Validation failed", errors));
            }

            var content = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = content.Id }, ApiResponse<DownloadableContentResponse>.SuccessResponse(content, "Downloadable content created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<DownloadableContentResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<DownloadableContentResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Update downloadable content
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<DownloadableContentResponse>>> Update(int id, [FromBody] UpdateDownloadableContentRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<DownloadableContentResponse>.ErrorResponse("Validation failed", errors));
            }

            var content = await _service.UpdateAsync(id, request);
            if (content == null)
                return NotFound(ApiResponse<DownloadableContentResponse>.ErrorResponse("Downloadable content not found"));

            return Ok(ApiResponse<DownloadableContentResponse>.SuccessResponse(content, "Downloadable content updated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<DownloadableContentResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Delete downloadable content
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse<object>.ErrorResponse("Downloadable content not found"));

            return Ok(ApiResponse<object>.SuccessResponse(null, "Downloadable content deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }
}
