'use client';

import React from 'react';
import styles from './Step3HealthCare.module.css';

export interface HealthCareData {
  takesMedication: string;
  medicationName: string;
  dosageInstructions: string;
  knownAllergies: string;
  medicalConditions: string;
  veterinarianName: string;
  veterinaryClinic: string;
  veterinaryPhone: string;
  additionalHealthNotes: string;
}

interface Step3HealthCareProps {
  data: HealthCareData;
  onChange: (data: Partial<HealthCareData>) => void;
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

export default function Step3HealthCare({ data, onChange, onNext, onBack }: Step3HealthCareProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Health &amp; Veterinary Care</h2>
        <p className={styles.subtitle}>
          Tell us about any medical needs or health considerations that may affect your pet&apos;s
          care.
        </p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Does your pet take medication?</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={data.takesMedication}
              onChange={(e) => onChange({ takesMedication: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <span className={styles.selectChevron}>
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Medication name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.medicationName}
            onChange={(e) => onChange({ medicationName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Dosage or instructions</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.dosageInstructions}
            onChange={(e) => onChange({ dosageInstructions: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Known allergies</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.knownAllergies}
            onChange={(e) => onChange({ knownAllergies: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Medical conditions</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.medicalConditions}
            onChange={(e) => onChange({ medicalConditions: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Veterinarian name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.veterinarianName}
            onChange={(e) => onChange({ veterinarianName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Veterinary clinic</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.veterinaryClinic}
            onChange={(e) => onChange({ veterinaryClinic: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Veterinary phone number</label>
          <input
            type="tel"
            className={styles.input}
            placeholder="Enter here"
            value={data.veterinaryPhone}
            onChange={(e) => onChange({ veterinaryPhone: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Additional health notes</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter here"
            value={data.additionalHealthNotes}
            onChange={(e) => onChange({ additionalHealthNotes: e.target.value })}
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
