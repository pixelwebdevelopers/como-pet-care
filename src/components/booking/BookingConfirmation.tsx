'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './BookingConfirmation.module.css';

// --- TYPES ---
interface BookingConfirmationProps {
  isNewCustomer: boolean;
  bookingRef?: string;
  serviceName: string;
  bookingDate: string;
  bookingEndDate?: string;
  numberOfDays: number;
  totalPrice: number;
  paymentStatusText?: string;
  meetGreetDate?: string;
  meetGreetAddress?: string;
  customerEmail?: string;
  petName?: string;
}

// --- ICONS ---
const ClipboardIcon = () => (
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

const ServiceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const PriceTagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
    />
  </svg>
);

const CreditCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
    />
  </svg>
);

// Paw print SVG for background decoration
const PawPrintSvg = ({ size = 60 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7.9 78.6 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v.1c0 .2 0 .4 0 .6v.7c-.1 2.9-.3 5.8-.8 8.6-5.4 32.5-35.3 56.3-71.2 56.3H136c-35.9 0-65.7-23.8-71.1-56.3-.5-2.8-.8-5.7-.8-8.6v-.7c0-.2 0-.4 0-.6v-.1c0-10.4 1.6-20.8 5.2-30.5zM381.7 96.8c32.9-10.6 46.9 16.4 32.6 96.8-14.3 42.9-51.7 69.1-84.4 58.5-32.9-10.6-46.9-53.9-32.6-96.8 14.3-42.9 51.7-69.1 84.4-58.5zM490.2 165.3c24.5 14 29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3-29.1-51.7-10.2-84.1 54-47.3 78.5-33.3z" />
  </svg>
);

export default function BookingConfirmation({
  isNewCustomer,
  bookingRef = 'CPC-2026-0001',
  serviceName,
  bookingDate,
  bookingEndDate,
  numberOfDays,
  totalPrice,
  paymentStatusText = 'Paid via Secure Payment',
  meetGreetDate,
  meetGreetAddress,
  customerEmail,
  petName,
}: BookingConfirmationProps) {
  const router = useRouter();
  const dateDisplay = bookingEndDate
    ? `${bookingDate} - ${bookingEndDate} (${numberOfDays} Day)`
    : bookingDate;

  const handleGoToIntake = () => {
    const params = new URLSearchParams();
    if (bookingRef) params.set('bookingRef', bookingRef);
    if (customerEmail) params.set('email', customerEmail);
    if (petName) params.set('petName', petName);
    router.push(`/intake?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      {/* Paw print background decoration */}
      <div className={styles.pawBg}>
        <div className={`${styles.pawPrint} ${styles.paw1}`}>
          <PawPrintSvg size={70} />
        </div>
        <div className={`${styles.pawPrint} ${styles.paw2}`}>
          <PawPrintSvg size={50} />
        </div>
        <div className={`${styles.pawPrint} ${styles.paw3}`}>
          <PawPrintSvg size={65} />
        </div>
        <div className={`${styles.pawPrint} ${styles.paw4}`}>
          <PawPrintSvg size={45} />
        </div>
        <div className={`${styles.pawPrint} ${styles.paw5}`}>
          <PawPrintSvg size={55} />
        </div>
        <div className={`${styles.pawPrint} ${styles.paw6}`}>
          <PawPrintSvg size={70} />
        </div>
        <div className={`${styles.pawPrint} ${styles.paw7}`}>
          <PawPrintSvg size={50} />
        </div>
        <div className={`${styles.pawPrint} ${styles.paw8}`}>
          <PawPrintSvg size={60} />
        </div>
      </div>

      {/* Heading */}
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>
          {isNewCustomer
            ? 'Your booking has been received & Meet & Greet is scheduled'
            : 'Your pet-sitting booking is confirmed!'}
        </h2>
        <p className={styles.subtitle}>
          {isNewCustomer
            ? 'We have sent your confirmation email. Next step: Please complete the mandatory customer intake form below before our visit.'
            : 'Welcome back! Your intake information is already on file and your service schedule is set.'}
        </p>
      </div>

      {/* Ticket card */}
      <div className={styles.ticketCard}>
        <div className={styles.ticketHeader}>
          <span className={styles.ticketIcon}>
            <ClipboardIcon />
          </span>
          <h3 className={styles.ticketTitle}>Booking Confirmation</h3>
        </div>

        {/* Reference badge */}
        <div className={styles.refBadge}>
          <span className={styles.refLabel}>Booking Reference</span>
          <span className={styles.refCode}>{bookingRef}</span>
        </div>

        {/* Confirmation details */}
        <div className={styles.confirmList}>
          <div className={styles.confirmRow}>
            <span className={styles.confirmRowIcon}>
              <ServiceIcon />
            </span>
            <span className={styles.confirmRowLabel}>Selected Service</span>
            <span className={styles.confirmRowValue}>{serviceName}</span>
          </div>

          <div className={styles.confirmRow}>
            <span className={styles.confirmRowIcon}>
              <CalendarIcon />
            </span>
            <span className={styles.confirmRowLabel}>Date and Time</span>
            <span className={styles.confirmRowValue}>{dateDisplay}</span>
          </div>

          <div className={styles.confirmRow}>
            <span className={styles.confirmRowIcon}>
              <PriceTagIcon />
            </span>
            <span className={styles.confirmRowLabel}>Total Amount</span>
            <span className={styles.confirmRowValueHighlight}>${totalPrice.toFixed(2)}</span>
          </div>

          <div className={styles.confirmRow}>
            <span className={styles.confirmRowIcon}>
              <CreditCardIcon />
            </span>
            <span className={styles.confirmRowLabel}>Payment Status</span>
            <span className={styles.confirmRowValue}>{paymentStatusText}</span>
          </div>

          <div className={styles.confirmRow}>
            <span className={styles.confirmRowIcon}>
              <CheckCircleIcon />
            </span>
            <span className={styles.confirmRowLabel}>Booking Status</span>
            <span className={styles.confirmRowValue}>
              {isNewCustomer ? 'Pending Meet & Greet' : 'Confirmed'}
            </span>
          </div>

          {isNewCustomer && meetGreetDate && (
            <div className={styles.confirmRow}>
              <span className={styles.confirmRowIcon}>
                <UsersIcon />
              </span>
              <span className={styles.confirmRowLabel}>Meet &amp; Greet</span>
              <span className={styles.confirmRowValue}>
                {meetGreetDate}
                {meetGreetAddress && ` | ${meetGreetAddress}`}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className={styles.actionBtns}>
          {isNewCustomer ? (
            <button className={styles.btnIntake} onClick={handleGoToIntake}>
              Complete Mandatory Intake Form &rarr;
            </button>
          ) : (
            <button className={styles.btnIntake} onClick={() => router.push('/')}>
              Return to Homepage
            </button>
          )}
          <button
            className={styles.btnViewDetails}
            onClick={() => router.push('/')}
          >
            Finished
          </button>
        </div>
      </div>
    </div>
  );
}
