using Cast_Stone_api.Domain.Models.PaymentGatewaySettings;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.DTOs.Request;
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
        Task<EmailNotificationResponse> SendContactFormAutoReplyAsync(string userEmail, string userName, string inquiryType, string message, string? company = null, string? state = null, string? phoneNumber = null);
        Task<EmailNotificationResponse> SendOrderConfirmationToCustomerAsync(string customerEmail, string customerName, int orderId, decimal totalAmount, List<OrderItemDetail> orderItems, string paymentMethod, string? shippingAddress = null);
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

        public async Task<EmailNotificationResponse> SendContactFormAutoReplyAsync(string userEmail, string userName, string inquiryType, string message, string? company = null, string? state = null, string? phoneNumber = null)
        {
            try
            {
                var subject = "Thank you for contacting Cast Stone - We'll be in touch soon!";
                var htmlBody = GenerateContactFormAutoReplyHtml(userName, inquiryType, message, company, state, phoneNumber);
                var plainTextBody = GenerateContactFormAutoReplyText(userName, inquiryType, message, company, state, phoneNumber);

                return await SendEmailAsync(userEmail, subject, htmlBody, plainTextBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending contact form auto-reply email to {UserEmail}", userEmail);
                return new EmailNotificationResponse
                {
                    Success = false,
                    Message = $"Failed to send contact form auto-reply email: {ex.Message}",
                    SentAt = DateTime.UtcNow,
                    RecipientEmail = userEmail
                };
            }
        }

        public async Task<EmailNotificationResponse> SendOrderConfirmationToCustomerAsync(string customerEmail, string customerName, int orderId, decimal totalAmount, List<OrderItemDetail> orderItems, string paymentMethod, string? shippingAddress = null)
        {
            try
            {
                var subject = $"Order Confirmation - Cast Stone Order #{orderId}";
                var htmlBody = GenerateCustomerOrderConfirmationHtml(customerName, orderId, totalAmount, orderItems, paymentMethod, shippingAddress);
                var plainTextBody = GenerateCustomerOrderConfirmationText(customerName, orderId, totalAmount, orderItems, paymentMethod, shippingAddress);

                return await SendEmailAsync(customerEmail, subject, htmlBody, plainTextBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending order confirmation email to customer {CustomerEmail} for order {OrderId}", customerEmail, orderId);
                return new EmailNotificationResponse
                {
                    Success = false,
                    Message = $"Failed to send order confirmation email: {ex.Message}",
                    SentAt = DateTime.UtcNow,
                    RecipientEmail = customerEmail
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

        private string GenerateContactFormAutoReplyHtml(string userName, string inquiryType, string message, string? company = null, string? state = null, string? phoneNumber = null)
        {
            var html = new StringBuilder();
            html.AppendLine("<!DOCTYPE html>");
            html.AppendLine("<html>");
            html.AppendLine("<head>");
            html.AppendLine("<meta charset='utf-8'>");
            html.AppendLine("<title>Thank you for contacting Cast Stone</title>");
            html.AppendLine("<style>");
            html.AppendLine("body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }");
            html.AppendLine(".container { max-width: 600px; margin: 0 auto; background-color: white; }");
            html.AppendLine(".header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px 30px; text-align: center; }");
            html.AppendLine(".header h1 { margin: 0; font-size: 28px; font-weight: 300; }");
            html.AppendLine(".content { padding: 40px 30px; }");
            html.AppendLine(".greeting { font-size: 18px; color: #1e3a8a; margin-bottom: 20px; }");
            html.AppendLine(".message-box { background-color: #f8f9fa; padding: 20px; border-left: 4px solid #1e3a8a; margin: 20px 0; }");
            html.AppendLine(".details { background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }");
            html.AppendLine(".details h3 { color: #1e3a8a; margin-top: 0; }");
            html.AppendLine(".footer { background-color: #1e3a8a; color: white; padding: 30px; text-align: center; }");
            html.AppendLine(".footer p { margin: 5px 0; }");
            html.AppendLine(".highlight { color: #1e3a8a; font-weight: 600; }");
            html.AppendLine("</style>");
            html.AppendLine("</head>");
            html.AppendLine("<body>");

            html.AppendLine("<div class='container'>");
            html.AppendLine("<div class='header'>");
            html.AppendLine("<h1>Cast Stone</h1>");
            html.AppendLine("<p>Premium Cast Stone Solutions</p>");
            html.AppendLine("</div>");

            html.AppendLine("<div class='content'>");
            html.AppendLine($"<div class='greeting'>Dear {userName},</div>");
            html.AppendLine("<p>Thank you for reaching out to Cast Stone! We have received your inquiry and our team will review it carefully.</p>");

            html.AppendLine("<div class='details'>");
            html.AppendLine("<h3>Your Inquiry Details:</h3>");
            html.AppendLine($"<p><strong>Inquiry Type:</strong> {inquiryType}</p>");
            if (!string.IsNullOrEmpty(company))
                html.AppendLine($"<p><strong>Company:</strong> {company}</p>");
            if (!string.IsNullOrEmpty(state))
                html.AppendLine($"<p><strong>State:</strong> {state}</p>");
            if (!string.IsNullOrEmpty(phoneNumber))
                html.AppendLine($"<p><strong>Phone:</strong> {phoneNumber}</p>");
            html.AppendLine("</div>");

            html.AppendLine("<div class='message-box'>");
            html.AppendLine("<p><strong>Your Message:</strong></p>");
            html.AppendLine($"<p>{message}</p>");
            html.AppendLine("</div>");

            html.AppendLine("<p>Our cast stone specialists will get back to you <span class='highlight'>within 24 hours</span> during business days. We look forward to helping you with your cast stone needs.</p>");

            html.AppendLine("<p>If you have any urgent questions, please don't hesitate to contact us directly.</p>");
            html.AppendLine("</div>");

            html.AppendLine("<div class='footer'>");
            html.AppendLine("<p><strong>Cast Stone</strong></p>");
            html.AppendLine("<p>Premium Cast Stone Solutions</p>");
            html.AppendLine("<p>Thank you for choosing Cast Stone for your architectural needs.</p>");
            html.AppendLine("</div>");
            html.AppendLine("</div>");

            html.AppendLine("</body>");
            html.AppendLine("</html>");

            return html.ToString();
        }

        private string GenerateContactFormAutoReplyText(string userName, string inquiryType, string message, string? company = null, string? state = null, string? phoneNumber = null)
        {
            var text = new StringBuilder();
            text.AppendLine("CAST STONE - THANK YOU FOR YOUR INQUIRY");
            text.AppendLine("=====================================");
            text.AppendLine();
            text.AppendLine($"Dear {userName},");
            text.AppendLine();
            text.AppendLine("Thank you for reaching out to Cast Stone! We have received your inquiry and our team will review it carefully.");
            text.AppendLine();
            text.AppendLine("YOUR INQUIRY DETAILS:");
            text.AppendLine($"Inquiry Type: {inquiryType}");
            if (!string.IsNullOrEmpty(company))
                text.AppendLine($"Company: {company}");
            if (!string.IsNullOrEmpty(state))
                text.AppendLine($"State: {state}");
            if (!string.IsNullOrEmpty(phoneNumber))
                text.AppendLine($"Phone: {phoneNumber}");
            text.AppendLine();
            text.AppendLine("YOUR MESSAGE:");
            text.AppendLine(message);
            text.AppendLine();
            text.AppendLine("Our cast stone specialists will get back to you within 24 hours during business days.");
            text.AppendLine("We look forward to helping you with your cast stone needs.");
            text.AppendLine();
            text.AppendLine("If you have any urgent questions, please don't hesitate to contact us directly.");
            text.AppendLine();
            text.AppendLine("Best regards,");
            text.AppendLine("Cast Stone Team");
            text.AppendLine("Premium Cast Stone Solutions");

            return text.ToString();
        }

        private string GenerateCustomerOrderConfirmationHtml(string customerName, int orderId, decimal totalAmount, List<OrderItemDetail> orderItems, string paymentMethod, string? shippingAddress = null)
        {
            var html = new StringBuilder();
            html.AppendLine("<!DOCTYPE html>");
            html.AppendLine("<html>");
            html.AppendLine("<head>");
            html.AppendLine("<meta charset='utf-8'>");
            html.AppendLine("<title>Order Confirmation - Cast Stone</title>");
            html.AppendLine("<style>");
            html.AppendLine("body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }");
            html.AppendLine(".container { max-width: 600px; margin: 0 auto; background-color: white; }");
            html.AppendLine(".header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px 30px; text-align: center; }");
            html.AppendLine(".header h1 { margin: 0; font-size: 28px; font-weight: 300; }");
            html.AppendLine(".content { padding: 40px 30px; }");
            html.AppendLine(".order-summary { background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }");
            html.AppendLine(".order-item { border-bottom: 1px solid #e2e8f0; padding: 15px 0; display: flex; justify-content: space-between; }");
            html.AppendLine(".order-item:last-child { border-bottom: none; }");
            html.AppendLine(".total-section { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; font-size: 18px; font-weight: 600; }");
            html.AppendLine(".footer { background-color: #1e3a8a; color: white; padding: 30px; text-align: center; }");
            html.AppendLine(".highlight { color: #1e3a8a; font-weight: 600; }");
            html.AppendLine("</style>");
            html.AppendLine("</head>");
            html.AppendLine("<body>");

            html.AppendLine("<div class='container'>");
            html.AppendLine("<div class='header'>");
            html.AppendLine("<h1>Order Confirmed!</h1>");
            html.AppendLine("<p>Thank you for your purchase</p>");
            html.AppendLine("</div>");

            html.AppendLine("<div class='content'>");
            html.AppendLine($"<h2>Dear {customerName},</h2>");
            html.AppendLine("<p>Thank you for your order! We're excited to fulfill your cast stone needs. Your order has been confirmed and is being processed.</p>");

            html.AppendLine("<div class='order-summary'>");
            html.AppendLine($"<h3>Order #{orderId}</h3>");
            html.AppendLine($"<p><strong>Order Date:</strong> {DateTime.UtcNow:MMMM dd, yyyy}</p>");
            html.AppendLine($"<p><strong>Payment Method:</strong> {paymentMethod}</p>");
            if (!string.IsNullOrEmpty(shippingAddress))
                html.AppendLine($"<p><strong>Shipping Address:</strong> {shippingAddress}</p>");
            html.AppendLine("</div>");

            html.AppendLine("<h3>Order Items:</h3>");
            foreach (var item in orderItems)
            {
                html.AppendLine("<div class='order-item'>");
                html.AppendLine("<div>");
                html.AppendLine($"<strong>{item.ProductName}</strong><br>");
                html.AppendLine($"Quantity: {item.Quantity}<br>");
                html.AppendLine($"Price: ${item.Price:F2}");
                html.AppendLine("</div>");
                html.AppendLine($"<div><strong>${item.Total:F2}</strong></div>");
                html.AppendLine("</div>");
            }

            html.AppendLine("</div>");

            html.AppendLine("<div class='total-section'>");
            html.AppendLine($"Total Amount: ${totalAmount:F2}");
            html.AppendLine("</div>");

            html.AppendLine("<div class='content'>");
            html.AppendLine("<p>We will send you shipping updates as your order progresses. If you have any questions about your order, please don't hesitate to contact us.</p>");
            html.AppendLine("<p>Thank you for choosing Cast Stone for your architectural needs!</p>");
            html.AppendLine("</div>");

            html.AppendLine("<div class='footer'>");
            html.AppendLine("<p><strong>Cast Stone</strong></p>");
            html.AppendLine("<p>Premium Cast Stone Solutions</p>");
            html.AppendLine("</div>");
            html.AppendLine("</div>");

            html.AppendLine("</body>");
            html.AppendLine("</html>");

            return html.ToString();
        }

        private string GenerateCustomerOrderConfirmationText(string customerName, int orderId, decimal totalAmount, List<OrderItemDetail> orderItems, string paymentMethod, string? shippingAddress = null)
        {
            var text = new StringBuilder();
            text.AppendLine("CAST STONE - ORDER CONFIRMATION");
            text.AppendLine("===============================");
            text.AppendLine();
            text.AppendLine($"Dear {customerName},");
            text.AppendLine();
            text.AppendLine("Thank you for your order! We're excited to fulfill your cast stone needs.");
            text.AppendLine("Your order has been confirmed and is being processed.");
            text.AppendLine();
            text.AppendLine($"ORDER #{orderId}");
            text.AppendLine($"Order Date: {DateTime.UtcNow:MMMM dd, yyyy}");
            text.AppendLine($"Payment Method: {paymentMethod}");
            if (!string.IsNullOrEmpty(shippingAddress))
                text.AppendLine($"Shipping Address: {shippingAddress}");
            text.AppendLine();
            text.AppendLine("ORDER ITEMS:");
            text.AppendLine("------------");
            foreach (var item in orderItems)
            {
                text.AppendLine($"{item.ProductName}");
                text.AppendLine($"  Quantity: {item.Quantity}");
                text.AppendLine($"  Price: ${item.Price:F2}");
                text.AppendLine($"  Total: ${item.Total:F2}");
                text.AppendLine();
            }
            text.AppendLine($"TOTAL AMOUNT: ${totalAmount:F2}");
            text.AppendLine();
            text.AppendLine("We will send you shipping updates as your order progresses.");
            text.AppendLine("If you have any questions about your order, please don't hesitate to contact us.");
            text.AppendLine();
            text.AppendLine("Thank you for choosing Cast Stone for your architectural needs!");
            text.AppendLine();
            text.AppendLine("Best regards,");
            text.AppendLine("Cast Stone Team");
            text.AppendLine("Premium Cast Stone Solutions");

            return text.ToString();
        }
    }
}
