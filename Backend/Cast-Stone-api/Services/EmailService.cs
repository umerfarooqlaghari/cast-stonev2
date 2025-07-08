using Cast_Stone_api.Domain.Models.PaymentGatewaySettings;
using Cast_Stone_api.DTOs.Response;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Text;

namespace Cast_Stone_api.Services
{
    public interface IEmailService
    {
        Task<EmailNotificationResponse> SendOrderConfirmationToAdminAsync(OrderResponse order, PaymentConfirmationResponse payment);
        Task<EmailNotificationResponse> SendEmailAsync(string to, string subject, string htmlBody, string? plainTextBody = null);
    }

    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<SmtpSettings> smtpOptions, ILogger<EmailService> logger)
        {
            _smtpSettings = smtpOptions.Value;
            _logger = logger;
        }

        public async Task<EmailNotificationResponse> SendOrderConfirmationToAdminAsync(OrderResponse order, PaymentConfirmationResponse payment)
        {
            try
            {
                var subject = $"New Order Received - Order #{order.Id}";
                var htmlBody = GenerateOrderConfirmationHtml(order, payment);
                var plainTextBody = GenerateOrderConfirmationText(order, payment);

                return await SendEmailAsync(_smtpSettings.AdminEmail, subject, htmlBody, plainTextBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending order confirmation email for order {OrderId}", order.Id);
                return new EmailNotificationResponse
                {
                    Success = false,
                    Message = $"Failed to send order confirmation email: {ex.Message}",
                    SentAt = DateTime.UtcNow
                };
            }
        }

        public async Task<EmailNotificationResponse> SendEmailAsync(string to, string subject, string htmlBody, string? plainTextBody = null)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_smtpSettings.FromName, _smtpSettings.FromEmail));
                message.To.Add(new MailboxAddress("", to));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder();
                bodyBuilder.HtmlBody = htmlBody;
                if (!string.IsNullOrEmpty(plainTextBody))
                {
                    bodyBuilder.TextBody = plainTextBody;
                }

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, _smtpSettings.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);
                await client.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email sent successfully to {Recipient}", to);

                return new EmailNotificationResponse
                {
                    Success = true,
                    Message = "Email sent successfully",
                    SentAt = DateTime.UtcNow,
                    RecipientEmail = to
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to {Recipient}", to);
                return new EmailNotificationResponse
                {
                    Success = false,
                    Message = $"Failed to send email: {ex.Message}",
                    SentAt = DateTime.UtcNow,
                    RecipientEmail = to
                };
            }
        }

        private string GenerateOrderConfirmationHtml(OrderResponse order, PaymentConfirmationResponse payment)
        {
            var html = new StringBuilder();
            html.AppendLine("<!DOCTYPE html>");
            html.AppendLine("<html>");
            html.AppendLine("<head>");
            html.AppendLine("<meta charset='utf-8'>");
            html.AppendLine("<title>New Order Confirmation</title>");
            html.AppendLine("<style>");
            html.AppendLine("body { font-family: Arial, sans-serif; margin: 20px; }");
            html.AppendLine(".header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }");
            html.AppendLine(".content { padding: 20px; }");
            html.AppendLine(".order-details { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }");
            html.AppendLine(".item { border-bottom: 1px solid #dee2e6; padding: 10px 0; }");
            html.AppendLine(".total { font-weight: bold; font-size: 1.2em; color: #1e3a8a; }");
            html.AppendLine("</style>");
            html.AppendLine("</head>");
            html.AppendLine("<body>");
            
            html.AppendLine("<div class='header'>");
            html.AppendLine("<h1>Cast Stone - New Order Received</h1>");
            html.AppendLine("</div>");
            
            html.AppendLine("<div class='content'>");
            html.AppendLine($"<h2>Order #{order.Id}</h2>");
            html.AppendLine($"<p><strong>Order Date:</strong> {order.CreatedAt:yyyy-MM-dd HH:mm:ss}</p>");
            html.AppendLine($"<p><strong>Customer Email:</strong> {order.Email}</p>");
            
            if (!string.IsNullOrEmpty(order.PhoneNumber))
                html.AppendLine($"<p><strong>Phone:</strong> {order.PhoneNumber}</p>");
            
            html.AppendLine("<div class='order-details'>");
            html.AppendLine("<h3>Shipping Address</h3>");
            html.AppendLine($"<p>{order.Country}, {order.City}</p>");
            if (!string.IsNullOrEmpty(order.ZipCode))
                html.AppendLine($"<p>Zip Code: {order.ZipCode}</p>");
            html.AppendLine("</div>");
            
            html.AppendLine("<div class='order-details'>");
            html.AppendLine("<h3>Order Items</h3>");
            
            if (order.OrderItems != null)
            {
                foreach (var item in order.OrderItems)
                {
                    html.AppendLine("<div class='item'>");
                    html.AppendLine($"<p><strong>Quantity:</strong> {item.Quantity}</p>");
                    html.AppendLine($"<p><strong>Price:</strong> ${item.PriceAtPurchaseTime:F2}</p>");
                    html.AppendLine($"<p><strong>Subtotal:</strong> ${(item.Quantity * item.PriceAtPurchaseTime):F2}</p>");
                    html.AppendLine("</div>");
                }
            }
            
            html.AppendLine($"<div class='total'>");
            html.AppendLine($"<p>Total Amount: ${order.TotalAmount:F2}</p>");
            html.AppendLine("</div>");
            html.AppendLine("</div>");
            
            html.AppendLine("<div class='order-details'>");
            html.AppendLine("<h3>Payment Information</h3>");
            html.AppendLine($"<p><strong>Payment Method:</strong> {payment.PaymentMethod}</p>");
            html.AppendLine($"<p><strong>Transaction ID:</strong> {payment.TransactionId}</p>");
            html.AppendLine($"<p><strong>Status:</strong> {payment.Status}</p>");
            html.AppendLine($"<p><strong>Amount Paid:</strong> ${payment.Amount:F2} {payment.Currency}</p>");
            html.AppendLine($"<p><strong>Processed At:</strong> {payment.ProcessedAt:yyyy-MM-dd HH:mm:ss}</p>");
            html.AppendLine("</div>");
            
            html.AppendLine("</div>");
            html.AppendLine("</body>");
            html.AppendLine("</html>");
            
            return html.ToString();
        }

        private string GenerateOrderConfirmationText(OrderResponse order, PaymentConfirmationResponse payment)
        {
            var text = new StringBuilder();
            text.AppendLine("CAST STONE - NEW ORDER RECEIVED");
            text.AppendLine("================================");
            text.AppendLine();
            text.AppendLine($"Order #{order.Id}");
            text.AppendLine($"Order Date: {order.CreatedAt:yyyy-MM-dd HH:mm:ss}");
            text.AppendLine($"Customer Email: {order.Email}");
            
            if (!string.IsNullOrEmpty(order.PhoneNumber))
                text.AppendLine($"Phone: {order.PhoneNumber}");
            
            text.AppendLine();
            text.AppendLine("SHIPPING ADDRESS:");
            text.AppendLine($"{order.Country}, {order.City}");
            if (!string.IsNullOrEmpty(order.ZipCode))
                text.AppendLine($"Zip Code: {order.ZipCode}");
            
            text.AppendLine();
            text.AppendLine("ORDER ITEMS:");
            text.AppendLine("------------");
            
            if (order.OrderItems != null)
            {
                foreach (var item in order.OrderItems)
                {
                    text.AppendLine($"Quantity: {item.Quantity}");
                    text.AppendLine($"Price: ${item.PriceAtPurchaseTime:F2}");
                    text.AppendLine($"Subtotal: ${(item.Quantity * item.PriceAtPurchaseTime):F2}");
                    text.AppendLine();
                }
            }
            
            text.AppendLine($"TOTAL AMOUNT: ${order.TotalAmount:F2}");
            text.AppendLine();
            text.AppendLine("PAYMENT INFORMATION:");
            text.AppendLine("-------------------");
            text.AppendLine($"Payment Method: {payment.PaymentMethod}");
            text.AppendLine($"Transaction ID: {payment.TransactionId}");
            text.AppendLine($"Status: {payment.Status}");
            text.AppendLine($"Amount Paid: ${payment.Amount:F2} {payment.Currency}");
            text.AppendLine($"Processed At: {payment.ProcessedAt:yyyy-MM-dd HH:mm:ss}");
            
            return text.ToString();
        }
    }
}
