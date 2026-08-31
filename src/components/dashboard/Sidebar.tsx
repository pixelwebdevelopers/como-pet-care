'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Users,
  PawPrint,
  Briefcase,
  CreditCard,
  Clock,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'bookings', name: 'Bookings', icon: <CalendarCheck size={20} /> },
    { id: 'calendar', name: 'Calendar', icon: <CalendarDays size={20} /> },
    { id: 'clients', name: 'Clients', icon: <Users size={20} /> },
    { id: 'pets', name: 'Pets', icon: <PawPrint size={20} /> },
    { id: 'services', name: 'Services & Pricing', icon: <Briefcase size={20} /> },
    { id: 'payments', name: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'waitlist', name: 'Waitlist', icon: <Clock size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Frame */}
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header Brand Logo */}
        <div className="sidebar-logo-container">
          <Image
            src="/assets/como-logo.png"
            alt="CoMo Pet Care Brand Logo"
            width={160}
            height={46}
            className="sidebar-brand-img"
            priority
          />
        </div>

        {/* Navigation Section */}
        <div className="sidebar-nav-section">
          <span className="sidebar-nav-title">NAVIGATION</span>
          <ul className="sidebar-nav-list">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth <= 1024) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sidebar Footer Info & Logout */}
        <div className="sidebar-footer-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            className="sidebar-nav-btn"
            style={{ color: '#b91c1c', padding: '0.85vh 1rem' }}
            onClick={handleLogout}
            title="Log out of admin session"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <div style={{ paddingLeft: '1rem', paddingTop: '4px' }}>
            <p className="sidebar-copyright-text">CoMo Pet Care</p>
            <p className="sidebar-copyright-sub">© 2026 All Rights Reserved</p>
          </div>
        </div>
      </aside>
    </>
  );
}
