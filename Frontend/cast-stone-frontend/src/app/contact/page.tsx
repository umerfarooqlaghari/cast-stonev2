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

  const stateOptions = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
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
      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>

            {/* Left Side - Company Info */}
            <div className={styles.infoSection}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  Get in touch with our cast stone specialists, design consultants, senior craftsmen,
                  market research team, and more!
                </h1>
              </div>

              {/* Contact Info Cards */}
              <div className={styles.contactCards}>
                <div className={styles.contactCard}>
                  <div className={styles.cardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.cardTitle}>1024 Broad Street</p>
                    <p className={styles.cardSubtitle}>Guilford CT 06437 USA</p>
                  </div>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.cardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.cardTitle}>+1 203.453.0800</p>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div className={styles.companyDescription}>
                <p className={styles.descriptionText}>
                  At Cast Stone, we always look forward to hearing from our clients, potential
                  clients and business aviation industry colleagues.
                </p>
                <p className={styles.descriptionText}>
                  If you have a question or comment, please use the form to the right, or the
                  contact details listed above.
                </p>
                <p className={styles.descriptionText}>
                  Since our founding in 2002, we&apos;ve worked with some of the most
                  sophisticated business and aviation leaders around the globe to help them
                  acquire or sell their cast stone. We&apos;ve grown from a reputable cast stone
                  brokerage firm into a powerhouse business aviation consulting firm, helping
                  Fortune 500 clients and high-net-worth individuals manage their cast stone
                  assets in a portfolio.
                </p>
                <p className={styles.descriptionText}>
                  We look forward to hearing from you, and helping with your cast stone needs
                  related to finance, valuation, appraisals, capital budgeting and transactions.
                </p>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className={styles.formSection}>
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Contact Us</h2>
                <p className={styles.requiredField}>*Required Field</p>

                {submitMessage && (
                  <div className={`${styles.submitMessage} ${styles[submitMessage.type]}`}>
                    {submitMessage.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>*Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>*Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber" className={styles.label}>*Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="company" className={styles.label}>Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder=""
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="state" className={styles.label}>United States</label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      <option value="">State...</option>
                      {stateOptions.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="inquiry" className={styles.label}>I&apos;d Like To...</label>
                    <select
                      id="inquiry"
                      name="inquiry"
                      value={formData.inquiry}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select...</option>
                      {inquiryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={styles.textarea}
                      rows={4}
                      placeholder="Type your message here..."
                      required
                      minLength={10}
                      maxLength={2000}
                    />
                  </div>

                  <div className={styles.disclaimer}>
                    <p className={styles.disclaimerText}>
                      By submitting your information, you acknowledge that you may be sent marketing material and
                      newsletters.
                    </p>
                    <p className={styles.disclaimerText}>
                      Your information is secure and will never be shared with anyone. View our Privacy Policy
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
                  >
                    {isSubmitting ? 'CONNECTING...' : 'LET\'S CONNECT'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
