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

type ViewMode = 'login' | 'signup' | 'success' | 'pending';

export default function WholesaleSignupPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('login');
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
            <h2>Create Your Account</h2>
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
    <div className={styles.signupHero}>
      <div className={styles.signupCard}>
        {/* Left Section - Form */}
        <div className={styles.signupLeft}>
          {/* Animated Text */}
          <div className={styles.animatedTextContainer}>
            <h2 className={styles.animatedText}>
              <span className={styles.word} data-delay="0">Welcome</span>
              <span className={styles.word} data-delay="200">Back</span>
            </h2>
          </div>
          <p>
            Sign in to access wholesale pricing, manage your orders, and view your account dashboard.
          </p>
          <div className={styles.formHeader}>
            <h2>Sign In</h2>
          </div>

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

        {/* Right Section - Image Carousel */}
        {renderImageCarousel()}
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

