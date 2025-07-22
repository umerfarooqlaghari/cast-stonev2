using Cast_Stone_api.Domain.Models;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IWholesaleBuyerRepository : IBaseRepository<WholesaleBuyer>
{
    Task<WholesaleBuyer?> GetByEmailAsync(string email);
    Task<IEnumerable<WholesaleBuyer>> GetByStatusAsync(string status);
    Task<IEnumerable<WholesaleBuyer>> GetPendingApplicationsAsync();
    Task<IEnumerable<WholesaleBuyer>> GetApprovedBuyersAsync();
    Task<IEnumerable<WholesaleBuyer>> GetRejectedApplicationsAsync();
    Task<bool> EmailExistsAsync(string email);
    Task<int> GetApplicationCountByStatusAsync(string status);
    Task<IEnumerable<WholesaleBuyer>> GetRecentApplicationsAsync(int count = 10);
    Task<WholesaleBuyer?> GetWithUserAsync(int id);
    Task<WholesaleBuyer?> GetByEmailWithUserAsync(string email);
}
