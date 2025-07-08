using Cast_Stone_api.Domain.Models.PaymentGatewaySettings;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Microsoft.Extensions.Options;
using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;
using PayPalHttp;
using System.Text.Json;

namespace Cast_Stone_api.Services
{
    public class PayPalService
    {
        private readonly PayPalSettings _settings;
        private readonly PayPalHttpClient _client;
        private readonly ILogger<PayPalService> _logger;

        public PayPalService(IOptions<PayPalSettings> paypalOptions, ILogger<PayPalService> logger)
        {
            _settings = paypalOptions.Value;
            _logger = logger;

            // Initialize PayPal environment
            PayPalEnvironment environment = _settings.Environment.ToLower() == "live"
                ? new LiveEnvironment(_settings.ClientId, _settings.Secret)
                : new SandboxEnvironment(_settings.ClientId, _settings.Secret);

            _client = new PayPalHttpClient(environment);
        }

        public async Task<PayPalOrderResponse> CreateOrderAsync(PayPalOrderRequest request)
        {
            try
            {
                var orderRequest = new OrdersCreateRequest();
                orderRequest.Prefer("return=representation");
                orderRequest.RequestBody(BuildOrderRequestBody(request));

                var response = await _client.Execute(orderRequest);
                var order = response.Result<Order>();

                var approvalUrl = order.Links?.FirstOrDefault(l => l.Rel == "approve")?.Href;

                return new PayPalOrderResponse
                {
                    Success = true,
                    OrderId = order.Id,
                    Status = order.Status,
                    ApprovalUrl = approvalUrl,
                    OrderDetails = new PayPalOrderDetails
                    {
                        Id = order.Id,
                        Status = order.Status,
                        Intent = order.CheckoutPaymentIntent,
                        Links = order.Links?.Select(l => new PayPalLink
                        {
                            Href = l.Href,
                            Rel = l.Rel,
                            Method = l.Method
                        }).ToList() ?? new List<PayPalLink>()
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating PayPal order");
                return new PayPalOrderResponse
                {
                    Success = false,
                    Message = $"Failed to create PayPal order: {ex.Message}"
                };
            }
        }

        public async Task<PaymentConfirmationResponse> CaptureOrderAsync(string orderId)
        {
            try
            {
                var captureRequest = new OrdersCaptureRequest(orderId);
                captureRequest.RequestBody(new OrderActionRequest());

                var response = await _client.Execute(captureRequest);
                var order = response.Result<Order>();

                var capture = order.PurchaseUnits?[0]?.Payments?.Captures?[0];
                
                return new PaymentConfirmationResponse
                {
                    Success = true,
                    TransactionId = capture?.Id ?? orderId,
                    Status = capture?.Status ?? order.Status,
                    Amount = decimal.Parse(capture?.Amount?.Value ?? "0"),
                    Currency = capture?.Amount?.CurrencyCode ?? "USD",
                    PaymentMethod = "paypal",
                    ProcessedAt = DateTime.UtcNow,
                    Message = "Payment captured successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error capturing PayPal order: {OrderId}", orderId);
                return new PaymentConfirmationResponse
                {
                    Success = false,
                    PaymentMethod = "paypal",
                    ProcessedAt = DateTime.UtcNow,
                    Message = $"Failed to capture payment: {ex.Message}"
                };
            }
        }

        public async Task<PayPalOrderResponse> GetOrderAsync(string orderId)
        {
            try
            {
                var getRequest = new OrdersGetRequest(orderId);
                var response = await _client.Execute(getRequest);
                var order = response.Result<Order>();

                return new PayPalOrderResponse
                {
                    Success = true,
                    OrderId = order.Id,
                    Status = order.Status,
                    OrderDetails = new PayPalOrderDetails
                    {
                        Id = order.Id,
                        Status = order.Status,
                        Intent = order.CheckoutPaymentIntent,
                        Links = order.Links?.Select(l => new PayPalLink
                        {
                            Href = l.Href,
                            Rel = l.Rel,
                            Method = l.Method
                        }).ToList() ?? new List<PayPalLink>()
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayPal order: {OrderId}", orderId);
                return new PayPalOrderResponse
                {
                    Success = false,
                    Message = $"Failed to get PayPal order: {ex.Message}"
                };
            }
        }

        private OrderRequest BuildOrderRequestBody(PayPalOrderRequest request)
        {
            return new OrderRequest()
            {
                CheckoutPaymentIntent = request.Intent,
                PurchaseUnits = new List<PurchaseUnitRequest>
                {
                    new PurchaseUnitRequest
                    {
                        ReferenceId = request.PurchaseUnit.ReferenceId ?? Guid.NewGuid().ToString(),
                        Description = request.PurchaseUnit.Description ?? "Cast Stone Purchase",
                        AmountWithBreakdown = new AmountWithBreakdown
                        {
                            CurrencyCode = request.Currency,
                            Value = request.Amount.ToString("F2")
                        }
                    }
                },
                ApplicationContext = new ApplicationContext
                {
                    ReturnUrl = request.ReturnUrl,
                    CancelUrl = request.CancelUrl,
                    BrandName = "Cast Stone",
                    LandingPage = "BILLING",
                    UserAction = "PAY_NOW"
                }
            };
        }
    }
}
