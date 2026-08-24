'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './CalendarPage.module.css';

// --- TSX TYPES & INTERFACES ---
type CalendarView = 'day' | 'week' | 'month';

interface CalendarBooking {
  id: string;
  reference: string;
  clientName: string;
  petName: string;
  service: string;
  duration: string;
  date: string; // "YYYY-MM-DD"
  time: string;
  status:
    | 'confirmed'
    | 'pending'
    | 'upcoming'
    | 'completed'
    | 'cancelled'
    | 'in_progress'
    | 'unavailable';
}

// --- SVG ICON HELPERS ---
const CalendarIcon = ({
  className = '',
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    style={{ width: '20px', height: '20px', ...style }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const PawIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '20px', height: '20px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm6 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z"
    />
  </svg>
);

const DollarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '20px', height: '20px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818.879-.659c1.546-1.16 3.73-1.16 5.276 0L16.5 15a2.5 2.5 0 0 1-3 0V6a2.5 2.5 0 0 1 3 0l-.379.284c-1.546 1.16-3.73 1.16-5.276 0L9.5 6.5"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '20px', height: '20px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
    />
  </svg>
);

const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
    />
  </svg>
);

export default function CalendarPage() {
  // --- STATE ---
  const [viewMode, setViewMode] = useState<CalendarView>('day');

  // Date states. Default is May 20, 2026 as per mockup
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 4, 20));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 4, 1)); // May 2026

  // Seeded bookings inside calendar schedules
  const [bookings] = useState<CalendarBooking[]>([
    // May 20, 2026 (Mockup list values)
    {
      id: '1',
      reference: '#CMP-1024',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: '2026-05-20',
      time: '8:00 AM',
      status: 'confirmed',
    },
    {
      id: '2',
      reference: '#CMP-1024',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: '2026-05-20',
      time: '8:00 AM',
      status: 'pending',
    },
    {
      id: '3',
      reference: '#CMP-1024',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: '2026-05-20',
      time: '8:00 AM',
      status: 'upcoming',
    },
    {
      id: '4',
      reference: '#CMP-1024',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: '2026-05-20',
      time: '8:00 AM',
      status: 'completed',
    },
    {
      id: '5',
      reference: '#CMP-1024',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: '2026-05-20',
      time: '8:00 AM',
      status: 'cancelled',
    },
    {
      id: '6',
      reference: 'Unavailable',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: '2026-05-20',
      time: '8:00 AM',
      status: 'unavailable',
    },
    {
      id: '7',
      reference: '#CMP-1024',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: '2026-05-20',
      time: '8:00 AM',
      status: 'cancelled',
    },
    // May 19, 2026
    {
      id: '10',
      reference: '#CMP-1020',
      clientName: 'Michael Green',
      petName: 'Luna',
      service: 'Cat Care',
      duration: '30 min',
      date: '2026-05-19',
      time: '9:30 AM',
      status: 'confirmed',
    },
    {
      id: '11',
      reference: '#CMP-1021',
      clientName: 'Michael Green',
      petName: 'Luna',
      service: 'Cat Care',
      duration: '30 min',
      date: '2026-05-19',
      time: '11:00 AM',
      status: 'completed',
    },
    // May 21, 2026
    {
      id: '20',
      reference: '#CMP-1031',
      clientName: 'Emma Watson',
      petName: 'Bella',
      service: 'Pet Sitting',
      duration: '1 Hour',
      date: '2026-05-21',
      time: '10:00 AM',
      status: 'upcoming',
    },
    {
      id: '21',
      reference: '#CMP-1032',
      clientName: 'Emma Watson',
      petName: 'Bella',
      service: 'Pet Sitting',
      duration: '1 Hour',
      date: '2026-05-21',
      time: '2:00 PM',
      status: 'in_progress',
    },
    // May 22, 2026
    {
      id: '30',
      reference: '#CMP-1035',
      clientName: 'David Miller',
      petName: 'Charlie',
      service: 'Grooming',
      duration: '1 Hour',
      date: '2026-05-22',
      time: '12:00 PM',
      status: 'pending',
    },
    // May 24, 2026 (For Upcoming panel widget)
    {
      id: '99',
      reference: '#CMP-1050',
      clientName: 'Michael',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 min',
      date: '2026-05-24',
      time: '8:00 AM',
      status: 'upcoming',
    },
  ]);

  // Status Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // --- CALENDAR WIDGET GENERATION ---
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const totalSlots: (Date | null)[] = [];

    // Add empty/previous month padding
    for (let i = 0; i < firstDayIndex; i++) {
      totalSlots.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      totalSlots.push(new Date(year, month, day));
    }

    return totalSlots;
  };

  const formatDateString = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatHeaderDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // --- FILTER BOOKINGS FOR SELECTED DATE ---
  const activeDateString = formatDateString(selectedDate);
  const dayBookings = bookings.filter((b) => {
    const matchesDate = b.date === activeDateString;
    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  // Helper: Count events on a given date string YYYY-MM-DD
  const getBookingsCountForDate = (dateStr: string) => {
    return bookings.filter((b) => b.date === dateStr).length;
  };

  const getBookingsForDate = (dateStr: string) => {
    return bookings.filter((b) => b.date === dateStr);
  };

  // --- RENDER HELPERS ---

  // 1. Day View Timeline (Mockup Design)
  const renderDayView = () => {
    return (
      <div className={styles.timelineContainer}>
        {dayBookings.length === 0 ? (
          <div className={styles.emptyTimeline}>
            <p style={{ fontWeight: 600, margin: 0, fontSize: '15px' }}>
              No bookings scheduled for this date.
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
              Click another calendar date or change status filter variables.
            </p>
          </div>
        ) : (
          dayBookings.map((b) => {
            let cardClass = styles.slotCard;
            if (b.status === 'completed') cardClass += ` ${styles.slotCardCompleted}`;
            else if (b.status === 'in_progress') cardClass += ` ${styles.slotCardInProgress}`;
            else if (b.status === 'upcoming') cardClass += ` ${styles.slotCardUpcoming}`;
            else if (b.status === 'pending') cardClass += ` ${styles.slotCardPending}`;
            else if (b.status === 'confirmed') cardClass += ` ${styles.slotCardConfirmed}`;
            else if (b.status === 'cancelled') cardClass += ` ${styles.slotCardCancelled}`;
            else if (b.status === 'unavailable') cardClass += ` ${styles.slotCardUnavailable}`;

            return (
              <div key={b.id} className={styles.timelineRow}>
                <span className={styles.timeLabel}>{b.time}</span>
                <div className={cardClass}>
                  <div className={styles.slotMeta}>
                    <span
                      className={styles.slotRef}
                      onClick={() =>
                        alert(
                          `Booking Reference: ${b.reference}\nClient Name: ${b.clientName}\nPet Name: ${b.petName}\nService: ${b.service}\nTime: ${b.time} (${b.duration})`,
                        )
                      }
                    >
                      {b.reference}
                    </span>
                    <span className={styles.slotBoldText}>{b.clientName}</span>
                    <span className={styles.slotNormalText}>{b.petName}</span>
                    <span className={styles.slotBoldText}>{b.service}</span>
                  </div>
                  <div>
                    <span className={styles.slotDuration}>{b.duration}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Legend row */}
        <div className={styles.legendRow}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotCompleted}`} />
            <span>Completed</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotInProgress}`} />
            <span>In Progress</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotUpcoming}`} />
            <span>Upcoming</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotPending}`} />
            <span>Pending</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotConfirmed}`} />
            <span>Confirmed</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotCancelled}`} />
            <span>Cancelled</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotUnavailable}`} />
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    );
  };

  // 2. Week View Column Layout
  const renderWeekView = () => {
    // Generate dates for current selected week (Mon to Sun)
    const currentDayOfWeek = selectedDate.getDay(); // 0 (Sun) to 6 (Sat)
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() + mondayOffset);

    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(startOfWeek);
      nextDay.setDate(startOfWeek.getDate() + i);
      weekDays.push(nextDay);
    }

    return (
      <div className={styles.weekGrid}>
        {weekDays.map((day, idx) => {
          const dateStr = formatDateString(day);
          const dayEvents = getBookingsForDate(dateStr);
          const isActiveDay =
            selectedDate.getDate() === day.getDate() && selectedDate.getMonth() === day.getMonth();

          const dayLabel = day.toLocaleDateString('en-US', { weekday: 'short' });
          const dateNum = day.getDate();

          return (
            <div key={idx} className={styles.weekCol}>
              <div
                className={`${styles.weekColHeader} ${isActiveDay ? styles.weekColActiveHeader : ''}`}
              >
                <span className={styles.weekColDayName}>{dayLabel}</span>
                <span className={styles.weekColDateNum}>{dateNum}</span>
              </div>

              {dayEvents.length === 0 ? (
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    Empty
                  </span>
                </div>
              ) : (
                dayEvents.map((evt) => {
                  let indicatorColor = '#123f3c';
                  if (evt.status === 'completed') indicatorColor = '#10b981';
                  else if (evt.status === 'in_progress') indicatorColor = '#b18a45';
                  else if (evt.status === 'upcoming') indicatorColor = '#8b5cf6';
                  else if (evt.status === 'pending') indicatorColor = '#f59e0b';
                  else if (evt.status === 'cancelled') indicatorColor = '#ef4444';
                  else if (evt.status === 'unavailable') indicatorColor = '#6b7280';

                  return (
                    <div
                      key={evt.id}
                      className={styles.weekCardMini}
                      style={{ borderLeftColor: indicatorColor }}
                      onClick={() => {
                        setSelectedDate(day);
                        alert(
                          `Booking reference: ${evt.reference}\nPet: ${evt.petName}\nService: ${evt.service}\nTime: ${evt.time}`,
                        );
                      }}
                    >
                      <span className={styles.weekCardTitle}>{evt.petName}</span>
                      <span className={styles.weekCardDesc}>{evt.service}</span>
                      <span className={styles.weekCardDesc} style={{ fontWeight: 600 }}>
                        {evt.time}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 3. Month View Calendar Grid Box
  const renderMonthView = () => {
    const days = generateCalendarDays();
    const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          {weekLabels.map((lbl, idx) => (
            <span
              key={idx}
              style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}
            >
              {lbl}
            </span>
          ))}
        </div>

        <div className={styles.monthGrid}>
          {days.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className={styles.monthDayBox}
                  style={{ backgroundColor: 'rgba(28,37,36,0.02)', cursor: 'default' }}
                />
              );
            }

            const dateStr = formatDateString(day);
            const dayEvents = getBookingsForDate(dateStr);
            const isActiveDay =
              selectedDate.getDate() === day.getDate() &&
              selectedDate.getMonth() === day.getMonth();

            return (
              <div
                key={idx}
                className={styles.monthDayBox}
                onClick={() => setSelectedDate(day)}
                style={{
                  borderColor: isActiveDay ? 'var(--primary)' : 'var(--card-border)',
                  backgroundColor: isActiveDay ? 'rgba(18, 63, 60, 0.01)' : 'var(--card-bg)',
                }}
              >
                <div className={styles.monthDayBoxHeader}>
                  <span
                    className={`${styles.monthDayBoxNum} ${isActiveDay ? styles.monthDayBoxActiveHeader : ''}`}
                  >
                    {day.getDate()}
                  </span>
                </div>

                <div className={styles.monthDayEvents}>
                  {dayEvents.slice(0, 3).map((evt) => {
                    let badgeClass = styles.monthEventBadge;
                    if (evt.status === 'completed') badgeClass += ` ${styles.monthBadgeCompleted}`;
                    else if (evt.status === 'in_progress')
                      badgeClass += ` ${styles.monthBadgeInProgress}`;
                    else if (evt.status === 'upcoming')
                      badgeClass += ` ${styles.monthBadgeUpcoming}`;
                    else if (evt.status === 'pending') badgeClass += ` ${styles.monthBadgePending}`;
                    else if (evt.status === 'confirmed')
                      badgeClass += ` ${styles.monthBadgeConfirmed}`;
                    else if (evt.status === 'cancelled')
                      badgeClass += ` ${styles.monthBadgeCancelled}`;
                    else if (evt.status === 'unavailable')
                      badgeClass += ` ${styles.monthBadgeUnavailable}`;

                    return (
                      <span key={evt.id} className={badgeClass}>
                        {evt.petName} ({evt.service.split(' ')[0]})
                      </span>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textAlign: 'center',
                        display: 'block',
                      }}
                    >
                      +{dayEvents.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Header bar and breadcrumb */}
      <div className="dashboard-title-bar">
        <h1 className="dashboard-overview-title">Calendar</h1>
        <span className="dashboard-breadcrumb">Home &gt; Calendar</span>
      </div>

      {/* Pill Segmented View Controller */}
      <div className={styles.headerToggleRow}>
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${viewMode === 'day' ? styles.toggleButtonActive : ''}`}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
          <button
            className={`${styles.toggleButton} ${viewMode === 'week' ? styles.toggleButtonActive : ''}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button
            className={`${styles.toggleButton} ${viewMode === 'month' ? styles.toggleButtonActive : ''}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
        </div>
      </div>

      {/* Metrics Row (matching the mockup exactly) */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIconFrame}>
            <CalendarIcon className={styles.detailsCardIcon} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricTitle}>Bookings Today</span>
            <span className={styles.metricValue}>12</span>
            <span className={styles.metricTrend}>↑ 20% vs yesterday</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconFrame}>
            <PawIcon />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricTitle}>Visit This Week</span>
            <span className={styles.metricValue}>38</span>
            <span className={styles.metricTrend}>↑ 20% vs last week</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconFrame}>
            <DollarIcon />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricTitle}>Upcoming Revenue</span>
            <span className={styles.metricValue}>$1,218</span>
            <span className={styles.metricTrend}>↑ 20% vs last week</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconFrame}>
            <UserIcon />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricTitle}>Active Clients</span>
            <span className={styles.metricValue}>38</span>
            <span className={styles.metricTrend}>↑ 20% vs last month</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className={styles.calendarLayout}>
        {/* Left Column: Calendar Schedule Cards */}
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <CalendarIcon className={styles.detailsCardIcon} />
              <h2 className={styles.cardTitle}>
                Calendar Overview{' '}
                <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                  ({selectedDate.toDateString() === new Date().toDateString() ? 'Today, ' : ''}
                  {selectedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  )
                </span>
              </h2>
            </div>

            {viewMode === 'day' && (
              <div className={styles.actionButtonsGroup}>
                <button
                  className={`${styles.btnSecondary} ${statusFilter !== 'all' ? styles.btnSecondaryActive : ''}`}
                  onClick={() => {
                    // Quick Filter cycle
                    setStatusFilter((prev) => {
                      if (prev === 'all') return 'confirmed';
                      if (prev === 'confirmed') return 'pending';
                      if (prev === 'pending') return 'cancelled';
                      return 'all';
                    });
                  }}
                >
                  <FilterIcon />
                  Filter: {statusFilter.toUpperCase()}
                </button>
                <button
                  className={styles.btnSecondary}
                  onClick={() => alert('Sorting schedule slots...')}
                >
                  <SortIcon />
                  Sort By
                </button>
              </div>
            )}
          </div>

          {/* Render Active View Schedule content */}
          {viewMode === 'day' && renderDayView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'month' && renderMonthView()}
        </div>

        {/* Right Column: Sidebar Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Interactive Mini Calendar Grid */}
          <div className={styles.sidebarCard}>
            <div className={styles.miniCalendarContainer}>
              <div className={styles.calendarWidgetHeader}>
                <div className={styles.calendarWidgetDateCol}>
                  <span className={styles.calendarWidgetMonth}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className={styles.calendarWidgetDayName}>
                    {formatHeaderDate(selectedDate)}
                  </span>
                </div>
                <div className={styles.calendarWidgetNav}>
                  <button className={styles.calendarWidgetNavBtn} onClick={handlePrevMonth}>
                    &lt;
                  </button>
                  <button className={styles.calendarWidgetNavBtn} onClick={handleNextMonth}>
                    &gt;
                  </button>
                </div>
              </div>

              {/* Grid cell headers */}
              <div className={styles.calendarGrid}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((lbl, idx) => (
                  <span key={idx} className={styles.calendarGridHeaderCell}>
                    {lbl}
                  </span>
                ))}

                {/* Calendar Days */}
                {generateCalendarDays().map((day, idx) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className={`${styles.calendarGridCell} ${styles.calendarGridCellEmpty}`}
                      />
                    );
                  }

                  const isActive =
                    selectedDate.getDate() === day.getDate() &&
                    selectedDate.getMonth() === day.getMonth() &&
                    selectedDate.getFullYear() === day.getFullYear();

                  const dayEventsCount = getBookingsCountForDate(formatDateString(day));

                  return (
                    <div
                      key={idx}
                      className={`${styles.calendarGridCell} ${isActive ? styles.calendarGridCellActive : ''}`}
                      onClick={() => setSelectedDate(day)}
                      style={{
                        position: 'relative',
                        fontWeight: dayEventsCount > 0 ? '700' : '500',
                      }}
                    >
                      {day.getDate()}
                      {dayEventsCount > 0 && !isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--antique-gold, #b18a45)',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Upcoming Booking sidebar component */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarWidgetTitle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{
                  width: '18px',
                  height: '18px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3m-3-6h5.25m-6.75 3h.008v.008H6V12Zm0 3h.008v.008H6V15Zm0-6h.008v.008H6V9m.75-3h10.5a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 16.5 21h-10.5A2.25 2.25 0 0 1 3.75 18.75V8.25A2.25 2.25 0 0 1 6 6Z"
                />
              </svg>
              Upcoming Booking
            </h3>

            <div
              className={styles.upcomingCard}
              onClick={() =>
                alert(
                  'Upcoming Booking details:\nClient: Michael\nPet: Buddy (Dog)\nService: Dog Walking (30 min)\nTime: May 24, 2026 at 8:00 AM',
                )
              }
            >
              <div className={styles.avatarFrame}>
                <Image
                  src="/assets/dog-avatar.jpg"
                  alt="Pet dog avatar Buddy"
                  fill
                  sizes="38px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.upcomingInfo}>
                <span className={styles.upcomingTitle}>Michael</span>
                <span className={styles.upcomingSubtitle}>Buddy</span>
                <span
                  className={styles.upcomingSubtitle}
                  style={{ fontWeight: 600, color: 'var(--primary)' }}
                >
                  May 24, 2026 • 8:00 AM
                </span>
                <span className={styles.upcomingSubtitle}>Dog Walking • 30 min</span>
              </div>
              <div className={styles.chevronCol}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  style={{ width: '16px', height: '16px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
