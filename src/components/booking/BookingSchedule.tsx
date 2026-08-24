'use client';

import React, { useState } from 'react';
import styles from './BookingSchedule.module.css';

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
  }) => void;
}

// --- SVGS & ICONS ---
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

const MoonIcon = () => (
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
      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
    />
  </svg>
);

export default function BookingSchedule({
  serviceId,
  selectedPlanId,
  selectedPlanTitle,
  onContinue,
}: BookingScheduleProps) {
  // --- STATE ---
  // Default to August 2026 matching mockup screenshots
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed, so 7 is August

  // Single Date selector state (Case A / Case D)
  const [selectedDay, setSelectedDay] = useState<number>(10); // August 10

  // Date Range selector state (Case B: Overnight Stay)
  const [rangeStart, setRangeStart] = useState<number>(10); // August 10
  const [rangeEnd, setRangeEnd] = useState<number>(17); // August 17

  // Time Slots selection
  const [startTime, setStartTime] = useState<string>('9:00 AM');
  const [endTime, setEndTime] = useState<string>('11:00 AM');

  // Recurring Dog Walking frequency & weekdays
  const [walkFrequency, setWalkFrequency] = useState<string>('1 Walk Per Week');
  const [preferredWeekdays, setPreferredWeekdays] = useState<string[]>(['Thursday']);

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

  // August 2026 starts on Saturday (6 padding days)
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
      // Poop scoop only selects a single preferred weekday
      setPreferredWeekdays([dayName]);
    } else {
      // Dog walking allows multiple selections
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
      onContinue({ walkFrequency, preferredWeekdays });
    } else if (isRecurringScoop) {
      if (preferredWeekdays.length === 0) {
        alert('Please select your preferred cleanup weekday.');
        return;
      }
      onContinue({ preferredWeekdays });
    } else if (isOvernight) {
      if (!rangeStart || !rangeEnd) {
        alert('Please select your arrival and departure dates.');
        return;
      }
      onContinue({
        bookingDate: `${monthNames[currentMonth]} ${rangeStart}, ${currentYear}`,
        bookingEndDate: `${monthNames[currentMonth]} ${rangeEnd}, ${currentYear}`,
        startTime,
        endTime,
      });
    } else {
      if (!selectedDay) {
        alert('Please select a visit date.');
        return;
      }
      onContinue({
        bookingDate: `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`,
        startTime,
        endTime,
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

  const timeSlotsList = [
    '7:00 AM',
    '7:30 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '10:00 PM',
    '11:00 PM',
  ];

  // Calculate length of stay range
  const overnightDaysCount = rangeEnd && rangeStart ? rangeEnd - rangeStart : 0;

  // CASE C: Choose Walk Frequency & Preferred Weekdays (Dog walking recurring)
  if (isRecurringWalk) {
    return (
      <div className={styles.container}>
        <div className={styles.headingGroup}>
          <h2 className={styles.title}>Choose Walk Frequency &amp; Preferred Weekdays</h2>
          <p className={styles.subtitle}>
            Choose how many recurring walks you need each week and select your preferred weekdays.
            CoMo Pet Care will assign the exact walk times based on availability and efficient
            routing.
          </p>
        </div>

        <div className={styles.recurringCard}>
          {/* Frequency pills list */}
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

          {/* Preferred weekdays checkboxes */}
          <div className={styles.weekdaysSelectorContainer}>
            <div className={styles.weekdaysHeader}>
              <ClockIcon />
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
              Continue <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE D: Choose Preferred Weekday (Poop scooping recurring)
  if (isRecurringScoop) {
    return (
      <div className={styles.container}>
        <div className={styles.headingGroup}>
          <h2 className={styles.title}>Choose Preferred Weekday</h2>
          <p className={styles.subtitle}>
            Which day works best for you? Choose your preferred cleanup day. CoMo Pet Care will
            confirm the exact arrival time based on availability and efficient route planning.
          </p>
        </div>

        <div className={styles.recurringCard} style={{ maxWidth: '600px' }}>
          <div className={styles.weekdaysSelectorContainer}>
            <div className={styles.weekdaysHeader}>
              <ClockIcon />
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
              Continue <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE B: Overnight Stay Pet Sitting scheduler (Arrival/Departure Dates + Times + Summary)
  if (isOvernight) {
    return (
      <div className={styles.container}>
        <div className={styles.headingGroup}>
          <h2 className={styles.title}>When Do You Need Pet Sitting?</h2>
          <p className={styles.subtitle}>
            Choose your preferred service date and available start time.
          </p>
        </div>

        <div className={styles.badgeContainer}>
          <span className={styles.serviceBadge}>Overnight Stay</span>
        </div>

        <div className={styles.scheduleCard}>
          <div className={styles.schedulerGrid}>
            {/* 1. Date Range Calendar */}
            <div className={styles.columnBlock}>
              <div className={styles.colHeaderRow}>
                <h3 className={styles.colTitle}>
                  <CalendarIcon />
                  Select Arrival &amp; Departure Date
                </h3>
              </div>

              <div className={styles.calendarFrame}>
                <div className={styles.calHeader}>
                  <button
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
                  <span className={styles.calMonth}>
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <button
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
                      return <div key={`empty-${idx}`} />;
                    }

                    // Highlight Range Starts / Ends / Mids
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

            {/* 2. Arrival/Departure times */}
            <div className={styles.columnBlock}>
              <div>
                <div className={styles.colHeaderRow}>
                  <h3 className={styles.colTitle}>
                    <ClockIcon />
                    Select Start Time
                  </h3>
                  <button className={styles.btnClear} onClick={() => handleClearTime('start')}>
                    Clear
                  </button>
                </div>
                <p className={styles.timeInfo}>All times shown are in Central Time (CT)</p>
              </div>

              <div className={styles.slotsGrid}>
                {timeSlotsList.map((slot) => (
                  <button
                    key={`start-${slot}`}
                    type="button"
                    className={`${styles.slotButton} ${startTime === slot ? styles.slotButtonActive : ''}`}
                    onClick={() => setStartTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '10px' }}>
                <div className={styles.colHeaderRow}>
                  <h3 className={styles.colTitle}>
                    <ClockIcon />
                    Select End Time
                  </h3>
                  <button className={styles.btnClear} onClick={() => handleClearTime('end')}>
                    Clear
                  </button>
                </div>
                <p className={styles.timeInfo}>All times shown are in Central Time (CT)</p>
              </div>

              <div className={styles.slotsGrid}>
                {timeSlotsList.map((slot) => (
                  <button
                    key={`end-${slot}`}
                    type="button"
                    className={`${styles.slotButton} ${endTime === slot ? styles.slotButtonActive : ''}`}
                    onClick={() => setEndTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Length of Stay Sidebar Recap */}
            <div className={styles.columnBlock}>
              <div className={styles.overnightSummaryCard}>
                <div className={styles.colHeaderRow}>
                  <h3 className={styles.colTitle}>
                    <MoonIcon />
                    Length of Stay
                  </h3>
                  <button
                    className={styles.btnClear}
                    onClick={() => {
                      setRangeStart(10);
                      setRangeEnd(17);
                    }}
                  >
                    Clear
                  </button>
                </div>
                <p className={styles.timeInfo}>Total number of service days</p>

                <div className={styles.lengthBox}>
                  <span className={styles.giantLabel}>{overnightDaysCount}</span>
                  <span className={styles.giantSubtext}>Days</span>
                  {rangeStart && rangeEnd && (
                    <span
                      style={{ fontSize: '13px', color: 'rgba(28, 37, 36, 0.7)', marginTop: '8px' }}
                    >
                      {rangeStart} Aug - {rangeEnd} Aug
                    </span>
                  )}
                </div>

                <div className={styles.stayList}>
                  <div className={styles.stayRow}>
                    <span className={styles.stayRowLabel}>Arrival Date</span>
                    <span className={styles.stayRowDate}>
                      {rangeStart
                        ? `Thursday, ${monthNames[currentMonth]} ${rangeStart}, ${currentYear}`
                        : 'Not selected'}
                    </span>
                    <span className={styles.stayRowTime}>
                      Selected Start Time: <strong>{startTime || 'None'}</strong>
                    </span>
                  </div>

                  <div className={styles.stayRow}>
                    <span className={styles.stayRowLabel}>Departure Date</span>
                    <span className={styles.stayRowDate}>
                      {rangeEnd
                        ? `Thursday, ${monthNames[currentMonth]} ${rangeEnd}, ${currentYear}`
                        : 'Not selected'}
                    </span>
                    <span className={styles.stayRowTime}>
                      Selected End Time: <strong>{endTime || 'None'}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom recap actions row */}
          <div className={styles.recapBar}>
            <p className={styles.recapText}>
              {rangeStart && rangeEnd ? (
                <>
                  Arrival:{' '}
                  <span className={styles.recapHighlight}>
                    {monthNames[currentMonth]} {rangeStart}
                  </span>{' '}
                  ({startTime}) • Departure:{' '}
                  <span className={styles.recapHighlight}>
                    {monthNames[currentMonth]} {rangeEnd}
                  </span>{' '}
                  ({endTime})
                </>
              ) : (
                'Select date range above'
              )}
            </p>
            <button className={styles.btnContinue} onClick={handleContinueClick}>
              Continue <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE A: Standard Visit schedule selector (Calendar, Start Time slots, End Time slots)
  const isSitting = serviceId === '3';
  const isFixedDuration = serviceId === '2' || serviceId === '4' || serviceId === '5';

  return (
    <div className={styles.container}>
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
                <CalendarIcon />
                Select Date
              </h3>
            </div>

            <div className={styles.calendarFrame}>
              <div className={styles.calHeader}>
                <button
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
                <span className={styles.calMonth}>
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button
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
                    return <div key={`empty-${idx}`} />;
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
          </div>

          {/* Column 2: Start Time slots */}
          <div className={styles.columnBlock}>
            <div className={styles.colHeaderRow}>
              <h3 className={styles.colTitle}>
                <ClockIcon />
                Select Start Time
              </h3>
              <button className={styles.btnClear} onClick={() => handleClearTime('start')}>
                Clear
              </button>
            </div>
            <p className={styles.timeInfo}>All times shown are in Central Time (CT)</p>

            <div className={styles.slotsGrid}>
              {timeSlotsList.map((slot) => (
                <button
                  key={`start-${slot}`}
                  type="button"
                  className={`${styles.slotButton} ${startTime === slot ? styles.slotButtonActive : ''}`}
                  onClick={() => setStartTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: End Time slots (Hidden for fixed duration services) */}
          {!isFixedDuration && (
            <div className={styles.columnBlock}>
              <div className={styles.colHeaderRow}>
                <h3 className={styles.colTitle}>
                  <ClockIcon />
                  Select End Time
                </h3>
                <button className={styles.btnClear} onClick={() => handleClearTime('end')}>
                  Clear
                </button>
              </div>
              <p className={styles.timeInfo}>All times shown are in Central Time (CT)</p>

              <div className={styles.slotsGrid}>
                {timeSlotsList.map((slot) => (
                  <button
                    key={`end-${slot}`}
                    type="button"
                    className={`${styles.slotButton} ${endTime === slot ? styles.slotButtonActive : ''}`}
                    onClick={() => setEndTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom summary recap row */}
        <div className={styles.recapBar}>
          <p className={styles.recapText}>
            {selectedDay ? (
              <>
                <span className={styles.recapHighlight}>
                  {monthNames[currentMonth]} {selectedDay}, {currentYear}
                </span>{' '}
                • Selected Start Time:{' '}
                <span className={styles.recapHighlight}>{startTime || 'None'}</span>
                {!isFixedDuration && (
                  <>
                    {' '}
                    • Selected End Time:{' '}
                    <span className={styles.recapHighlight}>{endTime || 'None'}</span>
                  </>
                )}
              </>
            ) : (
              'Select date and times above'
            )}
          </p>
          <button className={styles.btnContinue} onClick={handleContinueClick}>
            Continue <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
