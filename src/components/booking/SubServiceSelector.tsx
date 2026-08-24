'use client';

import React, { useState } from 'react';
import styles from './SubServiceSelector.module.css';

// --- TSX TYPES & INTERFACES ---
export interface PlanOption {
  id: string;
  title: string;
  description: string;
  priceText: string;
  savingText?: string;
  badge?: string;
}

interface SubServiceSelectorProps {
  serviceId: string;
  onSelectPlan: (plan: PlanOption) => void;
}

export default function SubServiceSelector({ serviceId, onSelectPlan }: SubServiceSelectorProps) {
  // Toggle for Dog Walking: '30min' vs '60min'
  const [walkLength, setWalkLength] = useState<'30min' | '60min'>('30min');

  // Selected Option local state (for active card highlighting)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const handleCardClick = (plan: PlanOption) => {
    setSelectedPlanId(plan.id);
    onSelectPlan(plan);
  };

  // --- DATA SEED MAPPINGS BY SERVICE ---

  // 1. Drop-In Visits
  const dropInPlans: PlanOption[] = [
    {
      id: 'drop_in_30',
      title: '30 Minute Visit',
      description:
        "A personalized 30-minute visit designed to keep your pet comfortable and cared for while you're away.",
      priceText: '$34',
    },
    {
      id: 'drop_in_60',
      title: '60 Minute Visit',
      description:
        "A personalized 60-minute visit designed to keep your pet comfortable and cared for while you're away.",
      priceText: '$44',
    },
  ];

  // 2. Pet Sitting
  const petSittingPlans: PlanOption[] = [
    {
      id: 'sitting_half_day',
      title: 'Half-Day Companion Visit',
      description: 'Up to 4 hours of personalized in-home care for your pet',
      priceText: '$69',
    },
    {
      id: 'sitting_full_day',
      title: 'Full-Day Companion Visit',
      description: 'Up to 8 hours of personalized in-home care for your pet',
      priceText: '$99',
    },
    {
      id: 'sitting_overnight',
      title: 'Overnight Stay',
      description: 'Full-day and overnight care for your pet',
      priceText: '$119/day',
      badge: 'Most popular',
    },
  ];

  // 3. Dog Walking
  const dogWalking30Plans: PlanOption[] = [
    {
      id: 'walk_30_onetime',
      title: 'One-Time Walk',
      description: 'Flexible single booking',
      priceText: '$34 / walk',
    },
    {
      id: 'walk_30_weekly',
      title: 'Weekly Plan',
      description: 'Choose 1–5 walks each week with weekly billing',
      priceText: 'From $29 / week',
      savingText: '(Save up to $51/Week)',
    },
    {
      id: 'walk_30_monthly',
      title: 'Monthly Plan',
      description: 'Choose 1–5 walks each week with monthly billing',
      priceText: 'From $104 / month',
      savingText: '(Save up to $251/Month)',
      badge: 'Most popular',
    },
    {
      id: 'walk_30_annual',
      title: 'Annual Plan',
      description: 'Choose 1–5 walks each week with annual billing',
      priceText: 'From $1,054 / year',
      savingText: '(Save up to $4,511/Year)',
      badge: 'Best long-term value',
    },
  ];

  const dogWalking60Plans: PlanOption[] = [
    {
      id: 'walk_60_onetime',
      title: 'One-Time Walk',
      description: 'Flexible single booking',
      priceText: '$44 / walk',
    },
    {
      id: 'walk_60_weekly',
      title: 'Weekly Plan',
      description: 'Choose 1–5 walks each week with weekly billing',
      priceText: 'From $39 / week',
      savingText: '(Save up to $61/Week)',
    },
    {
      id: 'walk_60_monthly',
      title: 'Monthly Plan',
      description: 'Choose 1–5 walks each week with monthly billing',
      priceText: 'From $144 / month',
      savingText: '(Save up to $301/Month)',
      badge: 'Most popular',
    },
    {
      id: 'walk_60_annual',
      title: 'Annual Plan',
      description: 'Choose 1–5 walks each week with annual billing',
      priceText: 'From $1,454 / year',
      savingText: '(Save up to $5,511/Year)',
      badge: 'Best long-term value',
    },
  ];

  // 4. Yard Poop Scooping
  const yardScoopPlans: PlanOption[] = [
    {
      id: 'scoop_onetime',
      title: 'One-Time Cleanup',
      description:
        'A thorough one-time cleanup that leaves your yard fresh, clean, and ready to enjoy.',
      priceText: '$49/Cleanup',
    },
    {
      id: 'scoop_weekly',
      title: 'Weekly Plan',
      description: 'Enjoy a consistently clean yard with scheduled once-weekly cleanups.',
      priceText: 'From $29/Week',
      savingText: '(Save $20/Week)',
    },
    {
      id: 'scoop_monthly',
      title: 'Monthly Plan',
      description:
        'The same reliable once-weekly cleanups with convenient monthly billing and savings.',
      priceText: 'From $104/Month',
      savingText: '(Save up to $92/Month)',
      badge: 'Most popular',
    },
    {
      id: 'scoop_annual',
      title: 'Annual Plan',
      description:
        'Year-round, once-weekly cleanups for a consistently clean yard without the hassle.',
      priceText: 'From $1,054/year',
      savingText: '(Save up to $1,494/Year)',
    },
  ];

  // RENDER HELPERS BASED ON SELECTION
  let currentTitle = '';
  let currentSubtitle = '';
  let currentPlans: PlanOption[] = [];
  let isDogWalking = false;

  switch (serviceId) {
    case '2': // Drop-In Visits
      currentTitle = 'Choose Your Visit Length';
      currentSubtitle =
        'Select the amount of time your pet needs for care, companionship, and attention at home.';
      currentPlans = dropInPlans;
      break;
    case '3': // Pet Sitting
      currentTitle = 'Choose The Right Level of Care';
      currentSubtitle =
        "Select the option that best fits your pet's routine and the length of time you'll be away.";
      currentPlans = petSittingPlans;
      break;
    case '4': // Dog Walking
      currentTitle = 'Choose Your Walk Length & Plan';
      currentSubtitle =
        "Choose the plan that best fits your dog's routine, energy, and weekly schedule.";
      currentPlans = walkLength === '30min' ? dogWalking30Plans : dogWalking60Plans;
      isDogWalking = true;
      break;
    case '5': // Yard Poop Scooping
      currentTitle = 'Choose Your Cleanup Plan';
      currentSubtitle =
        'Book a one-time cleanup or select recurring service to keep your yard consistently fresh.';
      currentPlans = yardScoopPlans;
      break;
    default:
      currentTitle = 'Choose Plan Option';
      currentSubtitle = 'Review available package options below.';
      currentPlans = [];
  }

  // Define grid class based on options length
  let gridClass = styles.optionsGrid;
  if (currentPlans.length === 3) {
    gridClass += ` ${styles.optionsGrid3Col}`;
  }

  return (
    <div className={styles.container}>
      {/* Title block */}
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>{currentTitle}</h2>
        <p className={styles.subtitle}>{currentSubtitle}</p>
      </div>

      {/* Length selector toggle (Only for Dog Walking) */}
      {isDogWalking && (
        <div className={styles.toggleWrapper}>
          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleButton} ${
                walkLength === '30min' ? styles.toggleActive : ''
              }`}
              onClick={() => setWalkLength('30min')}
            >
              30 minutes
            </button>
            <button
              className={`${styles.toggleButton} ${
                walkLength === '60min' ? styles.toggleActive : ''
              }`}
              onClick={() => setWalkLength('60min')}
            >
              60 minutes
            </button>
          </div>
        </div>
      )}

      {/* Plan options grid */}
      <div className={gridClass}>
        {currentPlans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          let cardClass = styles.optionCard;
          if (isSelected) cardClass += ` ${styles.optionCardSelected}`;

          return (
            <div key={plan.id} className={cardClass} onClick={() => handleCardClick(plan)}>
              <div className={styles.cardHeaderRow}>
                <h3 className={styles.cardTitle}>{plan.title}</h3>
                {plan.badge && <span className={styles.cardBadge}>{plan.badge}</span>}
              </div>

              <p className={styles.cardDescription}>{plan.description}</p>

              <div className={styles.priceWrapper}>
                <span className={styles.priceText}>{plan.priceText}</span>
                {plan.savingText && <span className={styles.savingText}>{plan.savingText}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
