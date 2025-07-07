using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    /// <summary>
    /// Get cart by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<ApiResponse<CartResponse>>> GetCartByUserId(int userId)
    {
        try
        {
            var cart = await _cartService.GetCartByUserIdAsync(userId);
            if (cart == null)
                return NotFound(ApiResponse<CartResponse>.ErrorResponse("Cart not found"));

            return Ok(ApiResponse<CartResponse>.SuccessResponse(cart));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CartResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get cart by session ID
    /// </summary>
    [HttpGet("session/{sessionId}")]
    public async Task<ActionResult<ApiResponse<CartResponse>>> GetCartBySessionId(string sessionId)
    {
        try
        {
            var cart = await _cartService.GetCartBySessionIdAsync(sessionId);
            if (cart == null)
                return NotFound(ApiResponse<CartResponse>.ErrorResponse("Cart not found"));

            return Ok(ApiResponse<CartResponse>.SuccessResponse(cart));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CartResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get cart summary by user ID
    /// </summary>
    [HttpGet("summary/user/{userId}")]
    public async Task<ActionResult<ApiResponse<CartSummaryResponse>>> GetCartSummaryByUserId(int userId)
    {
        try
        {
            var summary = await _cartService.GetCartSummaryByUserIdAsync(userId);
            if (summary == null)
                return NotFound(ApiResponse<CartSummaryResponse>.ErrorResponse("Cart not found"));

            return Ok(ApiResponse<CartSummaryResponse>.SuccessResponse(summary));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CartSummaryResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get cart summary by session ID
    /// </summary>
    [HttpGet("summary/session/{sessionId}")]
    public async Task<ActionResult<ApiResponse<CartSummaryResponse>>> GetCartSummaryBySessionId(string sessionId)
    {
        try
        {
            var summary = await _cartService.GetCartSummaryBySessionIdAsync(sessionId);
            if (summary == null)
                return NotFound(ApiResponse<CartSummaryResponse>.ErrorResponse("Cart not found"));

            return Ok(ApiResponse<CartSummaryResponse>.SuccessResponse(summary));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CartSummaryResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Add item to cart
    /// </summary>
    [HttpPost("add")]
    public async Task<ActionResult<ApiResponse<CartResponse>>> AddToCart([FromBody] AddToCartRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<CartResponse>.ErrorResponse("Validation failed", errors));
            }

            var cart = await _cartService.AddToCartAsync(request);
            return Ok(ApiResponse<CartResponse>.SuccessResponse(cart, "Item added to cart successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<CartResponse>.ErrorResponse(ex.ToString()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CartResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Update cart item quantity
    /// </summary>
    [HttpPut("{cartId}/items/{productId}")]
    public async Task<ActionResult<ApiResponse<CartResponse>>> UpdateCartItem(int cartId, int productId, [FromBody] UpdateCartItemRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<CartResponse>.ErrorResponse("Validation failed", errors));
            }

            var cart = await _cartService.UpdateCartItemAsync(cartId, productId, request);
            if (cart == null)
                return NotFound(ApiResponse<CartResponse>.ErrorResponse("Cart item not found"));

            return Ok(ApiResponse<CartResponse>.SuccessResponse(cart, "Cart item updated successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<CartResponse>.ErrorResponse(ex.ToString()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CartResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Remove item from cart
    /// </summary>
    [HttpDelete("{cartId}/items/{productId}")]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveFromCart(int cartId, int productId)
    {
        try
        {
            var result = await _cartService.RemoveFromCartAsync(cartId, productId);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Item removed from cart successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Remove cart item by ID
    /// </summary>
    [HttpDelete("items/{cartItemId}")]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveCartItem(int cartItemId)
    {
        try
        {
            var result = await _cartService.RemoveCartItemAsync(cartItemId);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Cart item removed successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Clear entire cart
    /// </summary>
    [HttpDelete("{cartId}/clear")]
    public async Task<ActionResult<ApiResponse<bool>>> ClearCart(int cartId)
    {
        try
        {
            var result = await _cartService.ClearCartAsync(cartId);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Cart cleared successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Clear cart by user ID
    /// </summary>
    [HttpDelete("user/{userId}/clear")]
    public async Task<ActionResult<ApiResponse<bool>>> ClearCartByUserId(int userId)
    {
        try
        {
            var result = await _cartService.ClearCartByUserIdAsync(userId);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Cart cleared successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Clear cart by session ID
    /// </summary>
    [HttpDelete("session/{sessionId}/clear")]
    public async Task<ActionResult<ApiResponse<bool>>> ClearCartBySessionId(string sessionId)
    {
        try
        {
            var result = await _cartService.ClearCartBySessionIdAsync(sessionId);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Cart cleared successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }

    /// <summary>
    /// Get or create cart
    /// </summary>
    [HttpPost("get-or-create")]
    public async Task<ActionResult<ApiResponse<CartResponse>>> GetOrCreateCart([FromQuery] int? userId, [FromQuery] string? sessionId)
    {
        try
        {
            if (!userId.HasValue && string.IsNullOrEmpty(sessionId))
            {
                return BadRequest(ApiResponse<CartResponse>.ErrorResponse("Either userId or sessionId must be provided"));
            }

            var cart = await _cartService.GetOrCreateCartAsync(userId, sessionId);
            return Ok(ApiResponse<CartResponse>.SuccessResponse(cart));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CartResponse>.ErrorResponse("Internal server error", new List<string> { ex.ToString() }));
        }
    }
}
