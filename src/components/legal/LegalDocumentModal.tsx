'use client';

import React, { useState, useEffect } from 'react';
import styles from './LegalDocumentModal.module.css';
import {
  FileText,
  ShieldCheck,
  Printer,
  ExternalLink,
  X,
  Search,
  BookOpen,
} from 'lucide-react';
import {
  DEFAULT_TERMS_AND_CONDITIONS,
  DEFAULT_PET_CARE_WAIVER,
} from '@/lib/legal-defaults';

import LegalDocumentViewer from './LegalDocumentViewer';

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'TERMS' | 'WAIVER';
}

export default function LegalDocumentModal({
  isOpen,
  onClose,
  initialTab = 'TERMS',
}: LegalDocumentModalProps) {
  const [activeTab, setActiveTab] = useState<'TERMS' | 'WAIVER'>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [termsData, setTermsData] = useState<{
    version: string;
    effectiveDate: string;
    content: string;
  }>({
    version: 'v1.0',
    effectiveDate: 'September 1, 2026',
    content: DEFAULT_TERMS_AND_CONDITIONS,
  });

  const [waiverData, setWaiverData] = useState<{
    version: string;
    effectiveDate: string;
    content: string;
  }>({
    version: 'v1.0',
    effectiveDate: 'September 1, 2026',
    content: DEFAULT_PET_CARE_WAIVER,
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Fetch latest active published documents
      fetch('/api/legal')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.terms) {
              setTermsData({
                version: data.terms.version || 'v1.0',
                effectiveDate: data.terms.effectiveDate || 'September 1, 2026',
                content: data.terms.content || DEFAULT_TERMS_AND_CONDITIONS,
              });
            }
            if (data.waiver) {
              setWaiverData({
                version: data.waiver.version || 'v1.0',
                effectiveDate: data.waiver.effectiveDate || 'September 1, 2026',
                content: data.waiver.content || DEFAULT_PET_CARE_WAIVER,
              });
            }
          }
        })
        .catch(() => {
          // Fallback to local defaults
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDoc = activeTab === 'TERMS' ? termsData : waiverData;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeTab === 'TERMS' ? 'Terms & Conditions' : 'Pet Care Waiver'} - CoMo Pet Care</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; padding: 40px; color: #111; }
            h1, h2, h3 { color: #0f172a; }
            h1 { font-size: 22px; border-bottom: 2px solid #059669; padding-bottom: 8px; }
            h2 { font-size: 18px; margin-top: 20px; }
            h3 { font-size: 15px; margin-top: 18px; }
            p, li { font-size: 13px; }
            .header-info { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; margin-bottom: 20px; border-radius: 6px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header-info">
            <strong>Dekrell Studios d/b/a CoMo Pet Care</strong> | Columbia, Missouri<br/>
            <strong>Document:</strong> ${activeTab === 'TERMS' ? 'Terms & Conditions' : 'Pet Care Waiver & Release of Liability'}<br/>
            <strong>Version:</strong> ${currentDoc.version} | <strong>Effective Date:</strong> ${currentDoc.effectiveDate}
          </div>
          <div>
            ${currentDoc.content.replace(/\n/g, '<br/>')}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <ShieldCheck size={22} />
            </div>
            <div className={styles.titleArea}>
              <h2 className={styles.modalTitle}>CoMo Pet Care Legal Agreements</h2>
              <p className={styles.modalSubtitle}>
                Dekrell Studios d/b/a CoMo Pet Care • Columbia, MO
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handlePrint}
              title="Print document"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>
            <a
              href={activeTab === 'TERMS' ? '/terms' : '/waiver'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtn}
              title="Open standalone page in new tab"
            >
              <ExternalLink size={15} />
              <span>New Tab</span>
            </a>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabsNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'TERMS' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('TERMS')}
          >
            <FileText size={16} />
            <span>Terms &amp; Conditions (63 Sections)</span>
            <span className={styles.versionBadge}>{termsData.version}</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'WAIVER' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('WAIVER')}
          >
            <ShieldCheck size={16} />
            <span>Pet Care Waiver &amp; Release (35 Sections)</span>
            <span className={styles.versionBadge}>{waiverData.version}</span>
          </button>
        </div>

        {/* Fixed Search Subheader (Outside scrollable body) */}
        <div className={styles.searchSubHeader}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search clauses, refunds, waivers, terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>

          <div className={styles.statsBadge}>
            <BookOpen size={14} />
            <span>{activeTab === 'TERMS' ? '63 Clauses' : '35 Clauses'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <LegalDocumentViewer
            content={currentDoc.content}
            title={activeTab === 'TERMS' ? 'Terms & Conditions (63 Sections)' : 'Pet Care Waiver & Release (35 Sections)'}
            version={currentDoc.version}
            effectiveDate={currentDoc.effectiveDate}
            showTableOfContents={false}
            inModal={true}
            hideToolbar={true}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerNote}>
            Reviewing active published version {currentDoc.version}. Applicable to all CoMo Pet Care
            service bookings.
          </div>
          <button type="button" className={styles.footerBtn} onClick={onClose}>
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
