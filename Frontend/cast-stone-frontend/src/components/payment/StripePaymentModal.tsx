/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import styles from './StripePaymentModal.module.css';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardholderName.trim()) {
      setErrorMessage('Please enter cardholder name');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: cardholderName,
          },
        });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Create payment intent on backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/stripe/create-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            paymentMethodType: 'card',
            confirmationMethod: true,
          }),
        }
      );

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = result.data;

      // Confirm the payment
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntentId);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (error: any) {
      const message = error.message || 'Payment failed. Please try again.';
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: 'system-ui, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
        iconColor: '#1e3a8a',
      },
      invalid: {
        color: '#dc2626',
        iconColor: '#dc2626',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className={styles.paymentForm}>
      <div className={styles.formGroup}>
        <label htmlFor="cardholderName">Cardholder Name *</label>
        <input
          type="text"
          id="cardholderName"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="John Doe"
          required
          disabled={isProcessing}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Card Details *</label>
        <div className={styles.cardElementWrapper}>
          <CardElement options={cardElementOptions} />
        </div>
        <p className={styles.cardHint}>
          Enter your card number, expiration date, and CVC
        </p>
      </div>

      {errorMessage && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <p>{errorMessage}</p>
        </div>
      )}

      <div className={styles.securityBadge}>
        <span>🔒</span>
        <p>Your payment information is secure and encrypted</p>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing || !stripe}
          className={styles.submitButton}
        >
          {isProcessing ? (
            <>
              <span className={styles.spinner}></span>
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
};

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onSuccess,
  onError,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Complete Payment</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.amountDisplay}>
            <span>Total Amount:</span>
            <strong>${amount.toFixed(2)}</strong>
          </div>

          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={amount}
              onSuccess={onSuccess}
              onError={onError}
              onClose={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;

