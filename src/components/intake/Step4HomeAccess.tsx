'use client';

import React from 'react';
import styles from './Step4HomeAccess.module.css';

export interface HomeAccessData {
  primaryEntryMethod: string;
  secondaryEntryMethod: string;
  entryInstructions: string;
  doorCode: string;
  garageCode: string;
  alarmCode: string;
  keyLockboxLocation: string;
  parkingInstructions: string;
  additionalHomeNotes: string;
}

interface Step4HomeAccessProps {
  data: HomeAccessData;
  onChange: (data: Partial<HomeAccessData>) => void;
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

const LockIcon = () => (
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
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

export default function Step4HomeAccess({ data, onChange, onNext, onBack }: Step4HomeAccessProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Home Access Instructions</h2>
        <p className={styles.subtitle}>
          How should we access your home? Provide the instructions needed to enter your home safely
          for scheduled services.
        </p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Primary entry method</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={data.primaryEntryMethod}
              onChange={(e) => onChange({ primaryEntryMethod: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Front Door Keypad">Front Door Keypad</option>
              <option value="Garage Keypad">Garage Keypad</option>
              <option value="Lockbox">Lockbox</option>
              <option value="Physical Key Under Mat / Hidden">Physical Key Hidden</option>
              <option value="Smart Lock / App">Smart Lock / App</option>
              <option value="Concierge / Doorman">Concierge / Doorman</option>
              <option value="Other">Other</option>
            </select>
            <span className={styles.selectChevron}>
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Secondary entry method</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={data.secondaryEntryMethod}
              onChange={(e) => onChange({ secondaryEntryMethod: e.target.value })}
            >
              <option value="">Select</option>
              <option value="None">None</option>
              <option value="Front Door Keypad">Front Door Keypad</option>
              <option value="Garage Keypad">Garage Keypad</option>
              <option value="Lockbox">Lockbox</option>
              <option value="Physical Key Hidden">Physical Key Hidden</option>
              <option value="Back / Side Door">Back / Side Door</option>
              <option value="Other">Other</option>
            </select>
            <span className={styles.selectChevron}>
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Entry instructions</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.entryInstructions}
            onChange={(e) => onChange({ entryInstructions: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Door code</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.doorCode}
            onChange={(e) => onChange({ doorCode: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Garage code</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.garageCode}
            onChange={(e) => onChange({ garageCode: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Alarm code or instructions</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.alarmCode}
            onChange={(e) => onChange({ alarmCode: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Key or lockbox location</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.keyLockboxLocation}
            onChange={(e) => onChange({ keyLockboxLocation: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Parking instructions</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.parkingInstructions}
            onChange={(e) => onChange({ parkingInstructions: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Additional home notes</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.additionalHomeNotes}
            onChange={(e) => onChange({ additionalHomeNotes: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.securityBanner}>
        <span className={styles.securityIcon}>
          <LockIcon />
        </span>
        <span>
          <strong className={styles.securityMessageBold}>Security message</strong>
          Your home-access information will be stored securely and shown only within the private
          admin dashboard.
        </span>
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
