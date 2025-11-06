'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './newsletterSection.module.css';

interface NewsletterFormData {
  fullName: string;
  email: string;
}

// Social media icons component
const SocialLinks: React.FC = () => (
  <div className={styles.socialLinks}>
    <a href="https://facebook.com" className={styles.socialLink} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
    <a href="https://instagram.com" className={styles.socialLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    </a>
    <a href="https://linkedin.com" className={styles.socialLink} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </a>
  </div>
);

const NewsletterSection: React.FC = () => {
  const pathname = usePathname();
  const [formData, setFormData] = useState<NewsletterFormData>({
    fullName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAdminPage, setIsAdminPage] = useState(false);

  // Check if current page is admin page
  useEffect(() => {
    setIsAdminPage(pathname?.startsWith('/admin') || false);
  }, [pathname]);

  // Don't render on admin pages
  if (isAdminPage) {
    return null;
  }

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

  const currentYear = new Date().getFullYear();

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

      {/* Bottom White Section - Newsletter & Footer Combined */}
      <div className={styles.whiteSection}>
        <div className={styles.container}>
          {/* Left Side - About, Help & Advice, Contact Info */}
          <div className={styles.leftSection}>
            <div className={styles.contactBlock}>
<div className={styles.contactInfoStack}>
                <h3 className={styles.sectionHeading}>CONTACT INFO</h3>
                <div className={styles.contactStackItem}>
                  <span className={styles.contactStackLabel}>Address:</span>
                  <span className={styles.contactStackValue}>
                    Cast Stone International, Inc 11555 US Highway 1<br />
                    North Palm Beach, FL 33408
                  </span>
                </div>
                <div className={styles.contactStackItem}>
                  <span className={styles.contactStackLabel}>Phone:</span>
                  <span className={styles.contactStackValue}>+1 (561) 625-0333</span>
                  </div>

                {/* </div> */}
                <div className={styles.contactStackItem}>
                  <span className={styles.contactStackLabel}>Email:</span>
                  <span className={styles.contactStackValue}>Sales@CastStoneInternational.com</span>
                </div>
              </div>

              <div className={styles.contactColumn}>
                <h3 className={styles.sectionHeading}>ABOUT</h3>
                <ul className={styles.linkList}>
                  <li><Link href="/about">About us</Link></li>
                  <li><Link href="/about">Our story</Link></li>
                <li><Link href="/retail-locator" className={styles.footerLink}>Retail Locator</Link></li>
                <li><Link href="/wholesale-signup" className={styles.footerLink}>Wholesale Sign-up</Link></li>
                </ul>
              </div>

              <div className={styles.contactColumn}>
                <h3 className={styles.sectionHeading}>Discover</h3>
                <ul className={styles.linkList}>
                <li><Link href="/collections" className={styles.footerLink}>Catalog</Link></li>
                <li><Link href="/collections" className={styles.footerLink}>Collections</Link></li>
                <li><Link href="/collections" className={styles.footerLink}>Completed Projects</Link></li>
                <li><Link href="/collections" className={styles.footerLink}>Videos</Link></li>
                <li><Link href="/faq" className={styles.footerLink}>FAQs</Link></li>
                </ul>
              </div>

              {/* Contact Info - Vertical Stack */}
              
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

        {/* Brand Section - Below Contact Block */}
        <div className={styles.brandSectionWrapper}>
          <div className={styles.brandSection}>
            <h3 className={styles.brandSectionName}>Cast Stone</h3>
            <p className={styles.brandSectionDescription}>
              Creating timeless beauty with handcrafted cast stone elements for over 25 years.
            <SocialLinks />
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section - Integrated */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          {/* Bottom Section */}
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              © {currentYear} Cast Stone. All rights reserved.
            </p>
            <div className={styles.legalLinks}>
              <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default NewsletterSection;

