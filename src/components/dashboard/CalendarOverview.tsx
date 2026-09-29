'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Calendar as CalendarIcon, PawPrint } from 'lucide-react';
import { parseDateString, normalizeDateKey } from '@/lib/availability';

interface CalendarEvent {
  id: string;
  reference: string;
  clientName: string;
  petName: string;
  service: string;
  dateNormalized: string;
  endDateNormalized?: string;
  time: string;
  dayIndex: number; // 0-6
  hourBracket: number; // 0: 8 AM, 1: 10 AM, 2: 12 PM, 3: 2 PM, 4: 4 PM, 5: 6 PM
  themeClass: string;
}

export default function CalendarOverview({ onSelectBooking }: { onSelectBooking?: (id: string) => void }) {
  const [viewMode, setViewMode] = useState<'Weekly' | 'Monthly' | 'Daily'>('Weekly');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawBookings, setRawBookings] = useState<any[]>([]);

  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayOfWeek);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      name: dayNames[i],
      num: String(d.getDate()),
      dateStr: normalizeDateKey(d),
      active: d.toDateString() === today.toDateString(),
      dayIndex: i,
    };
  });

  const hours = [
    { label: '8 AM', minHour: 7, maxHour: 9 },
    { label: '10 AM', minHour: 9, maxHour: 11 },
    { label: '12 PM', minHour: 11, maxHour: 13 },
    { label: '2 PM', minHour: 13, maxHour: 15 },
    { label: '4 PM', minHour: 15, maxHour: 17 },
    { label: '6 PM', minHour: 17, maxHour: 20 },
  ];

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookings)) {
          setRawBookings(data.bookings);
          const parsedEvents: CalendarEvent[] = [];

          for (const b of data.bookings) {
            if (b.status === 'CANCELLED') continue;

            const bDate = parseDateString(b.bookingDate);
            if (!bDate) continue;
            const bNorm = normalizeDateKey(bDate);
            const bEndNorm = b.bookingEndDate ? normalizeDateKey(parseDateString(b.bookingEndDate) || bDate) : bNorm;

            // Determine hour bracket
            let bracket = 0;
            const timeUpper = (b.startTime || '9:00 AM').toUpperCase();
            let hr = parseInt(timeUpper.split(':')[0], 10);
            if (timeUpper.includes('PM') && hr < 12) hr += 12;
            if (timeUpper.includes('AM') && hr === 12) hr = 0;

            if (hr < 9) bracket = 0;
            else if (hr < 11) bracket = 1;
            else if (hr < 13) bracket = 2;
            else if (hr < 15) bracket = 3;
            else if (hr < 17) bracket = 4;
            else bracket = 5;

            // Theme class based on service
            let themeClass = 'event-dogwalking';
            const sName = (b.serviceName || '').toLowerCase();
            if (sName.includes('sitting')) themeClass = 'event-petsitting';
            else if (sName.includes('drop')) themeClass = 'event-dropin';

            const pet = b.customer?.pets?.[0];

            // Add event for all matching days in the current week (handles multi-day overnights)
            for (const d of days) {
              if (d.dateStr >= bNorm && d.dateStr <= bEndNorm) {
                parsedEvents.push({
                  id: String(b.id),
                  reference: b.reference,
                  clientName: `${b.customer?.firstName || ''} ${b.customer?.lastName || ''}`.trim(),
                  petName: pet?.name || 'Pet',
                  service: b.serviceName,
                  dateNormalized: d.dateStr,
                  endDateNormalized: bEndNorm,
                  time: b.startTime || '9:00 AM',
                  dayIndex: d.dayIndex,
                  hourBracket: bracket,
                  themeClass,
                });
              }
            }
          }

          setEvents(parsedEvents);
        }
      })
      .catch(() => {});
  }, []);

  // Today's events for Daily view
  const todayNormalized = normalizeDateKey(today);
  const todayEvents = events.filter((e) => e.dateNormalized === todayNormalized);

  // Month days generation for Monthly view
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const monthGridDays: { num: number; dateStr: string; isToday: boolean; count: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dObj = new Date(year, month, d);
    const dStr = normalizeDateKey(dObj);
    const count = rawBookings.filter((b) => {
      if (b.status === 'CANCELLED') return false;
      const bStart = normalizeDateKey(parseDateString(b.bookingDate) || new Date(0));
      const bEnd = b.bookingEndDate ? normalizeDateKey(parseDateString(b.bookingEndDate) || new Date(0)) : bStart;
      return dStr >= bStart && dStr <= bEnd;
    }).length;

    monthGridDays.push({
      num: d,
      dateStr: dStr,
      isToday: dStr === todayNormalized,
      count,
    });
  }

  return (
    <div className="dashboard-card calendar-overview-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <CalendarDays size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <h2 className="card-title">Calendar Overview</h2>
        </div>
        <select
          className="calendar-view-select"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as 'Weekly' | 'Monthly' | 'Daily')}
          style={{ cursor: 'pointer' }}
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Daily">Daily</option>
        </select>
      </div>

      {viewMode === 'Weekly' && (
        <>
          {/* Days Navigation Header */}
          <div className="calendar-days-header">
            {days.map((day, idx) => (
              <div key={idx} className={`calendar-day-col ${day.active ? 'active' : ''}`}>
                <span className="calendar-day-name">{day.name}</span>
                <span className="calendar-day-number">{day.num}</span>
              </div>
            ))}
          </div>

          {/* Hour Grid Slots */}
          <div className="calendar-grid-container">
            {hours.map((hourObj, bracketIdx) => {
              const bracketEvents = events.filter((e) => e.hourBracket === bracketIdx);

              return (
                <div key={bracketIdx} className="calendar-grid-row">
                  <span className="calendar-row-time-lbl">{hourObj.label}</span>
                  <div className="calendar-row-slots" style={{ position: 'relative' }}>
                    {bracketEvents.map((evt, eIdx) => {
                      const leftPercent = `${evt.dayIndex * 14.28 + 1}%`;
                      const widthPercent = '12.5%';

                      return (
                        <div
                          key={`${evt.id}-${evt.dayIndex}-${eIdx}`}
                          className={`calendar-event-block ${evt.themeClass}`}
                          style={{
                            left: leftPercent,
                            width: widthPercent,
                            top: '15%',
                            cursor: 'pointer',
                            zIndex: 2,
                          }}
                          title={`${evt.service} (${evt.time}) - ${evt.clientName} [${evt.petName}] (${evt.reference})`}
                          onClick={() => onSelectBooking?.(evt.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {viewMode === 'Daily' && (
        <div style={{ padding: '12px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 8px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)' }}>
              Today: {today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {todayEvents.length} {todayEvents.length === 1 ? 'appointment' : 'appointments'} scheduled
            </span>
          </div>

          {todayEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 16px', backgroundColor: 'var(--warm-ivory, #fbf9f4)', borderRadius: '10px', border: '1px dashed var(--card-border, #efe7d8)' }}>
              <Clock size={24} style={{ color: 'var(--primary)', opacity: 0.4, marginBottom: '6px' }} />
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>No appointments today</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>Use the Weekly or Monthly view to inspect upcoming bookings.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {todayEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectBooking?.(evt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--warm-ivory, #fbf9f4)',
                    border: '1px solid var(--card-border, #efe7d8)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e6edea', color: '#123f3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PawPrint size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#123f3c' }}>{evt.clientName} ({evt.petName})</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{evt.service} • Ref: {evt.reference}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#b18a45' }}>{evt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === 'Monthly' && (
        <div style={{ padding: '8px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '0 6px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CalendarIcon size={15} /> {monthName}
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Month at a glance</span>
          </div>

          {/* Month Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '6px' }}>
            {dayNames.map((d, idx) => (
              <span key={idx} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{d}</span>
            ))}
          </div>

          {/* Month Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '36px', borderRadius: '6px' }} />
            ))}
            {monthGridDays.map((d) => (
              <div
                key={d.dateStr}
                style={{
                  height: '36px',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11.5px',
                  fontWeight: d.isToday ? 800 : 500,
                  backgroundColor: d.isToday ? '#123f3c' : d.count > 0 ? '#e6edea' : '#faf8f5',
                  color: d.isToday ? '#ffffff' : d.count > 0 ? '#123f3c' : 'inherit',
                  border: d.isToday ? '1px solid #123f3c' : '1px solid #efe7d8',
                  position: 'relative',
                }}
              >
                <span>{d.num}</span>
                {d.count > 0 && (
                  <span
                    style={{
                      fontSize: '9px',
                      lineHeight: '1',
                      fontWeight: 700,
                      color: d.isToday ? '#f5eee3' : '#b18a45',
                    }}
                  >
                    {d.count} {d.count === 1 ? 'bk' : 'bks'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

