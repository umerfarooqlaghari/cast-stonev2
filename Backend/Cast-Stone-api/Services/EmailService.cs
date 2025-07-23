using Cast_Stone_api.Domain.Models.PaymentGatewaySettings;
using Cast_Stone_api.Domain.Models;
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
        Task<List<EmailNotificationResponse>> SendWholesaleBuyerApplicationToAdminsAsync(WholesaleBuyerResponse application);
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

        private async Task<List<string>> GetAdminEmailsAsync()
        {
            // For now, we'll use a simple approach. In a real application, you might want to inject a UserService
            // to get admin emails from the database. For this implementation, we'll use the configured admin email
            // and potentially add more admin emails from configuration.

            var adminEmails = new List<string>();

            // Add the primary admin email from configuration
            if (!string.IsNullOrEmpty(_smtpSettings.AdminEmail))
            {
                adminEmails.Add(_smtpSettings.AdminEmail);
            }

            // You can add more admin emails here or fetch from database
            // Example: var dbAdminEmails = await _userService.GetAdminEmailsAsync();
            // adminEmails.AddRange(dbAdminEmails);

            return adminEmails;
        }

        private string GenerateWholesaleBuyerApplicationHtml(WholesaleBuyerResponse application)
        {
            var html = new StringBuilder();

            html.AppendLine("<!DOCTYPE html>");
            html.AppendLine("<html>");
            html.AppendLine("<head>");
            html.AppendLine("    <meta charset='utf-8'>");
            html.AppendLine("    <title>New Wholesale Buyer Application</title>");
            html.AppendLine("    <style>");
            html.AppendLine("        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
            html.AppendLine("        .container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            html.AppendLine("        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }");
            html.AppendLine("        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }");
            html.AppendLine("        .section { margin-bottom: 25px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }");
            html.AppendLine("        .section h3 { color: #047857; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }");
            html.AppendLine("        .field { margin-bottom: 12px; }");
            html.AppendLine("        .field strong { color: #374151; display: inline-block; width: 150px; }");
            html.AppendLine("        .status { padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }");
            html.AppendLine("        .status.pending { background: #fef3c7; color: #92400e; }");
            html.AppendLine("        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }");
            html.AppendLine("        .action-buttons { text-align: center; margin: 25px 0; }");
            html.AppendLine("        .btn { display: inline-block; padding: 12px 24px; margin: 0 10px; text-decoration: none; border-radius: 6px; font-weight: bold; }");
            html.AppendLine("        .btn-approve { background: #10b981; color: white; }");
            html.AppendLine("        .btn-review { background: #3b82f6; color: white; }");
            html.AppendLine("    </style>");
            html.AppendLine("</head>");
            html.AppendLine("<body>");
            html.AppendLine("    <div class='container'>");
            html.AppendLine("        <div class='header'>");
            html.AppendLine("            <h1>🏢 New Wholesale Buyer Application</h1>");
            html.AppendLine("            <p>A new wholesale buyer application has been submitted and requires your review.</p>");
            html.AppendLine("        </div>");
            html.AppendLine("        <div class='content'>");

            // Application Overview
            html.AppendLine("            <div class='section'>");
            html.AppendLine("                <h3>📋 Application Overview</h3>");
            html.AppendLine($"                <div class='field'><strong>Application ID:</strong> #{application.Id}</div>");
            html.AppendLine($"                <div class='field'><strong>Company Name:</strong> {application.CompanyName}</div>");
            html.AppendLine($"                <div class='field'><strong>Applicant:</strong> {application.FirstName} {application.LastName}</div>");
            html.AppendLine($"                <div class='field'><strong>Email:</strong> {application.Email}</div>");
            html.AppendLine($"                <div class='field'><strong>Status:</strong> <span class='status pending'>{application.Status}</span></div>");
            html.AppendLine($"                <div class='field'><strong>Applied On:</strong> {application.CreatedAt:MMMM dd, yyyy 'at' hh:mm tt}</div>");
            html.AppendLine("            </div>");

            // Personal & Contact Information
            html.AppendLine("            <div class='section'>");
            html.AppendLine("                <h3>👤 Personal & Contact Information</h3>");
            html.AppendLine($"                <div class='field'><strong>Full Name:</strong> {application.FirstName} {application.LastName}</div>");
            html.AppendLine($"                <div class='field'><strong>Email:</strong> {application.Email}</div>");
            html.AppendLine($"                <div class='field'><strong>Phone:</strong> {application.Phone}</div>");
            html.AppendLine("            </div>");

            // Business Information
            html.AppendLine("            <div class='section'>");
            html.AppendLine("                <h3>🏢 Business Information</h3>");
            html.AppendLine($"                <div class='field'><strong>Company Name:</strong> {application.CompanyName}</div>");
            html.AppendLine($"                <div class='field'><strong>Business Type:</strong> {application.BusinessType}</div>");
            if (!string.IsNullOrEmpty(application.OtherBusinessType))
            {
                html.AppendLine($"                <div class='field'><strong>Other Business Type:</strong> {application.OtherBusinessType}</div>");
            }
            if (!string.IsNullOrEmpty(application.TaxNumber))
            {
                html.AppendLine($"                <div class='field'><strong>Tax Number:</strong> {application.TaxNumber}</div>");
            }
            html.AppendLine("            </div>");

            // Business Address
            html.AppendLine("            <div class='section'>");
            html.AppendLine("                <h3>📍 Business Address</h3>");
            html.AppendLine($"                <div class='field'><strong>Address:</strong> {application.BusinessAddress}</div>");
            html.AppendLine($"                <div class='field'><strong>City:</strong> {application.City}</div>");
            html.AppendLine($"                <div class='field'><strong>State:</strong> {application.State}</div>");
            html.AppendLine($"                <div class='field'><strong>ZIP Code:</strong> {application.ZipCode}</div>");
            html.AppendLine($"                <div class='field'><strong>Country:</strong> {application.Country}</div>");
            html.AppendLine("            </div>");

            // Additional Information
            if (application.HowDidYouHear?.Any() == true || !string.IsNullOrEmpty(application.Comments))
            {
                html.AppendLine("            <div class='section'>");
                html.AppendLine("                <h3>💬 Additional Information</h3>");

                if (application.HowDidYouHear?.Any() == true)
                {
                    html.AppendLine($"                <div class='field'><strong>How did you hear about us:</strong> {string.Join(", ", application.HowDidYouHear)}</div>");
                    if (!string.IsNullOrEmpty(application.OtherHowDidYouHear))
                    {
                        html.AppendLine($"                <div class='field'><strong>Other:</strong> {application.OtherHowDidYouHear}</div>");
                    }
                }

                if (!string.IsNullOrEmpty(application.Comments))
                {
                    html.AppendLine($"                <div class='field'><strong>Comments:</strong><br>{application.Comments.Replace("\n", "<br>")}</div>");
                }
                html.AppendLine("            </div>");
            }

            // Action Buttons (these would link to your admin panel)
            html.AppendLine("            <div class='action-buttons'>");
            html.AppendLine($"                <a href='#' class='btn btn-approve'>✅ Approve Application</a>");
            html.AppendLine($"                <a href='#' class='btn btn-review'>👁️ Review in Admin Panel</a>");
            html.AppendLine("            </div>");

            html.AppendLine("            <div class='footer'>");
            html.AppendLine("                <p>Please review this application carefully and take appropriate action.</p>");
            html.AppendLine("                <p><strong>Cast Stone Admin Team</strong></p>");
            html.AppendLine("            </div>");
            html.AppendLine("        </div>");
            html.AppendLine("    </div>");
            html.AppendLine("</body>");
            html.AppendLine("</html>");

            return html.ToString();
        }

        private string GenerateWholesaleBuyerApplicationText(WholesaleBuyerResponse application)
        {
            var text = new StringBuilder();

            text.AppendLine("NEW WHOLESALE BUYER APPLICATION");
            text.AppendLine("=====================================");
            text.AppendLine();
            text.AppendLine("A new wholesale buyer application has been submitted and requires your review.");
            text.AppendLine();

            // Application Overview
            text.AppendLine("APPLICATION OVERVIEW");
            text.AppendLine("-------------------");
            text.AppendLine($"Application ID: #{application.Id}");
            text.AppendLine($"Company Name: {application.CompanyName}");
            text.AppendLine($"Applicant: {application.FirstName} {application.LastName}");
            text.AppendLine($"Email: {application.Email}");
            text.AppendLine($"Status: {application.Status}");
            text.AppendLine($"Applied On: {application.CreatedAt:MMMM dd, yyyy 'at' hh:mm tt}");
            text.AppendLine();

            // Personal & Contact Information
            text.AppendLine("PERSONAL & CONTACT INFORMATION");
            text.AppendLine("-----------------------------");
            text.AppendLine($"Full Name: {application.FirstName} {application.LastName}");
            text.AppendLine($"Email: {application.Email}");
            text.AppendLine($"Phone: {application.Phone}");
            text.AppendLine();

            // Business Information
            text.AppendLine("BUSINESS INFORMATION");
            text.AppendLine("-------------------");
            text.AppendLine($"Company Name: {application.CompanyName}");
            text.AppendLine($"Business Type: {application.BusinessType}");
            if (!string.IsNullOrEmpty(application.OtherBusinessType))
            {
                text.AppendLine($"Other Business Type: {application.OtherBusinessType}");
            }
            if (!string.IsNullOrEmpty(application.TaxNumber))
            {
                text.AppendLine($"Tax Number: {application.TaxNumber}");
            }
            text.AppendLine();

            // Business Address
            text.AppendLine("BUSINESS ADDRESS");
            text.AppendLine("---------------");
            text.AppendLine($"Address: {application.BusinessAddress}");
            text.AppendLine($"City: {application.City}");
            text.AppendLine($"State: {application.State}");
            text.AppendLine($"ZIP Code: {application.ZipCode}");
            text.AppendLine($"Country: {application.Country}");
            text.AppendLine();

            // Additional Information
            if (application.HowDidYouHear?.Any() == true || !string.IsNullOrEmpty(application.Comments))
            {
                text.AppendLine("ADDITIONAL INFORMATION");
                text.AppendLine("---------------------");

                if (application.HowDidYouHear?.Any() == true)
                {
                    text.AppendLine($"How did you hear about us: {string.Join(", ", application.HowDidYouHear)}");
                    if (!string.IsNullOrEmpty(application.OtherHowDidYouHear))
                    {
                        text.AppendLine($"Other: {application.OtherHowDidYouHear}");
                    }
                }

                if (!string.IsNullOrEmpty(application.Comments))
                {
                    text.AppendLine($"Comments: {application.Comments}");
                }
                text.AppendLine();
            }

            text.AppendLine("Please review this application carefully and take appropriate action.");
            text.AppendLine();
            text.AppendLine("Cast Stone Admin Team");

            return text.ToString();
        }

        public async Task<List<EmailNotificationResponse>> SendWholesaleBuyerApplicationToAdminsAsync(WholesaleBuyerResponse application)
        {
            var responses = new List<EmailNotificationResponse>();

            try
            {
                // Get all admin users
                var adminEmails = await GetAdminEmailsAsync();

                if (!adminEmails.Any())
                {
                    _logger.LogWarning("No admin emails found for wholesale buyer application notification");
                    responses.Add(new EmailNotificationResponse
                    {
                        Success = false,
                        Message = "No admin emails configured",
                        SentAt = DateTime.UtcNow
                    });
                    return responses;
                }

                var subject = $"New Wholesale Buyer Application - {application.CompanyName}";
                var htmlBody = GenerateWholesaleBuyerApplicationHtml(application);
                var plainTextBody = GenerateWholesaleBuyerApplicationText(application);

                // Send email to each admin
                foreach (var adminEmail in adminEmails)
                {
                    try
                    {
                        var response = await SendEmailAsync(adminEmail, subject, htmlBody, plainTextBody);
                        responses.Add(response);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error sending wholesale buyer application email to admin {AdminEmail}", adminEmail);
                        responses.Add(new EmailNotificationResponse
                        {
                            Success = false,
                            Message = $"Failed to send email to {adminEmail}: {ex.Message}",
                            SentAt = DateTime.UtcNow
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending wholesale buyer application emails for application {ApplicationId}", application.Id);
                responses.Add(new EmailNotificationResponse
                {
                    Success = false,
                    Message = $"Failed to send wholesale buyer application emails: {ex.Message}",
                    SentAt = DateTime.UtcNow
                });
            }

            return responses;
        }
    }
}
