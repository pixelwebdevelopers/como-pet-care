'use client';

import React from 'react';
import styles from './CustomerModal.module.css';

// --- TSX TYPES & INTERFACES ---
interface CustomerModalProps {
  onSelectCustomerType: (isNew: boolean) => void;
}

// User Avatar SVG Icon
const UserAvatarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '24px', height: '24px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

export default function CustomerModal({ onSelectCustomerType }: CustomerModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.avatarCircle}>
          <UserAvatarIcon />
        </div>

        <h3 className={styles.heading}>Are you a new or existing customer?</h3>

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.btnNew}
            onClick={() => onSelectCustomerType(true)}
          >
            New Customer
          </button>
          <button
            type="button"
            className={styles.btnExisting}
            onClick={() => onSelectCustomerType(false)}
          >
            Existing Customer
          </button>
        </div>
      </div>
    </div>
  );
}
