namespace Cast_Stone_api.Domain.Models.PaymentGatewaySettings
{
    public class PayPalSettings
    {
        public string ClientId { get; set; } = string.Empty;
        public string Secret { get; set; } = string.Empty;
        public string Environment { get; set; } = "sandbox"; // sandbox or live
    }

    public class SmtpSettings
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool EnableSsl { get; set; } = true;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = "Cast Stone";
        public string AdminEmail { get; set; } = string.Empty;
    }

    public class ApplePaySettings
    {
        public string MerchantId { get; set; } = string.Empty;
        public string DomainVerificationPath { get; set; } = string.Empty;
        public string DisplayName { get; set; } = "Cast Stone";
    }
}
