// Email Services
export { EmailPostService, emailPostService } from './post';
export type { 
  EmailRequest, 
  ContactFormAutoReplyRequest, 
  OrderConfirmationRequest, 
  OrderItemDetail, 
  EmailResponse 
} from './post';

// Combined Email Service
import { emailPostService } from './post';

export class EmailService {
  post = emailPostService;
}

// Export singleton instance
export const emailService = new EmailService();
