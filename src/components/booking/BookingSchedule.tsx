'use client';

import React, { useState, useEffect } from 'react';
import styles from './BookingSchedule.module.css';
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Moon,
  Tag,
  User,
  ShieldCheck,
  AlertCircle,
  X,
  CheckCircle2,
  CalendarDays,
  MapPin,
} from 'lucide-react';
import { resolveServiceDuration, parseTimeToMinutes, formatMinutesToTime } from '@/lib/availability';

// --- TSX TYPES & INTERFACES ---
interface BookingScheduleProps {
  serviceId: string;
  selectedPlanId: string;
  selectedPlanTitle: string;
  onContinue: (scheduleData: {
    bookingDate?: string;
    bookingEndDate?: string;
    startTime?: string;
    endTime?: string;
    walkFrequency?: string;
    preferredWeekdays?: string[];
    numberOfDays?: number;
  }) => void;
}

export default function BookingSchedule({
  serviceId,
  selectedPlanId,
  selectedPlanTitle,
  onContinue,
}: BookingScheduleProps) {
  // --- STATE ---
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed, so 7 is August

  // Single Date selector state (Case A / Case D)
  const [selectedDay, setSelectedDay] = useState<number>(10);

  // Date Range selector state (Case B: Overnight Stay)
  const [rangeStart, setRangeStart] = useState<number>(10);
  const [rangeEnd, setRangeEnd] = useState<number>(17);

  // Time Slots selection
  const [startTime, setStartTime] = useState<string>('9:00 AM');
  const [endTime, setEndTime] = useState<string>('11:00 AM');

  // Recurring Dog Walking frequency & weekdays
  const [walkFrequency, setWalkFrequency] = useState<string>('1 Walk Per Week');
  const [preferredWeekdays, setPreferredWeekdays] = useState<string[]>(['Thursday']);

  // Dynamic collision tracking
  const [unavailableSlots, setUnavailableSlots] = useState<Record<string, string>>({});
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(false);

  // --- WAITLIST MODALS STATE ---
  const [unavailableModalOpen, setUnavailableModalOpen] = useState<boolean>(false);
  const [joinWaitlistModalOpen, setJoinWaitlistModalOpen] = useState<boolean>(false);
  const [selectedUnavailableSlot, setSelectedUnavailableSlot] = useState<string>('');

  // Waitlist Form fields
  const [waitlistFirstName, setWaitlistFirstName] = useState<string>('');
  const [waitlistEmail, setWaitlistEmail] = useState<string>('');
  const [waitlistPhone, setWaitlistPhone] = useState<string>('');
  const [waitlistTimePref, setWaitlistTimePref] = useState<string>('Specific Time');
  const [waitlistNotifyMethod, setWaitlistNotifyMethod] = useState<string>('email_sms');
  const [waitlistTermsAccepted, setWaitlistTermsAccepted] = useState<boolean>(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState<boolean>(false);
  const [waitlistSuccessMessage, setWaitlistSuccessMessage] = useState<string>('');

  // Time Period Filter (Morning / Afternoon / Evening / All)
  const [timePeriodFilter, setTimePeriodFilter] = useState<
    'all' | 'morning' | 'afternoon' | 'evening'
  >('all');
  const [endTimePeriodFilter, setEndTimePeriodFilter] = useState<
    'all' | 'morning' | 'afternoon' | 'evening'
  >('all');

  // --- MONTH DATA ---
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [timeSlotsList, setTimeSlotsList] = useState<string[]>([
    '7:00 AM',
    '7:30 AM',
    '8:00 AM',
    '8:30 AM',
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
  ]);

  const [enabledSections, setEnabledSections] = useState<string[]>([
    'morning',
    'afternoon',
    'evening',
  ]);

  // Resolve user-friendly duration
  const serviceDurationText =
    selectedPlanId.includes('60') || selectedPlanTitle.includes('60')
      ? '60 Minutes'
      : selectedPlanId === 'sitting_half_day'
        ? '4 Hours'
        : selectedPlanId === 'sitting_full_day'
          ? '8 Hours'
          : selectedPlanId === 'sitting_overnight'
            ? 'Overnight'
            : '30 Minutes';

  // Helpers for time period filtering
  const isMorningSlot = (s: string) => s.includes('AM');
  const isAfternoonSlot = (s: string) => {
    if (!s.includes('PM')) return false;
    const hour = parseInt(s.split(':')[0], 10);
    return hour === 12 || (hour >= 1 && hour <= 4);
  };
  const isEveningSlot = (s: string) => {
    if (!s.includes('PM')) return false;
    return !isAfternoonSlot(s);
  };

  const getFilteredSlots = (filter: 'all' | 'morning' | 'afternoon' | 'evening') => {
    if (filter === 'morning') return timeSlotsList.filter(isMorningSlot);
    if (filter === 'afternoon') return timeSlotsList.filter(isAfternoonSlot);
    if (filter === 'evening') return timeSlotsList.filter(isEveningSlot);
    return timeSlotsList;
  };

  // Fetch slot availability whenever the chosen day or service changes
  useEffect(() => {
    if (!selectedDay) return;
    const formattedDate = `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`;
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) setLoadingAvailability(true);
    });

    fetch(
      `/api/availability?date=${encodeURIComponent(
        formattedDate,
      )}&serviceId=${serviceId}&planId=${selectedPlanId}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setLoadingAvailability(false);

        if (Array.isArray(data.enabledSections)) {
          setEnabledSections(data.enabledSections);
        }

        if (data.success && Array.isArray(data.slots)) {
          const newSlots = data.slots.map((s: { time: string }) => s.time);
          if (newSlots.length > 0) {
            setTimeSlotsList(newSlots);
          }

          const map: Record<string, string> = {};
          for (const s of data.slots) {
            if (!s.available) {
              map[s.time] = s.reason || 'Booked';
            }
          }
          setUnavailableSlots(map);

          // Clear slot if currently selected slot is unavailable
          if (map[startTime]) {
            setStartTime('');
          }
          if (map[endTime]) {
            setEndTime('');
          }
        }
      })
      .catch(() => {
        if (isMounted) setLoadingAvailability(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDay, currentMonth, currentYear, serviceId, selectedPlanId]);


  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(currentMonth, currentYear);
  const paddingDays = getFirstDayOfMonth(currentMonth, currentYear);

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < paddingDays; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysArray.push(d);
  }

  // --- HANDLERS ---
  const handleDayClick = (day: number) => {
    const isOvernight = serviceId === '3' && selectedPlanId === 'sitting_overnight';

    if (isOvernight) {
      if (rangeStart && !rangeEnd) {
        if (day < rangeStart) {
          setRangeStart(day);
        } else {
          setRangeEnd(day);
        }
      } else {
        setRangeStart(day);
        setRangeEnd(0);
      }
    } else {
      setSelectedDay(day);
    }
  };

  const handleWeekdayToggle = (dayName: string) => {
    const isPoopScoop = serviceId === '5';
    if (isPoopScoop) {
      setPreferredWeekdays([dayName]);
    } else {
      setPreferredWeekdays((prev) => {
        if (prev.includes(dayName)) {
          return prev.filter((d) => d !== dayName);
        } else {
          return [...prev, dayName];
        }
      });
    }
  };

  const handleClearTime = (type: 'start' | 'end') => {
    if (type === 'start') setStartTime('');
    else setEndTime('');
  };

  const handleSlotClick = (slot: string, isUnavailable: boolean, type: 'start' | 'end') => {
    if (isUnavailable) {
      setSelectedUnavailableSlot(slot);
      setUnavailableModalOpen(true);
      return;
    }
    if (type === 'start') setStartTime(slot);
    else setEndTime(slot);
  };

  const handleJoinWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistFirstName || !waitlistEmail) {
      alert('Please enter your first name and email.');
      return;
    }
    if (!waitlistTermsAccepted) {
      alert('Please check the confirmation box to proceed.');
      return;
    }

    setWaitlistSubmitting(true);
    try {
      const preferredDateFormatted = `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`;
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: waitlistFirstName,
          email: waitlistEmail,
          phone: waitlistPhone,
          serviceName: selectedPlanTitle || 'Drop-In Visit',
          serviceDuration: serviceDurationText,
          preferredDate: preferredDateFormatted,
          preferredTime: selectedUnavailableSlot || 'Any Available Time',
          timePreference: waitlistTimePref,
          notifyMethod: waitlistNotifyMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWaitlistSuccessMessage(
          'You have successfully joined the waitlist! We will notify you if an opening becomes available.',
        );
        setTimeout(() => {
          setWaitlistSuccessMessage('');
          setJoinWaitlistModalOpen(false);
          setUnavailableModalOpen(false);
        }, 2500);
      } else {
        alert(data.message || 'Failed to join waitlist. Please try again.');
      }
    } catch {
      alert('Network error joining waitlist.');
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  const handleContinueClick = () => {
    const isRecurringWalk =
      serviceId === '4' &&
      (selectedPlanId.includes('weekly') ||
        selectedPlanId.includes('monthly') ||
        selectedPlanId.includes('annual'));

    const isRecurringScoop = serviceId === '5' && !selectedPlanId.includes('onetime');
    const isOvernight = serviceId === '3' && selectedPlanId === 'sitting_overnight';

    if (isRecurringWalk) {
      if (preferredWeekdays.length === 0) {
        alert('Please select at least one preferred weekday.');
        return;
      }
      const freqMatch = walkFrequency.match(/(\d+)/);
      const walksCount = freqMatch ? parseInt(freqMatch[1], 10) : 1;
      const weekdaysStr = preferredWeekdays.join(', ');
      onContinue({
        bookingDate: `${walkFrequency} (${weekdaysStr})`,
        walkFrequency,
        preferredWeekdays,
        numberOfDays: walksCount,
      });
    } else if (isRecurringScoop) {
      if (preferredWeekdays.length === 0) {
        alert('Please select your preferred cleanup weekday.');
        return;
      }
      const weekdaysStr = preferredWeekdays.join(', ');
      onContinue({
        bookingDate: `Weekly on ${weekdaysStr}`,
        preferredWeekdays,
        numberOfDays: 1,
      });
    } else if (isOvernight) {
      if (!rangeStart || !rangeEnd) {
        alert('Please select your arrival and departure dates.');
        return;
      }
      const calculatedDays = Math.max(1, rangeEnd - rangeStart);
      onContinue({
        bookingDate: `${monthNames[currentMonth]} ${rangeStart}, ${currentYear}`,
        bookingEndDate: `${monthNames[currentMonth]} ${rangeEnd}, ${currentYear}`,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        numberOfDays: calculatedDays,
      });
    } else {
      if (!selectedDay) {
        alert('Please select a visit date.');
        return;
      }
      if (!startTime) {
        alert('Please select an available start time.');
        return;
      }
      if (unavailableSlots[startTime]) {
        setSelectedUnavailableSlot(startTime);
        setUnavailableModalOpen(true);
        return;
      }

      // Automatically compute endTime for fixed duration visits if not set
      let resolvedEndTime = endTime;
      if (!resolvedEndTime && startTime) {
        const duration = resolveServiceDuration(serviceId, selectedPlanTitle, startTime, endTime);
        const startMinutes = parseTimeToMinutes(startTime);
        resolvedEndTime = formatMinutesToTime(startMinutes + duration);
      }

      onContinue({
        bookingDate: `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`,
        startTime,
        endTime: resolvedEndTime,
        numberOfDays: 1,
      });
    }
  };

  // --- RENDER CLASSIFIER LOGIC ---
  const isRecurringWalk =
    serviceId === '4' &&
    (selectedPlanId.includes('weekly') ||
      selectedPlanId.includes('monthly') ||
      selectedPlanId.includes('annual'));

  const isRecurringScoop = serviceId === '5' && !selectedPlanId.includes('onetime');
  const isOvernight = serviceId === '3' && selectedPlanId === 'sitting_overnight';
  const isSitting = serviceId === '3';
  const isFixedDuration = serviceId === '2' || serviceId === '4' || serviceId === '5';

  const overnightDaysCount = rangeEnd && rangeStart ? rangeEnd - rangeStart : 0;

  return (
    <div className={styles.container}>
      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: "UNAVAILABLE SLOT" WARNING (Matches Screenshot 1)     */}
      {/* ------------------------------------------------------------- */}
      {unavailableModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setUnavailableModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            {/* Top bar */}
            <div className={styles.modalHeaderBar}>
              <div className={styles.modalHeaderTitle}>
                <CalendarDays size={18} style={{ color: 'var(--primary)' }} />
                <span>Unavailable Slot</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setUnavailableModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Hero Section with Calendar Art */}
            <div className={styles.modalHeroBlock}>
              <div className={styles.modalHeroIconFrame}>
                <Calendar size={32} />
              </div>
              <h3 className={styles.modalHeroTitle}>This time is no longer available</h3>
              <p className={styles.modalHeroSubtitle}>
                That appointment has already been reserved. Choose another available time or join
                the waitlist for your preferred date.
              </p>
            </div>

            {/* "Your Selected Booking" summary card */}
            <div className={styles.summaryBoxCard}>
              <div className={styles.summaryBoxHeader}>
                <div className={styles.summaryBoxTitle}>
                  <Tag size={15} />
                  <span>Your Selected Booking</span>
                </div>
              </div>

              <div className={styles.summaryRowsList}>
                <div className={styles.summaryItemRow}>
                  <span className={styles.summaryItemLabel}>Service</span>
                  <span className={styles.summaryItemValue}>
                    {selectedPlanTitle || 'Drop-In Visit'}
                  </span>
                </div>
                <div className={styles.summaryItemRow}>
                  <span className={styles.summaryItemLabel}>Duration</span>
                  <span className={styles.summaryItemValue}>{serviceDurationText}</span>
                </div>
                <div className={styles.summaryItemRow}>
                  <span className={styles.summaryItemLabel}>Date</span>
                  <span className={styles.summaryItemValue}>
                    {monthNames[currentMonth]} {selectedDay}, {currentYear}
                  </span>
                </div>
                <div className={styles.summaryItemRow}>
                  <span className={styles.summaryItemLabel}>Time</span>
                  <span className={styles.summaryItemValue}>
                    {selectedUnavailableSlot || '2:00 PM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.modalActionsStack}>
              <button
                type="button"
                className={styles.btnTealPrimary}
                onClick={() => setUnavailableModalOpen(false)}
              >
                Choose Another Date or Time
              </button>
              <button
                type="button"
                className={styles.btnOutlinedSecondary}
                onClick={() => {
                  setUnavailableModalOpen(false);
                  setJoinWaitlistModalOpen(true);
                }}
              >
                Join the Waitlist
              </button>
            </div>

            <div className={styles.footerInfoNote}>
              <AlertCircle size={14} />
              <span>
                We&apos;ll contact you by email or text if availability opens for your requested
                date.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: "JOIN WAITLIST" FORM (Matches Screenshot 2)          */}
      {/* ------------------------------------------------------------- */}
      {joinWaitlistModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setJoinWaitlistModalOpen(false)}>
          <div
            className={`${styles.modalCard} ${styles.modalCardWide}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeaderBar}>
              <div className={styles.modalHeaderTitle}>
                <Clock size={18} style={{ color: 'var(--primary)' }} />
                <span>Join Waitlist</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setJoinWaitlistModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalHeroBlock}>
              <h3 className={styles.modalHeroTitle}>Join the waitlist</h3>
              <p className={styles.modalHeroSubtitle}>
                Share your preferred booking details, and we&apos;ll notify you by email or text if
                availability opens.
              </p>
            </div>

            {waitlistSuccessMessage && (
              <div
                style={{
                  backgroundColor: '#edf7ed',
                  color: '#1e4620',
                  padding: '14px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={18} color="#2e7d32" />
                <span>{waitlistSuccessMessage}</span>
              </div>
            )}

            {/* Preferred booking summary card */}
            <div className={styles.summaryBoxCard}>
              <div className={styles.summaryBoxHeader}>
                <div className={styles.summaryBoxTitle}>
                  <Tag size={15} />
                  <span>Preferred booking summary</span>
                </div>
              </div>

              <div className={styles.summaryRowsList}>
                <div className={styles.summaryItemRow}>
                  <span className={styles.summaryItemLabel}>Service</span>
                  <span className={styles.summaryItemValue}>
                    {selectedPlanTitle || 'Drop-In Visit'}
                  </span>
                </div>
                <div className={styles.summaryItemRow}>
                  <span className={styles.summaryItemLabel}>Duration</span>
                  <span className={styles.summaryItemValue}>{serviceDurationText}</span>
                </div>
                <div className={styles.summaryItemRow}>
                  <span className={styles.summaryItemLabel}>Date</span>
                  <span className={styles.summaryItemValue}>
                    {monthNames[currentMonth]} {selectedDay}, {currentYear}
                  </span>
                </div>
                <div className={styles.summaryItemRow}>
                  <span className={styles.summaryItemLabel}>Time</span>
                  <span className={styles.summaryItemValue}>
                    {selectedUnavailableSlot || '2:00 PM'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={styles.btnChangePref}
                onClick={() => setJoinWaitlistModalOpen(false)}
              >
                Change Preferences
              </button>
            </div>

            {/* Waitlist Form */}
            <form
              onSubmit={handleJoinWaitlistSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Customer Information */}
              <div className={styles.formSectionTitle}>
                <User size={16} />
                <span>Customer Information</span>
              </div>

              <div className={styles.formFieldsGroup}>
                <div className={styles.modalFieldRow}>
                  <label className={styles.modalFieldLabel}>First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter here"
                    className={styles.modalInput}
                    value={waitlistFirstName}
                    onChange={(e) => setWaitlistFirstName(e.target.value)}
                  />
                </div>

                <div className={styles.modalFieldRow}>
                  <label className={styles.modalFieldLabel}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter here"
                    className={styles.modalInput}
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                  />
                </div>

                <div className={styles.modalFieldRow}>
                  <label className={styles.modalFieldLabel}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter here"
                    className={styles.modalInput}
                    value={waitlistPhone}
                    onChange={(e) => setWaitlistPhone(e.target.value)}
                  />
                </div>

                <div className={styles.securityNote}>
                  <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    We&apos;ll use these details only to contact you about this waitlist request.
                  </span>
                </div>
              </div>

              {/* Booking Preference */}
              <div className={styles.formSectionTitle}>
                <Calendar size={16} />
                <span>Booking Preference</span>
              </div>

              <div className={styles.formFieldsGroup}>
                <div className={styles.modalFieldRow}>
                  <label className={styles.modalFieldLabel}>Preferred Date</label>
                  <input
                    type="text"
                    readOnly
                    className={styles.modalInput}
                    value={`${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`}
                  />
                </div>

                <div className={styles.modalFieldRow}>
                  <label className={styles.modalFieldLabel}>Preferred Service</label>
                  <input
                    type="text"
                    readOnly
                    className={styles.modalInput}
                    value={selectedPlanTitle || 'Drop-In Visit'}
                  />
                </div>

                <div className={styles.modalFieldRow}>
                  <label className={styles.modalFieldLabel}>Preferred Time</label>
                  <div className={styles.timePillsWrap}>
                    {['Specific Time', 'Morning', 'Afternoon', 'Evening', 'Any Available Time'].map(
                      (pill) => (
                        <button
                          key={pill}
                          type="button"
                          className={`${styles.timePill} ${
                            waitlistTimePref === pill ? styles.timePillActive : ''
                          }`}
                          onClick={() => setWaitlistTimePref(pill)}
                        >
                          {pill}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className={styles.modalFieldRow}>
                  <label className={styles.modalFieldLabel}>How should we notify you?</label>
                  <div className={styles.radioOptionsRow}>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name="notifyMethod"
                        value="email"
                        checked={waitlistNotifyMethod === 'email'}
                        onChange={(e) => setWaitlistNotifyMethod(e.target.value)}
                      />
                      <span>Email</span>
                    </label>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name="notifyMethod"
                        value="sms"
                        checked={waitlistNotifyMethod === 'sms'}
                        onChange={(e) => setWaitlistNotifyMethod(e.target.value)}
                      />
                      <span>SMS</span>
                    </label>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name="notifyMethod"
                        value="email_sms"
                        checked={waitlistNotifyMethod === 'email_sms'}
                        onChange={(e) => setWaitlistNotifyMethod(e.target.value)}
                      />
                      <span>Email &amp; SMS</span>
                    </label>
                  </div>
                </div>

                <label className={styles.termsCheckboxRow}>
                  <input
                    type="checkbox"
                    checked={waitlistTermsAccepted}
                    onChange={(e) => setWaitlistTermsAccepted(e.target.checked)}
                    required
                  />
                  <span>
                    I understand that joining the waitlist does not guarantee a booking. I must
                    actively confirm the booking if availability becomes available.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className={styles.modalActionsStack}>
                <button
                  type="submit"
                  disabled={waitlistSubmitting}
                  className={styles.btnTealPrimary}
                >
                  {waitlistSubmitting ? 'Joining...' : 'Join Waitlist'}
                </button>
                <button
                  type="button"
                  className={styles.btnOutlinedSecondary}
                  onClick={() => setJoinWaitlistModalOpen(false)}
                >
                  Choose Another Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MAIN SCREEN HEADER & SERVICE TYPE DISPLAY                     */}
      {/* ------------------------------------------------------------- */}
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>
          {isSitting ? 'When Do You Need Pet Sitting?' : 'When do you need the visit?'}
        </h2>
        <p className={styles.subtitle}>
          {isSitting
            ? 'Choose your preferred service date and available start time.'
            : 'Choose the date you would like CoMo Pet Care to visit your home.'}
        </p>
      </div>

      {isSitting && (
        <div className={styles.badgeContainer}>
          <span className={styles.serviceBadge}>{selectedPlanTitle}</span>
        </div>
      )}

      {/* CASE C: Recurring Dog Walking */}
      {isRecurringWalk && (
        <div className={styles.recurringCard}>
          <div className={styles.freqPillsRow}>
            <span className={styles.freqLabel}>Walk Frequency</span>
            <div className={styles.freqPillsList}>
              {[
                '1 Walk Per Week',
                '2 Walk Per Week',
                '3 Walk Per Week',
                '4 Walk Per Week',
                '5 Walk Per Week',
              ].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  className={`${styles.freqPillBtn} ${
                    walkFrequency === freq ? styles.freqPillActive : ''
                  }`}
                  onClick={() => setWalkFrequency(freq)}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.weekdaysSelectorContainer}>
            <div className={styles.weekdaysHeader}>
              <Clock size={16} />
              <span>Choose Preferred Weekdays</span>
            </div>

            <div className={styles.weekdaysBox}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                const isActive = preferredWeekdays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.weekdayRowBtn} ${isActive ? styles.weekdayRowActive : ''}`}
                    onClick={() => handleWeekdayToggle(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.wizardActions} style={{ justifyContent: 'center' }}>
            <button className={styles.btnContinue} onClick={handleContinueClick}>
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* CASE D: Recurring Poop Scooping */}
      {isRecurringScoop && (
        <div className={styles.recurringCard} style={{ maxWidth: '600px' }}>
          <div className={styles.weekdaysSelectorContainer}>
            <div className={styles.weekdaysHeader}>
              <Clock size={16} />
              <span>Choose Preferred Weekdays</span>
            </div>

            <div className={styles.weekdaysBox}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                const isActive = preferredWeekdays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.weekdayRowBtn} ${isActive ? styles.weekdayRowActive : ''}`}
                    onClick={() => handleWeekdayToggle(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.wizardActions} style={{ justifyContent: 'center' }}>
            <button className={styles.btnContinue} onClick={handleContinueClick}>
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* CASE B: Overnight Stay */}
      {isOvernight && (
        <div className={styles.scheduleCard}>
          <div className={styles.schedulerGrid}>
            <div className={styles.columnBlock}>
              <div className={styles.colHeaderRow}>
                <h3 className={styles.colTitle}>
                  <Calendar size={18} />
                  Select Arrival &amp; Departure Date
                </h3>
              </div>

              <div className={styles.calendarFrame}>
                <div className={styles.calHeader}>
                  <button
                    type="button"
                    aria-label="Previous Month"
                    className={styles.btnCalArrow}
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear((y) => y - 1);
                      } else {
                        setCurrentMonth((m) => m - 1);
                      }
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className={styles.calMonthDisplay}>
                    <span className={styles.calMonth}>{monthNames[currentMonth]}</span>
                    <span className={styles.calYear}>{currentYear}</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Next Month"
                    className={styles.btnCalArrow}
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear((y) => y + 1);
                      } else {
                        setCurrentMonth((m) => m + 1);
                      }
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className={styles.calGrid}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat'].map((dLabel) => (
                    <div key={dLabel} className={styles.calDayLabel}>
                      {dLabel}
                    </div>
                  ))}

                  {daysArray.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className={styles.calEmptyCell} />;
                    }

                    const isStart = rangeStart === day;
                    const isEnd = rangeEnd === day;
                    const isMid = rangeStart && rangeEnd && day > rangeStart && day < rangeEnd;

                    let dayClass = styles.calDayBtn;
                    if (isStart) dayClass += ` ${styles.calRangeStart}`;
                    else if (isEnd) dayClass += ` ${styles.calRangeEnd}`;
                    else if (isMid) dayClass += ` ${styles.calRangeMid}`;

                    return (
                      <button
                        key={day}
                        type="button"
                        className={dayClass}
                        onClick={() => handleDayClick(day)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.columnBlock}>
              <div>
                <div className={styles.colHeaderRow}>
                  <h3 className={styles.colTitle}>
                    <Clock size={18} />
                    Select Start Time
                  </h3>
                  <button className={styles.btnClear} onClick={() => handleClearTime('start')}>
                    Clear
                  </button>
                </div>
                <p className={styles.timeInfo}>All times shown are in Central Time (CT)</p>
              </div>

              <div className={styles.slotsScrollContainer}>
                <div className={styles.slotsGrid}>
                  {timeSlotsList.map((slot) => (
                    <button
                      key={`start-${slot}`}
                      type="button"
                      className={`${styles.slotButton} ${startTime === slot ? styles.slotButtonActive : ''}`}
                      onClick={() => setStartTime(slot)}
                    >
                      <span className={styles.slotTimeText}>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <div className={styles.colHeaderRow}>
                  <h3 className={styles.colTitle}>
                    <Clock size={18} />
                    Select End Time
                  </h3>
                  <button className={styles.btnClear} onClick={() => handleClearTime('end')}>
                    Clear
                  </button>
                </div>
                <p className={styles.timeInfo}>All times shown are in Central Time (CT)</p>
              </div>

              <div className={styles.slotsScrollContainer}>
                <div className={styles.slotsGrid}>
                  {timeSlotsList.map((slot) => (
                    <button
                      key={`end-${slot}`}
                      type="button"
                      className={`${styles.slotButton} ${endTime === slot ? styles.slotButtonActive : ''}`}
                      onClick={() => setEndTime(slot)}
                    >
                      <span className={styles.slotTimeText}>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.columnBlock}>
              <div className={styles.overnightSummaryCard}>
                <div className={styles.colHeaderRow}>
                  <h3 className={styles.colTitle}>
                    <Moon size={18} />
                    Length of Stay
                  </h3>
                </div>
                <p className={styles.timeInfo}>Total number of service days</p>

                <div className={styles.lengthBox}>
                  <span className={styles.giantLabel}>{overnightDaysCount}</span>
                  <span className={styles.giantSubtext}>Days</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.recapBar}>
            <div className={styles.recapInfoGroup}>
              <div className={styles.recapItem}>
                <div className={styles.recapIconWrap}>
                  <Calendar size={16} />
                </div>
                <div className={styles.recapMeta}>
                  <span className={styles.recapSmallLabel}>Arrival & Departure</span>
                  <span className={styles.recapMainVal}>
                    {rangeStart && rangeEnd ? (
                      <>
                        {monthNames[currentMonth]} {rangeStart} – {monthNames[currentMonth]}{' '}
                        {rangeEnd}
                      </>
                    ) : (
                      'Select date range'
                    )}
                  </span>
                </div>
              </div>

              <div className={styles.recapDivider} />

              <div className={styles.recapItem}>
                <div className={styles.recapIconWrap}>
                  <Clock size={16} />
                </div>
                <div className={styles.recapMeta}>
                  <span className={styles.recapSmallLabel}>Times</span>
                  <span className={styles.recapMainVal}>
                    {startTime} – {endTime}
                  </span>
                </div>
              </div>
            </div>

            <button type="button" className={styles.btnContinue} onClick={handleContinueClick}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* CASE A: Standard Visit schedule selector (Calendar, Start Time slots, End Time slots) */}
      {!isRecurringWalk && !isRecurringScoop && !isOvernight && (
        <div
          className={`${styles.scheduleCard} ${isFixedDuration ? styles.scheduleCardCompact : ''}`}
        >
          <div
            className={`${styles.schedulerGrid} ${isFixedDuration ? styles.schedulerGrid2Col : ''}`}
          >
            {/* Column 1: Calendar */}
            <div className={styles.columnBlock}>
              <div className={styles.colHeaderRow}>
                <h3 className={styles.colTitle}>
                  <Calendar size={18} />
                  Select Date
                </h3>
              </div>

              <div className={styles.calendarFrame}>
                <div className={styles.calHeader}>
                  <button
                    type="button"
                    aria-label="Previous Month"
                    className={styles.btnCalArrow}
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear((y) => y - 1);
                      } else {
                        setCurrentMonth((m) => m - 1);
                      }
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className={styles.calMonthDisplay}>
                    <span className={styles.calMonth}>{monthNames[currentMonth]}</span>
                    <span className={styles.calYear}>{currentYear}</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Next Month"
                    className={styles.btnCalArrow}
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear((y) => y + 1);
                      } else {
                        setCurrentMonth((m) => m + 1);
                      }
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className={styles.calGrid}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat'].map((dLabel) => (
                    <div key={dLabel} className={styles.calDayLabel}>
                      {dLabel}
                    </div>
                  ))}

                  {daysArray.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className={styles.calEmptyCell} />;
                    }

                    const isSelected = selectedDay === day;
                    let dayClass = styles.calDayBtn;
                    if (isSelected) dayClass += ` ${styles.calDaySelected}`;

                    return (
                      <button
                        key={day}
                        type="button"
                        className={dayClass}
                        onClick={() => handleDayClick(day)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Informative Date Card to balance vertical space */}
              <div className={styles.selectedDateCard}>
                <div className={styles.selectedDateHeader}>
                  <div className={styles.selectedDateIconWrap}>
                    <Calendar size={16} />
                  </div>
                  <div className={styles.selectedDateMeta}>
                    <span className={styles.selectedDateLabel}>Selected Date</span>
                    <span className={styles.selectedDateText}>
                      {monthNames[currentMonth]} {selectedDay}, {currentYear}
                    </span>
                  </div>
                </div>
                <div className={styles.selectedDateBadges}>
                  <span className={styles.visitDurationBadge}>
                    <Clock size={12} />
                    {serviceDurationText}
                  </span>
                  <span className={styles.serviceAreaBadge}>
                    <MapPin size={12} />
                    Columbia, MO
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Start Time slots */}
            <div className={styles.columnBlock}>
              <div className={styles.colHeaderRow}>
                <h3 className={styles.colTitle}>
                  <Clock size={18} />
                  Select Start Time
                </h3>
                {startTime && (
                  <button className={styles.btnClear} onClick={() => handleClearTime('start')}>
                    Clear
                  </button>
                )}
              </div>

              <div className={styles.availabilityNotice}>
                {loadingAvailability ? (
                  <span className={styles.loadingAvailability}>
                    <span className={styles.spinnerDot} /> Checking availability...
                  </span>
                ) : (
                  <span className={styles.readyAvailability}>
                    Central Time (CT) • Booked slots available on waitlist
                  </span>
                )}
              </div>

              {/* Time Period Filter Tabs */}
              <div className={styles.timeFilterBar}>
                {(
                  [
                    'all',
                    ...(enabledSections.includes('morning') ? ['morning'] : []),
                    ...(enabledSections.includes('afternoon') ? ['afternoon'] : []),
                    ...(enabledSections.includes('evening') ? ['evening'] : []),
                  ] as ('all' | 'morning' | 'afternoon' | 'evening')[]
                ).map((period) => {
                  const count =
                    period === 'all' ? timeSlotsList.length : getFilteredSlots(period).length;
                  const label =
                    period === 'all'
                      ? 'All'
                      : period === 'morning'
                        ? 'Morning'
                        : period === 'afternoon'
                          ? 'Afternoon'
                          : 'Evening';

                  return (
                    <button
                      key={period}
                      type="button"
                      className={`${styles.filterTab} ${
                        timePeriodFilter === period ? styles.filterTabActive : ''
                      }`}
                      onClick={() => setTimePeriodFilter(period)}
                    >
                      {label} <span className={styles.filterCount}>({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Responsive 3-column slots grid */}
              <div className={styles.slotsScrollContainer}>
                <div className={styles.slotsGrid}>
                  {getFilteredSlots(timePeriodFilter).map((slot) => {
                    const isUnavailable = Boolean(unavailableSlots[slot]);
                    const isSelected = startTime === slot;

                    return (
                      <button
                        key={`start-${slot}`}
                        type="button"
                        title={
                          isUnavailable
                            ? `${unavailableSlots[slot]} - Click to join waitlist`
                            : 'Available for booking'
                        }
                        className={`${styles.slotButton} ${
                          isSelected ? styles.slotButtonActive : ''
                        } ${isUnavailable ? styles.slotButtonUnavailable : ''}`}
                        onClick={() => handleSlotClick(slot, isUnavailable, 'start')}
                      >
                        <span className={styles.slotTimeText}>{slot}</span>
                        {isUnavailable && <span className={styles.bookedTag}>Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Column 3: End Time slots (for non-fixed duration services) */}
            {!isFixedDuration && (
              <div className={styles.columnBlock}>
                <div className={styles.colHeaderRow}>
                  <h3 className={styles.colTitle}>
                    <Clock size={18} />
                    Select End Time
                  </h3>
                  {endTime && (
                    <button className={styles.btnClear} onClick={() => handleClearTime('end')}>
                      Clear
                    </button>
                  )}
                </div>

                <div className={styles.availabilityNotice}>
                  <span className={styles.readyAvailability}>Central Time (CT)</span>
                </div>

                <div className={styles.timeFilterBar}>
                  {(
                    [
                      'all',
                      ...(enabledSections.includes('morning') ? ['morning'] : []),
                      ...(enabledSections.includes('afternoon') ? ['afternoon'] : []),
                      ...(enabledSections.includes('evening') ? ['evening'] : []),
                    ] as ('all' | 'morning' | 'afternoon' | 'evening')[]
                  ).map((period) => {
                    const count =
                      period === 'all' ? timeSlotsList.length : getFilteredSlots(period).length;
                    const label =
                      period === 'all'
                        ? 'All'
                        : period === 'morning'
                          ? 'Morning'
                          : period === 'afternoon'
                            ? 'Afternoon'
                            : 'Evening';

                    return (
                      <button
                        key={`end-filter-${period}`}
                        type="button"
                        className={`${styles.filterTab} ${
                          endTimePeriodFilter === period ? styles.filterTabActive : ''
                        }`}
                        onClick={() => setEndTimePeriodFilter(period)}
                      >
                        {label} <span className={styles.filterCount}>({count})</span>
                      </button>
                    );
                  })}
                </div>


                <div className={styles.slotsScrollContainer}>
                  <div className={styles.slotsGrid}>
                    {getFilteredSlots(endTimePeriodFilter).map((slot) => {
                      const isUnavailable = Boolean(unavailableSlots[slot]);
                      const isSelected = endTime === slot;

                      return (
                        <button
                          key={`end-${slot}`}
                          type="button"
                          title={
                            isUnavailable
                              ? `${unavailableSlots[slot]} - Click to join waitlist`
                              : 'Available for booking'
                          }
                          className={`${styles.slotButton} ${
                            isSelected ? styles.slotButtonActive : ''
                          } ${isUnavailable ? styles.slotButtonUnavailable : ''}`}
                          onClick={() => handleSlotClick(slot, isUnavailable, 'end')}
                        >
                          <span className={styles.slotTimeText}>{slot}</span>
                          {isUnavailable && <span className={styles.bookedTag}>Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom summary recap row */}
          <div className={styles.recapBar}>
            <div className={styles.recapInfoGroup}>
              <div className={styles.recapItem}>
                <div className={styles.recapIconWrap}>
                  <Calendar size={16} />
                </div>
                <div className={styles.recapMeta}>
                  <span className={styles.recapSmallLabel}>Date</span>
                  <span className={styles.recapMainVal}>
                    {selectedDay
                      ? `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`
                      : 'Select a date'}
                  </span>
                </div>
              </div>

              <div className={styles.recapDivider} />

              <div className={styles.recapItem}>
                <div className={styles.recapIconWrap}>
                  <Clock size={16} />
                </div>
                <div className={styles.recapMeta}>
                  <span className={styles.recapSmallLabel}>Start Time</span>
                  <span className={styles.recapMainVal}>
                    {startTime || <span className={styles.recapPlaceholder}>Select time</span>}
                  </span>
                </div>
              </div>

              {!isFixedDuration && endTime && (
                <>
                  <div className={styles.recapDivider} />
                  <div className={styles.recapItem}>
                    <div className={styles.recapIconWrap}>
                      <Clock size={16} />
                    </div>
                    <div className={styles.recapMeta}>
                      <span className={styles.recapSmallLabel}>End Time</span>
                      <span className={styles.recapMainVal}>{endTime}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button type="button" className={styles.btnContinue} onClick={handleContinueClick}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
