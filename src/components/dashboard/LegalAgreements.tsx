'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './LegalAgreements.module.css';
import {
  FileText,
  ShieldCheck,
  Eye,
  History,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Calendar,
  Layers,
  X,
  Plus,
  Search,
  Download,
} from 'lucide-react';
import LegalDocumentModal from '@/components/legal/LegalDocumentModal';
import LegalDocumentViewer from '@/components/legal/LegalDocumentViewer';

interface LegalDoc {
  id: number;
  type: string; // 'TERMS' | 'WAIVER'
  title: string;
  version: string;
  status: string; // 'PUBLISHED' | 'ARCHIVED' | 'DRAFT'
  content: string;
  changeNotes?: string | null;
  effectiveDate: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AcceptanceRecord {
  id: number;
  termsVersion: string;
  waiverVersion: string;
  signerLegalName: string;
  signatureImage?: string | null;
  ipAddress?: string | null;
  acceptedAt: string;
  customer?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  booking?: {
    id: number;
    reference: string;
    serviceName: string;
    bookingDate: string;
    totalPrice?: any;
  };
}

export default function LegalAgreements() {
  const [termsCurrent, setTermsCurrent] = useState<LegalDoc | null>(null);
  const [waiverCurrent, setWaiverCurrent] = useState<LegalDoc | null>(null);
  const [termsHistory, setTermsHistory] = useState<LegalDoc[]>([]);
  const [waiverHistory, setWaiverHistory] = useState<LegalDoc[]>([]);
  const [stats, setStats] = useState<{
    totalAcceptances: number;
    termsVersionCounts: Record<string, number>;
    waiverVersionCounts: Record<string, number>;
  }>({
    totalAcceptances: 0,
    termsVersionCounts: {},
    waiverVersionCounts: {},
  });
  const [recentAcceptances, setRecentAcceptances] = useState<AcceptanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Document Reader Modal
  const [readerOpen, setReaderOpen] = useState<boolean>(false);
  const [readerTab, setReaderTab] = useState<'TERMS' | 'WAIVER'>('TERMS');

  // History Drawer Modal
  const [historyModalDoc, setHistoryModalDoc] = useState<'TERMS' | 'WAIVER' | null>(null);
  const [selectedHistoricalDoc, setSelectedHistoricalDoc] = useState<LegalDoc | null>(null);
  const [historySigners, setHistorySigners] = useState<AcceptanceRecord[]>([]);
  const [loadingHistorySigners, setLoadingHistorySigners] = useState<boolean>(false);
  const [viewingHistoricalText, setViewingHistoricalText] = useState<boolean>(false);

  // Signature Image Preview Modal
  const [previewSignatureImage, setPreviewSignatureImage] = useState<string | null>(null);

  // New Version / Edit Modal
  const [editorModalOpen, setEditorModalOpen] = useState<boolean>(false);
  const [editorType, setEditorType] = useState<'TERMS' | 'WAIVER'>('TERMS');
  const [editorVersion, setEditorVersion] = useState<string>('v1.1');
  const [editorTitle, setEditorTitle] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');
  const [editorNotes, setEditorNotes] = useState<string>('');
  const [editorEffectiveDate, setEditorEffectiveDate] = useState<string>('');
  const [publishing, setPublishing] = useState<boolean>(false);

  // Load legal agreements data
  const loadLegalData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/legal');
      const data = await res.json();
      if (data.success) {
        setTermsCurrent(data.termsCurrent || null);
        setWaiverCurrent(data.waiverCurrent || null);
        setTermsHistory(data.termsHistory || []);
        setWaiverHistory(data.waiverHistory || []);
        if (data.stats) setStats(data.stats);
        if (data.recentAcceptances) setRecentAcceptances(data.recentAcceptances);
      }
    } catch (err) {
      console.error('Failed to load legal documents:', err);
    }
  }, []);

  useEffect(() => {
    loadLegalData();
  }, [loadLegalData]);

  // Open Editor for Publishing New Version
  const handleOpenEditor = (type: 'TERMS' | 'WAIVER') => {
    const current = type === 'TERMS' ? termsCurrent : waiverCurrent;
    setEditorType(type);
    setEditorTitle(
      type === 'TERMS' ? 'Terms & Conditions' : 'Pet Care Waiver & Release of Liability'
    );
    setEditorContent(current?.content || '');

    // Calculate next version suggestion (e.g. v1.0 -> v1.1)
    const currentVer = current?.version || 'v1.0';
    const match = currentVer.match(/v?(\d+)\.(\d+)/);
    if (match) {
      const major = match[1];
      const minor = parseInt(match[2], 10) + 1;
      setEditorVersion(`v${major}.${minor}`);
    } else {
      setEditorVersion('v1.1');
    }

    setEditorNotes('');
    const now = new Date();
    setEditorEffectiveDate(
      now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    );
    setEditorModalOpen(true);
  };

  // Publish New Version
  const handlePublishVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorVersion.trim() || !editorContent.trim()) {
      setFeedback({ type: 'error', message: 'Version tag and content cannot be empty.' });
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch('/api/admin/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editorType,
          title: editorTitle,
          version: editorVersion.trim(),
          content: editorContent,
          changeNotes: editorNotes.trim(),
          effectiveDate: editorEffectiveDate.trim(),
          status: 'PUBLISHED',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: data.message || `Published ${editorTitle} ${editorVersion}!`,
        });
        setEditorModalOpen(false);
        await loadLegalData();
        setTimeout(() => setFeedback(null), 6000);
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to publish new version.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error while publishing legal agreement.' });
    } finally {
      setPublishing(false);
    }
  };

  // Open Version History Drawer
  const handleOpenHistory = async (type: 'TERMS' | 'WAIVER') => {
    setHistoryModalDoc(type);
    const historyList = type === 'TERMS' ? termsHistory : waiverHistory;
    const initialDoc = historyList[0] || (type === 'TERMS' ? termsCurrent : waiverCurrent);
    setSelectedHistoricalDoc(initialDoc);
    setViewingHistoricalText(false);

    if (initialDoc) {
      loadVersionSigners(initialDoc.id);
    }
  };

  const loadVersionSigners = async (docId: number) => {
    setLoadingHistorySigners(true);
    try {
      const res = await fetch(`/api/admin/legal/${docId}`);
      const data = await res.json();
      if (data.success && data.acceptances) {
        setHistorySigners(data.acceptances);
      } else {
        setHistorySigners([]);
      }
    } catch {
      setHistorySigners([]);
    } finally {
      setLoadingHistorySigners(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'September 1, 2026';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Filtered audit list based on search
  const filteredAcceptances = recentAcceptances.filter((rec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rec.signerLegalName.toLowerCase().includes(q) ||
      rec.customer?.email?.toLowerCase().includes(q) ||
      rec.booking?.reference?.toLowerCase().includes(q) ||
      rec.termsVersion.toLowerCase().includes(q) ||
      rec.waiverVersion.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.container}>
      {/* Header Info */}
      <div className={styles.headerSection}>
        <div>
          <h3 className={styles.headerTitle}>Legal Agreements &amp; Document Management</h3>
          <p className={styles.headerSubtitle}>
            Configure and maintain version-controlled legal documents for CoMo Pet Care. Every
            updated version is archived safely to preserve legal audit trails for past bookings.
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      {feedback && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: feedback.type === 'success' ? '#15803d' : '#b91c1c',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Document Cards Grid */}
      <div className={styles.cardsGrid}>
        {/* CARD A: TERMS & CONDITIONS */}
        <div className={styles.docCard}>
          <div className={styles.docCardHeader}>
            <div className={styles.docTitleGroup}>
              <div className={styles.docIconBadge}>
                <FileText size={22} />
              </div>
              <div>
                <h4 className={styles.docTitle}>Terms &amp; Conditions</h4>
                <p className={styles.docSubtitle}>63 sections • General service contract</p>
              </div>
            </div>
            <span className={styles.statusBadgePublished}>
              <CheckCircle2 size={12} /> Published
            </span>
          </div>

          <div className={styles.metadataList}>
            <div className={styles.metadataRow}>
              <span className={styles.metaLabel}>
                <Layers size={14} /> Current Version
              </span>
              <span className={styles.versionTag}>{termsCurrent?.version || 'v1.0'}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metaLabel}>
                <Calendar size={14} /> Last Updated
              </span>
              <span className={styles.metaValue}>
                {formatDate(termsCurrent?.publishedAt || termsCurrent?.updatedAt)}
              </span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metaLabel}>
                <UserCheck size={14} /> Customer Signatures
              </span>
              <span className={styles.metaValue}>
                {stats.termsVersionCounts[termsCurrent?.version || 'v1.0'] || 0} accepted
              </span>
            </div>
          </div>

          <div className={styles.cardActions}>
            <button
              type="button"
              className={styles.btnActionOutline}
              onClick={() => {
                setReaderTab('TERMS');
                setReaderOpen(true);
              }}
              title="View full document"
            >
              <Eye size={15} /> View
            </button>
            <button
              type="button"
              className={styles.btnActionSecondary}
              onClick={() => handleOpenHistory('TERMS')}
              title="View revision timeline & signers"
            >
              <History size={15} /> History ({termsHistory.length || 1})
            </button>
            <button
              type="button"
              className={styles.btnActionPrimary}
              onClick={() => handleOpenEditor('TERMS')}
              title="Create & publish new version without overwriting"
            >
              <Plus size={15} /> Publish New
            </button>
          </div>
        </div>

        {/* CARD B: PET CARE WAIVER */}
        <div className={styles.docCard}>
          <div className={styles.docCardHeader}>
            <div className={styles.docTitleGroup}>
              <div
                className={styles.docIconBadge}
                style={{ background: '#eff6ff', color: '#1d4ed8' }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className={styles.docTitle}>Pet Care Waiver &amp; Release</h4>
                <p className={styles.docSubtitle}>35 sections • Liability &amp; vet release</p>
              </div>
            </div>
            <span className={styles.statusBadgePublished}>
              <CheckCircle2 size={12} /> Published
            </span>
          </div>

          <div className={styles.metadataList}>
            <div className={styles.metadataRow}>
              <span className={styles.metaLabel}>
                <Layers size={14} /> Current Version
              </span>
              <span className={styles.versionTag}>{waiverCurrent?.version || 'v1.0'}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metaLabel}>
                <Calendar size={14} /> Last Updated
              </span>
              <span className={styles.metaValue}>
                {formatDate(waiverCurrent?.publishedAt || waiverCurrent?.updatedAt)}
              </span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metaLabel}>
                <UserCheck size={14} /> Customer Signatures
              </span>
              <span className={styles.metaValue}>
                {stats.waiverVersionCounts[waiverCurrent?.version || 'v1.0'] || 0} accepted
              </span>
            </div>
          </div>

          <div className={styles.cardActions}>
            <button
              type="button"
              className={styles.btnActionOutline}
              onClick={() => {
                setReaderTab('WAIVER');
                setReaderOpen(true);
              }}
              title="View full document"
            >
              <Eye size={15} /> View
            </button>
            <button
              type="button"
              className={styles.btnActionSecondary}
              onClick={() => handleOpenHistory('WAIVER')}
              title="View revision timeline & signers"
            >
              <History size={15} /> History ({waiverHistory.length || 1})
            </button>
            <button
              type="button"
              className={styles.btnActionPrimary}
              onClick={() => handleOpenEditor('WAIVER')}
              title="Create & publish new version without overwriting"
            >
              <Plus size={15} /> Publish New
            </button>
          </div>
        </div>
      </div>

      {/* Customer Acceptances & Electronic Signatures Audit Trail Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          marginTop: '0.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Customer Agreement Acceptances &amp; Signature Logs
            </h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Real-time audit log of electronically executed Terms &amp; Conditions and Pet Care
              Waivers.
            </p>
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                placeholder="Search signers, emails, refs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                backgroundColor: '#ecfdf5',
                color: '#047857',
                padding: '0.4rem 0.75rem',
                borderRadius: '9999px',
                whiteSpace: 'nowrap',
              }}
            >
              {stats.totalAcceptances} Total Records
            </span>
          </div>
        </div>

        {filteredAcceptances.length === 0 ? (
          <div
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.9rem',
            }}
          >
            {searchQuery
              ? `No records found matching "${searchQuery}".`
              : 'No customer acceptances recorded yet. New customer checkout agreements will appear here automatically.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Booking Ref</th>
                  <th>Signed Legal Name</th>
                  <th>Terms Version</th>
                  <th>Waiver Version</th>
                  <th>Signature</th>
                  <th>Date &amp; Time</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredAcceptances.map((rec) => (
                  <tr key={rec.id}>
                    <td>
                      <strong>
                        {rec.customer
                          ? `${rec.customer.firstName} ${rec.customer.lastName}`
                          : rec.signerLegalName}
                      </strong>
                      {rec.customer?.email && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {rec.customer.email}
                        </div>
                      )}
                    </td>
                    <td>
                      {rec.booking?.reference ? (
                        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {rec.booking.reference}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Direct / Profile</span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: '#059669', fontWeight: 600 }}>
                        {rec.signerLegalName}
                      </span>
                    </td>
                    <td>
                      <span className={styles.versionTag}>{rec.termsVersion}</span>
                    </td>
                    <td>
                      <span className={styles.versionTag}>{rec.waiverVersion}</span>
                    </td>
                    <td>
                      {rec.signatureImage ? (
                        <button
                          type="button"
                          onClick={() => setPreviewSignatureImage(rec.signatureImage || null)}
                          style={{
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            color: '#059669',
                            fontWeight: 600,
                          }}
                        >
                          View Sig
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Typed</span>
                      )}
                    </td>
                    <td>
                      {new Date(rec.acceptedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                        {rec.ipAddress || '127.0.0.1'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Document Reader Modal */}
      <LegalDocumentModal
        isOpen={readerOpen}
        initialTab={readerTab}
        onClose={() => setReaderOpen(false)}
      />

      {/* MODAL 2: Signature Preview Modal */}
      {previewSignatureImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
          onClick={() => setPreviewSignatureImage(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '450px',
              width: '100%',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#0f172a' }}>
              Electronic Signature Capture
            </h4>
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                marginBottom: '1rem',
              }}
            >
              <img
                src={previewSignatureImage}
                alt="Customer Electronic Signature"
                style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain' }}
              />
            </div>
            <button
              type="button"
              className={styles.btnActionPrimary}
              onClick={() => setPreviewSignatureImage(null)}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Version History & Signers Drawer */}
      {historyModalDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setHistoryModalDoc(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '880px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  {historyModalDoc === 'TERMS' ? 'Terms & Conditions' : 'Pet Care Waiver'} Version
                  History
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Immutable audit records of all published revisions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalDoc(null)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div
              style={{
                padding: '1.5rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {/* Revision List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(historyModalDoc === 'TERMS' ? termsHistory : waiverHistory).map((ver) => (
                  <div
                    key={ver.id}
                    style={{
                      border:
                        selectedHistoricalDoc?.id === ver.id
                          ? '2px solid #059669'
                          : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '1rem 1.25rem',
                      backgroundColor:
                        selectedHistoricalDoc?.id === ver.id ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedHistoricalDoc(ver);
                      setViewingHistoricalText(false);
                      loadVersionSigners(ver.id);
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={styles.versionTag}>{ver.version}</span>
                        <span
                          className={
                            ver.status === 'PUBLISHED'
                              ? styles.statusBadgePublished
                              : styles.statusBadgeArchived
                          }
                        >
                          {ver.status}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        Published: {formatDate(ver.publishedAt || ver.createdAt)}
                      </span>
                    </div>
                    {ver.changeNotes && (
                      <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.84rem', color: '#475569' }}>
                        <strong>Change Notes:</strong> {ver.changeNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Version Controls */}
              {selectedHistoricalDoc && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: '#0f172a',
                      }}
                    >
                      Version {selectedHistoricalDoc.version} Details
                    </h4>
                    <button
                      type="button"
                      className={styles.btnActionSecondary}
                      onClick={() => setViewingHistoricalText(!viewingHistoricalText)}
                    >
                      <Eye size={14} />{' '}
                      {viewingHistoricalText ? 'Hide Document Text' : 'View Full Document Text'}
                    </button>
                  </div>

                  {viewingHistoricalText ? (
                    <div
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        maxHeight: '400px',
                        overflowY: 'auto',
                      }}
                    >
                      <LegalDocumentViewer
                        content={selectedHistoricalDoc.content}
                        title={`${selectedHistoricalDoc.title} (${selectedHistoricalDoc.version})`}
                        version={selectedHistoricalDoc.version}
                        effectiveDate={selectedHistoricalDoc.effectiveDate}
                        showTableOfContents={false}
                      />
                    </div>
                  ) : loadingHistorySigners ? (
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Loading signers...</p>
                  ) : historySigners.length === 0 ? (
                    <div
                      style={{
                        padding: '1.25rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        color: '#64748b',
                        textAlign: 'center',
                      }}
                    >
                      No customer bookings currently tied to this version.
                    </div>
                  ) : (
                    <table className={styles.historyTable}>
                      <thead>
                        <tr>
                          <th>Signer</th>
                          <th>Booking</th>
                          <th>Signed Date</th>
                          <th>IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historySigners.map((sig) => (
                          <tr key={sig.id}>
                            <td>
                              <strong>{sig.signerLegalName}</strong>
                              {sig.customer?.email && (
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  {sig.customer.email}
                                </div>
                              )}
                            </td>
                            <td>{sig.booking?.reference || 'Direct'}</td>
                            <td>{formatDate(sig.acceptedAt)}</td>
                            <td>{sig.ipAddress || '127.0.0.1'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: New Version Publisher / Editor Modal */}
      {editorModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setEditorModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  Publish New Version of{' '}
                  {editorType === 'TERMS' ? 'Terms & Conditions' : 'Pet Care Waiver'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  The previous version will be safely archived without affecting existing signed
                  records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditorModalOpen(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form
              onSubmit={handlePublishVersion}
              style={{
                padding: '1.5rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <label
                    style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}
                  >
                    New Version Identifier *
                  </label>
                  <input
                    type="text"
                    className={styles.editorInput}
                    value={editorVersion}
                    onChange={(e) => setEditorVersion(e.target.value)}
                    placeholder="e.g. v1.1"
                    required
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}
                  >
                    Effective Date
                  </label>
                  <input
                    type="text"
                    className={styles.editorInput}
                    value={editorEffectiveDate}
                    onChange={(e) => setEditorEffectiveDate(e.target.value)}
                    placeholder="e.g. September 1, 2026"
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}
                  >
                    Optional Update Note
                  </label>
                  <input
                    type="text"
                    className={styles.editorInput}
                    value={editorNotes}
                    onChange={(e) => setEditorNotes(e.target.value)}
                    placeholder="e.g. Updated holiday surcharge clause"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                  Full Legal Agreement Text (Markdown supported) *
                </label>
                <textarea
                  className={styles.editorTextarea}
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  required
                />
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  marginTop: '0.5rem',
                }}
              >
                <button
                  type="button"
                  className={styles.btnActionSecondary}
                  onClick={() => setEditorModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnActionPrimary}
                  disabled={publishing}
                >
                  {publishing ? 'Publishing...' : `Publish ${editorVersion}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
