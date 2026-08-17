'use client';

import React from 'react';
import Image from 'next/image';

// --- HEADER SVG ICONS ---
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '20px', height: '20px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.636Z"
    />
  </svg>
);

const NotificationBellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '22px', height: '22px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
    />
  </svg>
);

const MenuToggleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '24px', height: '24px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  adminName?: string;
  onLogoutClick?: () => void;
}

export default function Header({ sidebarOpen, setSidebarOpen, onLogoutClick }: HeaderProps) {
  return (
    <header className="dashboard-header">
      {/* Mobile Sidebar Hamburger Toggle */}
      <button
        className="header-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Navigation Drawer"
      >
        <MenuToggleIcon />
      </button>

      {/* Header Search Input */}
      <div className="header-search-container">
        <input type="text" placeholder="Search here" className="header-search-input" />
        <button className="header-search-btn" aria-label="Search submit">
          <SearchIcon />
        </button>
      </div>

      {/* Header Right Actions */}
      <div className="header-actions-container">
        {/* Notification Bell Badge Frame */}
        <button
          className="header-notif-btn"
          aria-label="Notifications"
          onClick={() => alert('Notifications clicked')}
        >
          <NotificationBellIcon />
          <span className="header-notif-badge">12</span>
        </button>

        {/* Profile Avatar Trigger */}
        <button
          className="header-profile-btn"
          aria-label="Open profile menu"
          onClick={() => {
            if (onLogoutClick && confirm('Are you sure you want to log out?')) {
              onLogoutClick();
            }
          }}
        >
          <div className="header-avatar-frame">
            <Image
              src="/assets/admin-avatar.jpg"
              alt="Administrator Profile Avatar"
              fill
              sizes="42px"
              className="header-avatar-img"
              priority
            />
          </div>
        </button>
      </div>
    </header>
  );
}
