'use client';

import React, { useState } from 'react';
import styles from './contact.module.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      projectType: '',
      message: ''
    });

    setIsSubmitting(false);
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <p className={styles.heroSubtitle}>
            Ready to transform your space with our exquisite cast stone creations? Let's bring your vision to life.
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
                  Tell us about your vision and we'll help you make it reality.
                </p>

                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName" className={styles.label}>First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="lastName" className={styles.label}>Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.label}>Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone" className={styles.label}>Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="projectType" className={styles.label}>Project Type</label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select a project type</option>
                      <option value="fireplace">Fireplace & Mantel</option>
                      <option value="architectural">Architectural Elements</option>
                      <option value="decorative">Decorative Pieces</option>
                      <option value="custom">Custom Design</option>
                      <option value="restoration">Restoration Project</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Project Details</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={styles.textarea}
                      rows={5}
                      placeholder="Tell us about your project, timeline, and any specific requirements..."
                      required
                    />
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
                  We're here to help bring your vision to life.
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
