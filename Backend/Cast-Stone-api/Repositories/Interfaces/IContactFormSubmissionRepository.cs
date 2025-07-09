using Cast_Stone_api.Domain.Models;

namespace Cast_Stone_api.Repositories.Interfaces;

public interface IContactFormSubmissionRepository : IBaseRepository<ContactFormSubmission>
{
    Task<IEnumerable<ContactFormSubmission>> GetRecentSubmissionsAsync(int count = 10);
    Task<IEnumerable<ContactFormSubmission>> GetSubmissionsByInquiryTypeAsync(InquiryType inquiryType);
    Task<IEnumerable<ContactFormSubmission>> GetSubmissionsByDateRangeAsync(DateTime startDate, DateTime endDate);
}
