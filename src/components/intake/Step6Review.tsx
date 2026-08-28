'use client';

import React, { useState } from 'react';
import styles from './Step6Review.module.css';
import { OwnerInfoData } from './Step1OwnerInfo';
import { SinglePetData } from './Step2PetDetails';
import { HealthCareData } from './Step3HealthCare';
import { HomeAccessData } from './Step4HomeAccess';
import { EmergencyContactData } from './Step5EmergencyContact';

interface Step6ReviewProps {
  ownerData: OwnerInfoData;
  pets: SinglePetData[];
  healthData: HealthCareData;
  homeAccessData: HomeAccessData;
  emergencyData: EmergencyContactData;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

// --- ICONS ---
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    style={{ width: '13px', height: '13px' }}
  >
    <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
  </svg>
);

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

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '15px', height: '15px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '15px', height: '15px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '15px', height: '15px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '15px', height: '15px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </svg>
);

const IdBadgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.364a4.125 4.125 0 0 0-6.338 0 .375.375 0 0 1-.295.136H4.875a.375.375 0 0 1-.375-.375v-.375c0-1.88 1.4-3.447 3.256-3.714a.375.375 0 0 1 .374.153 3.375 3.375 0 0 0 5.488 0 .375.375 0 0 1 .374-.153c1.856.267 3.256 1.834 3.256 3.714v.375a.375.375 0 0 1-.375.375h-.286a.375.375 0 0 1-.296-.136Z"
    />
  </svg>
);

const PawIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 512 512"
    style={{ width: '16px', height: '16px' }}
  >
    <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7.9 78.6 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v.1c0 .2 0 .4 0 .6v.7c-.1 2.9-.3 5.8-.8 8.6-5.4 32.5-35.3 56.3-71.2 56.3H136c-35.9 0-65.7-23.8-71.1-56.3-.5-2.8-.8-5.7-.8-8.6v-.7c0-.2 0-.4 0-.6v-.1c0-10.4 1.6-20.8 5.2-30.5zM381.7 96.8c32.9-10.6 46.9 16.4 32.6 96.8-14.3 42.9-51.7 69.1-84.4 58.5-32.9-10.6-46.9-53.9-32.6-96.8 14.3-42.9 51.7-69.1 84.4-58.5zM490.2 165.3c24.5 14 29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3-29.1-51.7-10.2-84.1 54-47.3 78.5-33.3z" />
  </svg>
);

const HeartPulseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

const HouseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

const EmergencyAlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
    />
  </svg>
);

const GenericDotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    style={{ width: '14px', height: '14px' }}
  >
    <circle cx="12" cy="12" r="4" />
  </svg>
);

export default function Step6Review({
  ownerData,
  pets,
  healthData,
  homeAccessData,
  emergencyData,
  onEditStep,
  onSubmit,
  onBack,
}: Step6ReviewProps) {
  const [confirmedAccuracy, setConfirmedAccuracy] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedAccuracy) {
      alert('Please confirm that the information provided is accurate.');
      return;
    }
    onSubmit();
  };

  const primaryPet = pets[0] || {
    petName: 'Bella',
    petType: 'Dog',
    breed: 'Golden Retriever',
    age: '4 years',
    feedingRoutine: 'Twice daily at 8:00 AM and 6:00 PM',
    exerciseRoutine: 'One morning walk and evening playtime',
    temperamentNotes: 'Friendly, energetic, and nervous around loud noises',
    generalCareInstructions: 'Keep Bella on a leash when outdoors',
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Review Your Information</h2>
        <p className={styles.subtitle}>
          Please check that everything is accurate before submitting the Intake Form.
        </p>
      </div>

      <div className={styles.reviewCard}>
        {/* 1. Owner Information */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <span className={styles.sectionIcon}>
                <IdBadgeIcon />
              </span>
              <span className={styles.sectionTitle}>1. Owner Information</span>
            </div>
            <button type="button" className={styles.btnEdit} onClick={() => onEditStep(1)}>
              <EditIcon /> Edit Details
            </button>
          </div>
          <div className={styles.rowsList}>
            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <UserIcon />
                </span>
                <span>Name</span>
              </div>
              <span className={styles.rowValue}>
                {ownerData.firstName || ownerData.lastName
                  ? `${ownerData.firstName} ${ownerData.lastName}`.trim()
                  : 'Hassan Mubashar'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <MailIcon />
                </span>
                <span>Email</span>
              </div>
              <span className={styles.rowValue}>{ownerData.email || 'johndoe@gmail.com'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <PhoneIcon />
                </span>
                <span>Phone Number</span>
              </div>
              <span className={styles.rowValue}>{ownerData.phone || '+1 (573) 000-0000'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <LocationIcon />
                </span>
                <span>Service Address</span>
              </div>
              <span className={styles.rowValue}>
                {ownerData.serviceAddress || '123 Main Street, Columbia, Missouri'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Pet Details */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <span className={styles.sectionIcon}>
                <PawIcon />
              </span>
              <span className={styles.sectionTitle}>
                2. Pet Details{pets.length > 1 ? ` (${pets.length} pets)` : ''}
              </span>
            </div>
            <button type="button" className={styles.btnEdit} onClick={() => onEditStep(2)}>
              <EditIcon /> Edit Details
            </button>
          </div>
          <div className={styles.rowsList}>
            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Pet Name</span>
              </div>
              <span className={styles.rowValue}>{primaryPet.petName || 'Bella'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Pet type</span>
              </div>
              <span className={styles.rowValue}>{primaryPet.petType || 'Dog'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Breed</span>
              </div>
              <span className={styles.rowValue}>{primaryPet.breed || 'Golden Retriever'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Age</span>
              </div>
              <span className={styles.rowValue}>{primaryPet.age || '4 years'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Feeding routine</span>
              </div>
              <span className={styles.rowValue}>
                {primaryPet.feedingRoutine || 'Twice daily at 8:00 AM and 6:00 PM'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Exercise routine</span>
              </div>
              <span className={styles.rowValue}>
                {primaryPet.exerciseRoutine || 'One morning walk and evening playtime'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Behaviour notes</span>
              </div>
              <span className={styles.rowValue}>
                {primaryPet.temperamentNotes ||
                  'Friendly, energetic, and nervous around loud noises'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Care instructions</span>
              </div>
              <span className={styles.rowValue}>
                {primaryPet.generalCareInstructions || 'Keep Bella on a leash when outdoors'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Health & Veterinary Care */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <span className={styles.sectionIcon}>
                <HeartPulseIcon />
              </span>
              <span className={styles.sectionTitle}>3. Health &amp; Veterinary Care</span>
            </div>
            <button type="button" className={styles.btnEdit} onClick={() => onEditStep(3)}>
              <EditIcon /> Edit Details
            </button>
          </div>
          <div className={styles.rowsList}>
            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Medications</span>
              </div>
              <span className={styles.rowValue}>
                {healthData.takesMedication === 'Yes'
                  ? `${healthData.medicationName || 'Medication'} (${healthData.dosageInstructions || 'Instructions provided'})`
                  : 'None'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Known allergies</span>
              </div>
              <span className={styles.rowValue}>{healthData.knownAllergies || 'Chicken'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Medical conditions</span>
              </div>
              <span className={styles.rowValue}>
                {healthData.medicalConditions || 'None reported'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Veterinarian</span>
              </div>
              <span className={styles.rowValue}>
                {healthData.veterinarianName || 'Columbia Pet Hospital'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <PhoneIcon />
                </span>
                <span>Veterinary phone</span>
              </div>
              <span className={styles.rowValue}>
                {healthData.veterinaryPhone || '(573) 000-0000'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Additional health notes</span>
              </div>
              <span className={styles.rowValue}>
                {healthData.additionalHealthNotes || 'Avoid treats containing chicken'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Home Access Instructions */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <span className={styles.sectionIcon}>
                <HouseIcon />
              </span>
              <span className={styles.sectionTitle}>4. Home Access Instructions</span>
            </div>
            <button type="button" className={styles.btnEdit} onClick={() => onEditStep(4)}>
              <EditIcon /> Edit Details
            </button>
          </div>
          <div className={styles.rowsList}>
            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Primary entry method</span>
              </div>
              <span className={styles.rowValue}>
                {homeAccessData.primaryEntryMethod || 'Front-door keypad'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Secondary entry method</span>
              </div>
              <span className={styles.rowValue}>
                {homeAccessData.secondaryEntryMethod || 'Lockbox'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Entry instructions</span>
              </div>
              <span className={styles.rowValue}>
                {homeAccessData.entryInstructions ||
                  'Enter through the front door and ensure it is locked'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Door Code</span>
              </div>
              <span className={styles.rowValue}>
                {homeAccessData.doorCode ? '******' : '******'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Garage code</span>
              </div>
              <span className={styles.rowValue}>{homeAccessData.garageCode || 'Not provided'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Alarm instructions</span>
              </div>
              <span className={styles.rowValue}>
                {homeAccessData.alarmCode || 'Disarm upon entry and reactivate before leaving'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Parking instructions</span>
              </div>
              <span className={styles.rowValue}>
                {homeAccessData.parkingInstructions || 'Use the driveway'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Additional notes</span>
              </div>
              <span className={styles.rowValue}>
                {homeAccessData.additionalHomeNotes || 'Please remove shoes inside'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Emergency Contact */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <span className={styles.sectionIcon}>
                <EmergencyAlertIcon />
              </span>
              <span className={styles.sectionTitle}>5. Emergency Contact</span>
            </div>
            <button type="button" className={styles.btnEdit} onClick={() => onEditStep(5)}>
              <EditIcon /> Edit Details
            </button>
          </div>
          <div className={styles.rowsList}>
            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <UserIcon />
                </span>
                <span>Name</span>
              </div>
              <span className={styles.rowValue}>{emergencyData.primaryName || 'John Smith'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Relationship</span>
              </div>
              <span className={styles.rowValue}>
                {emergencyData.primaryRelationship || 'Family member'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <PhoneIcon />
                </span>
                <span>Phone</span>
              </div>
              <span className={styles.rowValue}>
                {emergencyData.primaryPhone || '+1 (573) 000-0000'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <MailIcon />
                </span>
                <span>Email</span>
              </div>
              <span className={styles.rowValue}>
                {emergencyData.primaryEmail || 'john@gmail.com'}
              </span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Authorized to make care decisions</span>
              </div>
              <span className={styles.rowValue}>{emergencyData.vetAuthorization || 'Yes'}</span>
            </div>

            <div className={styles.dataRow}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.rowIcon}>
                  <GenericDotIcon />
                </span>
                <span>Emergency instructions</span>
              </div>
              <span className={styles.rowValue}>
                {emergencyData.emergencyNotes || 'Contact if the owner cannot be reached'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          className={styles.checkboxInput}
          checked={confirmedAccuracy}
          onChange={(e) => setConfirmedAccuracy(e.target.checked)}
        />
        <span className={styles.checkboxLabel}>
          I confirm that the information provided is complete and accurate to the best of my
          knowledge.
        </span>
      </label>

      {/* Note Banner */}
      <div className={styles.serviceInfoNote}>
        CoMo Pet Care will use this information to prepare for your scheduled service and provide
        safe, personalized care.
      </div>

      {/* Bottom Buttons */}
      <div className={styles.buttonsRow}>
        <button type="button" className={styles.btnBack} onClick={onBack}>
          <LeftArrowIcon /> Back
        </button>
        <button type="submit" className={styles.btnSubmit} disabled={!confirmedAccuracy}>
          Submit Intake Form
        </button>
      </div>
    </form>
  );
}
