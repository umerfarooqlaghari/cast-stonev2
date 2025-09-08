'use client';

import React, { useState } from 'react';
import { CreateWholesaleBuyerRequest } from '../../services/types/entities';
import { wholesaleBuyerService } from '../../services';
import styles from './WholesaleSignupForm.module.css';

interface WholesaleSignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  // Visual variant only affects styling (UI), not logic
  variant?: 'default' | 'modern';
}

type FormData = CreateWholesaleBuyerRequest;

const BUSINESS_TYPES = [
  'Landscape Contractor',
  'Landscape Architect',
  'Garden Center/Nursery',
  'Hardscape Contractor',
  'Pool/Spa Contractor',
  'Interior Designer',
  'Architect',
  'General Contractor',
  'Distributor/Dealer',
  'Other'
];

const HOW_DID_YOU_HEAR_OPTIONS = [
  'Google Search',
  'Social Media',
  'Trade Show',
  'Referral from Customer',
  'Referral from Industry Professional',
  'Print Advertisement',
  'Website',
  'Other'
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export const WholesaleSignupForm: React.FC<WholesaleSignupFormProps> = ({
  onSuccess,
  onError,
  variant = 'default'
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    businessType: '',
    otherBusinessType: '',
    taxNumber: '',
    businessAddress: '',
    state: '',
    city: '',
    zipCode: '',
    country: '',
    howDidYouHear: [],
    otherHowDidYouHear: '',
    comments: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Personal Information
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    } else if (step === 2) {
      // Business Information
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (formData.businessType === 'Other' && !formData.otherBusinessType?.trim()) {
        newErrors.otherBusinessType = 'Please specify your business type';
      }
      if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    } else if (step === 3) {
      // Additional Information
      if (formData.howDidYouHear.length === 0) {
        newErrors.howDidYouHear = 'Please select at least one option';
      }
      if (formData.howDidYouHear.includes('Other') && !formData.otherHowDidYouHear?.trim()) {
        newErrors.otherHowDidYouHear = 'Please specify how you heard about us';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const newHowDidYouHear = checked
      ? [...formData.howDidYouHear, option]
      : formData.howDidYouHear.filter(item => item !== option);
    
    handleInputChange('howDidYouHear', newHowDidYouHear);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const response = await wholesaleBuyerService.post.submitApplication(formData);
      if (response.success) {
        onSuccess?.();
      } else {
        onError?.(response.message || 'Failed to submit application');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <h3>Personal Information</h3>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={errors.firstName ? styles.error : ''}
          />
          {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={errors.lastName ? styles.error : ''}
          />
          {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={errors.email ? styles.error : ''}
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={errors.phone ? styles.error : ''}
        />
        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={errors.password ? styles.error : ''}
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={errors.confirmPassword ? styles.error : ''}
          />
          {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <h3>Business Information</h3>
      
      <div className={styles.formGroup}>
        <label htmlFor="companyName">Company Name *</label>
        <input
          type="text"
          id="companyName"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className={errors.companyName ? styles.error : ''}
        />
        {errors.companyName && <span className={styles.errorText}>{errors.companyName}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="businessType">Business Type *</label>
        <select
          id="businessType"
          value={formData.businessType}
          onChange={(e) => handleInputChange('businessType', e.target.value)}
          className={errors.businessType ? styles.error : ''}
        >
          <option value="">Select Business Type</option>
          {BUSINESS_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.businessType && <span className={styles.errorText}>{errors.businessType}</span>}
      </div>

      {formData.businessType === 'Other' && (
        <div className={styles.formGroup}>
          <label htmlFor="otherBusinessType">Please specify *</label>
          <input
            type="text"
            id="otherBusinessType"
            value={formData.otherBusinessType || ''}
            onChange={(e) => handleInputChange('otherBusinessType', e.target.value)}
            className={errors.otherBusinessType ? styles.error : ''}
          />
          {errors.otherBusinessType && <span className={styles.errorText}>{errors.otherBusinessType}</span>}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="taxNumber">Tax ID Number *</label>
        <input
          type="text"
          id="taxNumber"
          value={formData.taxNumber || ''}
          onChange={(e) => handleInputChange('taxNumber', e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="businessAddress">Business Address *</label>
        <textarea
          id="businessAddress"
          value={formData.businessAddress}
          onChange={(e) => handleInputChange('businessAddress', e.target.value)}
          className={errors.businessAddress ? styles.error : ''}
          rows={3}
        />
        {errors.businessAddress && <span className={styles.errorText}>{errors.businessAddress}</span>}
      </div>



      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="state">State *</label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={errors.state ? styles.error : ''}
          >
            <option value="">Select State</option>
            {US_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <span className={styles.errorText}>{errors.state}</span>}
        </div>

          <div className={styles.formGroup}>
          <label htmlFor="country">Country *</label>
          <input
            type="text"
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className={errors.country ? styles.error : ''}
          />
          {errors.country && <span className={styles.errorText}>{errors.country}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={errors.city ? styles.error : ''}
          />
          {errors.city && <span className={styles.errorText}>{errors.city}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="zipCode">ZIP Code *</label>
          <input
            type="text"
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            className={errors.zipCode ? styles.error : ''}
          />
          {errors.zipCode && <span className={styles.errorText}>{errors.zipCode}</span>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <h3>Additional Information</h3>

      <div className={styles.formGroup}>
        <label>How did you hear about us? *</label>
        <div className={styles.checkboxGroup}>
          {HOW_DID_YOU_HEAR_OPTIONS.map(option => (
            <label key={option} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.howDidYouHear.includes(option)}
                onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.howDidYouHear && <span className={styles.errorText}>{errors.howDidYouHear}</span>}
      </div>

      {formData.howDidYouHear.includes('Other') && (
        <div className={styles.formGroup}>
          <label htmlFor="otherHowDidYouHear">Please specify *</label>
          <input
            type="text"
            id="otherHowDidYouHear"
            value={formData.otherHowDidYouHear || ''}
            onChange={(e) => handleInputChange('otherHowDidYouHear', e.target.value)}
            className={errors.otherHowDidYouHear ? styles.error : ''}
          />
          {errors.otherHowDidYouHear && <span className={styles.errorText}>{errors.otherHowDidYouHear}</span>}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="comments">Additional Comments (Optional)</label>
        <textarea
          id="comments"
          value={formData.comments || ''}
          onChange={(e) => handleInputChange('comments', e.target.value)}
          rows={4}
          placeholder="Tell us more about your business or any specific requirements..."
        />
      </div>
    </div>
  );

  return (
    <div className={`${styles.formContainer} ${variant === 'modern' ? styles.modern : ''}`}>
      <div className={styles.progressBar}>
        <div className={styles.progressSteps}>
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`${styles.progressStep} ${
                step <= currentStep ? styles.active : ''
              } ${step < currentStep ? styles.completed : ''}`}
            >
              <span className={styles.stepNumber}>{step}</span>
              <span className={styles.stepLabel}>
                {step === 1 ? 'Personal' : step === 2 ? 'Business' : 'Additional'}
              </span>
            </div>
          ))}
        </div>
        <div
          className={styles.progressLine}
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className={styles.formActions}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className={styles.secondaryButton}
              disabled={isSubmitting}
            >
              Previous
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className={`${styles.primaryButton} ${variant === 'modern' ? styles.arrowButton : ''}`}
              aria-label="Next step"
            >
              {variant === 'modern' ? '➜' : 'Next'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
