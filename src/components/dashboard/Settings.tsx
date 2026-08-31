'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Settings.module.css';
import {
  Building2,
  Clock,
  Bell,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { parseTimeToMinutes, formatMinutesToTime } from '@/lib/availability';

// --- TYPES ---
type SettingsTab = 'business' | 'schedule' | 'notification' | 'policies';

const TIME_OPTIONS = [
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
];

const ALL_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('business');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  // Business Information Fields
  const [businessName, setBusinessName] = useState<string>('CoMo Pet Care');
  const [businessEmail, setBusinessEmail] = useState<string>('info@comopetcare.com');
  const [businessPhone, setBusinessPhone] = useState<string>('(555) 256-2648');
  const [businessAddress, setBusinessAddress] = useState<string>('123 Main St, Columbia, MO 65201');
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://comopetcare.com');
  const [serviceArea, setServiceArea] = useState<string>(
    'Columbia metro area and surrounding county areas.',
  );

  // Operating Schedule Fields
  const [openingTime, setOpeningTime] = useState<string>('7:00 AM');
  const [closingTime, setClosingTime] = useState<string>('7:00 PM');
  const [slotInterval, setSlotInterval] = useState<number>(30);
  const [enabledDays, setEnabledDays] = useState<string[]>(ALL_WEEKDAYS);
  const [customSlots, setCustomSlots] = useState<string[]>([]);
  const [enabledSections, setEnabledSections] = useState<string[]>(['morning', 'afternoon', 'evening']);

  // Notification Preferences
  const [adminNotificationEmail, setAdminNotificationEmail] = useState<string>('info@comopetcare.com');
  const [sendCustomerConfirmation, setSendCustomerConfirmation] = useState<boolean>(true);
  const [sendAdminNotification, setSendAdminNotification] = useState<boolean>(true);

  // Booking Policies
  const [minAdvanceHours, setMinAdvanceHours] = useState<number>(2);
  const [requireMeetAndGreet, setRequireMeetAndGreet] = useState<boolean>(true);
  const [cancellationPolicy, setCancellationPolicy] = useState<string>(
    'Cancellations made within 24 hours of appointment may incur a 50% cancellation fee.'
  );

  // Load Settings from API
  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        const s = data.settings;
        setBusinessName(s.businessName || 'CoMo Pet Care');
        setBusinessEmail(s.businessEmail || 'info@comopetcare.com');
        setBusinessPhone(s.businessPhone || '(555) 256-2648');
        setBusinessAddress(s.businessAddress || '123 Main St, Columbia, MO 65201');
        setWebsiteUrl(s.websiteUrl || 'https://comopetcare.com');
        setServiceArea(s.serviceArea || '');

        setOpeningTime(s.openingTime || '7:00 AM');
        setClosingTime(s.closingTime || '7:00 PM');
        setSlotInterval(s.slotInterval || 30);

        if (s.enabledDays) {
          setEnabledDays(s.enabledDays.split(',').map((d: string) => d.trim()));
        }

        if (s.customSlots) {
          try {
            const parsed = JSON.parse(s.customSlots);
            if (Array.isArray(parsed)) setCustomSlots(parsed);
          } catch {
            // fallback
          }
        }

        if (s.enabledSections) {
          setEnabledSections(s.enabledSections.split(',').map((sec: string) => sec.trim()));
        }

        setAdminNotificationEmail(s.adminNotificationEmail || 'info@comopetcare.com');
        setSendCustomerConfirmation(s.sendCustomerConfirmation ?? true);
        setSendAdminNotification(s.sendAdminNotification ?? true);

        setMinAdvanceHours(s.minAdvanceHours ?? 2);
        setRequireMeetAndGreet(s.requireMeetAndGreet ?? true);
        setCancellationPolicy(s.cancellationPolicy || '');
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load business settings from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Helper: Generate candidate slots based on opening and closing times
  const generateSlotsForWindow = (start: string, end: string, interval: number): string[] => {
    const startM = parseTimeToMinutes(start);
    const endM = parseTimeToMinutes(end);
    if (endM <= startM) return [start];

    const slots: string[] = [];
    for (let m = startM; m <= endM; m += interval) {
      slots.push(formatMinutesToTime(m));
    }
    return slots;
  };

  // Current window slots
  const availableWindowSlots = generateSlotsForWindow(openingTime, closingTime, slotInterval);

  // Toggle day
  const toggleDay = (day: string) => {
    setEnabledDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Toggle individual custom slot
  const toggleSlot = (slot: string) => {
    setCustomSlots((prev) => {
      const activeList = prev.length > 0 ? prev : availableWindowSlots;
      return activeList.includes(slot)
        ? activeList.filter((s) => s !== slot)
        : [...activeList, slot];
    });
  };

  // Toggle section
  const toggleSection = (section: string) => {
    setEnabledSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // Save changes to database
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // If customSlots is empty, initialize it with all availableWindowSlots
    const finalSlots = customSlots.length > 0 ? customSlots : availableWindowSlots;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          businessEmail,
          businessPhone,
          businessAddress,
          businessHours: `${openingTime} - ${closingTime}`,
          websiteUrl,
          serviceArea,
          openingTime,
          closingTime,
          slotInterval,
          enabledDays: enabledDays.join(','),
          customSlots: JSON.stringify(finalSlots),
          enabledSections: enabledSections.join(','),
          adminNotificationEmail,
          sendCustomerConfirmation,
          sendAdminNotification,
          minAdvanceHours,
          requireMeetAndGreet,
          cancellationPolicy,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: 'Settings saved successfully! Booking form and availability are now synced.',
        });
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to save settings.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error occurred while saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      {/* Subheader Title */}
      <div className="dashboard-title-bar">
        <div className="dashboard-title-group">
          <h1 className="dashboard-overview-title">Business Settings</h1>
          <span className="dashboard-breadcrumb">Dashboard &gt; Settings</span>
        </div>
      </div>

      <div className={styles.settingsCard}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Platform Configurations</h2>
          <p className={styles.cardSubtitle}>
            {loading
              ? 'Loading active business settings...'
              : 'Configure operational hours, availability slots, automated notifications, and business policies.'}
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`${styles.alertBanner} ${
              feedback.type === 'success' ? styles.alertBannerSuccess : styles.alertBannerError
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'business' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('business')}
            >
              <Building2 size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Business Info
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'schedule' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Clock size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Operating Hours &amp; Slots
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'notification' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('notification')}
            >
              <Bell size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Notifications &amp; Email
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'policies' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              <FileCheck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Booking Policies
            </button>
          </div>
        </div>

        {/* TAB 1: BUSINESS INFORMATION */}
        {activeTab === 'business' && (
          <form onSubmit={handleSave} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Business Profile</h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business Name</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Public Business Email</label>
                <input
                  type="email"
                  required
                  className={styles.formInput}
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business Phone Number</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Website URL</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Physical Office / Service Address</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Service Area Coverage</label>
                <textarea
                  className={styles.formTextarea}
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                />
                <span className={styles.formHelper}>
                  Shown to clients during booking to confirm they are within service boundaries (e.g. Columbia, MO).
                </span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={loadSettings}>
                Reset
              </button>
              <button type="submit" className={styles.btnSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Business Info'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: OPERATING HOURS & TIME SLOTS */}
        {activeTab === 'schedule' && (
          <form onSubmit={handleSave} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Operating Hours &amp; Booking Slots</h3>
            <p style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-muted)', margin: '-12px 0 12px 0' }}>
              Set starting and ending times or pick specific active operation slots. Configure sections to show in the client booking form.
            </p>

            {/* Operating Window & Interval */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Daily Starting Time</label>
                <select
                  className={styles.formInput}
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={`start-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className={styles.formHelper}>Earliest available appointment slot</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Daily Ending Time</label>
                <select
                  className={styles.formInput}
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={`end-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className={styles.formHelper}>Latest available appointment slot</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slot Duration / Interval</label>
                <select
                  className={styles.formInput}
                  value={slotInterval}
                  onChange={(e) => setSlotInterval(parseInt(e.target.value, 10))}
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes (1 Hour)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Quick Slot Actions</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    className={styles.dayPill}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => setCustomSlots([...availableWindowSlots])}
                  >
                    Select All Slots
                  </button>
                  <button
                    type="button"
                    className={styles.dayPill}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => setCustomSlots([])}
                  >
                    Reset to Window
                  </button>
                </div>
              </div>

              {/* Operating Days */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Operating Days of the Week</label>
                <div className={styles.daysContainer}>
                  {ALL_WEEKDAYS.map((day) => {
                    const active = enabledDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        className={`${styles.dayPill} ${active ? styles.dayPillActive : ''}`}
                        onClick={() => toggleDay(day)}
                      >
                        {day} {active ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
                <span className={styles.formHelper}>Select days when pet care services are available for booking.</span>
              </div>

              {/* Booking Form Sections Sync */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>
                  Booking Form Filter Sections (Shown to Clients in Booking Form)
                </label>
                <div className={styles.sectionsContainer}>
                  {/* Morning */}
                  <div
                    className={`${styles.sectionCard} ${
                      enabledSections.includes('morning') ? styles.sectionCardActive : ''
                    }`}
                    onClick={() => toggleSection('morning')}
                  >
                    <div className={styles.sectionCardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sun size={18} style={{ color: '#d97706' }} />
                        <span className={styles.sectionTitleBadge}>Morning Section</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabledSections.includes('morning')}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <p className={styles.sectionCardDesc}>
                      Times between 7:00 AM – 11:30 AM. Visible in client booking flow.
                    </p>
                  </div>

                  {/* Afternoon */}
                  <div
                    className={`${styles.sectionCard} ${
                      enabledSections.includes('afternoon') ? styles.sectionCardActive : ''
                    }`}
                    onClick={() => toggleSection('afternoon')}
                  >
                    <div className={styles.sectionCardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sunset size={18} style={{ color: '#b45309' }} />
                        <span className={styles.sectionTitleBadge}>Afternoon Section</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabledSections.includes('afternoon')}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <p className={styles.sectionCardDesc}>
                      Times between 12:00 PM – 4:30 PM. Visible in client booking flow.
                    </p>
                  </div>

                  {/* Evening */}
                  <div
                    className={`${styles.sectionCard} ${
                      enabledSections.includes('evening') ? styles.sectionCardActive : ''
                    }`}
                    onClick={() => toggleSection('evening')}
                  >
                    <div className={styles.sectionCardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Moon size={18} style={{ color: '#4338ca' }} />
                        <span className={styles.sectionTitleBadge}>Evening Section</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabledSections.includes('evening')}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <p className={styles.sectionCardDesc}>
                      Times from 5:00 PM onwards. Visible in client booking flow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-slot Matrix Toggle */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className={styles.formLabel}>
                    Active Time Slots ({customSlots.length > 0 ? customSlots.length : availableWindowSlots.length} active)
                  </label>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Click any slot to enable/disable it
                  </span>
                </div>

                <div className={styles.slotsGridContainer}>
                  {availableWindowSlots.map((slot) => {
                    const isActive =
                      customSlots.length === 0 || customSlots.includes(slot);
                    return (
                      <div
                        key={slot}
                        className={`${styles.slotChip} ${isActive ? styles.slotChipActive : ''}`}
                        onClick={() => toggleSlot(slot)}
                      >
                        {slot}
                      </div>
                    );
                  })}
                </div>
                <span className={styles.formHelper}>
                  Clients will only be able to book the slots highlighted in dark green above.
                </span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={loadSettings}>
                Reset
              </button>
              <button type="submit" className={styles.btnSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Schedule & Slots'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: NOTIFICATIONS & EMAIL */}
        {activeTab === 'notification' && (
          <form onSubmit={handleSave} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Email &amp; Notification Preferences</h3>

            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Admin Alert Notification Email(s)</label>
                <input
                  type="text"
                  required
                  placeholder="admin@comopetcare.com, staff@comopetcare.com"
                  className={styles.formInput}
                  value={adminNotificationEmail}
                  onChange={(e) => setAdminNotificationEmail(e.target.value)}
                />
                <span className={styles.formHelper}>
                  Comma-separated emails that receive instant booking alert notifications.
                </span>
              </div>

              {/* Customer Booking Confirmation Toggle */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabelGroup}>
                    <span className={styles.toggleTitle}>Send Customer Booking Confirmation Email</span>
                    <span className={styles.toggleSubtitle}>
                      Automatically sends a branded, professional receipt &amp; intake instructions to the client.
                    </span>
                  </div>
                  <div
                    className={`${styles.toggleSwitch} ${
                      sendCustomerConfirmation ? styles.toggleSwitchOn : ''
                    }`}
                    onClick={() => setSendCustomerConfirmation(!sendCustomerConfirmation)}
                  >
                    <div className={styles.toggleKnob} />
                  </div>
                </div>
              </div>

              {/* Admin Alert Email Toggle */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabelGroup}>
                    <span className={styles.toggleTitle}>Send Admin Notification Email on New Bookings</span>
                    <span className={styles.toggleSubtitle}>
                      Alerts operations immediately with customer details, pet care routine, and payment status.
                    </span>
                  </div>
                  <div
                    className={`${styles.toggleSwitch} ${
                      sendAdminNotification ? styles.toggleSwitchOn : ''
                    }`}
                    onClick={() => setSendAdminNotification(!sendAdminNotification)}
                  >
                    <div className={styles.toggleKnob} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={loadSettings}>
                Reset
              </button>
              <button type="submit" className={styles.btnSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Notifications'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: BOOKING POLICIES */}
        {activeTab === 'policies' && (
          <form onSubmit={handleSave} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Booking &amp; Service Policies</h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Minimum Advance Notice (Hours)</label>
                <input
                  type="number"
                  min={0}
                  max={72}
                  className={styles.formInput}
                  value={minAdvanceHours}
                  onChange={(e) => setMinAdvanceHours(parseInt(e.target.value, 10) || 0)}
                />
                <span className={styles.formHelper}>
                  Prevents same-day last-minute bookings without prior notice.
                </span>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.toggleRow} style={{ marginTop: '18px' }}>
                  <div className={styles.toggleLabelGroup}>
                    <span className={styles.toggleTitle}>Require Meet &amp; Greet</span>
                    <span className={styles.toggleSubtitle}>For all first-time clients</span>
                  </div>
                  <div
                    className={`${styles.toggleSwitch} ${
                      requireMeetAndGreet ? styles.toggleSwitchOn : ''
                    }`}
                    onClick={() => setRequireMeetAndGreet(!requireMeetAndGreet)}
                  >
                    <div className={styles.toggleKnob} />
                  </div>
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Cancellation Policy Statement</label>
                <textarea
                  className={styles.formTextarea}
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                />
                <span className={styles.formHelper}>
                  Shown on booking confirmation and email receipts.
                </span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={loadSettings}>
                Reset
              </button>
              <button type="submit" className={styles.btnSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Policies'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
