using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class ContactFormSubmissionService : IContactFormSubmissionService
{
    private readonly IContactFormSubmissionRepository _repository;
    private readonly IMapper _mapper;

    public ContactFormSubmissionService(IContactFormSubmissionRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ContactFormSubmissionResponse> CreateAsync(CreateContactFormSubmissionRequest request)
    {
        var submission = _mapper.Map<ContactFormSubmission>(request);
        submission.CreatedAt = DateTime.UtcNow;
        
        var createdSubmission = await _repository.AddAsync(submission);
        return _mapper.Map<ContactFormSubmissionResponse>(createdSubmission);
    }

    public async Task<IEnumerable<ContactFormSubmissionResponse>> GetAllAsync()
    {
        var submissions = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<ContactFormSubmissionResponse>>(submissions.OrderByDescending(s => s.CreatedAt));
    }

    public async Task<ContactFormSubmissionResponse?> GetByIdAsync(int id)
    {
        var submission = await _repository.GetByIdAsync(id);
        return submission != null ? _mapper.Map<ContactFormSubmissionResponse>(submission) : null;
    }

    public async Task<IEnumerable<ContactFormSubmissionResponse>> GetRecentSubmissionsAsync(int count = 10)
    {
        var submissions = await _repository.GetRecentSubmissionsAsync(count);
        return _mapper.Map<IEnumerable<ContactFormSubmissionResponse>>(submissions);
    }

    public async Task<IEnumerable<ContactFormSubmissionResponse>> GetSubmissionsByInquiryTypeAsync(int inquiryType)
    {
        var submissions = await _repository.GetSubmissionsByInquiryTypeAsync((InquiryType)inquiryType);
        return _mapper.Map<IEnumerable<ContactFormSubmissionResponse>>(submissions);
    }

    public async Task<IEnumerable<ContactFormSubmissionResponse>> GetSubmissionsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var submissions = await _repository.GetSubmissionsByDateRangeAsync(startDate, endDate);
        return _mapper.Map<IEnumerable<ContactFormSubmissionResponse>>(submissions);
    }
}
