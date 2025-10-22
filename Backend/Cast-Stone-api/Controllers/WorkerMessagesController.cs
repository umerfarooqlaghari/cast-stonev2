using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkerMessagesController : ControllerBase
{
    private readonly IWorkerMessageService _workerMessageService;

    public WorkerMessagesController(IWorkerMessageService workerMessageService)
    {
        _workerMessageService = workerMessageService;
    }

    /// <summary>
    /// Get all worker messages
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<WorkerMessageResponse>>>> GetAll()
    {
        try
        {
            var workerMessages = await _workerMessageService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<WorkerMessageResponse>>.SuccessResponse(workerMessages));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<WorkerMessageResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get worker message by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<WorkerMessageResponse>>> GetById(int id)
    {
        try
        {
            var workerMessage = await _workerMessageService.GetByIdAsync(id);
            if (workerMessage == null)
                return NotFound(ApiResponse<WorkerMessageResponse>.ErrorResponse("Worker message not found"));

            return Ok(ApiResponse<WorkerMessageResponse>.SuccessResponse(workerMessage));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<WorkerMessageResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get worker message by collection ID
    /// </summary>
    [HttpGet("collection/{collectionId}")]
    public async Task<ActionResult<ApiResponse<WorkerMessageResponse>>> GetByCollectionId(int collectionId)
    {
        try
        {
            var workerMessage = await _workerMessageService.GetByCollectionIdAsync(collectionId);
            if (workerMessage == null)
                return NotFound(ApiResponse<WorkerMessageResponse>.ErrorResponse("Worker message not found for this collection"));

            return Ok(ApiResponse<WorkerMessageResponse>.SuccessResponse(workerMessage));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<WorkerMessageResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get all active worker messages
    /// </summary>
    [HttpGet("active/all")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WorkerMessageResponse>>>> GetActive()
    {
        try
        {
            var workerMessages = await _workerMessageService.GetActiveAsync();
            return Ok(ApiResponse<IEnumerable<WorkerMessageResponse>>.SuccessResponse(workerMessages));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<WorkerMessageResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Create a new worker message
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<WorkerMessageResponse>>> Create([FromBody] CreateWorkerMessageRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<WorkerMessageResponse>.ErrorResponse("Validation failed", errors));
            }

            var workerMessage = await _workerMessageService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = workerMessage.Id }, ApiResponse<WorkerMessageResponse>.SuccessResponse(workerMessage, "Worker message created successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<WorkerMessageResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Update an existing worker message
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<WorkerMessageResponse>>> Update(int id, [FromBody] UpdateWorkerMessageRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<WorkerMessageResponse>.ErrorResponse("Validation failed", errors));
            }

            var workerMessage = await _workerMessageService.UpdateAsync(id, request);
            if (workerMessage == null)
                return NotFound(ApiResponse<WorkerMessageResponse>.ErrorResponse("Worker message not found"));

            return Ok(ApiResponse<WorkerMessageResponse>.SuccessResponse(workerMessage, "Worker message updated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<WorkerMessageResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Delete a worker message
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(int id)
    {
        try
        {
            var result = await _workerMessageService.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse.ErrorResponse("Worker message not found"));

            return Ok(ApiResponse.SuccessResponse("Worker message deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }
}

