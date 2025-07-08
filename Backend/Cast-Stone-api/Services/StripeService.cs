using Cast_Stone_api.Domain.Models.PaymentGatewaySettings;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Microsoft.Extensions.Options;
using Stripe;

public class StripeService
{
    private readonly StripeSettings _settings;
    private readonly ApplePaySettings _applePaySettings;
    private readonly ILogger<StripeService> _logger;

    public StripeService(IOptions<StripeSettings> stripeOptions, IOptions<ApplePaySettings> applePayOptions, ILogger<StripeService> logger)
    {
        _settings = stripeOptions.Value;
        _applePaySettings = applePayOptions.Value;
        _logger = logger;
        StripeConfiguration.ApiKey = _settings.SecretKey;
    }

    public async Task<string> CreatePaymentIntentAsync(long amount, string currency)
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = amount,
            Currency = currency,
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            }
        };

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(options);
        return intent.ClientSecret;
    }

    public async Task<PaymentResponse> CreatePaymentIntentWithMethodAsync(StripePaymentRequest request)
    {
        try
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = request.Amount,
                Currency = request.Currency,
                Metadata = request.Metadata?.ToDictionary(kvp => kvp.Key, kvp => kvp.Value?.ToString() ?? string.Empty),
                ConfirmationMethod = "manual",
                Confirm = request.ConfirmationMethod
            };

            // Configure payment method types based on request
            switch (request.PaymentMethodType.ToLower())
            {
                case "affirm":
                    options.PaymentMethodTypes = new List<string> { "affirm" };
                    options.PaymentMethodOptions = new PaymentIntentPaymentMethodOptionsOptions
                    {
                        Affirm = new PaymentIntentPaymentMethodOptionsAffirmOptions()
                    };
                    break;
                case "apple_pay":
                    options.PaymentMethodTypes = new List<string> { "card" };
                    options.PaymentMethodOptions = new PaymentIntentPaymentMethodOptionsOptions
                    {
                        Card = new PaymentIntentPaymentMethodOptionsCardOptions
                        {
                            RequestThreeDSecure = "automatic"
                        }
                    };
                    break;
                default:
                    options.AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true,
                    };
                    break;
            }

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);

            return new PaymentResponse
            {
                Success = true,
                ClientSecret = intent.ClientSecret,
                PaymentIntentId = intent.Id,
                PaymentMethod = request.PaymentMethodType,
                Status = intent.Status
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Stripe payment intent");
            return new PaymentResponse
            {
                Success = false,
                PaymentMethod = request.PaymentMethodType,
                Message = $"Failed to create payment intent: {ex.Message}"
            };
        }
    }

    public async Task<PaymentConfirmationResponse> ConfirmPaymentAsync(string paymentIntentId)
    {
        try
        {
            var service = new PaymentIntentService();
            var intent = await service.ConfirmAsync(paymentIntentId);

            return new PaymentConfirmationResponse
            {
                Success = intent.Status == "succeeded",
                TransactionId = intent.Id,
                Status = intent.Status,
                Amount = intent.Amount / 100m, // Convert from cents
                Currency = intent.Currency.ToUpper(),
                PaymentMethod = "stripe",
                ProcessedAt = DateTime.UtcNow,
                Message = intent.Status == "succeeded" ? "Payment confirmed successfully" : $"Payment status: {intent.Status}"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming Stripe payment: {PaymentIntentId}", paymentIntentId);
            return new PaymentConfirmationResponse
            {
                Success = false,
                PaymentMethod = "stripe",
                ProcessedAt = DateTime.UtcNow,
                Message = $"Failed to confirm payment: {ex.Message}"
            };
        }
    }

    public async Task<PaymentResponse> CreateApplePaySessionAsync(string domainName)
    {
        try
        {
            // Apple Pay domain verification is handled through Stripe
            // This method would be used for creating Apple Pay sessions
            var options = new PaymentIntentCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                PaymentMethodOptions = new PaymentIntentPaymentMethodOptionsOptions
                {
                    Card = new PaymentIntentPaymentMethodOptionsCardOptions
                    {
                        RequestThreeDSecure = "automatic"
                    }
                }
            };

            return new PaymentResponse
            {
                Success = true,
                PaymentMethod = "apple_pay",
                Status = "ready",
                Message = "Apple Pay session ready"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Apple Pay session");
            return new PaymentResponse
            {
                Success = false,
                PaymentMethod = "apple_pay",
                Message = $"Failed to create Apple Pay session: {ex.Message}"
            };
        }
    }
}
