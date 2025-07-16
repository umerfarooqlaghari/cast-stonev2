using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IEmailService _emailService;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        IUserRepository userRepository,
        IMapper mapper,
        IEmailService emailService,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
        _mapper = mapper;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<OrderResponse?> GetByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        return order != null ? _mapper.Map<OrderResponse>(order) : null;
    }

    public async Task<IEnumerable<OrderSummaryResponse>> GetAllAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<OrderSummaryResponse>>(orders);
    }

    public async Task<OrderResponse> CreateAsync(CreateOrderRequest request)
    {
        // Validate user if provided
        if (request.UserId.HasValue)
        {
            if (!await _userRepository.ExistsAsync(request.UserId.Value))
            {
                throw new ArgumentException("User does not exist");
            }
        }

        // Validate products and calculate total
        decimal totalAmount = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in request.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product == null)
            {
                throw new ArgumentException($"Product with ID {item.ProductId} does not exist");
            }

            if (product.Stock < item.Quantity)
            {
                throw new ArgumentException($"Insufficient stock for product {product.Name}");
            }

            var orderItem = new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                PriceAtPurchaseTime = product.Price
            };

            orderItems.Add(orderItem);
            totalAmount += product.Price * item.Quantity;
        }

        // Create order
        var order = _mapper.Map<Order>(request);
        order.TotalAmount = totalAmount;
        order.StatusId = 1; // Pending status
        order.CreatedAt = DateTime.UtcNow;

        var createdOrder = await _orderRepository.AddAsync(order);

        // Add order items
        foreach (var item in orderItems)
        {
            item.OrderId = createdOrder.Id;
        }

        // Reserve stock
        foreach (var item in request.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product != null)
            {
                await _productRepository.UpdateStockAsync(item.ProductId, product.Stock - item.Quantity);
            }
        }

        var orderResponse = _mapper.Map<OrderResponse>(createdOrder);

        // Send order confirmation email to customer
        try
        {
            // Get product details for email
            var orderItemDetails = new List<OrderItemDetail>();
            foreach (var item in orderItems)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product != null)
                {
                    orderItemDetails.Add(new OrderItemDetail
                    {
                        ProductName = product.Name,
                        Quantity = item.Quantity,
                        Price = item.PriceAtPurchaseTime,
                        Total = item.PriceAtPurchaseTime * item.Quantity,
                        ProductDescription = product.Description
                    });
                }
            }

            var shippingAddress = $"{order.Country}, {order.City}";
            if (!string.IsNullOrEmpty(order.ZipCode))
                shippingAddress += $", {order.ZipCode}";

            await _emailService.SendOrderConfirmationToCustomerAsync(
                order.Email,
                order.Email, // Using email as name since we don't have customer name in order
                createdOrder.Id,
                totalAmount,
                orderItemDetails,
                order.PaymentMethod ?? "Unknown",
                shippingAddress
            );

            _logger.LogInformation("Order confirmation email sent successfully to {Email} for order {OrderId}",
                order.Email, createdOrder.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send order confirmation email to {Email} for order {OrderId}",
                order.Email, createdOrder.Id);
            // Don't fail the entire operation if email fails
        }

        return orderResponse;
    }

    public async Task<bool> UpdateStatusAsync(int id, UpdateOrderStatusRequest request)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
            return false;

        order.StatusId = request.StatusId;
        await _orderRepository.UpdateAsync(order);
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
            return false;

        await _orderRepository.DeleteAsync(id);
        return true;
    }

    public async Task<IEnumerable<OrderResponse>> GetByUserIdAsync(int userId)
    {
        var orders = await _orderRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<OrderResponse>>(orders);
    }

    public async Task<IEnumerable<OrderResponse>> GetByStatusIdAsync(int statusId)
    {
        var orders = await _orderRepository.GetByStatusIdAsync(statusId);
        return _mapper.Map<IEnumerable<OrderResponse>>(orders);
    }

    public async Task<IEnumerable<OrderResponse>> GetByEmailAsync(string email)
    {
        var orders = await _orderRepository.GetByEmailAsync(email);
        return _mapper.Map<IEnumerable<OrderResponse>>(orders);
    }

    public async Task<IEnumerable<OrderSummaryResponse>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var orders = await _orderRepository.GetByDateRangeAsync(startDate, endDate);
        return _mapper.Map<IEnumerable<OrderSummaryResponse>>(orders);
    }

    public async Task<OrderResponse?> GetWithDetailsAsync(int id)
    {
        var order = await _orderRepository.GetWithDetailsAsync(id);
        return order != null ? _mapper.Map<OrderResponse>(order) : null;
    }

    public async Task<IEnumerable<OrderSummaryResponse>> GetRecentOrdersAsync(int count = 10)
    {
        var orders = await _orderRepository.GetRecentOrdersAsync(count);
        return _mapper.Map<IEnumerable<OrderSummaryResponse>>(orders);
    }

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _orderRepository.GetTotalRevenueAsync();
    }

    public async Task<decimal> GetTotalRevenueByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _orderRepository.GetTotalRevenueByDateRangeAsync(startDate, endDate);
    }

    public async Task<int> GetOrderCountByStatusAsync(int statusId)
    {
        return await _orderRepository.GetOrderCountByStatusAsync(statusId);
    }

    public async Task<IEnumerable<OrderResponse>> GetPendingOrdersAsync()
    {
        var orders = await _orderRepository.GetPendingOrdersAsync();
        return _mapper.Map<IEnumerable<OrderResponse>>(orders);
    }

    public async Task<bool> CancelOrderAsync(int id)
    {
        var order = await _orderRepository.GetWithDetailsAsync(id);
        if (order == null || order.StatusId != 1) // Can only cancel pending orders
            return false;

        // Release reserved stock
        foreach (var item in order.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product != null)
            {
                await _productRepository.UpdateStockAsync(item.ProductId, product.Stock + item.Quantity);
            }
        }

        // Update status to cancelled (assuming status ID 4 is cancelled)
        order.StatusId = 4;
        await _orderRepository.UpdateAsync(order);
        return true;
    }

    public async Task<PaginatedResponse<OrderResponse>> GetFilteredAsync(OrderFilterRequest filter)
    {
        var (orders, totalCount) = await _orderRepository.GetFilteredAsync(filter);
        var orderResponses = _mapper.Map<IEnumerable<OrderResponse>>(orders);

        var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

        return new PaginatedResponse<OrderResponse>
        {
            Data = orderResponses,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalRecords = totalCount,
            TotalPages = totalPages,
            HasNextPage = filter.PageNumber < totalPages,
            HasPreviousPage = filter.PageNumber > 1
        };
    }

    public async Task<EmailNotificationResponse> SendOrderConfirmationEmailAsync(int orderId, PaymentConfirmationResponse payment)
    {
        try
        {
            var order = await GetWithDetailsAsync(orderId);
            if (order == null)
            {
                return new EmailNotificationResponse
                {
                    Success = false,
                    Message = "Order not found",
                    SentAt = DateTime.UtcNow
                };
            }

            return await _emailService.SendOrderConfirmationToAdminAsync(order, payment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending order confirmation email for order {OrderId}", orderId);
            return new EmailNotificationResponse
            {
                Success = false,
                Message = $"Failed to send order confirmation email: {ex.Message}",
                SentAt = DateTime.UtcNow
            };
        }
    }
}
