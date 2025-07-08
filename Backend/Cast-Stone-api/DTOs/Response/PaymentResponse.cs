namespace Cast_Stone_api.DTOs.Response
{
    public class PaymentResponse
    {
        public bool Success { get; set; }
        public string? ClientSecret { get; set; }
        public string? PaymentIntentId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Status { get; set; }
        public string? Message { get; set; }
        public Dictionary<string, object>? Metadata { get; set; }
    }

    public class PayPalOrderResponse
    {
        public bool Success { get; set; }
        public string? OrderId { get; set; }
        public string? Status { get; set; }
        public string? ApprovalUrl { get; set; }
        public string? Message { get; set; }
        public PayPalOrderDetails? OrderDetails { get; set; }
    }

    public class PayPalOrderDetails
    {
        public string Id { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Intent { get; set; } = string.Empty;
        public List<PayPalLink> Links { get; set; } = new();
    }

    public class PayPalLink
    {
        public string Href { get; set; } = string.Empty;
        public string Rel { get; set; } = string.Empty;
        public string Method { get; set; } = string.Empty;
    }

    public class PaymentConfirmationResponse
    {
        public bool Success { get; set; }
        public string? TransactionId { get; set; }
        public string? Status { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public DateTime ProcessedAt { get; set; }
        public string? Message { get; set; }
    }

    public class EmailNotificationResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public DateTime SentAt { get; set; }
        public string? RecipientEmail { get; set; }
    }
}
