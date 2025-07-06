using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public CartService(ICartRepository cartRepository, IProductRepository productRepository, IMapper mapper)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<CartResponse?> GetCartByUserIdAsync(int userId)
    {
        var cart = await _cartRepository.GetCartWithItemsByUserIdAsync(userId);
        if (cart == null) return null;

        var response = _mapper.Map<CartResponse>(cart);
        response.TotalAmount = await _cartRepository.GetCartTotalAsync(cart.Id);
        response.TotalItems = await _cartRepository.GetCartItemCountAsync(cart.Id);
        
        return response;
    }

    public async Task<CartResponse?> GetCartBySessionIdAsync(string sessionId)
    {
        var cart = await _cartRepository.GetCartWithItemsBySessionIdAsync(sessionId);
        if (cart == null) return null;

        var response = _mapper.Map<CartResponse>(cart);
        response.TotalAmount = await _cartRepository.GetCartTotalAsync(cart.Id);
        response.TotalItems = await _cartRepository.GetCartItemCountAsync(cart.Id);
        
        return response;
    }

    public async Task<CartSummaryResponse?> GetCartSummaryByUserIdAsync(int userId)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart == null) return null;

        return new CartSummaryResponse
        {
            Id = cart.Id,
            TotalItems = await _cartRepository.GetCartItemCountAsync(cart.Id),
            TotalAmount = await _cartRepository.GetCartTotalAsync(cart.Id),
            UpdatedAt = cart.UpdatedAt
        };
    }

    public async Task<CartSummaryResponse?> GetCartSummaryBySessionIdAsync(string sessionId)
    {
        var cart = await _cartRepository.GetBySessionIdAsync(sessionId);
        if (cart == null) return null;

        return new CartSummaryResponse
        {
            Id = cart.Id,
            TotalItems = await _cartRepository.GetCartItemCountAsync(cart.Id),
            TotalAmount = await _cartRepository.GetCartTotalAsync(cart.Id),
            UpdatedAt = cart.UpdatedAt
        };
    }

    public async Task<CartResponse> AddToCartAsync(AddToCartRequest request)
    {
        // Validate product exists and is in stock
        var product = await _productRepository.GetByIdAsync(request.ProductId);
        if (product == null)
            throw new ArgumentException("Product not found");

        if (product.Stock < request.Quantity)
            throw new ArgumentException("Insufficient stock");

        // Get or create cart
        var cart = await GetOrCreateCartInternalAsync(request.UserId, request.SessionId);

        // Check if item already exists in cart
        var existingCartItem = await _cartRepository.GetCartItemAsync(cart.Id, request.ProductId);
        
        if (existingCartItem != null)
        {
            // Update quantity
            existingCartItem.Quantity += request.Quantity;
            existingCartItem.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.UpdateCartItemAsync(existingCartItem);
        }
        else
        {
            // Add new item
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _cartRepository.AddCartItemAsync(cartItem);
        }

        // Update cart timestamp
        cart.UpdatedAt = DateTime.UtcNow;
        await _cartRepository.UpdateAsync(cart);

        // Return updated cart
        return await GetCartByIdAsync(cart.Id) ?? throw new Exception("Failed to retrieve updated cart");
    }

    private async Task<CartResponse> GetCartByIdAsync(int cartId)
    {
        var cart = await _cartRepository.GetCartWithItemsAsync(cartId);
        if (cart == null) throw new ArgumentException("Cart not found");

        var response = _mapper.Map<CartResponse>(cart);
        response.TotalAmount = await _cartRepository.GetCartTotalAsync(cart.Id);
        response.TotalItems = await _cartRepository.GetCartItemCountAsync(cart.Id);
        
        return response;
    }

    public async Task<CartResponse?> UpdateCartItemAsync(int cartId, int productId, UpdateCartItemRequest request)
    {
        var cartItem = await _cartRepository.GetCartItemAsync(cartId, productId);
        if (cartItem == null) return null;

        // Validate stock
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null || product.Stock < request.Quantity)
            throw new ArgumentException("Insufficient stock");

        cartItem.Quantity = request.Quantity;
        cartItem.UpdatedAt = DateTime.UtcNow;
        await _cartRepository.UpdateCartItemAsync(cartItem);

        return await GetCartByIdAsync(cartId);
    }

    public async Task<bool> RemoveFromCartAsync(int cartId, int productId)
    {
        await _cartRepository.DeleteCartItemAsync(cartId, productId);
        return true;
    }

    public async Task<bool> RemoveCartItemAsync(int cartItemId)
    {
        await _cartRepository.DeleteCartItemAsync(cartItemId);
        return true;
    }

    public async Task<bool> ClearCartAsync(int cartId)
    {
        await _cartRepository.ClearCartAsync(cartId);
        return true;
    }

    public async Task<bool> ClearCartByUserIdAsync(int userId)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart == null) return false;

        await _cartRepository.ClearCartAsync(cart.Id);
        return true;
    }

    public async Task<bool> ClearCartBySessionIdAsync(string sessionId)
    {
        var cart = await _cartRepository.GetBySessionIdAsync(sessionId);
        if (cart == null) return false;

        await _cartRepository.ClearCartAsync(cart.Id);
        return true;
    }

    public async Task<CartResponse?> GetOrCreateCartAsync(int? userId, string? sessionId)
    {
        var cart = await GetOrCreateCartInternalAsync(userId, sessionId);
        return await GetCartByIdAsync(cart.Id);
    }

    private async Task<Cart> GetOrCreateCartInternalAsync(int? userId, string? sessionId)
    {
        Cart? cart = null;

        if (userId.HasValue)
        {
            cart = await _cartRepository.GetByUserIdAsync(userId.Value);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            cart = await _cartRepository.GetBySessionIdAsync(sessionId);
        }

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                SessionId = sessionId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            cart = await _cartRepository.AddAsync(cart);
        }

        return cart;
    }
}
