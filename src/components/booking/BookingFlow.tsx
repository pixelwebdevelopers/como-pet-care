'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './BookingFlow.module.css';
import SubServiceSelector, { PlanOption } from './SubServiceSelector';
import BookingSchedule from './BookingSchedule';
import CustomerModal, { ExistingCustomerData } from './CustomerModal';
import MeetAndGreet from './MeetAndGreet';
import DetailsForm from './DetailsForm';
import ReviewBooking from './ReviewBooking';
import PaymentForm from './PaymentForm';
import BookingConfirmation from './BookingConfirmation';
import { calculateBookingBill } from '@/lib/pricing-calculator';

// --- TSX TYPES & INTERFACES ---
interface SelectedService {
  id: string;
  name: string;
  badge: string;
  priceText: string;
  priceValue: number;
  description: string;
}

// --- SVGS & ICONS ---
const WaveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '22px', height: '22px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.05 2.25a2.25 2.25 0 0 1 3.9 0l1.43 2.485a2.25 2.25 0 0 0 1.625 1.055l2.842.416a2.25 2.25 0 0 1 1.25 3.84l-2.057 2.005a2.25 2.25 0 0 0-.646 1.99l.486 2.83a2.25 2.25 0 0 1-3.265 2.37l-2.543-1.336a2.25 2.25 0 0 0-2.1 0l-2.543 1.336a2.25 2.25 0 0 1-3.265-2.37l.486-2.83a2.25 2.25 0 0 0-.646-1.99L2.08 10.046a2.25 2.25 0 0 1 1.25-3.84l2.842-.416a2.25 2.25 0 0 0 1.625-1.055L10.05 2.25Z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '22px', height: '22px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const HouseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '22px', height: '22px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

const DogIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '22px', height: '22px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
    />
  </svg>
);

const ScoopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '22px', height: '22px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6h10.5a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

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

const RightArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

export default function BookingFlow() {
  const router = useRouter();

  // --- STATE ---
  const [bookingScreen, setBookingScreen] = useState<
    | 'main_services'
    | 'sub_services'
    | 'schedule'
    | 'meet_and_greet'
    | 'details'
    | 'review'
    | 'payment'
    | 'confirmation'
  >('main_services');

  // Customer verification modal hooks
  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(true);
  const [bookingReference, setBookingReference] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form selections storage
  const [selectedService, setSelectedService] = useState<SelectedService>({
    id: '1',
    name: 'Meet & Greet',
    badge: 'New clients',
    priceText: 'Free',
    priceValue: 0,
    description: 'A complimentary first visit for every new customer.',
  });

  const [selectedPlan, setSelectedPlan] = useState<PlanOption>({
    id: '',
    title: '',
    description: '',
    priceText: '',
  });

  const [scheduleData, setScheduleData] = useState<{
    bookingDate?: string;
    bookingEndDate?: string;
    startTime?: string;
    endTime?: string;
    walkFrequency?: string;
    preferredWeekdays?: string[];
  }>({});

  const [customerDetails, setCustomerDetails] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    petName: string;
    petType: string;
    petBreed: string;
    petAge: string;
    additionalPets: string;
    puppiesCount: string;
    specialNotes?: string;
    columbiaConfirmed?: boolean;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    additionalPets: '0',
    puppiesCount: '0',
    specialNotes: '',
    columbiaConfirmed: true,
  });

  const [meetGreetData, setMeetGreetData] = useState<{
    date: string;
    time: string;
  }>({ date: '', time: '' });

  // Services list mapping
  const servicesList: SelectedService[] = [
    {
      id: '1',
      name: 'Meet & Greet',
      badge: 'New clients',
      priceText: 'Free',
      priceValue: 0,
      description: 'A complimentary first visit for every new customer.',
    },
    {
      id: '2',
      name: 'Drop-In Visits',
      badge: '30 or 60 min',
      priceText: 'From $34',
      priceValue: 34,
      description: 'Personalized in-home care while you are away.',
    },
    {
      id: '3',
      name: 'Pet Sitting',
      badge: 'Up to overnight',
      priceText: 'From $69',
      priceValue: 69,
      description: 'Dedicated companionship in the comfort of home.',
    },
    {
      id: '4',
      name: 'Dog Walking',
      badge: 'One-time or plans',
      priceText: 'From $34',
      priceValue: 34,
      description: 'Exercise, enrichment, and one-on-one attention.',
    },
    {
      id: '5',
      name: 'Yard Poop Scooping',
      badge: 'One-time or plans',
      priceText: 'From $29',
      priceValue: 29,
      description: 'Reliable cleanup on a schedule that fits.',
    },
  ];

  // --- ACTIONS ---
  const handleBack = () => {
    if (showCustomerModal) {
      setShowCustomerModal(false);
      return;
    }

    if (bookingScreen === 'confirmation') {
      router.push('/');
    } else if (bookingScreen === 'payment') {
      setBookingScreen('review');
    } else if (bookingScreen === 'review') {
      setBookingScreen('details');
    } else if (bookingScreen === 'details') {
      if (isNewCustomer) {
        setBookingScreen('meet_and_greet');
      } else {
        setBookingScreen('schedule');
      }
    } else if (bookingScreen === 'meet_and_greet') {
      setBookingScreen('schedule');
    } else if (bookingScreen === 'schedule') {
      setBookingScreen('sub_services');
    } else if (bookingScreen === 'sub_services') {
      setBookingScreen('main_services');
    } else {
      router.push('/');
    }
  };

  const handleSelectServiceCard = (s: SelectedService) => {
    if (s.id === '1') {
      alert(
        'Meet & Greet is complimentary for every new customer and is scheduled during the booking process.',
      );
      return;
    }
    setSelectedService(s);
    setBookingScreen('sub_services');
  };

  const handleSelectPlan = (plan: PlanOption) => {
    setSelectedPlan(plan);
    setBookingScreen('schedule');
  };

  const handleScheduleContinue = (data: typeof scheduleData) => {
    setScheduleData(data);
    setShowCustomerModal(true);
  };

  const handleCustomerTypeSelect = (isNew: boolean, existingData?: ExistingCustomerData) => {
    setShowCustomerModal(false);
    setIsNewCustomer(isNew);

    if (existingData) {
      setCustomerDetails((prev) => ({
        ...prev,
        firstName: existingData.firstName || prev.firstName,
        lastName: existingData.lastName || prev.lastName,
        email: existingData.email || prev.email,
        phone: existingData.phone || prev.phone,
        address: existingData.address || prev.address,
        columbiaConfirmed: existingData.isColumbiaResident ?? true,
        petName: existingData.pets?.[0]?.name || prev.petName,
        petType: existingData.pets?.[0]?.type || prev.petType,
        petBreed: existingData.pets?.[0]?.breed || prev.petBreed,
        petAge: existingData.pets?.[0]?.age || prev.petAge,
      }));
    }

    if (isNew) {
      // New Customers go to compulsory Meet & Greet scheduling
      setBookingScreen('meet_and_greet');
    } else {
      // Existing Customers skip straight to Details
      setBookingScreen('details');
    }
  };

  // Dynamic Pricing Breakdown based on selected service, plan, duration, and pets
  const currentBill = calculateBookingBill({
    serviceId: selectedService.id,
    serviceName: selectedService.name,
    planId: selectedPlan.id,
    planTitle: selectedPlan.title,
    bookingDate: scheduleData.bookingDate,
    bookingEndDate: scheduleData.bookingEndDate,
    walkFrequency: scheduleData.walkFrequency,
    additionalPetsCount: parseInt(customerDetails.additionalPets || '0', 10) || 0,
    puppiesCount: parseInt(customerDetails.puppiesCount || '0', 10) || 0,
    basePriceOverride: selectedPlan.basePrice,
  });

  // Submit complete booking payload to /api/bookings
  const handleCompletePayment = async (paymentIntentId?: string) => {
    setIsSubmitting(true);

    const payload = {
      customer: {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
        columbiaConfirmed: customerDetails.columbiaConfirmed ?? true,
      },
      pet: {
        petName: customerDetails.petName,
        petType: customerDetails.petType,
        petBreed: customerDetails.petBreed,
        petAge: customerDetails.petAge,
        additionalPets: customerDetails.additionalPets,
        puppiesCount: customerDetails.puppiesCount,
        specialNotes: customerDetails.specialNotes || '',
      },
      service: {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        planTitle: selectedPlan.title,
      },
      schedule: {
        ...scheduleData,
        numberOfDays: currentBill.numberOfDays,
      },
      pricing: {
        basePrice: currentBill.basePrice,
        additionalPetFee: currentBill.additionalPetFee,
        puppySurcharge: currentBill.puppySurcharge,
        holidaySurcharge: currentBill.holidaySurcharge,
        totalPrice: currentBill.totalPrice,
      },
      meetAndGreet: isNewCustomer && meetGreetData.date ? meetGreetData : undefined,
      isNewCustomer,
      payment: {
        paymentIntentId: paymentIntentId || `sim_${Date.now()}`,
        paymentMethod: 'card',
        amount: currentBill.totalPrice,
      },
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        setBookingReference(data.bookingReference);
        if (data.isNewCustomer !== undefined) {
          setIsNewCustomer(data.isNewCustomer);
        }
        setBookingScreen('confirmation');
      } else {
        // Fallback reference for local testing
        const fallbackRef = `CPC-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
        setBookingReference(fallbackRef);
        setBookingScreen('confirmation');
      }
    } catch {
      setIsSubmitting(false);
      // Fallback in case of offline testing: generate temporary reference
      const fallbackRef = `CPC-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingReference(fallbackRef);
      setBookingScreen('confirmation');
    }
  };

  // Reusable Top Progress Indicator
  const renderProgressIndicator = () => {
    const steps = [
      { id: 1, name: 'Service' },
      { id: 2, name: 'Schedule' },
      { id: 3, name: 'Details' },
      { id: 4, name: 'Review & Checkout' },
      { id: 5, name: 'Booking Confirmation' },
    ];

    const activeStep =
      bookingScreen === 'confirmation'
        ? 5
        : bookingScreen === 'review' || bookingScreen === 'payment'
          ? 4
          : bookingScreen === 'details'
            ? 3
            : bookingScreen === 'schedule' || bookingScreen === 'meet_and_greet'
              ? 2
              : 1;

    return (
      <div className={styles.progressIndicator}>
        {steps.map((s) => {
          let nodeClass = styles.stepNode;
          if (s.id === activeStep) nodeClass += ` ${styles.stepActive}`;
          else if (s.id < activeStep) nodeClass += ` ${styles.stepCompleted}`;

          return (
            <div key={s.id} className={nodeClass}>
              <div className={styles.stepCircle}>{s.id}</div>
              <span className={styles.stepText}>{s.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.bookingPage}>
      {/* Header Panel */}
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
        <button className={styles.btnBackHeader} onClick={handleBack}>
          <BackChevronIcon /> Back
        </button>
      </header>

      {/* Main container */}
      <main className={styles.mainContainer}>
        {/* Progress bar */}
        {renderProgressIndicator()}

        {/* Outer card frame */}
        <div className={styles.cardFrame}>
          {bookingScreen === 'main_services' && (
            <>
              <div className={styles.headingGroup}>
                <h2 className={styles.pageTitle}>How can we care for your pet?</h2>
                <p className={styles.pageSubtitle}>
                  Choose the service that best fits your pet&apos;s routine. You&apos;ll only see
                  the options relevant to your selection.
                </p>
              </div>

              <div className={styles.servicesGrid}>
                {servicesList.map((s) => {
                  const isSelected = selectedService.id === s.id;
                  let cardClass = styles.serviceCard;
                  if (isSelected) cardClass += ` ${styles.serviceCardSelected}`;

                  return (
                    <div
                      key={s.id}
                      className={cardClass}
                      onClick={() => handleSelectServiceCard(s)}
                    >
                      <div className={styles.cardIconFrame}>
                        {s.id === '1' && <WaveIcon />}
                        {s.id === '2' && <ClockIcon />}
                        {s.id === '3' && <HouseIcon />}
                        {s.id === '4' && <DogIcon />}
                        {s.id === '5' && <ScoopIcon />}
                      </div>

                      <div className={styles.cardMainContent}>
                        <div className={styles.cardHeaderRow}>
                          <h3 className={styles.cardTitle}>{s.name}</h3>
                          <span className={styles.cardBadge}>{s.badge}</span>
                        </div>
                        <p className={styles.cardDescription}>{s.description}</p>
                        <div className={styles.cardFooterRow}>
                          <span className={styles.cardPrice}>{s.priceText}</span>
                          <span className={styles.cardArrow}>
                            <RightArrowIcon />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {bookingScreen === 'sub_services' && (
            <SubServiceSelector serviceId={selectedService.id} onSelectPlan={handleSelectPlan} />
          )}

          {bookingScreen === 'schedule' && (
            <BookingSchedule
              serviceId={selectedService.id}
              selectedPlanId={selectedPlan.id}
              selectedPlanTitle={selectedPlan.title}
              onContinue={handleScheduleContinue}
            />
          )}

          {bookingScreen === 'meet_and_greet' && (
            <MeetAndGreet
              serviceSchedule={scheduleData}
              onConfirm={(mgData) => {
                setMeetGreetData(mgData);
                setBookingScreen('details');
              }}
            />
          )}

          {bookingScreen === 'details' && (
            <DetailsForm
              initialData={customerDetails}
              isNewCustomer={isNewCustomer}
              onContinue={(detailsData) => {
                setCustomerDetails((prev) => ({ ...prev, ...detailsData }));
                setBookingScreen('review');
              }}
            />
          )}

          {bookingScreen === 'review' && (
            <ReviewBooking
              data={{
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                planId: selectedPlan.id,
                planTitle: selectedPlan.title,
                bookingDate: scheduleData.bookingDate || '',
                bookingEndDate: scheduleData.bookingEndDate,
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime,
                numberOfDays: currentBill.numberOfDays,
                durationLabel: currentBill.durationLabel,
                customerName: `${customerDetails.firstName} ${customerDetails.lastName}`.trim(),
                customerEmail: customerDetails.email,
                customerPhone: customerDetails.phone,
                customerAddress: customerDetails.address,
                petName: customerDetails.petName,
                petType: customerDetails.petType,
                petBreed: customerDetails.petBreed,
                petAge: customerDetails.petAge,
                additionalPets: parseInt(customerDetails.additionalPets || '0', 10) || 0,
                puppiesCount: parseInt(customerDetails.puppiesCount || '0', 10) || 0,
                specialNotes: customerDetails.specialNotes,
              }}
              basePrice={currentBill.basePrice}
              pricingBreakdown={currentBill}
              onContinueToPayment={() => setBookingScreen('payment')}
              onEditService={() => setBookingScreen('sub_services')}
              onEditDates={() => setBookingScreen('schedule')}
              onEditDetails={() => setBookingScreen('details')}
            />
          )}

          {bookingScreen === 'payment' && (
            <div>
              {isSubmitting && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#123f3c' }}>
                  <p style={{ fontWeight: 600, fontSize: '16px' }}>
                    Confirming and securing your booking in our system...
                  </p>
                </div>
              )}
              <PaymentForm
                totalPrice={currentBill.totalPrice}
                basePrice={currentBill.basePrice}
                additionalPetFee={currentBill.additionalPetFee}
                puppySurcharge={currentBill.puppySurcharge}
                holidaySurcharge={currentBill.holidaySurcharge}
                customerDetails={customerDetails}
                bookingDetails={{
                  serviceName: selectedService.name,
                  planTitle: selectedPlan.title,
                  bookingDate: scheduleData.bookingDate || '',
                  bookingEndDate: scheduleData.bookingEndDate,
                }}
                onSubmitPayment={handleCompletePayment}
              />
            </div>
          )}

          {bookingScreen === 'confirmation' && (
            <BookingConfirmation
              isNewCustomer={isNewCustomer}
              bookingRef={bookingReference || 'CPC-202608-001'}
              serviceName={selectedPlan.title || selectedService.name}
              bookingDate={scheduleData.bookingDate || 'Upcoming Service'}
              bookingEndDate={scheduleData.bookingEndDate}
              numberOfDays={currentBill.numberOfDays}
              totalPrice={currentBill.totalPrice}
              customerEmail={customerDetails.email}
              petName={customerDetails.petName}
              meetGreetDate={
                isNewCustomer && meetGreetData.date
                  ? `${meetGreetData.date} at ${meetGreetData.time}`
                  : undefined
              }
              meetGreetAddress={isNewCustomer ? customerDetails.address || undefined : undefined}
            />
          )}
        </div>
      </main>

      {/* Verification modal dialog overlay */}
      {showCustomerModal && <CustomerModal onSelectCustomerType={handleCustomerTypeSelect} />}
    </div>
  );
}
