using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CollectionsController : ControllerBase
{
    private readonly ICollectionService _collectionService;

    public CollectionsController(ICollectionService collectionService)
    {
        _collectionService = collectionService;
    }

    /// <summary>
    /// Get all collections
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CollectionResponse>>>> GetAll()
    {
        try
        {
            var collections = await _collectionService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<CollectionResponse>>.SuccessResponse(collections));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<CollectionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get collection by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CollectionResponse>>> GetById(int id)
    {
        try
        {
            var collection = await _collectionService.GetByIdAsync(id);
            if (collection == null)
                return NotFound(ApiResponse<CollectionResponse>.ErrorResponse("Collection not found"));

            return Ok(ApiResponse<CollectionResponse>.SuccessResponse(collection));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CollectionResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Create a new collection
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CollectionResponse>>> Create([FromBody] CreateCollectionRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<CollectionResponse>.ErrorResponse("Validation failed", errors));
            }

            var collection = await _collectionService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = collection.Id }, ApiResponse<CollectionResponse>.SuccessResponse(collection, "Collection created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<CollectionResponse>.ErrorResponse(ex.ToString()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CollectionResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Update an existing collection
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CollectionResponse>>> Update(int id, [FromBody] UpdateCollectionRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<CollectionResponse>.ErrorResponse("Validation failed", errors));
            }

            var collection = await _collectionService.UpdateAsync(id, request);
            if (collection == null)
                return NotFound(ApiResponse<CollectionResponse>.ErrorResponse("Collection not found"));

            return Ok(ApiResponse<CollectionResponse>.SuccessResponse(collection, "Collection updated successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<CollectionResponse>.ErrorResponse(ex.ToString()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CollectionResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Delete a collection
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(int id)
    {
        try
        {
            var result = await _collectionService.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse.ErrorResponse("Collection not found or cannot be deleted"));

            return Ok(ApiResponse.SuccessResponse("Collection deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get collections by level
    /// </summary>
    [HttpGet("level/{level}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CollectionResponse>>>> GetByLevel(int level)
    {
        try
        {
            var collections = await _collectionService.GetByLevelAsync(level);
            return Ok(ApiResponse<IEnumerable<CollectionResponse>>.SuccessResponse(collections));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<CollectionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get collection hierarchy
    /// </summary>
    [HttpGet("hierarchy")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CollectionHierarchyResponse>>>> GetHierarchy()
    {
        try
        {
            var hierarchy = await _collectionService.GetHierarchyAsync();
            return Ok(ApiResponse<IEnumerable<CollectionHierarchyResponse>>.SuccessResponse(hierarchy));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<CollectionHierarchyResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get published collections
    /// </summary>
    [HttpGet("published")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CollectionResponse>>>> GetPublished()
    {
        try
        {
            var collections = await _collectionService.GetPublishedAsync();
            return Ok(ApiResponse<IEnumerable<CollectionResponse>>.SuccessResponse(collections));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<CollectionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Search collections by name
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CollectionResponse>>>> Search([FromQuery] string name)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest(ApiResponse<IEnumerable<CollectionResponse>>.ErrorResponse("Search name is required"));

            var collections = await _collectionService.SearchByNameAsync(name);
            return Ok(ApiResponse<IEnumerable<CollectionResponse>>.SuccessResponse(collections));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<CollectionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get children of a collection
    /// </summary>
    [HttpGet("{id}/children")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CollectionResponse>>>> GetChildren(int id)
    {
        try
        {
            var children = await _collectionService.GetChildrenAsync(id);
            return Ok(ApiResponse<IEnumerable<CollectionResponse>>.SuccessResponse(children));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<CollectionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get collections with advanced filtering and pagination
    /// </summary>
    [HttpGet("filter")]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<CollectionResponse>>>> GetFiltered([FromQuery] CollectionFilterRequest filter)
    {
        try
        {
            var result = await _collectionService.GetFilteredAsync(filter);
            return Ok(ApiResponse<PaginatedResponse<CollectionResponse>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<PaginatedResponse<CollectionResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Refresh parent-child relationships for all collections (maintenance operation)
    /// </summary>
    [HttpPost("refresh-relationships")]
    public async Task<ActionResult<ApiResponse<int>>> RefreshRelationships()
    {
        try
        {
            var updatedCount = await _collectionService.RefreshAllParentChildRelationshipsAsync();
            return Ok(ApiResponse<int>.SuccessResponse(updatedCount, $"Updated {updatedCount} collection relationships"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<int>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }
}
