'use client';

import React from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';

export interface ScheduleItem {
  id: string;
  time: string;
  service: string;
  duration: string;
  provider: {
    name: string;
    role: string;
  };
  petName?: string;
  status: 'Confirmed' | 'Pending' | 'In Progress';
  reference?: string;
}

interface TodayScheduleProps {
  items?: ScheduleItem[];
  onViewAll?: () => void;
}

export default function TodaySchedule({ items, onViewAll }: TodayScheduleProps) {
  const schedule = items || [];

  return (
    <div className="dashboard-card today-schedule-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <Clock size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <h2 className="card-title">Today&apos;s Schedule</h2>
        </div>
        <button
          className="card-header-link"
          onClick={() => onViewAll?.()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="schedule-items-list">
        {schedule.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              backgroundColor: 'var(--warm-ivory, #fbf9f4)',
              borderRadius: '12px',
              border: '1px dashed var(--card-border, #efe7d8)',
              margin: '8px 0',
            }}
          >
            <Clock size={28} style={{ color: 'var(--primary)', opacity: 0.4, marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: 600, fontSize: '13.5px', color: 'var(--foreground)' }}>
              No appointments scheduled for today
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              New confirmed customer bookings will automatically sync here.
            </p>
          </div>
        ) : (
          schedule.map((item) => (
            <div key={item.id} className="schedule-item-row">
              {/* Time label */}
              <div className="schedule-item-time">{item.time}</div>

              {/* Content box */}
              <div className="schedule-item-details-box">
                <div className="schedule-item-service-group">
                  <span className="schedule-item-service">{item.service}</span>
                  <span className="schedule-item-duration">{item.duration}</span>
                </div>

                {/* Provider / Client Info */}
                <div className="schedule-item-provider">
                  <div
                    className="provider-avatar-frame"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#e6edea',
                      color: '#123f3c',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      flexShrink: 0,
                    }}
                  >
                    <User size={14} />
                  </div>
                  <div className="provider-name-details">
                    <span className="provider-name">{item.provider.name}</span>
                    <span className="provider-role-badge">
                      {item.petName ? `${item.petName} (${item.provider.role})` : item.provider.role}
                    </span>
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
          ))
        )}
      </div>
    </div>
  );
}
