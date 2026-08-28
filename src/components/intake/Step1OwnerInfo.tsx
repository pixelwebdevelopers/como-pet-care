'use client';

import React from 'react';
import styles from './Step1OwnerInfo.module.css';

export interface OwnerInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceAddress: string;
  confirmColumbiaResidency: boolean;
}

interface Step1OwnerInfoProps {
  data: OwnerInfoData;
  onChange: (data: Partial<OwnerInfoData>) => void;
  onNext: () => void;
  onBackToBooking: () => void;
}

const LeftArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

export default function Step1OwnerInfo({
  data,
  onChange,
  onNext,
  onBackToBooking,
}: Step1OwnerInfoProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Owner Information</h2>
        <p className={styles.subtitle}>
          Make sure we have the correct contact and service details for your booking.
        </p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email Address</label>
          <input
            type="email"
            className={styles.input}
            placeholder="Enter here"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number</label>
          <input
            type="tel"
            className={styles.input}
            placeholder="Enter here"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroupFull}>
          <label className={styles.label}>Service Address</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.serviceAddress}
            onChange={(e) => onChange({ serviceAddress: e.target.value })}
            required
          />
        </div>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          className={styles.checkboxInput}
          checked={data.confirmColumbiaResidency}
          onChange={(e) => onChange({ confirmColumbiaResidency: e.target.checked })}
        />
        <span className={styles.checkboxLabel}>
          Confirming residence in Columbia, Missouri, Addresses outside the service area should not
          be bookable.
        </span>
      </label>

      <div className={styles.buttonsRow}>
        <button type="button" className={styles.btnBackToBooking} onClick={onBackToBooking}>
          <LeftArrowIcon /> Back to Booking
        </button>
        <button type="submit" className={styles.btnContinue}>
          Continue
        </button>
      </div>
    </form>
  );
}
