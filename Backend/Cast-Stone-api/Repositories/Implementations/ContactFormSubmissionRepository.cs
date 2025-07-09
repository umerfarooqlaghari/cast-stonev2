using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cast_Stone_api.Repositories.Implementations;

public class ContactFormSubmissionRepository : BaseRepository<ContactFormSubmission>, IContactFormSubmissionRepository
{
    public ContactFormSubmissionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ContactFormSubmission>> GetRecentSubmissionsAsync(int count = 10)
    {
        return await _dbSet
            .OrderByDescending(c => c.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<ContactFormSubmission>> GetSubmissionsByInquiryTypeAsync(InquiryType inquiryType)
    {
        return await _dbSet
            .Where(c => c.Inquiry == inquiryType)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<ContactFormSubmission>> GetSubmissionsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(c => c.CreatedAt >= startDate && c.CreatedAt <= endDate)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }
}
