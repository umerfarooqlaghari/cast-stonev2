using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductVariantsController : ControllerBase
{
    private readonly IProductVariantService _productVariantService;

    public ProductVariantsController(IProductVariantService productVariantService)
    {
        _productVariantService = productVariantService;
    }

    /// <summary>
    /// Get all product variants with optional filtering
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductVariantResponse>>>> GetAll(
        [FromQuery] int? productId,
        [FromQuery] string? variantName,
        [FromQuery] string? variantTag,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        try
        {
            IEnumerable<ProductVariantResponse> variants;

            // If any filter is provided, use filtered query
            if (productId.HasValue || !string.IsNullOrWhiteSpace(variantName) || 
                !string.IsNullOrWhiteSpace(variantTag) || minPrice.HasValue || maxPrice.HasValue)
            {
                var filter = new ProductVariantFilterRequest
                {
                    ProductId = productId,
                    VariantName = variantName,
                    VariantTag = variantTag,
                    MinPrice = minPrice,
                    MaxPrice = maxPrice
                };
                variants = await _productVariantService.GetFilteredAsync(filter);
            }
            else
            {
                variants = await _productVariantService.GetAllAsync();
            }

            return Ok(ApiResponse<IEnumerable<ProductVariantResponse>>.SuccessResponse(variants));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductVariantResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get a product variant by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductVariantResponse>>> GetById(int id)
    {
        try
        {
            var variant = await _productVariantService.GetByIdAsync(id);
            if (variant == null)
                return NotFound(ApiResponse<ProductVariantResponse>.ErrorResponse("Product variant not found"));

            return Ok(ApiResponse<ProductVariantResponse>.SuccessResponse(variant));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductVariantResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get all variants for a specific product
    /// </summary>
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductVariantResponse>>>> GetByProductId(int productId)
    {
        try
        {
            var variants = await _productVariantService.GetByProductIdAsync(productId);
            return Ok(ApiResponse<IEnumerable<ProductVariantResponse>>.SuccessResponse(variants));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductVariantResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Create a new product variant
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductVariantResponse>>> Create([FromBody] CreateProductVariantRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<ProductVariantResponse>.ErrorResponse("Validation failed", errors));
            }

            var variant = await _productVariantService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = variant.Id }, ApiResponse<ProductVariantResponse>.SuccessResponse(variant, "Product variant created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ProductVariantResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductVariantResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Update an existing product variant
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProductVariantResponse>>> Update(int id, [FromBody] UpdateProductVariantRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<ProductVariantResponse>.ErrorResponse("Validation failed", errors));
            }

            var variant = await _productVariantService.UpdateAsync(id, request);
            if (variant == null)
                return NotFound(ApiResponse<ProductVariantResponse>.ErrorResponse("Product variant not found"));

            return Ok(ApiResponse<ProductVariantResponse>.SuccessResponse(variant, "Product variant updated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductVariantResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Delete a product variant
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var result = await _productVariantService.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse<object>.ErrorResponse("Product variant not found"));

            return Ok(ApiResponse<object>.SuccessResponse(null, "Product variant deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }
}

