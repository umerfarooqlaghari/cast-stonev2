using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Services.Interfaces;

public interface IContactFormSubmissionService
{
    Task<ContactFormSubmissionResponse> CreateAsync(CreateContactFormSubmissionRequest request);
    Task<IEnumerable<ContactFormSubmissionResponse>> GetAllAsync();
    Task<ContactFormSubmissionResponse?> GetByIdAsync(int id);
    Task<IEnumerable<ContactFormSubmissionResponse>> GetRecentSubmissionsAsync(int count = 10);
    Task<IEnumerable<ContactFormSubmissionResponse>> GetSubmissionsByInquiryTypeAsync(int inquiryType);
    Task<IEnumerable<ContactFormSubmissionResponse>> GetSubmissionsByDateRangeAsync(DateTime startDate, DateTime endDate);
}
