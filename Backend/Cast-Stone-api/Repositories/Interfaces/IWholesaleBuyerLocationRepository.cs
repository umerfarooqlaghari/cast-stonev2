using Cast_Stone_api.Domain.Models;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IWholesaleBuyerLocationRepository : IBaseRepository<WholesaleBuyerLocation>
{
    Task<IEnumerable<WholesaleBuyerLocation>> GetByWholesaleBuyerIdAsync(int wholesaleBuyerId);
    Task<bool> WholesaleBuyerExistsAsync(int wholesaleBuyerId);
}

