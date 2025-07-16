# Brevo Email Integration Testing Guide

## Overview
This guide explains how to test the Brevo email integration for automated contact form replies and order confirmations.

## Prerequisites
1. Ensure your `appsettings.json` has valid Brevo SMTP settings
2. Ensure Railway environment variables are configured with Brevo credentials
3. Backend API is running

## Email Features Implemented

### 1. Contact Form Auto-Reply
- **Trigger**: When a user submits a contact form
- **Recipient**: The user who submitted the form
- **Content**: Professional acknowledgment with inquiry details and 24-hour response promise

### 2. Order Confirmation (Customer)
- **Trigger**: When an order is successfully created
- **Recipient**: The customer who placed the order
- **Content**: Order details, items, total amount, and shipping information

### 3. Order Notification (Admin)
- **Trigger**: When an order is successfully created
- **Recipient**: Admin email (configured in SmtpSettings.AdminEmail)
- **Content**: Complete order details for admin review

## API Endpoints

### Contact Form Auto-Reply
```
POST /api/email/contact-form-reply
Content-Type: application/json

{
  "userEmail": "customer@example.com",
  "userName": "John Doe",
  "inquiryType": "General Inquiry",
  "message": "I'm interested in your cast stone products.",
  "company": "ABC Company",
  "state": "California",
  "phoneNumber": "+1-555-0123"
}
```

### Order Confirmation
```
POST /api/email/order-confirmation
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "orderId": 12345,
  "totalAmount": 299.99,
  "paymentMethod": "Credit Card",
  "shippingAddress": "123 Main St, City, State 12345",
  "orderItems": [
    {
      "productName": "Cast Stone Fountain",
      "quantity": 1,
      "price": 299.99,
      "total": 299.99,
      "productDescription": "Beautiful cast stone fountain"
    }
  ]
}
```

## Testing Steps

### 1. Test Contact Form Auto-Reply

1. **Via Frontend**: Submit a contact form on the website
2. **Via API**: Use the endpoint above with test data
3. **Expected Result**: User receives a professional auto-reply email

### 2. Test Order Confirmation

1. **Via Frontend**: Complete a purchase on the website
2. **Via API**: Use the endpoint above with test data
3. **Expected Result**: 
   - Customer receives order confirmation email
   - Admin receives order notification email

### 3. Manual API Testing with Postman/curl

```bash
# Test Contact Form Auto-Reply
curl -X POST "https://your-api-url/api/email/contact-form-reply" \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userName": "Test User",
    "inquiryType": "Product Inquiry",
    "message": "Testing auto-reply functionality",
    "company": "Test Company",
    "state": "Test State",
    "phoneNumber": "+1-555-0123"
  }'

# Test Order Confirmation
curl -X POST "https://your-api-url/api/email/order-confirmation" \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Test Customer",
    "orderId": 999,
    "totalAmount": 199.99,
    "paymentMethod": "Test Payment",
    "shippingAddress": "Test Address",
    "orderItems": [
      {
        "productName": "Test Product",
        "quantity": 1,
        "price": 199.99,
        "total": 199.99
      }
    ]
  }'
```

## Email Templates

### Contact Form Auto-Reply Features:
- Professional Cast Stone branding
- Navy blue and white color scheme
- Responsive HTML design
- Inquiry details summary
- 24-hour response promise
- Company contact information

### Order Confirmation Features:
- Order summary with items
- Total amount and payment method
- Shipping address
- Professional styling
- Cast Stone branding

## Troubleshooting

### Common Issues:
1. **SMTP Authentication Failed**: Check Brevo credentials in appsettings.json
2. **Email Not Sent**: Check logs for detailed error messages
3. **Invalid Email Format**: Ensure email addresses are properly formatted

### Logs to Check:
- Application logs will show email sending attempts
- Success/failure messages are logged with recipient details
- SMTP connection errors are logged with details

## Configuration

### Required appsettings.json:
```json
{
  "SmtpSettings": {
    "Host": "smtp-relay.brevo.com",
    "Port": 587,
    "Username": "your@email.com",
    "Password": "your_smtp_api_key",
    "EnableSsl": true,
    "FromEmail": "noreply@caststone.com",
    "FromName": "Cast Stone",
    "AdminEmail": "admin@caststone.com"
  }
}
```

### Railway Environment Variables:
- `SmtpSettings__Host`
- `SmtpSettings__Port`
- `SmtpSettings__Username`
- `SmtpSettings__Password`
- `SmtpSettings__EnableSsl`
- `SmtpSettings__FromEmail`
- `SmtpSettings__FromName`
- `SmtpSettings__AdminEmail`

## Integration Points

### Automatic Triggers:
1. **Contact Form Submission**: Auto-reply is sent automatically when ContactFormSubmissionService.CreateAsync is called
2. **Order Creation**: Customer confirmation is sent automatically when OrderService.CreateAsync is called
3. **Admin Notifications**: Admin order notifications are sent via existing EmailService.SendOrderConfirmationToAdminAsync

### Frontend Integration:
- Contact form submissions automatically trigger auto-reply emails
- Order completion automatically triggers confirmation emails
- No additional frontend code required for basic functionality
- Optional: Use EmailService utilities for custom email features
