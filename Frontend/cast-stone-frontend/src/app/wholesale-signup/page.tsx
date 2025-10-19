'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { WholesaleSignupForm } from '../../components/wholesale/WholesaleSignupForm';
import { WholesaleLogin } from '../../components/wholesale/WholesaleLogin';
import { useWholesaleAuth } from '../../contexts/WholesaleAuthContext';
import { AuthenticationResult } from '../../services/types/entities';
import { useCollectionsByLevel } from '../../hooks/useCollections';
import styles from './page.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

type ViewMode = 'landing' | 'login' | 'signup' | 'success' | 'pending';

export default function WholesaleSignupPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { isApprovedWholesaleBuyer, user, isLoading } = useWholesaleAuth();
  const router = useRouter();

  // Fetch level 2 collections for carousel images
  const { data: level2Collections = [] } = useCollectionsByLevel(2);

  // Get first 8 collection images (using only the first image URL from each collection)
  const carouselImages = useMemo(() => {
    return level2Collections
      .slice(0, 8)
      .map(collection => {
        // Use only the first image URL from the images array
        if (Array.isArray(collection.images) && collection.images.length > 0) {
          return collection.images[0];
        }
        return '/ContactUs.jpg'; // Fallback image
      })
      .filter(Boolean); // Remove any undefined/null values
  }, [level2Collections]);

  // Redirect if user is already logged in and approved
  useEffect(() => {
    if (!isLoading && user && isApprovedWholesaleBuyer) {
      router.push('/products?wholesale=true');
    }
  }, [isLoading, user, isApprovedWholesaleBuyer, router]);

  const handleLoginSuccess = async (result: AuthenticationResult) => {
    // Check the context state for the most up-to-date information
    if (isApprovedWholesaleBuyer && user) {
      // Redirect to catalog or home page with wholesale pricing
      router.push('/products?wholesale=true');
    } else if (user && !isApprovedWholesaleBuyer) {
      // Show pending approval message
      setCurrentView('pending');
      setMessage('Your wholesale application is pending approval. You will be notified once approved.');
    } else {
      // Fallback to result data
      if (result.isApprovedWholesaleBuyer) {
        router.push('/products?wholesale=true');
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
    // Only set error if it's not an empty string (empty string is used to clear errors)
    if (error) {
      setError(error);
    } else {
      setError('');
    }
  };

  const renderHeader = () => (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <h1>Wholesale Access</h1>
        <p>Join our wholesale program to access exclusive pricing and benefits</p>
      </div>
    </div>
  );

  // Reusable image carousel component
  const renderImageCarousel = () => {
    // Use carousel images if available, otherwise fallback
    const images = carouselImages.length > 0 ? carouselImages : ['/ContactUs.jpg'];

    return (
      <div className={styles.signupRight}>
        <div className={styles.signupRightInner}>
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={1000}
            className={styles.imageCarousel}
          >
            {images.map((imageSrc, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={imageSrc}
                  alt={`Wholesale ${index + 1}`}
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  priority={index === 0}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
  };

  const renderLandingPage = () => {
    // Use carousel images if available, otherwise fallback
    const images = carouselImages.length > 0 ? carouselImages : ['/ContactUs.jpg'];

    return (
      <div className={styles.landingPage}>
        <div className={styles.landingBackground}>
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={1500}
            className={styles.landingCarousel}
          >
            {images.map((imageSrc, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={imageSrc}
                  alt={`Wholesale ${index + 1}`}
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  priority={index === 0}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={styles.landingOverlay} />
        </div>

        <div className={styles.landingContent}>
          <h1 className={styles.landingTitle}>WHOLESALE TRADE INFO</h1>
          <p className={styles.landingSubtitle}>CREATED BY CAST STONE, FOR OUR PARTNERS</p>

          <div className={styles.landingButtons}>
            <button
              onClick={() => setCurrentView('signup')}
              className={styles.landingButton}
            >
              SIGN UP NOW
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className={styles.landingButton}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSignupHero = () => (
    <div className={styles.signupHero}>
      <div className={styles.signupCard}>
        {/* Left Section - Form */}
        <div className={styles.signupLeft}>
          {/* Animated Text */}
          <div className={styles.animatedTextContainer}>
            <h2 className={styles.animatedText}>
              <span className={styles.word} data-delay="0">Join</span>
              <span className={styles.word} data-delay="200">Our</span>
              <span className={styles.word} data-delay="400">Wholesale</span>
              <span className={styles.word} data-delay="600">Program</span>
            </h2>
          </div>

          <p>
            Access exclusive wholesale pricing, priority support, and dedicated account management.
            Join our network of professional partners and grow your business with Cast Stone International.
          </p>

          <div className={styles.formHeader}>
            <h2>WHOLESALE REGISTRATION</h2>
            <p>Fill out the form below to apply for wholesale access</p>
          </div>

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

        {/* Right Section - Image Carousel */}
        {renderImageCarousel()}
      </div>
    </div>
  );

  const renderLoginHero = () => (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>WHOLESALE LOGIN</h1>

        <WholesaleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          onSwitchToSignup={() => {
            setCurrentView('signup');
            setError('');
          }}
          variant="modern"
        />

        <div className={styles.socialIcons}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );

  const renderSuccessHero = () => (
    <div className={styles.signupHero}>
      <div className={styles.signupCard}>
        {/* Left Section - Success Message */}
        <div className={styles.messageContainer}>
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2>Application Submitted!</h2>
            <p>{message}</p>
            <div className={styles.nextSteps}>
              <h3>What happens next?</h3>
              <ol>
                <li>We will review your application within 2-3 business days</li>
                <li>You will receive an email notification with our decision</li>
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

        {/* Right Section - Image Carousel */}
        {renderImageCarousel()}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return renderLandingPage();

      case 'login':
        return renderLoginHero();

      case 'signup':
        return renderSignupHero();

      case 'success':
        return renderSuccessHero();

      case 'pending':
        return (
          <div className={styles.signupHero}>
            <div className={styles.signupCard}>
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
                      setCurrentView('landing');
                      setMessage('');
                    }}
                    className={styles.primaryButton}
                  >
                    Back to Home
                  </button>
                </div>
              </div>

              {/* Right Section - Image Carousel */}
              {renderImageCarousel()}
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

