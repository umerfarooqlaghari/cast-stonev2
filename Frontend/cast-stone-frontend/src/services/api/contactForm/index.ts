// Contact Form API Services
export { contactFormGetService } from './get';
export { contactFormPostService } from './post';

// Combined service object for easier imports
export const contactFormService = {
  get: () => import('./get').then(m => m.contactFormGetService),
  post: () => import('./post').then(m => m.contactFormPostService),
};
