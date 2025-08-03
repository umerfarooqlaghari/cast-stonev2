/* eslint-disable @next/next/no-img-element */
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
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.welcomeCard}>

            {/* Left Side - Welcome Section */}
            <div className={styles.leftSection}>
              <div className={styles.welcomeContent}>
                <h1 className={styles.welcomeTitle}>Welcome!</h1>
                <p className={styles.welcomeSubtitle}>First things first...</p>
                <p className={styles.disclaimerText}>
                    Your information is secure and will never be shared with anyone. View our Privacy Policy
                  </p>
                <p className={styles.disclaimerText}>
                    By submitting your information, you acknowledge that you may be sent marketing material and
                    newsletters.
                  </p>
              </div>

              {/* Illustration */}
              <div className={styles.illustrationContainer}>
                <img
                  src="images/contactus.jpg"
                  alt="Welcome illustration"
                  className={styles.illustration}
                />
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className={styles.rightSection}>
              {/* Profile Picture */}
              <div className={styles.profileSection}>
                <div className={styles.profilePicture}>
                  <img
                    src="images/avatar.jpg"
                    alt="Profile"
                    className={styles.profileImage}
                  />
                </div>
              </div>

              <h2 className={styles.formTitle}>Contact Us</h2>
              <p className={styles.requiredField}>*Required Field</p>

              {submitMessage && (
                <div className={`${styles.submitMessage} ${styles[submitMessage.type]}`}>
                  {submitMessage.text}
                </div>
              )}
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formRow}>
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
                    placeholder="Timothy"
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
                    placeholder="Timothy@gmail.com"
                  />
                </div>
                </div>
<div className={styles.formRow}>
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
</div>
<div className={styles.formRow}>
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
    </div>
  );
};

export default ContactPage;
