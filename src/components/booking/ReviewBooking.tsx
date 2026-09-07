'use client';

import React, { useState, useRef } from 'react';
import styles from './ReviewBooking.module.css';
import LegalDocumentModal from '@/components/legal/LegalDocumentModal';
import ElectronicSignaturePad from './ElectronicSignaturePad';
import { ShieldCheck, AlertCircle, ArrowRight, Lock } from 'lucide-react';

export interface LegalAgreementPayload {
  agreed: boolean;
  termsVersion: string;
  waiverVersion: string;
  signerLegalName: string;
  signatureImage: string | null;
}

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
  onContinueToPayment: (legalAgreement?: LegalAgreementPayload) => void;
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
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: '18px', height: '18px' }}
  >
    <path d="M12 2a3 3 0 0 0-3 3c0 .3.04.58.12.85A3 3 0 0 0 7 8.5c0 1.5.9 2.7 2.2 3.1-.1.4-.2.9-.2 1.4 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5c0-.5-.1-1-.2-1.4 1.3-.4 2.2-1.6 2.2-3.1a3 3 0 0 0-2.12-2.65c.08-.27.12-.55.12-.85a3 3 0 0 0-3-3 3 3 0 0 0-3 3z" />
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
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

// --- COMPONENT ---
export default function ReviewBooking({
  data,
  basePrice = 0,
  pricingBreakdown,
  onContinueToPayment,
  onEditService,
  onEditDates,
  onEditDetails,
}: ReviewBookingProps) {
  const legalSectionRef = useRef<HTMLDivElement | null>(null);

  // --- LEGAL AGREEMENT & SIGNATURE STATE ---
  const [agreedToLegal, setAgreedToLegal] = useState<boolean>(false);
  const [signatureData, setSignatureData] = useState<{
    legalName: string;
    signatureDataUrl: string | null;
    isComplete: boolean;
  }>({
    legalName: data.customerName || '',
    signatureDataUrl: null,
    isComplete: false,
  });
  const [legalError, setLegalError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'TERMS' | 'WAIVER'>('TERMS');

  const handleSignatureChange = React.useCallback(
    (sig: { legalName: string; signatureDataUrl: string | null; isComplete: boolean }) => {
      setSignatureData((prev) => {
        if (
          prev.legalName === sig.legalName &&
          prev.signatureDataUrl === sig.signatureDataUrl &&
          prev.isComplete === sig.isComplete
        ) {
          return prev;
        }
        return sig;
      });
    },
    []
  );

  const openDocumentModal = (tab: 'TERMS' | 'WAIVER', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalTab(tab);
    setModalOpen(true);
  };

  const scrollToLegalSection = () => {
    if (legalSectionRef.current) {
      legalSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContinue = () => {
    setLegalError(null);

    if (!agreedToLegal) {
      setLegalError(
        'Please agree to the Terms & Conditions and Pet Care Waiver before continuing.'
      );
      scrollToLegalSection();
      return;
    }

    if (!signatureData.legalName || signatureData.legalName.trim().length < 2) {
      setLegalError('Please provide your full legal name for the electronic signature.');
      scrollToLegalSection();
      return;
    }

    if (!signatureData.signatureDataUrl) {
      setLegalError('Please electronically draw or type your signature before continuing.');
      scrollToLegalSection();
      return;
    }

    onContinueToPayment({
      agreed: true,
      termsVersion: 'v1.0',
      waiverVersion: 'v1.0',
      signerLegalName: signatureData.legalName.trim(),
      signatureImage: signatureData.signatureDataUrl,
    });
  };

  // Pricing values from centralized breakdown or fallback calculation
  const computedBase = pricingBreakdown?.basePrice ?? basePrice;
  const additionalPetFee = pricingBreakdown?.additionalPetFee ?? 0;
  const puppySurcharge = pricingBreakdown?.puppySurcharge ?? 0;
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
  } else if (
    data.bookingDate &&
    data.bookingDate.trim().length > 0 &&
    data.bookingDate !== 'Not selected'
  ) {
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
          Please verify your service details, review the mandatory legal agreements, and provide
          your electronic signature to proceed to payment.
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
              <button type="button" className={styles.editBtn} onClick={onEditService}>
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
              <button type="button" className={styles.editBtn} onClick={onEditDates}>
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
              <button type="button" className={styles.editBtn} onClick={onEditDetails}>
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
              <button type="button" className={styles.editBtn} onClick={onEditDetails}>
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

          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Lock size={14} color="#059669" />
            <span>Sign the agreement below to continue to payment.</span>
          </div>
        </div>
      </div>

      {/* Mandatory Legal Agreement & Electronic Signature Section */}
      <div className={styles.legalSection} ref={legalSectionRef}>
        <div className={styles.legalHeader}>
          <span className={styles.legalHeaderIcon}>
            <ShieldCheck size={22} />
          </span>
          <div>
            <h3 className={styles.legalHeaderTitle}>Legal Agreement &amp; Electronic Signature</h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Required before payment. Both documents will apply to all services booked with CoMo Pet
              Care.
            </p>
          </div>
        </div>

        {/* Combined Agreement Checkbox */}
        <label
          className={`${styles.legalCheckboxWrapper} ${
            agreedToLegal ? styles.legalCheckboxWrapperChecked : ''
          }`}
        >
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={agreedToLegal}
            onChange={(e) => {
              setAgreedToLegal(e.target.checked);
              if (e.target.checked) setLegalError(null);
            }}
          />
          <p className={styles.legalText}>
            I agree to the{' '}
            <button
              type="button"
              className={styles.legalLink}
              onClick={(e) => openDocumentModal('TERMS', e)}
            >
              Terms &amp; Conditions
            </button>{' '}
            and{' '}
            <button
              type="button"
              className={styles.legalLink}
              onClick={(e) => openDocumentModal('WAIVER', e)}
            >
              Pet Care Waiver &amp; Release of Liability
            </button>
            . I understand that checking this box constitutes my electronic agreement to these
            documents and that they apply to the services I am booking with CoMo Pet Care.
          </p>
        </label>

        {/* Electronic Signature Flow */}
        <ElectronicSignaturePad
          initialName={data.customerName}
          onSignatureChange={handleSignatureChange}
        />

        {/* Legal Error Banner */}
        {legalError && (
          <div className={styles.legalErrorBanner}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{legalError}</span>
          </div>
        )}

        {/* Final Continue Button */}
        <div style={{ marginTop: '0.75rem' }}>
          <button
            type="button"
            className={`${styles.btnContinue} ${
              !agreedToLegal || !signatureData.isComplete ? styles.btnContinueDisabled : ''
            }`}
            onClick={handleContinue}
          >
            <span>Accept &amp; Continue to Payment (${totalPrice.toFixed(2)})</span>
            <ArrowRight size={18} />
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '10px',
              fontSize: '12px',
              color: '#64748b',
            }}
          >
            <Lock size={12} color="#059669" />
            <span>256-bit SSL Encrypted • 100% Refundable up to 48 hrs before service</span>
          </div>
        </div>
      </div>

      {/* In-app Document Viewer Modal */}
      <LegalDocumentModal
        isOpen={modalOpen}
        initialTab={modalTab}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
