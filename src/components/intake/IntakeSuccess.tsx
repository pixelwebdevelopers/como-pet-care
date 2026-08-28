'use client';

import React from 'react';
import Link from 'next/link';
import styles from './IntakeSuccess.module.css';

interface IntakeSuccessProps {
  petName?: string;
  bookingRef?: string;
  submittedDateTime?: string;
}

// --- ICONS ---
const ClipboardSummaryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
    />
  </svg>
);

const PetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 512 512"
    style={{ width: '16px', height: '16px' }}
  >
    <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7.9 78.6 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v.1c0 .2 0 .4 0 .6v.7c-.1 2.9-.3 5.8-.8 8.6-5.4 32.5-35.3 56.3-71.2 56.3H136c-35.9 0-65.7-23.8-71.1-56.3-.5-2.8-.8-5.7-.8-8.6v-.7c0-.2 0-.4 0-.6v-.1c0-10.4 1.6-20.8 5.2-30.5zM381.7 96.8c32.9-10.6 46.9 16.4 32.6 96.8-14.3 42.9-51.7 69.1-84.4 58.5-32.9-10.6-46.9-53.9-32.6-96.8 14.3-42.9 51.7-69.1 84.4-58.5zM490.2 165.3c24.5 14 29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3-29.1-51.7-10.2-84.1 54-47.3 78.5-33.3z" />
  </svg>
);

const FormStatusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

export default function IntakeSuccess({
  petName = 'Bella',
  bookingRef = 'CPC-1048',
  submittedDateTime = 'August 3, 2026 at 10:30 AM',
}: IntakeSuccessProps) {
  return (
    <div className={styles.container}>
      {/* Decorative Paw Prints Watermark */}
      <div className={styles.pawWatermarkLayer} />

      {/* Heading */}
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Your Pet Care Information Has Been Submitted</h2>
        <p className={styles.subtitle}>
          Thank you. Your Intake Form has been securely linked to your booking and pet profile.
        </p>
      </div>

      {/* Center Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardHeaderIcon}>
            <ClipboardSummaryIcon />
          </span>
          <h3 className={styles.cardHeaderTitle}>Confirmation Summary</h3>
        </div>

        {/* Booking Reference Box */}
        <div className={styles.refBox}>
          <span className={styles.refLabel}>Booking Reference</span>
          <span className={styles.refCode}>{bookingRef}</span>
        </div>

        {/* Rows */}
        <div className={styles.summaryRowsList}>
          <div className={styles.summaryRow}>
            <div className={styles.rowLeftGroup}>
              <span className={styles.rowIcon}>
                <PetIcon />
              </span>
              <span>Pet Name</span>
            </div>
            <span className={styles.rowValue}>{petName || 'Bella'}</span>
          </div>

          <div className={styles.summaryRow}>
            <div className={styles.rowLeftGroup}>
              <span className={styles.rowIcon}>
                <FormStatusIcon />
              </span>
              <span>Intake Form status</span>
            </div>
            <span className={styles.rowValueSuccess}>Completed</span>
          </div>

          <div className={styles.summaryRow}>
            <div className={styles.rowLeftGroup}>
              <span className={styles.rowIcon}>
                <ClockIcon />
              </span>
              <span>Submitted Date &amp; Time</span>
            </div>
            <span className={styles.rowValueSuccess}>{submittedDateTime}</span>
          </div>
        </div>

        {/* Advisory Box */}
        <div className={styles.noteBox}>
          CoMo Pet Care can now review your pet&apos;s routine, health information, emergency
          contact, and home-access instructions before the scheduled service.
        </div>

        {/* Buttons */}
        <div className={styles.actionBtns}>
          <Link href="/" className={styles.btnReturnHome}>
            Return to Home
          </Link>
          <Link href="/booking" className={styles.btnViewBooking}>
            View Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
