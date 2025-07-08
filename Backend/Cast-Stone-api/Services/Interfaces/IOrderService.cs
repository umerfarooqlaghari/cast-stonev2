using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IOrderService
{
    Task<OrderResponse?> GetByIdAsync(int id);
    Task<IEnumerable<OrderSummaryResponse>> GetAllAsync();
    Task<OrderResponse> CreateAsync(CreateOrderRequest request);
    Task<bool> UpdateStatusAsync(int id, UpdateOrderStatusRequest request);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<OrderResponse>> GetByUserIdAsync(int userId);
    Task<IEnumerable<OrderResponse>> GetByStatusIdAsync(int statusId);
    Task<IEnumerable<OrderResponse>> GetByEmailAsync(string email);
    Task<IEnumerable<OrderSummaryResponse>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<OrderResponse?> GetWithDetailsAsync(int id);
    Task<IEnumerable<OrderSummaryResponse>> GetRecentOrdersAsync(int count = 10);
    Task<decimal> GetTotalRevenueAsync();
    Task<decimal> GetTotalRevenueByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<int> GetOrderCountByStatusAsync(int statusId);
    Task<IEnumerable<OrderResponse>> GetPendingOrdersAsync();
    Task<bool> CancelOrderAsync(int id);
    Task<PaginatedResponse<OrderResponse>> GetFilteredAsync(OrderFilterRequest filter);
    Task<EmailNotificationResponse> SendOrderConfirmationEmailAsync(int orderId, PaymentConfirmationResponse payment);
}
