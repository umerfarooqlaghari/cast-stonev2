/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WholesaleSignupForm } from '../../components/wholesale/WholesaleSignupForm';
import { WholesaleLogin } from '../../components/wholesale/WholesaleLogin';
import { useWholesaleAuth } from '../../contexts/WholesaleAuthContext';
import { AuthenticationResult } from '../../services/types/entities';
import styles from './page.module.css';

type ViewMode = 'login' | 'signup' | 'success' | 'pending';

export default function WholesaleSignupPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('login');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { isApprovedWholesaleBuyer, user, isLoading } = useWholesaleAuth();
  const router = useRouter();

  // Redirect if user is already logged in and approved
  useEffect(() => {
    if (!isLoading && user && isApprovedWholesaleBuyer) {
      router.push('/catalog?wholesale=true');
    }
  }, [isLoading, user, isApprovedWholesaleBuyer, router]);

  const handleLoginSuccess = async (result: AuthenticationResult) => {
    // Check the context state for the most up-to-date information
    if (isApprovedWholesaleBuyer && user) {
      // Redirect to catalog or home page with wholesale pricing
      router.push('/catalog?wholesale=true');
    } else if (user && !isApprovedWholesaleBuyer) {
      // Show pending approval message
      setCurrentView('pending');
      setMessage('Your wholesale application is pending approval. You will be notified once approved.');
    } else {
      // Fallback to result data
      if (result.isApprovedWholesaleBuyer) {
        router.push('/catalog?wholesale=true');
      } else {
        setCurrentView('pending');
        setMessage('Your wholesale application is pending approval. You will be notified once approved.');
      }
    }
  };

  const handleLoginError = (error: string) => {
    setError(error);
  };

  const handleSignupSuccess = () => {
    setCurrentView('success');
    setMessage('Your wholesale application has been submitted successfully! We will review your application and notify you within 2-3 business days.');
    setError('');
  };

  const handleSignupError = (error: string) => {
    setError(error);
  };

  const renderHeader = () => (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <h1>Wholesale Access</h1>
        <p>Join our wholesale program to access exclusive pricing and benefits</p>
      </div>
    </div>
  );

  const renderSignupHero = () => (
    <div className={styles.signupHero}>
      <div className={styles.signupOverlay} />
      <div className={styles.signupCard}>
        <div className={styles.signupLeft}>
          <h2>Let’s Get Started</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenes placerat
            ultricies libero eu pharetra. Vestibulum a ultricies augue.
          </p>
        </div>
        <div className={styles.signupRight}>
          <div className={styles.signupRightInner}>
            <h3>Sign up</h3>
            <WholesaleSignupForm
              onSuccess={handleSignupSuccess}
              onError={handleSignupError}
              variant="modern"
            />
            <div className={styles.signupFooterInfo}>
              <span>Already a Member?</span>
              <button
                onClick={() => {
                  setCurrentView('login');
                  setError('');
                }}
                className={styles.signupLink}
              >
                Sign in here
              </button>
            </div>
          </div>
          <div className={styles.signupDivider} />
          <div className={styles.signupSocialCol}>
            <button className={styles.socialBtn} aria-label="Continue with Facebook">F</button>
            <div className={styles.or}>OR</div>
            <button className={styles.socialBtn} aria-label="Continue with Twitter">T</button>
            <button className={styles.socialBtn} aria-label="Continue with Google">G</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoginHero = () => (
    <div className={styles.signupHero}>
      <div className={styles.signupOverlay} />
      <div className={styles.signupCard}>
        <div className={styles.signupLeft}>
          <h2>Welcome Back</h2>
          <p>
            Sign in to access wholesale pricing, orders, and your account dashboard.
          </p>
        </div>
        <div className={styles.signupRight}>
          <div className={styles.signupRightInner}>
            <h3>Sign in</h3>
            <WholesaleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              onSwitchToSignup={() => {
                setCurrentView('signup');
                setError('');
              }}
              variant="modern"
            />
          </div>
          <div className={styles.signupDivider} />
          <div className={styles.signupSocialCol}>
            <button className={styles.socialBtn} aria-label="Continue with Facebook">F</button>
            <div className={styles.or}>OR</div>
            <button className={styles.socialBtn} aria-label="Continue with Twitter">T</button>
            <button className={styles.socialBtn} aria-label="Continue with Google">G</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessHero = () => (
    <div className={styles.signupHero}>
      <div className={styles.signupOverlay} />
      <div className={styles.signupCard}>
        <div className={styles.signupLeft}>
          <h2>Application Submitted</h2>
          <p>
            Thank you for applying to our wholesale program. We typically review
            applications within 2–3 business days.
          </p>
        </div>
        <div className={styles.signupRight}>
          <div className={styles.signupRightInner}>
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h2>Application Submitted!</h2>
              <p>{message}</p>
              <div className={styles.nextSteps}>
                <h3>What happens next?</h3>
                <ol>
                  <li>We&apos;ll review your application within 2-3 business days</li>
                  <li>You&apos;ll receive an email notification with our decision</li>
                  <li>Once approved, you can log in to access wholesale pricing</li>
                </ol>
              </div>
              <button
                onClick={() => {
                  setCurrentView('login');
                  setMessage('');
                }}
                className={styles.primaryButton}
              >
                Back to Login
              </button>
            </div>
          </div>
          <div className={styles.signupDivider} />
          <div className={styles.signupSocialCol}>
            <button className={styles.socialBtn} aria-label="Continue with Facebook">F</button>
            <div className={styles.or}>OR</div>
            <button className={styles.socialBtn} aria-label="Continue with Twitter">T</button>
            <button className={styles.socialBtn} aria-label="Continue with Google">G</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBenefits = () => (
    <div className={styles.benefits}>
      <h3>Wholesale Benefits</h3>
      <ul>
        <li>Exclusive wholesale pricing on all products</li>
        <li>Priority customer support</li>
        <li>Access to new products before general release</li>
        <li>Dedicated account manager</li>
        <li>Flexible payment terms</li>
        <li>Volume discounts available</li>
      </ul>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return renderLoginHero();

      case 'signup':
        return renderSignupHero();

      case 'success':
        return renderSuccessHero();

      case 'pending':
        return (
          <div className={styles.messageContainer}>
            <div className={styles.pendingMessage}>
              <div className={styles.pendingIcon}>⏳</div>
              <h2>Application Pending</h2>
              <p>{message}</p>
              <div className={styles.contactInfo}>
                <p>
                  If you have any questions, please contact us at{' '}
                  <a href="mailto:wholesale@caststone.com">wholesale@caststone.com</a>
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentView('login');
                  setMessage('');
                }}
                className={styles.primaryButton}
              >
                Back to Login
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {currentView !== 'signup' && renderHeader()}

      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button onClick={() => setError('')} className={styles.closeError}>
            ×
          </button>
        </div>
      )}

      {renderContent()}
    </div>
  );
}
