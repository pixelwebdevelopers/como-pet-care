'use client';

import React, { useState } from 'react';
import styles from './PaymentForm.module.css';

// --- TYPES ---
interface PaymentFormProps {
  totalPrice: number;
  basePrice: number;
  additionalPetFee: number;
  puppySurcharge: number;
  holidaySurcharge: number;
  onSubmitPayment: () => void;
}

// --- ICONS ---
const CreditCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
    />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '14px', height: '14px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{ width: '14px', height: '14px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const OrderSummaryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
    />
  </svg>
);

// --- COMPONENT ---
export default function PaymentForm({
  totalPrice,
  basePrice,
  additionalPetFee,
  puppySurcharge,
  holidaySurcharge,
  onSubmitPayment,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = () => {
    if (paymentMethod === 'card') {
      if (!cardName || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all card details.');
        return;
      }
    }
    onSubmitPayment();
  };

  return (
    <div className={styles.container}>
      {/* Heading */}
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Complete Your Payment</h2>
        <p className={styles.subtitle}>
          Your card will not be charged until your services are confirmed. All transactions are
          encrypted and secure.
        </p>
      </div>

      {/* Two-column layout */}
      <div className={styles.columnsGrid}>
        {/* Left: Payment Details */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelIcon}>
              <CreditCardIcon />
            </span>
            <h3 className={styles.panelTitle}>Payment Details</h3>
          </div>

          {/* Method tabs */}
          <div className={styles.methodTabs}>
            <button
              className={`${styles.methodTab} ${paymentMethod === 'card' ? styles.methodTabActive : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCardIcon /> Credit / Debit Card
            </button>
            <button
              className={`${styles.methodTab} ${paymentMethod === 'paypal' ? styles.methodTabActive : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              PayPal
            </button>
          </div>

          {paymentMethod === 'card' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Cardholder Name</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Card Number</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Expiry Date</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={7}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>CVV</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>

              <div className={styles.secureBadge}>
                <span className={styles.secureBadgeIcon}>
                  <ShieldCheckIcon />
                </span>
                Your payment information is encrypted and securely processed via Stripe. We never
                store your card details.
              </div>
            </>
          )}

          {paymentMethod === 'paypal' && (
            <div className={styles.paypalPlaceholder}>
              <p className={styles.paypalNote}>
                You will be redirected to PayPal to complete your payment securely.
              </p>
              <button className={styles.paypalBtn} onClick={handleSubmit}>
                Pay with PayPal
              </button>
              <p className={styles.paypalNote}>
                PayPal integration will be connected during production setup.
              </p>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelIcon}>
              <OrderSummaryIcon />
            </span>
            <h3 className={styles.panelTitle}>Order Summary</h3>
          </div>

          <div className={styles.orderSummaryList}>
            <div className={styles.orderRow}>
              <span className={styles.orderLabel}>Base Price</span>
              <span className={styles.orderValue}>${basePrice.toFixed(2)}</span>
            </div>
            <div className={styles.orderRow}>
              <span className={styles.orderLabel}>Additional-Pet Fees</span>
              <span className={styles.orderValue}>${additionalPetFee.toFixed(2)}</span>
            </div>
            <div className={styles.orderRow}>
              <span className={styles.orderLabel}>Puppy Surcharge</span>
              <span className={styles.orderValue}>${puppySurcharge.toFixed(2)}</span>
            </div>
            <div className={styles.orderRow}>
              <span className={styles.orderLabel}>Holiday Surcharge</span>
              <span className={styles.orderValue}>${holidaySurcharge.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>${totalPrice.toFixed(2)}</span>
          </div>

          {paymentMethod === 'card' && (
            <button className={styles.btnSubmit} onClick={handleSubmit}>
              <LockIcon /> Submit Payment <ArrowRightIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
