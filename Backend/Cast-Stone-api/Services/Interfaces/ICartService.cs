using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface ICartService
{
    Task<CartResponse?> GetCartByUserIdAsync(int userId);
    Task<CartResponse?> GetCartBySessionIdAsync(string sessionId);
    Task<CartSummaryResponse?> GetCartSummaryByUserIdAsync(int userId);
    Task<CartSummaryResponse?> GetCartSummaryBySessionIdAsync(string sessionId);
    Task<CartResponse> AddToCartAsync(AddToCartRequest request);
    Task<CartResponse?> UpdateCartItemAsync(int cartId, int productId, UpdateCartItemRequest request);
    Task<bool> RemoveFromCartAsync(int cartId, int productId);
    Task<bool> RemoveCartItemAsync(int cartItemId);
    Task<bool> ClearCartAsync(int cartId);
    Task<bool> ClearCartByUserIdAsync(int userId);
    Task<bool> ClearCartBySessionIdAsync(string sessionId);
    Task<CartResponse?> GetOrCreateCartAsync(int? userId, string? sessionId);
}
