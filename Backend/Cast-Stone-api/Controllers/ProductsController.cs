using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    /// <summary>
    /// Get all products
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponse>>>> GetAll()
    {
        try
        {
            var products = await _productService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<ProductResponse>>.SuccessResponse(products));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductResponse>>> GetById(int id)
    {
        try
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
                return NotFound(ApiResponse<ProductResponse>.ErrorResponse("Product not found"));

            return Ok(ApiResponse<ProductResponse>.SuccessResponse(product));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductResponse>>> Create([FromBody] CreateProductRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<ProductResponse>.ErrorResponse("Validation failed", errors));
            }

            var product = await _productService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, ApiResponse<ProductResponse>.SuccessResponse(product, "Product created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ProductResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProductResponse>>> Update(int id, [FromBody] UpdateProductRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<ProductResponse>.ErrorResponse("Validation failed", errors));
            }

            var product = await _productService.UpdateAsync(id, request);
            if (product == null)
                return NotFound(ApiResponse<ProductResponse>.ErrorResponse("Product not found"));

            return Ok(ApiResponse<ProductResponse>.SuccessResponse(product, "Product updated successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ProductResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<ProductResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(int id)
    {
        try
        {
            var result = await _productService.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse.ErrorResponse("Product not found"));

            return Ok(ApiResponse.SuccessResponse("Product deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get products by collection
    /// </summary>
    [HttpGet("collection/{collectionId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponse>>>> GetByCollection(int collectionId)
    {
        try
        {
            var products = await _productService.GetByCollectionIdAsync(collectionId);
            return Ok(ApiResponse<IEnumerable<ProductResponse>>.SuccessResponse(products));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get products in stock
    /// </summary>
    [HttpGet("in-stock")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponse>>>> GetInStock()
    {
        try
        {
            var products = await _productService.GetInStockAsync();
            return Ok(ApiResponse<IEnumerable<ProductResponse>>.SuccessResponse(products));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get featured products
    /// </summary>
    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductSummaryResponse>>>> GetFeatured([FromQuery] int count = 10)
    {
        try
        {
            var products = await _productService.GetFeaturedAsync(count);
            return Ok(ApiResponse<IEnumerable<ProductSummaryResponse>>.SuccessResponse(products));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductSummaryResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get latest products
    /// </summary>
    [HttpGet("latest")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductSummaryResponse>>>> GetLatest([FromQuery] int count = 10)
    {
        try
        {
            var products = await _productService.GetLatestAsync(count);
            return Ok(ApiResponse<IEnumerable<ProductSummaryResponse>>.SuccessResponse(products));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductSummaryResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Search products by name
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponse>>>> Search([FromQuery] string name)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest(ApiResponse<IEnumerable<ProductResponse>>.ErrorResponse("Search name is required"));

            var products = await _productService.SearchByNameAsync(name);
            return Ok(ApiResponse<IEnumerable<ProductResponse>>.SuccessResponse(products));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get products by price range
    /// </summary>
    [HttpGet("price-range")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponse>>>> GetByPriceRange([FromQuery] decimal minPrice, [FromQuery] decimal maxPrice)
    {
        try
        {
            if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice)
                return BadRequest(ApiResponse<IEnumerable<ProductResponse>>.ErrorResponse("Invalid price range"));

            var products = await _productService.GetByPriceRangeAsync(minPrice, maxPrice);
            return Ok(ApiResponse<IEnumerable<ProductResponse>>.SuccessResponse(products));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<ProductResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Update product stock
    /// </summary>
    [HttpPatch("{id}/stock")]
    public async Task<ActionResult<ApiResponse>> UpdateStock(int id, [FromBody] int newStock)
    {
        try
        {
            var result = await _productService.UpdateStockAsync(id, newStock);
            if (!result)
                return BadRequest(ApiResponse.ErrorResponse("Failed to update stock"));

            return Ok(ApiResponse.SuccessResponse("Stock updated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get products with advanced filtering and pagination
    /// </summary>
    [HttpGet("filter")]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<ProductResponse>>>> GetFiltered([FromQuery] ProductFilterRequest filter)
    {
        try
        {
            var result = await _productService.GetFilteredAsync(filter);
            return Ok(ApiResponse<PaginatedResponse<ProductResponse>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<PaginatedResponse<ProductResponse>>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }
}
