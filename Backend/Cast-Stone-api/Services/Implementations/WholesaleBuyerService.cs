using AutoMapper;
using BCrypt.Net;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;
using Cast_Stone_api.Services;

namespace Cast_Stone_api.Services.Implementations;

public class WholesaleBuyerService : IWholesaleBuyerService
{
    private readonly IWholesaleBuyerRepository _wholesaleBuyerRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly IMapper _mapper;
    private readonly ILogger<WholesaleBuyerService> _logger;

    public WholesaleBuyerService(
        IWholesaleBuyerRepository wholesaleBuyerRepository,
        IUserRepository userRepository,
        IEmailService emailService,
        IMapper mapper,
        ILogger<WholesaleBuyerService> logger)
    {
        _wholesaleBuyerRepository = wholesaleBuyerRepository;
        _userRepository = userRepository;
        _emailService = emailService;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<WholesaleBuyerResponse?> GetByIdAsync(int id)
    {
        var wholesaleBuyer = await _wholesaleBuyerRepository.GetByIdAsync(id);
        return wholesaleBuyer != null ? _mapper.Map<WholesaleBuyerResponse>(wholesaleBuyer) : null;
    }

    public async Task<IEnumerable<WholesaleBuyerResponse>> GetAllAsync()
    {
        var wholesaleBuyers = await _wholesaleBuyerRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<WholesaleBuyerResponse>>(wholesaleBuyers);
    }

    public async Task<WholesaleBuyerResponse> CreateAsync(CreateWholesaleBuyerRequest request)
    {
        return await SubmitApplicationAsync(request);
    }

    public async Task<WholesaleBuyerResponse?> UpdateAsync(int id, UpdateWholesaleBuyerStatusRequest request)
    {
        var wholesaleBuyer = await _wholesaleBuyerRepository.GetByIdAsync(id);
        if (wholesaleBuyer == null)
        {
            return null;
        }

        wholesaleBuyer.Status = request.Status;
        wholesaleBuyer.AdminNotes = request.AdminNotes;
        wholesaleBuyer.UpdatedAt = DateTime.UtcNow;

        if (request.Status == "Approved" || request.Status == "Rejected")
        {
            wholesaleBuyer.ApprovedAt = DateTime.UtcNow;
        }

        var updatedWholesaleBuyer = await _wholesaleBuyerRepository.UpdateAsync(wholesaleBuyer);
        return _mapper.Map<WholesaleBuyerResponse>(updatedWholesaleBuyer);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (!await _wholesaleBuyerRepository.ExistsAsync(id))
        {
            return false;
        }

        await _wholesaleBuyerRepository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _wholesaleBuyerRepository.ExistsAsync(id);
    }

    public async Task<WholesaleBuyerResponse?> GetByEmailAsync(string email)
    {
        var wholesaleBuyer = await _wholesaleBuyerRepository.GetByEmailAsync(email);
        return wholesaleBuyer != null ? _mapper.Map<WholesaleBuyerResponse>(wholesaleBuyer) : null;
    }

    public async Task<IEnumerable<WholesaleBuyerResponse>> GetByStatusAsync(string status)
    {
        var wholesaleBuyers = await _wholesaleBuyerRepository.GetByStatusAsync(status);
        return _mapper.Map<IEnumerable<WholesaleBuyerResponse>>(wholesaleBuyers);
    }

    public async Task<IEnumerable<WholesaleBuyerResponse>> GetPendingApplicationsAsync()
    {
        var applications = await _wholesaleBuyerRepository.GetPendingApplicationsAsync();
        return _mapper.Map<IEnumerable<WholesaleBuyerResponse>>(applications);
    }

    public async Task<IEnumerable<WholesaleBuyerResponse>> GetApprovedBuyersAsync()
    {
        var buyers = await _wholesaleBuyerRepository.GetApprovedBuyersAsync();
        return _mapper.Map<IEnumerable<WholesaleBuyerResponse>>(buyers);
    }

    public async Task<IEnumerable<WholesaleBuyerResponse>> GetRejectedApplicationsAsync()
    {
        var applications = await _wholesaleBuyerRepository.GetRejectedApplicationsAsync();
        return _mapper.Map<IEnumerable<WholesaleBuyerResponse>>(applications);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _wholesaleBuyerRepository.EmailExistsAsync(email);
    }

    public async Task<int> GetApplicationCountByStatusAsync(string status)
    {
        return await _wholesaleBuyerRepository.GetApplicationCountByStatusAsync(status);
    }

    public async Task<IEnumerable<WholesaleBuyerSummaryResponse>> GetRecentApplicationsAsync(int count = 10)
    {
        var applications = await _wholesaleBuyerRepository.GetRecentApplicationsAsync(count);
        return _mapper.Map<IEnumerable<WholesaleBuyerSummaryResponse>>(applications);
    }

    public async Task<WholesaleBuyerResponse?> GetWithUserAsync(int id)
    {
        var wholesaleBuyer = await _wholesaleBuyerRepository.GetWithUserAsync(id);
        return wholesaleBuyer != null ? _mapper.Map<WholesaleBuyerResponse>(wholesaleBuyer) : null;
    }

    public async Task<WholesaleBuyerResponse?> GetByEmailWithUserAsync(string email)
    {
        var wholesaleBuyer = await _wholesaleBuyerRepository.GetByEmailWithUserAsync(email);
        return wholesaleBuyer != null ? _mapper.Map<WholesaleBuyerResponse>(wholesaleBuyer) : null;
    }

    public async Task<WholesaleBuyerResponse> SubmitApplicationAsync(CreateWholesaleBuyerRequest request)
    {
        // Check if email already has an application
        if (await _wholesaleBuyerRepository.EmailExistsAsync(request.Email))
        {
            throw new ArgumentException("An application already exists for this email address");
        }

        // Check if user already exists
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new ArgumentException("A user account already exists with this email address");
        }

        // Create user account first
        var userRequest = new CreateUserRequest
        {
            Role = "WholesaleBuyer",
            Email = request.Email,
            Password = request.Password,
            Active = true,
            IsApproved = false // Will be set to true when application is approved
        };

        var user = _mapper.Map<User>(userRequest);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        user.CreatedAt = DateTime.UtcNow;

        var createdUser = await _userRepository.AddAsync(user);

        // Create wholesale buyer application
        var wholesaleBuyer = _mapper.Map<WholesaleBuyer>(request);
        wholesaleBuyer.Status = "Pending";
        wholesaleBuyer.CreatedAt = DateTime.UtcNow;

        var createdWholesaleBuyer = await _wholesaleBuyerRepository.AddAsync(wholesaleBuyer);
        var response = _mapper.Map<WholesaleBuyerResponse>(createdWholesaleBuyer);

        // Send email notification to admins
        try
        {
            _logger.LogInformation("Sending wholesale buyer application notification emails for application {ApplicationId}", response.Id);
            var emailResponses = await _emailService.SendWholesaleBuyerApplicationToAdminsAsync(response);

            var successfulEmails = emailResponses.Count(r => r.Success);
            var totalEmails = emailResponses.Count;

            _logger.LogInformation("Sent {SuccessfulEmails}/{TotalEmails} wholesale buyer application notification emails for application {ApplicationId}",
                successfulEmails, totalEmails, response.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send wholesale buyer application notification emails for application {ApplicationId}", response.Id);
            // Don't throw the exception - the application was created successfully, email is just a notification
        }

        return response;
    }

    public async Task<WholesaleBuyerResponse?> ApproveApplicationAsync(int id, int approvedByUserId, string? adminNotes = null)
    {
        var wholesaleBuyer = await _wholesaleBuyerRepository.GetByIdAsync(id);
        if (wholesaleBuyer == null)
        {
            return null;
        }

        // Update wholesale buyer status
        wholesaleBuyer.Status = "Approved";
        wholesaleBuyer.AdminNotes = adminNotes;
        wholesaleBuyer.ApprovedBy = approvedByUserId;
        wholesaleBuyer.ApprovedAt = DateTime.UtcNow;
        wholesaleBuyer.UpdatedAt = DateTime.UtcNow;

        // Update user approval status
        var user = await _userRepository.GetByEmailAsync(wholesaleBuyer.Email);
        if (user != null)
        {
            user.IsApproved = true;
            await _userRepository.UpdateAsync(user);
        }

        var updatedWholesaleBuyer = await _wholesaleBuyerRepository.UpdateAsync(wholesaleBuyer);
        return _mapper.Map<WholesaleBuyerResponse>(updatedWholesaleBuyer);
    }

    public async Task<WholesaleBuyerResponse?> RejectApplicationAsync(int id, int rejectedByUserId, string? adminNotes = null)
    {
        var wholesaleBuyer = await _wholesaleBuyerRepository.GetByIdAsync(id);
        if (wholesaleBuyer == null)
        {
            return null;
        }

        // Update wholesale buyer status
        wholesaleBuyer.Status = "Rejected";
        wholesaleBuyer.AdminNotes = adminNotes;
        wholesaleBuyer.ApprovedBy = rejectedByUserId;
        wholesaleBuyer.ApprovedAt = DateTime.UtcNow;
        wholesaleBuyer.UpdatedAt = DateTime.UtcNow;

        // Keep user account but ensure it's not approved
        var user = await _userRepository.GetByEmailAsync(wholesaleBuyer.Email);
        if (user != null)
        {
            user.IsApproved = false;
            await _userRepository.UpdateAsync(user);
        }

        var updatedWholesaleBuyer = await _wholesaleBuyerRepository.UpdateAsync(wholesaleBuyer);
        return _mapper.Map<WholesaleBuyerResponse>(updatedWholesaleBuyer);
    }

    public async Task<bool> IsUserApprovedWholesaleBuyerAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null || user.Role != "WholesaleBuyer")
        {
            return false;
        }

        return user.IsApproved;
    }

    public async Task<IEnumerable<WholesaleBuyerLocationResponse>> GetApprovedBuyerLocationsAsync()
    {
        var approvedBuyers = await _wholesaleBuyerRepository.GetByStatusAsync("Approved");

        return approvedBuyers
            .Where(wb => wb.Latitude.HasValue && wb.Longitude.HasValue)
            .Select(wb => new WholesaleBuyerLocationResponse
            {
                Id = wb.Id,
                CompanyName = wb.CompanyName,
                BusinessType = wb.BusinessType,
                City = wb.City,
                State = wb.State,
                Country = wb.Country,
                Latitude = wb.Latitude,
                Longitude = wb.Longitude,
                BusinessAddress = wb.BusinessAddress,
                Phone = wb.Phone,
                Email = wb.Email
            });
    }
}
