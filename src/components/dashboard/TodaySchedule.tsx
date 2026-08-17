'use client';

import React from 'react';
import Image from 'next/image';

// --- TODAY'S SCHEDULE SVG ICONS ---
const ClockIcon = () => (
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
      marginRight: '4px',
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

interface ScheduleItem {
  id: string;
  time: string;
  service: string;
  duration: string;
  provider: {
    name: string;
    avatar: string;
    role: string;
  };
  status: 'Confirmed' | 'Pending' | 'In Progress';
}

export default function TodaySchedule() {
  const schedule: ScheduleItem[] = [
    {
      id: '1',
      time: '8:00 PM',
      service: 'Dog Walking',
      duration: '30 min',
      provider: {
        name: 'Sarah John',
        avatar: '/assets/walker-avatar.jpg',
        role: 'Buddy',
      },
      status: 'Confirmed',
    },
    {
      id: '2',
      time: '11:00 AM',
      service: 'Dog Walking',
      duration: '30 min',
      provider: {
        name: 'Sarah John',
        avatar: '/assets/walker-avatar.jpg',
        role: 'Buddy',
      },
      status: 'Pending',
    },
    {
      id: '3',
      time: '2:00 PM',
      service: 'Dog Walking',
      duration: '30 min',
      provider: {
        name: 'Sarah John',
        avatar: '/assets/walker-avatar.jpg',
        role: 'Buddy',
      },
      status: 'In Progress',
    },
    {
      id: '4',
      time: '4:00 PM',
      service: 'Dog Walking',
      duration: '30 min',
      provider: {
        name: 'Sarah John',
        avatar: '/assets/walker-avatar.jpg',
        role: 'Buddy',
      },
      status: 'Confirmed',
    },
  ];

  return (
    <div className="dashboard-card today-schedule-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <ClockIcon />
          <h2 className="card-title">Today&apos;s Schedule</h2>
        </div>
        <button className="card-header-link" onClick={() => alert('View all schedule')}>
          View all →
        </button>
      </div>

      <div className="schedule-items-list">
        {schedule.map((item) => (
          <div key={item.id} className="schedule-item-row">
            {/* Time label */}
            <div className="schedule-item-time">{item.time}</div>

            {/* Content box */}
            <div className="schedule-item-details-box">
              <div className="schedule-item-service-group">
                <span className="schedule-item-service">{item.service}</span>
                <span className="schedule-item-duration">{item.duration}</span>
              </div>

              {/* Provider Info */}
              <div className="schedule-item-provider">
                <div className="provider-avatar-frame">
                  <Image
                    src={item.provider.avatar}
                    alt={item.provider.name}
                    fill
                    sizes="24px"
                    className="provider-avatar-img"
                  />
                </div>
                <div className="provider-name-details">
                  <span className="provider-name">{item.provider.name}</span>
                  <span className="provider-role-badge">{item.provider.role}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="schedule-item-status-wrapper">
                <span
                  className={`badge ${
                    item.status === 'Confirmed'
                      ? 'badge-confirmed'
                      : item.status === 'Pending'
                        ? 'badge-pending'
                        : 'badge-in-progress'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
