'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { parseDateString, normalizeDateKey } from '@/lib/availability';

interface CalendarEvent {
  id: string;
  reference: string;
  clientName: string;
  petName: string;
  service: string;
  dateNormalized: string;
  time: string;
  dayIndex: number; // 0-6
  hourBracket: number; // 0: 8 AM, 1: 10 AM, 2: 12 PM, 3: 2 PM, 4: 4 PM, 5: 6 PM
  themeClass: string;
}

export default function CalendarOverview({ onSelectBooking }: { onSelectBooking?: (id: string) => void }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

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
          const parsedEvents: CalendarEvent[] = [];

          for (const b of data.bookings) {
            if (b.status === 'CANCELLED') continue;

            const bDate = parseDateString(b.bookingDate);
            if (!bDate) continue;
            const bNorm = normalizeDateKey(bDate);

            // Find matching day in current week
            const dayMatch = days.find((d) => d.dateStr === bNorm);
            if (!dayMatch) continue;

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

            parsedEvents.push({
              id: String(b.id),
              reference: b.reference,
              clientName: `${b.customer?.firstName || ''} ${b.customer?.lastName || ''}`.trim(),
              petName: pet?.name || 'Pet',
              service: b.serviceName,
              dateNormalized: bNorm,
              time: b.startTime || '9:00 AM',
              dayIndex: dayMatch.dayIndex,
              hourBracket: bracket,
              themeClass,
            });
          }

          setEvents(parsedEvents);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-card calendar-overview-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <CalendarDays size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <h2 className="card-title">Calendar Overview</h2>
        </div>
        <select className="calendar-view-select" defaultValue="Weekly">
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Daily</option>
        </select>
      </div>

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
                {bracketEvents.map((evt) => {
                  // Position across 7 columns (each column is ~14.28%)
                  const leftPercent = `${evt.dayIndex * 14.28 + 1}%`;
                  const widthPercent = '12.5%';

                  return (
                    <div
                      key={evt.id}
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
    </div>
  );
}
