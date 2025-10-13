using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IWholesaleBuyerLocationService
{
    Task<BuyerLocationResponse?> GetByIdAsync(int id);
    Task<IEnumerable<BuyerLocationResponse>> GetAllAsync();
    Task<IEnumerable<BuyerLocationResponse>> GetByWholesaleBuyerIdAsync(int wholesaleBuyerId);
    Task<BuyerLocationResponse> CreateAsync(CreateWholesaleBuyerLocationRequest request);
    Task<BuyerLocationResponse?> UpdateAsync(int id, UpdateWholesaleBuyerLocationRequest request);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

