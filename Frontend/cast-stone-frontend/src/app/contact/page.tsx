/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import styles from './contact.module.css';

// Import WOW.js and Animate.css
import 'animate.css';
// declare global {
//   interface Window {
//     WOW: any;
//   }
// }
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

  // Initialize WOW.js
  useEffect(() => {
    const loadWOW = async () => {
      if (typeof window !== 'undefined') {
        // Dynamically import WOW.js
        const WOW = (await import('wow.js')).default;
        const wow = new WOW({
          boxClass: 'wow',
          animateClass: 'animate__animated',
          offset: 0,
          mobile: true,
          live: true,
          scrollContainer: null,
        });
        wow.init();
      }
    };

    loadWOW();
  }, []);

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
      <div className={styles.contactContainer}>

        {/* Left Side - Contact Information */}
        <div className={styles.leftSection}>
   <div className={styles.CSection}>

          {/* Animated "Get in touch with us" text */}
          <div className={styles.animatedTextContainer}>
            <h2 className={styles.animatedText}>
              <span className={styles.word} data-delay="0">Get</span>
              <span className={styles.word} data-delay="200">in</span>
              <span className={styles.word} data-delay="400">touch</span>
              <span className={styles.word} data-delay="600">with</span>
              <span className={styles.word} data-delay="800">us</span>
            </h2>
          </div>
      <div className={styles.CBlock}>
        <h4 className={styles.CHeader} data-delay="0">PROJECT INQUIRIES</h4>
        <p className={styles.CInfo} data-delay="100">Sales@CastStoneInternational.com</p>
        <hr className={styles.separator} />
      </div>

      <div className={styles.CBlock}>
        <h4 className={styles.CHeader} data-delay="200">PHONE</h4>
        <p className={styles.CInfo} data-delay="300">+1 (561) 625-0333</p>
        <hr className={styles.separator} />
      </div>

      <div className={styles.CBlock}>
        <h4 className={styles.CHeader} data-delay="400">LOCATION</h4>
        <p className={styles.CInfo} data-delay="500">Cast Stone International, Inc</p>
        <p className={styles.CInfo} data-delay="600">11555 US Highway 1</p>
        <p className={styles.CInfo} data-delay="700">North Palm Beach, FL 33408</p>
        <hr className={styles.separator} />
      </div>

      <div className={styles.animatedTextContainer}>
            <h2 className={styles.animatedText}>
              <span className={styles.word} data-delay="200">Place</span>
              <span className={styles.word} data-delay="400">Your</span>
              <span className={styles.word} data-delay="600">Query</span>
            </h2>
          </div>
    
          {/* Contact Form in Left Panel */}
          <div className={styles.leftFormContainer}>
            <div className={`${styles.formHeader} wow animate__fadeInUp`} data-wow-delay="0.1s">
             
            </div>

            {submitMessage && (
              <div className={`${styles.submitMessage} ${styles[submitMessage.type]} wow animate__fadeInUp`} data-wow-delay="0.2s">
                {submitMessage.text}
              </div>
            )}

                

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.leftFormGrid}>


                <div className={`${styles.formGroup} wow animate__fadeInUp`} data-wow-delay="0.3s">
                  <label htmlFor="name" className={styles.DHeader}>Name *</label>
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

                <div className={`${styles.formGroup} wow animate__fadeInUp`} data-wow-delay="0.4s">
                  <label htmlFor="email" className={styles.DHeader}>Email *</label>
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

                <div className={`${styles.formGroup} wow animate__fadeInUp`} data-wow-delay="0.5s">
                  <label htmlFor="phoneNumber" className={styles.DHeader}>Phone *</label>
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

                <div className={`${styles.formGroup} wow animate__fadeInUp`} data-wow-delay="0.6s">
                  <label htmlFor="company" className={styles.DHeader}>Company</label>
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

                <div className={`${styles.formGroup} wow animate__fadeInUp`} data-wow-delay="0.7s">
                  <label htmlFor="state" className={styles.DHeader}>State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value=""></option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`${styles.formGroup} wow animate__fadeInUp`} data-wow-delay="0.8s">
                  <label htmlFor="inquiry" className={styles.DHeader}>Nature of Enquiry *</label>
                  <select
                    id="inquiry"
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value=""></option>
                    {inquiryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`${styles.formGroupFull} wow animate__fadeInUp`} data-wow-delay="0.9s">
                  <label htmlFor="message" className={styles.DHeader}>Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={3}
                    placeholder=""
                    required
                    minLength={10}
                    maxLength={2000}
                  />
                </div>

                <div className={`${styles.formGroupFull} wow animate__fadeInUp`} data-wow-delay="1.0s">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>

              </div>
            </form>
          </div>
</div>
        </div>

        {/* Right Side - Image */}
        <div className={styles.rightSection}>
          <div className={styles.imageContainer}>
            <img
              src="/ContactUs.jpg"
              alt="Cast Stone Interior Design"
              className={styles.contactImage}
            />
          </div>
        </div>

      </div>



    </div>
  );
};

export default ContactPage;
