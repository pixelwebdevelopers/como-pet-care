'use client';

import React from 'react';
import styles from './Step5EmergencyContact.module.css';

export interface EmergencyContactData {
  primaryName: string;
  primaryRelationship: string;
  primaryPhone: string;
  primaryEmail: string;
  secondaryName: string;
  secondaryRelationship: string;
  secondaryPhone: string;
  vetAuthorization: string;
  altKeyHolder: string;
  emergencyNotes: string;
}

interface Step5EmergencyContactProps {
  data: EmergencyContactData;
  onChange: (data: Partial<EmergencyContactData>) => void;
  onNext: () => void;
  onBack: () => void;
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

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export default function Step5EmergencyContact({
  data,
  onChange,
  onNext,
  onBack,
}: Step5EmergencyContactProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Emergency Contact</h2>
        <p className={styles.subtitle}>
          Provide trusted contacts who can make decisions or assist if you cannot be reached.
        </p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Primary emergency contact name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.primaryName}
            onChange={(e) => onChange({ primaryName: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Relationship</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Neighbor, Family member"
            value={data.primaryRelationship}
            onChange={(e) => onChange({ primaryRelationship: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone number</label>
          <input
            type="tel"
            className={styles.input}
            placeholder="Enter here"
            value={data.primaryPhone}
            onChange={(e) => onChange({ primaryPhone: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            placeholder="Enter here"
            value={data.primaryEmail}
            onChange={(e) => onChange({ primaryEmail: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Secondary emergency contact name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.secondaryName}
            onChange={(e) => onChange({ secondaryName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Relationship</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.secondaryRelationship}
            onChange={(e) => onChange({ secondaryRelationship: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone number</label>
          <input
            type="tel"
            className={styles.input}
            placeholder="Enter here"
            value={data.secondaryPhone}
            onChange={(e) => onChange({ secondaryPhone: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Authorized for emergency vet decisions?</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={data.vetAuthorization}
              onChange={(e) => onChange({ vetAuthorization: e.target.value })}
            >
              <option value="Yes - Full Authorization">Yes - Full Authorization</option>
              <option value="Up to $500">Up to $500</option>
              <option value="Up to $1000">Up to $1000</option>
              <option value="No - Contact Me First">No - Contact Me First</option>
            </select>
            <span className={styles.selectChevron}>
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Alternative local key holder</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.altKeyHolder}
            onChange={(e) => onChange({ altKeyHolder: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Emergency instructions or notes</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.emergencyNotes}
            onChange={(e) => onChange({ emergencyNotes: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.buttonsRow}>
        <button type="button" className={styles.btnBack} onClick={onBack}>
          <LeftArrowIcon /> Back
        </button>
        <button type="submit" className={styles.btnContinue}>
          Continue
        </button>
      </div>
    </form>
  );
}
