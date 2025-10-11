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
    private readonly IProductVariantRepository _productVariantRepository;
    private readonly IWholesaleBuyerService _wholesaleBuyerService;
    private readonly IMapper _mapper;

    public CartService(ICartRepository cartRepository, IProductRepository productRepository, IProductVariantRepository productVariantRepository, IWholesaleBuyerService wholesaleBuyerService, IMapper mapper)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _productVariantRepository = productVariantRepository;
        _wholesaleBuyerService = wholesaleBuyerService;
        _mapper = mapper;
    }

    public async Task<CartResponse?> GetCartByUserIdAsync(int userId)
    {
        var cart = await _cartRepository.GetCartWithItemsByUserIdAsync(userId);
        if (cart == null) return null;

        var response = _mapper.Map<CartResponse>(cart);
        response.TotalAmount = await CalculateCartTotalWithWholesalePricingAsync(cart.Id, userId);
        response.TotalItems = await _cartRepository.GetCartItemCountAsync(cart.Id);

        // Update ItemTotal for each cart item with wholesale pricing
        await UpdateCartItemTotalsWithWholesalePricing(response, userId);
        
        return response;
    }

    public async Task<CartResponse?> GetCartBySessionIdAsync(string sessionId)
    {
        var cart = await _cartRepository.GetCartWithItemsBySessionIdAsync(sessionId);
        if (cart == null) return null;

        var response = _mapper.Map<CartResponse>(cart);
        response.TotalAmount = await CalculateCartTotalWithWholesalePricingAsync(cart.Id, cart.UserId);
        response.TotalItems = await _cartRepository.GetCartItemCountAsync(cart.Id);

        // Update ItemTotal for each cart item with wholesale pricing
        await UpdateCartItemTotalsWithWholesalePricing(response, cart.UserId);

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
            TotalAmount = await CalculateCartTotalWithWholesalePricingAsync(cart.Id, userId),
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
            TotalAmount = await CalculateCartTotalWithWholesalePricingAsync(cart.Id, cart.UserId),
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

        // If variant is specified, validate it exists and belongs to the product
        if (request.ProductVariantId.HasValue)
        {
            var variant = await _productVariantRepository.GetByIdAsync(request.ProductVariantId.Value);
            if (variant == null)
                throw new ArgumentException("Product variant not found");

            if (variant.ProductId != request.ProductId)
                throw new ArgumentException("Product variant does not belong to the specified product");
        }

        // Get or create cart
        var cart = await GetOrCreateCartInternalAsync(request.UserId, request.SessionId);

        // Check if item already exists in cart (same product AND same variant)
        var existingCartItem = await _cartRepository.GetCartItemAsync(cart.Id, request.ProductId);

        // If variant is specified, check if the same variant exists
        if (existingCartItem != null && request.ProductVariantId.HasValue)
        {
            // Only update if the variant matches
            if (existingCartItem.ProductVariantId == request.ProductVariantId)
            {
                existingCartItem.Quantity += request.Quantity;
                existingCartItem.UpdatedAt = DateTime.UtcNow;
                await _cartRepository.UpdateCartItemAsync(existingCartItem);
            }
            else
            {
                // Different variant, add as new item
                existingCartItem = null;
            }
        }
        else if (existingCartItem != null && !request.ProductVariantId.HasValue && !existingCartItem.ProductVariantId.HasValue)
        {
            // Same product, no variant specified for both
            existingCartItem.Quantity += request.Quantity;
            existingCartItem.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.UpdateCartItemAsync(existingCartItem);
        }
        else
        {
            existingCartItem = null;
        }

        if (existingCartItem == null)
        {
            // Add new item
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                ProductVariantId = request.ProductVariantId,
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
        response.TotalAmount = await CalculateCartTotalWithWholesalePricingAsync(cart.Id, cart.UserId);
        response.TotalItems = await _cartRepository.GetCartItemCountAsync(cart.Id);

        // Update ItemTotal for each cart item with wholesale pricing
        await UpdateCartItemTotalsWithWholesalePricing(response, cart.UserId);

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

    private async Task<decimal> CalculateCartTotalWithWholesalePricingAsync(int cartId, int? userId)
    {
        var cart = await _cartRepository.GetCartWithItemsAsync(cartId);
        if (cart?.CartItems == null) return 0;

        // Check if user is an approved wholesale buyer
        bool isApprovedWholesaleBuyer = false;
        if (userId.HasValue && cart.User != null)
        {
            try
            {
                isApprovedWholesaleBuyer = await _wholesaleBuyerService.IsUserApprovedWholesaleBuyerAsync(cart.User.Email);
            }
            catch
            {
                // If there's an error checking wholesale status, default to regular pricing
                isApprovedWholesaleBuyer = false;
            }
        }

        decimal total = 0;
        foreach (var cartItem in cart.CartItems)
        {
            var product = cartItem.Product;
            var variant = cartItem.ProductVariant;

            if (product != null)
            {
                decimal price;

                // If variant is selected, use variant pricing with fallback to product pricing
                if (variant != null)
                {
                    if (isApprovedWholesaleBuyer && variant.VariantWholesalePrice.HasValue && variant.VariantWholesalePrice > 0)
                    {
                        price = variant.VariantWholesalePrice.Value;
                    }
                    else if (isApprovedWholesaleBuyer && product.WholeSalePrice.HasValue && product.WholeSalePrice > 0)
                    {
                        // Fallback to product wholesale price if variant doesn't have one
                        price = product.WholeSalePrice.Value;
                    }
                    else
                    {
                        price = variant.VariantPrice;
                    }
                }
                else
                {
                    // No variant selected, use product pricing
                    price = isApprovedWholesaleBuyer && product.WholeSalePrice.HasValue && product.WholeSalePrice > 0
                        ? product.WholeSalePrice.Value
                        : product.Price;
                }

                total += cartItem.Quantity * price;
            }
        }

        return total;
    }

    private async Task UpdateCartItemTotalsWithWholesalePricing(CartResponse cartResponse, int? userId)
    {
        if (cartResponse.CartItems == null || !cartResponse.CartItems.Any()) return;

        // Check if user is an approved wholesale buyer
        bool isApprovedWholesaleBuyer = false;
        if (userId.HasValue)
        {
            try
            {
                // Get user email from the first cart item's cart (we need to fetch it)
                var cart = await _cartRepository.GetCartWithItemsAsync(cartResponse.Id);
                if (cart?.User != null)
                {
                    isApprovedWholesaleBuyer = await _wholesaleBuyerService.IsUserApprovedWholesaleBuyerAsync(cart.User.Email);
                }
            }
            catch
            {
                // If there's an error checking wholesale status, default to regular pricing
                isApprovedWholesaleBuyer = false;
            }
        }

        // Update ItemTotal for each cart item
        foreach (var cartItem in cartResponse.CartItems)
        {
            if (cartItem.Product != null)
            {
                decimal price;

                // If variant is selected, use variant pricing with fallback to product pricing
                if (cartItem.ProductVariant != null)
                {
                    if (isApprovedWholesaleBuyer && cartItem.ProductVariant.VariantWholesalePrice.HasValue && cartItem.ProductVariant.VariantWholesalePrice > 0)
                    {
                        price = cartItem.ProductVariant.VariantWholesalePrice.Value;
                    }
                    else if (isApprovedWholesaleBuyer && cartItem.Product.WholeSalePrice > 0)
                    {
                        // Fallback to product wholesale price if variant doesn't have one
                        price = cartItem.Product.WholeSalePrice;
                    }
                    else
                    {
                        price = cartItem.ProductVariant.VariantPrice;
                    }
                }
                else
                {
                    // No variant selected, use product pricing
                    price = isApprovedWholesaleBuyer && cartItem.Product.WholeSalePrice > 0
                        ? cartItem.Product.WholeSalePrice
                        : cartItem.Product.Price;
                }

                cartItem.ItemTotal = cartItem.Quantity * price;
            }
        }
    }
}
