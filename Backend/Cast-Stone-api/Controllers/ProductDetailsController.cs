using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductDetailsController : ControllerBase
{
    private readonly IProductDetailsService _service;

    public ProductDetailsController(IProductDetailsService service)
    {
        _service = service;
    }

    /// <summary>
    /// Get all product details
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductDetailsResponse>>>> GetAll()
    {
        try
        {
            var details = await _service.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<ProductDetailsResponse>>.SuccessResponse(details));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductDetailsResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get product details by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductDetailsResponse>>> GetById(int id)
    {
        try
        {
            var details = await _service.GetByIdAsync(id);
            if (details == null)
                return NotFound(ApiResponse<ProductDetailsResponse>.ErrorResponse("Product details not found"));

            return Ok(ApiResponse<ProductDetailsResponse>.SuccessResponse(details));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductDetailsResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get product details by product ID
    /// </summary>
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<ApiResponse<ProductDetailsResponse>>> GetByProductId(int productId)
    {
        try
        {
            var details = await _service.GetByProductIdAsync(productId);
            if (details == null)
                return NotFound(ApiResponse<ProductDetailsResponse>.ErrorResponse("Product details not found"));

            return Ok(ApiResponse<ProductDetailsResponse>.SuccessResponse(details));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductDetailsResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Create new product details
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductDetailsResponse>>> Create([FromBody] CreateProductDetailsRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<ProductDetailsResponse>.ErrorResponse("Validation failed", errors));
            }

            var details = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = details.Id }, ApiResponse<ProductDetailsResponse>.SuccessResponse(details, "Product details created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ProductDetailsResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductDetailsResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Update product details
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProductDetailsResponse>>> Update(int id, [FromBody] UpdateProductDetailsRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<ProductDetailsResponse>.ErrorResponse("Validation failed", errors));
            }

            var details = await _service.UpdateAsync(id, request);
            if (details == null)
                return NotFound(ApiResponse<ProductDetailsResponse>.ErrorResponse("Product details not found"));

            return Ok(ApiResponse<ProductDetailsResponse>.SuccessResponse(details, "Product details updated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductDetailsResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Delete product details
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse<object>.ErrorResponse("Product details not found"));

            return Ok(ApiResponse<object>.SuccessResponse(null, "Product details deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }
}
