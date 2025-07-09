/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseService, ServiceUtils } from '../../config/baseService';
import { ApiEndpoints } from '../../config/apiConfig';
import { ContactFormSubmission, CreateContactFormSubmissionRequest } from '../../types/entities';

export class ContactFormPostService extends BaseService {
  /**
   * Submit a new contact form
   */
  
  async create(data: CreateContactFormSubmissionRequest): Promise<ContactFormSubmission> {
    this.logApiCall('POST', '/api/contactform', data);
    
    // Validate required fields
    this.validateCreateRequest(data);
    
    return this.handleResponse(
      this.client.post<ContactFormSubmission>('/api/contactform', data)
    );
  }

  /**
   * Submit contact form with additional validation
   */
  async submit(formData: {
    name: string;
    email: string;
    phoneNumber: string;
    company?: string;
    state: string;
    inquiry: number;
    message: string;
  }): Promise<ContactFormSubmission> {
    const data: CreateContactFormSubmissionRequest = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim(),
      company: formData.company?.trim() || undefined,
      state: formData.state.trim(),
      inquiry: formData.inquiry,
      message: formData.message.trim()
    };

    return this.create(data);
  }

  /**
   * Validate create contact form request
   */
  private validateCreateRequest(data: CreateContactFormSubmissionRequest): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (data.name.length > 100) {
      throw new Error('Name must be 100 characters or less');
    }

    if (!data.email || !ServiceUtils.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    if (!data.phoneNumber || data.phoneNumber.trim().length === 0) {
      throw new Error('Phone number is required');
    }

    if (!this.isValidPhoneNumber(data.phoneNumber)) {
      throw new Error('Please enter a valid phone number');
    }

    if (data.company && data.company.length > 200) {
      throw new Error('Company name must be 200 characters or less');
    }

    if (!data.state || data.state.trim().length === 0) {
      throw new Error('State is required');
    }

    if (data.state.length > 100) {
      throw new Error('State must be 100 characters or less');
    }

    if (!data.inquiry || ![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(data.inquiry)) {
      throw new Error('Please select a valid inquiry type');
    }

    if (!data.message || data.message.trim().length === 0) {
      throw new Error('Message is required');
    }

    if (data.message.length < 10) {
      throw new Error('Message must be at least 10 characters long');
    }

    if (data.message.length > 2000) {
      throw new Error('Message must be 2000 characters or less');
    }
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
}

// Export singleton instance
export const contactFormPostService = new ContactFormPostService();
