'use client';

import React, { useState } from 'react';
import styles from './contact.module.css';
import { contactFormPostService } from '@/services/api/contactForm/post';
import { InquiryType } from '@/services/types/entities';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  company: string;
  state: string;
  inquiry: InquiryType | '';
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    company: '',
    state: '',
    inquiry: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const inquiryOptions = [
    { value: InquiryType.ProductInquiry, label: 'Product Inquiry' },
    { value: InquiryType.RequestDesignConsultation, label: 'Request a Design Consultation' },
    { value: InquiryType.CustomOrders, label: 'Custom Orders' },
    { value: InquiryType.TradePartnerships, label: 'Trade Partnerships' },
    { value: InquiryType.InstallationSupport, label: 'Installation Support' },
    { value: InquiryType.ShippingAndLeadTimes, label: 'Shipping & Lead Times' },
    { value: InquiryType.RequestCatalogPriceList, label: 'Request a Catalog / Price List' },
    { value: InquiryType.MediaPressInquiry, label: 'Media / Press Inquiry' },
    { value: InquiryType.GeneralQuestions, label: 'General Questions' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'inquiry' ? (value === '' ? '' : parseInt(value) as InquiryType) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      if (formData.inquiry === '') {
        throw new Error('Please select an inquiry type');
      }

      await contactFormPostService.submit({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        company: formData.company || undefined,
        state: formData.state,
        inquiry: formData.inquiry,
        message: formData.message
      });

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        company: '',
        state: '',
        inquiry: '',
        message: ''
      });

      setSubmitMessage({
        type: 'success',
        text: 'Thank you for your message! We will get back to you soon.'
      });

    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <p className={styles.heroSubtitle}>
            Ready to transform your space with our exquisite cast stone creations? Let&apos;s bring your vision to life.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>

            {/* Contact Form */}
            <div className={styles.formSection}>
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Start Your Project</h2>
                <p className={styles.formSubtitle}>
                  Tell us about your vision and we&apos;ll help you make it reality.
                </p>

                {submitMessage && (
                  <div className={`${styles.submitMessage} ${styles[submitMessage.type]}`}>
                    {submitMessage.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.label}>Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phoneNumber" className={styles.label}>Phone Number *</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="company" className={styles.label}>Company (if applicable)</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Your company name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="state" className={styles.label}>State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                        placeholder="e.g., California, New York"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="inquiry" className={styles.label}>Inquiry *</label>
                    <select
                      id="inquiry"
                      name="inquiry"
                      value={formData.inquiry}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select an inquiry type</option>
                      {inquiryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={styles.textarea}
                      rows={5}
                      placeholder="Tell us about your project, timeline, and any specific requirements..."
                      required
                      minLength={10}
                      maxLength={2000}
                    />
                    <div className={styles.charCount}>
                      {formData.message.length}/2000 characters
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Get In Touch</h2>
                <p className={styles.infoSubtitle}>
                  We&apos;re here to help bring your vision to life.
                </p>

                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <div className={styles.contactIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className={styles.contactDetails}>
                      <h3 className={styles.contactLabel}>Call Us</h3>
                      <p className={styles.contactValue}>(555) 123-4567</p>
                      <p className={styles.contactNote}>Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className={styles.contactItem}>
                    <div className={styles.contactIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div className={styles.contactDetails}>
                      <h3 className={styles.contactLabel}>Email Us</h3>
                      <p className={styles.contactValue}>info@caststone.com</p>
                      <p className={styles.contactNote}>We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className={styles.contactItem}>
                    <div className={styles.contactIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div className={styles.contactDetails}>
                      <h3 className={styles.contactLabel}>Visit Us</h3>
                      <p className={styles.contactValue}>123 Artisan Way</p>
                      <p className={styles.contactValue}>Craftsman District, NY 10001</p>
                    </div>
                  </div>
                </div>

                <div className={styles.businessHours}>
                  <h3 className={styles.hoursTitle}>Business Hours</h3>
                  <div className={styles.hoursGrid}>
                    <div className={styles.hoursItem}>
                      <span className={styles.hoursDay}>Monday - Friday</span>
                      <span className={styles.hoursTime}>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className={styles.hoursItem}>
                      <span className={styles.hoursDay}>Saturday</span>
                      <span className={styles.hoursTime}>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className={styles.hoursItem}>
                      <span className={styles.hoursDay}>Sunday</span>
                      <span className={styles.hoursTime}>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
