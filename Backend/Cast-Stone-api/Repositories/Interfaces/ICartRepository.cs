using Cast_Stone_api.Domain.Models;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface ICartRepository : IBaseRepository<Cart>
{
    Task<Cart?> GetByUserIdAsync(int userId);
    Task<Cart?> GetBySessionIdAsync(string sessionId);
    Task<Cart?> GetCartWithItemsAsync(int cartId);
    Task<Cart?> GetCartWithItemsByUserIdAsync(int userId);
    Task<Cart?> GetCartWithItemsBySessionIdAsync(string sessionId);
    Task<CartItem?> GetCartItemAsync(int cartId, int productId);
    Task<CartItem> AddCartItemAsync(CartItem cartItem);
    Task<CartItem> UpdateCartItemAsync(CartItem cartItem);
    Task DeleteCartItemAsync(int cartItemId);
    Task DeleteCartItemAsync(int cartId, int productId);
    Task ClearCartAsync(int cartId);
    Task<decimal> GetCartTotalAsync(int cartId);
    Task<int> GetCartItemCountAsync(int cartId);
}
