using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IProductDetailsService : IBaseService<ProductDetails, ProductDetailsResponse, CreateProductDetailsRequest, UpdateProductDetailsRequest>
{
    Task<ProductDetailsResponse?> GetByProductIdAsync(int productId);
    Task<bool> ExistsByProductIdAsync(int productId);
}
