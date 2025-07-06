using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IOrderRepository : IBaseRepository<Order>
{
    Task<IEnumerable<Order>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Order>> GetByStatusIdAsync(int statusId);
    Task<IEnumerable<Order>> GetByEmailAsync(string email);
    Task<IEnumerable<Order>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<Order?> GetWithDetailsAsync(int id);
    Task<IEnumerable<Order>> GetRecentOrdersAsync(int count = 10);
    Task<decimal> GetTotalRevenueAsync();
    Task<decimal> GetTotalRevenueByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<int> GetOrderCountByStatusAsync(int statusId);
    Task<IEnumerable<Order>> GetPendingOrdersAsync();
    Task<(IEnumerable<Order> Orders, int TotalCount)> GetFilteredAsync(OrderFilterRequest filter);
}
