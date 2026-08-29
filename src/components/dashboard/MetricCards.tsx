'use client';

import React from 'react';
import { Calendar, PawPrint, DollarSign, Users, TrendingUp } from 'lucide-react';

interface MetricCardsProps {
  bookingsToday?: number;
  visitsThisWeek?: number;
  revenueThisWeek?: string;
  activeClients?: number;
}

export default function MetricCards({
  bookingsToday = 0,
  visitsThisWeek = 0,
  revenueThisWeek = '$0.00',
  activeClients = 0,
}: MetricCardsProps) {
  const metrics = [
    {
      id: 'bookings',
      label: 'Bookings Today',
      value: bookingsToday,
      growth: '+15%',
      comparison: 'vs yesterday',
      icon: <Calendar size={22} />,
      iconClass: 'icon-bookings',
    },
    {
      id: 'visits',
      label: 'Visits This Week',
      value: visitsThisWeek,
      growth: '+24%',
      comparison: 'active schedule',
      icon: <PawPrint size={22} />,
      iconClass: 'icon-visits',
    },
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: revenueThisWeek,
      growth: '+18%',
      comparison: 'completed orders',
      icon: <DollarSign size={22} />,
      iconClass: 'icon-revenue',
    },
    {
      id: 'clients',
      label: 'Active Clients',
      value: activeClients,
      growth: '+8%',
      comparison: 'registered accounts',
      icon: <Users size={22} />,
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
                <TrendingUp size={13} style={{ marginRight: '3px' }} />
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
