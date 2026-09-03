'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  Bell,
  Menu,
  User,
  X,
  Calendar,
  Users,
  PawPrint,
  Tag,
  ArrowRight,
  DollarSign,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  type: 'bookings' | 'clients' | 'pets' | 'services';
}

interface SearchResults {
  bookings: SearchResultItem[];
  clients: SearchResultItem[];
  pets: SearchResultItem[];
  services: SearchResultItem[];
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  adminName?: string;
  adminAvatar?: string | null;
  onLogoutClick?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  onLogoutClick,
  onNavigateTab,
  adminName = 'Como Admin',
  adminAvatar = null,
}: HeaderProps) {
  const [imageError, setImageError] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(adminAvatar);

  // Sync avatar when prop changes or when event is broadcast
  useEffect(() => {
    if (adminAvatar !== undefined) {
      setCurrentAvatar(adminAvatar);
    }
  }, [adminAvatar]);

  useEffect(() => {
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ image?: string | null; name?: string }>;
      if (customEvent.detail) {
        if (customEvent.detail.image !== undefined) {
          setCurrentAvatar(customEvent.detail.image);
        }
      }
    };

    window.addEventListener('admin-profile-updated', handleProfileUpdate);

    // Also fetch current profile if not passed
    if (!adminAvatar) {
      fetch('/api/admin/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user?.image) {
            setCurrentAvatar(data.user.image);
          }
        })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener('admin-profile-updated', handleProfileUpdate);
    };
  }, [adminAvatar]);

  // Search State
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    bookings: [],
    clients: [],
    pets: [],
    services: [],
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  // Notification State
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      title: string;
      desc: string;
      time: string;
      unread: boolean;
      type: 'booking' | 'payment' | 'intake' | 'meet';
      targetTab: string;
    }>
  >([
    {
      id: '1',
      title: 'New Booking Received',
      desc: 'Sarah John booked Drop-In Visits for Max',
      time: '10m ago',
      unread: true,
      type: 'booking',
      targetTab: 'bookings',
    },
    {
      id: '2',
      title: 'Payment Confirmed',
      desc: 'Clark Kent paid $45.00 for Dog Walking',
      time: '1h ago',
      unread: true,
      type: 'payment',
      targetTab: 'payments',
    },
    {
      id: '3',
      title: 'New Customer Intake Form',
      desc: 'Veterinary and emergency details submitted',
      time: '3h ago',
      unread: true,
      type: 'intake',
      targetTab: 'bookings',
    },
  ]);

  // Load live system notifications from API
  useEffect(() => {
    fetch('/api/admin/logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.logs) && data.logs.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const liveNotifs = data.logs.slice(0, 5).map((log: any, idx: number) => {
            let type: 'booking' | 'payment' | 'intake' | 'meet' = 'booking';
            let targetTab = 'bookings';
            if (log.action.includes('PAYMENT')) {
              type = 'payment';
              targetTab = 'payments';
            } else if (log.action.includes('CLIENT')) {
              type = 'intake';
              targetTab = 'clients';
            }

            return {
              id: String(log.id || idx),
              title: log.action.replace(/_/g, ' '),
              desc: log.details || 'System activity logged',
              time: 'Recent',
              unread: idx < 2,
              type,
              targetTab,
            };
          });

          if (liveNotifs.length > 0) {
            setNotifications(liveNotifs);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ bookings: [], clients: [], pets: [], services: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success && data.results) {
          setResults(data.results);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Header search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close search and notifications
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (n: (typeof notifications)[0]) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item)),
    );
    setNotifOpen(false);
    if (onNavigateTab && n.targetTab) {
      onNavigateTab(n.targetTab);
    }
  };

  // Handle selecting a result
  const handleSelectResult = (type: string) => {
    if (onNavigateTab) {
      onNavigateTab(type);
    }
    setIsOpen(false);
    setQuery('');
  };

  const hasAnyResults =
    results.bookings.length > 0 ||
    results.clients.length > 0 ||
    results.pets.length > 0 ||
    results.services.length > 0;

  return (
    <header className="dashboard-header">
      {/* Mobile Sidebar Hamburger Toggle */}
      <button
        className="header-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Navigation Drawer"
      >
        <Menu size={22} />
      </button>

      {/* Header Search Input */}
      <div className="header-search-container" ref={searchContainerRef}>
        <input
          type="text"
          placeholder="Search bookings, clients, pets, services..."
          className="header-search-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length >= 2) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            } else if (e.key === 'Enter') {
              // Navigate to the first available category
              if (results.bookings.length > 0) handleSelectResult('bookings');
              else if (results.clients.length > 0) handleSelectResult('clients');
              else if (results.pets.length > 0) handleSelectResult('pets');
              else if (results.services.length > 0) handleSelectResult('services');
            }
          }}
        />

        {loading && <div className="header-search-spinner" />}

        {query ? (
          <button
            type="button"
            className="header-search-btn"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
          >
            <X size={16} />
          </button>
        ) : (
          <button className="header-search-btn" aria-label="Search submit">
            <Search size={18} />
          </button>
        )}

        {/* Floating Search Results Dropdown */}
        {isOpen && query.trim().length >= 2 && (
          <div className="header-search-dropdown">
            {!hasAnyResults && !loading ? (
              <div className="header-search-empty">
                No matching bookings, clients, pets, or services found for &ldquo;{query}&rdquo;.
              </div>
            ) : (
              <>
                {/* Bookings Group */}
                {results.bookings.length > 0 && (
                  <div className="header-search-group">
                    <div className="header-search-group-title">
                      <Calendar size={13} />
                      <span>Bookings ({results.bookings.length})</span>
                    </div>
                    {results.bookings.map((b) => (
                      <div
                        key={b.id}
                        className="header-search-item"
                        onClick={() => handleSelectResult('bookings')}
                      >
                        <div className="header-search-item-info">
                          <span className="header-search-item-title">{b.title}</span>
                          <span className="header-search-item-sub">{b.subtitle}</span>
                        </div>
                        <span className="header-search-badge">{b.badge}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Clients Group */}
                {results.clients.length > 0 && (
                  <div className="header-search-group">
                    <div className="header-search-group-title">
                      <Users size={13} />
                      <span>Clients ({results.clients.length})</span>
                    </div>
                    {results.clients.map((c) => (
                      <div
                        key={c.id}
                        className="header-search-item"
                        onClick={() => handleSelectResult('clients')}
                      >
                        <div className="header-search-item-info">
                          <span className="header-search-item-title">{c.title}</span>
                          <span className="header-search-item-sub">{c.subtitle}</span>
                        </div>
                        <span className="header-search-badge">{c.badge}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pets Group */}
                {results.pets.length > 0 && (
                  <div className="header-search-group">
                    <div className="header-search-group-title">
                      <PawPrint size={13} />
                      <span>Pets ({results.pets.length})</span>
                    </div>
                    {results.pets.map((p) => (
                      <div
                        key={p.id}
                        className="header-search-item"
                        onClick={() => handleSelectResult('pets')}
                      >
                        <div className="header-search-item-info">
                          <span className="header-search-item-title">{p.title}</span>
                          <span className="header-search-item-sub">{p.subtitle}</span>
                        </div>
                        <span className="header-search-badge">{p.badge}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Services Group */}
                {results.services.length > 0 && (
                  <div className="header-search-group">
                    <div className="header-search-group-title">
                      <Tag size={13} />
                      <span>Services &amp; Pricing ({results.services.length})</span>
                    </div>
                    {results.services.map((s) => (
                      <div
                        key={s.id}
                        className="header-search-item"
                        onClick={() => handleSelectResult('services')}
                      >
                        <div className="header-search-item-info">
                          <span className="header-search-item-title">{s.title}</span>
                          <span className="header-search-item-sub">{s.subtitle}</span>
                        </div>
                        <span className="header-search-badge">{s.badge}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Header Right Actions */}
      <div className="header-actions-container">
        {/* Notification Bell Badge Frame */}
        <div className="header-notif-wrapper" ref={notifContainerRef}>
          <button
            type="button"
            className="header-notif-btn"
            aria-label="Notifications"
            onClick={() => setNotifOpen((prev) => !prev)}
            title="View notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="header-notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="header-notif-dropdown">
              <div className="header-notif-header">
                <span className="header-notif-title">
                  Notifications {unreadCount > 0 && `(${unreadCount} new)`}
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="header-notif-clear-btn"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="header-notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`header-notif-item ${n.unread ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div
                        className="header-notif-icon-badge"
                        style={{
                          backgroundColor:
                            n.type === 'payment'
                              ? 'rgba(16, 185, 129, 0.12)'
                              : n.type === 'intake'
                                ? 'rgba(59, 130, 246, 0.12)'
                                : 'rgba(177, 138, 69, 0.15)',
                          color:
                            n.type === 'payment'
                              ? '#059669'
                              : n.type === 'intake'
                                ? '#2563eb'
                                : '#b18a45',
                        }}
                      >
                        {n.type === 'payment' ? (
                          <DollarSign size={16} />
                        ) : n.type === 'intake' ? (
                          <PawPrint size={16} />
                        ) : (
                          <Calendar size={16} />
                        )}
                      </div>
                      <div className="header-notif-content">
                        <span className="header-notif-item-title">{n.title}</span>
                        <span className="header-notif-item-desc">{n.desc}</span>
                        <span className="header-notif-item-time">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <button
          className="header-profile-btn"
          aria-label="Open profile menu"
          title={`Logged in as ${adminName} - Click to Logout`}
          onClick={() => {
            if (onLogoutClick && confirm('Are you sure you want to log out?')) {
              onLogoutClick();
            }
          }}
        >
          <div
            className="header-avatar-frame"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#123f3c',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {currentAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentAvatar}
                alt={`${adminName}'s Profile Avatar`}
                className="header-avatar-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : !imageError ? (
              <Image
                src="/assets/admin-avatar.jpg"
                alt="Administrator Profile Avatar"
                fill
                sizes="42px"
                className="header-avatar-img"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <User size={20} />
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
