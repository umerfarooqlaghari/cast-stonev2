using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IWholesaleBuyerService : IBaseService<WholesaleBuyer, WholesaleBuyerResponse, CreateWholesaleBuyerRequest, UpdateWholesaleBuyerStatusRequest>
{
    Task<WholesaleBuyerResponse?> GetByEmailAsync(string email);
    Task<IEnumerable<WholesaleBuyerResponse>> GetByStatusAsync(string status);
    Task<IEnumerable<WholesaleBuyerResponse>> GetPendingApplicationsAsync();
    Task<IEnumerable<WholesaleBuyerResponse>> GetApprovedBuyersAsync();
    Task<IEnumerable<WholesaleBuyerResponse>> GetRejectedApplicationsAsync();
    Task<bool> EmailExistsAsync(string email);
    Task<int> GetApplicationCountByStatusAsync(string status);
    Task<IEnumerable<WholesaleBuyerSummaryResponse>> GetRecentApplicationsAsync(int count = 10);
    Task<WholesaleBuyerResponse?> GetWithUserAsync(int id);
    Task<WholesaleBuyerResponse?> GetByEmailWithUserAsync(string email);
    Task<WholesaleBuyerResponse> SubmitApplicationAsync(CreateWholesaleBuyerRequest request);
    Task<WholesaleBuyerResponse?> ApproveApplicationAsync(int id, int approvedByUserId, string? adminNotes = null);
    Task<WholesaleBuyerResponse?> RejectApplicationAsync(int id, int rejectedByUserId, string? adminNotes = null);
    Task<bool> IsUserApprovedWholesaleBuyerAsync(string email);
    Task<IEnumerable<WholesaleBuyerLocationResponse>> GetApprovedBuyerLocationsAsync();
}
