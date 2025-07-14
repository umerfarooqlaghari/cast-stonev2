using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductSpecificationsController : ControllerBase
{
    private readonly IProductSpecificationsService _service;

    public ProductSpecificationsController(IProductSpecificationsService service)
    {
        _service = service;
    }

    /// <summary>
    /// Get all product specifications
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductSpecificationsResponse>>>> GetAll()
    {
        try
        {
            var specifications = await _service.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<ProductSpecificationsResponse>>.SuccessResponse(specifications));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductSpecificationsResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get product specifications by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductSpecificationsResponse>>> GetById(int id)
    {
        try
        {
            var specifications = await _service.GetByIdAsync(id);
            if (specifications == null)
                return NotFound(ApiResponse<ProductSpecificationsResponse>.ErrorResponse("Product specifications not found"));

            return Ok(ApiResponse<ProductSpecificationsResponse>.SuccessResponse(specifications));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductSpecificationsResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get product specifications by product ID
    /// </summary>
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<ApiResponse<ProductSpecificationsResponse>>> GetByProductId(int productId)
    {
        try
        {
            var specifications = await _service.GetByProductIdAsync(productId);
            if (specifications == null)
                return NotFound(ApiResponse<ProductSpecificationsResponse>.ErrorResponse("Product specifications not found"));

            return Ok(ApiResponse<ProductSpecificationsResponse>.SuccessResponse(specifications));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductSpecificationsResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Create new product specifications
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductSpecificationsResponse>>> Create([FromBody] CreateProductSpecificationsRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<ProductSpecificationsResponse>.ErrorResponse("Validation failed", errors));
            }

            var specifications = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = specifications.Id }, ApiResponse<ProductSpecificationsResponse>.SuccessResponse(specifications, "Product specifications created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ProductSpecificationsResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductSpecificationsResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Update product specifications
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProductSpecificationsResponse>>> Update(int id, [FromBody] UpdateProductSpecificationsRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<ProductSpecificationsResponse>.ErrorResponse("Validation failed", errors));
            }

            var specifications = await _service.UpdateAsync(id, request);
            if (specifications == null)
                return NotFound(ApiResponse<ProductSpecificationsResponse>.ErrorResponse("Product specifications not found"));

            return Ok(ApiResponse<ProductSpecificationsResponse>.SuccessResponse(specifications, "Product specifications updated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductSpecificationsResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Delete product specifications
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse<object>.ErrorResponse("Product specifications not found"));

            return Ok(ApiResponse<object>.SuccessResponse(null, "Product specifications deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }
}
