'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function CalendarOverview() {
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
      active: d.toDateString() === today.toDateString(),
    };
  });

  const hours = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'];

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
        {hours.map((hour, idx) => (
          <div key={idx} className="calendar-grid-row">
            <span className="calendar-row-time-lbl">{hour}</span>
            <div className="calendar-row-slots">
              {/* Event Block 1 (Dog Walking - Green) */}
              {idx === 0 && (
                <div
                  className="calendar-event-block event-dogwalking"
                  style={{ left: '15.5%', width: '12%', top: '20%' }}
                  title="Dog Walking (Active Booking)"
                />
              )}
              {/* Event Block 2 (Pet Sitting - Cream) */}
              {idx === 0 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '72.5%', width: '12%', top: '20%' }}
                  title="Pet Sitting"
                />
              )}

              {/* Event Block 3 (Drop-in - Gold/Beige) */}
              {idx === 1 && (
                <div
                  className="calendar-event-block event-dropin"
                  style={{ left: '15.5%', width: '12%', top: '20%' }}
                  title="Drop-In Visit"
                />
              )}
              {/* Event Block 4 (Pet Sitting - Cream) */}
              {idx === 1 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '58.5%', width: '12%', top: '20%' }}
                  title="Pet Sitting"
                />
              )}
              {/* Event Block 5 (Pet Sitting - Cream) */}
              {idx === 1 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '86.5%', width: '10%', top: '20%' }}
                  title="Pet Sitting"
                />
              )}

              {/* Event Block 6 (Pet Sitting - Cream) */}
              {idx === 2 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '1.5%', width: '12%', top: '20%' }}
                  title="Pet Sitting"
                />
              )}
              {/* Event Block 7 (Drop-In - Gold/Beige) */}
              {idx === 2 && (
                <div
                  className="calendar-event-block event-dropin"
                  style={{ left: '29.5%', width: '12%', top: '20%' }}
                  title="Drop-In Visit"
                />
              )}

              {/* Event Block 8 (Pet Sitting - Cream) */}
              {idx === 3 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '44%', width: '12%', top: '20%' }}
                  title="Pet Sitting"
                />
              )}
              {/* Event Block 9 (Drop-In - Gold/Beige) */}
              {idx === 3 && (
                <div
                  className="calendar-event-block event-dropin"
                  style={{ left: '72.5%', width: '12%', top: '20%' }}
                  title="Drop-In Visit"
                />
              )}

              {/* Event Block 10 (Dog Walking - Green) */}
              {idx === 4 && (
                <div
                  className="calendar-event-block event-dogwalking"
                  style={{ left: '29.5%', width: '12%', top: '20%' }}
                  title="Dog Walking"
                />
              )}
              {/* Event Block 11 (Pet Sitting - Cream) */}
              {idx === 4 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '86.5%', width: '10%', top: '20%' }}
                  title="Pet Sitting"
                />
              )}

              {/* Event Block 12 (Drop-In - Gold/Beige) */}
              {idx === 5 && (
                <div
                  className="calendar-event-block event-dropin"
                  style={{ left: '44%', width: '12%', top: '20%' }}
                  title="Drop-In Visit"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
