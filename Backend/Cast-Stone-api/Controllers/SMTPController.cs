using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.Services;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IEmailService _emailService;

    public EmailController(IConfiguration config, IEmailService emailService)
    {
        _config = config;
        _emailService = emailService;
    }

    [HttpPost("send")]
    public IActionResult SendEmail([FromBody] EmailRequest request)
    {
        var smtpSettings = _config.GetSection("SmtpSettings");

        using var client = new SmtpClient(smtpSettings["Host"], int.Parse(smtpSettings["Port"]))
        {
            Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"]),
            EnableSsl = bool.Parse(smtpSettings["EnableSsl"]),
        };

        var message = new MailMessage
        {
            From = new MailAddress(smtpSettings["FromEmail"], smtpSettings["FromName"]),
            Subject = request.Subject,
            Body = request.Message,
            IsBodyHtml = true
        };

        message.To.Add(smtpSettings["AdminEmail"]);

        client.Send(message);

        return Ok(new { status = "sent" });
    }

    [HttpPost("contact-form-reply")]
    public async Task<IActionResult> SendContactFormAutoReply([FromBody] ContactFormAutoReplyRequest request)
    {
        try
        {
            var result = await _emailService.SendContactFormAutoReplyAsync(
                request.UserEmail,
                request.UserName,
                request.InquiryType,
                request.Message,
                request.Company,
                request.State,
                request.PhoneNumber
            );

            if (result.Success)
            {
                return Ok(new { status = "sent", message = result.Message });
            }
            else
            {
                return BadRequest(new { status = "failed", message = result.Message });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = ex.Message });
        }
    }

    [HttpPost("order-confirmation")]
    public async Task<IActionResult> SendOrderConfirmation([FromBody] OrderConfirmationRequest request)
    {
        try
        {
            var result = await _emailService.SendOrderConfirmationToCustomerAsync(
                request.CustomerEmail,
                request.CustomerName,
                request.OrderId,
                request.TotalAmount,
                request.OrderItems,
                request.PaymentMethod,
                request.ShippingAddress
            );

            if (result.Success)
            {
                return Ok(new { status = "sent", message = result.Message });
            }
            else
            {
                return BadRequest(new { status = "failed", message = result.Message });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = ex.Message });
        }
    }
}
