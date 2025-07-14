using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IProductSpecificationsService : IBaseService<ProductSpecifications, ProductSpecificationsResponse, CreateProductSpecificationsRequest, UpdateProductSpecificationsRequest>
{
    Task<ProductSpecificationsResponse?> GetByProductIdAsync(int productId);
    Task<bool> ExistsByProductIdAsync(int productId);
}
