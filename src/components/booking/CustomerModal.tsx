'use client';

import React, { useState } from 'react';
import styles from './CustomerModal.module.css';

// --- TSX TYPES & INTERFACES ---
export interface ExistingCustomerData {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isColumbiaResident?: boolean;
  pets?: Array<{
    name: string;
    type?: string;
    breed?: string;
    age?: string;
  }>;
}

interface CustomerModalProps {
  onSelectCustomerType: (isNew: boolean, existingData?: ExistingCustomerData) => void;
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
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/customers/lookup?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success && data.exists && data.customer) {
        onSelectCustomerType(false, data.customer);
      } else {
        // Customer not found or error, let them continue as existing and type details
        setStatusMessage('No account found for this email. You can still proceed or select New Customer.');
        setTimeout(() => {
          onSelectCustomerType(false, { email: email.trim() });
        }, 1200);
      }
    } catch {
      setLoading(false);
      onSelectCustomerType(false, { email: email.trim() });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.avatarCircle}>
          <UserAvatarIcon />
        </div>

        <h3 className={styles.heading}>Are you a new or existing customer?</h3>

        {!showEmailInput ? (
          <>
            <p className={styles.subtext}>
              New customers receive a complimentary Meet &amp; Greet prior to service. Returning clients can fast-track their booking.
            </p>
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
                onClick={() => setShowEmailInput(true)}
              >
                Existing Customer
              </button>
            </div>
          </>
        ) : (
          <form className={styles.lookupBox} onSubmit={handleLookup}>
            <p className={styles.subtext}>
              Enter your email address to pull up your profile, address, and pet information:
            </p>
            <input
              type="email"
              placeholder="Enter your account email"
              className={styles.lookupInput}
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            {statusMessage && <div className={styles.lookupStatus}>{statusMessage}</div>}
            <div className={styles.lookupActions}>
              <button type="submit" className={styles.lookupBtn} disabled={loading}>
                {loading ? 'Finding account...' : 'Find My Account'}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => onSelectCustomerType(false)}
              >
                Skip Lookup
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
