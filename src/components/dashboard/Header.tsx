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
  onLogoutClick?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  onLogoutClick,
  onNavigateTab,
  adminName = 'Como Admin',
}: HeaderProps) {
  const [imageError, setImageError] = useState(false);

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

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <button
          className="header-notif-btn"
          aria-label="Notifications"
          onClick={() => alert('No unread notifications')}
        >
          <Bell size={20} />
          <span className="header-notif-badge">3</span>
        </button>

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
            }}
          >
            {!imageError ? (
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
