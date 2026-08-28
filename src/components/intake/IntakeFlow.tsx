'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './IntakeFlow.module.css';

import Step1OwnerInfo, { OwnerInfoData } from './Step1OwnerInfo';
import Step2PetDetails, { SinglePetData } from './Step2PetDetails';
import Step3HealthCare, { HealthCareData } from './Step3HealthCare';
import Step4HomeAccess, { HomeAccessData } from './Step4HomeAccess';
import Step5EmergencyContact, { EmergencyContactData } from './Step5EmergencyContact';
import Step6Review from './Step6Review';
import IntakeSuccess from './IntakeSuccess';

const BackChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{ width: '14px', height: '14px', marginRight: '4px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

export default function IntakeFlow() {
  const router = useRouter();

  // Current active step: 1 to 6 or 7 ('success')
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State across all steps
  const [ownerData, setOwnerData] = useState<OwnerInfoData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceAddress: '',
    confirmColumbiaResidency: true,
  });

  const [pets, setPets] = useState<SinglePetData[]>([
    {
      id: 'pet_1',
      petType: '',
      petName: '',
      breed: '',
      age: '',
      optionalPetPhoto: '',
      feedingRoutine: '',
      exerciseRoutine: '',
      temperamentNotes: '',
      generalCareInstructions: '',
    },
  ]);

  const [healthData, setHealthData] = useState<HealthCareData>({
    takesMedication: '',
    medicationName: '',
    dosageInstructions: '',
    knownAllergies: '',
    medicalConditions: '',
    veterinarianName: '',
    veterinaryClinic: '',
    veterinaryPhone: '',
    additionalHealthNotes: '',
  });

  const [homeAccessData, setHomeAccessData] = useState<HomeAccessData>({
    primaryEntryMethod: '',
    secondaryEntryMethod: '',
    entryInstructions: '',
    doorCode: '',
    garageCode: '',
    alarmCode: '',
    keyLockboxLocation: '',
    parkingInstructions: '',
    additionalHomeNotes: '',
  });

  const [emergencyData, setEmergencyData] = useState<EmergencyContactData>({
    primaryName: '',
    primaryRelationship: '',
    primaryPhone: '',
    primaryEmail: '',
    secondaryName: '',
    secondaryRelationship: '',
    secondaryPhone: '',
    vetAuthorization: 'Yes - Full Authorization',
    altKeyHolder: '',
    emergencyNotes: '',
  });

  // Step indicator labels (Matching user designs exactly)
  const stepsList = [
    { id: 1, label: 'Owner Information' },
    { id: 2, label: 'Pet Details' },
    { id: 3, label: 'Health & Veterinary Care' },
    { id: 4, label: 'Home Access' },
    { id: 5, label: 'Emergency Contact' },
    { id: 6, label: 'Review' },
  ];

  // Navigation handlers
  const handleHeaderBack = () => {
    if (currentStep > 1 && currentStep <= 6) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.push('/booking');
    }
  };

  const handleStep1Back = () => {
    router.push('/booking');
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmitIntake = () => {
    // Persist or submit intake form data
    setCurrentStep(7);
  };

  return (
    <div className={styles.intakePage}>
      {/* Header: Centered Logo + Back Button (Matching Booking Flow) */}
      <header className={styles.header}>
        <div className={styles.headerSpacer} />
        <div className={styles.logoContainer}>
          <Image
            src="/assets/como-logo.png"
            alt="CoMo Pet Care Logo"
            width={120}
            height={34}
            priority
          />
        </div>
        <button type="button" className={styles.btnBackHeader} onClick={handleHeaderBack}>
          <BackChevronIcon /> Back
        </button>
      </header>

      {/* Main Container */}
      <main className={styles.mainContainer}>
        <div className={styles.cardFrame}>
          {/* Top Form Title */}
          <h1 className={styles.intakeTopTitle}>
            {currentStep === 7 ? 'Intake Form Completed' : 'Intake Form'}
          </h1>

          {/* 6-Step Indicator */}
          <div className={styles.stepsIndicator}>
            {stepsList.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id || currentStep === 7;

              let itemClass = styles.stepItem;
              if (isActive) itemClass += ` ${styles.stepItemActive}`;
              else if (isCompleted) itemClass += ` ${styles.stepItemCompleted}`;

              return (
                <div key={step.id} className={itemClass}>
                  <div className={styles.stepCircle}>{step.id}</div>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Step 1: Owner Information */}
          {currentStep === 1 && (
            <Step1OwnerInfo
              data={ownerData}
              onChange={(updated) => setOwnerData((prev) => ({ ...prev, ...updated }))}
              onNext={handleNextStep}
              onBackToBooking={handleStep1Back}
            />
          )}

          {/* Step 2: Pet Details */}
          {currentStep === 2 && (
            <Step2PetDetails
              pets={pets}
              onChangePets={setPets}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
            />
          )}

          {/* Step 3: Health & Veterinary Care */}
          {currentStep === 3 && (
            <Step3HealthCare
              data={healthData}
              onChange={(updated) => setHealthData((prev) => ({ ...prev, ...updated }))}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
            />
          )}

          {/* Step 4: Home Access Instructions */}
          {currentStep === 4 && (
            <Step4HomeAccess
              data={homeAccessData}
              onChange={(updated) => setHomeAccessData((prev) => ({ ...prev, ...updated }))}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
            />
          )}

          {/* Step 5: Emergency Contact */}
          {currentStep === 5 && (
            <Step5EmergencyContact
              data={emergencyData}
              onChange={(updated) => setEmergencyData((prev) => ({ ...prev, ...updated }))}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
            />
          )}

          {/* Step 6: Review & Final Submission */}
          {currentStep === 6 && (
            <Step6Review
              ownerData={ownerData}
              pets={pets}
              healthData={healthData}
              homeAccessData={homeAccessData}
              emergencyData={emergencyData}
              onEditStep={(stepNum) => setCurrentStep(stepNum)}
              onSubmit={handleSubmitIntake}
              onBack={handlePreviousStep}
            />
          )}

          {/* Step 7: Completed Success Screen */}
          {currentStep === 7 && (
            <IntakeSuccess petName={pets[0]?.petName || 'Bella'} bookingRef="CPC-1048" />
          )}
        </div>
      </main>
    </div>
  );
}
