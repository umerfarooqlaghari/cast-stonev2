namespace Cast_Stone_api.Services.Interfaces;

public interface IBaseService<TEntity, TResponse, TCreateRequest, TUpdateRequest> 
    where TEntity : class
    where TResponse : class
    where TCreateRequest : class
    where TUpdateRequest : class
{
    Task<TResponse?> GetByIdAsync(int id);
    Task<IEnumerable<TResponse>> GetAllAsync();
    Task<TResponse> CreateAsync(TCreateRequest request);
    Task<TResponse?> UpdateAsync(int id, TUpdateRequest request);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
