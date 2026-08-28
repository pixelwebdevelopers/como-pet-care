'use client';

import React from 'react';
import styles from './Step2PetDetails.module.css';

export interface SinglePetData {
  id: string;
  petType: string;
  petName: string;
  breed: string;
  age: string;
  optionalPetPhoto: string;
  feedingRoutine: string;
  exerciseRoutine: string;
  temperamentNotes: string;
  generalCareInstructions: string;
}

interface Step2PetDetailsProps {
  pets: SinglePetData[];
  onChangePets: (pets: SinglePetData[]) => void;
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

export default function Step2PetDetails({
  pets,
  onChangePets,
  onNext,
  onBack,
}: Step2PetDetailsProps) {
  const handlePetFieldChange = (index: number, field: keyof SinglePetData, value: string) => {
    const updated = [...pets];
    updated[index] = { ...updated[index], [field]: value };
    onChangePets(updated);
  };

  const handleAddPet = () => {
    const newPet: SinglePetData = {
      id: String(Date.now()),
      petType: '',
      petName: '',
      breed: '',
      age: '',
      optionalPetPhoto: '',
      feedingRoutine: '',
      exerciseRoutine: '',
      temperamentNotes: '',
      generalCareInstructions: '',
    };
    onChangePets([...pets, newPet]);
  };

  const handleRemovePet = (index: number) => {
    if (pets.length <= 1) return;
    const updated = pets.filter((_, i) => i !== index);
    onChangePets(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Pet Details</h2>
        <p className={styles.subtitle}>
          Tell us about your pet. Share the basic details, personality, and routine we should know
          before providing care.
        </p>
      </div>

      {pets.map((pet, idx) => (
        <div key={pet.id || idx} className={styles.petCard}>
          {pets.length > 1 && (
            <div className={styles.petCardHeader}>
              <span className={styles.petCardTitle}>
                Pet #{idx + 1} {pet.petName ? `(${pet.petName})` : ''}
              </span>
              <button
                type="button"
                className={styles.btnRemovePet}
                onClick={() => handleRemovePet(idx)}
              >
                ✕ Remove Pet
              </button>
            </div>
          )}

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Pet type</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter here"
                value={pet.petType}
                onChange={(e) => handlePetFieldChange(idx, 'petType', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Pet name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter here"
                value={pet.petName}
                onChange={(e) => handlePetFieldChange(idx, 'petName', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Breed</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter here"
                value={pet.breed}
                onChange={(e) => handlePetFieldChange(idx, 'breed', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Age</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter here"
                value={pet.age}
                onChange={(e) => handlePetFieldChange(idx, 'age', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Optional pet photo</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter here"
                value={pet.optionalPetPhoto}
                onChange={(e) => handlePetFieldChange(idx, 'optionalPetPhoto', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Feeding routine</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter here"
                value={pet.feedingRoutine}
                onChange={(e) => handlePetFieldChange(idx, 'feedingRoutine', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Exercise or walking routine</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter here"
                value={pet.exerciseRoutine}
                onChange={(e) => handlePetFieldChange(idx, 'exerciseRoutine', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Temperament and behaviour notes</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter here"
                value={pet.temperamentNotes}
                onChange={(e) => handlePetFieldChange(idx, 'temperamentNotes', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>General care instructions</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter here"
                value={pet.generalCareInstructions}
                onChange={(e) =>
                  handlePetFieldChange(idx, 'generalCareInstructions', e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <div className={styles.addPetRow}>
        <button type="button" className={styles.btnAddPet} onClick={handleAddPet}>
          <span className={styles.addIconCircle}>+</span> Add Another Pet
        </button>
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
