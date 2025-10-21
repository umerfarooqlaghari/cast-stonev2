'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './newsletterSection.module.css';

interface NewsletterFormData {
  fullName: string;
  email: string;
}

const NewsletterSection: React.FC = () => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    fullName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('https://cast-stonev2.onrender.com/api/mailinglist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message || 'Successfully subscribed!' });
        setFormData({ fullName: '', email: '' });
      } else {
        setSubmitMessage({ type: 'error', text: result.message || 'Subscription failed. Please try again.' });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.newsletterSection}>
      {/* Top Banner Section */}
      <div className={styles.bannerSection}>
        <h2 className={styles.bannerTitle}>Speak to our team</h2>
        <p className={styles.bannerSubtitle}>
          Whether you are choosing a beautiful planter for your garden, or embarking on a major property<br />
          renovation, our friendly team is always available to offer tailored advice.
        </p>
        <Link href="/contact" className={styles.bannerButton}>
          Request a call back →
        </Link>
      </div>

      {/* Bottom White Section */}
      <div className={styles.whiteSection}>
        <div className={styles.container}>
          {/* Left Side - Contact Information */}
          <div className={styles.leftSection}>
            <div className={styles.contactBlock}>
              <div className={styles.contactColumn}>
                <h3 className={styles.sectionHeading}>ABOUT</h3>
                <ul className={styles.linkList}>
                  <li><Link href="/about">About us</Link></li>
                  <li><Link href="/about">Our story</Link></li>
                  <li><Link href="/about">Mix & Match Planters</Link></li>
                  <li><Link href="/about">Visit Headquarters</Link></li>
                </ul>
              </div>

              <div className={styles.contactColumn}>
                <h3 className={styles.sectionHeading}>HELP AND ADVICE</h3>
                <ul className={styles.linkList}>
                  <li><Link href="/contact">Shipping Information</Link></li>
                  <li><Link href="/collections">Planter Colors</Link></li>
                  <li><Link href="/contact">Assembly Information</Link></li>
                  <li><Link href="/contact">Request a call back</Link></li>
                  <li><Link href="/contact">FAQ&apos;s</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Newsletter Form */}
          <div className={styles.rightSection}>
            <div className={styles.formBlock}>
              <h3 className={styles.formHeading}>JOIN OUR MAILING LIST</h3>
              <p className={styles.formSubtitle}>
                Receive updates on the latest products, promotions,<br />
                and events by e-mail.
              </p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.label}>Full name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit →'}
                </button>

                {submitMessage && (
                  <div className={`${styles.message} ${styles[submitMessage.type]}`}>
                    {submitMessage.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

