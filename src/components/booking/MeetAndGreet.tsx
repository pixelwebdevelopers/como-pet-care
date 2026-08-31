'use client';

import React, { useState, useEffect } from 'react';
import styles from './MeetAndGreet.module.css';

// --- TSX TYPES & INTERFACES ---
interface MeetAndGreetProps {
  serviceSchedule?: {
    bookingDate?: string;
    bookingEndDate?: string;
    startTime?: string;
    endTime?: string;
  };
  onConfirm: (data: { date: string; time: string }) => void;
}

// Month data helper
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

// Restructure target service limits
const parseBookingDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const parts = dateStr.replace(',', '').split(' ');
  if (parts.length < 3) return null;
  const monthIdx = monthNames.indexOf(parts[0]);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  if (monthIdx === -1 || isNaN(day) || isNaN(year)) return null;
  return { year, month: monthIdx, day };
};

const parseTimeToMinutes = (timeStr?: string) => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// Icons
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
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

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);

const UserWarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '22px', height: '22px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
    />
  </svg>
);

const ArrowLeftChevron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{ width: '14px', height: '14px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ArrowRightChevron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{ width: '14px', height: '14px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
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

export default function MeetAndGreet({ serviceSchedule, onConfirm }: MeetAndGreetProps) {
  const parsedLimit = parseBookingDate(serviceSchedule?.bookingDate);
  const defaultDay = parsedLimit ? (parsedLimit.day > 1 ? parsedLimit.day - 1 : 1) : 9;

  // Calendar states defaulting to August 2026
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // August

  const [selectedDay, setSelectedDay] = useState<number>(defaultDay);
  const [startTime, setStartTime] = useState<string>('9:00 AM');
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Real-time slot availability
  const [unavailableSlots, setUnavailableSlots] = useState<Record<string, string>>({});

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

  const timeSlotsList = [
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
  ];

  const uniqueTimeSlots = Array.from(new Set(timeSlotsList));

  // Time period filter helpers
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
    if (filter === 'morning') return uniqueTimeSlots.filter(isMorningSlot);
    if (filter === 'afternoon') return uniqueTimeSlots.filter(isAfternoonSlot);
    if (filter === 'evening') return uniqueTimeSlots.filter(isEveningSlot);
    return uniqueTimeSlots;
  };

  // Query slot collisions for the selected date
  useEffect(() => {
    if (!selectedDay) return;
    const formattedDate = `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`;
    let isMounted = true;

    fetch(
      `/api/availability?date=${encodeURIComponent(
        formattedDate,
      )}&serviceId=1&planId=meet_greet&slots=${encodeURIComponent(uniqueTimeSlots.join(','))}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.slots)) {
          const map: Record<string, string> = {};
          for (const s of data.slots) {
            if (!s.available) {
              map[s.time] = s.reason || 'Booked';
            }
          }
          setUnavailableSlots(map);
          if (map[startTime]) {
            setStartTime('');
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [selectedDay, currentMonth, currentYear]);

  const handleConfirmClick = () => {
    if (!selectedDay) {
      alert('Please select a date for your Meet & Greet.');
      return;
    }
    if (!startTime) {
      alert('Please select a time slot.');
      return;
    }
    if (unavailableSlots[startTime]) {
      alert('The selected time slot is already booked. Please pick another available slot.');
      return;
    }
    onConfirm({
      date: `${monthNames[currentMonth]} ${selectedDay}`,
      time: startTime,
    });
  };

  const handleClearAll = () => {
    setSelectedDay(0);
    setStartTime('');
  };

  return (
    <div className={styles.container}>
      {/* Title Block */}
      <div className={styles.headingGroup}>
        <h2 className={styles.title}>Schedule your complimentary Meet &amp; Greet</h2>
        <p className={styles.subtitle}>
          Choose a convenient date and time for us to meet your pet, review their routine, and make
          sure we&apos;re the right fit before your first paid service.
        </p>
      </div>

      {/* Main Scheduler Panel */}
      <div className={styles.scheduleCard}>
        <div className={styles.schedulerGrid}>
          {/* Column 1: Calendar */}
          <div className={styles.columnBlock}>
            <div className={styles.colHeaderRow}>
              <h3 className={styles.colTitle}>
                <CalendarIcon />
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
                  <ArrowLeftChevron />
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
                  <ArrowRightChevron />
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

                  let isDisabled = false;
                  if (parsedLimit) {
                    if (
                      currentYear > parsedLimit.year ||
                      (currentYear === parsedLimit.year && currentMonth > parsedLimit.month) ||
                      (currentYear === parsedLimit.year &&
                        currentMonth === parsedLimit.month &&
                        day > parsedLimit.day)
                    ) {
                      isDisabled = true;
                    }
                  }

                  const isSelected = selectedDay === day;
                  let dayClass = styles.calDayBtn;
                  if (isSelected) dayClass += ` ${styles.calDaySelected}`;
                  if (isDisabled) dayClass += ` ${styles.calDayDisabled}`;

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isDisabled}
                      className={dayClass}
                      onClick={() => !isDisabled && setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Informative Date Card */}
            <div className={styles.selectedDateCard}>
              <div className={styles.selectedDateHeader}>
                <div className={styles.selectedDateIconWrap}>
                  <CalendarIcon />
                </div>
                <div className={styles.selectedDateMeta}>
                  <span className={styles.selectedDateLabel}>Selected Date</span>
                  <span className={styles.selectedDateText}>
                    {selectedDay
                      ? `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`
                      : 'Choose a date'}
                  </span>
                </div>
              </div>
              <div className={styles.selectedDateBadges}>
                <span className={styles.visitDurationBadge}>
                  <ClockIcon /> 30 Minutes
                </span>
                <span className={styles.serviceAreaBadge}>Free Consultation</span>
              </div>
            </div>
          </div>

          {/* Column 2: Start Time slots */}
          <div className={styles.columnBlock}>
            <div className={styles.colHeaderRow}>
              <h3 className={styles.colTitle}>
                <ClockIcon />
                Select Time
              </h3>
              {startTime && (
                <button type="button" className={styles.btnClear} onClick={() => setStartTime('')}>
                  Clear
                </button>
              )}
            </div>

            <div className={styles.availabilityNotice}>
              <span className={styles.readyAvailability}>Central Time (CT) • 30 min duration</span>
            </div>

            {/* Time Period Filter Tabs */}
            <div className={styles.timeFilterBar}>
              {(['all', 'morning', 'afternoon', 'evening'] as const).map((period) => {
                const count =
                  period === 'all' ? uniqueTimeSlots.length : getFilteredSlots(period).length;
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
                      timeFilter === period ? styles.filterTabActive : ''
                    }`}
                    onClick={() => setTimeFilter(period)}
                  >
                    {label} <span className={styles.filterCount}>({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable slots grid */}
            <div className={styles.slotsScrollContainer}>
              <div className={styles.slotsGrid}>
                {getFilteredSlots(timeFilter).map((slot, idx) => {
                  let isLimitDisabled = false;
                  if (
                    selectedDay &&
                    parsedLimit &&
                    selectedDay === parsedLimit.day &&
                    currentMonth === parsedLimit.month &&
                    currentYear === parsedLimit.year
                  ) {
                    const slotMin = parseTimeToMinutes(slot);
                    const limitMin = parseTimeToMinutes(serviceSchedule?.startTime);
                    if (slotMin >= limitMin) {
                      isLimitDisabled = true;
                    }
                  }

                  const isBooked = Boolean(unavailableSlots[slot]);
                  const isSlotDisabled = isLimitDisabled || isBooked;

                  return (
                    <button
                      key={`meet-${slot}-${idx}`}
                      type="button"
                      disabled={isSlotDisabled}
                      title={isBooked ? unavailableSlots[slot] : ''}
                      className={`${styles.slotButton} ${
                        startTime === slot ? styles.slotButtonActive : ''
                      } ${isSlotDisabled ? styles.slotButtonDisabled : ''}`}
                      onClick={() => !isSlotDisabled && setStartTime(slot)}
                    >
                      <span className={styles.slotTimeText}>{slot}</span>
                      {isBooked && <span className={styles.bookedTag}>Booked</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 3: Summary Sidebar */}
          <div className={styles.columnBlock}>
            <div className={styles.summaryBox}>
              <div className={styles.colHeaderRow}>
                <h3 className={styles.colTitle}>
                  <BookOpenIcon />
                  Appointment Details
                </h3>
                <button type="button" className={styles.btnClear} onClick={handleClearAll}>
                  Clear All
                </button>
              </div>

              <div className={styles.summaryList}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Selected Date</span>
                  <span className={styles.summaryVal}>
                    {selectedDay
                      ? `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`
                      : 'Not Selected'}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Selected Time</span>
                  <span className={styles.summaryVal}>{startTime || 'Not Selected'}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Duration</span>
                  <span className={styles.summaryVal}>30 Minutes</span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Fee</span>
                  <span className={styles.summaryVal} style={{ color: '#123f3c' }}>
                    Free (Complimentary)
                  </span>
                </div>
              </div>

              <p className={styles.summaryFooterDesc}>
                A dedicated caregiver will come to your home to meet your pet, review routines, and
                confirm emergency contacts.
              </p>

              <button type="button" className={styles.btnConfirm} onClick={handleConfirmClick}>
                Confirm Meet &amp; Greet <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gold Alert Notice: Compulsory Rule */}
      <div className={styles.goldBanner}>
        <div className={styles.goldIconFrame}>
          <UserWarningIcon />
        </div>
        <div className={styles.goldContent}>
          <h4 className={styles.goldTitle}>Meet &amp; Greet is Required for New Clients</h4>
          <p className={styles.goldDesc}>
            To ensure the highest standard of personalized, stress-free care, an in-person Meet
            &amp; Greet is mandatory before we begin your pet&apos;s first service. It must be
            scheduled on or prior to your requested start date.
          </p>
        </div>
      </div>
    </div>
  );
}
