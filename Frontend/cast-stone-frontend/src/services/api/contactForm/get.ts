/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { ContactFormSubmission, InquiryType } from '../../types/entities';

export class ContactFormGetService extends BaseService {
  /**
   * Get all contact form submissions (Admin only)
   */
  async getAll(): Promise<ContactFormSubmission[]> {
    this.logApiCall('GET', '/contactform');
    
    return this.handleResponse(
      this.client.get<ContactFormSubmission[]>('/contactform')
    );
  }

  /**
   * Get contact form submission by ID
   */
  async getById(id: number): Promise<ContactFormSubmission> {
    this.logApiCall('GET', `/contactform/${id}`);
    
    if (!id || id <= 0) {
      throw new Error('Valid submission ID is required');
    }
    
    return this.handleResponse(
      this.client.get<ContactFormSubmission>(`/contactform/${id}`)
    );
  }

  /**
   * Get recent contact form submissions
   */
  async getRecent(count: number = 10): Promise<ContactFormSubmission[]> {
    this.logApiCall('GET', `/contactform/recent?count=${count}`);
    
    if (count <= 0 || count > 100) {
      throw new Error('Count must be between 1 and 100');
    }
    
    return this.handleResponse(
      this.client.get<ContactFormSubmission[]>(`/contactform/recent?count=${count}`)
    );
  }

  /**
   * Get contact form submissions by inquiry type
   */
  async getByInquiryType(inquiryType: InquiryType): Promise<ContactFormSubmission[]> {
    this.logApiCall('GET', `/contactform/inquiry/${inquiryType}`);
    
    return this.handleResponse(
      this.client.get<ContactFormSubmission[]>(`/contactform/inquiry/${inquiryType}`)
    );
  }

  /**
   * Get contact form submissions by date range
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<ContactFormSubmission[]> {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    
    this.logApiCall('GET', `/contactform/date-range?startDate=${start}&endDate=${end}`);
    
    if (startDate > endDate) {
      throw new Error('Start date must be before end date');
    }
    
    return this.handleResponse(
      this.client.get<ContactFormSubmission[]>(`/contactform/date-range?startDate=${start}&endDate=${end}`)
    );
  }

  /**
   * Get contact form submissions with pagination
   */
  async getPaginated(page: number = 1, pageSize: number = 20): Promise<{
    submissions: ContactFormSubmission[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    this.logApiCall('GET', `/contactform?page=${page}&pageSize=${pageSize}`);
    
    if (page <= 0) {
      throw new Error('Page must be greater than 0');
    }
    
    if (pageSize <= 0 || pageSize > 100) {
      throw new Error('Page size must be between 1 and 100');
    }
    
    // For now, we'll simulate pagination by getting all and slicing
    // In a real implementation, the backend would handle pagination
    const allSubmissions = await this.getAll();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const submissions = allSubmissions.slice(startIndex, endIndex);
    
    return {
      submissions,
      totalCount: allSubmissions.length,
      currentPage: page,
      totalPages: Math.ceil(allSubmissions.length / pageSize)
    };
  }

  /**
   * Search contact form submissions
   */
  async search(query: string): Promise<ContactFormSubmission[]> {
    this.logApiCall('GET', `/contactform/search?q=${encodeURIComponent(query)}`);
    
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }
    
    // For now, we'll simulate search by filtering all submissions
    // In a real implementation, the backend would handle search
    const allSubmissions = await this.getAll();
    const lowerQuery = query.toLowerCase();
    
    return allSubmissions.filter(submission => 
      submission.name.toLowerCase().includes(lowerQuery) ||
      submission.email.toLowerCase().includes(lowerQuery) ||
      submission.company?.toLowerCase().includes(lowerQuery) ||
      submission.message.toLowerCase().includes(lowerQuery) ||
      submission.inquiryDisplayName.toLowerCase().includes(lowerQuery)
    );
  }
}

// Export singleton instance
export const contactFormGetService = new ContactFormGetService();
