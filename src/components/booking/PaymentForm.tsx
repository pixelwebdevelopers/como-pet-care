'use client';

import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripeClient } from '@/lib/stripe-client';
import type { Appearance } from '@stripe/stripe-js';
import styles from './PaymentForm.module.css';

// --- TYPES ---
interface PaymentFormProps {
  totalPrice: number;
  basePrice: number;
  additionalPetFee: number;
  puppySurcharge: number;
  holidaySurcharge: number;
  customerDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    petName: string;
    petType: string;
    petBreed: string;
    petAge: string;
    additionalPets: string;
    puppiesCount: string;
  };
  bookingDetails?: {
    serviceName: string;
    planTitle: string;
    bookingDate: string;
    bookingEndDate?: string;
  };
  onSubmitPayment: (paymentIntentId?: string) => void;
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

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '18px', height: '18px', flexShrink: 0 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
    />
  </svg>
);

// Stripe appearance customized for Como Pet Care brand identity
const stripeAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#123f3c',
    colorBackground: '#faf8f4',
    colorText: '#1c2524',
    colorDanger: '#c53030',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      border: '1px solid #efe7d8',
      boxShadow: 'none',
      fontSize: '14px',
      padding: '12px 14px',
      backgroundColor: '#faf8f4',
    },
    '.Input:focus': {
      border: '1px solid #123f3c',
      boxShadow: '0 0 0 3px rgba(18, 63, 60, 0.06)',
    },
    '.Label': {
      fontSize: '13px',
      fontWeight: '600',
      color: '#1c2524',
      marginBottom: '6px',
    },
    '.Tab': {
      border: '1px solid #efe7d8',
      backgroundColor: '#faf8f4',
    },
    '.Tab--selected': {
      borderColor: '#123f3c',
      backgroundColor: '#ffffff',
    },
  },
};

// --- STRIPE EMBEDDED CHECKOUT COMPONENT ---
interface StripeCheckoutSectionProps {
  totalPrice: number;
  onSubmitPayment: (paymentIntentId?: string) => void;
}

function StripeCheckoutSection({ totalPrice, onSubmitPayment }: StripeCheckoutSectionProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment processing failed. Please try again.');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSubmitPayment(paymentIntent.id);
      } else {
        // In case of requires_action or other statuses
        onSubmitPayment(paymentIntent?.id);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred during payment.',
      );
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.stripeElementWrapper}>
        <PaymentElement
          id="payment-element"
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {errorMessage && (
        <div className={styles.stripeErrorAlert}>
          <WarningIcon />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className={styles.secureBadge}>
        <span className={styles.secureBadgeIcon}>
          <ShieldCheckIcon />
        </span>
        Your payment information is encrypted and securely processed via Stripe. We never store your
        card details.
      </div>

      <button
        type="submit"
        className={styles.btnSubmit}
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? (
          <>
            <span className={styles.spinner} />
            Processing Secure Payment...
          </>
        ) : (
          <>
            <LockIcon /> Pay ${totalPrice.toFixed(2)} with Stripe <ArrowRightIcon />
          </>
        )}
      </button>
    </form>
  );
}

// --- MAIN PAYMENT FORM COMPONENT ---
export default function PaymentForm({
  totalPrice,
  basePrice,
  additionalPetFee,
  puppySurcharge,
  holidaySurcharge,
  customerDetails,
  bookingDetails,
  onSubmitPayment,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState<boolean>(true);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [isStripeConfiguredState, setIsStripeConfiguredState] = useState<boolean>(true);

  // Initialize PaymentIntent on mount
  useEffect(() => {
    let isMounted = true;
    setLoadingIntent(true);
    setIntentError(null);

    async function initializePaymentIntent() {
      try {
        const res = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalPrice,
            customerDetails,
            bookingDetails,
          }),
        });

        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.success && data.clientSecret) {
          setClientSecret(data.clientSecret);
          setIsStripeConfiguredState(true);
        } else {
          if (data.error === 'STRIPE_NOT_CONFIGURED') {
            setIsStripeConfiguredState(false);
          } else {
            setIntentError(data.message || 'Unable to initialize Stripe payment.');
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setIntentError(err instanceof Error ? err.message : 'Network error initializing payment.');
      } finally {
        if (isMounted) {
          setLoadingIntent(false);
        }
      }
    }

    if (totalPrice > 0) {
      initializePaymentIntent();
    } else {
      setLoadingIntent(false);
    }

    return () => {
      isMounted = false;
    };
  }, [totalPrice, customerDetails, bookingDetails]);

  return (
    <div className={styles.container}>
      {/* Heading */}
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Complete Your Payment</h2>
        <p className={styles.subtitle}>
          Your card will be securely authorized and processed through Stripe. All transactions are
          end-to-end encrypted.
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
              type="button"
              className={`${styles.methodTab} ${paymentMethod === 'card' ? styles.methodTabActive : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCardIcon /> Credit / Debit Card (Stripe)
            </button>
            <button
              type="button"
              className={`${styles.methodTab} ${paymentMethod === 'paypal' ? styles.methodTabActive : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              PayPal
            </button>
          </div>

          {paymentMethod === 'card' && (
            <>
              {loadingIntent && (
                <div className={styles.stripeLoadingContainer}>
                  <span className={styles.spinnerPrimary} />
                  <span>Connecting to secure Stripe gateway...</span>
                </div>
              )}

              {!loadingIntent && !isStripeConfiguredState && (
                <div className={styles.configNotice}>
                  <div className={styles.configNoticeTitle}>
                    <WarningIcon />
                    Stripe Setup Information
                  </div>
                  <p>
                    Stripe is configured in the code! To enable real or test card charges, add your
                    API keys from the Stripe Dashboard to your <code>.env</code> file:
                  </p>
                  <code className={styles.configNoticeCode}>
                    STRIPE_SECRET_KEY=sk_test_...
                    <br />
                    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
                  </code>
                  <p>For testing without live keys right now, you can proceed in sandbox mode:</p>
                  <button
                    type="button"
                    className={styles.btnSandbox}
                    onClick={() => onSubmitPayment('sandbox_mock_payment_intent')}
                  >
                    Simulate Successful Booking Payment
                  </button>
                </div>
              )}

              {!loadingIntent && isStripeConfiguredState && intentError && (
                <div className={styles.stripeErrorAlert}>
                  <WarningIcon />
                  <div>
                    <strong>Unable to start payment:</strong> {intentError}
                  </div>
                </div>
              )}

              {!loadingIntent && isStripeConfiguredState && clientSecret && (
                <Elements
                  stripe={getStripeClient()}
                  options={{
                    clientSecret,
                    appearance: stripeAppearance,
                  }}
                >
                  <StripeCheckoutSection
                    totalPrice={totalPrice}
                    onSubmitPayment={onSubmitPayment}
                  />
                </Elements>
              )}
            </>
          )}

          {paymentMethod === 'paypal' && (
            <div className={styles.paypalPlaceholder}>
              <p className={styles.paypalNote}>
                You will be redirected to PayPal to complete your payment securely.
              </p>
              <button
                type="button"
                className={styles.paypalBtn}
                onClick={() => onSubmitPayment('paypal_simulated_id')}
              >
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
        </div>
      </div>
    </div>
  );
}
