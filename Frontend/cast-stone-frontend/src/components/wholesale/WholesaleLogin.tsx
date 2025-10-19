/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { LoginRequest, AuthenticationResult } from '../../services/types/entities';
import { useWholesaleAuth } from '../../contexts/WholesaleAuthContext';
import styles from './WholesaleLogin.module.css';

interface WholesaleLoginProps {
  onSuccess?: (result: AuthenticationResult) => void;
  onError?: (error: string) => void;
  onSwitchToSignup?: () => void;
  // Visual variant only impacts styling
  variant?: 'default' | 'modern';
}

export const WholesaleLogin: React.FC<WholesaleLoginProps> = ({
  onSuccess,
  onError,
  onSwitchToSignup,
  variant = 'default'
}) => {
  const { login } = useWholesaleAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Create a mock AuthenticationResult for the onSuccess callback
        const authResult: AuthenticationResult = {
          isValid: true,
          user: undefined, // Will be set by the context
          isApprovedWholesaleBuyer: true // Will be determined by the context
        };
        onSuccess?.(authResult);
      } else {
        onError?.(result.error || 'Login failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.loginContainer} ${variant === 'modern' ? styles.modern : ''}`}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h2>Wholesale Buyer Login</h2>
          <p>Access your wholesale pricing and account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Username or email address *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? styles.error : ''}
              placeholder=""
              disabled={isSubmitting}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={errors.password ? styles.error : ''}
              placeholder=""
              disabled={isSubmitting}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.rememberMe}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
};
