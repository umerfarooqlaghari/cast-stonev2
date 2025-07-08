namespace Cast_Stone_api.DTOs.Request
{
    public class PaymentRequest
    {
        public long Amount { get; set; }
        public string Currency { get; set; } = "usd";
        public string PaymentMethod { get; set; } = "stripe"; // stripe, paypal, apple_pay, affirm
        public string? ReturnUrl { get; set; }
        public string? CancelUrl { get; set; }
        public Dictionary<string, object>? Metadata { get; set; }
    }

    public class PayPalOrderRequest
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string Intent { get; set; } = "CAPTURE"; // CAPTURE or AUTHORIZE
        public string? ReturnUrl { get; set; }
        public string? CancelUrl { get; set; }
        public PayPalPurchaseUnit PurchaseUnit { get; set; } = new();
    }

    public class PayPalPurchaseUnit
    {
        public string? ReferenceId { get; set; }
        public string? Description { get; set; }
        public PayPalAmount Amount { get; set; } = new();
    }

    public class PayPalAmount
    {
        public string CurrencyCode { get; set; } = "USD";
        public string Value { get; set; } = string.Empty;
    }

    public class StripePaymentRequest
    {
        public long Amount { get; set; }
        public string Currency { get; set; } = "usd";
        public string PaymentMethodType { get; set; } = "card"; // card, affirm, apple_pay
        public bool ConfirmationMethod { get; set; } = true;
        public string? ReturnUrl { get; set; }
        public Dictionary<string, object>? Metadata { get; set; }
    }

    public class PaymentConfirmationRequest
    {
        public string PaymentIntentId { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public int OrderId { get; set; }
    }
}
