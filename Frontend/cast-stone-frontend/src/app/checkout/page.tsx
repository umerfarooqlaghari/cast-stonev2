/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { paymentService } from '@/services';
import styles from './checkout.module.css';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Get available payment methods from service
const getAvailablePaymentMethods = (): PaymentMethod[] => {
  const methods = paymentService.getAvailablePaymentMethods();
  return methods.map(method => ({
    id: method.method,
    name: method.name,
    description: method.description,
    icon: method.icon
  }));
};

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentError, setPaymentError] = useState<string>('');
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('stripe');

  // Initialize payment methods
  useEffect(() => {
    setPaymentMethods(getAvailablePaymentMethods());
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (!state.cart || state.cart.cartItems.length === 0) {
      router.push('/cart');
    }
  }, [state.cart, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateShippingInfo = (): boolean => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => shippingInfo[field as keyof ShippingInfo].trim() !== '');
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateShippingInfo()) {
      setCurrentStep(2);
    } else if (currentStep === 1) {
      alert('Please fill in all required fields');
    }
  };

  const handlePlaceOrder = async () => {
    if (!state.cart) return;

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Validate payment amount
      const validation = paymentService.validatePaymentAmount(total);
      if (!validation.valid) {
        setPaymentError(validation.errors.join(', '));
        return;
      }

      // Create order first (this would be a real API call)
      const orderData = {
        email: shippingInfo.email,
        phoneNumber: shippingInfo.phone,
        country: shippingInfo.country,
        city: shippingInfo.city,
        zipCode: shippingInfo.zipCode,
        paymentMethod: selectedPaymentMethod,
        orderItems: state.cart.cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      // For demo purposes, we'll simulate order creation
      const mockOrderId = Math.floor(Math.random() * 10000);

      // Process payment based on selected method
      const paymentResult = await paymentService.processPayment(
        selectedPaymentMethod as 'stripe' | 'paypal' | 'apple_pay' | 'affirm',
        total,
        'USD',
        mockOrderId,
        {
          description: `Cast Stone Order #${mockOrderId}`,
          customer_email: shippingInfo.email
        }
      );

      if (!paymentResult.success) {
        setPaymentError(paymentResult.message || 'Payment processing failed');
        return;
      }

      // For demo purposes, simulate payment completion
      if (selectedPaymentMethod === 'paypal' && 'approvalUrl' in paymentResult) {
        // For PayPal, redirect to approval URL
        if (typeof paymentResult.approvalUrl === 'string') {
          window.location.href = paymentResult.approvalUrl;
        } else {
          setPaymentError('Invalid approval URL received from payment service.');
          return;
        }
        return;
      }

      // For other payment methods, complete the payment
      if ('paymentIntentId' in paymentResult && paymentResult.paymentIntentId) {
        const completionResult = await paymentService.completePayment(
          selectedPaymentMethod as 'stripe' | 'paypal' | 'apple_pay' | 'affirm',
          paymentResult.paymentIntentId,
          mockOrderId
        );

        if (!completionResult.payment.success) {
          setPaymentError(completionResult.payment.message || 'Payment completion failed');
          return;
        }

        console.log('Payment completed:', completionResult);
      }

      // Clear cart after successful order
      await clearCart();

      // Redirect to success page
      router.push('/checkout/success');
    } catch (error) {
      console.error('Error placing order:', error);
      const errorInfo = paymentService.handlePaymentError(error, selectedPaymentMethod);
      setPaymentError(errorInfo.userMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!state.cart || state.cart.cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  const subtotal = state.cart.totalAmount;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Checkout</h1>
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
            <span>1</span>
            <label>Shipping</label>
          </div>
          <div className={styles.stepConnector}></div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
            <span>2</span>
            <label>Payment</label>
          </div>
        </div>
      </div>

      <div className={styles.checkoutContent}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {currentStep === 1 && (
            <div className={styles.shippingSection}>
              <h2 className={styles.sectionTitle}>Shipping Information</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.stepActions}>
                <button
                  onClick={handleNextStep}
                  className={styles.nextBtn}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.paymentSection}>
              <h2 className={styles.sectionTitle}>Payment Method</h2>
              
              <div className={styles.paymentMethods}>
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`${styles.paymentMethod} ${
                      selectedPaymentMethod === method.id ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className={styles.paymentIcon}>{method.icon}</div>
                    <div className={styles.paymentInfo}>
                      <h3>{method.name}</h3>
                      <p>{method.description}</p>
                    </div>
                    <div className={styles.radioButton}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {paymentError && (
                <div className={styles.errorMessage}>
                  <p>{paymentError}</p>
                </div>
              )}

              <div className={styles.stepActions}>
                <button
                  onClick={() => setCurrentStep(1)}
                  className={styles.backBtn}
                >
                  Back to Shipping
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className={styles.placeOrderBtn}
                >
                  {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.orderItems}>
            {state.cart.cartItems.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <img
                  src={item.product?.images?.[0] || '/images/placeholder-product.jpg'}
                  alt={item.product?.name || 'Product'}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h4>{item.product?.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className={styles.itemPrice}>
                  {formatPrice(item.quantity * (item.product?.price || 0))}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.summaryTotals}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
