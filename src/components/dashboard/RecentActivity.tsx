'use client';

import React from 'react';

// --- RECENT ACTIVITY SVG ICONS ---
const ActivityHeaderIcon = () => (
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
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const DocIcon = () => (
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
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H3.75A2.25 2.25 0 0 0 1.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25h16.5A2.25 2.25 0 0 0 22.5 19.5v-5.25Z"
    />
  </svg>
);

const CheckIcon = () => (
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
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 21 0Z"
    />
  </svg>
);

const CashIcon = () => (
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
      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

interface ActivityItem {
  id: string;
  action: string;
  details: string;
  time: string;
  icon: React.ReactNode;
  themeClass: string;
}

export default function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      action: 'New Booking Created',
      details: 'Max - Dog Walking (30 min)',
      time: '2 min ago',
      icon: <DocIcon />,
      themeClass: 'activity-booking',
    },
    {
      id: '2',
      action: 'Intake Form Completed',
      details: 'Luna',
      time: '3 hr ago',
      icon: <CheckIcon />,
      themeClass: 'activity-intake',
    },
    {
      id: '3',
      action: 'Payment Received',
      details: 'Bella - Pet Sitting $280.00',
      time: '1 Day ago',
      icon: <CashIcon />,
      themeClass: 'activity-payment',
    },
  ];

  return (
    <div className="dashboard-card recent-activity-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <ActivityHeaderIcon />
          <h2 className="card-title">Recent Activity</h2>
        </div>
        <button className="card-header-link" onClick={() => alert('View all activities')}>
          View all →
        </button>
      </div>

      <div className="activity-timeline-container">
        {activities.map((item) => (
          <div key={item.id} className="activity-row">
            <div className={`activity-icon-badge ${item.themeClass}`}>{item.icon}</div>
            <div className="activity-content-box">
              <div className="activity-details-text">
                <span className="activity-action-title">{item.action}</span>
                <span className="activity-details-desc">{item.details}</span>
              </div>
              <span className="activity-time-stamp">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
