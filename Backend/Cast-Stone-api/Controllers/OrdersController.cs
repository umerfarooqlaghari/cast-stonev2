using Microsoft.AspNetCore.Mvc;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>
    /// Get all orders
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderSummaryResponse>>>> GetAll()
    {
        try
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<OrderSummaryResponse>>.SuccessResponse(orders));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<OrderSummaryResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get order by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> GetById(int id)
    {
        try
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
                return NotFound(ApiResponse<OrderResponse>.ErrorResponse("Order not found"));

            return Ok(ApiResponse<OrderResponse>.SuccessResponse(order));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<OrderResponse>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Create a new order
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> Create([FromBody] CreateOrderRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<OrderResponse>.ErrorResponse("Validation failed", errors));
            }

            var order = await _orderService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, ApiResponse<OrderResponse>.SuccessResponse(order, "Order created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<OrderResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<OrderResponse>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Update order status
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse>> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
            }

            var result = await _orderService.UpdateStatusAsync(id, request);
            if (!result)
                return NotFound(ApiResponse.ErrorResponse("Order not found"));

            return Ok(ApiResponse.SuccessResponse("Order status updated successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Cancel an order
    /// </summary>
    [HttpPatch("{id}/cancel")]
    public async Task<ActionResult<ApiResponse>> Cancel(int id)
    {
        try
        {
            var result = await _orderService.CancelOrderAsync(id);
            if (!result)
                return BadRequest(ApiResponse.ErrorResponse("Order cannot be cancelled"));

            return Ok(ApiResponse.SuccessResponse("Order cancelled successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Delete an order
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(int id)
    {
        try
        {
            var result = await _orderService.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse.ErrorResponse("Order not found"));

            return Ok(ApiResponse.SuccessResponse("Order deleted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get orders by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderResponse>>>> GetByUserId(int userId)
    {
        try
        {
            var orders = await _orderService.GetByUserIdAsync(userId);
            return Ok(ApiResponse<IEnumerable<OrderResponse>>.SuccessResponse(orders));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<OrderResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get orders by email
    /// </summary>
    [HttpGet("email/{email}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderResponse>>>> GetByEmail(string email)
    {
        try
        {
            var orders = await _orderService.GetByEmailAsync(email);
            return Ok(ApiResponse<IEnumerable<OrderResponse>>.SuccessResponse(orders));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<OrderResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get orders by status
    /// </summary>
    [HttpGet("status/{statusId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderResponse>>>> GetByStatus(int statusId)
    {
        try
        {
            var orders = await _orderService.GetByStatusIdAsync(statusId);
            return Ok(ApiResponse<IEnumerable<OrderResponse>>.SuccessResponse(orders));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<OrderResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get pending orders
    /// </summary>
    [HttpGet("pending")]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderResponse>>>> GetPending()
    {
        try
        {
            var orders = await _orderService.GetPendingOrdersAsync();
            return Ok(ApiResponse<IEnumerable<OrderResponse>>.SuccessResponse(orders));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<OrderResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get recent orders
    /// </summary>
    [HttpGet("recent")]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderSummaryResponse>>>> GetRecent([FromQuery] int count = 10)
    {
        try
        {
            var orders = await _orderService.GetRecentOrdersAsync(count);
            return Ok(ApiResponse<IEnumerable<OrderSummaryResponse>>.SuccessResponse(orders));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<OrderSummaryResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get order details with full information
    /// </summary>
    [HttpGet("{id}/details")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> GetDetails(int id)
    {
        try
        {
            var order = await _orderService.GetWithDetailsAsync(id);
            if (order == null)
                return NotFound(ApiResponse<OrderResponse>.ErrorResponse("Order not found"));

            return Ok(ApiResponse<OrderResponse>.SuccessResponse(order));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<OrderResponse>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get total revenue
    /// </summary>
    [HttpGet("revenue/total")]
    public async Task<ActionResult<ApiResponse<decimal>>> GetTotalRevenue()
    {
        try
        {
            var revenue = await _orderService.GetTotalRevenueAsync();
            return Ok(ApiResponse<decimal>.SuccessResponse(revenue));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<decimal>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get revenue by date range
    /// </summary>
    [HttpGet("revenue/range")]
    public async Task<ActionResult<ApiResponse<decimal>>> GetRevenueByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        try
        {
            var revenue = await _orderService.GetTotalRevenueByDateRangeAsync(startDate, endDate);
            return Ok(ApiResponse<decimal>.SuccessResponse(revenue));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<decimal>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get orders with advanced filtering and pagination
    /// </summary>
    [HttpGet("filter")]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<OrderResponse>>>> GetFiltered([FromQuery] OrderFilterRequest filter)
    {
        try
        {
            var result = await _orderService.GetFilteredAsync(filter);
            return Ok(ApiResponse<PaginatedResponse<OrderResponse>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<PaginatedResponse<OrderResponse>>.ErrorResponse("Internal server error", new List<string> { ex.Message }));
        }
    }
}
