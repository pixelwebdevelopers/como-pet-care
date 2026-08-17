'use client';

import React from 'react';

// --- CALENDAR SVG ICONS ---
const GridIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{
      width: '18px',
      height: '18px',
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: '6px',
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

export default function CalendarOverview() {
  const days = [
    { name: 'Sun', num: '18', active: false },
    { name: 'Mon', num: '19', active: false },
    { name: 'Tue', num: '20', active: false },
    { name: 'Wed', num: '21', active: false },
    { name: 'Thu', num: '22', active: false },
    { name: 'Fri', num: '23', active: true },
    { name: 'Sat', num: '24', active: false },
  ];

  const hours = ['8 AM', '10 AM', '12 AM', '2 PM', '4 PM', '6 PM'];

  return (
    <div className="dashboard-card calendar-overview-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <GridIcon />
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
              {/* Event Block 1 (Dog Walking - Green) at 8:00 AM on Mon (idx 1) */}
              {idx === 0 && (
                <div
                  className="calendar-event-block event-dogwalking"
                  style={{ left: '15.5%', width: '10%', top: '25%' }}
                  title="Dog Walking"
                />
              )}
              {/* Event Block 2 (Pet Sitting - Cream) at 10:00 AM on Thu (idx 4) */}
              {idx === 0 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '72.5%', width: '10%', top: '25%' }}
                  title="Pet Sitting"
                />
              )}

              {/* Event Block 3 (Drop-in - Gold/Beige) at 10:00 AM on Mon (idx 1) */}
              {idx === 1 && (
                <div
                  className="calendar-event-block event-dropin"
                  style={{ left: '15.5%', width: '10%', top: '25%' }}
                  title="Drop-In Visit"
                />
              )}
              {/* Event Block 4 (Pet Sitting - Cream) at 10:00 AM on Wed (idx 3) */}
              {idx === 1 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '58.5%', width: '10%', top: '25%' }}
                  title="Pet Sitting"
                />
              )}
              {/* Event Block 5 (Pet Sitting - Cream) at 10:00 AM on Sat (idx 6) */}
              {idx === 1 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '86.5%', width: '10%', top: '25%' }}
                  title="Pet Sitting"
                />
              )}

              {/* Event Block 6 (Pet Sitting - Cream) at 12:00 PM on Sun (idx 0) */}
              {idx === 2 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '1.5%', width: '10%', top: '25%' }}
                  title="Pet Sitting"
                />
              )}
              {/* Event Block 7 (Drop-In - Gold/Beige) at 12:00 PM on Tue (idx 2) */}
              {idx === 2 && (
                <div
                  className="calendar-event-block event-dropin"
                  style={{ left: '29.5%', width: '10%', top: '25%' }}
                  title="Drop-In Visit"
                />
              )}

              {/* Event Block 8 (Pet Sitting - Cream) at 2:00 PM on Wed (idx 3) */}
              {idx === 3 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '44%', width: '10%', top: '25%' }}
                  title="Pet Sitting"
                />
              )}
              {/* Event Block 9 (Drop-In - Gold/Beige) at 2:00 PM on Fri (idx 5) */}
              {idx === 3 && (
                <div
                  className="calendar-event-block event-dropin"
                  style={{ left: '72.5%', width: '10%', top: '25%' }}
                  title="Drop-In Visit"
                />
              )}

              {/* Event Block 10 (Drop-In - Gold/Beige) at 4:00 PM on Sun (idx 0) */}
              {idx === 4 && (
                <div
                  className="calendar-event-block event-dropin"
                  style={{ left: '1.5%', width: '10%', top: '25%' }}
                  title="Drop-In Visit"
                />
              )}
              {/* Event Block 11 (Drop-In - Gold/Beige) at 4:00 PM on Thu (idx 4) */}
              {idx === 4 && (
                <div
                  className="calendar-event-block event-dropin"
                  style={{ left: '58.5%', width: '10%', top: '25%' }}
                  title="Drop-In Visit"
                />
              )}
              {/* Event Block 12 (Yard Scoop - Grey) at 4:00 PM on Sat (idx 6) */}
              {idx === 4 && (
                <div
                  className="calendar-event-block event-yardscoop"
                  style={{ left: '86.5%', width: '10%', top: '25%' }}
                  title="Yard Poop Scooping"
                />
              )}

              {/* Event Block 13 (Dog Walking - Green) at 6:00 PM on Mon (idx 1) */}
              {idx === 5 && (
                <div
                  className="calendar-event-block event-dogwalking"
                  style={{ left: '15.5%', width: '10%', top: '25%' }}
                  title="Dog Walking"
                />
              )}
              {/* Event Block 14 (Pet Sitting - Cream) at 6:00 PM on Sat (idx 6) */}
              {idx === 5 && (
                <div
                  className="calendar-event-block event-petsitting"
                  style={{ left: '72.5%', width: '10%', top: '25%' }}
                  title="Pet Sitting"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend markers */}
      <div className="calendar-legend-row">
        <div className="legend-item">
          <span className="legend-dot dot-dogwalking" />
          <span>Dog Walking</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-dropin" />
          <span>Drop-In Visit</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-petsitting" />
          <span>Pet Sitting</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-yardscoop" />
          <span>Yard Poop Scooping</span>
        </div>
      </div>
    </div>
  );
}
