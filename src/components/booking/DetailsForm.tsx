'use client';

import React, { useState } from 'react';
import styles from './DetailsForm.module.css';

// --- TSX TYPES & INTERFACES ---
interface DetailsFormProps {
  onContinue: (details: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    columbiaConfirmed: boolean;
    petName: string;
    petType: string;
    petBreed: string;
    petAge: string;
    additionalPets: string;
    puppiesCount: string;
    specialNotes: string;
  }) => void;
}

// User SVGs
const UserIcon = () => (
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
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const PawIcon = () => (
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
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582"
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

export default function DetailsForm({ onContinue }: DetailsFormProps) {
  // Input fields hook states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [columbiaConfirmed, setColumbiaConfirmed] = useState(false);

  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [additionalPets, setAdditionalPets] = useState('');
  const [puppiesCount, setPuppiesCount] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !address || !petName) {
      alert('Please fill out all required fields marked in customer and pet details.');
      return;
    }
    if (!columbiaConfirmed) {
      alert('Please confirm that your service address lies within Columbia, Missouri.');
      return;
    }
    onContinue({
      firstName,
      lastName,
      email,
      phone,
      address,
      columbiaConfirmed,
      petName,
      petType,
      petBreed,
      petAge,
      additionalPets,
      puppiesCount,
      specialNotes,
    });
  };

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Customer &amp; Pet Information</h2>
        <p className={styles.subtitle}>
          Enter your contact, service-address, and pet details so we can provide personalized care.
        </p>
      </div>

      {/* Two Column Form */}
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.columnsGrid}>
          {/* Column 1: Customer Information */}
          <div className={styles.column}>
            <h3 className={styles.colHeader}>
              <UserIcon />
              1. Customer Information
            </h3>

            <div className={styles.fieldsList}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter here"
                  className={styles.input}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter here"
                  className={styles.input}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter here"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="Enter here"
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Service Address</label>
                <input
                  type="text"
                  required
                  placeholder="Enter here"
                  className={styles.input}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="columbiaConfirmed"
                  className={styles.checkbox}
                  checked={columbiaConfirmed}
                  onChange={(e) => setColumbiaConfirmed(e.target.checked)}
                />
                <label htmlFor="columbiaConfirmed" className={styles.checkboxLabel}>
                  I Confirm that my service area is within Columbia, Missouri
                </label>
              </div>
            </div>
          </div>

          {/* Column 2: Pet Information */}
          <div className={styles.column}>
            <h3 className={styles.colHeader}>
              <PawIcon />
              2. Pet Information
            </h3>

            <div className={styles.fieldsList}>
              <div className={styles.fieldsRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Pet Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter here"
                    className={styles.input}
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Pet Type</label>
                  <input
                    type="text"
                    placeholder="Enter here"
                    className={styles.input}
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.fieldsRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Breed</label>
                  <input
                    type="text"
                    placeholder="Enter here"
                    className={styles.input}
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Age</label>
                  <input
                    type="text"
                    placeholder="Enter here"
                    className={styles.input}
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Number of Additional Pets</label>
                <input
                  type="text"
                  placeholder="Enter here"
                  className={styles.input}
                  value={additionalPets}
                  onChange={(e) => setAdditionalPets(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Number of puppies requiring additional care</label>
                <input
                  type="text"
                  placeholder="Enter here"
                  className={styles.input}
                  value={puppiesCount}
                  onChange={(e) => setPuppiesCount(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Basic Care/Special Instruction Notes</label>
                <textarea
                  placeholder="Enter here"
                  className={`${styles.input} ${styles.textarea}`}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.btnContinue}>
                Continue <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
