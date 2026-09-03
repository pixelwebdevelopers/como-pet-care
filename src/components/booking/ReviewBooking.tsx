'use client';

import React from 'react';
import styles from './ReviewBooking.module.css';

// --- TYPES ---
export interface ReviewBookingData {
  serviceId?: string;
  serviceName: string;
  planId?: string;
  planTitle: string;
  bookingDate: string;
  bookingEndDate?: string;
  startTime?: string;
  endTime?: string;
  walkFrequency?: string;
  preferredWeekdays?: string[];
  numberOfDays: number;
  durationLabel?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  petName: string;
  petType: string;
  petBreed: string;
  petAge: string;
  additionalPets: number;
  puppiesCount: number;
  specialNotes?: string;
}

interface ReviewBookingProps {
  data: ReviewBookingData;
  basePrice?: number;
  pricingBreakdown?: {
    numberOfDays: number;
    durationLabel: string;
    basePrice: number;
    additionalPetFee: number;
    additionalPetFeePerPet: number;
    puppySurcharge: number;
    holidaySurcharge: number;
    holidayName?: string;
    totalPrice: number;
  };
  onContinueToPayment: () => void;
  onEditService: () => void;
  onEditDates: () => void;
  onEditDetails: () => void;
}

// --- ICONS ---
const ClipboardIcon = () => (
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
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
    />
  </svg>
);

const PencilSquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

const ServiceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const HashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
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
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
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

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '13px', height: '13px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z"
    />
  </svg>
);

// --- COMPONENT ---
export default function ReviewBooking({
  data,
  basePrice = 34,
  pricingBreakdown,
  onContinueToPayment,
  onEditService,
  onEditDates,
  onEditDetails,
}: ReviewBookingProps) {
  // Pricing values from centralized breakdown or fallback calculation
  const computedBase = pricingBreakdown?.basePrice ?? basePrice;
  const additionalPetFee =
    pricingBreakdown?.additionalPetFee ?? (data.additionalPets > 0 ? data.additionalPets * 10 : 0);
  const puppySurcharge =
    pricingBreakdown?.puppySurcharge ?? (data.puppiesCount > 0 ? data.puppiesCount * 15 : 0);
  const holidaySurcharge = pricingBreakdown?.holidaySurcharge ?? 0;
  const holidayName = pricingBreakdown?.holidayName;
  const totalPrice =
    pricingBreakdown?.totalPrice ??
    computedBase + additionalPetFee + puppySurcharge + holidaySurcharge;

  const durationLabel =
    pricingBreakdown?.durationLabel ||
    data.durationLabel ||
    (data.numberOfDays === 1 ? '1 Day' : `${data.numberOfDays} Days`);

  let dateDisplay = 'Not selected';
  if (data.bookingEndDate && data.bookingDate) {
    dateDisplay = `${data.bookingDate} - ${data.bookingEndDate}`;
  } else if (data.bookingDate && data.bookingDate.trim().length > 0 && data.bookingDate !== 'Not selected') {
    dateDisplay = data.bookingDate;
  } else if (data.preferredWeekdays && data.preferredWeekdays.length > 0) {
    const daysStr = data.preferredWeekdays.join(', ');
    dateDisplay = data.walkFrequency
      ? `${data.walkFrequency} (${daysStr})`
      : `Weekly • ${daysStr}`;
  } else if (data.walkFrequency) {
    dateDisplay = data.walkFrequency;
  }

  const timeDisplay = data.startTime
    ? data.endTime && data.endTime !== data.startTime
      ? ` • ${data.startTime} - ${data.endTime}`
      : ` • ${data.startTime}`
    : '';

  return (
    <div className={styles.container}>
      {/* Heading */}
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Review &amp; Secure Your Booking</h2>
        <p className={styles.subtitle}>
          Check your pet-sitting details and enter your payment information to submit the booking.
        </p>
      </div>

      {/* Two-column layout */}
      <div className={styles.columnsGrid}>
        {/* Left: Booking Summary */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelIcon}>
              <ClipboardIcon />
            </span>
            <h3 className={styles.panelTitle}>Booking Summary</h3>
          </div>

          <div className={styles.summaryList}>
            {/* Selected Service */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <ServiceIcon />
              </div>
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>Selected Service</div>
                <div className={styles.rowValue}>{data.planTitle || data.serviceName}</div>
              </div>
              <button className={styles.editBtn} onClick={onEditService}>
                <EditIcon /> Edit Services
              </button>
            </div>

            {/* Date and Time */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <CalendarIcon />
              </div>
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>Date and Time</div>
                <div className={styles.rowValue}>
                  {dateDisplay}
                  {timeDisplay}
                </div>
              </div>
              <button className={styles.editBtn} onClick={onEditDates}>
                <EditIcon /> Edit Dates
              </button>
            </div>

            {/* Duration / Units */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <HashIcon />
              </div>
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>Duration / Scope</div>
                <div className={styles.rowValue}>{durationLabel}</div>
              </div>
            </div>

            {/* Customer Information */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <UserIcon />
              </div>
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>Customer Information</div>
                <div className={styles.rowValue}>
                  {data.customerName || 'Customer'}
                  {data.customerEmail ? ` • ${data.customerEmail}` : ''}
                  {data.customerPhone ? ` • ${data.customerPhone}` : ''}
                  {data.customerAddress && (
                    <>
                      <br />
                      {data.customerAddress}
                    </>
                  )}
                </div>
              </div>
              <button className={styles.editBtn} onClick={onEditDetails}>
                <EditIcon /> Edit Details
              </button>
            </div>

            {/* Pet Information */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <PawIcon />
              </div>
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>Pet Information</div>
                <div className={styles.rowValue}>
                  {data.petName || 'Pet'}
                  {data.petType ? ` • ${data.petType}` : ''}
                  {data.petBreed ? ` • ${data.petBreed}` : ''}
                  {data.petAge ? ` • ${data.petAge}` : ''}
                  {data.additionalPets > 0 && (
                    <>
                      <br />
                      Plus {data.additionalPets} additional{' '}
                      {data.additionalPets === 1 ? 'pet' : 'pets'}
                    </>
                  )}
                  {data.puppiesCount > 0 && (
                    <>
                      <br />
                      Includes {data.puppiesCount}{' '}
                      {data.puppiesCount === 1 ? 'puppy (<1 year)' : 'puppies (<1 year)'}
                    </>
                  )}
                </div>
              </div>
              <button className={styles.editBtn} onClick={onEditDetails}>
                <EditIcon /> Edit Details
              </button>
            </div>
          </div>
        </div>

        {/* Right: Pricing Summary */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelIcon}>
              <PencilSquareIcon />
            </span>
            <h3 className={styles.panelTitle}>Pricing Summary</h3>
          </div>

          <div className={styles.pricingList}>
            {/* Base Price */}
            <div className={styles.pricingRow}>
              <div className={styles.pricingLabel}>
                <span className={styles.pricingLabelMain}>Base Price</span>
                <span className={styles.pricingLabelSub}>{durationLabel}</span>
              </div>
              <span className={styles.pricingAmount}>${computedBase.toFixed(2)}</span>
            </div>

            {/* Additional Pet Fees */}
            <div className={styles.pricingRow}>
              <div className={styles.pricingLabel}>
                <span className={styles.pricingLabelMain}>Additional-Pet Fees</span>
                <span className={styles.pricingLabelSub}>
                  {data.additionalPets > 0
                    ? `${data.additionalPets} Additional ${
                        data.additionalPets === 1 ? 'Pet' : 'Pets'
                      }`
                    : 'First pet included'}
                </span>
              </div>
              <span className={styles.pricingAmount}>${additionalPetFee.toFixed(2)}</span>
            </div>

            {/* Puppy Surcharge */}
            <div className={styles.pricingRow}>
              <div className={styles.pricingLabel}>
                <span className={styles.pricingLabelMain}>Puppy Surcharge</span>
                <span className={styles.pricingLabelSub}>
                  {data.puppiesCount > 0
                    ? `${data.puppiesCount} ${data.puppiesCount === 1 ? 'Puppy' : 'Puppies'} (<1 yr)`
                    : 'None'}
                </span>
              </div>
              <span className={styles.pricingAmount}>${puppySurcharge.toFixed(2)}</span>
            </div>

            {/* Holiday Surcharge */}
            <div className={styles.pricingRow}>
              <div className={styles.pricingLabel}>
                <span className={styles.pricingLabelMain}>Holiday Surcharge</span>
                <span className={styles.pricingLabelSub}>
                  {holidaySurcharge > 0
                    ? holidayName || 'Official US Holiday'
                    : 'Standard date (no surcharge)'}
                </span>
              </div>
              <span className={styles.pricingAmount}>${holidaySurcharge.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total Price</span>
            <span className={styles.totalAmount}>${totalPrice.toFixed(2)}</span>
          </div>

          <button className={styles.btnContinue} onClick={onContinueToPayment}>
            Continue to Payment <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
