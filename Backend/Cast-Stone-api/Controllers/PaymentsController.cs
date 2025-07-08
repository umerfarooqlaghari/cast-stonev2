using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Services;
using Cast_Stone_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly StripeService _stripeService;
    private readonly PayPalService _paypalService;
    private readonly IEmailService _emailService;
    private readonly IOrderService _orderService;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(
        StripeService stripeService,
        PayPalService paypalService,
        IEmailService emailService,
        IOrderService orderService,
        ILogger<PaymentsController> logger)
    {
        _stripeService = stripeService;
        _paypalService = paypalService;
        _emailService = emailService;
        _orderService = orderService;
        _logger = logger;
    }

    /// <summary>
    /// Create a Stripe payment intent (legacy endpoint for backward compatibility)
    /// </summary>
    [HttpPost("create-intent")]
    public async Task<IActionResult> CreateIntent([FromBody] PaymentRequest request)
    {
        var clientSecret = await _stripeService.CreatePaymentIntentAsync(request.Amount, request.Currency);
        return Ok(new { clientSecret });
    }

    /// <summary>
    /// Create a payment intent with specific payment method support
    /// </summary>
    [HttpPost("stripe/create-intent")]
    public async Task<ActionResult<ApiResponse<PaymentResponse>>> CreateStripeIntent([FromBody] StripePaymentRequest request)
    {
        try
        {
            var result = await _stripeService.CreatePaymentIntentWithMethodAsync(request);

            if (result.Success)
            {
                return Ok(ApiResponse<PaymentResponse>.SuccessResponse(result, "Payment intent created successfully"));
            }

            return BadRequest(ApiResponse<PaymentResponse>.ErrorResponse(result.Message ?? "Failed to create payment intent"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Stripe payment intent");
            return StatusCode(500, ApiResponse<PaymentResponse>.ErrorResponse("Internal server error"));
        }
    }

    /// <summary>
    /// Confirm a Stripe payment
    /// </summary>
    [HttpPost("stripe/confirm")]
    public async Task<ActionResult<ApiResponse<PaymentConfirmationResponse>>> ConfirmStripePayment([FromBody] PaymentConfirmationRequest request)
    {
        try
        {
            var result = await _stripeService.ConfirmPaymentAsync(request.PaymentIntentId);

            if (result.Success)
            {
                return Ok(ApiResponse<PaymentConfirmationResponse>.SuccessResponse(result, "Payment confirmed successfully"));
            }

            return BadRequest(ApiResponse<PaymentConfirmationResponse>.ErrorResponse(result.Message ?? "Failed to confirm payment"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming Stripe payment");
            return StatusCode(500, ApiResponse<PaymentConfirmationResponse>.ErrorResponse("Internal server error"));
        }
    }

    /// <summary>
    /// Create Apple Pay session
    /// </summary>
    [HttpPost("apple-pay/session")]
    public async Task<ActionResult<ApiResponse<PaymentResponse>>> CreateApplePaySession([FromBody] string domainName)
    {
        try
        {
            var result = await _stripeService.CreateApplePaySessionAsync(domainName);

            if (result.Success)
            {
                return Ok(ApiResponse<PaymentResponse>.SuccessResponse(result, "Apple Pay session created successfully"));
            }

            return BadRequest(ApiResponse<PaymentResponse>.ErrorResponse(result.Message ?? "Failed to create Apple Pay session"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Apple Pay session");
            return StatusCode(500, ApiResponse<PaymentResponse>.ErrorResponse("Internal server error"));
        }
    }

    /// <summary>
    /// Create a PayPal order
    /// </summary>
    [HttpPost("paypal/create-order")]
    public async Task<ActionResult<ApiResponse<PayPalOrderResponse>>> CreatePayPalOrder([FromBody] PayPalOrderRequest request)
    {
        try
        {
            var result = await _paypalService.CreateOrderAsync(request);

            if (result.Success)
            {
                return Ok(ApiResponse<PayPalOrderResponse>.SuccessResponse(result, "PayPal order created successfully"));
            }

            return BadRequest(ApiResponse<PayPalOrderResponse>.ErrorResponse(result.Message ?? "Failed to create PayPal order"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating PayPal order");
            return StatusCode(500, ApiResponse<PayPalOrderResponse>.ErrorResponse("Internal server error"));
        }
    }

    /// <summary>
    /// Capture a PayPal order
    /// </summary>
    [HttpPost("paypal/capture/{orderId}")]
    public async Task<ActionResult<ApiResponse<PaymentConfirmationResponse>>> CapturePayPalOrder(string orderId)
    {
        try
        {
            var result = await _paypalService.CaptureOrderAsync(orderId);

            if (result.Success)
            {
                return Ok(ApiResponse<PaymentConfirmationResponse>.SuccessResponse(result, "PayPal payment captured successfully"));
            }

            return BadRequest(ApiResponse<PaymentConfirmationResponse>.ErrorResponse(result.Message ?? "Failed to capture PayPal payment"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error capturing PayPal order: {OrderId}", orderId);
            return StatusCode(500, ApiResponse<PaymentConfirmationResponse>.ErrorResponse("Internal server error"));
        }
    }

    /// <summary>
    /// Get PayPal order details
    /// </summary>
    [HttpGet("paypal/order/{orderId}")]
    public async Task<ActionResult<ApiResponse<PayPalOrderResponse>>> GetPayPalOrder(string orderId)
    {
        try
        {
            var result = await _paypalService.GetOrderAsync(orderId);

            if (result.Success)
            {
                return Ok(ApiResponse<PayPalOrderResponse>.SuccessResponse(result, "PayPal order retrieved successfully"));
            }

            return BadRequest(ApiResponse<PayPalOrderResponse>.ErrorResponse(result.Message ?? "Failed to get PayPal order"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting PayPal order: {OrderId}", orderId);
            return StatusCode(500, ApiResponse<PayPalOrderResponse>.ErrorResponse("Internal server error"));
        }
    }

    /// <summary>
    /// Confirm payment and send email notification
    /// </summary>
    [HttpPost("confirm-and-notify")]
    public async Task<ActionResult<ApiResponse<object>>> ConfirmPaymentAndNotify([FromBody] PaymentConfirmationRequest request)
    {
        try
        {
            PaymentConfirmationResponse paymentResult;

            // Process payment based on method
            switch (request.PaymentMethod.ToLower())
            {
                case "stripe":
                case "affirm":
                case "apple_pay":
                    paymentResult = await _stripeService.ConfirmPaymentAsync(request.PaymentIntentId);
                    break;
                case "paypal":
                    paymentResult = await _paypalService.CaptureOrderAsync(request.PaymentIntentId);
                    break;
                default:
                    return BadRequest(ApiResponse<object>.ErrorResponse("Unsupported payment method"));
            }

            if (!paymentResult.Success)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(paymentResult.Message ?? "Payment confirmation failed"));
            }

            // Send email notification
            var emailResult = await _orderService.SendOrderConfirmationEmailAsync(request.OrderId, paymentResult);

            var response = new
            {
                Payment = paymentResult,
                EmailNotification = emailResult
            };

            return Ok(ApiResponse<object>.SuccessResponse(response, "Payment confirmed and notification sent"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming payment and sending notification");
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error"));
        }
    }
}
