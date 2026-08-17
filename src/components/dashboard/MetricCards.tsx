'use client';

import React from 'react';

// --- METRIC SVG ICONS ---
const CalendarMetricIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const PawMetricIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm6 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z"
    />
  </svg>
);

const DollarMetricIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const UserMetricIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{ width: '12px', height: '12px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
);

interface MetricCardsProps {
  bookingsToday?: number;
  visitsThisWeek?: number;
  revenueThisWeek?: string;
  activeClients?: number;
}

export default function MetricCards({
  bookingsToday = 12,
  visitsThisWeek = 38,
  revenueThisWeek = '$1,218',
  activeClients = 38,
}: MetricCardsProps) {
  const metrics = [
    {
      id: 'bookings',
      label: 'Bookings Today',
      value: bookingsToday,
      growth: '20%',
      comparison: 'vs yesterday',
      icon: <CalendarMetricIcon />,
      iconClass: 'icon-bookings',
    },
    {
      id: 'visits',
      label: 'Visit This Week',
      value: visitsThisWeek,
      growth: '20%',
      comparison: 'vs last week',
      icon: <PawMetricIcon />,
      iconClass: 'icon-visits',
    },
    {
      id: 'revenue',
      label: 'Upcoming Revenue',
      value: revenueThisWeek,
      growth: '20%',
      comparison: 'vs last week',
      icon: <DollarMetricIcon />,
      iconClass: 'icon-revenue',
    },
    {
      id: 'clients',
      label: 'Active Clients',
      value: activeClients,
      growth: '20%',
      comparison: 'vs last month',
      icon: <UserMetricIcon />,
      iconClass: 'icon-clients',
    },
  ];

  return (
    <div className="metrics-cards-grid">
      {metrics.map((card) => (
        <div key={card.id} className="metric-card">
          <div className={`metric-card-icon-frame ${card.iconClass}`}>{card.icon}</div>
          <div className="metric-card-data">
            <span className="metric-card-label">{card.label}</span>
            <span className="metric-card-value">{card.value}</span>
            <div className="metric-card-growth">
              <span className="growth-indicator-green">
                <ArrowUpIcon />
                {card.growth}
              </span>
              <span className="comparison-label">{card.comparison}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
